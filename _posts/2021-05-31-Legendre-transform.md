---
layout: post
title: Legendre Transform 勒让德变换
date: 2021-6-1 13:25:00:24.000000000 +09:00
tags: 数学
---

对于给定一个关于 $x, y$ 的函数式：

$$
f(x, y)
$$

求它的全微分，

$$
df(x, y) = \sum_{i=0}^{n}\frac{\partial f_i}{\partial x_i}dx_i + \sum_{i=0}^{n}\frac{\partial f_i}{\partial y_i}dy_i\tag{1}
$$

我们假设，存在 $g(x, y)$，其自变量 $u$ 存在有，

$$
u_i = \frac{\partial f_i}{\partial x_i}
$$

代入 $(1)$ 则有，

$$
df(x,y) = \sum_{i=0}^{n}u_idx_i + \sum_{i=0}^{n}\frac{\partial f_i}{\partial y_i}dy_i\tag{2}
$$

又由，

$$
d(u_ix_i) = x_idu_i + u_idx_i \tag{3}
$$

$(2)$ 可化为，

$$
df(x,y) = \sum{d(u_ix_i)} - \sum{x_idu_i} + \sum\frac{\partial f_i}{\partial y_i}dy_i
$$
即
$$
d(\sum{du_ix_i} - f) = \sum{x_idu_i} - \sum{\frac{\partial f_i}{\partial y_i}dy_i}\tag{4}
$$

我们假设，

$$
g(u,y) = \sum{du_ix_i - f} \tag{5}
$$

所以 $(4)$ 与 $g(u,y)$ 的全微分可以建立关系式：

$$\begin{cases}
dg(u,y) = \sum{x_idu_i} - \sum{\frac{\partial f_i}{\partial y_i}dy_i}\\
dg(u,y) = \sum{\frac{\partial g_i}{\partial u_i}}du_i-\sum{\frac{\partial g_i}{\partial y_i}}dy_i
\end{cases}\tag{6}
$$

从 $(6)$ 中得到以下结论：

1. 新函数对新自变量的偏微分等于原函数的自变量

$$
\frac{\partial g_i}{\partial u_i} = x_i
$$

2. 原函数对原自变量的偏微分等于新函数自变量

$$
\frac{\partial f_i}{\partial x_i} = ui
$$

3. 原函数对不变量的偏微分等于新函数对不变量的偏微分

$$
\frac{\partial f_i}{\partial y_i} = \frac{\partial g_i}{\partial y_i}
$$

























