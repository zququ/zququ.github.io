---
title: Brief interictal iEEG 深度学习：只用 5 分钟静息 SEEG 能不能判断 SOZ
date: 2026-06-05 17:30:00
tags:
  - SEEG
  - iEEG
  - seizure onset zone
  - deep learning
  - SHAP
  - benchmark
comments: true
---

这篇文章总结 Sundrani 等 2025 年发表在 *Epilepsia* 的研究：`Deep learning on brief interictal intracranial recordings can accurately characterize seizure onset zones`。它的问题非常临床：如果不等病人在 EMU 里自然发作，只拿 5 分钟静息 interictal SEEG/iEEG，能不能用深度学习判断哪些脑区属于 seizure onset zone？<sup class="citation">[<a href="#ref-1">1</a>]</sup>

这篇文章和许多 seizure detection 论文不同。它不是检测某段信号是不是 ictal，而是用 interictal resting SEEG 直接做 SOZ 区域分类。作者使用 78 名 drug-resistant epilepsy 患者、超过 100 万个 interictal SEEG segment，训练一个多通道、多尺度、一维 CNN，并用 SHAP 看模型到底关注了哪些波形。

## 缩写表

| 缩写 | 全称 | 在这篇文章里的意思 |
| --- | --- | --- |
| iEEG | intracranial electroencephalography | 颅内脑电总称，包含 SEEG 等形式。 |
| SEEG | stereo-electroencephalography | 立体定向脑电，本文主要数据来源。 |
| SOZ | seizure onset zone | 发作起始区，模型需要分类的目标区域。 |
| EMU | epilepsy monitoring unit | 癫痫监测病房，传统上需要等待自然发作。 |
| CNN | convolutional neural network | 卷积神经网络，用原始波形学习特征。 |
| DK atlas | Desikan-Killiany atlas | 解剖脑区 atlas，用于把 contact 分配到脑区。 |
| SHAP | Shapley Additive Explanation | 模型解释方法，用来估计输入时间点对预测的贡献。 |
| IED | interictal epileptiform discharge | 发作间期癫痫样放电，包括 spike、sharp transient 等。 |
| RNS | responsive neurostimulation | 反应性神经刺激，文中作为 outcome 分组之一。 |
| DBS | deep brain stimulation | 脑深部刺激，文中用于 outcome 判断。 |
| Youden index | sensitivity + specificity - 1 | 综合敏感性和特异性的指标。 |

## 论文想解决什么

传统 SEEG 术前评估经常需要住院数天到数周，等待自发或诱发发作。问题是：如果患者发作少、双侧发作、或者监测期间没有充分记录到关键发作，SOZ 判断会被拖慢。本文提出一个更激进的想法：只用 resting interictal SEEG，也就是发作间期、非 SPES、闭眼休息状态的短时数据，训练模型识别 SOZ。

作者的假设是：SOZ 不只在 ictal onset 时才有信息，interictal 信号里也可能包含区域特异的异常波形或低幅度形态。深度学习可以不预设特征，直接从原始波形里学习这些模式。

## 数据和预处理

每名患者采集 5 分钟 resting SEEG。原始信号经过 Butterworth filter，保留 1-59 Hz、61-119 Hz、121-150 Hz 三个频段，相当于避开 60 Hz 附近工频干扰。然后把信号切成 30 秒窗口，stride 为 18 秒，所以每名患者大约得到 16 个窗口。

电极定位方面，作者用术后 CT 和自定义 SEEG planning 软件 CRAVE，把每个 contact 分配到 DK atlas 脑区。SOZ 标签按脑区定义：如果某 DK 区域包含被临床判定参与 ictal onset 的 contact，则该区域标为 SOZ。

## 模型整体流程

![方法流程图](/images/brief-interictal-intracranial-recordings-soz/fig1-methodology.png)

**图 1 怎么读。** A-B：从 5 分钟 resting SEEG 中取 30 秒窗口，并从同一解剖区域里抽取 4 个 contact 的组合。C：输入进入 multi-head、multi-scale 的一维 CNN；不同 kernel size 对应不同时间尺度，可以同时看短暂尖波和较长时间模式。D：模型输出 contact set 或 anatomical region 是否属于 SOZ。E：训练后用 SHAP 分析输入波形，找哪些时间点和波形形态对 SOZ/非 SOZ 判断贡献最大。

输入可以抽象成一个 4 通道、30 秒长的矩阵：

