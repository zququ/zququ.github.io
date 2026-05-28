---
title: Dual-Stage Domain Adaptation：跨受试者癫痫发作预测方法详解
date: 2026-05-28 10:45:00
tags:
  - EEG
  - 癫痫预测
  - Domain Adaptation
  - Warning
  - MathJax
comments: true
---

# Dual-Stage Improvement with Domain Adaptation for Cross-Subject Epileptic Seizure Prediction 详解

来源：Cheng, C.; Song, W.; You, B.; Wu, H.; Liu, Y. *Dual-Stage Improvement with Domain Adaptation for Cross-Subject Epileptic Seizure Prediction*. **International Journal of Neural Systems** 2026, 2650032. DOI: https://doi.org/10.1142/S0129065726500322

说明：Zotero 的 `seeg/warning` 集合里这条记录没有本地 PDF 附件；WorldScientific DOI 页面当前无法直接读取全文。因此下面是基于 Zotero/Crossref 摘要和该方向通用数学框架整理的**方法级详解**，不是论文原文公式逐条转写。涉及公式的地方用“可抽象为”表述。

## 1. 这篇文章解决什么问题

这篇论文讨论的是 **cross-subject epileptic seizure prediction**，也就是跨受试者癫痫发作预测。

癫痫发作预测一般把 EEG 片段分成两类：

- **preictal**：发作前一段时间，模型希望提前报警。
- **interictal**：非发作相关的背景期，模型不应报警。

单受试者模型通常只在一个病人的数据上训练和测试。跨受试者模型更难，因为不同病人的 EEG 分布差异很大。一个病人的 preictal 模式，未必能直接迁移到另一个病人。

这篇文章的核心判断是：已有 domain adaptation 方法虽然能减小 source domain 和 target domain 的分布差异，但忽略了两个问题：

1. **类别不平衡**：preictal 样本远少于 interictal 样本。
2. **伪标签噪声**：target domain 没有真实标签时，只能用模型预测生成 pseudo-label；错的 pseudo-label 会在训练中不断放大。

所以作者提出 dual-stage improvement：

1. 第一阶段：用 **global context-aware generative network** 生成 preictal 样本，缓解 source domain 类别不平衡。
2. 第二阶段：用 **common spatial pattern clustering filter** 和 **dual-filtering mechanism** 优化 target pseudo-label，减少噪声标签传播。

## 2. 基本任务形式

假设 EEG 被切成许多时间窗，每个样本可以写成：

$$
\begin{aligned}
X_i
&\in
\mathbb{R}^{C\times T}
\end{aligned}
\tag{1}
$$

式 (1) 里，$C$ 是 EEG 通道数，$T$ 是时间点数。$X_i$ 是第 $i$ 个 EEG 片段。

标签可以写成：

$$
\begin{aligned}
y_i
&\in
\{0,1\}
\end{aligned}
\tag{2}
$$

式 (2) 里，$y_i=1$ 表示 preictal，$y_i=0$ 表示 interictal。

跨受试者时，可以把训练病人看成 source domain，把目标病人看成 target domain：

$$
\begin{aligned}
\mathcal{D}_s
&=
\{(X_i^s,y_i^s)\}_{i=1}^{N_s},\\
\mathcal{D}_t
&=
\{X_j^t\}_{j=1}^{N_t}
\end{aligned}
\tag{3}
$$

式 (3) 里，source domain 有标签，target domain 通常没有标签或只有很少标签。domain adaptation 的目标是：用 $\mathcal{D}_s$ 学到的知识，在 $\mathcal{D}_t$ 上也能预测 preictal。

跨受试者困难来自分布偏移：

$$
\begin{aligned}
P_s(X,y)
&\ne
P_t(X,y)
\end{aligned}
\tag{4}
$$

式 (4) 表示 source subject 和 target subject 的 EEG 数据分布不同。不同病人的电极位置、背景节律、药物状态、发作网络、噪声水平都可能不同。

## 3. 为什么普通 domain adaptation 不够

普通 DA 的目标通常是学习一个特征提取器 $F_\theta$，让 source 和 target 的特征分布更接近：

$$
\begin{aligned}
Z_i
&=
F_\theta(X_i)
\end{aligned}
\tag{5}
$$

式 (5) 里，$Z_i$ 是 EEG 片段的 latent feature。分类器再根据 $Z_i$ 判断 preictal 或 interictal：

$$
\begin{aligned}
\hat{y}_i
&=
H_\phi(Z_i)
\end{aligned}
\tag{6}
$$

