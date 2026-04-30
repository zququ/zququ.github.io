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

本文基于 Zotero collection `ZququRAY / seeg/warning` 中的文献整理而成。导出时 collection 内共有 16 条记录，其中 15 条与癫痫发作检测、预测、SEEG/iEEG/EEG 信号分析或临床转化相关；另有 1 条数学博客网页记录 [S12] 与本主题无关，本文不纳入综述。

这批文献覆盖了三个层次：第一是传统特征工程与机器学习，例如频谱功率、时频纹理、PCA 降维、SVM 和混沌动力学方法 [S1,S5,S6,S11,S15,S16]；第二是深度学习端到端建模，包括 FCN、CNN、通道选择 CNN、EEG plot image CNN 和 SEEGformer [S2,S8,S9,S13,S14]；第三是面向临床转化的关键问题，包括发作前期窗口优化、有效连接与手术预后、基础模型和多任务预训练 [S3,S4,S7,S10]。

## 1. 问题边界：检测、预测与临床决策不是同一个任务

癫痫自动分析常被统一称为 seizure detection 或 seizure prediction，但两者的临床含义不同。检测任务是在发作已经发生或正在发生时识别事件，目标是减少人工阅片负担、提高长程监测效率；预测任务则要求在发作前给出可行动的预警，核心难点是提前量、误报率和患者可接受性。

这一差异决定了评价体系也不同。检测模型可以重点报告 accuracy、specificity、AUC 或 recall；预测模型必须同时回答三个问题：能否提前预测、提前多久、每小时误报多少次。Zhang 和 Parhi 的低复杂度 iEEG/sEEG 预测工作突出实时和低功耗部署，属于预测系统范式 [S1]；Gomez 等基于 imaged-EEG 的 FCN 工作主要面向自动检测，并报告了高 accuracy 与 false alarms per hour [S13]。Iasemidis 的长期在线实时预测研究则代表了更早期、但更接近临床预警问题的动态系统路线 [S5,S6]。

## 2. 传统特征工程：专家先验带来可解释性和数据效率

传统路线的核心流程是预处理、窗口切分、特征提取、特征选择和分类器预测。它的优势不是“模型复杂”，而是把神经电生理知识显式编码到特征里：频带功率代表节律活动，功率比值描述频谱重分布，时频纹理描述发作模式在时间-频率平面上的形态，混沌动力学指标则试图捕捉发作前脑网络从稳定状态向临界状态转移的过程 [S1,S5,S6,S15,S16]。

Zhang 和 Parhi 使用 spectral power 及 spectral power ratios 构建低复杂度预测算法，强调 iEEG/sEEG 场景下可部署性和能耗约束 [S1]。这类方法适合嵌入式或边缘设备，因为输入特征维度低，分类器可以选用线性 SVM 等轻量模型。SPIE 2026 的 PCA + SVM SEEG 预测条目也沿着同一思路，将高维 SEEG 信号先投影到低维空间，再用 SVM 分类 [S11]。需要注意的是，该条目在公开索引中的作者与细节仍需进一步核对，Zotero `Extra` 字段中已保留 caution。

另一条传统路线是把 EEG 或 iEEG 的时频图当作纹理图像，然后提取 Haralick、GLCM、LBP 等手工图像特征。Boubchir 等从 time-frequency images 中提取 Haralick texture descriptors，再用 SVM 进行检测与分类 [S15]；Sengur 等进一步比较 GLCM、TFCM 和 LBP，在传统机器学习框架内获得较高分类性能 [S16]。这些工作说明，“图像化 EEG”并不一定等于深度学习；它也可以作为手工特征工程的载体。

传统方法的优点很明确：可解释性高，每个特征通常有明确生理或信号处理含义；数据效率高，小样本即可训练有效模型；计算资源需求低，适合实时预警和嵌入式部署。缺点同样明显：开发周期长，需反复调优通道、窗口、频段、特征组合和分类器参数；跨患者泛化能力有限；当 SEEG 电极布置、发作起始区和传播路径高度个体化时，人工特征很难完整覆盖所有动态模式。

## 3. 深度学习端到端：自动学习提高表达能力，但解释和数据需求成为代价

深度学习路线把特征发现交给模型。输入可以是原始时间序列、时频图、EEG plot image、通道序列或图结构表示。模型自动学习波形形态、频谱变化、通道交互和空间传播模式，因此表达能力更强，也更适合处理传统特征难以覆盖的高维动态。

Gomez 等把 EEG 信号转换为 imaged-EEG 表示，再使用 fully convolutional networks 完成自动检测 [S13]。Fussner 等则更接近临床阅片场景：他们直接使用 EEG waveform plot images，并用 MobileNetV2 transfer learning 区分 epileptic 与 psychogenic non-epileptic seizures，在两个医疗中心数据上验证了跨显示软件的鲁棒性 [S14]。这类方法的启发在于，模型不一定只能读取原始数值信号，也可以学习临床医生实际看到的图像化表示。

