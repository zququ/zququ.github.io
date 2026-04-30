---
title: SEEG 与 EEG 癫痫发作预测：从特征工程到基础模型
date: 2026-04-30 15:30:00
tags:
  - SEEG
  - EEG
  - 癫痫
  - 机器学习
  - 深度学习
comments: true
---

本文基于 Zotero collection `ZququRAY / seeg/warning` 中的文献整理而成。导出时 collection 内共有 16 条记录，其中 15 条与癫痫发作检测、预测、SEEG/iEEG/EEG 信号分析或临床转化相关；另有 1 条数学博客网页记录（原 Zotero 编号 S12）与本主题无关，本文不纳入综述。

这组文献不只是在比较“哪个模型准确率更高”，而是在回答三个层次的问题。第一，EEG/SEEG 信号怎样被转换为可以学习的表示，例如频谱功率、时频图、纹理特征或图像化波形 <sup class="citation">[<a href="#ref-s1">1</a>,<a href="#ref-s15">14</a>,<a href="#ref-s16">15</a>]</sup>。第二，模型怎样利用这些表示完成检测、预测或分类，例如 SVM、FCN、MobileNetV2、1D CNN 和 SEEGformer <sup class="citation">[<a href="#ref-s2">2</a>,<a href="#ref-s8">8</a>,<a href="#ref-s9">9</a>,<a href="#ref-s13">12</a>,<a href="#ref-s14">13</a>]</sup>。第三，算法结果能否进入临床流程，例如发作前期窗口、误报率、有效连接、手术预后和基础模型迁移 <sup class="citation">[<a href="#ref-s3">3</a>,<a href="#ref-s4">4</a>,<a href="#ref-s7">7</a>,<a href="#ref-s10">10</a>]</sup>。

## 1. 先区分任务：检测、预测、鉴别诊断和术前定位不是一回事

癫痫自动分析常被笼统称为 seizure detection 或 seizure prediction，但这两个词背后的临床问题差别很大。检测任务是在发作已经发生或正在发生时识别事件，目标是减少人工阅片负担、提高长程监测效率；预测任务要求在发作前给出可行动的预警，核心难点是提前量、误报率和患者可接受性。鉴别诊断又是另一个问题，例如区分 epileptic seizures 与 psychogenic non-epileptic seizures；术前定位则关心 epileptogenic zone 和手术预后。

Fussner 等的工作很适合作为“任务进入临床流程”的例子。他们不是直接从原始数值序列训练模型，而是把临床 EEG 阅片界面中的 waveform plot 截成图像，再用 MobileNetV2 迁移学习进行 epileptic 与 psychogenic non-epileptic seizures 的分类 <sup class="citation">[<a href="#ref-s14">13</a>]</sup>。

![Fussner 等原文 Figure 1：EEG plot image 分类流程](/images/seeg/s14-fig1-project-overview.jpg)

*图 1. Fussner 等 2024 原文 Figure 1，展示从 EMU 临床 EEG 到 EEG plot image，再到 CNN 训练和测试的完整流程 <sup class="citation">[<a href="#ref-s14">13</a>]</sup>。原文为 CC BY 4.0 开放获取。*

**图 1 说明。** 这张图的关键不在于模型名字，而在于它把“临床已经存在的阅片对象”变成了机器学习输入。A 部分是数据采集：Site A 和 Site B 的 EMU 诊断与临床 EEG 数据先经过 montage、频率滤波和 plot length 设置，再捕获成 EEG plot data。B 部分是数据处理：图像被切成 5-6 秒片段，经过人工 review 和 EMG artifact image removal。C 部分才进入 CNN：图像被 resize 到 224 x 224，然后划分训练与测试数据。这个流程说明，深度学习并不一定要从原始电压序列开始；它也可以学习医生实际看到的图像化信号。不过这种设计也带来限制：模型性能会受到显示软件、montage、截图长度、artifact 过滤规则和跨中心图像风格差异的影响。

