---
layout: post
title: Parseval 定理的数学推导
date: 2023-03-31 16:53:24
comments: true
tags: cryoEM
---

Parseval 描述信号在时域以及频域上有着相同的能量这一关系，数学表达为：

$$
\mathfrak{F}{\lbrace x(t) \rbrace} = X(f)
$$

$$
\int\_{-\infty}^{\infty} \lvert x(t)\rvert ^2 \mathrm{d}t = \int\_{-\infty}^{\infty} \lvert X(f)\rvert ^2 \mathrm{d}f
$$

定义一组可以在时域与频域相互转换的信号关系式，为了证明这一点，分别表示在时域和频域上的能量：

$$
X(f) = \int\_{-\infty}^{\infty} x(t) e^{-j2\pi ft}\mathrm{d}t
$$

$$
x(t) = \int\_{-\infty}^{\infty} X(f) e^{-j2\pi ft}\mathrm{d}f
$$

带入能量方程：

$$
\begin{aligned}
E\_{x} &= \int\_{-\infty}^{\infty} \lvert x(t) \rvert^2 = \int\_{-\infty}^{\infty} \lvert \int\_{-\infty}^{\infty} X(t)e^{-j2\pi ft}\mathrm{d}f\rvert^2
\mathrm{d}t \\ 
&= \int\_{-\infty}^{\infty}\int\_{-\infty}^{\infty}\int\_{-\infty}^{\infty}\left(X(f)X^*(f')\cdot e^{j2\pi(f-f')t}\mathrm{d}t\right)\mathrm{d}f\mathrm{d}f'
\end{aligned}
$$

观察其中的指数项，

$$
\int\_{-\infty}^{\infty}e^{j2\pi(f-f')t} = \int\_{-\infty}^{\infty}\cos{\left(2\pi(f-f')t + j\sin{\left(2\pi(f-f')t\right)}\right) }
$$

由于正弦与余弦函数在完整周期中积分为0，可以得知满足狄拉克函数条件：

$$
\delta(t) = 
\begin{cases}
\infty && f -f'=0 \\ 
 \\ 
0 && otherwise
\end{cases}
$$

这样原式化为：

$$
E\_{x} = \int\_{-\infty}^{\infty}\int\_{-\infty}^{\infty} X(f)X^*(f')\delta(f-f')\mathrm{d}f\mathrm{d}f'
$$

又因为对于含有狄拉克函数的方式有以下关系：

$$
\int\_{-\infty}^{\infty}g(f')\delta(f-f')\mathrm{d}f' = g(f)
$$

可以得出

$$
E\_{x} = \int\_{-\infty}^{\infty}X(f)X^*(f)\mathrm{d}f = E\_{X}
$$

