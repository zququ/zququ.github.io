---
title: SEEG/WEB 文献综述：从发作动力学到 VEP、AI 和多模态验证
date: 2026-05-18 15:10:00
tags:
  - SEEG
  - VEP
  - AI
  - 癫痫
  - 网络模型
comments: true
---

这组文献可以按一条主线来读：癫痫术前评估正在从“找一个点”转向“解释一个网络”。SEEG 仍然是最关键的功能证据，但它越来越多地被放进 MRI/DTI、fMRI、MEG、网络科学、神经质量模型和机器学习组成的系统里。目标不是让模型替代医生，而是让 epileptogenic zone（EZ）、seizure onset zone（SOZ）和 epileptogenic zone network（EZN）的判断更可解释、更可验证。

[下载 PPT：SEEG/WEB 文献综述](/files/seeg-web-network-models-review.pptx)

先给一句总纲：**SEEG/WEB 这条线最值得复习的不是某一个算法，而是“同步证据 + 个体化模型 + 临床可解释性”的组合。** 动力学模型解释发作为何发生，VEP 把个体结构和 SEEG 放进同一个虚拟脑，AI 方法补充非侵入式预测，多模态病例则提醒我们，局灶和广泛性并不总是二分。

插图只选用能在原 PDF 中确认开放许可或已整理过的原文图；版权不明确的文章只做文字总结，避免把未授权截图直接塞进公开笔记。

## 1. 先把术语边界理清楚

这里容易混的词很多，建议先按功能分层。

| 术语 | 含义 | 阅读时的重点 |
| --- | --- | --- |
| SOZ | seizure onset zone，发作最早可记录起始区 | 是记录和判读概念，依赖电极覆盖和起始定义 |
| EZ | epileptogenic zone，理论上必须切除/干预后才能让发作停止的区域 | 不是一个可直接观测对象，只能由多证据推断 |
| EZN | epileptogenic zone network，癫痫发生和传播相关网络 | 更符合 SEEG + 连接组 + 模型的工作方式 |
| VEP | Virtual Epileptic Patient，个体化虚拟癫痫患者模型 | MRI/DTI 建结构骨架，SEEG 约束模型，模拟传播和干预 |
| Epileptor | Jirsa 等提出的发作动力学模型 | 用少数状态变量描述发作起始、持续、终止和 spike-wave |
| PDC | partial directed coherence，方向性功能连接估计 | 可从多通道 SEEG 中估计 coupling matrix |
| NMM | neural mass model，神经质量模型 | 用区域级动态方程模拟群体神经活动 |

这几个词的关系可以这样记：SOZ 是“记录上最早看到哪里动”，EZ 是“真正需要处理哪里”，EZN 是“哪些区域共同构成发作网络”，VEP/NMM/AI 是帮助我们从观测数据推断 EZN 的工具。

## 2. 理论底座：发作是动力系统状态转换

Jirsa 等在 *Brain* 2014 的工作把 seizure-like event 抽象成动力系统问题：发作不是一串任意异常波形，而是神经系统从 interictal state 跨过阈值进入 ictal state，再通过另一个动力学事件退出 ictal state 的过程 <sup class="citation">[<a href="#ref-s8">8</a>]</sup>。他们提出的 Epileptor 用 5 个状态变量组织三类时间尺度：快时间尺度产生快速放电，中间时间尺度产生 spike-wave，慢时间尺度控制发作进出和复发。

这个理论的价值在于，它把“发作起始形态”从描述性语言变成可建模对象。比如 low-voltage fast activity、spike-wave、慢波/DC shift 等起始模式，不只是读片标签，也可能对应系统接近分界面、跨过阈值或网络重新稳定的不同路径。后续 VEP 工作基本都站在这个框架上：每个脑区不是静态标签，而是一个有兴奋性、连接、传播延迟和状态转换规则的节点。

Stacey 等 2020 的综述从临床 EEG/SEEG 的角度补上另一层：网络分析可以把多通道电生理信号转成 functional connectivity、graph metrics、control theory 等特征，用来补充传统目测判读 <sup class="citation">[<a href="#ref-s1">1</a>]</sup>。这并不意味着图论指标可以单独诊断 SOZ，而是说临床判读可以多一层“网络组织方式”的证据。

## 3. VEP：从结构连接到个体化虚拟脑

Virtual Epileptic Patient 的核心不是“做一个漂亮 3D 脑图”，而是把个体结构连接、区域动力学和 SEEG 观测统一起来。早期 VEP 工作展示了一个典型流程：用 T1-MRI/DTI 重建个体脑区和白质连接，在每个脑区放置 Epileptor 或相关神经质量模型，再用 SEEG 记录校准模型参数，最后模拟发作传播和干预策略 <sup class="citation">[<a href="#ref-s6">6</a>,<a href="#ref-s7">7</a>]</sup>。

