---
title: Seizure dynamics 分类：用 bifurcation 和 dynamotype 重新理解发作起止
date: 2026-06-22 14:30:00
tags:
  - epilepsy
  - seizure dynamics
  - SEEG
  - bifurcation
  - dynamical systems
comments: true
---

Sheheitli、Wang、Lemarechal、Bernard 和 Jirsa 在 *Jasper's Basic Mechanisms of the Epilepsies* 第 5 版中写的这一章，题目是 **A Classification of Seizures Based on Dynamics**。它不是按症状、病因或脑区给 seizure 分型，而是问一个更底层的问题：**一次发作从 interictal rest 进入 seizure，又从 seizure 回到 rest，这两个转变在动力系统里属于哪种 bifurcation？** <sup class="citation">[<a href="#ref-1">1</a>]</sup>

一句话概括：这章把一次 seizure 看成“静息吸引子”和“发作振荡吸引子”之间的状态切换；发作起始和终止各有几种 canonical bifurcation，二者组合起来就是 seizure 的 **dynamotype**。这套 Taxonomy of Seizure Dynamics（TSD）想补充 ILAE 的 operational classification：ILAE 更像临床表型语言，TSD 更像机制语言。

## 缩写和术语

| 缩写 / 术语 | 全称 | 这篇文章里的意思 |
|---|---|---|
| TSD | Taxonomy of Seizure Dynamics | 按 seizure onset / offset 的 bifurcation 类型给发作分型。 |
| dynamotype | dynamic type | 一次发作的 onset bifurcation 和 offset bifurcation 组合。 |
| bifurcation | 分岔 | 系统参数缓慢变化到临界点后，稳定状态结构突然改变。 |
| attractor | 吸引子 | 系统状态长期会靠近的稳定模式，可以是 fixed point 或 limit cycle。 |
| stable fixed point | 稳定定点 | 静息状态的数学表示：系统受扰动后会回到这个点附近。 |
| limit cycle | 极限环 | 周期振荡状态的数学表示：这里对应 seizure-like rhythmic spiking。 |
| separatrix | 分界轨道 | 区分不同吸引子 basin 的边界。 |
| DC shift | baseline shift | 信号基线突变，帮助区分某些 onset / offset 类型。 |
| ISI | interspike interval | 相邻 spike 的时间间隔；ISI 变大等价于 spiking frequency 下降。 |
| SN | saddle-node bifurcation | 发作起始候选类型之一，可伴 DC shift。 |
| SupH | supercritical Hopf bifurcation | 稳定定点失稳并长出小振幅 limit cycle。 |
| SNIC | saddle-node on invariant circle | 发作起始或终止候选类型，频率可按 square-root law 变化。 |
| SubH | subcritical Hopf bifurcation | 发作起始候选类型，可产生突然进入大振幅振荡的转变。 |
| SH | saddle-homoclinic bifurcation | 发作终止候选类型之一，ISI 可按 logarithmic law 增大。 |
| FLC | fold limit cycle bifurcation | 发作终止候选类型之一，limit cycle 消失。 |

## 先把问题说清楚

临床上的 seizure classification 通常从患者能看到的现象出发：focal 还是 generalized，awareness 是否受损，motor 还是 non-motor，有没有 tonic、clonic、automatism 等。这种分类对诊断和沟通很有用，但它不一定告诉我们“发作为什么会开始、为什么会停止”。

TSD 换了一个视角。它不先问症状，而是看电生理时间序列的几个轴：

| 轴 | 读什么 | 为什么重要 |
|---|---|---|
| baseline | 有没有 DC shift / baseline jump | 区分带基线跳变和不带基线跳变的 bifurcation。 |
| amplitude | spike 或振荡幅度是突变、逐渐增大、逐渐减小，还是无规律 | 对应 limit cycle 出现或消失的方式。 |
| ISI / frequency | spiking 是变快、变慢，还是基本恒定 | 频率接近 0 或非 0 是 bifurcation 的关键指纹。 |
| onset / offset | 在发作开始和结束分别读这些轴 | dynamotype 是起始类型和终止类型的组合，不是单看 onset。 |

## 最小数学图景

这一章背后的最小模型可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
\frac{dx}{dt} &= F(x,\lambda).
\end{aligned}
\tag{1}
</script>

这里 $x$ 是神经组织的状态，不是某一个单独 EEG 电压点；$\lambda$ 是缓慢变化的控制参数，可以理解为兴奋性、抑制性、离子环境、网络耦合等因素压缩后的“慢变量”。当 $\lambda$ 慢慢移动，系统可能从 stable fixed point 跳到 limit cycle，于是电生理上从 interictal rest 进入 rhythmic seizure activity。

一次 seizure 的 dynamotype 可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
D &= (B_{\mathrm{on}}, B_{\mathrm{off}}).
\end{aligned}
\tag{2}
</script>

$B_{\mathrm{on}}$ 是起始 bifurcation，$B_{\mathrm{off}}$ 是终止 bifurcation。本文列出的起始类型有 4 种：SN、SupH、SNIC、SubH；终止类型也有 4 种：SNIC、SupH、SH、FLC。因此理论上有：

