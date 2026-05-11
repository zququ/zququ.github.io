---
title: AI Agent 工程综述：从 Function Calling、MCP 到 A2A 与 ReAct
date: 2026-05-11 16:10:00
tags:
  - AI
  - Agent
  - LLM
  - MCP
  - Function Calling
comments: true
---

Agent 不是一个新的模型名字，而是一种把大语言模型放进工程闭环里的系统形态。单独的 LLM 更像一个无状态的文本函数：输入 prompt，输出文本。Agent 则在 LLM 外面接上工具、记忆、任务状态、控制循环和安全边界，让模型不只回答“应该怎么做”，还可以在受控环境里完成“查、算、写、改、发起审批、返回结果”这一类多步任务。

这也是为什么 2025 年以后开发岗面试越来越喜欢追问 Agent。只会说“Agent = LLM + 工具”还不够，真正需要讲清楚的是：工具调用到底由谁执行，MCP 和 Function Calling 的边界在哪里，A2A 解决的不是工具接入而是 Agent 间协作，ReAct 为什么容易死循环，RAG 在 Agent 里到底是什么位置，以及生产环境如何做权限、审计、回滚和降级。

## 1. LLM 和 Agent：文本生成与任务执行的差异

LLM 的核心能力是根据上下文预测和生成后续 token。它可以解释规则、生成代码、分析材料，也可以在上下文窗口内做推理。但如果没有外部系统配合，它不会自己访问实时天气、不会写入数据库、不会删除日历，也不会在下次会话天然记得用户偏好。

Agent 在 LLM 之外增加四类工程组件：

| 模块 | 作用 | 典型实现 |
| --- | --- | --- |
| LLM | 理解意图、选择动作、总结结果 | 通用模型或垂直模型 |
| 规划与控制 | 拆解任务、决定下一步、判断停止条件 | ReAct loop、状态机、工作流编排 |
| 工具 | 连接外部世界 | API、数据库、代码执行器、MCP Server |
| 记忆与状态 | 保存上下文、用户偏好、任务中间结果 | context window、Redis、SQL、向量库 |

一个简单例子能说明差异。用户说：“帮我查明天北京天气，如果下雨就取消明早 7 点的跑步计划。”LLM 直接回答时，通常会告诉用户“你可以打开天气 App 和日历 App 检查”。Agent 的行为则是：调用天气工具，得到明天北京有雨；调用日历工具，找到明早 7 点跑步计划；在满足规则后调用日历删除或取消接口；最后返回“明天北京有雨，已取消跑步计划”。

所以关键不是模型有没有“想法”，而是系统有没有给它一个受控的执行回路。LLM 负责推理和生成，Agent 系统负责把推理转成可验证、可审计、可回滚的动作。

## 2. Agent 和 Workflow：谁控制流程

Workflow 和 Agent 最核心的区别是控制权。Workflow 的流程由代码预先定义，LLM 只是某些节点上的智能处理器；Agent 的下一步动作更多由 LLM 在运行时根据目标、状态和观察结果决定。

退款处理是一个典型例子。Workflow 会写成固定链路：接收申请、抽取订单号、查询订单、判断政策、执行退款或生成拒绝邮件、发送通知。每个分支和步骤顺序都由开发者控制。Agent 则更像接到“处理这个退款”目标后，自主决定先读工单、再查订单、再查特殊政策、必要时发起主管审批。

| 维度 | Workflow | Agent |
| --- | --- | --- |
| 控制者 | 代码和规则 | LLM 加控制循环 |
| 可预测性 | 高 | 中到低 |
| 灵活性 | 低到中 | 高 |
| 成本 | 较低 | 较高 |
| 调试 | 容易复现 | 需要 trace 和状态记录 |
| 适合场景 | 固定流程、强合规、批处理 | 开放任务、异常处理、研究分析 |

生产系统里最常见的不是二选一，而是混合架构。稳定主流程用 Workflow 托底，复杂分支、非结构化信息处理、异常补救交给 Agent。这样可以避免把所有控制权都交给模型，也能在规则无法穷举的场景里保留弹性。

## 3. Function Calling：模型给出调用意图，应用代码负责执行

Function Calling，也常被叫作 tool calling，解决的是“LLM 如何以结构化形式请求外部能力”。OpenAI 的文档把 tool calling 描述为一个多步对话：应用把可用工具定义发给模型，模型返回 tool call，应用侧执行代码，再把工具输出交回模型，模型继续生成最终响应或继续请求工具 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这句话里最重要的是：LLM 不直接执行函数。它输出的是“我要调用什么工具、参数是什么”的结构化意图，真正执行的是应用程序。一个最小流程如下：

