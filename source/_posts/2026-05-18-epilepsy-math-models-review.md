---
title: 癫痫术前评估中的数学模型：Epileptor、VEP、NMM 与推断算法
date: 2026-05-18 19:30:00
tags:
  - SEEG
  - VEP
  - 数学模型
  - 癫痫
  - MathJax
comments: true
---

这篇单独总结“模型”本身：Epileptor、neural mass model、VEP、Bayesian VEP、graph / FC model、DeepEZ 这类方法到底各自解决什么问题，MAP、MCMC、HMC、NUTS、VI、ADVI、SBI 这些算法又在模型里扮演什么角色。

先给总纲：**癫痫术前评估里的数学模型不是一个单独算法，而是一条从观测数据到临床假设的链条。** 原始数据来自 MRI、DWI/DTI、SEEG、EEG、MEG、fMRI 或术后结局；模型把这些数据组织成“脑区状态、连接、兴奋性、传播和观测噪声”；推断算法再反过来估计哪些脑区更可能属于 epileptogenic zone network（EZN），以及这个判断有多不确定。

本文的插图优先使用已经整理过、能确认开放许可或公开 OA 口径的论文原图。Epileptor 等部分经典论文的原图如果未能确认可直接复用，就只保留文字、公式和引用，不把截图硬塞进公开博客。

## 1. 先分清三件事：模型、推断、评价

很多文章会把 “NUTS、ADVI、VEP、Epileptor、GCN” 放在一起讲，但它们不是同一层东西。

| 层次 | 代表方法 | 回答的问题 | 输出 |
| --- | --- | --- | --- |
| 机制模型 | Epileptor、NMM、neural field、slow-fast bifurcation model | 发作如何起始、传播、终止？ | 状态变量、阈值、兴奋性、传播轨迹 |
| 个体化网络模型 | VEP、Bayesian VEP、virtual resection、virtual stimulation | 这个患者的致痫网络可能在哪里？ | EZ/PZ/HZ、EZN、模拟 SEEG、虚拟手术结果 |
| 统计/机器学习模型 | graph model、FC model、GCN、DeepEZ、AI prediction model | 从连接或多模态特征能否预测 SOZ/EZ 或结局？ | 节点分类、风险分数、候选区域 |
| 参数推断算法 | MAP、MCMC、HMC、NUTS、VI、ADVI、Laplace、SBI | 给定模型和数据，参数是多少、不确定性多大？ | posterior、credible interval、区域概率 |
| 模型评价 | posterior predictive check、WAIC、PSIS-LOO、resection overlap、outcome prediction | 模型是否能预测真实数据和临床结局？ | 模型比较、预测误差、临床一致性 |

最容易犯的错误是把推断算法当成癫痫模型本身。比如 NUTS 和 ADVI 不解释癫痫发作，它们只是帮助 Bayesian VEP 估计参数；GCN 不解释发作为何发生，它是在图结构上做分类；Epileptor 才是发作动力学模型，VEP 则把这个模型嵌入患者个体脑网络。

## 2. Epileptor：把发作写成状态转换

Epileptor 是理解 VEP 的底座。Jirsa 等在 *Brain* 2014 提出的核心思想是：seizure-like event 可以看成动力系统在状态空间里的轨迹，系统从 interictal state 跨过临界边界进入 ictal state，再通过另一类动力学事件退出 ictal state <sup class="citation">[<a href="#ref-s8">8</a>]</sup>。

它的临床意义不是让我们背完整方程，而是建立一个观念：发作不是“电极上突然出现一串异常波”，而是局部和网络状态变量共同推动的状态转换。这个框架能自然解释 seizure onset、seizure offset、spike-wave、慢变量恢复、网络传播和反复发作。

一个简化的区域级写法可以写成：

{% raw %}
$$
\frac{d\mathbf{x}_i}{dt}
= F(\mathbf{x}_i, \eta_i)
+ G \sum_j C_{ij} H(\mathbf{x}_j)
+ \epsilon_i(t)
$$
{% endraw %}

这里 `x_i` 表示第 `i` 个脑区的动力学状态，`eta_i` 表示区域兴奋性或 epileptogenicity，`C_ij` 表示结构或功能连接，`G` 是全局耦合强度，`H` 是从其他脑区传来的输入函数，`epsilon_i(t)` 是噪声或未建模扰动。

读 Epileptor 时要抓住四个关键词。