<script type="math/tex; mode=display">
\begin{aligned}
4 \times 4 &= 16
\end{aligned}
\tag{3}
</script>

种 onset / offset 组合，也就是 16 种 dynamotypes。

## 六种 bifurcation 怎么读

Figure 18-2 是全章最适合反复看的图。它把每种 bifurcation 的 timeseries、amplitude、frequency、baseline jump 和 seizure start/stop 方向放在同一张表里。

![Figure 18-2：bifurcation scaling laws](/images/sheheitli-2024-seizure-dynamics/fig18-2-page.png)

**图 18-2 怎么读。** 左边是 bifurcation 名字，中间是理想化时间序列，右边列出 amplitude 和 frequency 在临界点附近是否趋近于 0、是否有 baseline jump、这个 bifurcation 能用于 seizure onset 还是 offset。关键不是背图形，而是抓“幅度是否从 0 长出”“频率是否从 0 长出”“有没有 DC shift”这三个判据。

| 类型 | 可用于 | 信号直觉 |
|---|---|---|
| SN | onset | 进入发作时幅度和频率突然出现，可伴 baseline shift。 |
| SupH | onset 或 offset | onset 时小振幅振荡逐渐长大；offset 时幅度逐渐减小。 |
| SNIC | onset 或 offset | onset 时频率从 0 开始增加；offset 时频率逐渐降到 0。 |
| SubH | onset | 可突然跳入较大振幅振荡，通常无 baseline shift。 |
| SH | offset | 终止前 ISI 逐渐变长，频率按 logarithmic trend 下降。 |
| FLC | offset | limit cycle 消失，常表现为 amplitude / frequency 的 arbitrary ending。 |

## Figure 18-1：为什么要讲 phase space

![Figure 18-1：phase space 中的 attractor 和 separatrix](/images/sheheitli-2024-seizure-dynamics/fig18-1-page.png)

**图 18-1 怎么读。** 这张图不是临床 EEG，而是 phase space 示意图。实心点是 stable fixed point，闭合曲线是 stable limit cycle，虚线或分界曲线是 separatrix。对临床读者来说，最重要的是：发作不是“波形突然变了”这么简单，而是系统原本被吸引到静息定点，参数变化后吸引子结构改变，状态轨迹被带入振荡吸引子。

因此，bifurcation classification 不是给 EEG 波形贴漂亮标签，而是在问：**从静息到振荡的拓扑改变是哪一种？**

## Figure 18-3 和 18-4：真实 SEEG 怎么映射到 dynamotype

![Figure 18-3：SN onset 与 FLC offset 示例](/images/sheheitli-2024-seizure-dynamics/fig18-3-page.png)

**图 18-3 怎么读。** 这是一个 sample observed dynamotype。第一行是 DC-coupled SEEG，第二行是 high-pass filtered signal，第三行和第四行给出对应的理论 time series 和 phase-space 演化。onset 侧有 DC shift 和突然进入振荡，符合 SN-like onset；offset 侧振荡消失更接近 FLC。这个图的重点是：同一段临床信号要同时看原始 DC-coupled trace 和 filtered trace，否则 baseline shift 这个判据会丢失。

![Figure 18-4 和 Figure 18-5：SupH / SH 与 SNIC / SubH 示例](/images/sheheitli-2024-seizure-dynamics/fig18-4-5-page.png)

**图 18-4 怎么读。** 这张图展示另一个 observed dynamotype：onset 侧没有明显 baseline shift，而 amplitude 逐渐增加，符合 SupH 的直觉；offset 侧 ISI 逐渐变长，接近 SH 的 logarithmic slowing。它提醒我们，发作终止也需要分类，不能只看 onset。

**图 18-5 怎么读。** Figure 18-5 单独展示 SNIC 和 SubH 在 phase space 中的差异。SNIC 的关键是频率从 0 附近长出或回到 0；SubH 的关键是从稳定定点附近突然进入较大振荡。临床上这两个可能都表现为“开始放电”，但动力系统判据不同。

## Table 18-1：临床数据上怎么判

![Table 18-1：visual classification system](/images/sheheitli-2024-seizure-dynamics/table18-1-page.png)

**表 18-1 怎么读。** 这张表把数学判据变成 clinical reviewer 可以执行的流程。先由 clinician 指定 candidate seizure onset regions，再选 onset 时 amplitude 最高的电极时间序列，观察 seizure 前 10 个 spike 和后 10 个 spike 的 amplitude / ISI 趋势，并判断有没有 DC shift。

| 观察到的特征 | Onset 归类 |
|---|---|
| 有 DC shift | SN(+DC) |
| amplitude 增加 | SupH |
| ISI 变小，也就是 frequency 增加 | SNIC |
| ISI 和 amplitude 恒定或 arbitrary，且没有 DC shift | SN(-DC) 或 SubH |

