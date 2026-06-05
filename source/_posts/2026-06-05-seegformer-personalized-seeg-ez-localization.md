---
title: SEEGformer：用个体化 Transformer 做发作检测和 EZ 定位
date: 2026-06-05 17:20:00
tags:
  - SEEG
  - epilepsy
  - epileptogenic zone
  - transformer
  - benchmark
comments: true
---

这篇文章总结 Wang 等 2026 年发表在 *eBioMedicine* 的 `SEEGformer`。这是一篇很适合放进 SEEG benchmark 的工作，因为它不是只在公开小数据集上做 seizure detection，而是直接面向临床最关心的两个任务：个体化发作检测和 epileptogenic zone 定位。作者使用 61 名患者、两个中心、三个 cohort 的 SEEG/iEEG 数据，内部 cohort 还有 MRI 重建和电极空间坐标，用来训练每个病人自己的 SEEGformer。<sup class="citation">[<a href="#ref-1">1</a>]</sup>

这篇文章最值得抓住的主线是：它把 SEEG 信号拆成 Fourier transform 后的 real part、imaginary part 和 amplitude 三路表示，再把 MRI 提供的电极空间位置编码进 Transformer，让模型既看到“信号的相位/幅度信息”，也看到“这些通道在脑里的空间关系”。

## 缩写表

| 缩写 | 全称 | 在这篇文章里的意思 |
| --- | --- | --- |
| SEEG | stereo-electroencephalography | 长期颅内脑电监测数据，是模型输入主体。 |
| iEEG | intracranial EEG | 颅内脑电的泛称，外部公开数据集使用 iEEG 表述。 |
| EZ | epileptogenic zone | 致痫区，临床希望定位并处理的核心区域。 |
| AUROC det | AUROC for detection | 发作检测任务的 AUROC。 |
| AUROC loc | AUROC for localisation | EZ 定位任务的 AUROC，把电极风险分数视作二分类概率。 |
| AUPRC | area under precision-recall curve | 类别不平衡时常用的检测性能指标。 |
| NDCG | normalized discounted cumulative gain | 排名指标，考虑电极与 EZ 的相关等级和排序位置。 |
| FFT | fast Fourier transform | 把 SEEG 从时域转到频域。 |
| Re&Im | real and imaginary parts | Fourier 变换后的实部和虚部，携带相位信息。 |
| Amp | amplitude | Fourier 变换后的幅度信息。 |
| PE | positional encoding | 位置编码，这篇文章中特别强调 MRI 空间位置编码。 |
| PLV | phase-locking value | 相位锁定值，用来分析区域间相位同步。 |

## 论文想解决什么

临床 SEEG 监测往往持续两到三周，每个病人可能产生数 TB 数据。医生需要在大量 ictal、interictal 和 abnormal discharge 中判断 EZ，这个过程耗时且主观。SEEGformer 的目标不是替代医生，而是给出一个数据驱动的风险排序：哪些电极更像 EZ，哪些时间片对发作检测更关键。

作者强调个体化训练。原因是癫痫高度异质：不同病人的电极植入方案、病灶位置、传播网络、发作类型都不一样。把所有病人混成一个统一模型可能很难解释；每个病人训练一个模型，更接近临床“为这个病人做术前评估”的工作方式。

![SEEGformer 总览](/images/seegformer-personalized-seeg-ez-localization/fig1-system-overview.png)

**图 1 怎么读。** 这张图分三层。第一层是临床流程：术前 MRI、SEEG 植入、长期监测。第二层是模型输入：SEEG 信号经过 FFT 后形成 real part、imaginary part、amplitude 三路表示，MRI 重建得到电极三维坐标并形成空间位置编码。第三层是输出：模型做 seizure detection，同时利用 attention matrix 给每个电极计算 epileptogenic risk score，再排序定位 EZ。图 1b 展示并行 Transformer 结构，说明 SEEGformer 不是把全部通道直接拼成一个大向量，而是把每个电极作为 token，让 self-attention 学通道间依赖。

## 为什么要用 Fourier 三路输入

SEEG 原始信号是时域波形。作者先做 FFT，把每个 1 秒片段转到频域。普通做法常只用 amplitude，也就是频率成分有多强。但这篇文章把实部和虚部也保留下来，因为实部和虚部共同决定相位，而相位关系可能与 EZ 网络同步有关。

可以把 Fourier 表示直观理解为：

<script type="math/tex; mode=display">
\begin{aligned}
X(f) &= \operatorname{Re}(X(f)) + i\,\operatorname{Im}(X(f)),\\
|X(f)| &= \sqrt{\operatorname{Re}(X(f))^2 + \operatorname{Im}(X(f))^2},\\
\phi(f) &= \operatorname{atan2}\left(\operatorname{Im}(X(f)), \operatorname{Re}(X(f))\right).
\end{aligned}
\tag{1}
</script>

