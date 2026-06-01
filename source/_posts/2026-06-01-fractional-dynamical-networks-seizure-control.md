---
title: Fractional dynamical networks：用分数阶动力学稳定癫痫网络
date: 2026-06-01 20:25:00
tags:
  - iEEG
  - 癫痫
  - Warning
  - Neurostimulation
  - Dynamical Systems
  - MathJax
comments: true
---

# Fractional dynamical networks：用分数阶动力学稳定癫痫网络

Wang、Ashourvan、Ramos 和 Pereira 2026 年发表在 *Scientific Reports* 的这篇 *Stabilizing fractional dynamical networks suppresses epileptic seizures*，不是典型的 seizure prediction 分类模型，而是把 iEEG 建成 **fractional-order dynamical network**，再用稳定化控制把 ictal network 的特征值拉回稳定区域<sup class="citation">[<a href="#ref-s1">1</a>]</sup>。

它和 warning 方向的关系在于：warning 不是只做“发作前报警”，更深一层是识别脑网络是否正在接近不稳定状态，以及如果进入 ictal 状态，能不能给出可计算的控制策略。本文的核心结论是，分数阶动力学的两个量，fractional-order exponent 和 eigenvalue，可以区分 interictal、pre-ictal、ictal、post-ictal 四个状态；在 35 次自发发作的模拟控制中，作者报告 34/35 次 seizure activity 被有效抑制，控制后信号幅度平均下降约 49%。

需要先把边界说清楚：这是用真实 iEEG 数据估计模型后的 **in silico control**，不是已经在人体内闭环刺激验证。它更像是在回答“如果我们能从患者当前 iEEG 估计出一个分数阶网络，理论上应该怎样改动网络耦合，才能把系统拉回稳定区”。

## 缩写速查

| 缩写 | 全称 | 在本文里的含义 |
| --- | --- | --- |
| iEEG | intracranial EEG | 颅内脑电，来自植入电极，空间分辨率高于 scalp EEG |
| SOZ | seizure onset zone | 发作起始区，图中常用红色通道标出 |
| FODN | fractional-order dynamical network | 分数阶动力学网络，用分数阶差分描述多尺度记忆效应 |
| alpha | fractional-order exponent | 分数阶指数，越小通常表示越强的长程历史依赖 |
| A | system matrix / coupling matrix | 通道之间的空间耦合矩阵 |
| A0 | effective stability matrix | 扣除分数阶对角项后的有效稳定性矩阵 |
| lambda | eigenvalue | 特征值，用来判断系统是否稳定 |
| rho | spectral radius | 谱半径，也就是最大绝对特征值 |
| GL | Grunwald-Letnikov | 分数阶导数的离散化形式 |
| OLS | ordinary least squares | 普通最小二乘，用于初始估计系统矩阵 |
| LASSO | least absolute shrinkage and selection operator | 带 L1 正则的稀疏估计 |
| ADMM | alternating direction method of multipliers | 用来求解 LASSO 的优化算法 |
| KS test | Kolmogorov-Smirnov test | 比较两个分布是否不同 |
| Cohen's d | standardized effect size | 标准化效应量，用来衡量差异大小 |
| RNS | responsive neurostimulation | 响应式神经刺激系统，临床已使用但通常依赖预设触发模式 |

## 1. 这篇论文真正想解决什么

![Figure 1：分数阶建模与稳定化控制总览](/images/fractional-dynamical-networks-seizure-control/fig1-overview-fractional-control.png)

*图 1。图源：Wang et al. 2026 原文 Figure 1，DOI: 10.1038/s41598-026-43151-1。*

Figure 1 是全文的总览。A 展示一个完整 seizure snapshot，黄色是 pre-ictal，橙色是 ictal，紫色是 post-ictal，红色线条标出 SOZ 电极。B 是 ictal 起始时各电极估计出的分数阶指数 alpha；C 是 ictal 时估计的空间耦合矩阵 A；D 把有效系统矩阵的特征值画到复平面；E 和 F 用拟合信号与真实信号、R2 分布来检查模型能否重建 iEEG；G 是状态反馈控制结构。

这张图给出的逻辑是：

1. 先从 iEEG 估计一个分数阶动力学系统。
2. 用 alpha 描述多尺度历史依赖，用 A 描述电极之间的耦合。
3. 用特征值判断网络稳定性。
4. 如果 ictal 网络不稳定，就设计一个控制项，把特征值推回稳定区域。