![Hashemi 2020 Figure 1：Bayesian VEP 工作流](/images/seeg-web-network-models-review/s2-hashemi-2020-fig1-bvep-workflow.png)

*图 1. Hashemi 等 2020 原文 Figure 1，概括 Bayesian VEP 的结构：个体影像、connectome、network model、probabilistic model 和 posterior inference 被放在同一个闭环里。原文 PDF 标注为 CC BY-NC-ND 4.0 开放获取 <sup class="citation">[<a href="#ref-s2">2</a>]</sup>。*

图 1 最值得看的是闭环关系。左上角输入 MRI/DTI，右上角构建 network anatomy；中间通过 The Virtual Brain / VEP 放置 network model；左下角把 empirical observations 作为模型约束；右下角用 Stan/PyMC3 等概率编程框架做 inference/prediction。也就是说，VEP 不是把 SEEG 结果画在脑上，而是用 SEEG 反过来限制“哪些脑区更可能具有高 epileptogenicity”。

Hashemi 等 2020 的 Bayesian VEP 进一步强调不确定性：他们用 NUTS 和 ADVI 推断脑区 epileptogenicity map，并比较 centered 与 non-centered parameterization 的收敛行为 <sup class="citation">[<a href="#ref-s2">2</a>]</sup>。这点很重要，因为术前讨论不能只要一个“最可能答案”，还要知道这个答案有多稳、哪些区域是模型不确定的边界。

![Jirsa 2017 Figure 2：SEEG 发作记录与模拟发作](/images/seeg-web-network-models-review/s7-jirsa-2017-fig2-seeg-simulation.png)

*图 2. Jirsa 等 2017 原文 Figure 2，同一患者不同发作类型的 SEEG 记录与模型模拟。原文 PDF 标注为 CC BY-NC-ND 4.0 开放获取 <sup class="citation">[<a href="#ref-s7">7</a>]</sup>。*

图 2 说明 VEP 最有用的地方不是“拟合一条曲线”，而是比较不同网络条件下的传播路径。简单发作、复杂发作和刺激诱发发作在 SEEG 上呈现不同的空间传播，模型也要能解释这种差异。对临床来说，这类图的价值是把“切哪里可能阻断传播”转化成可讨论的网络假设。

Wang 等 2023 把 VEP 推向更接近临床 workflow 的形态：T1/DWI 构建个体结构网络，SEEG 记录用于模型反演和特征约束，再通过 personalized model 估计 EZN，并用虚拟手术回顾性评估切除策略 <sup class="citation">[<a href="#ref-s5">5</a>]</sup>。他们在 53 例 drug-resistant focal epilepsy 中报告，VEP 估计的 EZN 与临床定义 EZN 有一定空间接近性；在接受手术的患者中，seizure-free 患者的虚拟手术 false discovery rate 低于非 seizure-free 患者 <sup class="citation">[<a href="#ref-s5">5</a>]</sup>。这里不能把模型当成最终裁判，但它让“术前方案为什么合理”多了一个可复盘的证据层。

## 4. 从 VEP 到临床预测：模型路线和 AI 路线

目前能看到两条技术路线。

第一条是生理模型路线。Cai 等 2024 用 SEEG 计算 PDC coupling matrix，构建 coupled neural mass model，再通过虚拟 RFTC 或随机虚拟手术比较术后模拟信号，预测射频热凝结局 <sup class="citation">[<a href="#ref-s4">4</a>]</sup>。

![Cai 2024 Figure 1：SEEG-PDC-coupled NMM-RFTC 预测流程](/images/seeg-web-network-models-review/s4-cai-2024-fig1-coupled-nmm-workflow.png)

*图 3. Cai 等 2024 原文 Figure 1，展示从 SEEG 到 PDC matrix、coupled NMM、参数拟合、虚拟手术和 postoperative simulated signals 比较的流程。原文 PDF 标注为 CC BY 开放获取 <sup class="citation">[<a href="#ref-s4">4</a>]</sup>。*

这张图的逻辑很适合复习 RFTC 预测：先把真实 SEEG 转为方向性连接，再把连接作为模型耦合项；模型拟合后，虚拟移除临床热凝 contacts 或随机 contacts，比较术后模拟信号的 peak frequency。它的优点是可解释，缺点是样本量小，且依赖 SEEG 覆盖、PDC 稳定性和模型参数识别质量。

第二条是数据驱动 AI 路线。DeepEZ 用 resting-state fMRI connectivity 做 EZ localization，核心是把 rs-fMRI parcellation 后的 functional connectivity matrix 输入图卷积网络，同时加入 subject-specific detection bias 和对侧/同侧约束来改善 EZ 分类 <sup class="citation">[<a href="#ref-s3">3</a>]</sup>。