幅度 $|X(f)|$ 说明某个频率强不强；相位 $\phi(f)$ 说明该频率成分处在周期的哪个位置。两个通道的相位关系稳定，往往意味着它们有同步关系。后面作者用 PLV 分析解释模型 attention，也正是围绕这个思路。

## Transformer 里每个电极是一个 token

假设一个病人有 $N$ 个电极通道，SEEGformer 把每个通道编码成 token，并额外加入一个 classification token，所以总 token 数是 $N+1$。self-attention 的作用是让一个电极 token 在更新表示时，可以参考其他电极 token。

论文中的注意力可以概括为：

<script type="math/tex; mode=display">
\begin{aligned}
A_{j \to i}
&= \operatorname{Softmax}\left(\frac{Q_jK_i^{T}}{\sqrt{d_k}}\right).
\end{aligned}
\tag{2}
</script>

$Q_j$ 是第 $j$ 个电极的 query，$K_i$ 是第 $i$ 个电极的 key，$d_k$ 是 key 的维度。这个分数表示模型在更新某个 token 时，对另一个 token 的关注强度。通俗说，就是“第 $j$ 个电极的信息对第 $i$ 个电极的判断有多重要”。

更新后的电极表示可以写成加权求和：

<script type="math/tex; mode=display">
\begin{aligned}
z_i = \sum_{j=1}^{N+1} A_{j \to i}V_j.
\end{aligned}
\tag{3}
</script>

$V_j$ 是 value 向量。Transformer 的优势在这里很明显：它不需要预先规定某两个电极必须连接，而是从数据中学习哪些通道之间应该互相参考。

## MRI 空间位置编码为什么重要

普通 Transformer 本身不知道 token 的空间位置。语言模型靠 positional encoding 知道词语顺序，SEEGformer 则靠 MRI 重建的电极三维坐标告诉模型：这些通道在脑里相距多远、处于什么空间结构中。

这一步的临床意义是：SEEG 通道不是一串没有空间关系的数字，而是插在脑内不同解剖位置的 contact。两个通道信号相似，如果它们空间上也接近，含义可能和两个远距离通道相似不同。作者的 ablation 结果也显示，spatial position encoding 对 EZ localisation 明显有帮助，但对 seizure detection 帮助不明显。这说明“能不能检测发作”和“能不能把 EZ 排准”不是同一个问题。

## 从 attention 到电极风险分数

作者没有让模型直接输出“某电极是不是 EZ”，而是把最后 Transformer block 的 attention 拿出来，计算每个电极的风险分数。对于第 $i$ 个电极、第 $t$ 秒，先把 real part 和 imaginary part 的 attention 相加：

<script type="math/tex; mode=display">
\begin{aligned}
\alpha_i^t
&= \operatorname{Re}\left(att_i^t\right)
 + \operatorname{Im}\left(att_i^t\right),\\
\alpha_i
&= \sum_{t=1}^{T}\alpha_i^t.
\end{aligned}
\tag{4}
</script>

这里作者没有把 amplitude attention 纳入 EZ 风险分数，因为 amplitude 在 EZ localisation 上表现较差。这个结果很有意思：幅度信息可能很适合检测“有没有发作”，但不一定适合判断“哪里是致痫区”。

之后作者定义全局中位数阈值 $M$，统计某个电极在多少秒里 attention 超过 $M$。频次越高，说明该电极越常被模型当成关键通道。最后再做 max-min normalization 得到 EZ risk score。

## 排名评价：为什么用 NDCG

临床 EZ 不是简单的 0/1。文章把电极分成 level 1、level 2、level 3 和 non-EZ，相关性依次设为 0.6、0.3、0.1、0。因此作者除了 AUROC loc，还用了 NDCG 评估排序质量：

<script type="math/tex; mode=display">
\begin{aligned}
\operatorname{NDCG}
=
\frac{
\sum_{i=1}^{n}\dfrac{rel_i}{\log_2(i+1)}
}{
\sum_{i=1}^{n}\dfrac{rel_i^{\mathrm{ideal}}}{\log_2(i+1)}
}.
\end{aligned}
\tag{5}
</script>

NDCG 的直觉是：相关性高的电极排得越靠前越好。如果 level 1 电极排到前面，得分高；如果 level 3 或 non-EZ 排在前面，得分低。这个指标比单纯 precision@K 更适合临床分级标签。

## 内部 cohort 结果

![内部 cohort 表现和 attention 可视化](/images/seegformer-personalized-seeg-ez-localization/fig2-internal-cohort-performance.png)

**图 2 怎么读。** a-c 展示发作检测性能，比较 Re&Im、Amp、Re&Im&Amp 和加入 spatial PE 的 Re&Im&Amp。Amp 在病人平均 AUROC 上很强，但整体上 Re&Im&Amp 更稳。d 是电极风险排序例子，可以看到高风险电极与临床 EZ level 对齐。e-f 是 EZ 定位的 NDCG 和 AUROC loc 对比，加入 spatial PE 后定位效果最好。g 是 attention heatmap，颜色越深表示模型越关注对应通道和时间。这个图的关键结论是：发作检测和 EZ 定位需要的信息不完全相同。

