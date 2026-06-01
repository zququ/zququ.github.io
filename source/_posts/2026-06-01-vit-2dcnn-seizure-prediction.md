---
title: ViT-2DCNN 癫痫发作预测：把 STFT 时频图和电极熵空间图融合起来
date: 2026-06-01 16:40:00
tags:
  - EEG
  - 癫痫预测
  - Warning
  - ViT
  - CNN
  - MathJax
comments: true
---

# ViT-2DCNN 癫痫发作预测：把 STFT 时频图和电极熵空间图融合起来

Yao 和 Chen 2026 年这篇 *Epilepsy seizure prediction based on ViT-2DCNN spatio-temporal fusion model* 做的是癫痫发作预测，不是发作检测。发作检测通常是在 seizure 已经发生后识别 ictal 片段；发作预测则希望在 seizure onset 前提前给出 warning。论文把 CHB-MIT scalp EEG 切成 5 s 片段，把发作前 35 min 到 5 min 定义为 preictal，把远离发作的背景期定义为 interictal，然后训练模型区分这两类片段<sup class="citation">[<a href="#ref-s1">1</a>]</sup>。

这篇文章最值得看的地方不是单纯把 ViT 和 CNN 拼在一起，而是输入设计：一支分支看 **STFT time-frequency map**，另一支分支看按 10-20 电极布局组织的 **entropy distribution map**。前者强调频率和时间上的动态变化，后者强调电极空间上的复杂度分布。最后用 gated fusion 让两个模态互相调制，再做 preictal/interictal 分类。

## 缩写速查

| 缩写 | 全称 | 在这篇论文里的含义 |
| --- | --- | --- |
| EEG | electroencephalography | 头皮脑电信号；本文数据来自 CHB-MIT，不是 SEEG |
| CHB-MIT | Children's Hospital Boston - MIT scalp EEG database | 儿童难治性癫痫 scalp EEG 公共数据集 |
| STFT | short-time Fourier transform | 把 5 s EEG 片段转成时间-频率图 |
| ViT | Vision Transformer | 用 self-attention 建模时频图里的长程依赖 |
| 2DCNN | two-dimensional convolutional neural network | 处理按电极空间排布的熵图 |
| MSA | multi-scale spatial attention | 2DCNN 分支里的多尺度空间注意力，分别关注行、列和局部邻域 |
| GFM | gated fusion module | 门控融合模块，让时频特征和空间熵特征互相增强 |
| ApEn | approximate entropy | 近似熵，描述时间序列复杂度 |
| SampEn | sample entropy | 样本熵，近似熵的改进形式 |
| PermEn | permutation entropy | 排列熵，关注序列相对排序模式 |
| FuzzEn | fuzzy entropy | 模糊熵，用模糊隶属度刻画相似性 |
| DiffEn | differential entropy | 微分熵，连续变量分布不确定性的度量 |
| preictal | pre-seizure state | 发作前状态；本文定义为 onset 前 35-5 min |
| interictal | between-seizure state | 发作间期背景状态；本文取距离发作足够远的片段 |
| ictal | seizure state | 发作期 |
| postictal | post-seizure state | 发作后恢复期 |
| TP / TN | true positive / true negative | TP 是 preictal 判对；TN 是 interictal 判对 |
| FP / FN | false positive / false negative | FP 是误报；FN 是漏报 |

## 1. 任务到底是什么

![Figure 1：ViT-2DCNN 总体流程](/images/vit-2dcnn-seizure-prediction/fig1-overall-architecture.png)

*图 1。图源：Yao and Chen 2026 原文 Figure 1，DOI: 10.1088/2057-1976/ae744a。*

Figure 1 给出整篇论文的流程。左边是原始 EEG，先经过两条预处理路线：一路做 STFT，得到 time-frequency map；另一路计算多种 entropy，然后按 10-20 电极布局组织成 entropy distribution map。中间是双分支网络：ViT 负责时频图，2DCNN 负责熵空间图。右边是 gated fusion 和最终分类。

这张图要抓住一个重点：模型不是直接把 18 个 EEG 通道丢进一个黑箱。作者先人为构造了两个互补视角：

1. 时频视角：一个通道在 5 s 内，哪些频段、哪些时间段发生变化。
2. 空间视角：不同电极位置的信号复杂度是否形成某种分布模式。

这个设计适合 seizure prediction 的原因是，preictal 变化往往不是单个时间点的尖峰，而是节律、复杂度、空间同步性逐渐变化。只看时间序列可能漏掉空间结构；只看空间统计又会丢掉频率演变。因此作者把二者并行建模。