```text
用户请求
  -> 应用把工具 schema 和消息发给模型
  -> 模型返回 tool_call: get_weather({ city: "北京" })
  -> 应用校验工具名和参数
  -> 应用调用真实天气 API
  -> 应用把工具结果返回给模型
  -> 模型生成最终回答
```

这比“prompt 里要求模型输出 JSON，然后用正则解析”可靠得多，因为工具名、参数 schema、是否允许并行调用、是否强制调用都可以通过 API 参数表达。模型仍可能给出错误参数或选择不合适工具，所以应用层必须做工具白名单、参数校验、超时、重试和权限检查。

并行 Function Calling 则是进一步的性能优化。模型在同一轮里可能同时请求多个彼此无依赖的工具，例如天气、日历和交通信息。应用侧可以并发执行这些调用，把总延迟从 `T1 + T2 + T3` 降到接近 `max(T1, T2, T3)`。但只要工具之间有数据依赖，例如必须先查订单再退款，就应该串行执行。

## 4. ReAct：推理和行动交替的经典循环

ReAct 来自 Yao 等人的工作，核心思想是让语言模型交替生成 reasoning trace 和 task-specific action；推理帮助模型跟踪计划和处理异常，行动让模型能访问外部环境或知识源 <sup class="citation">[<a href="#ref-2">2</a>]</sup>。工程上常见的 ReAct loop 可以抽象为：

```text
Thought -> Action -> Observation -> Thought -> ... -> Final Answer
```

例如：

```text
Thought: 用户要知道北京明天天气，需要调用天气工具。
Action: get_weather(city="北京", date="明天")
Observation: {"weather":"中雨","temperature":"14-20C"}
Thought: 已得到天气结果，可以给出建议。
Final Answer: 明天北京有中雨，气温 14-20C，建议带伞。
```

ReAct 的优点是透明、通用、能根据工具返回结果动态调整。缺点也明显：每一步都要调用模型，token 和延迟都高；工具失败时可能重复尝试；如果没有停止条件，容易陷入循环。

生产里防 ReAct 死循环通常要做四件事：

1. 最大步数限制，例如 10 到 20 步，超过后强制总结已有信息。
2. 重复动作检测，例如连续多次调用同一工具且参数相同就停止。
3. 工具级超时和任务级超时，避免外部服务卡住整个任务。
4. 明确失败策略，工具失败后可以换工具、降级回答或转人工，而不是盲目重试。

ReAct 不是唯一模式。Plan-and-Execute 先生成全局计划再逐步执行，适合目标清楚但步骤较长的任务；Reflection 让生成器和审查器反复迭代，适合代码、法律文书、论文这类高质量输出；Multi-Agent 把研究、编码、审查、协调拆给不同 Agent，适合天然需要专业分工或并行处理的任务。工程上要克制使用 Multi-Agent，因为多个简单 Agent 的通信、状态和调试成本经常超过一个强单 Agent。

## 5. MCP：把工具接入从 N x M 变成 N + M

Function Calling 解决的是模型如何请求调用。MCP 解决的是工具如何标准化暴露给不同 AI 应用。没有 MCP 时，每个 AI 应用都要为每个外部系统单独写适配：10 个应用接 20 个工具，可能就是 200 套集成。MCP 的思路是让应用接入统一协议，让工具方实现 MCP Server，从而把复杂度压到应用数加工具数。

MCP 采用 client-host-server 架构：Host 是承载 AI 能力的应用，Client 由 Host 创建并维护到某个 Server 的隔离连接，Server 负责暴露资源、工具和提示词模板 <sup class="citation">[<a href="#ref-3">3</a>]</sup>。MCP 基于 JSON-RPC；当前标准传输包括 stdio 和 Streamable HTTP，后者替代了早期 HTTP+SSE 传输，同时仍可兼容旧实现 <sup class="citation">[<a href="#ref-4">4</a>]</sup>。

MCP Server 能暴露三类主要能力：

| 能力 | 含义 | 例子 |
| --- | --- | --- |
| Tools | 可执行动作 | 查数据库、发消息、创建 issue、运行计算 |
| Resources | 可读上下文 | 文件、数据库 schema、项目文档、应用状态 |
| Prompts | 可复用提示模板 | 代码审查模板、报告生成模板 |

