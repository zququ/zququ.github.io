---
title: Adaptive graph learning with SEEG data：自适应图学习如何做 SOZ 定位
date: 2026-06-05 17:10:00
tags:
  - SEEG
  - epilepsy
  - seizure onset zone
  - graph neural network
  - benchmark
comments: true
---

这篇文章总结 Guo 等 2025 年发表在 *Biomedical Signal Processing and Control* 的工作：`Adaptive graph learning with SEEG data for improved seizure localization`。它的核心问题很直接：SEEG 多通道信号能不能不靠手工定义 PLV、PDC、相关系数这类固定连接指标，而是让模型自己为每个病人、每个时间片学习一个更适合 SOZ 定位的功能网络？<sup class="citation">[<a href="#ref-1">1</a>]</sup>

我的理解是，这篇文章的价值不在于“又做了一个 GNN”，而在于把两个过去常常分开的环节接了起来：先构建功能网络，再在网络上找异常节点。作者把这两件事放进同一个端到端框架里训练，因此网络的边权不是独立计算出来的静态指标，而是服务于后续发作预测和 SOZ 排名的自适应表示。

## 缩写表

| 缩写 | 全称 | 在这篇文章里的意思 |
| --- | --- | --- |
| SEEG | stereo-electroencephalography | 立体定向脑电，作为多通道颅内时间序列输入。 |
| SOZ | seizure onset zone | 发作起始区，最终希望定位的异常脑区或电极通道。 |
| FN | functional network | 功能网络，节点是 SEEG 通道，边表示通道间功能依赖。 |
| FC | functional connectivity | 功能连接，用来描述通道间同步、影响或相似性。 |
| GNN | graph neural network | 图神经网络，用于处理节点和边共同构成的功能网络。 |
| GCN | graph convolutional network | 图卷积网络，用邻接矩阵聚合邻居节点信息。 |
| LSTM | long short-term memory | 用来建模连续图快照之间的时间依赖。 |
| TCN | temporal convolutional network | 时间卷积网络，用不同感受野提取单通道 SEEG 特征。 |
| PLV | phase locking value | 常见手工功能连接指标，基于相位同步。 |
| Corr | Pearson correlation | 常见手工功能连接指标，基于线性相关。 |
| AP@K | average precision at K | 看排序前 K 个通道里 SOZ 命中质量。 |
| MAP@K | mean AP@K | 对每次发作的 AP@K 再取平均。 |

## 论文想解决什么

传统 SEEG 辅助定位通常有两条路线。第一条是逐通道检测 biomarker，比如 HFO、spike、focal abnormality，然后按检测频率推断 SOZ。第二条是先用 PLV、PDC、DTF、相关系数等方法构建功能网络，再用图论指标或图模型找异常节点。

这两条路线的问题是：特征和连接指标大多是预先固定的。不同病人的电极覆盖、病灶位置、传播方式和信号质量差异很大，固定指标不一定能泛化。作者因此提出 `Adaptive Spatial-Temporal GNN`：每个 SEEG 片段先生成节点属性和自适应邻接矩阵，再用 GCN 和 LSTM 同时处理空间关系和时间演化，最后用 attention 权重给通道排序。

![Adaptive ST-GNN 总览](/images/adaptive-graph-learning-seeg-localization/fig1-overview.png)

**图 1 怎么读。** 左侧输入是一串连续 SEEG segment。图构建模块先为每个通道生成 attribute vector，也就是节点特征；再根据这些节点特征计算通道之间的 functional connectivity weight，也就是邻接矩阵。中间得到的是随时间变化的 attribute graph sequence。右侧的图分析模块用 GCN 聚合空间依赖，用 LSTM 建模时间依赖。训练目标不是直接监督每个通道是不是 SOZ，而是预测未来片段处于 interictal 还是 ictal。最后，readout attention 给每个通道一个重要性分数，用这个分数排序来推断 SOZ。

## 数学对象：把 SEEG 片段变成动态图序列

作者把一段 SEEG 序列写成一串图快照。每个图快照有节点属性矩阵和邻接矩阵：

<script type="math/tex; mode=display">
\begin{aligned}
G &= \{g_{t-T}, \ldots, g_{t-1}\},\\
g_{\tau} &= (V_{\tau}, E_{\tau}),\\
V_{\tau} &\in \mathbb{R}^{N \times D},\\
E_{\tau} &\in \mathbb{R}^{N \times N}.
\end{aligned}
\tag{1}
</script>

这里 $N$ 是通道数，$D$ 是每个通道的特征维度，$V_{\tau}$ 保存第 $\tau$ 个时间片的节点特征，$E_{\tau}$ 保存通道间连接强度。模型学习一个函数 $f$，用过去 $T$ 个图快照预测当前片段标签：