| 概念 | 含义 | 对术前评估的意义 |
| --- | --- | --- |
| state variable | 用少数变量描述局部神经群体状态 | 不把 SEEG 波形只当成静态标签，而是看其动态轨迹 |
| slow-fast dynamics | 快变量产生放电，慢变量控制进入和退出发作 | 解释为什么起始、传播、终止可以有不同时间尺度 |
| bifurcation | 系统跨过临界边界后进入另一种状态 | 对应“为什么某个区域突然变成发作态” |
| excitability | 区域更容易进入发作态的程度 | 后续 VEP/Bayesian VEP 里的关键待估参数 |

Epileptor 的限制也要清楚：它是低维抽象模型，不等同于真实离子通道或细胞电路的完整模拟。它更适合回答“发作动力学可以如何组织”，而不是直接回答“这个患者该切哪一毫米”。

## 3. NMM：把一个脑区当成神经群体来建模

Neural mass model（NMM，神经质量模型）把一个脑区或一个电极附近的神经活动看成兴奋性和抑制性群体的平均活动。它不追踪单个神经元，而是用区域级变量描述群体输出，因此很适合和 SEEG、EEG、MEG 这类宏观信号对接。

一个典型的兴奋-抑制 NMM 可以抽象成：

{% raw %}
$$
\begin{aligned}
\tau_E \dot{E}_i
&= -E_i + S_E(w_{EE}E_i - w_{EI}I_i + \sum_j C_{ij}E_j + u_i), \\
\tau_I \dot{I}_i
&= -I_i + S_I(w_{IE}E_i - w_{II}I_i).
\end{aligned}
$$
{% endraw %}

`E_i` 和 `I_i` 分别表示第 `i` 个区域的兴奋性和抑制性群体活动，`C_ij` 表示区域间耦合，`u_i` 是外部输入或刺激，`S_E` 和 `S_I` 是非线性响应函数。

NMM 在癫痫里的用途主要有三类。

| 用途 | 做法 | 输出 |
| --- | --- | --- |
| 发作模拟 | 调节兴奋/抑制平衡和耦合强度 | 模拟 ictal onset、传播和终止 |
| 干预模拟 | 虚拟切除、虚拟 RFTC、虚拟刺激 | 比较干预前后网络活动 |
| SEEG 解释 | 用模型生成信号，再与真实 SEEG 比较 | 评估模型是否解释观测波形 |

Cai 等 2024 的 RFTC 预测工作就是典型例子：先从 SEEG 估计 PDC coupling matrix，再构建 coupled NMM，拟合参数后模拟真实热凝 contacts 或随机 contacts 的虚拟手术效果 <sup class="citation">[<a href="#ref-s4">4</a>]</sup>。

![Cai 2024 Figure 1：SEEG-PDC-coupled NMM-RFTC 预测流程](/images/seeg-web-network-models-review/s4-cai-2024-fig1-coupled-nmm-workflow.png)

*图 1. Cai 等 2024 原文 Figure 1。它把 SEEG、PDC matrix、coupled NMM、参数拟合、虚拟 RFTC 和 postoperative simulated signals 放在同一个流程里。原文 PDF 标注为 CC BY 开放获取 <sup class="citation">[<a href="#ref-s4">4</a>]</sup>。*

这张图的重点是：NMM 不只是“画一个模拟波形”，而是把真实 SEEG 的方向性连接写进模型耦合项，然后比较不同虚拟干预下模型输出是否更接近术后状态。它比单纯看某个 contact 的放电更接近网络层面的“如果我干预这里，会不会改变传播结构”。

## 4. VEP：把 Epileptor/NMM 放进患者个体连接组

Virtual Epileptic Patient（VEP）可以理解为“个体化网络动力学模型”。它通常用患者的 MRI/DWI 或 DTI 构建结构连接和脑区分区，在每个脑区放置 Epileptor 或相关 NMM，再用 SEEG 观测、病灶位置、临床假设和术后结果来约束模型 <sup class="citation">[<a href="#ref-s6">6</a>,<a href="#ref-s7">7</a>]</sup>。

VEP 的基本链条是：

1. MRI 定义个体解剖和病灶。
2. DWI/DTI 重建结构连接矩阵 $C$。
3. 在每个脑区放置动力学模型。
4. 给不同脑区设置 excitability、coupling、delay、noise 等参数。
5. 生成模拟 SEEG 或区域活动。
6. 与真实 SEEG 发作起始、传播顺序和临床结局比较。
7. 做 virtual resection、virtual stimulation 或 EZN ranking。

