---
title: 人类 IED 的层状细胞微环路：Neuropixels 看到的发作间期放电
date: 2026-05-09 10:45:00
tags:
  - SEEG
  - IED
  - 癫痫
  - Neuropixels
  - 单神经元
comments: true
---

Interictal epileptiform discharges（IEDs）常被当作癫痫灶定位和脑网络兴奋性异常的标志。但一个更基本的问题是：IED 到底是很多神经元突然同步爆发，还是一个有结构、有相位、有细胞类型分工的局部微环路过程？Silva 等发表在 *Nature Neuroscience* 的工作用术中 Neuropixels probe 在人类癫痫灶新皮层跨层记录单神经元活动，把这个问题推进到 cellular-laminar microcircuit 尺度 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这篇文章的核心结论可以压缩成一句话：人类新皮层 IED 不是简单的同步 spike，而是由不同放电相位、不同推定细胞类型和不同皮层深度共同组织出的可预测微环路；其中表层 regular-spiking early-activation neurons 更接近 sharp discharge 的幅度编码，fast-spiking/suppression 相关活动则更早地预示 IED 形成 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

## 1. 为什么 IED 不能只看宏电极波形

IED 在临床 EEG、SEEG、ECoG 中常表现为短暂 sharp wave、spike 或 spike-wave discharge。宏观波形很有用，因为它能帮助定位 epileptogenic tissue，也能作为 RNS 等闭环刺激系统的检测信号。但宏观波形有一个天然限制：它把很多局部细胞和层状活动压缩成一个电位事件。

如果只看 LFP 或宏电极信号，我们容易把 IED 理解成“某一刻很多神经元一起放电”。Silva 等的问题正好相反：他们想知道在 IED 最大斜率前后，不同深度、不同波形类型的单神经元是否按稳定顺序参与。这个问题需要同时满足两个条件：足够多的单元数量，以及跨皮层深度的覆盖。Neuropixels probe 正好提供了这样的技术入口。

作者筛查了 11 名接受清醒开颅切除手术的癫痫患者、24 次 Neuropixels insertion，最终纳入 4 名患者、9 个新皮层插入位点。所有记录都来自随后被切除的 epileptogenic tissue。最终分析覆盖 1,152 个神经元和 1,094 个 IED <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

## 2. 记录设计：用同一根探针同时看 LFP 和单神经元

每根 Neuropixels probe 有 384 个 active electrodes，沿 shank 覆盖 7.66 mm，可以从皮层表面向深部跨层采样。作者用同一根探针的 LFP 检测 IED，用 high-pass filtered signal 做 spike sorting，再把神经元 waveform 分成 fast-spiking、regular-spiking 和 positive-spiking 三类。

IED 的标注也很关键。作者先用 line-length detector 找候选事件，再由癫痫专科医生人工校正；之后每个 IED 都用最大绝对斜率点作为 time zero。也就是说，所有 peri-IED firing、CSD、feature coding 和 prediction 都围绕 sharpest edge 对齐。这比简单按肉眼 onset 对齐更稳定，也更适合比较不同 IED 之间的细胞相位。

这种设计的优势在于同一套数据里同时有三层信息：宏观 IED waveform、跨深度 LFP/CSD、以及单神经元 firing。文章后面的所有机制解释都建立在这三层信息的对齐上。

![Silva 等 2026 原文 Figure 1：Neuropixels 跨层记录和 IED 对齐后的单神经元反应](/images/ied-microcircuits/silva-2026-fig1-recording-overview.jpg)

*图 1. Silva 等 2026 原文 Figure 1，展示 Neuropixels probe 跨层记录、IED LFP 标注、记录位点、神经元 waveform 类型，以及两个示例 cortical insertion site 中不同深度神经元围绕 IED 的 firing raster 和 PETH <sup class="citation">[<a href="#ref-1">1</a>]</sup>。*

**图 1 说明。** A 部分先定义技术平台：Neuropixels probe 以跨层方式插入新皮层，电极沿 shank 覆盖从表层到深部的范围。B-D 部分说明 IED 如何在 LFP 中被识别、对齐和跨深度观察；所有 IED 以最大绝对斜率点作为 time zero。E 部分给出患者的 cortical recording sites，说明这些不是动物模型或体外模拟，而是人类术中癫痫灶组织。F-G 部分把 waveform 分成 RS、FS 和 positive-spiking 类型，并显示不同位点的神经元组成。H-I 是这张图最关键的证据：同一 IED 附近，不同深度和不同 waveform 类型的神经元反应并不一致，有的在 IED 附近 activation，有的 suppression，有的延迟反应。这为后文“IED 是层状微环路过程，而不是简单同步爆发”打下基础。