<script type="math/tex; mode=display">
\begin{aligned}
\left[V_{(t-T):t-1}, E_{(t-T):t-1}\right] \xrightarrow{f} l_t,\qquad
l_t \in \{0,1\}.
\end{aligned}
\tag{2}
</script>

这一步很关键：文章没有直接拿“SOZ 标签”训练每个通道，而是用发作预测作为 weak supervision。因为每个片段是否接近 ictal/interictal 更容易定义，而通道级 SOZ 标签更依赖临床解释。

## 单通道特征：IEEG-TCN 做节点属性

每个通道先单独进入 IEEG-TCN，得到一个属性向量 $v_i$。所有通道拼起来就是节点属性矩阵 $V$：

<script type="math/tex; mode=display">
\begin{aligned}
x_i &\xrightarrow{\mathrm{IEEG\text{-}TCN}} v_i,\\
V &= [v_1, v_2, \ldots, v_N].
\end{aligned}
\tag{3}
</script>

![IEEG-TCN 特征提取结构](/images/adaptive-graph-learning-seeg-localization/fig2-ieeg-tcn.png)

**图 2 怎么读。** IEEG-TCN 的输入是单通道 SEEG segment。中间的 dilated causal convolution 用不同 dilation 扩大时间感受野，既能看到较短的尖波，也能看到较长的慢变模式。右侧示意 dilation 的效果：卷积核不是逐点连续滑动，而是隔着固定步长采样历史点。底部 temporal attention 把时间维度压缩成一个通道向量，这个向量后面会同时用于节点属性和邻接矩阵构建。

dilated causal convolution 可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
F(s) &= (x *_d f)(s)\\
&= \sum_{i=0}^{k-1} f(i)\,x_{s-d\cdot i}.
\end{aligned}
\tag{4}
</script>

式 (4) 里，$k$ 是卷积核大小，$d$ 是 dilation factor。$s-d\cdot i$ 表示只看当前点及其历史点，所以不会把未来信息泄漏进来。

TCN 后面接 gated mechanism：

<script type="math/tex; mode=display">
\begin{aligned}
h = \tanh(X) \odot \sigma(X).
\end{aligned}
\tag{5}
</script>

$\tanh(\cdot)$ 产生候选信息，$\sigma(\cdot)$ 决定通过比例，$\odot$ 是逐元素相乘。直观说，它不是把所有卷积输出都无条件传下去，而是给每个位置一个门控。

temporal attention 把时间特征矩阵 $H$ 压缩成通道向量 $v$：

<script type="math/tex; mode=display">
\begin{aligned}
\alpha &= \operatorname{Softmax}\left(\tanh(H)\mu^{T}\right),\\
v &= \alpha^{T}H.
\end{aligned}
\tag{6}
</script>

$\alpha$ 是不同时间点的权重。对 SEEG 来说，这很合理，因为一个 1 秒片段里并不是每个采样点都同样有用，模型需要更关注异常活动出现的时间段。

## 自适应邻接矩阵：边权来自节点特征相似性

这篇文章最重要的设计是邻接矩阵不再由 PLV、PDC 或 Corr 这类固定公式给出，而是由节点属性向量生成：

<script type="math/tex; mode=display">
\begin{aligned}
\tilde{E}_{\tau} &= V_{\tau}P,\\
E_{\tau}^{\mathrm{adp}} &= \operatorname{Softmax}\left(\operatorname{ReLU}\left(\tilde{E}_{\tau}\tilde{E}_{\tau}^{T}\right)\right).
\end{aligned}
\tag{7}
</script>

这里 $P$ 是可学习参数矩阵，$\tilde{E}_{\tau}$ 是把节点属性投影后的 embedding。$\tilde{E}_{\tau}\tilde{E}_{\tau}^{T}$ 本质上是在比较通道 embedding 的相似性；ReLU 去掉负值，Softmax 再把连接权重归一化。

这就是“adaptive graph learning”的核心：边权不再是外部先验，而是由模型在训练中学出来的。它的优势是能适应个体差异；代价是解释时必须检查学到的边是否符合临床或生理直觉。

## 图分析：GCN 处理空间，LSTM 处理时间

每个时间片的图先进入 GCN：

<script type="math/tex; mode=display">
\begin{aligned}
Z_{\tau} = E_{\tau}V_{\tau}W.
\end{aligned}
\tag{8}
</script>

式 (8) 里，$E_{\tau}$ 决定哪些通道的信息会聚合到当前通道，$V_{\tau}$ 是节点特征，$W$ 是可学习权重。作者只用一层 GCN，目的是避免多层图卷积常见的 over-smoothing，也就是所有节点表示被过度混合。

