---
title: DC recordings 定位 ictal onset zone：慢电位为什么可能比常规 EEG 更接近核心致痫区
date: 2026-06-22 14:45:00
tags:
  - SEEG
  - DC shift
  - ictal onset zone
  - epilepsy surgery
  - electrophysiology
comments: true
---

Ikeda 的 **DC recordings to localize the ictal onset zone** 是一篇章节式综述，讨论一个在常规 EEG 读图里容易被忽略的问题：如果记录系统允许非常慢的电位变化，ictal onset 附近的 direct-current shift（DC shift）能不能帮助定位真正的核心致痫区？<sup class="citation">[<a href="#ref-1">1</a>]</sup>

一句话概括：**ictal DC shift 不是普通 spike，也不是常规高通滤波 EEG 里一定能看到的 fast activity；它反映 seizure onset 附近大群神经元持续 PDS 和邻近 glial / extracellular environment 的慢电位变化。记录条件满足时，尤其是 subdural grid、宽开的低频滤波、高输入阻抗和足够大的电极接触面积，DC shift 往往比常规 ictal EEG 更局限，因此可能帮助定位 core epileptogenicity。**

## 缩写表

| 缩写 | 全称 | 在这篇文章里的意思 |
|---|---|---|
| DC | direct current | 直流或近直流慢电位成分，表现为 baseline shift。 |
| AC | alternating current | 临床 EEG 常见交流耦合记录；如果低频滤波太高，会看不到慢电位。 |
| LFF | low-frequency filter | 低频滤波设置。LFF 越低，越能保留慢电位。 |
| time constant | 时间常数 | AC 记录系统保留慢变化的能力；时间常数越长，低频截止越低。 |
| PDS | paroxysmal depolarization shift | 癫痫神经元的阵发性去极化位移。 |
| IOZ | ictal onset zone | 发作电生理起始区。本文讨论 DC shift 对 IOZ/core epileptogenicity 的定位价值。 |
| MTLE | mesial temporal lobe epilepsy | 内侧颞叶癫痫。 |
| FLE / PLE | frontal / parietal lobe epilepsy | 额叶 / 顶叶癫痫。 |
| HFO | high-frequency oscillation | 高频振荡。本文最后把极慢 DC shift 和高频活动放在同一个“拓宽分析窗口”的思路里讨论。 |

## 先把问题说清楚

常规临床 EEG 多数时候会高通滤波，目的是去掉漂移和伪迹。但这样做有一个代价：真正发生在 seizure onset 附近的慢电位变化也可能被滤掉。

Ikeda 这章要回答的问题不是“DC shift 能不能取代常规 EEG”，而是：

1. ictal DC shift 的生理来源是什么？
2. 什么样的电极和放大器条件才能可靠记录？
3. 在 subdural、scalp、foramen ovale、depth / epidural electrode 中，哪类记录最可能有临床定位价值？
4. 它和 conventional ictal EEG、electrodecremental pattern、HFO 是互补还是重复？

## DC shift 不是常规 spike

Interictal spike 常被解释为单个或局部神经元群的短暂 PDS。Ictal DC shift 则更慢、更持续。章中强调，当 EEG 以无限时间常数或足够低的低频滤波记录时，能看到 slow potentials；这些 slow potentials 被认为反映中枢神经元和 glial cells 的生理或病理活动。

从机制上，文章把 ictal DC shift 分成两层：

| 层级 | 机制 | 对信号的影响 |
|---|---|---|
| 神经元 | 大量 pyramidal neurons 同步发生持续 PDS | 产生 seizure onset 附近的慢负向或正向位移。 |
| glia / extracellular space | 局部 extracellular potassium 上升，glial membrane 被动去极化 | 慢电位被维持、放大或改变空间分布。 |

这也是为什么 DC shift 被作者看成 core epileptogenicity 的线索：它不是只反映某个尖波，而是反映 seizure onset 附近大群细胞和局部微环境一起进入异常状态。

## 为什么滤波设置决定能不能看到 DC shift

如果用 AC amplifier 记录，低频截止和时间常数大致成反比。可以用下面的关系理解：

<script type="math/tex; mode=display">
\begin{aligned}
f_c &\approx \frac{1}{2\pi \tau}.
\end{aligned}
\tag{1}
</script>

这里 $f_c$ 是低频截止频率，$\tau$ 是 time constant。$\tau$ 越长，$f_c$ 越低，越能保留慢电位。文章举的关键例子是：常规 LFF 1.0 Hz / time constant 0.1 s 下看不到清楚的 baseline shift；把 LFF 打开到 0.03 Hz / time constant 5 s 后，同一发作可看到局部负向 shift。

这解释了一个常见误解：**看不到 DC shift 不一定说明没有 DC shift，也可能只是记录系统把它滤掉了。**