![Nandakumar 2023 Figure 2：DeepEZ 模型结构](/images/seeg-web-network-models-review/s3-deepez-fig2-model-schematic.png)

*图 4. Nandakumar 等 2023 原文 Figure 2，展示 DeepEZ 从 rs-fMRI 到 parcellation、connectivity matrix、GCN、bias ANN 和 SOZ/non-SOZ 分类的流程。原文 PDF 标注为 Creative Commons Attribution 4.0 <sup class="citation">[<a href="#ref-s3">3</a>]</sup>。*

DeepEZ 的意义在于它是非侵入式路线：不直接依赖 SEEG，而是尝试从 rs-fMRI connectivity 预测 EZ。文章报告 14 例 focal epilepsy 交叉验证中 accuracy 约 0.88、AUC 约 0.73 <sup class="citation">[<a href="#ref-s3">3</a>]</sup>。这个结果不能过度外推，因为样本量很小，EZ 标签也受切除边界和术后判断影响；但它说明 AI 可以作为术前假设生成工具，帮助决定哪里值得重点覆盖或进一步验证。

Lucas 等 2024 的 *Nature Reviews Neurology* 综述给了一个重要提醒：AI 在癫痫中的应用不只是“模型分数高不高”，还涉及数据模态、标注质量、偏倚、可解释性、监管路径、临床工作流和真实世界验证 <sup class="citation">[<a href="#ref-s9">9</a>]</sup>。在术前评估里，AI 更像是证据分层工具，而不是单独决定手术边界的工具。

## 5. 多模态病例：局灶和广泛性不一定二选一

Aung 等 2026 的病例很适合把前面的概念落地。患者有长期 absence seizures 和 3 Hz generalized spike-wave（GSW）病史，同时 MRI 有左额叶 malformation of cortical development（MCD）。如果只看 scalp EEG，容易认为是广泛性癫痫；如果只看 MRI，又容易把问题简化成左额局灶灶。作者用同步 SEEG-scalp EEG 和同步 SEEG-MEG 显示，这更像是局灶结构异常与分布式丘脑-皮层网络的相互作用 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。

![Aung 2026 Figure 1：Phase I 与同步 SEEG-scalp EEG](/images/seeg-web-multimodal-seeg-eeg-meg/aung-2026-fig1-phase-i-seeg-eeg.png)

*图 5. Aung 等 2026 原文 Figure 1，展示 Phase I scalp EEG、MRI、同步 SEEG-scalp EEG 和刺激诱发事件。原文为 Wiley/ILAE OA PDF，页面注明 OA articles governed by applicable Creative Commons License <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。*

图 5 的关键不是“看到一个 MCD 所以切除”，而是时间顺序：scalp 上有 GSW，SEEG 中双侧额叶和丘脑同步参与，但 MCD 区没有自发 focal IED；刺激 MCD 邻近 contacts 后，先出现局部 afterdischarge，随后出现双侧额叶和丘脑参与，再延迟出现左侧运动相关皮层的局灶演变 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。这更支持“病灶调制网络”，而不是简单证明“病灶是唯一 SOZ”。

同一篇病例文章不能只放一张图，因为它的证据链分成 SEEG-scalp EEG、SEEG-MEG 原始波形、早期源定位和后期网络传播几个层面。下面几张图需要连着看。

![Aung 2026 Figure 2A：同步 SEEG-MEG 原始信号](/images/seeg-web-multimodal-seeg-eeg-meg/aung-2026-fig2a-seeg-meg-traces.png)

*图 6. Aung 等 2026 原文 Figure 2A，同一段 GSW 中 SEEG 与 MEG 的同步原始信号 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。*

图 6 把一串 GSW 拆成了可定位的连续峰值。彩色竖线标记同一个 spike-wave complex 内部的多个峰值，后续源定位正是围绕这些短时间窗展开。它提醒我们，GSW 不是一个静态标签，而是有内部时序的网络事件。

![Aung 2026 Figure 2B-D：GSW 早期到中期源定位](/images/seeg-web-multimodal-seeg-eeg-meg/aung-2026-fig2b-d-source-localization.png)

*图 7. Aung 等 2026 原文 Figure 2B-D，展示连续 GSW 峰值的早期到中期皮层源定位 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。*

图 7 中，早期峰值主要涉及双侧后部皮层，随后左额叶和额顶区域逐渐参与。它的意义在于反驳“GSW 必然全脑同时同步”的直觉：即使是广泛性 spike-wave，也可以在毫秒尺度上有空间传播和重组。

![Aung 2026 Figure 2E-G：GSW 后期源定位](/images/seeg-web-multimodal-seeg-eeg-meg/aung-2026-fig2e-g-source-localization.png)

