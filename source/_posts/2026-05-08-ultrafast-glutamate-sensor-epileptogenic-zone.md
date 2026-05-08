---
title: 癫痫灶里的谷氨酸瞬变：一支超快传感器看到的病理释放
date: 2026-05-08 17:30:00
tags:
  - 癫痫
  - FCD
  - 谷氨酸
  - 生物传感器
  - 突触
comments: true
---

癫痫灶通常被描述为兴奋和抑制失衡的局部网络。这个说法很重要，但也容易停留在抽象层面：兴奋性增强到底发生在什么尺度？是细胞外谷氨酸整体升高，还是单个突触前末梢释放囊泡时就已经异常？Zhao 等发表在 *Biosensors and Bioelectronics* 的工作试图把这个问题推进到更细的时间尺度：他们构建了一支 ultra-fast glutamate sensor，并把它放入局灶性皮层发育不良（focal cortical dysplasia, FCD）患者的手术切除脑组织中，直接记录癫痫灶里的 tonic 和 phasic glutamate release <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这篇文章的价值不只是“谷氨酸和癫痫有关”。这个结论早已有大量微透析和代谢研究支持。它真正想解决的是测量分辨率问题：传统 microdialysis 结合 HPLC 能看到癫痫发作相关的细胞外 glutamate 升高，但时间分辨率通常在分钟级，适合观察缓慢的 tonic 变化，却很难捕捉突触传递中单个囊泡释放对应的快速 transient。对于癫痫灶这种异常兴奋网络来说，慢变量和快变量都重要；如果只能看到慢变量，就会漏掉突触前释放本身是否已经病理化。

## 1. 传感器设计：把酶层做薄，才有机会看见快事件

作者的核心技术路线是把 glutamate oxidase（GluOx）固定在 carbon fiber electrode（CFE）表面，但不是用厚的 dip coating，而是用 chitosan-based electrodeposition 形成 nanoscale enzyme coating <sup class="citation">[<a href="#ref-1">1</a>]</sup>。具体来说，GluOx 和 chitosan 混合液被放在电极附近；在 platinized CFE 表面施加电位后，氧还原反应会局部提高 pH，使 chitosan 从可溶状态转为凝胶状态，从而把 GluOx 温和地困在电极表面。

这个设计有两个关键点。第一，酶层要足够薄。谷氨酸必须先扩散到酶层，被 GluOx 转化后再产生可电化学检测的信号；如果酶层太厚，灵敏度可能增加，但扩散路径也变长，快速事件会被抹平。第二，制备过程要足够稳定和便宜。作者发现 150 秒 electrodeposition 的效果最好；2 μL 混合液可以修饰约 10 支电极，相比既往方法至少减少 10 倍 GluOx 消耗，制备时间也压到 3 分钟以内 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这就是原文 Figure 1 的核心信息：它不是单纯展示一个传感器外观，而是在说明“薄酶层”怎样被制造出来。CFE 提供微米级探针，PtNPs 改善电化学反应界面，GluOx-CS 层负责把 glutamate 转换为可检测信号。对神经组织记录来说，这种结构的意义在于尽量减少扩散和反应造成的时间拖尾。

## 2. 性能验证：灵敏度、稳定性和高速记录缺一不可

在电化学表征中，这支传感器对 glutamate 的检测线性范围为 1-100 μM，limit of detection 为 0.1 μM；重复测量的 RSD 约为 3.67%，4°C 保存一周后灵敏度没有显著下降 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。这些指标说明它可以胜任脑组织外液中 glutamate 动态的定量检测。

但对这篇文章来说，更关键的是它能不能在组织里抓到快速 transient。作者先在小鼠 hippocampal CA1 区域测试，使用 20 kHz amperometric recording 记录 spontaneous glutamate transients，观察到半峰宽约 1.4 ms 的单 spike 事件 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。这一步相当于证明：这套电极和记录系统不只是能测浓度，也能在活组织环境里解析接近突触释放尺度的瞬时事件。

这里需要避免一个误读：传感器的常规响应时间表征和组织中记录到的 spike 宽度不是同一个概念。前者反映校准条件下传感器对外源 glutamate 变化的整体响应，后者反映局部释放事件在电极附近形成的 amperometric transient。真正支撑本文结论的是后者：在高采样率下，电极能把单个快速释放事件从背景中分辨出来。

## 3. 人体 FCD 切片：慢性升高和快速释放都发生改变

临床部分是这篇文章最有意思的地方。作者使用 6 位 FCD 患者手术切除的皮层组织，将 epileptogenic zone（foci）和邻近相对正常区域（ctrl）作为比较对象。组织切除后在冷氧合条件下 5 分钟内转运到实验室，切成 300 μm acute slices；记录时，传感器尖端推进到脑片内约 50 μm，旁边约 20 μm 放置一个 enzyme-free sentinel electrode，用来扣除 ascorbic acid、monoamine 等电活性干扰物造成的背景信号 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