## 电极和放大器的三个条件

作者明确说，临床上不一定非要真正 DC amplifier；AC amplifier 也可能记录慢 shift，但必须满足三个技术条件：

| 条件 | 文章中的理由 | 实际含义 |
|---|---|---|
| 电极金属 | Ag/AgCl 适合慢电位但不适合颅内；临床常用 platinum、gold、stainless steel | platinum 对慢电位较好，但高输入阻抗和大接触面积可以部分补偿材料差异。 |
| 接触面积 | 大接触面积提高电极电容，减少慢电位衰减 | subdural grid 比小接触面积 depth electrode 更容易记录慢 shift。 |
| amplifier input impedance | 输入阻抗越高，电极电位影响越小 | 文章强调大于 50 Mohm 的高输入阻抗有利于记录慢 cortical potentials。 |

这三点也解释了为什么不同研究对 DC shift 的敏感性不一致。不是所有“颅内电极”都天然适合 DC shift；小接触面积 depth electrode、输入阻抗不足、LFF 没有充分打开，都可能让慢电位消失。

## Subdural grid 的主要临床结果

文章最核心的临床部分来自作者团队对 chronically implanted subdural grid electrodes 的分析。其参数和结果可以拆开看：

| 项目 | 内容 |
|---|---|
| 电极 | 商用 subdural grid，3 mm 接触直径，1 cm contact 间距。 |
| 材料 | 主要为 platinum，少数 stainless steel。 |
| 放大器 | AC amplifier，输入阻抗 200 或 80 Mohm。 |
| 滤波 / 采样 | long time constant 10 s，HFF 100 Hz，200 Hz/channel。 |
| 患者 | 24 名难治性 partial epilepsy 患者，16 名 neocortical epilepsy，8 名 MTLE。 |
| 观察率 | DC shifts 在 23/24 名患者记录到，即 96%。 |
| seizure 内出现率 | 每名患者平均 87% 的记录发作可见 DC shift。 |
| 伴随模式 | 48% 患者与 electrodecremental pattern 相关，44% 与 10-15 Hz rhythmic fast activity 相关。 |
| 时间关系 | 70% 患者中 DC shift 发生在 clinical onset 同时或之前，30% 随后出现，后者多为 MTLE。 |
| 空间关系 | DC shift 区域通常比 conventional ictal EEG 定义的 epileptogenic zone 更局限。 |

这组结果的意义不是“DC shift 一定最早”，而是：**它常常更局限，可能更接近 core epileptogenic zone。** 常规 ictal EEG 尤其在 extratemporal epilepsy 中可能很弥散；DC shift 如果在少数 contacts 上局限出现，就能提供额外的定位线索。

## 图 74.1 到 74.10 怎么读

本地 PDF 没有开放授权或 DOI/网页来源，本文不直接复刻原图，只逐图说明其证据作用。

| 图 | 核心内容 | 读图重点 |
|---|---|---|
| Figure 74.1 | penicillin 模型中 EEG、extracellular field potential 和 membrane potential 的关系 | interictal PDS 是神经元膜电位变化和场电位变化的基础。 |
| Figure 74.2 | 48 岁右顶叶癫痫患者 subdural 记录的 ictal DC shift | 低幅快活动和 electrodecremental pattern 附近出现局部慢负向 shift，并从 A43 扩展。 |
| Figure 74.3 | 神经元 firing、extracellular potassium、glial depolarization 的功能连接 | glia 不是旁观者，局部 K+ 增加可使 glial membrane 被动去极化，从而参与慢电位。 |
| Figure 74.4 | 不同金属电极对方波输入的再现能力 | platinum 比 gold / stainless steel 更适合慢电位，但实际还受输入阻抗和接触面积影响。 |
| Figure 74.5 | 同一 scalp seizure 在 LFF 1.0 Hz 与 0.03 Hz 下的差异 | 打开低频后，原本只见 electrodecremental pattern 的发作显示局部负向 shift。 |
| Figure 74.6 | 右额叶 supplementary motor seizure 的 subdural DC shift | 临床 onset 附近，负向 shifts 局限于 A3 和 A10，且这些 contacts 属于 conventional ictal EEG 定义的 onset zone。 |
| Figure 74.7 | 左额叶癫痫中 DC shift 与 LVFA 的时间关系 | conventional low-amplitude fast activity 可比 DC shift 早 1-2 秒出现，说明二者不是总是同一时刻。 |
| Figure 74.8 | 约 1 Hz rhythmic activity 伴随 DC shift 的少见例子 | DC shift 不只和 electrodecremental pattern 相关，也可伴慢节律 ictal pattern。 |
| Figure 74.9 | DC shift 晚于临床和常规 ictal EEG onset 的例子 | DC shift 需要大群神经元同步放电；如果这种同步晚发生，DC shift 也会晚。 |
| Figure 74.10 | foramen ovale electrode、amygdala stereo-EEG 和 AC/DC 记录 | 在 MTLE 中，foramen ovale DC shift 可帮助判定侧别，尤其当 AC record 不清楚时。 |