它不是直接问“哪个通道最像发作”，而是问“这个多通道脑网络的动力学是否稳定，如果不稳定，怎么最小化地改动耦合结构让它稳定”。

## 2. 为什么要用分数阶模型

普通一阶线性系统常写成：

<script type="math/tex; mode=display">
\begin{aligned}
x[k+1] &= A x[k]
\end{aligned}
\tag{1}
</script>

式 (1) 的含义是，下一时刻的状态只依赖当前状态。对很多工程系统这很方便，但对脑信号可能太短视。iEEG 里存在跨尺度的历史依赖，当前活动不仅受上一采样点影响，也可能受更长时间范围内的网络回响、突触动力学和振荡状态影响。

分数阶模型把这个“历史记忆”显式写进系统：

<script type="math/tex; mode=display">
\begin{aligned}
\Delta^\alpha x[k] &= A x[k-1]
\end{aligned}
\tag{2}
</script>

式 (2) 里，$x[k]$ 是所有电极在第 $k$ 个离散时刻组成的状态向量，$A$ 是电极间耦合矩阵，$\Delta^\alpha$ 是分数阶差分算子。alpha 不是一个普通参数，它决定当前状态对过去多远的信号还有多强依赖。

对第 $i$ 个电极，分数阶差分可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
\Delta^{\alpha_i} x_i[k]
&=
\sum_{j=0}^{k}
\Psi(\alpha_i,j)\,x_i[k-j]
\end{aligned}
\tag{3}
</script>

式 (3) 里，$j$ 是往回看的时间滞后，$\Psi(\alpha_i,j)$ 是 Grunwald-Letnikov 权重。论文给出的权重为：

<script type="math/tex; mode=display">
\begin{aligned}
\Psi(\alpha_i,j)
&=
\frac{\Gamma(j-\alpha_i)}
{\Gamma(-\alpha_i)\Gamma(j+1)},
\quad j\ge 1
\end{aligned}
\tag{4}
</script>

式 (4) 里的 $\Gamma$ 是 Gamma 函数。直觉上，分数阶模型不是只看一个上一时刻，而是用一串按幂律衰减的权重看过去。alpha 越小，长程历史依赖越强；alpha 越接近 1，模型越接近普通一阶系统。

## 3. 四个状态：interictal、pre-ictal、ictal、post-ictal

![Figure 2：同一患者四个癫痫状态的 iEEG、R2、alpha 和 eigenvalue](/images/fractional-dynamical-networks-seizure-control/fig2-four-state-dynamics.png)

*图 2。图源：Wang et al. 2026 原文 Figure 2。*

Figure 2 用 HUP68 第 5 次 seizure 展示四个状态。每一列是一个状态：interictal、pre-ictal、ictal、post-ictal。每一行分别是：A，所有电极的滤波 iEEG；B，3 秒滑动窗里的 R2 热图；C，每个时间窗估计的 fractional-order exponents；D，每个时间窗估计的 eigenvalues。

这张图的重点不是“ictal 振幅变大”这么简单。它说明同一患者在四个状态下有两类变化：

1. 波形层面，ictal 期有更明显的高幅、有节律放电，SOZ 电极更突出。
2. 模型层面，alpha 和 eigenvalue 的分布也跟着状态改变。

作者的状态切分是：pre-ictal 取 seizure recording 的前 20 s，post-ictal 取最后 20 s，中间为 ictal；interictal 是距离任何 seizure 至少 3 h 的 100 s snapshot，再取 20 s 分析。每个 20 s 片段用 3 s 窗、1 s stride 滑动，因此每段得到 18 个窗口。

## 4. 数据和模型估计流程

数据来自 IEEG Portal，包含 10 名药物难治性癫痫患者、35 个 seizure blocks。6 名来自 Hospital of the University of Pennsylvania，4 名来自 Mayo Clinic；采样率分别为 512 Hz 和 500 Hz。患者接受的是术前评估中的颅内电极记录，电极包括 subdural grid 和 strip。

预处理包括 0.1 Hz high-pass filtering、去掉临床专家标注的 artifact electrodes、按四个状态分段。每个电极信号先做均值中心化，然后在 3 s 滑动窗中估计模型。