MCP 的工具发现机制是关键。Client 通过 `tools/list` 获取工具名、描述、输入 schema；模型选择后，Client 通过 `tools/call` 调用工具 <sup class="citation">[<a href="#ref-5">5</a>]</sup>。这意味着今天接入 GitHub MCP Server，明天应用就可以发现并使用 GitHub 相关能力，而不必在业务代码里重新手写一套工具 schema。

但 MCP 不是安全魔法。MCP Server 仍然是外部能力入口，必须做输入校验、访问控制、限流、输出清洗和审计。MCP 规范也强调敏感操作应有人类确认，客户端要向用户展示工具调用，并在把工具结果交给模型前做必要校验 <sup class="citation">[<a href="#ref-5">5</a>]</sup>。

## 6. Skills：把领域方法论按需注入上下文

工具只解决“能做什么”，不能解决“应该按什么标准做”。代码审查、临床文献综述、SQL 优化、客服回复、合规审查都有自己的流程和判断标准。Skills 适合编码这类领域经验。

OpenAI Codex 的 Skills 文档把 skill 定义为包含 `SKILL.md` 以及可选脚本、参考资料、资源的目录，用来为 Codex 扩展任务特定能力和工作流；它采用 progressive disclosure，先只暴露名称、描述和路径，只有决定使用该 skill 时才加载完整说明 <sup class="citation">[<a href="#ref-6">6</a>]</sup>。

这和 System Prompt 的区别很大：

| 维度 | System Prompt | Skill |
| --- | --- | --- |
| 生效范围 | 全局 | 按任务触发 |
| 内容 | 通用行为约束 | 特定领域流程和标准 |
| 上下文成本 | 每次都占用 | 需要时加载 |
| 维护方式 | 容易越写越大 | 模块化拆分 |

一个代码审查 Skill 通常会包含身份定位、审查维度、安全优先级、允许使用的工具、输出格式和失败处理。它不是 few-shot 示例。Few-shot 主要教模型模仿格式，Skill 更像岗位操作手册，告诉 Agent 这个任务应该按什么方法论完成。

Function Calling、MCP 和 Skills 可以这样分工：

```text
Skills 决定怎么想
MCP 决定有哪些标准化能力可以用
Function Calling 决定某一次调用如何发起和返回
```

例如“审查 agent.py”：Skill 告诉 Agent 要按安全、性能、可维护性检查；MCP 暴露 filesystem、linter、test runner；Function Calling 负责发起 `read_file`、`run_linter`、`run_tests` 这些具体调用。

## 7. A2A：Agent 之间的横向协作协议

MCP 连接的是 Agent 和工具；A2A 连接的是 Agent 和 Agent。A2A 最新规范把它定义为促进独立、可能不透明的 AI agent 系统之间通信和互操作的开放标准，目标包括能力发现、交互模态协商、协作任务管理，以及在不暴露内部状态、记忆或工具实现的前提下安全交换信息 <sup class="citation">[<a href="#ref-7">7</a>]</sup>。

A2A 的核心对象包括：

| 对象 | 作用 |
| --- | --- |
| Agent Card | 描述 Agent 身份、能力、skills、接口和认证方式 |
| Message | 客户端和远程 Agent 之间的一轮交流 |
| Task | A2A 管理的基本工作单元，有 ID 和生命周期 |
| Artifact | Agent 为任务生成的结果，如文档、图片、结构化数据 |
| Part | Message 或 Artifact 中的最小内容单元 |

Agent Card 是发现机制的基础。规范注册了 `.well-known/agent-card.json` 作为标准发现位置，用于返回 Agent 的能力、协议、认证要求和技能信息 <sup class="citation">[<a href="#ref-8">8</a>]</sup>。A2A v1.0 还明确支持多种协议绑定，包括 JSON-RPC、gRPC、HTTP+JSON/REST，并通过版本和扩展机制维护互操作 <sup class="citation">[<a href="#ref-7">7</a>]</sup>。

A2A 和 MCP 是互补关系，不是替代关系。A2A 规范自己的表述很清楚：MCP 关注 Agent 如何连接工具、API、数据源等外部资源；A2A 关注独立 Agent 如何作为对等系统发现彼此、委托任务、交换上下文和结果 <sup class="citation">[<a href="#ref-9">9</a>]</sup>。一个编排 Agent 可以通过 A2A 把“调研竞品”委托给 Research Agent，而 Research Agent 内部再通过 MCP 调搜索、文档库和数据库工具。

## 8. 记忆系统：上下文窗口不是长期记忆

Agent 的记忆可以分成两层。