这一点对 SEEG/EEG 博客写作很重要：讨论算法前必须先说清楚输入是什么、任务是什么、评价单位是什么。检测模型可以重点报告 accuracy、specificity、AUC 或 recall；预测模型必须同时回答能否提前预测、提前多久、每小时误报多少次。Zhang 和 Parhi 的低复杂度 iEEG/sEEG 预测工作突出实时和低功耗部署，属于预测系统范式 <sup class="citation">[<a href="#ref-s1">1</a>]</sup>；Gomez 等的 imaged-EEG FCN 工作主要面向自动检测，并报告 false alarms per hour <sup class="citation">[<a href="#ref-s13">12</a>]</sup>；Ren 等的综述则提醒我们，比较 seizure prediction model 时必须把指标定义和验证协议一起看 <sup class="citation">[<a href="#ref-s7">7</a>]</sup>。

## 2. 传统特征工程仍然有价值：它把电生理先验显式写进模型

传统路线的核心流程是预处理、窗口切分、特征提取、特征选择和分类器预测。它的优势不是“模型复杂”，而是把神经电生理知识显式编码到特征里：频带功率代表节律活动，功率比值描述频谱重分布，时频纹理描述发作模式在时间-频率平面上的形态，混沌动力学指标则试图捕捉发作前脑网络从稳定状态向临界状态转移的过程 <sup class="citation">[<a href="#ref-s1">1</a>,<a href="#ref-s5">5</a>,<a href="#ref-s6">6</a>,<a href="#ref-s15">14</a>,<a href="#ref-s16">15</a>]</sup>。

Sengur 等的时频纹理方法把传统特征工程表达得很清楚：先把 EEG 信号变成 spectrogram，再把 spectrogram 转成灰度图并按频带分块，随后提取 GLCM、TFCM 和 LBP 纹理描述子，最后用 SVM 分类 <sup class="citation">[<a href="#ref-s16">15</a>]</sup>。

![Sengur 等原文 Figure 1：时频纹理分类流程](/images/seeg/s16-fig1-method-pipeline.jpg)

*图 2. Sengur 等 2016 原文 Figure 1，展示从 EEG 波形到时频图、频带子图、纹理描述子和 SVM 分类的完整 pipeline <sup class="citation">[<a href="#ref-s16">15</a>]</sup>。原文为 CC BY 4.0 开放获取。*

**图 2 说明。** 左侧是原始 EEG 波形，下一步用 STFT spectrogram 把时间序列投影到时间-频率平面；中间灰度条带表示按 delta、theta、alpha、beta、gamma 等频段切分后的子图；右侧的 GLCM、TFCM、LBP 是从这些子图中提取纹理特征，最终交给 SVM 判断 seizure 或 healthy。这个图解释了为什么“图像化 EEG”不等于深度学习：同样是图像表示，传统方法会手工定义纹理统计量，而不是让 CNN 自己学习滤波器。它的优点是可解释、数据效率高、计算成本低；缺点是每一步都需要人为设定，跨患者和跨设备泛化容易受限。

Boubchir 等的 Haralick texture 工作也属于同一路线。他们从 time-frequency images 中提取 Haralick texture descriptors，再用 SVM 检测与分类癫痫发作 <sup class="citation">[<a href="#ref-s15">14</a>]</sup>。SPIE 2026 的 PCA + SVM SEEG 预测条目则将高维 SEEG 信号先投影到低维空间，再用 SVM 分类 <sup class="citation">[<a href="#ref-s11">11</a>]</sup>。这些方法看起来不如深度网络“现代”，但在小样本、可解释、低功耗和实时部署场景仍然很实用。

![Sengur 等原文 Figure 6：健康与癫痫发作 EEG 的 spectrogram 对比](/images/seeg/s16-fig5-6-waveform-spectrogram.jpg)

*图 3. Sengur 等 2016 原文 Figure 6，比较健康 EEG 与癫痫发作 EEG 的时频谱图 <sup class="citation">[<a href="#ref-s16">15</a>]</sup>。原文为 CC BY 4.0 开放获取。*

**图 3 说明。** 横轴是时间，纵轴是频率，颜色代表相应时间-频率位置上的能量强弱。左图和右图分别对应健康与癫痫发作样本，二者在低频能量分布、垂直纹理结构和频带局部模式上有明显差异。传统纹理方法正是利用这些差异：它不直接解释每一个采样点，而是把时频图当作纹理图像，统计局部灰度共现、边缘变化或局部二值模式。需要注意的是，图中差异很直观，但它来自特定数据集和特定预处理流程；把这种视觉差异迁移到临床 SEEG 时，还要重新考虑采样率、导联布局、噪声、患者个体化电极位置和发作类型。

## 3. 深度学习提高表达能力，但不自动解决任务定义和泛化问题