## 2. 发作预测的四个状态

![Figure 2：发作相关的四个状态](/images/vit-2dcnn-seizure-prediction/fig2-four-seizure-stages.png)

*图 2。图源：Yao and Chen 2026 原文 Figure 2。*

Figure 2 把一段 EEG 按时间拆成 interictal、preictal、ictal 和 postictal。本文真正用于分类的是 interictal 和 preictal。preictal 取 seizure onset 前 35 min 到 5 min，最后 5 min 留作 seizure prediction horizon，也就是理论上的干预缓冲时间。interictal 则取远离相邻 seizure 的片段，避免把发作前后恢复期误当作普通背景。

这个定义决定了模型回答的问题：它不是在问“现在是不是正在发作”，而是在问“这个 5 s 片段是否来自发作前一段可预警窗口”。如果临床使用，模型输出阳性并不等于 seizure 已经开始，而是表示当前 EEG 更像 preictal 状态。

## 3. 数据切片和标签

论文使用 CHB-MIT 数据集。这个数据集包含 23 名儿童患者的 scalp EEG，采样率 256 Hz。作者统一选取 18 个常用双极导联：

FP1-F7、F7-T7、T7-P7、P7-O1、FP1-F3、F3-C3、C3-P3、P3-O1、FP2-F4、F4-C4、C4-P4、P4-O2、FP2-F8、F8-T8、T8-P8、P8-O2、FZ-CZ、CZ-PZ。

每个样本是一个 5 s 非重叠窗口。因为采样率是 256 Hz，所以每个通道有 1280 个采样点，单个样本可以看成：

<script type="math/tex; mode=display">
\begin{aligned}
X_i &\in \mathbb{R}^{18 \times 1280}
\end{aligned}
\tag{1}
</script>

式 (1) 中，18 表示通道数，1280 表示 5 s 内的采样点数。标签为二分类：

<script type="math/tex; mode=display">
\begin{aligned}
y_i &\in \{0,1\}
\end{aligned}
\tag{2}
</script>

式 (2) 中，$y_i=1$ 表示 preictal，$y_i=0$ 表示 interictal。论文尽量让 preictal 和 interictal 样本数量接近，避免训练时模型只学会偏向多数类。

## 4. STFT 分支：把时间序列转成时频图

![Figure 3：STFT 时频图示例](/images/vit-2dcnn-seizure-prediction/fig3-stft-time-frequency.png)

*图 3。图源：Yao and Chen 2026 原文 Figure 3。*

Figure 3 展示了不同通道 EEG 经过 STFT 后形成的 time-frequency map。纵轴是频率，横轴是时间，颜色表示对应时间-频率位置的能量或幅值。作者先得到大约 0-128 Hz 的频率范围，再裁剪到 0-56 Hz，因为癫痫预测常用信息主要集中在低频到中高频范围，过高频段在 scalp EEG 中更容易混入噪声和肌电成分。

STFT 可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
X(\tau,f)
&=
\int x(t)\,\omega(t-\tau)\,e^{-j2\pi ft}\,dt
\end{aligned}
\tag{3}
</script>

式 (3) 里，$x(t)$ 是原始 EEG，$\omega(t-\tau)$ 是滑动窗口，$f$ 是频率，$\tau$ 是窗口中心时间。它的意思是：不要对整段 5 s 信号只算一个总频谱，而是在不同时间位置分别看频谱如何变化。这样可以保留“某个频段在某个时间段增强”的信息。

论文中的 STFT map 尺寸最终为 28 x 40。28 对应裁剪后的频率 bins，40 对应时间 frames。ViT 分支把这张时频图沿时间方向拆成 40 个 patch，每个 patch 大致对应一个时间帧上的频率向量。这样做的直觉是：让 Transformer 在时间维度上看不同时间帧之间的关系，同时每个 token 自带该时间点的频率结构。

## 5. 电极布局：为什么不是普通二维图片

![Figure 4：10-20 电极系统](/images/vit-2dcnn-seizure-prediction/fig4-10-20-system.png)

*图 4。图源：Yao and Chen 2026 原文 Figure 4。*

Figure 4 是 10-20 scalp EEG 电极系统。它说明 EEG 通道不是没有空间含义的编号列表。FP、F、C、P、O、T 等位置分别对应额极、额区、中央区、顶区、枕区和颞区。preictal 变化如果存在空间模式，模型应该知道“相邻电极”“左右半球”“前后位置”这些关系。