<script type="math/tex; mode=display">
\begin{aligned}
X_R \in \mathbb{R}^{4 \times T}.
\end{aligned}
\tag{1}
</script>

这里 $R$ 是一个解剖区域，4 是从该区域中抽取的 contact 数量，$T$ 是 30 秒窗口内的采样点数。模型输出该区域属于 SOZ 的概率：

<script type="math/tex; mode=display">
\begin{aligned}
\hat{p}_R = f_{\theta}(X_R).
\end{aligned}
\tag{2}
</script>

这不是手工特征工程。作者没有先计算频带功率、连接矩阵或 spike rate，而是把预处理后的原始波形送进 CNN。

## 为什么要抽 4 个 contact

作者只纳入至少有 4 个 contact 的区域，并对每个区域抽取所有 4-contact permutation。这样做有两个目的。第一，让不同区域的输入形状一致，模型都看到 4 条通道。第二，一个区域里不同 contact 组合可以形成大量训练样本，使模型看到区域内部信号的多样性。

但这也带来一个限制：模型判断的是 sampled contact set 或 region，不是单个 contact 的精确病理状态。最后的区域级结果需要对多个组合、多个窗口的预测做 aggregation。

## 损失函数和评价指标

论文提到模型使用 weighted binary cross-entropy。可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
\mathcal{L}
=
-w_1 y\log(\hat{p})
-w_0(1-y)\log(1-\hat{p}).
\end{aligned}
\tag{3}
</script>

$y=1$ 表示 SOZ，$y=0$ 表示 non-SOZ。$w_1$ 和 $w_0$ 用来处理类别不平衡。SOZ 区域通常比 non-SOZ 少，如果不用权重，模型可能倾向于预测多数类。

文章报告 sensitivity、specificity、accuracy 和 Youden index。Youden index 很适合看模型有没有同时兼顾敏感性和特异性：

<script type="math/tex; mode=display">
\begin{aligned}
J = \operatorname{Sensitivity} + \operatorname{Specificity} - 1.
\end{aligned}
\tag{4}
</script>

$J=0$ 接近随机，$J=1$ 表示敏感性和特异性都达到 1。

## 整体性能

![五折 held-out 测试表现](/images/brief-interictal-intracranial-recordings-soz/fig2-heldout-performance.png)

**图 2 怎么读。** A 展示 contact-aggregated sensitivity、specificity、accuracy，并和随机标签模型比较。B 展示 Youden index，也和随机标签比较。模型在 held-out test set 上明显优于随机标签：locationwise sensitivity 为 0.702，specificity 为 0.741，accuracy 为 0.738；contactwise aggregation 的 sensitivity 为 0.646，specificity 为 0.693，accuracy 为 0.688。这个结果说明 interictal resting SEEG 中确实存在可被模型利用的 SOZ 相关信息。

这里要注意，“优于随机”不等于“可以直接替代临床判断”。0.738 的区域级 accuracy 说明模型有辅助价值，但还远没到独立决定手术靶区的程度。

## 脑区表现和 outcome 分层

![脑区和 outcome 分层表现](/images/brief-interictal-intracranial-recordings-soz/fig3-region-outcome-performance.png)

**图 3 怎么读。** A 按 DK 脑区统计分类准确率。18 个样本足够的区域里，13 个区域显著高于 chance。表现最好的区域包括左下颞回、左上颞回、右外侧眶额回、右上额回和右中央后回；表现较差的区域包括左杏仁核、左颞极、右缘上回、右岛叶和左中央前回。B 按 1 年 outcome 分组：Engel I 或 RNS responder 的患者准确率最高，Engel II-IV/RNS nonresponder 次之，未手术或随访不足者更低。

这个 outcome 分层很重要。模型训练标签来自临床 SOZ 判断，而 favorable outcome 可以看成标签更可信的间接证据。如果手术或刺激效果不好，可能说明原始 SOZ 标签就不够准确或病灶更弥散，模型性能自然会被影响。

## SHAP：模型到底看到了什么波形

SHAP 的基本思想是把模型输出拆成各输入特征的贡献：

<script type="math/tex; mode=display">
\begin{aligned}
f(x) = \phi_0 + \sum_{k=1}^{M}\phi_k.
\end{aligned}
\tag{5}
</script>