深度学习路线把特征发现交给模型。输入可以是原始时间序列、时频图、EEG plot image、通道序列或图结构表示。模型自动学习波形形态、频谱变化、通道交互和空间传播模式，因此表达能力更强，也更适合处理传统特征难以覆盖的高维动态。

Gomez 等把 EEG 信号转换为 imaged-EEG 表示，再使用 fully convolutional networks 完成自动检测 <sup class="citation">[<a href="#ref-s13">12</a>]</sup>。他们的原文架构图说明了 FCN 如何沿时间维度逐步压缩，并输出 ictal/interictal 的分类概率。

![Gomez 等原文 Figure 11：FCN 架构](/images/seeg/s13-fig11-fcn-architecture.jpg)

*图 4. Gomez 等 2020 原文 Figure 11，展示用于 EEG 自动检测的 fully convolutional network 架构 <sup class="citation">[<a href="#ref-s13">12</a>]</sup>。原文为 CC BY 4.0 开放获取。*

**图 4 说明。** 左侧输入是 EEG signals，被组织成“通道 x 时间”的二维表示；绿色输入块中的 N channels 表示通道数量，W 表示窗口宽度。网络主体由多组 convolution、batch normalization、ReLU 和 pooling 组成，每经过一层 pooling，时间维度按 4 倍逐步缩小。最后的 fully convolutional 层替代传统全连接层，并通过 SoftMax 输出类别概率。这个结构的优势是可以直接从多通道时序图像中学习局部时空模式，减少手工特征工程；代价是可解释性下降，而且模型性能高度依赖训练集、患者划分、窗口定义和类不平衡处理。Gomez 等还报告了 false alarm rate，这一点比单纯 accuracy 更接近临床使用场景 <sup class="citation">[<a href="#ref-s13">12</a>]</sup>。

SEEG/iEEG 预测方面，Wang 等使用一维 CNN 并结合通道选择策略，面向长程 intracranial EEG 进行发作预测 <sup class="citation">[<a href="#ref-s8">8</a>]</sup>；后续 channel increment strategy-based 1D CNN 进一步讨论逐步增加通道时的性能变化，为“多少通道足够”这个临床部署问题提供了数据驱动视角 <sup class="citation">[<a href="#ref-s9">9</a>]</sup>。这些研究连接了端到端学习和通道选择：模型自动学习特征，但输入通道的筛选仍然强烈依赖信号质量和临床覆盖范围。

SEEGformer 是更专门面向 SEEG 的 Transformer 架构，用于个体化 SEEG seizure detection 和 epileptogenic zone localisation <sup class="citation">[<a href="#ref-s2">2</a>]</sup>。它代表了一个趋势：SEEG 的价值不仅是检测发作，还在于定位发作相关网络和致痫区。Transformer 的优势是建模长程依赖和多通道交互，但代价是计算需求更高、训练数据需求更大、解释需要额外机制支撑。

## 4. 预测系统的难点往往不是模型，而是标签、窗口和误报

Koutsouvelis 等讨论了 deep learning-based epileptic seizure prediction 中 preictal period optimization 的问题 <sup class="citation">[<a href="#ref-s4">4</a>]</sup>。这类研究非常重要，因为预测任务并不只是模型选择问题，更是标签定义问题。发作前期窗口太短，模型可能错过更早出现的慢性状态变化；窗口太长，则可能把大量非特异状态标成 preictal，从而提高误报。

评价指标也必须区分检测和预测。检测模型常见指标包括 accuracy、sensitivity、specificity、precision、recall、F1 和 AUC <sup class="citation">[<a href="#ref-s13">12</a>,<a href="#ref-s14">13</a>]</sup>。预测模型还必须报告 false alarm rate、prediction horizon、seizure prediction horizon 和 seizure occurrence period。Iasemidis 的长期在线实时研究强调 prospective 和 real-time，这一点比离线高分更接近真实应用 <sup class="citation">[<a href="#ref-s5">5</a>]</sup>。Zhang 和 Parhi 的低复杂度方法也提醒我们，预测算法最终要落到可持续运行的硬件和功耗预算上 <sup class="citation">[<a href="#ref-s1">1</a>]</sup>。