## 不同记录方式的结论不同

作者对 scalp、subdural、foramen ovale、depth / epidural electrode 的态度不一样。

**Scalp recording。** scalp ictal DC shift 很容易被 movement artifact、galvanic skin response 和电极电位污染，所以敏感性不稳定。章中提到，一旦 scalp DC shift 能被可靠记录，可能有较高 specificity，但临床应用有限。

**Subdural grid。** 这是本文最支持的场景。大接触面积、高输入阻抗、打开 LFF 后，subdural grid 可较稳定地记录局限 slow cortical potential，尤其适合 neocortical epilepsy 和 MRI-negative cortical dysplasia 的 core epileptogenicity 判断。

**Foramen ovale electrode。** 对 MTLE 有侧别判断价值。即使 AC mode 不清楚，foramen ovale DC record 也可能显示 underlying mesio-basal limbic structure 的 epileptic activity。

**Depth / epidural electrode。** 结果更复杂。早期小接触面积 depth / epidural electrode 可能记录不到可靠 slow shift；后续 hippocampal depth electrode 研究中，32 次发作的 84% 伴 localized positive slow shifts，提示 depth recording 并非完全不可能，但技术条件很关键。

## 和 cortical dysplasia 的关系

这一节对 SEEG / epilepsy surgery 很有用。作者指出 cortical dysplasia 不一定总能产生典型、清楚的 conventional spikes。原因是 spike dipole 依赖皮层层状结构；如果 cortical layers 扭曲，传统 spike 或 dipole 可能变得 ill-defined。

DC shift 的潜在优势是：只要 epileptic firing neuronal pools 和周围 gliosis 存在，即使皮层层次扭曲，慢电位仍可能更清楚。作者特别强调，在 MRI-invisible cortical dysplasia 中，ictal DC shift 可能帮助 delineate core epileptogenicity。

这不能被过度解读为“DC shift 就等于 FCD 边界”。更准确地说，它提供的是功能性 core epileptogenicity 线索，仍然需要和 conventional ictal EEG、interictal spikes、MRI、功能区 mapping 和手术安全边界一起判断。

## 极慢和极快信号要一起看

文章最后把 DC shift 和 high-frequency ictal / interictal activity 放在一起讨论，这个视角很重要。传统 EEG 频带只看中间频率，可能同时错过两类信息：

| 频段方向 | 代表信息 | 对 IOZ 的意义 |
|---|---|---|
| 极慢 | DC shift / slow cortical potential | 反映持续 PDS、glial / extracellular environment 和局部核心异常。 |
| 极快 | HFO、100-200 Hz activity、fast ripple | 反映局部高频同步或离散核心异常。 |

作者的实践建议可以概括为：术前颅内记录不应只看常规频带。把分析窗口同时打开到极慢和极快，可能更完整地看到 core epileptogenicity。

## 这篇文章对现在的启发

第一，滤波不是中性步骤。设置 LFF 以后，某些生理现象就会从可见变成不可见。做 SEEG/iEEG 分析时，如果数据已经高通到 1 Hz 或更高，就不能再声称“没有 DC shift”。

第二，DC shift 的临床价值依赖硬件条件。电极材料、接触面积、输入阻抗、time constant、reference、movement artifact 都会影响判断。不能把“某研究没看到 DC shift”简单解释为生理上不存在。

第三，DC shift 更像 core marker，而不是 propagation marker。它通常比 conventional ictal EEG 更局限，但并不总是最早出现。读图时要同时标出 clinical onset、conventional EEG onset、DC shift onset 和空间范围。

第四，和 HFO 一样，DC shift 是扩展频带思维的一部分。一个向极慢端打开，一个向极快端打开；二者都在提醒我们，常规临床显示设置只是方便读图，不等于生理全部。

## 参考文献

<span id="ref-1" class="ref-label">[1]</span> Ikeda A. DC recordings to localize the ictal onset zone. Chapter 74 in *Textbook of Epilepsy Surgery*. Local Zotero PDF pages 659-665; the Zotero item currently has no DOI or public URL metadata.

<span id="ref-2" class="ref-label">[2]</span> Ikeda A, Terada K, Mikuni N, et al. Subdural recording of ictal DC shifts in neocortical seizures in human. *Epilepsia*. 1996;37:662-674.

<span id="ref-3" class="ref-label">[3]</span> Ikeda A, Yazawa S, Kunieda T, et al. Focal ictal DC shifts in human epilepsy as studied by subdural and scalp recording. *Brain*. 1999;122:827-838.