*图 8. Aung 等 2026 原文 Figure 2E-G，展示后续 GSW 峰值的双侧网络传播 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。*

图 8 显示后期网络进一步转向额叶、后顶叶和对侧皮层参与。结合 SEEG 中丘脑 contacts 的同步活动，这篇病例最合理的解读是：局灶 MCD 与广泛性丘脑-皮层网络并存并相互耦合；切除左额病灶后，强直-阵挛发作消失，但丘脑 RNS 仍能记录 spike-wave 活动且刺激未开启 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。因此，手术获益更像是改变了网络进入临床严重发作的通道，而不是把所有 GSW 网络活动完全清除。

## 6. 读这些文章时要带着限制看

这些研究很有启发，但不能被读成“模型已经能替代临床定位”。VEP 研究常受限于植入覆盖、参数可识别性、真实外部验证不足；DeepEZ 这类 AI 研究常受限于样本量、标签噪声和中心效应；单例多模态病例证据很细，但不能自动推广到所有 combined generalized and focal epilepsy。

更稳妥的使用方式是把它们放在术前评估的不同位置：网络分析帮助提出可检验假设，SEEG 验证时间顺序和深部网络参与，VEP/神经质量模型评估传播和虚拟干预，AI 从非侵入式数据中生成候选区域，多模态同步记录用来拆解局灶和广泛性网络之间的耦合关系。

最后的 takeaway 很简单：**SEEG 不只是“哪根电极先动”，而是把临床症状、结构病灶、连接组、动力学和干预结果连接起来的时间轴。** 这也是 VEP、AI 和同步 SEEG-MEG 这些方法真正能接上的地方。

## 参考文献

<span id="ref-s1" class="ref-label">[1]</span> Stacey W, Kramer M, Gunnarsdottir K, et al. Emerging roles of network analysis for epilepsy. *Epilepsy Research*. 2020;159:106255. doi:10.1016/j.eplepsyres.2019.106255

<span id="ref-s2" class="ref-label">[2]</span> Hashemi M, Vattikonda AN, Jha J, et al. The Bayesian Virtual Epileptic Patient: A probabilistic framework designed to infer the spatial map of epileptogenicity in a personalized large-scale brain model of epilepsy spread. *NeuroImage*. 2020;217:116839. doi:10.1016/j.neuroimage.2020.116839

<span id="ref-s3" class="ref-label">[3]</span> Nandakumar N, Alexopoulos AV, Prayson RA, et al. DeepEZ: A Graph Convolutional Network for Automated Epileptogenic Zone Localization From Resting-State fMRI Connectivity. *IEEE Transactions on Biomedical Engineering*. 2023;70(1):208-220. doi:10.1109/TBME.2022.3187942

<span id="ref-s4" class="ref-label">[4]</span> Cai T, Lin Y, Wang H, Luo C. Predicting radiofrequency thermocoagulation surgical outcomes in refractory focal epilepsy patients using functional coupled neural mass model. *Frontiers in Neurology*. 2024;15:1402004. doi:10.3389/fneur.2024.1402004

<span id="ref-s5" class="ref-label">[5]</span> Wang HE, Scholly J, Triebkorn P, et al. Delineating epileptogenic networks using brain imaging data and personalized modeling in drug-resistant epilepsy. *Science Translational Medicine*. 2023;15(680):eabp8982. doi:10.1126/scitranslmed.abp8982

<span id="ref-s6" class="ref-label">[6]</span> Proix T, Bartolomei F, Guye M, Jirsa VK. Individual brain structure and modelling predict seizure propagation. *Brain*. 2017;140(3):641-654. doi:10.1093/brain/awx004

<span id="ref-s7" class="ref-label">[7]</span> Jirsa VK, Proix T, Perdikis D, et al. The Virtual Epileptic Patient: Individualized whole-brain models of epilepsy spread. *NeuroImage*. 2017;145:377-388. doi:10.1016/j.neuroimage.2016.04.049

<span id="ref-s8" class="ref-label">[8]</span> Jirsa VK, Stacey WC, Quilichini PP, Ivanov AI, Bernard C. On the nature of seizure dynamics. *Brain*. 2014;137(8):2210-2230. doi:10.1093/brain/awu133

<span id="ref-s9" class="ref-label">[9]</span> Lucas A, et al. Artificial intelligence in epilepsy: applications and pathways to the clinic. *Nature Reviews Neurology*. 2024;20:319-336. doi:10.1038/s41582-024-00965-9

<span id="ref-s10" class="ref-label">[10]</span> Aung T, Tao JX, Goksu E, et al. Insights from multimodal simultaneous SEEG-EEG and SEEG-MEG recordings: A case of combined generalized and focal epilepsy. *Epilepsia*. 2026. doi:10.1002/epi.70249