$\phi_k$ 表示第 $k$ 个输入位置对预测的贡献。红色代表更支持 SOZ 预测，蓝色代表更支持 non-SOZ 预测。对 SEEG 波形来说，SHAP 可以告诉我们：模型是因为 spike、sharp transient、large deflection 还是某些低幅度形态而做出判断。

![SHAP 混淆矩阵示例](/images/brief-interictal-intracranial-recordings-soz/fig4-shap-confusion-examples.png)

**图 4 怎么读。** A 是 true positive：模型预测 SOZ，临床标签也是 SOZ。红色 SHAP 集中在 spike、HFO-like activity 和 large deflection 附近。B 是 false positive：模型预测 SOZ，但标签是 non-SOZ；这些片段也有类似 sharp transient，因此可能“像 SOZ”。C 是 true negative：信号更平滑、低幅度，蓝色贡献更多。D 是 false negative：SOZ 区域没有明显大幅异常，模型可能漏掉更微弱或更复杂的异常形态。

这张图的意义在于，模型并不是完全不可解释。它确实关注了临床熟悉的 IED 形态，但也可能被 non-SOZ 区域的尖锐瞬变误导。

## 中位数归一化和直方图均衡化

作者还比较了 median/IQR normalization 和 histogram equalization 两种输入归一化策略。前者更保留原始幅度形态，所以大 spike 和大 deflection 更突出；后者会弱化幅度差异，让低幅度形态也有机会被模型关注。

![SHAP 归一化策略对比](/images/brief-interictal-intracranial-recordings-soz/fig5-shap-normalization.png)

**图 5 怎么读。** A 是 median normalization 表现更好的例子。大幅异常波形对模型判断贡献明显，histogram equalization 反而可能过度强调低幅度 deflection，导致错误倾向。B 是 histogram equalization 表现更好的例子。这里 median normalization 可能忽略了一些低幅度但有意义的 epileptiform morphology，而 histogram equalization 把这些信息凸显出来。

这个结果很有启发：SOZ 相关信息不一定都是“肉眼很大的 spike”。一些低幅度、形态 subtle 的波形也可能有价值。后续如果做自动 IED 或 SOZ 模型，不能只把大幅尖波当作唯一目标。

## 这篇文章的强点

第一，问题设置很有临床意义。它直接挑战“必须记录到发作才能定位 SOZ”的传统依赖，尝试用短时 interictal resting data 做区域级判断。

第二，输入是 feature-agnostic 的原始波形。相比手工计算 spike rate、频带能量、功能连接，它给了模型发现未知形态的空间。

第三，SHAP 分析没有停留在漂亮热图，而是联系到 true positive、false positive、true negative、false negative，并进一步比较归一化策略对波形解释的影响。

## 需要谨慎的地方

第一，这是单中心 78 名患者数据。不同中心的采样率、滤波、参考方式、电极规划和标注习惯都可能影响泛化。

第二，SOZ 标签不是绝对真值。文章也承认 outcome 分析提示 label accuracy 会影响模型表现。深度学习模型再强，也会被不稳定标签拖累。

第三，模型一次只看一个区域的 4-contact 组合，没有显式建模跨区域传播网络。因此它更像“区域是否有 SOZ-like interictal signature”的分类器，而不是完整 seizure network 模型。

第四，5 分钟可能不足以覆盖所有 interictal variability。对于 spike 稀少、睡眠状态依赖明显或发作网络复杂的患者，更长时间或不同状态的数据可能必要。

## 一句话总结

这篇文章可以理解为：用 5 分钟 resting interictal SEEG，按解剖区域抽 4-contact、30 秒窗口，训练多尺度 1D CNN 判断区域是否属于 SOZ，再用 SHAP 解释模型关注的 IED 和低幅度波形。它在 benchmark 里的位置很清楚：代表“不依赖 ictal seizure 捕获、直接从 interictal 原始波形学习 SOZ signature”的路线。

## 参考文献

<span id="ref-1" class="ref-label">[1]</span> Sundrani S, Johnson GW, Doss DJ, Makhoul GS, Monroy Lerma BH, Reda A, Cavender AC, Liao E, Rogers BP, Williams Roberson S, Bick SK, Morgan VL, Englot DJ. Deep learning on brief interictal intracranial recordings can accurately characterize seizure onset zones. *Epilepsia*. 2025;66:3180-3192. doi: <a href="https://doi.org/10.1111/epi.18478">10.1111/epi.18478</a>.