不过这篇论文没有把 EEG 直接插值成连续头皮地形图，而是使用一个简化的 4 x 5 电极布局矩阵。这个矩阵不是解剖精确坐标图，而是把 18 个双极导联按近似空间关系排列，空缺位置用 0 填充。这样做的好处是输入很小，适合 2D convolution；坏处是空间关系是粗略的，不能替代真实电极坐标或 source localization。

## 6. Entropy map：把每个通道的复杂度放回空间位置

![Figure 5：熵图构建流程](/images/vit-2dcnn-seizure-prediction/fig5-entropy-map-construction.png)

*图 5。图源：Yao and Chen 2026 原文 Figure 5。*

Figure 5 解释 entropy distribution map 怎么构建。对每个 5 s EEG 片段，作者先在每个通道上计算 entropy 特征，然后按电极布局放入 4 x 5 网格。如果使用 $n$ 种 entropy，输入可以看成：

<script type="math/tex; mode=display">
\begin{aligned}
E_i &\in \mathbb{R}^{4 \times 5 \times n}
\end{aligned}
\tag{4}
</script>

式 (4) 中，4 x 5 是电极布局网格，$n$ 是 entropy 类型数。论文比较了 Approximate Entropy、Sample Entropy、Permutation Entropy、Fuzzy Entropy 和 Differential Entropy，最后认为 permutation entropy、fuzzy entropy、differential entropy 的组合在性能和计算量之间更平衡。

这些 entropy 可以理解为“信号复杂度”的不同侧面：

- Permutation Entropy 看局部序列的相对排序模式，适合捕捉波形结构变化。
- Fuzzy Entropy 用模糊相似度减少硬阈值敏感性，适合处理 EEG 这种噪声较大的信号。
- Differential Entropy 从连续分布不确定性角度描述信号，常用于 EEG 情绪识别和脑电特征工程。

这里要注意：entropy map 不是原始波形，也不是功率谱图。它把每个通道的复杂度压缩成少量统计量，再把这些统计量按空间位置组织起来。因此 2DCNN 分支看到的是“哪个位置更复杂、哪个位置更规则、这种模式在左右/前后是否有结构”，不是完整的时间序列。

## 7. Preictal 和 interictal 的 entropy 图有什么差别

![Figure 6：interictal 与 preictal entropy map 对比](/images/vit-2dcnn-seizure-prediction/fig6-interictal-preictal-entropy-map.png)

*图 6。图源：Yao and Chen 2026 原文 Figure 6。*

Figure 6 对比了 interictal 和 preictal 的 entropy distribution map。图里不同颜色代表不同 entropy 值，不同空间位置对应不同电极或导联。作者想表达的是：preictal 状态不只表现为某个通道幅值变大，也可能表现为某些空间位置的复杂度分布发生改变。

读这张图时不要把颜色解释成“病灶位置”。CHB-MIT 是 scalp EEG，且这篇论文做的是 prediction classification，不是 epileptogenic zone localization。颜色差异只说明模型输入中的 entropy pattern 有判别价值，不能直接推出 seizure onset zone 或脑区病理。

## 8. ViT-2DCNN 主体结构

![Figure 7：ViT-2DCNN 网络框架](/images/vit-2dcnn-seizure-prediction/fig7-vit-2dcnn-framework.png)

*图 7。图源：Yao and Chen 2026 原文 Figure 7。*

Figure 7 是网络主体。左侧 ViT 分支输入 STFT map，右侧 2DCNN 分支输入 entropy map。两条分支先分别提取特征，再进入融合模块。

ViT 分支的核心是 self-attention。常见写法是：