## 3. IED 周围的神经元 firing 是异步的

作者首先看 ±400 ms peri-IED interval 内每个神经元的 firing modulation。结果显示，不同 insertion site 中有 22.6% 到 85.1% 的神经元被 IED 显著调制 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

真正重要的是时间结构：这些神经元不是同时在 IED peak 附近一起爆发，而是有的提前、有的接近 IED 最大斜率、有的滞后。整体看，神经元活动在 peri-IED interval 中呈现 tiled dynamics。宏观 IED 看起来像一个尖锐事件，但单神经元尺度上更像一个有组织的过程。

这直接挑战了过于简单的 paroxysmal depolarization model。IED 并不是所有局部神经元被同一时刻拉进同步放电，而是多个细胞群按不同相位接力参与。

## 4. 三类 peri-IED firing pattern

作者对 IED-locked firing rate 做 k-means clustering，得到三类主要 firing pattern <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

**Early activation** 指在 IED 最大斜率附近 50-100 ms 内 firing 增加，并在最大斜率后不久达到峰值。这类神经元和 sharp discharge 的快速成分关系最紧。

**Suppression** 指 IED 前有一定 firing 增加，但在 IED 最大斜率附近快速下降。作者把它和 putative inhibitory dynamics 联系起来，也讨论了 depolarization block 等可能机制。

**Late activation** 指 IED 前 0-200 ms firing 下降，IED 最大斜率后 100-300 ms firing 增加。这类活动更接近 IED 后续慢波和恢复阶段。

这三类 firing pattern 不是任意数学聚类。它们和推定细胞类型有关系：early activation 和 late activation 中 regular-spiking cells 比例更高，而 suppression component 中 fast-spiking cells 比例更高。虽然 waveform-based classification 不能等同于细胞分子身份，但它为 excitatory-like 与 inhibitory-like dynamics 的解释提供了合理依据。

![Silva 等 2026 原文 Figure 2：IED 周围三类 peri-IED firing pattern 和层状分布](/images/ied-microcircuits/silva-2026-fig2-peri-ied-patterns.jpg)

*图 2. Silva 等 2026 原文 Figure 2，展示 IED 调制神经元比例、单个位点和全体神经元的 IED-locked firing heatmap、三类 k-means firing component，以及这些 component 与 waveform type 和 depth 的关系 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。*

**图 2 说明。** A 部分先说明每个 insertion site 中有多少神经元被 IED 调制，黑色部分是 modulated neurons，提示 IED 并不是只影响少量孤立单元。B-D 部分从单个位点到全体神经元展示 IED-locked firing：红色代表 firing 增强，蓝色代表 firing 降低，可以看到神经元峰值时间分散在 IED 前后。E-G 部分是文章的核心分类：early activation、suppression、late activation 三类模板不是主观画出来的，而是从 modulated neurons 的 PETH 中聚类得到。H-I 把这些 component 与 RS/FS/PS waveform 联系起来，suppression component 中 FS 比例更高。J-M 再把 peak time 和 component 放回 cortical depth，显示 early activation 更偏表层，但所有 component 都可跨深度出现。这个图把“异步 firing”和“层状细胞分工”连接在一起。

## 5. 层状结构：表层 regular-spiking early activation 最突出

把 firing pattern 放回皮层深度后，文章最有意思的层状结构出现了。三个 firing pattern 都能跨不同深度出现，但 early-activation neurons 更集中在表层。把 activation component 与 regular-spiking、suppression component 与 fast-spiking 结合后，这个层状差异更明显 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这说明 IED 的 sharp discharge initiation 并不是均匀发生在整条皮层柱中。表层 regular-spiking neurons 可能更接近 sharp discharge amplitude 的关键生成节点；更深层和 fast-spiking/suppression 相关神经元则可能更早参与状态转移。

对 SEEG/临床电生理来说，这个结论很重要。常规 SEEG 不能直接看到 cortical lamina，但可以提示我们：同一个 IED 波形背后可能有层状分工。宏观通道上的 spike 幅度、slow wave、high-frequency component 和 phase coupling 可能分别对应不同微环路成分。