一个典型训练目标可以抽象成：

$$
\begin{aligned}
\mathcal{L}
&=
\mathcal{L}_{\mathrm{cls}}
{}+
\lambda_{\mathrm{da}}
\mathcal{L}_{\mathrm{da}}
\end{aligned}
\tag{7}
$$

式 (7) 里，$\mathcal{L}_{\mathrm{cls}}$ 是 source domain 的分类损失，$\mathcal{L}_{\mathrm{da}}$ 是 domain adaptation 损失，$\lambda_{\mathrm{da}}$ 控制对齐强度。

分类损失常见形式是交叉熵：

$$
\begin{aligned}
\mathcal{L}_{\mathrm{cls}}
&=
-
\frac{1}{N_s}
\sum_{i=1}^{N_s}
\sum_{c\in\{0,1\}}
\mathbf{1}(y_i^s=c)
\log p_\phi(c|F_\theta(X_i^s))
\end{aligned}
\tag{8}
$$

式 (8) 只依赖 source label。问题是：如果 source domain 中 interictal 远多于 preictal，模型容易偏向多数类。

类别不平衡可以写成：

$$
\begin{aligned}
N_{\mathrm{preictal}}
&\ll
N_{\mathrm{interictal}}
\end{aligned}
\tag{9}
$$

式 (9) 是 seizure prediction 的常见问题。发作前样本本来就少，而 interictal 可以从长时间 EEG 中大量切片得到。

这会导致两个后果：

1. 模型学到“多数时候都是 interictal”。
2. DA 对齐时会主要对齐 interictal 分布，preictal 的少数模式被稀释。

## 4. 第一阶段：生成 preictal 样本，缓解类别不平衡

摘要里说，作者引入 **global context-aware generative network** 来生成具有 global contextual consistency 的 preictal samples。可以把它理解成：不是随便复制少数类，也不是简单 SMOTE，而是生成在全局上下文上仍像真实 preictal 的样本。

生成器可以抽象成：

$$
\begin{aligned}
\tilde{X}_{\mathrm{pre}}
&=
G_\psi(z, c_{\mathrm{pre}}, g)
\end{aligned}
\tag{10}
$$

式 (10) 里，$z$ 是随机噪声或 latent code，$c_{\mathrm{pre}}$ 表示目标类别是 preictal，$g$ 表示全局上下文信息，$\tilde{X}_{\mathrm{pre}}$ 是生成的 preictal EEG 片段。

全局上下文可以理解为同一病人或同一 source domain 中 EEG 的整体统计结构。例如通道相关性、频谱分布、背景节律、preictal 与 interictal 的相对位置等。用一个抽象函数表示：

$$
\begin{aligned}
g
&=
Q_\omega(\mathcal{D}_s)
\end{aligned}
\tag{11}
$$

式 (11) 里，$Q_\omega$ 从 source domain 估计全局上下文。这个上下文进入生成器，目的是让生成样本不要偏离真实 EEG 分布。

生成后的平衡数据集可以写成：

$$
\begin{aligned}
\tilde{\mathcal{D}}_s
&=
\mathcal{D}_s
\cup
\{(\tilde{X}_k^{s},1)\}_{k=1}^{M}
\end{aligned}
\tag{12}
$$

式 (12) 表示把生成的 preictal 样本加入 source domain。加入后，preictal 和 interictal 的数量差距减小。

这一步解决的是 **source-side imbalance**。如果不先处理不平衡，后面的 domain adaptation 可能会把 target 特征错误地拉向 interictal 主导的 source feature space。

## 5. 第二阶段：用 pseudo-label 适配 target domain

target domain 没有真实标签时，常用模型预测作为 pseudo-label：

$$
\begin{aligned}
\hat{p}_j^t
&=
H_\phi(F_\theta(X_j^t)),\\
\hat{y}_j^t
&=
\arg\max_{c\in\{0,1\}}
\hat{p}_{j,c}^t
\end{aligned}
\tag{13}
$$

式 (13) 里，$\hat{p}_j^t$ 是 target 样本属于各类的预测概率，$\hat{y}_j^t$ 是 pseudo-label。

但 pseudo-label 有噪声。早期模型如果预测错了，后面又把这个错误标签当真，模型会越学越偏。这叫 noisy pseudo-label accumulation。

最直接的过滤是置信度过滤：

$$
\begin{aligned}
\max_c \hat{p}_{j,c}^t
&\ge
\tau
\end{aligned}
\tag{14}
$$