SEEG/iEEG 预测方面，Wang 等使用一维 CNN 并结合通道选择策略，面向长程 intracranial EEG 进行发作预测 [S8]；后续 channel increment strategy-based 1D CNN 进一步讨论逐步增加通道时的性能变化，为“多少通道足够”这个临床部署问题提供了数据驱动视角 [S9]。这些研究连接了端到端学习和通道选择：模型自动学习特征，但输入通道的筛选仍然强烈依赖信号质量和临床覆盖范围。

SEEGformer 是更专门面向 SEEG 的 Transformer 架构，用于个体化 SEEG seizure detection 和 epileptogenic zone localisation [S2]。它代表了一个趋势：SEEG 的价值不仅是检测发作，还在于定位发作相关网络和致痫区。Transformer 的优势是建模长程依赖和多通道交互，但代价是计算需求更高、训练数据需求更大、解释需要额外机制支撑。

因此，深度学习不是完全摆脱专家知识，而是把专家知识从“显式特征公式”转移到“输入表示、窗口定义、通道组织、模型架构和训练策略”中。其可解释性相对较低，具有黑箱特性；数据效率也低，通常需要大量标注数据。对 SEEG 来说，这一点尤其关键，因为 SEEG 数据昂贵、患者间电极布局不一致、发作样本数量有限。

## 4. 发作前期窗口与评估指标：模型性能首先取决于任务定义

Koutsouvelis 等讨论了 deep learning-based epileptic seizure prediction 中 preictal period optimization 的问题 [S4]。这类研究非常重要，因为预测任务并不只是模型选择问题，更是标签定义问题。发作前期窗口太短，模型可能错过更早出现的慢性状态变化；窗口太长，则可能把大量非特异状态标成 preictal，从而提高误报。

评价指标也必须区分检测和预测。检测模型常见指标包括 accuracy、sensitivity、specificity、precision、recall、F1 和 AUC [S13,S14]。预测模型还必须报告 false alarm rate、prediction horizon、seizure prediction horizon 和 seizure occurrence period。Ren 等对 EEG-based seizure prediction models 的性能评估工作可以作为阅读这些指标的入口 [S7]。

对临床可用性来说，高 AUC 并不自动等价于好系统。患者更关心的是：预警是否足够早、误报是否低到可接受、漏报是否少、报警后能否采取行动。Iasemidis 的长期在线实时研究强调 prospective 和 real-time，这一点比离线高分更接近真实应用 [S5]。Zhang 和 Parhi 的低复杂度方法也提醒我们，预测算法最终要落到可持续运行的硬件和功耗预算上 [S1]。

## 5. 融合策略：传统特征、深度表示和临床变量需要一起进入系统

传统方法和深度学习不应被理解为互斥路线。更实际的方向是混合策略：用传统特征注入可解释先验，用深度网络学习非线性和时空交互，用临床变量提供患者背景和解剖约束。

例如，时频纹理特征可以作为轻量模型的输入，也可以作为 CNN 的先验表示 [S13,S15,S16]。通道选择可以先用统计或临床规则缩小范围，再交给 CNN 或 Transformer 学习通道间动态 [S8,S9]。有效连接研究则把 SEEG 从单纯信号分类推进到网络机制解释：Hu 等使用 effective connectivity 预测 temporal lobe epilepsy 的手术结局，说明 SEEG 网络特征不仅能服务检测/预测，也能进入术前评估和临床决策 [S3]。

融合还可以发生在三个层次。特征级融合是把频带功率、连接性、时频纹理和临床变量拼接；表示级融合是让不同网络分支分别处理原始信号、频域图和解剖图，再合并 latent representation；决策级融合则是多个模型分别输出风险评分，最后进行校准与投票。对临床系统来说，决策级融合往往更容易解释和监管，而表示级融合可能有更高性能上限。

## 6. 从单患者模型到基础模型：SEEG 预训练的机会与风险

Brant 作为 intracranial neural signal foundation model，代表了一个新方向：用大规模颅内神经信号预训练，再迁移到多种下游任务 [S10]。这类模型的愿景是“一次预训练，多患者适配”，缓解 SEEG 小样本、跨患者泛化差和标注昂贵的问题。

基础模型对 SEEG 特别有吸引力。SEEG 通道空间分布不规则、患者电极植入方案个体化，传统跨患者模型很难直接共享通道维度。预训练模型如果能学习更抽象的神经动力学表示，就有机会降低个体化微调所需数据量。它也可以支持检测、预测、频率/相位重建、异常片段识别和致痫网络定位等多任务。

但风险也不能低估。第一，预训练数据来源、病种构成、采样率、通道命名和临床标签必须透明，否则迁移结果难以解释。第二，基础模型可能学习到中心特异性或设备特异性偏差。第三，临床部署需要轻量化、蒸馏和校准，否则大模型难以放进实时闭环系统。第四，SEEG 数据涉及高度敏感的患者信息，多中心预训练必须面对隐私、合规和数据治理问题。

## 7. 临床转化：真正的瓶颈是长期稳定和信任

从这组文献看，癫痫发作预测已经不缺模型原型，真正困难在于长期、实时、可解释、可维护的临床系统。至少有五个瓶颈。