估计过程可以概括成三步：

1. 用 Haar wavelet 估计每个电极的 alpha。
2. 根据 alpha 计算分数阶差分，得到要拟合的导数项。
3. 用 OLS 和一次迭代的输入校正估计系统矩阵 A。

为了允许未记录脑区、皮层下输入或模型误差，作者把式 (2) 扩展为：

<script type="math/tex; mode=display">
\begin{aligned}
\Delta^\alpha x[k]
&=
A x[k-1] + B u[k]
\end{aligned}
\tag{5}
</script>

式 (5) 中，$u[k]$ 表示未观测输入，$B$ 表示这些输入进入记录网络的方式。每个时刻的输入通过 LASSO 估计：

<script type="math/tex; mode=display">
\begin{aligned}
\min_{u[k]}\;
\frac{1}{2}
\left\lVert
z[k]-A^{(i)}x[k-1]-Bu[k]
\right\rVert_2^2
+
\mu\left\lVert u[k]\right\rVert_1
\end{aligned}
\tag{6}
</script>

式 (6) 的第一项要求模型预测接近分数阶导数观测，第二项要求未观测输入尽量稀疏。论文中 $\mu=0.5$，求解用 ADMM。估计出输入后，再更新 A：

<script type="math/tex; mode=display">
\begin{aligned}
A^{(i+1)}
&=
(Z-BU)X^\top(XX^\top)^{-1}
\end{aligned}
\tag{7}
</script>

最终作者只做一次迭代，因为更多迭代没有显著降低均方误差。

## 5. alpha 和 eigenvalue 如何区分状态

![Figure 3：四个状态下 alpha 与 eigenvalue 的分布](/images/fractional-dynamical-networks-seizure-control/fig3-fractional-exponents-eigenvalues.png)

*图 3。图源：Wang et al. 2026 原文 Figure 3。*

Figure 3 是全患者、全电极汇总的 violin plot。A 是 alpha，B 是有效系统矩阵 $A_0$ 的 eigenvalue。作者只把模型拟合足够好的 segment 纳入统计，也就是至少 60% 电极在所有时间窗中 R2 不低于 0.5。

结果上，alpha 从 interictal 到 ictal 逐步降低：interictal 中位数 0.75，pre-ictal 0.68，ictal 0.63，post-ictal 又升到 0.78。按照分数阶模型的解释，alpha 变小意味着长程记忆效应增强。也就是说，随着发作接近和进入发作期，当前活动更依赖较远过去的状态，表现出更强的历史依赖和多尺度结构。

eigenvalue 的解释稍有不同。作者构造有效稳定性矩阵：

<script type="math/tex; mode=display">
\begin{aligned}
A_0 &= A - D(\alpha,1)
\end{aligned}
\tag{8}
</script>

式 (8) 中，$D(\alpha,1)$ 是由分数阶差分产生的对角项。稳定性不是直接看 A，而是看 $A_0$ 的特征值。若最大绝对特征值小于 1，系统被认为稳定：

<script type="math/tex; mode=display">
\begin{aligned}
\left|\lambda\right| &< 1,
\quad
\lambda \in \sigma(A_0)
\end{aligned}
\tag{9}
</script>

式 (9) 里，$\sigma(A_0)$ 表示 $A_0$ 的全部特征值。直觉上，特征值越靠近或超过单位圆，系统越接近不稳定或已经不稳定。

## 6. 分布比较：population pooled 和 within-patient

![Figure 4：群体合并后的状态两两比较](/images/fractional-dynamical-networks-seizure-control/fig4-population-pairwise-comparisons.png)

*图 4。图源：Wang et al. 2026 原文 Figure 4。*

Figure 4 是把所有患者的数据先合并，再做状态间两两比较。A 和 C 是 KS statistic，分别用于 alpha 和 eigenvalue；B 和 D 是 Cohen's d，分别衡量 alpha 和 eigenvalue 的效应量。所有比较都达到统计显著，但更值得看的是 effect size，而不是只看 p 值。

群体合并分析的结果显示，alpha 的状态差异通常比 eigenvalue 更明显，ictal 与其他状态的分离更突出。这说明 alpha 对“状态表征”很敏感，而 eigenvalue 更像是“稳定性风险”的量。