对临床可用性来说，高 AUC 并不自动等价于好系统。患者更关心的是：预警是否足够早、误报是否低到可接受、漏报是否少、报警后能否采取行动。因此，比较模型时不能只看一个平均指标，还要看患者级分布、跨中心验证、误报时间结构和失败案例。图 1 到图 4 也共同说明了这一点：输入表示、临床流程、模型结构和评价协议会一起决定结果。

## 5. 从检测走向临床转化：需要混合系统，而不是单一模型

传统方法和深度学习不应被理解为互斥路线。更实际的方向是混合策略：用传统特征注入可解释先验，用深度网络学习非线性和时空交互，用临床变量提供患者背景和解剖约束。

例如，时频纹理特征可以作为轻量模型的输入，也可以作为 CNN 的先验表示 <sup class="citation">[<a href="#ref-s13">12</a>,<a href="#ref-s15">14</a>,<a href="#ref-s16">15</a>]</sup>。通道选择可以先用统计或临床规则缩小范围，再交给 CNN 或 Transformer 学习通道间动态 <sup class="citation">[<a href="#ref-s8">8</a>,<a href="#ref-s9">9</a>]</sup>。有效连接研究则把 SEEG 从单纯信号分类推进到网络机制解释：Hu 等使用 effective connectivity 预测 temporal lobe epilepsy 的手术结局，说明 SEEG 网络特征不仅能服务检测/预测，也能进入术前评估和临床决策 <sup class="citation">[<a href="#ref-s3">3</a>]</sup>。

融合可以发生在三个层次。特征级融合是把频带功率、连接性、时频纹理和临床变量拼接；表示级融合是让不同网络分支分别处理原始信号、频域图和解剖图，再合并 latent representation；决策级融合则是多个模型分别输出风险评分，最后进行校准与投票。对临床系统来说，决策级融合往往更容易解释和监管，而表示级融合可能有更高性能上限。

## 6. 基础模型的机会：跨患者预训练，但必须警惕偏差

Brant 作为 intracranial neural signal foundation model，代表了一个新方向：用大规模颅内神经信号预训练，再迁移到多种下游任务 <sup class="citation">[<a href="#ref-s10">10</a>]</sup>。这类模型的愿景是“一次预训练，多患者适配”，缓解 SEEG 小样本、跨患者泛化差和标注昂贵的问题。

基础模型对 SEEG 特别有吸引力。SEEG 通道空间分布不规则、患者电极植入方案个体化，传统跨患者模型很难直接共享通道维度。预训练模型如果能学习更抽象的神经动力学表示，就有机会降低个体化微调所需数据量。它也可以支持检测、预测、频率/相位重建、异常片段识别和致痫网络定位等多任务。

但风险也不能低估。第一，预训练数据来源、病种构成、采样率、通道命名和临床标签必须透明，否则迁移结果难以解释。第二，基础模型可能学习到中心特异性或设备特异性偏差。第三，临床部署需要轻量化、蒸馏和校准，否则大模型难以放进实时闭环系统。第四，SEEG 数据涉及高度敏感的患者信息，多中心预训练必须面对隐私、合规和数据治理问题。

## 7. 小结

基于 `seeg/warning` 这一小型 Zotero corpus，可以看到癫痫发作预测技术正在从“手工特征加分类器”转向“端到端深度模型和基础模型”，但传统特征工程并没有失去价值。它仍然在小样本、可解释、低功耗和实时部署方面占优 <sup class="citation">[<a href="#ref-s1">1</a>,<a href="#ref-s11">11</a>,<a href="#ref-s15">14</a>,<a href="#ref-s16">15</a>]</sup>。深度学习则在高维表示、多通道交互和复杂模式学习上更有潜力 <sup class="citation">[<a href="#ref-s2">2</a>,<a href="#ref-s8">8</a>,<a href="#ref-s9">9</a>,<a href="#ref-s13">12</a>,<a href="#ref-s14">13</a>]</sup>。

真正可能胜出的不是单一路线，而是结合专家先验、深度表示、连接网络、个体化校准和前瞻性验证的混合系统。写作上也应该保持这个边界：检测、预测、定位、鉴别诊断和预后评估是相关但不同的任务。把它们区分清楚，才能正确比较模型，也才能把算法指标转化为临床价值。

## 图像来源说明