![Jirsa 2017 Figure 2：SEEG 发作记录与模拟发作](/images/seeg-web-network-models-review/s7-jirsa-2017-fig2-seeg-simulation.png)

*图 2. Jirsa 等 2017 原文 Figure 2。同一患者不同发作类型的 SEEG 记录与模型模拟被并排展示，用来说明个体化 whole-brain model 如何解释发作传播。原文 PDF 标注为 CC BY-NC-ND 4.0 开放获取 <sup class="citation">[<a href="#ref-s7">7</a>]</sup>。*

这类图不能只看“模拟像不像”。更重要的是模型是否解释了时间顺序：哪个区域先进入发作态，传播经过哪些连接，哪些区域只是被动传播，哪些区域在虚拟切除后能阻断网络。临床上，VEP 的目标不是替代 SEEG，而是把 SEEG 覆盖不足、深部传播、结构连接和术后可验证假设放进一个可复盘框架。

Wang 等 2023 把 VEP 推向更接近临床决策支持的路线：用脑影像和 personalized modeling delineate epileptogenic networks，再把 virtual surgery 的结果与真实术后结局对照 <sup class="citation">[<a href="#ref-s5">5</a>]</sup>。这类研究最值得学习的是评价方式：不要只问模型是否能产生漂亮脑图，而要问模型预测的网络是否与临床 EZN、切除范围、术后 seizure freedom 或复发相互印证。

## 5. Bayesian VEP：从单个答案变成概率图

普通 VEP 容易被读成“模型给出一个最可能的 EZN”。Bayesian VEP 更进一步：它把参数当成随机变量，显式估计 posterior distribution。Hashemi 等 2020 的 Bayesian VEP 用概率编程框架推断个体化 epileptogenicity map，并比较 NUTS 和 ADVI 在该问题上的表现 <sup class="citation">[<a href="#ref-s2">2</a>]</sup>。

![Hashemi 2020 Figure 1：Bayesian VEP 工作流](/images/seeg-web-network-models-review/s2-hashemi-2020-fig1-bvep-workflow.png)

*图 3. Hashemi 等 2020 原文 Figure 1。左上输入 MRI/DTI，右上构建 network anatomy，中间通过 The Virtual Brain / VEP 放置 network model，左下用 empirical observations 作为约束，右下用 Stan/PyMC3 等概率编程框架做 inference/prediction。原文 PDF 标注为 CC BY-NC-ND 4.0 开放获取 <sup class="citation">[<a href="#ref-s2">2</a>]</sup>。*

Bayesian VEP 的核心公式可以写成：

{% raw %}
$$
\begin{aligned}
p(\theta, \mathbf{x}_{1:T} \mid \mathbf{y}_{1:T}, C, M)
&\propto
p(\mathbf{y}_{1:T} \mid \mathbf{x}_{1:T}, \theta, C, M) \\
&\quad \times
p(\mathbf{x}_{1:T} \mid \theta, C, M)
p(\theta).
\end{aligned}
$$
{% endraw %}

这里 `theta` 是待估参数，例如区域 epileptogenicity、coupling、delay、gain、noise；`x_1:T` 是潜在脑区状态轨迹；`y_1:T` 是观测到的 SEEG/EEG/MEG/fMRI 特征；`C` 是连接矩阵；`M` 是选择的动力学模型。

这条公式翻译成人话就是：给定个体脑网络和观测数据，反推出哪些参数组合最能解释真实发作，同时保留“不确定性”。因此 Bayesian VEP 的输出不应该只是一张红黄蓝脑图，而应该包括每个区域的 posterior mean、credible interval、区域排名、模型诊断和预测检查。

Bayesian VEP 里的几个算法要这样记。

| 方法 | 全称 | 在 Bayesian VEP 中做什么 | 适合场景 | 主要风险 |
| --- | --- | --- | --- | --- |
| MAP | maximum a posteriori | 找 posterior 最高点 | 快速初始化、给一个候选解 | 没有完整不确定性，可能卡在局部最优 |
| MCMC | Markov chain Monte Carlo | 从 posterior 抽样 | 需要 credible interval 和参数相关性 | 慢，需要收敛诊断 |
| HMC | Hamiltonian Monte Carlo | 利用梯度在高维连续空间采样 | 比 random-walk MCMC 更高效 | 模型要可微，调参和几何问题敏感 |
| NUTS | No-U-Turn Sampler | 自动调节 HMC 轨迹长度 | 病例级严谨后验估计 | 计算开销大，可能出现 divergence |
| VI | variational inference | 用简单分布近似 posterior | 大模型快速探索 | 容易低估不确定性 |
| ADVI | automatic differentiation variational inference | 自动微分 + 变分近似 | 快速筛查、初始化 NUTS | 多峰/强相关 posterior 会被过度简化 |
| Laplace | Laplace approximation | 在 MAP 附近用高斯近似 posterior | 快速误差条、初步模型比较 | 只看局部，不能处理非高斯和多峰 |