式 (14) 表示只保留高置信度 pseudo-label。$\tau$ 是阈值。置信度低的 target 样本暂时不参与伪标签训练。

但 seizure prediction 里仅靠置信度不够，因为模型可能“自信地错”。所以摘要里提到 dual-filtering mechanism，说明作者不仅看分类置信度，还引入空间模式或聚类一致性过滤。

## 6. Common Spatial Pattern clustering filter 是什么

Common Spatial Pattern, CSP 是 EEG 分类里常见的空间滤波方法。它的目标是找一组空间滤波器，让两类 EEG 的方差差异最大。

对一个 EEG 片段 $X_i$，协方差可以写成：

$$
\begin{aligned}
\Sigma_i
&=
\frac{X_iX_i^\top}
{\mathrm{tr}(X_iX_i^\top)}
\end{aligned}
\tag{15}
$$

式 (15) 是常见的归一化协方差。$X_iX_i^\top$ 描述通道之间的协同变化，$\mathrm{tr}(\cdot)$ 做尺度归一化。

对 preictal 和 interictal 分别求平均协方差：

$$
\begin{aligned}
\Sigma_1
&=
\frac{1}{N_1}
\sum_{i:y_i=1}
\Sigma_i,\\
\Sigma_0
&=
\frac{1}{N_0}
\sum_{i:y_i=0}
\Sigma_i
\end{aligned}
\tag{16}
$$

式 (16) 里，$\Sigma_1$ 是 preictal 平均协方差，$\Sigma_0$ 是 interictal 平均协方差。

CSP 的优化目标可以写成 Rayleigh quotient：

$$
\begin{aligned}
w^\*
&=
\arg\max_w
\frac{w^\top\Sigma_1w}
{w^\top\Sigma_0w}
\end{aligned}
\tag{17}
$$

式 (17) 的意思是：找一个空间方向 $w$，让投影后的 preictal 方差大、interictal 方差小。反过来也可以找 interictal 方差大的方向。

对应的广义特征值问题是：

$$
\begin{aligned}
\Sigma_1 w
&=
\lambda
\Sigma_0 w
\end{aligned}
\tag{18}
$$

式 (18) 里，特征向量 $w$ 就是空间滤波器。大的 $\lambda$ 对应更偏 preictal 的方向，小的 $\lambda$ 对应更偏 interictal 的方向。

摘要里说 common spatial pattern clustering filter 使用 **confidence-guided covariance weighting strategy**，整合 source labels 和 target pseudo-labels 的分类置信度。可以抽象为加权协方差：

$$
\begin{aligned}
\Sigma_c^{\mathrm{mix}}
&=
\frac{
\sum_{i\in\mathcal{I}_s(c)}
\alpha_i^s\Sigma_i^s
{}+
\sum_{j\in\mathcal{I}_t(c)}
\alpha_j^t\Sigma_j^t
}{
\sum_{i\in\mathcal{I}_s(c)}
\alpha_i^s
{}+
\sum_{j\in\mathcal{I}_t(c)}
\alpha_j^t
}
\end{aligned}
\tag{19}
$$

式 (19) 里，$c\in\{0,1\}$ 是类别，$\mathcal{I}_s(c)$ 是 source 中属于类别 $c$ 的样本集合，$\mathcal{I}_t(c)$ 是 target 中 pseudo-label 为 $c$ 的样本集合。$\alpha$ 是置信度权重。

source 的标签是真实标签，权重可以较高；target 的 pseudo-label 可能错误，权重需要由置信度控制：

$$
\begin{aligned}
\alpha_j^t
&=
\max_c \hat{p}_{j,c}^t
\end{aligned}
\tag{20}
$$

式 (20) 表示 pseudo-label 越自信，对 covariance estimation 的贡献越大。低置信度 pseudo-label 对 CSP 空间滤波器影响更小。

这样做的意义是：CSP 不只看 source domain，也把高可信 target 样本纳入空间滤波器估计，让空间滤波器更适配 target subject。

## 7. clustering filter 为什么有用

CSP 得到空间特征后，每个样本可以被投影为：

$$
\begin{aligned}
U_i
&=
W^\top X_i
\end{aligned}
\tag{21}
$$

式 (21) 里，$W$ 是 CSP 空间滤波器矩阵，$U_i$ 是滤波后的信号。

常用 CSP 特征是投影信号的 log-variance：

$$
\begin{aligned}
f_i
&=
\log
\frac{
\mathrm{var}(U_i)
}{
\sum_k \mathrm{var}(U_{i,k})
}
\end{aligned}
\tag{22}
$$