第一，长期监测稳定性。SEEG 是术前评估常用技术，植入周期有限；长期植入式系统还会面临电极移位、组织反应和信号质量退化。第二，个体化自适应。患者状态、药物、睡眠、发作类型和电极环境都会变化，模型必须持续校准。第三，误报控制。误报过多会迅速消耗患者信任，即使模型离线 AUC 很高也可能不可用。第四，解释与责任。医生需要知道模型关注哪些通道、频段、脑区或连接，而不是只看到一个黑箱风险分数。第五，监管与验证。单中心回顾性数据不足以支撑高风险医疗器械，需要跨中心、前瞻性、真实世界验证。

这也是为什么有效连接、通道选择、低复杂度模型和基础模型应该被放在同一个路线图里看。有效连接提升机制解释 [S3]；通道选择降低硬件和标注负担 [S8,S9]；低复杂度算法支持实时部署 [S1]；基础模型尝试解决数据效率和泛化 [S10]。单独看每条路线都不完整，组合起来才接近临床系统。

## 8. 小结

基于 `seeg/warning` 这一小型 Zotero corpus，可以看到癫痫发作预测技术正在从“手工特征加分类器”转向“端到端深度模型和基础模型”，但传统特征工程并没有失去价值。它仍然在小样本、可解释、低功耗和实时部署方面占优 [S1,S11,S15,S16]。深度学习则在高维表示、多通道交互和复杂模式学习上更有潜力 [S2,S8,S9,S13,S14]。未来更可能胜出的不是单一路线，而是结合专家先验、深度表示、连接网络、个体化校准和前瞻性验证的混合系统。

这组文献也提示一个写作和研究上的边界：检测、预测、定位和预后评估是相关但不同的任务。把它们区分清楚，才能正确比较模型，也才能把算法指标转化为临床价值。

## 参考文献

- [S1] Zhang Z, Parhi KK. Low-Complexity Seizure Prediction From iEEG/sEEG Using Spectral Power and Ratios of Spectral Power. IEEE Transactions on Biomedical Circuits and Systems. 2016. DOI: 10.1109/tbcas.2015.2477264.
- [S2] Wang C et al. SEEGformer: personalised SEEG-based seizure detection and epileptogenic zone localisation for drug-resistant epilepsy. eBioMedicine. 2026. DOI: 10.1016/j.ebiom.2025.106085.
- [S3] Hu X et al. Effective Connectivity Predicts Surgical Outcomes in Temporal Lobe Epilepsy: A SEEG Study. CNS Neuroscience & Therapeutics. 2025. DOI: 10.1111/cns.70563.
- [S4] Koutsouvelis P et al. Preictal period optimization for deep learning-based epileptic seizure prediction. Journal of Neural Engineering. 2024. DOI: 10.1088/1741-2552/ad9ad0.
- [S5] Iasemidis LD et al. Long-term prospective on-line real-time seizure prediction. Clinical Neurophysiology. 2005. DOI: 10.1016/j.clinph.2004.10.013.
- [S6] Iasemidis LD. Seizure Prediction and its Applications. Neurosurgery Clinics of North America. 2011. DOI: 10.1016/j.nec.2011.07.004.
- [S7] Ren Z, Han X, Wang B. The performance evaluation of the state-of-the-art EEG-based seizure prediction models. Frontiers in Neurology. 2022. DOI: 10.3389/fneur.2022.1016224.
- [S8] Wang X et al. One-Dimensional Convolutional Neural Networks Combined with Channel Selection Strategy for Seizure Prediction Using Long-Term Intracranial EEG. International Journal of Neural Systems. 2021. DOI: 10.1142/s0129065721500489.
- [S9] Wang X et al. Channel Increment Strategy-Based 1D Convolutional Neural Networks for Seizure Prediction Using Intracranial EEG. IEEE Transactions on Neural Systems and Rehabilitation Engineering. 2023. DOI: 10.1109/tnsre.2022.3222095.
- [S10] Zhang D et al. Brant: Foundation Model for Intracranial Neural Signal. NeurIPS. 2023.
- [S11] Liu J et al. Seizure Prediction using Principal Component Analysis and Support Vector Machine on Stereotactic Electroencephalogram. Proceedings of SPIE. 2026.
- [S13] Gomez C et al. Automatic seizure detection based on imaged-EEG signals through fully convolutional networks. Scientific Reports. 2020. DOI: 10.1038/s41598-020-78784-3.
- [S14] Fussner S et al. Differentiating Epileptic and Psychogenic Non-Epileptic Seizures Using Machine Learning Analysis of EEG Plot Images. Sensors. 2024. DOI: 10.3390/s24092823.
- [S15] Boubchir L et al. Haralick feature extraction from time-frequency images for epileptic seizure detection and classification of EEG data. International Conference on Microelectronics. 2014. DOI: 10.1109/ICM.2014.7071799.
- [S16] Sengur A et al. Time-frequency texture descriptors of EEG signals for efficient detection of epileptic seizure. Brain Informatics. 2016. DOI: 10.1007/s40708-015-0029-8.