刺激条件使用 0 mM Mg<sup>2+</sup> 和 25 mM K<sup>+</sup> 的外液，模拟 seizure-like activity。结果显示，foci 和 ctrl 都会出现缓慢上升的 tonic glutamate release，但癫痫灶的刺激诱发增量明显更大：foci 为 247.6 ± 103.3 pA，ctrl 为 35.5 ± 12.5 pA <sup class="citation">[<a href="#ref-1">1</a>]</sup>。这部分结果和既往微透析研究方向一致：癫痫灶在刺激下释放更多谷氨酸，细胞外兴奋性压力更高。

更关键的是 phasic release。作者在人体脑组织中解析到单个 amperometric spikes，并把“真事件”定义为 working electrode 上存在、sentinel electrode 上不存在的 spike。事件频率没有显著改变，但单 spike 的平均幅度在 foci 中更高：foci 为 33.5 ± 2.8 pA，ctrl 为 25.0 ± 3.3 pA；半峰宽维持在约 3.8 ms <sup class="citation">[<a href="#ref-1">1</a>]</sup>。换句话说，癫痫灶并不只是背景 glutamate 更高，它的单次突触前释放事件也更大。

作者进一步用 Faraday's law 估计单 spike 对应释放的 glutamate molecules 数量，中心值大约为 280,000 molecules。整体分布的峰值在不同组之间相近，但 foci 中大事件更多，尤其在刺激诱发条件下累积分布明显右移 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。这给出了一个更细的病理图景：癫痫灶可能存在“更容易释放大包谷氨酸”的突触前状态，而不只是细胞外谷氨酸清除或代谢异常。

## 4. 这篇文章改变了什么问题的问法

过去讨论 E/I imbalance，常见表述是抑制不足、兴奋增强、glutamate 升高、GABAergic inhibition 受损。这些说法都成立，但它们没有告诉我们异常究竟发生在什么层级。Zhao 等的工作把问题压到突触前释放尺度：如果癫痫灶中的单个 glutamate release event 本身幅度更大，那么网络兴奋性增加就可能有一个非常局部、非常快速的来源 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这和临床癫痫灶定位也有关系。SEEG、MRI、PET、病理切片和术中电生理通常描述的是结构、代谢或电活动模式；这篇文章补上的是神经化学释放动力学。它提示我们，epileptogenic zone 不只是一个“会放电的区域”，也是一个 neurotransmitter release profile 已经改变的微环境。未来如果能把这种传感器和空间定位、病理分型、SEEG 活动模式放在一起看，可能会更清楚地区分哪些区域只是被动卷入，哪些区域真正具有突触前释放异常。

## 5. 需要谨慎的地方

这项研究仍然是 ex vivo acute slice work，不是人体在体长期记录。脑片保留了局部组织结构和部分突触连接，但它已经离开完整血流、胶质调控、远程输入和真实发作传播环境。因此，文中的 phasic glutamate release 结果可以说明“切除组织中的癫痫灶具有异常释放能力”，但不能直接等同于患者体内每一次发作时的完整动态。

第二，样本量是 6 位 FCD 患者，病理类型和年龄跨度都会影响解释。作者报告 patient age 与单 spike 释放分子数的相关性很低，但这不能替代更大样本中的分层验证。FCD 本身也不是所有局灶性癫痫的同义词，未来还需要在 hippocampal sclerosis、肿瘤相关癫痫、皮层瘢痕等其他病因中验证。

第三，传感器为了速度省略了隔离膜，因此选择性更依赖 self-referencing subtraction。这个设计合理，因为 sentinel electrode 能帮助扣除共同干扰物；但在更复杂的在体环境里，组织运动、长期漂移、胶质反应和电化学污染都会变成新的问题。作者也明确指出，下一步需要走向 in vivo 和 chronic recording。

## 6. 一个简短结论

这篇论文最值得记住的一点是：癫痫灶的谷氨酸异常不只存在于分钟级的 extracellular accumulation，也可能存在于毫秒级的 quantal release event。传感器技术在这里不是附属工具，而是决定问题能不能被看见的前提。只有当测量速度足够快、空间尺度足够小，E/I imbalance 才能从一个宏观概念落到突触释放事件本身。

## 参考文献

- <span id="ref-1" class="ref-label">[1]</span> Zhao S, Li C, Zheng Y, Wang F, Wang Y, Ma K, Li Y, Zhang L, Zhang X, Gao J, Yao Y, Chen P, Sun J, Shen X. Pathological glutamate release profiles in the epileptogenic zones of patients revealed by a novel ultra-fast glutamate sensor. *Biosensors and Bioelectronics*. 2026;296:118332. DOI: 10.1016/j.bios.2025.118332.