式 (22) 把空间滤波后的能量分布变成特征。preictal 和 interictal 如果在空间协方差上不同，就会在 CSP feature space 中更容易分开。

聚类过滤可以抽象为：如果一个 target pseudo-label 是 preictal，但它在 CSP feature space 里更靠近 interictal cluster，就认为它可疑。

设类别中心为：

$$
\begin{aligned}
\mu_c
&=
\frac{1}{|\mathcal{I}(c)|}
\sum_{i\in\mathcal{I}(c)}
f_i
\end{aligned}
\tag{23}
$$

式 (23) 是类别 $c$ 的 CSP 特征中心。

样本到类别中心的距离为：

$$
\begin{aligned}
d_{j,c}
&=
\lVert f_j^t-\mu_c\rVert_2
\end{aligned}
\tag{24}
$$

式 (24) 里，$d_{j,c}$ 越小，说明 target 样本越接近类别 $c$ 的空间模式。

聚类一致性过滤可以写成：

$$
\begin{aligned}
\hat{y}_j^t
&=
\arg\min_c d_{j,c}
\end{aligned}
\tag{25}
$$

式 (25) 表示：pseudo-label 最好和 CSP feature 的聚类归属一致。如果分类器说它是 preictal，但 CSP 聚类更像 interictal，就可能被过滤掉。

## 8. dual-filtering mechanism 可以怎么理解

摘要里说 dual-filtering mechanism iteratively eliminates noisy pseudo-labels。可以理解为两道门：

第一道门是分类置信度：

$$
\begin{aligned}
\mathcal{A}_1
&=
\{j:\max_c\hat{p}_{j,c}^t\ge\tau_p\}
\end{aligned}
\tag{26}
$$

式 (26) 保留模型足够自信的 target 样本。

第二道门是空间/聚类一致性：

$$
\begin{aligned}
\mathcal{A}_2
&=
\{j:\hat{y}_j^t=\arg\min_c d_{j,c}\}
\end{aligned}
\tag{27}
$$

式 (27) 保留分类结果和 CSP 聚类结果一致的 target 样本。

最终可用于训练的 pseudo-labeled target set 是交集：

$$
\begin{aligned}
\tilde{\mathcal{D}}_t
&=
\{(X_j^t,\hat{y}_j^t):j\in\mathcal{A}_1\cap\mathcal{A}_2\}
\end{aligned}
\tag{28}
$$

式 (28) 的意义是：宁可少用 target pseudo-label，也不要把大量错误 pseudo-label 加进训练。

迭代训练可以抽象成：

$$
\begin{aligned}
(\theta,\phi)
&\leftarrow
\arg\min_{\theta,\phi}
\left[
\mathcal{L}_{s}
{}+
\lambda_t\mathcal{L}_{t}^{\mathrm{pseudo}}
{}+
\lambda_{\mathrm{da}}\mathcal{L}_{\mathrm{da}}
\right]
\end{aligned}
\tag{29}
$$

式 (29) 里，$\mathcal{L}_{s}$ 是 source 监督损失，$\mathcal{L}_{t}^{\mathrm{pseudo}}$ 是过滤后的 target pseudo-label 损失，$\mathcal{L}_{\mathrm{da}}$ 是 source-target 分布对齐损失。

其中 target pseudo-label 损失可以写成：

$$
\begin{aligned}
\mathcal{L}_{t}^{\mathrm{pseudo}}
&=
-
\frac{1}{|\tilde{\mathcal{D}}_t|}
\sum_{(X_j^t,\hat{y}_j^t)\in\tilde{\mathcal{D}}_t}
\log
p_\phi(\hat{y}_j^t|F_\theta(X_j^t))
\end{aligned}
\tag{30}
$$

式 (30) 只使用过滤后的 pseudo-label。这样可以减少错误标签对模型参数的污染。

## 9. 这篇方法的关键贡献

这篇文章不是单纯又做了一个 seizure prediction 分类器，而是围绕 cross-subject generalization 做改进。

第一，作者把 **source-side imbalance** 放到 DA 之前处理。这个顺序很重要。source domain 如果先天偏向 interictal，DA 对齐就会继承偏差。

第二，作者没有盲目信任 target pseudo-label。pseudo-label 是跨受试者 DA 的常用工具，但 seizure prediction 的 preictal 少、分布漂移大，错误标签很容易积累。

第三，CSP clustering filter 引入了 EEG 空间协方差结构。也就是说，它不只看深度网络输出概率，还用 EEG 传统空间滤波知识检查 pseudo-label 是否可信。

