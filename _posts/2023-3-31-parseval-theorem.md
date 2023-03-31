---
layout: post
title: Parseval 定理的数学推导
date: 2023-03-31 16:53:24.000000000 +09:00
tags: cryoEM
---

Parseval 描述信号在时域以及频域上有着相同的能量这一关系，数学表达为：

$$
\mathfrak{F}{\lbrace x(t) \rbrace} = X(f)
$$

$$
\int_{-\infty}^{\infty} \lvert x(t)\rvert ^2 \mathrm{d}t = \int_{-\infty}^{\infty} \lvert X(f)\rvert ^2 \mathrm{d}f
$$

定义一组可以在时域与频域相互转换的信号关系式：

$$
X(f) = \int_{-\infty}^{\infty} x(t) e^{-j2\pi ft}\mathrm{d}t
$$

$$
x(t) = \int_{-\infty}^{\infty} X(f) e^{-j2\pi ft}\mathrm{d}f
$$



为了证明这一点，分别表示在时域和频域上的能量：

$$
E_{x} = \int_{-\infty}^{\infty} \lvert x(t) \rvert = \int_{-\infty}^{\infty} \lvert \int_{-\infty}^{\infty} X(t) \rvert
$$

<++>