第一层是上下文窗口里的 working memory，包含当前对话、任务目标、已调用工具、工具返回、中间结论和当前状态。它速度最快，但容量有限，也最容易被上下文污染。

第二层是外部记忆，包括：

| 存储 | 适合保存 | 查询方式 |
| --- | --- | --- |
| 向量数据库 | 用户偏好、历史经验、非结构化知识 | 语义检索 |
| 关系数据库 | 用户档案、订单、权限、业务对象 | 精确查询 |
| KV/Redis | 会话状态、任务进度、短期缓存 | 低延迟读写 |
| 对象存储 | 文件、长报告、附件 | URI 引用 |

上下文快满时，常见策略有滑动窗口、摘要压缩和重要性过滤。工程上不能只靠“把旧对话总结一下”，还要区分哪些信息可丢、哪些必须保留。例如用户的明确约束、关键决策、工具执行结果、审批记录和失败原因通常要保留；中间推理碎片、重复日志、长列表可以压缩或外置。

记忆读写也要有时机。任务开始时读取用户偏好、项目背景和相关历史；任务执行中保存状态和中间结果；任务结束后归档最终结果、失败原因和可复用经验。否则记忆系统会变成噪声仓库，检索回来反而污染判断。

## 9. RAG 与 Agent：知识检索工具，而不是同一层概念

RAG 最初解决的是大模型参数知识难以精确访问、溯源和更新的问题。Lewis 等人的 RAG 工作把参数化生成模型和非参数化外部知识索引结合起来，用检索结果增强生成，在知识密集型任务中提升事实性和具体性 <sup class="citation">[<a href="#ref-10">10</a>]</sup>。

普通 RAG 的流程通常是固定的：

```text
用户问题 -> 检索相关文档 -> 拼入上下文 -> 生成答案
```

Agent 的流程是动态的：

```text
理解目标 -> 判断需要什么 -> 可能检索、可能调用 API、可能计算、可能写入系统 -> 观察结果 -> 决定下一步
```

所以更准确的关系是：RAG 是 Agent 工具箱里的知识查询器。Agent 判断需要知识时调用 RAG；判断需要操作时调用业务 API；判断需要计算时调用代码执行器。Agentic RAG 则进一步让 Agent 决定检索哪些数据源、是否重写 query、是否需要二次检索、检索结果是否足够回答问题。

## 10. 安全与可靠性：Agent 系统的工程底线

Agent 的风险来自两条线：模型可能选错动作，外部输入可能诱导模型越权。典型威胁包括 Prompt Injection、权限越界、敏感数据泄露、资源滥用、工具输出污染和不可恢复的副作用。

安全设计的第一原则是最小权限。只读任务只给读工具，不给写工具；测试环境和生产环境使用不同凭证；高风险 API 拆分成“生成计划”和“执行动作”两步；数据库工具默认禁止 `DELETE`、`DROP`、大范围 `UPDATE`，除非经过额外审批。

第二原则是 Human in the Loop。删除数据、发外部邮件、转账、改权限、发布生产变更这类操作，不应该让 Agent 静默执行。合理流程是 Agent 生成结构化操作计划，展示影响范围、目标对象和回滚方式，用户确认后再调用工具。

第三原则是可观测性。每次任务至少要记录：

1. 用户目标和系统约束。
2. 加载了哪些 tools、skills、memory。
3. 每次工具调用的名称、参数摘要、耗时和结果摘要。
4. 失败、重试、降级、人工审批记录。
5. token、成本、延迟和模型版本。

第四原则是可靠性控制。工具调用要有超时，重试要有上限和退避，写操作要尽量幂等，关键修改要支持回滚或补偿。外部工具返回超大结果时要分页、截断或摘要，不要把整个数据库结果塞回上下文窗口。

Prompt Injection 的防御要落到实现细节：外部网页、邮件、文档内容必须被标记为不可信数据；系统指令和用户/外部数据要结构化隔离；工具输出进入模型前要做脱敏和格式化；模型不能因为检索到“忽略之前指令”就获得新权限。

## 11. 一个可落地的企业级 Agent 架构

如果面试里让设计一个企业级 Agent 系统，可以按五层回答：

| 层 | 关键设计 |
| --- | --- |
| 接入层 | 用户身份、租户隔离、任务入口、审批 UI |
| 编排层 | Workflow 骨架、Agent loop、状态机、最大步数 |
| 能力层 | Function Calling、MCP Server、RAG、代码执行、业务 API |
| 记忆层 | 会话状态、长期偏好、向量检索、结构化业务数据 |
| 治理层 | 权限、审计、trace、评测、成本控制、安全策略 |