![GC-LSTM 图嵌入结构](/images/adaptive-graph-learning-seeg-localization/fig3-gc-lstm.png)

**图 3 怎么读。** 每个时间片先做 spatial aggregation，得到当前图的空间表示；然后这些连续图表示按时间顺序进入 LSTM。LSTM 的 hidden state 把前面时间片的信息带到后面，因此模型不是孤立判断一个 segment，而是在看异常活动如何从过去演化到当前。

作者把时空嵌入写成：

<script type="math/tex; mode=display">
\begin{aligned}
x_{\tau} &= \operatorname{FullyConnected}(h_{\tau-1}),\\
h_{\tau}, c_{\tau} &= \operatorname{LSTM}\left([v_{\tau}, z_{\tau}, x_{\tau}], h_{\tau-1}, c_{\tau-1}\right).
\end{aligned}
\tag{9}
</script>

$v_{\tau}$ 是节点属性，$z_{\tau}$ 是 GCN 后的空间嵌入，$x_{\tau}$ 是上一时刻信息生成的中间预测。这个组合让模型同时看到“这个通道现在像不像异常”和“这个异常是否沿着网络传播”。

## 片段标签和损失函数

数据构建时，作者以 seizure onset $t_0$ 为中心，把足够覆盖发作后的 window 标成 ictal，把发作前较长时间段抽样成 interictal。

![SEEG segment 生成方式](/images/adaptive-graph-learning-seeg-localization/fig4-segment-generation.png)

**图 4 怎么读。** 中间红线是 onset。右侧 ictal segments 用较密的步长采样，左侧 interictal segments 来自 onset 前较长范围，并用较大的步长采样。这样做是为了平衡 ictal 和 interictal 样本，同时避免模型只学到某个极窄 onset 附近的模式。

标签规则可以写成：

<script type="math/tex; mode=display">
\begin{aligned}
l_t =
\begin{cases}
1, & \sum_{\tau=t-W}^{t} y(\tau) > W/2,\\
0, & \text{otherwise}.
\end{cases}
\end{aligned}
\tag{10}
</script>

作者还用了 label smoothing，避免模型对硬标签过度自信：

<script type="math/tex; mode=display">
\begin{aligned}
q_i =
\begin{cases}
1-\epsilon, & l_i=1,\\
\dfrac{\epsilon}{K-1}, & \text{otherwise}.
\end{cases}
\end{aligned}
\tag{11}
</script>

预测损失是交叉熵：

<script type="math/tex; mode=display">
\begin{aligned}
L_{\mathrm{pred}} = -\sum_{i=1}^{L} q_i \log p_i.
\end{aligned}
\tag{12}
</script>

这里要注意：训练目标是 seizure prediction，不是直接做通道级 SOZ 分类。SOZ 排名来自 readout attention 的后处理。

## 从 attention 到 SOZ 排名

readout attention 对每个节点 $j$ 在每个时间片给一个权重 $\alpha_j^{\tau}$。作者把一个时间区间内的权重加起来，得到通道总体重要性：

<script type="math/tex; mode=display">
\begin{aligned}
\sigma_j &= \sum_{\tau=1}^{L}\alpha_j^{\tau},\\
s_j &= \frac{\sigma_j-\min_i \sigma_i}{\max_i \sigma_i-\min_i \sigma_i}.
\end{aligned}
\tag{13}
</script>

$s_j$ 越高，通道越可能与 SOZ 相关。这个设计的逻辑是：如果某个通道对区分 ictal/interictal 一直很关键，它就更可能是发作网络里的关键节点。

## 结果：自适应图比固定图更稳

![OpenNeuro 定位结果](/images/adaptive-graph-learning-seeg-localization/fig5-openneuro-localization.png)

**图 5 怎么读。** 这张图比较 OpenNeuro 数据集中不同病人的 AP@K 和 MAP@K。Adaptive ST GNN 在多名病人上优于 IEEG-TCN+ECC 以及固定 PLV/Corr 图的 ST-GNN，尤其在 AP@2 这种更严格的指标上表现更明显。临床上，前 2 个或前几个电极命中 SOZ 更有意义，因为医生不只关心“前 10 个里有没有”，而是关心模型能不能把最关键位置排在最前面。

![定位结果可视化流程](/images/adaptive-graph-learning-seeg-localization/fig6-visualization-procedure.png)

**图 6 怎么读。** 作者把通道重要性映射回脑空间，再和手术靶区或影像位置比较。这个流程说明模型输出不是一个抽象分数表，而是可以变成医生能读的空间定位结果。需要注意的是，这种可视化依赖电极定位和配准质量，如果电极坐标或 MRI 配准有误，图上的空间解释也会受影响。