![Figure 5：患者内平均后的状态两两比较](/images/fractional-dynamical-networks-seizure-control/fig5-within-patient-comparisons.png)

*图 5。图源：Wang et al. 2026 原文 Figure 5。*

Figure 5 改成 within-patient 分析：先在每个患者内部计算两两比较，再跨患者平均。这个做法比 population pooled 更保守，因为它不让样本多的患者主导总体结论，也能更好处理患者间差异。

within-patient 的效应量反而更大，尤其 alpha 的 Cohen's d 多处达到大效应。这个结果支持一个重要判断：分数阶特征不是只在某些患者身上偶然有效，而是在患者内部也能比较稳定地区分脑状态。不过患者差异仍然存在，不能把 group-level 的统计直接当成单患者治疗策略。

## 7. 稳定化控制到底在做什么

作者的控制目标不是随便降低振幅，而是找到一个尽量稀疏的耦合修正矩阵，让系统稳定。理想形式是：

<script type="math/tex; mode=display">
\begin{aligned}
\min_{\widetilde{A}\in\mathbb{R}^{N\times N}}
\left\lVert \widetilde{A}\right\rVert_0
\quad
\mathrm{s.t.}\quad
(A+\widetilde{A},\alpha)
\ \mathrm{is\ globally\ asymptotically\ stable}
\end{aligned}
\tag{10}
</script>

式 (10) 中，$\left\lVert\cdot\right\rVert_0$ 统计非零元素个数。它表达的是“用最少的连接改动稳定网络”。但 L0 优化通常不可 tractable，所以论文改用 L1 松弛：

<script type="math/tex; mode=display">
\begin{aligned}
\min_{\widetilde{A}\in\mathbb{R}^{N\times N}}
\left\lVert \widetilde{A}\right\rVert_1
\quad
\mathrm{s.t.}\quad
\rho(A+\widetilde{A}-D(\alpha,1)) < 1
\end{aligned}
\tag{11}
</script>

式 (11) 中，$\rho(\cdot)$ 是 spectral radius，也就是最大绝对特征值。约束项就是要求控制后的有效矩阵特征值全部进入单位圆。

论文进一步把解写成：

<script type="math/tex; mode=display">
\begin{aligned}
\widetilde{A} &= LP^{-1}
\end{aligned}
\tag{12}
</script>

然后通过凸优化求 P 和 L：

<script type="math/tex; mode=display">
\begin{aligned}
\min_{P,L}\;&
\left\lVert P\right\rVert_1
+
\left\lVert L\right\rVert_1\\
\mathrm{s.t.}\;&
\begin{bmatrix}
P & PA_0^\top + L^\top\\
A_0P + L & P
\end{bmatrix}
\succ 0,\quad
P \succ I
\end{aligned}
\tag{13}
</script>

式 (13) 是这篇方法的控制核心。它把“稳定化”变成一个可计算的矩阵优化问题。最终控制后用 $A_{\mathrm{ctrl}}=A+\widetilde{A}$ 重新模拟信号，看 seizure onset zone 的波形是否被压低。

## 8. 控制后，特征值回到单位圆内

![Figure 6：控制前后特征值在复平面中的位置](/images/fractional-dynamical-networks-seizure-control/fig6-eigenvalue-stabilization.png)

*图 6。图源：Wang et al. 2026 原文 Figure 6。*

Figure 6 展示 HUP68 第 3 次 seizure 的控制效果。红色点是控制前的 eigenvalues，蓝色点是控制后的 eigenvalues。虚线圆是单位圆。控制前，有特征值靠近或越过稳定边界；控制后，特征值整体被拉到单位圆内部。

这张图是控制理论意义上的关键证据。它说明控制不是只在波形上做平滑，也不是简单滤波，而是改变模型系统矩阵，使其满足式 (9) 的稳定性条件。换句话说，控制目标是网络动力学稳定，而不是单纯把信号振幅压小。

## 9. 控制后，SOZ 波形幅度下降

![Figure 7：控制前后 SOZ 信号对比](/images/fractional-dynamical-networks-seizure-control/fig7-controlled-ictal-signals.png)

*图 7。图源：Wang et al. 2026 原文 Figure 7。*