成本优化也要体系化。简单任务走 Workflow，不启动 Agent；工具列表按任务动态加载，避免几十个工具 schema 全部进上下文；历史对话做摘要和裁剪；工具结果缓存；简单分类和抽取用小模型，复杂规划和最终综合再用强模型；对高频 prompt 使用缓存机制。

真正的 Agent 工程不是把 LLM 接几个函数就结束，而是把“不确定的模型行为”放进“确定的工程约束”里。模型可以决定下一步想做什么，但系统必须决定它能不能做、怎么做、出错如何停、结果如何审计、用户如何撤销。

## 12. 面试中最容易被追问的判断点

**Function Calling 和 MCP 的区别是什么？** Function Calling 是一次模型到应用的工具调用表达方式；MCP 是工具服务暴露、发现和调用的标准协议。Function Calling 更靠近模型 API，MCP 更靠近工具生态集成。

**MCP 和 A2A 的关系是什么？** MCP 是 Agent 到工具，A2A 是 Agent 到 Agent。前者解决纵向能力接入，后者解决横向任务委托和协作。

**Agent 和 Workflow 怎么选？** 固定、强合规、可枚举流程优先 Workflow；开放、动态、非结构化、多步探索任务可以用 Agent；生产里常用 Workflow 托底、Agent 处理复杂分支。

**ReAct 为什么会死循环？** 因为模型可能在工具失败或观察结果不充分时重复选择同一动作。解决靠最大步数、重复动作检测、超时、失败降级和人工接管。

**RAG 是不是 Agent？** 不是。RAG 是检索增强生成流程，通常是 Agent 的一个知识工具。Agentic RAG 是把检索策略也交给 Agent 动态决策。

**Agent 的安全核心是什么？** 最小权限、数据/指令隔离、工具调用审批、审计 trace、幂等与回滚。不要让模型绕过应用层直接操作系统或生产数据。

## 结语

Agent 的核心演进方向不是“模型更会聊天”，而是“模型能在边界清楚的系统里完成任务”。Function Calling 把自然语言意图变成结构化调用；MCP 把工具能力标准化暴露；Skills 把领域方法论按需注入；A2A 把独立 Agent 之间的委托和协作标准化；RAG 和记忆系统补上知识与状态；安全、审计和成本控制决定它能不能进生产。

面试时如果能把这些层次串起来，就不会停留在“Agent = LLM + 工具”的表面答案。更重要的是，做真实项目时也会自然地问出正确的问题：流程是否需要模型控制？工具是否可回滚？权限是否最小？上下文是否污染？失败后是否能停？这些问题决定 Agent 是 demo，还是可以长期运行的工程系统。

## 参考资料

<span id="ref-1" class="ref-label">[1]</span> OpenAI. Function calling. https://developers.openai.com/api/docs/guides/function-calling

<span id="ref-2" class="ref-label">[2]</span> Yao S, Zhao J, Yu D, et al. ReAct: Synergizing Reasoning and Acting in Language Models. ICLR 2023. https://collaborate.princeton.edu/en/publications/react-synergizing-reasoning-and-acting-in-language-models/

<span id="ref-3" class="ref-label">[3]</span> Model Context Protocol. Architecture. https://modelcontextprotocol.io/specification/2025-06-18/architecture

<span id="ref-4" class="ref-label">[4]</span> Model Context Protocol. Transports. https://modelcontextprotocol.io/specification/2025-06-18/basic/transports

<span id="ref-5" class="ref-label">[5]</span> Model Context Protocol. Tools. https://modelcontextprotocol.io/specification/2025-06-18/server/tools

<span id="ref-6" class="ref-label">[6]</span> OpenAI. Agent Skills. https://developers.openai.com/codex/skills

<span id="ref-7" class="ref-label">[7]</span> A2A Protocol. Agent2Agent Protocol Specification, latest released version 1.0.0. https://a2a-protocol.org/latest/specification/

<span id="ref-8" class="ref-label">[8]</span> A2A Protocol. Agent Card well-known URI registration. https://a2a-protocol.org/latest/specification/

<span id="ref-9" class="ref-label">[9]</span> A2A Protocol. Relationship to MCP. https://a2a-protocol.org/latest/specification/

<span id="ref-10" class="ref-label">[10]</span> Lewis P, Perez E, Piktus A, et al. Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 2020. https://papers.neurips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html