## 6. IED 是一个动态 E-I imbalance 过程

作者把三类神经元群体的平均 firing 看成一个三维动力系统轨迹。结果显示，在 IED 发生前最多约 1,000 ms，suppression neurons 的 firing 已经下降；随后 suppression activity 短暂释放，early activation 活动上升并接近 sharp discharge，late activation 参与后续慢波和恢复 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

为了把这个过程量化，作者定义了一个 modified excitatory-inhibitory index：activation neurons 的活动除以 suppression neurons 的活动。这个 index 在 IED 前逐渐偏离 baseline，并在 IED initiation 附近出现明显变化。

这个模型把 IED 从“波形事件”改写成“微环路状态转移”。IED 前的抑制相关活动衰减、接近 sharp discharge 的兴奋相关释放、以及不同细胞群之间的相位错位，共同构成宏观可见的 IED。

## 7. 单神经元 firing 能编码 IED 的病理特征

文章不只判断神经元是否被 IED 调制，还问神经元 firing 是否能解释 IED 的具体 feature，例如 maximum amplitude、pre-discharge slow deflection、post-discharge slow wave。

time-lagged linear model 显示，IED-modulated neurons 中有相当一部分能预测 IED feature。尤其是 early-activation neurons 对 maximum amplitude 的关系最强，且这种 amplitude coding 在表层更强 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

对 slow components，late-activation neurons 与 aftergoing slow wave 有关，suppression neurons 与 antecedent slow deflection 有关。这提示 sharp component 和 slow component 不是一个单一过程的不同显示方式，而可能由不同微环路成分塑造。

![Silva 等 2026 原文 Figure 3：IED 生成的 E-I dynamics 和 amplitude coding](/images/ied-microcircuits/silva-2026-fig3-ei-microcircuit.jpg)

*图 3. Silva 等 2026 原文 Figure 3，展示 early activation、suppression、late activation 三类神经元在 IED 前后的动态轨迹，E-I index，cross-correlation，IED feature coding，以及 high/low amplitude IED 的神经元 firing 差异 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。*

**图 3 说明。** A-B 部分把三类神经元群体看作一个动态系统：在 IED 前，suppression activity 先发生变化；随后 early activation 上升并接近 IED sharp discharge；late activation 参与更晚阶段。C 部分把这一过程压缩成 E-I index，显示 IED 前后 excitatory-like 与 inhibitory-like 活动的比例动态变化。D-E 部分用 cross-correlation 说明这些细胞群不是零延迟同步放电，而是有非零 lag 的相互关系。F-H 定义 IED feature，包括 maximum amplitude、pre-IED minimum 和 post-IED minimum，并用 time-lagged model 连接神经元 firing 与这些 feature。I-M 进一步说明 early-activation neurons 对 maximum amplitude 的编码最强，且这种模型 fit 更偏表层。这个图是文章机制链条最完整的一张：它把 firing phase、E-I imbalance、feature coding 和 cortical depth 放在同一框架里。

## 8. IED 微环路也嵌入生理振荡

IED 如果只是病理事件，可能只需要解释它为什么会产生。但作者进一步问：这些被 IED 调制的神经元在 baseline 时是否也参与正常网络协调？为此，他们计算 spike-field coherence（SFC），也就是神经元 spike 与局部 LFP 相位之间的耦合强度。

结果显示，IED-modulated neurons 的低频 SFC 更高，early-activation neurons 尤其明显。更强的 SFC 还和更强的 IED amplitude coding 相关。这一点很重要，因为它说明 IED 不是在一个完全独立的病理子网络中发生；相反，它可能借用了本来参与生理节律协调的神经元和相位结构 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

![Silva 等 2026 原文 Figure 4：IED 调制神经元与低频 LFP oscillation 的 spike-field coherence](/images/ied-microcircuits/silva-2026-fig4-spike-field-coherence.jpg)

*图 4. Silva 等 2026 原文 Figure 4，展示单神经元 spike 与低频 LFP phase 的耦合方式、IED-modulated 与 non-modulated neurons 的 SFC 差异、不同 firing component 的 SFC 差异，以及 SFC 随 depth 的分布 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。*