NUTS 和 ADVI 的关系可以简化为：**ADVI 适合快速找到方向，NUTS 适合最后确认不确定性。** 如果两者给出相似的 high-epileptogenicity 区域排序，结论更可信；如果差异明显，通常提示 posterior 很复杂，不能只看 ADVI 的快速结果。

## 6. Graph / FC：先把 SEEG 或 fMRI 变成网络

Graph model 和 functional connectivity（FC）模型更偏“数据组织方式”。它们不一定模拟发作动力学，而是把多通道信号转成节点、边和网络指标。Stacey 等 2020 综述了 network analysis 在癫痫中的新角色，包括功能连接、方向性连接、图指标、控制理论和临床预测 <sup class="citation">[<a href="#ref-s1">1</a>]</sup>。

常见输入和输出如下。

| 输入 | 可能计算 | 输出含义 |
| --- | --- | --- |
| SEEG 多通道时间序列 | coherence、PDC、Granger causality、transfer entropy | 通道间同步、方向性传播、因果近似 |
| fMRI BOLD 时间序列 | resting-state FC、correlation matrix | 非侵入式功能网络 |
| DWI/DTI | structural connectivity | 白质连接骨架 |
| 术后结局 | resection overlap、seizure freedom label | 模型是否有临床预测价值 |

图模型的优点是直观、可解释、容易和临床网络语言对接；缺点是指标容易受窗口长度、滤波、参考电极、体积传导、非平稳性和植入覆盖影响。它最好用作假设生成和模型输入，而不是单独作为 SOZ/EZ 判决。

## 7. DeepEZ / GNN：从连接矩阵直接预测 EZ

DeepEZ 属于数据驱动路线。Nandakumar 等 2023 使用 resting-state fMRI connectivity，并把 functional connectivity matrix 输入 graph convolutional network（GCN），用于 automated epileptogenic zone localization <sup class="citation">[<a href="#ref-s3">3</a>]</sup>。

![Nandakumar 2023 Figure 2：DeepEZ 模型结构](/images/seeg-web-network-models-review/s3-deepez-fig2-model-schematic.png)

*图 4. Nandakumar 等 2023 原文 Figure 2。DeepEZ 从 rs-fMRI parcellation、connectivity matrix、GCN、bias ANN 到 SOZ/non-SOZ 分类。原文 PDF 标注为 Creative Commons Attribution 4.0 <sup class="citation">[<a href="#ref-s3">3</a>]</sup>。*

GCN 的基本思想是：一个脑区的表示不只由自己的特征决定，也由网络邻居决定。抽象写法是：

{% raw %}
$$
H^{(l+1)} =
\sigma(\tilde{A} H^{(l)} W^{(l)}),
$$
{% endraw %}

其中 `H^(l)` 是第 `l` 层节点表示，`A_tilde` 是归一化后的连接矩阵，`W^(l)` 是可学习权重，`sigma` 是非线性函数。放到 DeepEZ 里，节点是脑区，边来自 rs-fMRI 功能连接，输出是每个区域更像 SOZ 还是 non-SOZ。

DeepEZ 与 VEP 的差别很重要。

| 维度 | VEP / Bayesian VEP | DeepEZ / GNN |
| --- | --- | --- |
| 核心思想 | 机制模型 + 个体化连接组 + 参数反演 | 连接矩阵 + 监督学习分类 |
| 主要输入 | MRI/DWI、SEEG、模型先验 | rs-fMRI connectivity、标签 |
| 输出 | EZN ranking、模拟发作、虚拟手术 | SOZ/EZ 概率或分类 |
| 优点 | 可解释、能做干预模拟 | 非侵入式、速度快、适合筛查 |
| 风险 | 参数多、计算重、依赖先验和覆盖 | 样本量、标签噪声、中心效应、可解释性 |