![术后 MRI 对照](/images/adaptive-graph-learning-seeg-localization/fig7-postoperative-mri-comparison.png)

**图 7 怎么读。** 这张图把模型定位结果与术后 MRI 或手术靶区进行比较。红圈是手术目标区域，不同切片用于显示空间重合关系。它的意义不是证明模型能独立替代临床判断，而是说明模型 attention 高的区域在若干病例中能落到临床处理区域附近。

![学习到的特征可视化](/images/adaptive-graph-learning-seeg-localization/fig8-learned-features.png)

**图 8 怎么读。** 图中比较 interictal/ictal 的 attribute vectors 和 embedding features。原始属性空间里，红蓝点混合较明显；经过图嵌入后，ictal 与 interictal 的结构分离更清楚。这说明图分析模块不是简单搬运 TCN 特征，而是在邻接矩阵和时序建模后形成了更适合区分状态的表示。

![历史序列长度影响](/images/adaptive-graph-learning-seeg-localization/fig9-history-length.png)

**图 9 怎么读。** 作者以 hup185 为例测试历史序列长度对定位性能的影响。结果不是“越长越好”，说明模型需要足够上下文，但太长可能带来噪声、冗余或训练难度。对实际项目来说，这提示我们不能只堆长上下文，应该把 segment 长度和历史窗口作为需要调参的临床工程参数。

![连接密度分析](/images/adaptive-graph-learning-seeg-localization/fig10-connectivity-density.png)

**图 10 怎么读。** 作者把学到的边分成 SOZ-SOZ、SOZ-OUT 和 OUT-OUT 三类，比较 interictal 与 ictal 阶段的 weighted connectivity density。关键观察是 SOZ-SOZ 连接更强，且发作过程中有进一步增强趋势。这个结果为模型提供了一层可解释性：它不是随便给 SOZ 通道高分，而是学到的网络结构与“SOZ 内部连接更紧密”的临床网络假说相符。

![SOZ 通道 attention 随时间变化](/images/adaptive-graph-learning-seeg-localization/fig11-attention-trend.png)

**图 11 怎么读。** 这张图展示多个病例中 SOZ 通道 attention 随时间变化。较好的病例里，SOZ 通道权重在接近 ictal 阶段明显上升；中等或较差病例的趋势更不稳定。它提醒我们，attention 不是天然等同于病灶，但如果 attention 的时间变化能和发作演化对齐，就能增强模型解释的可信度。

## 这篇文章的强点

第一，自适应图构建解决了手工 FC 指标泛化差的问题。对于 SEEG 来说，不同病人的电极数量、覆盖脑区、病灶网络都不一样，固定 PLV 或 Corr 很难一套规则通吃。

第二，图构建和图分析一起训练，减少了两阶段方法里的断裂。过去常见做法是先算网络，再把网络丢给下游模型；这篇文章让网络本身为下游任务优化。

第三，作者不只报告分类准确率，还做了 SOZ 排名、术后 MRI 对照、学习特征可视化和连接密度分析。对于临床 AI 来说，这比单纯 AUROC 更有价值。

## 需要谨慎的地方

第一，attention 权重不是因果解释。通道对分类重要，不等于它就是发作起点。它可能是传播节点，也可能是和 SOZ 高度同步的节点。

第二，训练任务是 seizure prediction，SOZ 是通过 attention 后处理得到的。这个 weak supervision 很实用，但也意味着模型可能偏向“最能区分 ictal/interictal 的通道”，而不一定是最早起始的通道。

第三，个体化训练依赖每个病人有足够发作记录。作者也提到，发作数量不足会限制模型学习不同 onset pattern 的能力。

## 一句话总结

这篇文章可以理解为：用 TCN 把每个 SEEG 通道变成节点特征，用可学习相似性生成每个时间片的自适应功能网络，再用 GCN-LSTM 建模网络状态从 interictal 到 ictal 的演化，最后用 attention 排名推断 SOZ。它最适合放进“SEEG 功能网络 + 深度学习定位”的 benchmark 里，作为从手工连接指标走向自适应连接学习的代表。

## 参考文献

<span id="ref-1" class="ref-label">[1]</span> Guo J, Feng T, Wei P, Huang J, Yang Y, Wang Y, Cao G, Huang Y, Kang G, Zhao G. Adaptive graph learning with SEEG data for improved seizure localization: Considerations of generalization and simplicity. *Biomedical Signal Processing and Control*. 2025;101:107148. doi: <a href="https://doi.org/10.1016/j.bspc.2024.107148">10.1016/j.bspc.2024.107148</a>.