**图 4 说明。** A 部分用一个示例 neuron 说明 SFC 的含义：spike 不是随机落在 LFP phase 上，而是偏向特定相位。B-C 部分把全体神经元按是否 IED-modulated、以及 early/suppression/late component 排列，显示 IED-modulated neurons 在低频段的相干性更强。D-E 是统计比较：IED-modulated neurons 的 1-10 Hz SFC 高于 non-modulated neurons，且 early-activation group 更突出。F 部分把 SFC 放回 depth，提示表层神经元更容易同时具有 IED amplitude coding 和 physiological oscillation coupling。这个图支撑了一个更强的解释：IED 微环路可能 co-opt 原本参与生理节律协调的局部网络。

## 9. IED 会 co-opt 本来参与认知的神经元

这篇文章的临床意义不只在预测。作者在 3 名患者中同时记录了 speech perception task，发现许多被 IED 调制的神经元也能编码 acoustic-phonetic features。更强的 IED modulation 与更强的 task encoding 相关 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

这支持一个清晰的解释：IED 不是只发生在“无功能病灶细胞”中，而是会临时 co-opt 本来参与正常认知处理、并与局部低频振荡相干的神经元。这样就能解释为什么 IED 即使没有发展成 seizure，也可能造成 transient cognitive impairment。

这也让 IED burden 的解释更复杂。数量当然重要，但发生在哪个功能区、是否出现在任务相关窗口、是否成串出现、是否具有更大幅度或更明显 slow wave，可能同样影响认知后果。

![Silva 等 2026 原文 Figure 5：IED 调制神经元与 speech perception task 的共享底物](/images/ied-microcircuits/silva-2026-fig5-ied-cognition.jpg)

*图 5. Silva 等 2026 原文 Figure 5，展示同一神经元对 sentence stimuli 和 IED 的反应、speech encoding model、IED modulation 与 task modulation 的重叠，以及共享神经元在 cortical depth 中的分布 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。*

**图 5 说明。** A 部分最直观：同一批神经元可以在听句子时有 task-locked firing，也可以在 IED 发生时被调制。B 部分说明 speech perception task 的 encoding model，它把 acoustic-phonetic features 映射到 neuronal firing。C 部分用 Venn 图展示 IED-modulated neurons 与 task-modulated neurons 的重叠，中央共享部分很大。D 部分进一步显示，在共享神经元中，task encoding strength 与 IED modulation depth 正相关。E-F 把这些神经元放回 depth：shared neurons 更偏表层。这个图把 IED 的病理电活动和认知功能连接起来，提示 transient cognitive impairment 可能来自 IED 临时挪用本来承担 sensory/language processing 的神经元。

## 10. 单神经元群体能早于传统 LFP/ECoG 预测 IED

作者比较了三种预测信息来源：ECoG line length、Neuropixels LFP line length、单神经元群体 firing。ECoG line length 只能在非常接近 IED 最大斜率时区分 IED window；Neuropixels LFP line length 略有提前，但仍有限。单神经元 firing 则在 7/9 个 cortical insertion sites 中可以提前 500-1,000 ms 预测 IED，平均约提前 786 ms <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

其中 suppression neurons 对 decoding 贡献最大。这个结果的转化意义很直接：现有 RNS 更像 reactive stimulation，即检测到宏观 epileptiform activity 后再刺激；如果未来设备能读取足够稳定的局部单元或高密度微电极 proxy，IED 可能从 reactive detection 走向 antecedent prediction。

作者还显示，神经元 firing 可以在一定程度上预测 IED 是否会成为 series，以及 high-versus-low amplitude IED。不过 amplitude 预测通常更接近 IED 发生时刻，说明不同 feature 的可预测时间尺度不同。

![Silva 等 2026 原文 Figure 6：单神经元 firing 对 IED 和病理特征的提前预测](/images/ied-microcircuits/silva-2026-fig6-ied-prediction.jpg)

*图 6. Silva 等 2026 原文 Figure 6，展示 ECoG/NP LFP line length 与单神经元 firing 的 IED prediction 对比，suppression neurons 的提前调制，预测模型流程，以及 isolated/series IED 和 high/low amplitude IED 的 decoding <sup class="citation">[<a href="#ref-1">1</a>]</sup>。*

