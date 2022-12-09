---
layout: post
title: VPP 下欠焦值对于 CTF 的影响分析
date: 2022-12-06 14:37:00:24.000000000 +09:00
tags: cryo-EM
---

将添加 VPP 后的 CTF 函数表达为：

$$
\cos(\pi\Delta z \lambda k^2 + \frac{\pi}{2}\mathrm{Cs}\lambda^3k^4)
$$

其中令 $\lambda$, $\mathrm{Cs}$ 值为 1，原式简化为，

$$
\cos(\pi\Delta zk^2 + \frac{\pi}{2}k^4)
$$

$\Delta z = 0$

![p1](/assets/20221206/2022-12-06-14-44-53.png)

$\Delta z = 1$

![p2](/assets/20221206/2022-12-06-14-46-00.png)

$\Delta z = 5$

![p3](/assets/20221206/2022-12-06-14-46-33.png)

可以看出，随着欠交值 $\Delta z$ 的增大，在低频范围内，曲线趋于水平，这也就是为什么在使用 VPP 的情况下，一些文章将 $\Delta z$ 近似估计为 0 。

虽然我个人觉得这种估计不是很严谨。