Figure 7 把 HUP68 第 3 次 seizure 的 SOZ 电极信号拿出来看。左边是原始 ictal onset，右边是控制后的模拟信号。原始 SOZ 平均振幅为 159.03 microvolt，控制后为 60.54 microvolt，下降 61.9%。

这张图更接近临床直觉：如果一个控制策略能把 SOZ 通道的 ictal activity 压低，那么它可能有 seizure suppression 的意义。但仍要注意，这是基于模型重建的 simulated controlled signals，不是实际刺激病人大脑后的记录。它证明的是模型内控制策略有潜力，而不是证明临床疗效已经成立。

## 10. 35 次 seizure 的整体控制效果

![Figure 8：每次 seizure 的幅度下降百分比](/images/fractional-dynamical-networks-seizure-control/fig8-amplitude-reduction.png)

*图 8。图源：Wang et al. 2026 原文 Figure 8。*

Figure 8 汇总 35 次 seizure 的幅度下降。蓝色表示原本需要控制的不稳定网络，灰色表示 ictal 时已经满足稳定条件的网络。虚线分隔不同患者。

论文报告平均幅度下降 48.96% ± 16.94%。在 seizure onset 时，22/35 次 seizure 的分数阶动力学网络不稳定，13/35 次本身已经稳定。对 22 个不稳定 ictal networks，控制后有 17 个满足稳定性条件，成功率为 77%。整体看，只有 1 次 seizure 在控制后振幅增加。

失败案例也有信息量。8 次没有被稳定的 seizure 包括 HUP68 seizure 5、HUP78 seizures 1-5、MAYO016 seizure 2 和 MAYO020 seizure 6。作者分析发现，失败案例的优化问题更病态，P、L 矩阵的条件数和范数都明显更大，提示某些患者或某些 seizure 的网络重组太强，仅靠这种线性耦合修正可能不够。

## 11. 这篇论文的价值

这篇工作的价值有三层。

第一，它把“癫痫状态”从波形描述推进到动力学参数描述。alpha 描述多尺度历史依赖，eigenvalue 描述稳定性。它们不是传统频带功率或 spike rate，而是模型层面的状态变量。

第二，它把 warning 和 intervention 连起来。常规 seizure prediction 停在“预测 preictal”；本文进一步问，如果网络已经进入或接近 ictal 不稳定状态，能不能计算一个控制项把系统拉回稳定。

第三，它提供了可解释的患者个体模型。A、alpha、eigenvalue、控制修正矩阵都可以追溯到具体患者、具体电极、具体 seizure，而不是只给一个黑箱分类概率。

## 12. 局限和不能过度解读的地方

第一，样本量仍然小。10 名患者、35 次 seizure 足以展示方法潜力，但不足以证明不同病因、不同植入方案、不同电极覆盖范围下都可靠。

第二，这是 retrospective iEEG 数据上的 in silico 控制。真实闭环刺激还要解决刺激伪迹、延迟、能量约束、安全阈值、电极可刺激性和实时计算问题。

第三，模型拟合好不等于控制一定可行。作者自己也指出，有些 seizure 拟合并不差，但优化问题病态，仍然无法得到稳定控制解。

第四，控制矩阵的生理含义需要谨慎。数学上改动 $A$ 可以理解为改动耦合，但临床刺激并不能任意改变每一条脑网络边。未来需要把控制输入映射到可执行的刺激参数。

第五，本文目前主要分析 alpha 和 eigenvalue。作者也提到，后续分析 eigenvectors 可能有助于定位哪些空间模式驱动状态转变，这一点对刺激靶点选择会更关键。

## 13. 一句话总结

这篇论文把癫痫发作理解为分数阶脑网络的状态转移和稳定性问题：alpha 反映长程记忆，eigenvalue 反映网络是否靠近不稳定，控制策略则尝试用最小耦合修正把 ictal 网络拉回单位圆内。它不是临床闭环刺激已经成功的证据，但为个体化、模型驱动的 seizure suppression 提供了一个清晰的数学框架。

## 参考文献

<span id="ref-s1" class="ref-label">[1]</span> Wang, Y.; Ashourvan, A.; Ramos, G.; Pereira, E. A. *Stabilizing fractional dynamical networks suppresses epileptic seizures*. **Scientific Reports** 2026, 16, 16037. DOI: [10.1038/s41598-026-43151-1](https://doi.org/10.1038/s41598-026-43151-1).
