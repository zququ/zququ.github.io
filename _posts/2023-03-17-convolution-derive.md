---
layout: post
title: 卷积公式推导
date: 2023-3-17 14:00:24.000000000 +09:00
tags: math
---

卷积公式推导等价于推导两个相互独立随机变量函数的分布问题。以推导两函数和的分布关系如下:

设 $\mathrm{X}$ 与 $\mathrm{Y}$ 函数符合联合分布，即 $(\mathrm{X}, \mathrm{Y})$ ~ $f(x, y)$，则 $\mathrm{Z} = \mathrm{X} + \mathrm{Y}$ 的概率密度为：

$$
f_{\mathrm{Z}}(z) = \int_{-\infty}^{+\infty}f(x, z-x)\mathrm{d}x
$$

由于联合分布概率密度可以写成边缘概率密度的乘积，给出 $\mathrm{F}_{\mathrm{z}}(z)$ 的定义，

$$
\begin{aligned}
\mathrm{F}_{\mathrm{Z}}(z) & \triangleq \mathrm{P}\lbrace\mathrm{Z} \leq z\rbrace = \mathrm{P}\lbrace \mathrm{X} + \mathrm{Y}\leq \mathrm{Z}\rbrace \\ 
& = \int\int f(x, y) \mathrm{d}x\mathrm{d}y \\ 
& = \int_{-\infty}^{+\infty}\mathrm{d}x\int_{-\infty}^{z-x}f(x, y)\mathrm{d}y \\ 
\end{aligned}
$$

由关系

$$
\begin{aligned}
f_{\mathrm{Z}}(z) & = F_{\mathrm{Z}}^{'} \\ 
& = \left(\int_{-{\infty}}^{+\infty}\left[\int_{-\infty}^{z-x}f(x,y)\mathrm{d}y\right]\mathrm{d}x\right) ^ {'}_{z} \\ 
& = \int_{-\infty}^{+\infty}\left(\int_{-\infty}^{z-x}f(x,y)\mathrm{d}y\right)_{z}^{'}\mathrm{d}x \\ 
& = \int f(x, z-x)\mathrm{d}x
\end{aligned}
$$

因为 $\mathrm{X}$ 与 $\mathrm{Y}$ 相互独立，所以有

$$
f_{\mathrm{Z}}(z) = \int f_{\mathrm{X}}(x)\cdot f_{\mathrm{Y}}(z-x)\mathrm{d}x
$$