因此 DeepEZ 更适合术前早期假设生成或辅助决定覆盖范围，不适合直接替代 SEEG 和多学科会议里的因果判断。

## 8. Virtual resection / stimulation：把模型推向临床问题

模型最后必须回答临床问题：如果切除、热凝或刺激某些区域，网络会怎样改变？这就是 virtual resection、virtual RFTC 和 virtual stimulation 的意义。

| 模型任务 | 问题 | 常见输出 |
| --- | --- | --- |
| virtual resection | 移除某些节点或边后，发作还能传播吗？ | 传播是否中断、EZN 排名是否下降 |
| virtual RFTC | 热凝某些 contacts 后，模拟信号是否更接近术后状态？ | peak frequency、功率、网络同步变化 |
| virtual stimulation | 刺激某些节点后，是否诱发或阻断发作样活动？ | 刺激响应、传播路径、候选干预靶点 |
| virtual twin | 构建患者个体脑模型，测试多种假设 | 个体化手术/刺激策略排序 |

这类模型真正有价值的地方不是“预测准确率看起来高”，而是它能把术前讨论从“我觉得这里重要”变成“如果这个节点被移除，模型预测传播路径如何改变；这个预测和真实术后结果是否一致”。

## 9. SBI、Kalman、particle filter：更偏反演和在线估计

`math_mode.md` 里提到的 SBI、Kalman filter、particle filter 也很重要，但它们主要是推断工具，不是癫痫机制模型。

| 方法 | 全称 | 在癫痫模型中的意义 |
| --- | --- | --- |
| Kalman filter | 卡尔曼滤波 | 在线估计潜在状态，适合近线性、高斯假设或其扩展版本 |
| particle filter | 粒子滤波 | 用一组粒子追踪非线性、非高斯状态，适合复杂动态但计算更重 |
| SBI | simulation-based inference | 不直接写 likelihood，而是大量模拟后学习参数到观测的关系 |
| normalizing flow | 可逆神经网络密度估计 | 在 SBI 中近似复杂 posterior |
| global optimization | 全局优化 | 在高维非凸空间里搜索更好的参数区域 |

如果用一句话区分：Bayesian VEP 的 NUTS/ADVI 更偏“离线病例建模和 posterior 估计”；Kalman/particle filter 更偏“随时间更新潜在状态”；SBI 更偏“模型能模拟但 likelihood 难写时，靠模拟学习反问题”。

## 10. 其他常见模型：DCM、neural field、spreading 和 control

`math_mode.md` 里还列了几类模型，它们在术前评估里也常被提到。它们和 VEP/NMM 有交集，但侧重点不同。

| 模型 | 核心思想 | 更适合回答的问题 | 和 SEEG/VEP 的关系 |
| --- | --- | --- | --- |
| DCM | dynamic causal modeling，用生成模型比较候选有效连接结构 | 哪个连接方向或回路假设更能解释观测数据？ | 可用于小规模候选网络假设比较，通常比 whole-brain VEP 更强调有效连接和模型证据 |
| neural field model | 把脑活动写成连续空间场，而不是离散脑区节点 | 发作波如何在皮层空间上传播、碰撞、终止？ | 更适合研究传播形态和空间波；VEP 更常用分区节点和连接矩阵 |
| epidemic / spreading model | 把发作传播类比成网络上的扩散、感染或阈值级联 | 从某些种子节点出发，活动会沿网络扩散到哪里？ | 简化、可解释、计算便宜，但机制细节弱于 NMM/Epileptor |
| control model | 用网络控制理论分析刺激或切除如何改变状态转移 | 哪些节点最适合作为刺激、切除或调控靶点？ | 可和 VEP 的 virtual stimulation / resection 互补 |
| EI/HFO biomarker model | 用 epileptogenicity index、HFO、IED 等电生理特征打分 | 哪些 contacts 更像致痫组织或传播节点？ | 更接近临床特征工程，可作为 VEP/AI 的输入或验证证据 |

DCM 的优点是能比较明确的因果连接假设，比如“海马到额叶驱动”是否比“额叶到海马驱动”更能解释数据；缺点是候选模型数量一多会爆炸，而且通常不适合直接做全脑大规模虚拟手术。

Neural field 和 epidemic spreading model 的共同价值是强调空间传播。前者更连续、更接近波传播；后者更离散、更适合快速在图上模拟扩散。它们能提醒我们：SEEG 上看到的 SOZ 可能只是采样到的早期节点，未采样的 seed 或隐匿传播路径仍可能存在。