<script type="math/tex; mode=display">
\begin{aligned}
\mathrm{Attention}(Q,K,V)
&=
\mathrm{Softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
\end{aligned}
\tag{5}
</script>

式 (5) 中，$Q$、$K$、$V$ 分别是 query、key、value，$d_k$ 是 key 的维度。直观理解：每个时间 patch 都会去“询问”其他 patch 和自己有多相关，然后按相关性加权汇总信息。对 STFT 图来说，这可以捕捉不同时间帧之间的节律演变关系。

2DCNN 分支的核心是局部卷积和多尺度空间注意力。作者使用 1 x 3、3 x 1、3 x 3 三类卷积核，分别关注横向关系、纵向关系和局部邻域关系。这很适合 4 x 5 的小空间图，因为电极分布本身不是大图像，普通深层 CNN 容易过度复杂；多尺度注意力能在小图上显式强调不同方向的空间依赖。

## 9. 门控融合：不是简单拼接

![Figure 8：Gated fusion module](/images/vit-2dcnn-seizure-prediction/fig8-gated-fusion-module.png)

*图 8。图源：Yao and Chen 2026 原文 Figure 8。*

Figure 8 是 gated fusion module。很多多模态模型会直接 concatenate 两个分支特征，然后接一个 MLP。本文更进一步：让空间熵特征调制时频特征，也让时频特征反过来调制空间熵特征。

可以抽象成：

<script type="math/tex; mode=display">
\begin{aligned}
\widetilde{F}_{\mathrm{TF}}
&=
F_{\mathrm{TF}}
+
G_{\mathrm{S}\rightarrow\mathrm{TF}}
\odot
F_{\mathrm{TF}},\\
\widetilde{F}_{\mathrm{S}}
&=
F_{\mathrm{S}}
+
G_{\mathrm{TF}\rightarrow\mathrm{S}}
\odot
F_{\mathrm{S}}
\end{aligned}
\tag{6}
</script>

式 (6) 中，$F_{\mathrm{TF}}$ 是 time-frequency feature，$F_{\mathrm{S}}$ 是 spatial entropy feature，$G$ 是由另一模态生成的 gate，$\odot$ 表示逐元素乘法。这个结构的意思是：如果 entropy map 暗示某些空间模式重要，那么它可以增强或抑制 ViT 分支的某些时频特征；反过来，STFT 分支也可以影响空间特征的权重。

所以 gated fusion 的作用不是“把两个特征放在一起”这么简单，而是让两个视角互相选择重点。对于 seizure prediction，这种设计比硬拼接更合理，因为 preictal 变化可能同时依赖频率演变和空间分布。

## 10. Entropy 组合结果怎么看

![Figure 9：不同 entropy 组合的准确率比较](/images/vit-2dcnn-seizure-prediction/fig9-entropy-combination-accuracy.png)

*图 9。图源：Yao and Chen 2026 原文 Figure 9。*

Figure 9 比较不同 entropy 组合对准确率的影响。单一 entropy 能提供部分信息，但组合 entropy 往往更稳定。论文最后选择 permutation entropy、fuzzy entropy 和 differential entropy，是因为这个组合在平均准确率和计算复杂度之间较好。

这张图也说明一个容易忽略的问题：深度模型的性能不只取决于网络结构，也取决于输入表征。如果 entropy map 本身不能稳定区分 interictal 和 preictal，再复杂的融合模块也很难补救。相反，如果输入表征已经把关键状态差异组织得更清楚，模型可以更容易学习。

## 11. 训练和评价指标

论文使用 Python 3.9 和 PyTorch 2.0 训练模型，优化器为 AdamW，batch size 为 32，学习率为 $5\times10^{-4}$，weight decay 为 $1\times10^{-5}$，early stopping patience 为 15。主要实验是 patient-specific 的五折交叉验证，也就是每个患者单独训练和测试。

评价指标如下：

<script type="math/tex; mode=display">
\begin{aligned}
\mathrm{Accuracy}
&=
\frac{TP+TN}{TP+FP+TN+FN}
\end{aligned}
\tag{7}
</script>

<script type="math/tex; mode=display">
\begin{aligned}
\mathrm{Sensitivity}
&=
\frac{TP}{TP+FN}
\end{aligned}
\tag{8}
</script>

<script type="math/tex; mode=display">
\begin{aligned}
\mathrm{Specificity}
&=
\frac{TN}{TN+FP}
\end{aligned}
\tag{9}
</script>

<script type="math/tex; mode=display">
\begin{aligned}
\mathrm{Precision}
&=
\frac{TP}{TP+FP}
\end{aligned}
\tag{10}
</script>

<script type="math/tex; mode=display">
\begin{aligned}
\mathrm{F1}
&=
\frac{2\cdot \mathrm{Precision}\cdot \mathrm{Sensitivity}}
{\mathrm{Precision}+\mathrm{Sensitivity}}
\end{aligned}
\tag{11}
</script>

在这篇论文的任务里，TP 是 preictal 片段被正确判成 preictal，FN 是 preictal 被漏判成 interictal，FP 是 interictal 被误报成 preictal，TN 是 interictal 被正确排除。临床上 sensitivity 高意味着漏报少，specificity 高意味着误报少。seizure warning 系统不能只看 accuracy，因为 interictal 样本通常更多，过高误报也会让系统不可用。

## 12. 主要结果

在 CHB-MIT patient-specific 实验中，ViT-2DCNN 的平均结果为：

| 指标 | 平均值 |
| --- | ---: |
| Accuracy | 97.95% |
| Sensitivity | 98.36% |
| Specificity | 97.55% |
| F1-score | 97.98% |

论文还给了消融实验。大致结论是：

| 模型/输入 | 平均 Accuracy |
| --- | ---: |
| 只用 2DCNN + entropy values | 96.32% |
| 只用 2DCNN + entropy map | 97.10% |
| 只用 ViT + STFT | 97.02% |
| ViT-2DCNN + entropy values | 97.47% |
| ViT-2DCNN + entropy map | 97.95% |

这个消融结果支持三个判断：

1. STFT 分支和 entropy 空间分支各自都有判别能力。
2. 把 entropy 特征按电极布局组成 map，比只把 entropy values 当成普通向量更好。
3. 双分支融合比单分支更强，但提升幅度不是数量级变化，说明输入表征本身已经很关键。

和文中列出的其他 CHB-MIT 方法相比，ViT-2DCNN 的平均 accuracy、sensitivity、specificity 和 F1 都处在较高水平。尤其 sensitivity 98.36% 对 warning 任务很重要，因为漏掉 preictal 片段会直接降低预警价值。

## 13. 跨患者结果和真正难点

论文还做了初步 cross-patient 测试：目标患者留出，先用该患者一次 seizure 做 adaptation/validation，再在剩余 seizure 上测试。结果显示，不同患者差异很大。有些患者经过少量目标数据适配后明显改善，但也有患者效果仍然较差。

这个结果比平均准确率更接近真实问题。癫痫发作预测的核心难点不是“在一个患者已有大量标注片段时能不能拟合”，而是：

- 新患者数据很少时，模型能不能快速适配。
- seizure 数量少时，preictal 定义是否稳定。
- 不同患者的发作网络、药物、睡眠状态、伪迹和电极质量差异是否会破坏泛化。
- 模型输出是否能转化成低误报率、可执行的临床 alarm。

因此这篇论文的 patient-specific 结果很强，但不能直接等同于临床部署效果。它更像是在说明：STFT + entropy spatial map + gated fusion 是一个有效的特征融合方向。

## 14. 这篇文章的价值

这篇文章可以作为 EEG seizure warning 模型设计的一个清晰范例。它把输入分成两个互补层次：

1. STFT 负责动态节律和频谱变化。
2. Entropy map 负责空间复杂度分布。

模型结构也和这两个层次对应：

1. ViT 用来处理时间-频率 patch 之间的全局依赖。
2. 2DCNN 用来处理小尺度电极空间图。
3. Gated fusion 用来做跨模态调制。

这个思路对 SEEG 也有启发，但不能直接照搬。SEEG 的 contact 空间结构是三维植入轨迹，不是 scalp 10-20 网格；如果迁移到 SEEG，更合理的做法可能是按电极 shaft、contact 邻近关系、解剖脑区或功能连接矩阵构建图结构，而不是简单放成 4 x 5 图片。

## 15. 局限和阅读时要小心的地方

第一，CHB-MIT 是 scalp EEG 数据集，不是 SEEG。Scalp EEG 的空间分辨率、噪声来源和临床用途都不同于 SEEG。把这篇论文放在 warning 方向读是合理的，但不能把结果解释成 SEEG 发作起始区定位。

第二，patient-specific 五折交叉验证的平均指标很高，但如果切片级随机划分没有严格按 seizure 或时间段隔离，模型可能利用同一患者相邻片段的相似性得到偏乐观的结果。论文使用非重叠 5 s windows 来降低泄漏风险，但真正临床 warning 还需要按 seizure-level、recording-level 或 prospective protocol 验证。

第三，accuracy、sensitivity 和 specificity 还不够。实际预警系统还需要报告 false alarm rate、seizure prediction horizon、seizure occurrence period、每小时误报次数、连续报警合并规则，以及报警后可采取的干预策略。

第四，entropy map 的空间布局是简化版本。它能提供空间先验，但不是精确头模型，也不是 source imaging。Figure 6 中的空间差异应该被理解为分类特征，不应该被过度解释为病灶定位。

## 16. 一句话总结

ViT-2DCNN 的核心不是“又堆了一个 Transformer”，而是把 EEG preictal 状态拆成两个可学习视角：STFT 看时频演变，entropy map 看空间复杂度分布，再用门控融合让两种证据互相选择重点。它在 CHB-MIT patient-specific 实验上表现很强，但跨患者泛化和真实在线 warning 仍然需要更严格验证。

## 参考文献

<span id="ref-s1" class="ref-label">[1]</span> Yao, D.; Chen, D. *Epilepsy seizure prediction based on ViT-2DCNN spatio-temporal fusion model*. **Biomedical Physics & Engineering Express** 2026. DOI: [10.1088/2057-1976/ae744a](https://doi.org/10.1088/2057-1976/ae744a).