可以把整套流程压缩成：

$$
\begin{aligned}
\text{imbalanced source EEG}
&\rightarrow
\text{preictal generation}\\
&\rightarrow
\text{domain adaptation}\\
&\rightarrow
\text{pseudo-label prediction}\\
&\rightarrow
\text{confidence + CSP filtering}\\
&\rightarrow
\text{iterative target adaptation}
\end{aligned}
\tag{31}
$$

式 (31) 是这篇文章的主线。

## 10. 和 seizure warning 的关系

这篇论文属于 warning / seizure prediction，而不是 seizure detection。

区别可以写成：

$$
\begin{aligned}
\text{detection}
&:
\quad
\text{判断当前是否已经发作},\\
\text{prediction}
&:
\quad
\text{判断未来一段时间是否可能发作}
\end{aligned}
\tag{32}
$$

seizure prediction 更难，因为模型必须识别 preictal，而 preictal 并不是一个边界清晰、所有病人一致的状态。

临床上还要定义 seizure prediction horizon, SPH 和 seizure occurrence period, SOP：

$$
\begin{aligned}
\text{alarm at } t
\quad
\Rightarrow
\quad
\text{seizure expected in } [t+\mathrm{SPH},\ t+\mathrm{SPH}+\mathrm{SOP}]
\end{aligned}
\tag{33}
$$

式 (33) 的意思是：报警后不是马上算成功，而是要隔开一个最短干预时间 SPH；随后在 SOP 内发生发作才算有效预测。

因此评估时不能只看 accuracy。更关键的是：

| 指标 | 含义 |
|---|---|
| sensitivity | 有多少次发作被提前预测 |
| false prediction rate | 单位时间误报多少次 |
| AUC | 分类器综合区分能力 |
| warning time | 报警距离发作还有多久 |
| cross-subject performance | 对新病人是否还能泛化 |

## 11. 为什么这篇文章值得放进 warning 综述

这篇文章代表 seizure prediction 里一个很实际的方向：**从单病人模型转向跨病人模型**。

传统思路是给每个病人收集足够多历史发作，再训练个体模型。但现实中很多病人发作次数少，数据不够。跨受试者方法希望利用已有病人的数据帮助新病人。

难点是：

1. EEG 个体差异很大。
2. preictal 样本稀少。
3. target subject 初期没有可靠标签。
4. pseudo-label 一旦错，会污染后续训练。

这篇文章的 dual-stage design 正好对应这些痛点：

| 痛点 | 文章对应方案 |
|---|---|
| preictal 少 | 生成 preictal 样本做 source balancing |
| source-target 分布不同 | domain adaptation |
| pseudo-label 有噪声 | dual-filtering |
| EEG 空间模式重要 | CSP clustering filter |

## 12. 需要谨慎的地方

这篇文章目前在 Zotero 里没有全文附件，所以不能确认作者原文具体网络结构、损失函数、公式编号和实验数值。基于摘要可以确定方法模块，但不能把上面的抽象公式当成论文原始公式。

此外，方法本身也有几个需要注意的点：

1. 生成 preictal 样本可能改善类别平衡，但也可能生成过于理想化的样本。
2. pseudo-label 过滤会提高可靠性，但也会减少 target 样本利用率。
3. CSP 假设两类在空间协方差上有差异；如果 target 病人的 preictal 表现主要是频谱或时序变化，CSP 贡献可能有限。
4. CHB-MIT 是 scalp EEG 数据集，不等同于 SEEG/iEEG 场景。
5. 跨受试者 DA 的结果要看 patient-wise split 是否严格，避免数据泄漏。

## 13. 一句话总结

这篇论文可以理解为：

> 在跨病人发作预测中，先用生成模型补足少数 preictal 样本，再用 domain adaptation 对齐 source 和 target，最后用置信度与 CSP 空间聚类双重过滤 target pseudo-label，减少类别不平衡和伪标签噪声对模型泛化的伤害。

如果放进 warning 综述里，它适合放在“跨受试者泛化”和“domain adaptation / pseudo-label cleaning”这一节，而不是普通 CNN seizure prediction 那一节。

## 参考来源

<span id="ref-s1" class="ref-label">[1]</span> Cheng, C.; Song, W.; You, B.; Wu, H.; Liu, Y. *Dual-Stage Improvement with Domain Adaptation for Cross-Subject Epileptic Seizure Prediction*. **International Journal of Neural Systems** 2026, 2650032. DOI: https://doi.org/10.1142/S0129065726500322