Control model 则把问题改写成“如何最小代价改变网络状态”。如果某个节点并不是最早起始点，但控制能力强，刺激或干预它仍可能改变发作传播。这一点对 RNS、DBS、SEEG stimulation mapping 和 virtual stimulation 都有意义。

这些扩展模型目前没有在这篇文章里放论文原图，主要是因为当前已整理的 Zotero/图源集中没有逐一确认可复用的原图授权。后续如果把 DCM、neural field、SBI-VEP 或 control theory 的核心论文加入 collection，可以再单独补图。

## 11. 读模型文章时的检查清单

最后给一个实用检查表。读任何癫痫数学模型文章，都按这 8 个问题过一遍。

| 问题 | 为什么重要 |
| --- | --- |
| 模型到底解释机制，还是只做预测？ | 机制模型和分类器的临床含义不同 |
| 输入数据是什么？ | MRI、DWI、SEEG、fMRI、MEG 的信息量和偏差不同 |
| 节点和边如何定义？ | parcellation、contact mapping、connectivity 会强烈影响结果 |
| 哪些参数是待估的？ | excitability、coupling、delay、noise 的可识别性不同 |
| 用什么推断算法？ | MAP、NUTS、ADVI、SBI 给出的不确定性含义不同 |
| 有没有 posterior predictive check？ | 能拟合参数不等于能生成真实 SEEG/传播 |
| 有没有外部验证或术后结局验证？ | 只在训练病例上好看没有临床说服力 |
| 结论是否受 SEEG 覆盖限制？ | 没有记录到的区域不能被模型“神奇定位” |

最稳妥的口径是：**Epileptor/NMM 解释发作动力学，VEP 把动力学嵌入个体连接组，Bayesian inference 把不确定性显式化，graph/FC 和 AI 提供候选网络证据，virtual resection/stimulation 把模型推向可验证的临床假设。**

## 参考文献

<span id="ref-s1" class="ref-label">[1]</span> Stacey W, Kramer M, Gunnarsdottir K, et al. Emerging roles of network analysis for epilepsy. *Epilepsy Research*. 2020;159:106255. doi:10.1016/j.eplepsyres.2019.106255

<span id="ref-s2" class="ref-label">[2]</span> Hashemi M, Vattikonda AN, Jha J, et al. The Bayesian Virtual Epileptic Patient: A probabilistic framework designed to infer the spatial map of epileptogenicity in a personalized large-scale brain model of epilepsy spread. *NeuroImage*. 2020;217:116839. doi:10.1016/j.neuroimage.2020.116839

<span id="ref-s3" class="ref-label">[3]</span> Nandakumar N, Alexopoulos AV, Prayson RA, et al. DeepEZ: A Graph Convolutional Network for Automated Epileptogenic Zone Localization From Resting-State fMRI Connectivity. *IEEE Transactions on Biomedical Engineering*. 2023;70(1):208-220. doi:10.1109/TBME.2022.3187942

<span id="ref-s4" class="ref-label">[4]</span> Cai T, Lin Y, Wang H, Luo C. Predicting radiofrequency thermocoagulation surgical outcomes in refractory focal epilepsy patients using functional coupled neural mass model. *Frontiers in Neurology*. 2024;15:1402004. doi:10.3389/fneur.2024.1402004

<span id="ref-s5" class="ref-label">[5]</span> Wang HE, Scholly J, Triebkorn P, et al. Delineating epileptogenic networks using brain imaging data and personalized modeling in drug-resistant epilepsy. *Science Translational Medicine*. 2023;15(680):eabp8982. doi:10.1126/scitranslmed.abp8982

<span id="ref-s6" class="ref-label">[6]</span> Proix T, Bartolomei F, Guye M, Jirsa VK. Individual brain structure and modelling predict seizure propagation. *Brain*. 2017;140(3):641-654. doi:10.1093/brain/awx004

<span id="ref-s7" class="ref-label">[7]</span> Jirsa VK, Proix T, Perdikis D, et al. The Virtual Epileptic Patient: Individualized whole-brain models of epilepsy spread. *NeuroImage*. 2017;145:377-388. doi:10.1016/j.neuroimage.2016.04.049

<span id="ref-s8" class="ref-label">[8]</span> Jirsa VK, Stacey WC, Quilichini PP, Ivanov AI, Bernard C. On the nature of seizure dynamics. *Brain*. 2014;137(8):2210-2230. doi:10.1093/brain/awu133