**图 6 说明。** A-B 先给出传统检测/预测基线：ECoG 和 NP LFP line length 可以区分 IED window，但提前量有限。C 展示两个 suppression neurons 在 IED 前约 1 秒已经发生 firing modulation，这解释了为什么单神经元可能早于宏观 LFP 波形提供预测信息。D 是模型流程：把 baseline 和 IED-forecasting window 的 neuronal firing 经 PCA 降维，再用 logistic regression 分类。E-F 显示多个 cortical sites 中可以提前 500-1,000 ms 达到 above-chance prediction。G-H 说明 decoding contribution 来自不同 depth 和 firing component，其中 suppression neurons 贡献最大。I-K 把问题扩展到 isolated vs series IED，L-N 则扩展到 high vs low amplitude IED。这个图让文章的机制结果进入闭环刺激语境：如果能提前读出微环路状态，就可能从 reactive stimulation 转向 proactive stimulation。

## 11. 方法上的几个细节

这篇文章的方法链条比较完整。IED 标注使用 line-length detector 加人工校正，最大绝对斜率作为统一对齐点。神经元提取使用 Kilosort 2.5 和人工 curate。细胞类型推断基于多通道 spatiotemporal waveform，FS 与 RS 的 trough-peak time 分离 AUROC 达到 0.99 <sup class="citation">[<a href="#ref-1">1</a>]</sup>。

firing pattern 分类基于 peri-IED PETH 的 z-score 和 k-means，cluster number 用 elbow method 和 NMF 做补充验证。feature coding 使用 ridge regression temporal receptive field model。prediction 则把 neuronal firing downsample 到 20 Hz，逐时间点累计信息，PCA 降维后用 logistic regression 分类 baseline vs pre-IED window，并用 shuffle null distribution 估计 chance level。

这些细节说明，文章不是只靠一张漂亮的 raster plot 得出结论，而是从 waveform、depth、PETH、feature model、SFC、task encoding 和 prediction 多个角度互相支撑。

## 12. 需要谨慎的地方

第一，样本量小。最终主分析只有 4 名患者、9 个 insertion sites。对人类术中 Neuropixels 来说这已经很难得，但不能直接泛化到所有癫痫病因、脑区和 IED 形态。

第二，记录位置主要是 lateral temporal neocortex epileptogenic tissue。海马、杏仁核、额叶皮层等区域的 IED 微环路可能不同。

第三，虽然 CSD 和提前神经元调制支持局部生成，但作者不能完全证明所有 IED 都是 probe 附近局部生成，而不是从更远处传播到记录点。

第四，细胞类型是 waveform-based putative classification，不是形态学或分子标签确认。RS/FS/positive-spiking 的解释应视为合理推断，而不是绝对细胞身份。

第五，prediction 是离线分析。真正用于临床闭环刺激时，还要面对 chronic recording stability、implantable hardware、实时计算、刺激安全性，以及是否真正改善认知或 seizure outcome 等问题。

## 13. 对 SEEG/IED 研究的启发

这篇文章对 SEEG 和临床 IED 分析有几个直接启发。

首先，IED 不能只按“有没有 spike”或“spike 幅度多大”理解；应该区分 sharp component、slow wave、series tendency、amplitude coding 等 feature。其次，IED 前数百毫秒到 1 秒的状态可能比 IED 本身更有预测价值，尤其是与 inhibition/suppression 衰减相关的信号。再次，层状和细胞类型信息在常规 SEEG 中不可直接获得，但可以启发我们在宏电极信号中寻找 proxy，例如高频活动、相位耦合、line length 之外的时频结构或局部网络状态。

如果 IED 真的会 co-opt cognitive neurons，那么临床上评估 IED burden 时不应只看数量，还应结合发生时刻、任务状态、脑区功能和是否成串出现。对闭环刺激而言，目标也可能不只是“检测后抑制 spike”，而是识别 IED 前的可干预微环路状态。

## 14. 一个简短结论

Silva 等的工作把人类 IED 的理解推进到单神经元和皮层层状微环路层面。IED 不是一个简单的同步 spike，而是一个由 suppression decay、表层 activation、late activation 和生理-认知神经元共用共同构成的动态过程。

对临床转化而言，最重要的信息是：IED 的可预测信号可能早于宏观波形出现。如果未来能找到可植入、稳定、可实时读取的 proxy，就有机会从 reactive detection 走向 proactive neuromodulation。

## 参考文献

<div class="references">
<p id="ref-1"><span class="ref-label">[1]</span> Silva, A. B. et al. Laminar organization of cellular microcircuits modulating human interictal epileptiform discharges. <em>Nature Neuroscience</em> (2026). DOI: <a href="https://doi.org/10.1038/s41593-026-02258-4">10.1038/s41593-026-02258-4</a>.</p>
</div>