本文插入的原文图均来自开放获取论文，并保留原文图号、来源论文和引用链接。Fussner 等 2024、Gomez 等 2020、Sengur 等 2016 均在原文中声明为 Creative Commons Attribution 4.0 或开放获取许可 <sup class="citation">[<a href="#ref-s13">12</a>,<a href="#ref-s14">13</a>,<a href="#ref-s16">15</a>]</sup>。Boubchir 等 2014 为 IEEE 会议论文，本文只引用其方法结论，不直接复用原图 <sup class="citation">[<a href="#ref-s15">14</a>]</sup>。

## 参考文献

- <span id="ref-s1" class="ref-label">[1]</span> Zhang Z, Parhi KK. Low-Complexity Seizure Prediction From iEEG/sEEG Using Spectral Power and Ratios of Spectral Power. IEEE Transactions on Biomedical Circuits and Systems. 2016. DOI: 10.1109/tbcas.2015.2477264.
- <span id="ref-s2" class="ref-label">[2]</span> Wang C et al. SEEGformer: personalised SEEG-based seizure detection and epileptogenic zone localisation for drug-resistant epilepsy. eBioMedicine. 2026. DOI: 10.1016/j.ebiom.2025.106085.
- <span id="ref-s3" class="ref-label">[3]</span> Hu X et al. Effective Connectivity Predicts Surgical Outcomes in Temporal Lobe Epilepsy: A SEEG Study. CNS Neuroscience & Therapeutics. 2025. DOI: 10.1111/cns.70563.
- <span id="ref-s4" class="ref-label">[4]</span> Koutsouvelis P et al. Preictal period optimization for deep learning-based epileptic seizure prediction. Journal of Neural Engineering. 2024. DOI: 10.1088/1741-2552/ad9ad0.
- <span id="ref-s5" class="ref-label">[5]</span> Iasemidis LD et al. Long-term prospective on-line real-time seizure prediction. Clinical Neurophysiology. 2005. DOI: 10.1016/j.clinph.2004.10.013.
- <span id="ref-s6" class="ref-label">[6]</span> Iasemidis LD. Seizure Prediction and its Applications. Neurosurgery Clinics of North America. 2011. DOI: 10.1016/j.nec.2011.07.004.
- <span id="ref-s7" class="ref-label">[7]</span> Ren Z, Han X, Wang B. The performance evaluation of the state-of-the-art EEG-based seizure prediction models. Frontiers in Neurology. 2022. DOI: 10.3389/fneur.2022.1016224.
- <span id="ref-s8" class="ref-label">[8]</span> Wang X et al. One-Dimensional Convolutional Neural Networks Combined with Channel Selection Strategy for Seizure Prediction Using Long-Term Intracranial EEG. International Journal of Neural Systems. 2021. DOI: 10.1142/s0129065721500489.
- <span id="ref-s9" class="ref-label">[9]</span> Wang X et al. Channel Increment Strategy-Based 1D Convolutional Neural Networks for Seizure Prediction Using Intracranial EEG. IEEE Transactions on Neural Systems and Rehabilitation Engineering. 2023. DOI: 10.1109/tnsre.2022.3222095.
- <span id="ref-s10" class="ref-label">[10]</span> Zhang D et al. Brant: Foundation Model for Intracranial Neural Signal. NeurIPS. 2023.
- <span id="ref-s11" class="ref-label">[11]</span> Liu J et al. Seizure Prediction using Principal Component Analysis and Support Vector Machine on Stereotactic Electroencephalogram. Proceedings of SPIE. 2026.
- <span id="ref-s13" class="ref-label">[12]</span> Gomez C et al. Automatic seizure detection based on imaged-EEG signals through fully convolutional networks. Scientific Reports. 2020. DOI: 10.1038/s41598-020-78784-3.
- <span id="ref-s14" class="ref-label">[13]</span> Fussner S et al. Differentiating Epileptic and Psychogenic Non-Epileptic Seizures Using Machine Learning Analysis of EEG Plot Images. Sensors. 2024. DOI: 10.3390/s24092823.
- <span id="ref-s15" class="ref-label">[14]</span> Boubchir L et al. Haralick feature extraction from time-frequency images for epileptic seizure detection and classification of EEG data. International Conference on Microelectronics. 2014. DOI: 10.1109/ICM.2014.7071799.
- <span id="ref-s16" class="ref-label">[15]</span> Sengur A et al. Time-frequency texture descriptors of EEG signals for efficient detection of epileptic seizure. Brain Informatics. 2016. DOI: 10.1007/s40708-015-0029-8.