| 观察到的特征 | Offset 归类 |
|---|---|
| 有 DC shift | SH(+DC) |
| amplitude 减小 | SupH |
| ISI 变大，也就是 frequency 降低，且没有 DC shift | SH(-DC) 或 SNIC |
| ISI 和 amplitude 恒定或 arbitrary，且没有 DC shift | FLC |

这里有两个细节很重要。

第一，DC-coupled recording 不是可有可无。没有 DC 信息时，SN 和 SubH、SH 和 SNIC 之间可能分不清。换句话说，硬件带宽会影响 dynamotype 判读。

第二，作者没有说所有判别都必须自动化。章中明确提到，噪声很强的临床数据里，expert visual classification 反而可能比自动算法更可靠；自动算法、可视化判读和理论 scaling law 是互相约束的关系。

## 临床数据结果

这一章总结了 Saggio 等 2020 年在多中心 intracranial EEG 数据上的应用结果。数据来自 7 个中心、120 名 focal onset seizure 患者。TSD 理论预测 16 种 dynamotype；临床数据中观察到 12 种。主要出现的 onset 类型是 SN 和 SubH，主要出现的 offset 类型是 SH/SNIC 和 FLC <sup class="citation">[<a href="#ref-2">2</a>]</sup>。

![Figure 18-6：Taxonomy of Seizure Dynamics 总结](/images/sheheitli-2024-seizure-dynamics/fig18-6-page.png)

**图 18-6 怎么读。** 这张图把 onset / offset bifurcation 的组合结果放到 taxonomy 里。左侧强调所有 onset 和 offset 类型都在数据中出现过；右侧显示 39 名同时有 onset 和 offset classification 的患者最终落到哪些 dynamotype。它的重点不是某个比例数字，而是证明：真实临床 iEEG 不是只有一种“典型 seizure dynamics”，而是可以落在有限但多样的 dynamical repertoire 里。

## 为什么这对 SEEG 有意义

TSD 对 SEEG 的价值主要有三点。

第一，它把 **DC-coupled recording** 的价值重新放到中心。没有 DC baseline，某些 bifurcation 的关键判据会消失。对只看 high-pass filtered SEEG 的读者来说，这一点很容易被忽略。

第二，它让“起始模式”不只停留在 LVFA、spike、slow wave 这类形态标签，而是进一步问 amplitude、frequency、baseline 三个轴的时间演化。两个患者可以有不同病理、不同脑区，但表现出相似 dynamotype；同一患者也可能有多个 dynamotype。

第三，它给刺激治疗和闭环设备一个机制提醒。章中提到，SubH onset 更像 resonator，需要特定频率刺激才容易被驱动；SN onset 更像 integrator，对刺激是兴奋性还是抑制性更敏感。也就是说，如果一个患者的发作不止一种 dynamotype，那么单一刺激策略未必覆盖所有状态。

## 需要谨慎的地方

第一，TSD 不是替代 ILAE classification。ILAE 解决的是临床沟通、诊断和症状描述；TSD 解决的是发作起止机制的低维动力学描述。二者是互补关系。

第二，TSD 不直接处理空间传播。它关心局部神经组织的 dynamical transition，而不是 seizure front 如何从一个脑区传播到另一个脑区。章中也提醒，传播现象可能让某个 stationary sensor 看到的时间特征类似另一种 bifurcation。

第三，visual classification 依赖高质量信号和合理的 candidate onset region。噪声、滤波设置、缺失 DC channel、spike 形态复杂，都可能让分类变成 ambiguous。

## 我会怎么用这篇文章

如果读 SEEG seizure onset，我不会把它直接变成“看见某个波形就等于某个 dynamotype”的模板。更实用的做法是：

1. 先用临床和 SEEG 经验圈出 candidate onset contacts。
2. 在这些 contacts 上分别看 DC-coupled trace 和常规滤波 trace。
3. 对 onset 读 baseline、amplitude、ISI / frequency 三个轴。
4. 对 offset 也读同样三个轴。
5. 把 onset / offset 组合成 dynamotype，并把 ambiguous 的地方明确标出来。

这篇文章真正有价值的地方，是把“发作起始模式”从形态学语言推到机制语言：同样是 seizure，起始和终止可以由不同 bifurcation 组织起来；这些差异可能影响我们怎样解释 DC shift、怎样做刺激、怎样理解同一患者内多个发作类型。

## 参考文献

<span id="ref-1" class="ref-label">[1]</span> Sheheitli H, Wang H, Lemarechal J-D, Bernard C, Jirsa VK. A Classification of Seizures Based on Dynamics. In: *Jasper's Basic Mechanisms of the Epilepsies*. 5th ed. Oxford University Press; 2024. DOI: [10.1093/med/9780197549469.003.0018](https://doi.org/10.1093/med/9780197549469.003.0018).

<span id="ref-2" class="ref-label">[2]</span> Saggio ML, Crisp D, Scott JM, Karoly P, Kuhlmann L, Nakatani M, et al. A taxonomy of seizure dynamotypes. *eLife*. 2020;9:e55632. DOI: [10.7554/eLife.55632](https://doi.org/10.7554/eLife.55632).