内部 27 名病人中，SEEGformer 的平均 seizure detection AUROC det 为 0.914，平均 AUPRC det 为 0.927；EZ localisation 的平均 AUROC loc 为 0.798，平均 NDCG 为 0.784。作者还报告 top 2% 电极命中情况：14/27 名病人 precision@2% 达到 100%。这说明在不少病例里，模型最高风险的一小部分电极能落在临床 EZ 范围内。

## 三个直观病例

![SEEGformer 三个 EZ 定位病例](/images/seegformer-personalized-seeg-ez-localization/fig3-three-ez-cases.png)

**图 3 怎么读。** 这张图把 SEEGformer 预测的 EZ 区域和临床诊断区域放到 3D 脑模型上比较。三个病例分别涉及右海马-杏仁核、左海马-杏仁核、左颞极到颞叶外侧面。红色区域代表模型或临床标注的高风险区域。它展示的是模型输出能否转化为医生容易理解的空间图，而不是只给一个 AUROC 数字。

需要注意：这种图的可信度依赖 MRI 重建、电极定位和临床 EZ 标注。SEEGformer 给的是风险排序，不是病理诊断本身。

## 外部数据集和相位同步解释

![外部 cohort 和 PLV 分析](/images/seegformer-personalized-seeg-ez-localization/fig4-public-phase-analysis.png)

**图 4 怎么读。** a-f 是两个 SWEC-ETHZ 外部 cohort 的 seizure detection 结果，说明 SEEGformer 在不同来源 iEEG 数据上仍有较好检测表现。g 把 seizure detection 与 EZ localisation 的结果画成散点，相关性不明显，进一步说明检测强不等于定位准。h-l 是 PLV 分析：作者按 attention 阈值选择模型认为重要的 seizure clips，再比较 EZ 内、EZ 与 non-EZ 之间、non-EZ 内以及全脑 PLV。EZ 内和 EZ-non-EZ 的相位同步随 attention 阈值升高呈现更明显差异，说明模型关注的片段确实携带与 EZ 网络相关的相位信息。

PLV 可以这样理解：

<script type="math/tex; mode=display">
\begin{aligned}
\operatorname{PLV}_{ab}
=
\left|
\frac{1}{T}
\sum_{t=1}^{T}
e^{i(\phi_a(t)-\phi_b(t))}
\right|.
\end{aligned}
\tag{6}
</script>

如果两个通道的相位差 $\phi_a(t)-\phi_b(t)$ 很稳定，复数平均后的模长接近 1，PLV 高；如果相位差乱飘，平均后相互抵消，PLV 低。作者用它来说明 SEEGformer 的 attention 不是完全黑箱，它倾向于选出相位同步结构更特殊的 EZ 相关片段。

## 这篇文章的强点

第一，任务更接近真实临床。它同时做 seizure detection 和 EZ localisation，而且内部数据来自长期 SEEG 和 MRI，而不是只在短片段公开 EEG 上做分类。

第二，模型解释做得比较完整。attention heatmap、电极风险排序、三维脑模型可视化、PLV 相位同步分析，构成了一条从模型输出到临床解释的链条。

第三，ablation 结果给出一个重要结论：amplitude 更利于检测发作，real/imaginary 加空间位置更利于定位 EZ。这对后续设计模型很有启发。

## 需要谨慎的地方

第一，每个病人训练个体化模型，临床解释性强，但工程成本也高。需要足够 ictal 和 interictal 片段，且每个病人的数据清洗、标注和训练都要单独处理。

第二，EZ ground truth 仍来自临床判断和术后结果，不是绝对真值。对于术后效果不佳的病人，模型低分可能是模型错误，也可能提示临床 EZ 标注或治疗范围不完整。

第三，外部 cohort 只有 seizure detection，没有 EZ localisation 标注，因此泛化到外部数据的定位能力还没有被充分验证。

## 一句话总结

SEEGformer 的核心贡献是把 SEEG 的频域相位/幅度信息、MRI 电极空间位置和 Transformer 通道依赖建模结合起来，用个体化模型同时完成发作检测和 EZ 风险排序。它提醒我们：benchmark 不能只看检测 AUROC，还要看模型是否能把“为什么这个通道重要”解释回临床空间和相位网络。

## 参考文献

<span id="ref-1" class="ref-label">[1]</span> Wang C, Hong J, Liu S, Jiao R, Wang R, Xue B, Fang X, Yuan Y, Zu W, Chen Y, Zhang Y, Wang Y, Lu S, Jiang X, Wan Y, Li L, Xu J, Jin C. SEEGformer: personalised SEEG-based seizure detection and epileptogenic zone localisation for drug-resistant epilepsy. *eBioMedicine*. 2026;123:106085. doi: <a href="https://doi.org/10.1016/j.ebiom.2025.106085">10.1016/j.ebiom.2025.106085</a>.
