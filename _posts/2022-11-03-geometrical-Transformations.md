---
layout: post
title: 图像几何变换
date: 2022-11-03 13:30:00:24.000000000 +09:00
tags: cryo-em
---

<!-- TOC GFM -->

* [齐次坐标表示](#齐次坐标表示)
* [变换细节](#变换细节)
    - [1. 平移](#1-平移)
    - [2. 放大](#2-放大)
    - [3. 剪切（Shears）](#3-剪切shears)
    - [4. 旋转](#4-旋转)

<!-- /TOC -->

## 齐次坐标表示

对于一个非齐次表达式（nonhomogeneous expression）表征点

$$
\mathbf{r} = (x, y, z)
$$

齐次表达式有，

$$
\tilde{\mathbf{r}} = (x, y, z, 1) \tag{1}
$$

其中有

$$
\tilde{\mathbf{r}} \in \mathbb{R}^{3} \times \{1\}
$$

几何变换过程可以用齐次表达式坐标之间的矩阵操作表示，

$$
\tilde{\mathbf{r}}_{\tilde{A}} = \tilde{A}\tilde{\mathbf{r}} \tag{2}
$$

其中， $\tilde{\mathbf{r}}_{\tilde{A}} \in \mathbb{R}^{3}\times \{1\}$ 为在齐次表达式坐标点 $\tilde{\mathbf{r}} \in \mathbb{R}^{3}\times \{1\}$ 的变换，

$$
\tilde{A} = \left(
\begin{matrix}
r_{11} & r_{12} & r_{13} & t_{x} \\ 
r_{21} & r_{22} & r_{23} & t_{y} \\ 
r_{31} & r_{32} & r_{33} & t_{z} \\ 
0 & 0 & 0 & 1 
\end{matrix}
\right)
= \left(
\begin{matrix}
R & \mathbf{t} \\ 
\mathbf{0}^{T} & 1
\end{matrix}
\right) \tag{3}
$$

由 (1 ~ 3)， 可以得到

$$
\mathbf{r}_{\tilde{A}} = R\mathbf{r} + \mathbf{t} \tag{4}
$$

（4）中$\tilde{A}$ 被称为仿射变换 (affine transformation) 。该操作描述为针对点 $\mathbf{r}$ 的线性变换（$R\mathbf{r}$）加上一个平移操作（$\mathbf{t}$），经过这一操作后的 $（\mathbf{r}_{\tilde{A}}）$ 与操作前的点 $\mathbf{r}$ 相比，具有以下三个特征：

1. 保留线性特征，如操作前在共线，操作后同样共线；
2. 保留比例特征，如中点在操作后同样为中点；
3. 保留平行特征；

## 变换细节

### 1. 平移

当 (3) 中 $R$ 为单位矩阵时，

$$
\tilde{A} = \left(
\begin{matrix}
1 & 0 & 0 & t_{x} \\ 
0 & 1 & 0 & t_{y} \\ 
0 & 0 & 1 & t_{z} \\ 
0 & 0 & 0 & 1     \\ 
\end{matrix}
\right) \tag{5}
$$

(4) 表示为，

$$
\begin{aligned}
\tilde{\mathbf{r}\_{A}} &= (r_x + t_x, r_y + t_y, r_z + t_z, 1)^{T} \\ 
\Rightarrow  \mathbf{r}\_{A} &= \mathbf{r} + \mathbf{t}
\end{aligned}\tag{6}
$$

需要注意的是， (6) 中 $\mathbf{r}_A$ 和 $\mathbf{r}$ 都是点，而 $\mathbf{t}$ 是一个向量。

矩阵 $R$ 只有一个重数（multiplicity）为 3 的特征值 （1）。次特征值相关的特征空间维数为 3 。

### 2. 放大

$$
R =
\left(
\begin{matrix}
s_x & 0 & 0 \\
0   & s_y & 0 \\
0 & 0 & s_z
\end{matrix}
\right) \tag{7}
$$

$$
\begin{cases}
s_{x} = s_{y} = s_{z} && \text{isotropic} \\ 
 \\ 
\text{otherwise} && \text{anisotropic}
\end{cases}
$$

变换后有， 

$$
\tilde{\mathbf{r}}_{A}  = (s_xr_x, s_yr_y, s_zr_z, 1)^{T} \tag{8}
$$

$$
\begin{cases}
s_{i} \gt 1 && \text{expanded} \\ 
 \\ 
s_{i} \lt 1 && \text{contracted}
\end{cases}
$$

这种操作沿着基坐标 (X, Y, Z) 执行，可以通过正交矩阵（orthogonal matrix, O）将其沿着其他正交方向压缩。

$$
R = O\left(
\begin{matrix}
s_x & 0 & 0 \\ 
0 & s_y & 0 \\ 
0 & 0 & s_z 
\end{matrix}
\right)
O^{T} \tag{9}
$$

注：当$OO^{T} = O^{T}O = I$ 时，方阵被称作正交。实际上，正交矩阵也是旋转矩阵的一种。

矩阵 $R$ 的特征值为 $s_x$ 、$s_y$ 和 $s_z$，重数均为 1。没种特征值对应特征空间维度为 1 。

### 3. 剪切（Shears）

剪切过程可以理解为用不同强度和不同方向压缩每个轴的结果，导致体积的变形。

假设通过压缩 X 轴在 Y 方向上的体积的方式来进行变形，相应的变换矩阵为，

$$
R_{sh_{1}} = \left(
\begin{matrix}
1 & h_{xy} & 0 \\ 
0 & 1 & 0 \\ 
0 & 0 & 1 
\end{matrix}
\right) \tag{10}
$$

获得的新坐标为，

$$
\tilde{\mathbf{r}}\_A = (r_x + h_{xy} r\_y, r\_y, r\_z, 1)^{T} \tag{11}
$$

$R_{sh_1}$ 特征值为 1, 重数为 3, 但特征空间仅跨越了维数为 2 的

$$
\left(
\begin{matrix}
1 & 0 \\ 
0 & 0 \\ 
0 & 1 \\ 
\end{matrix}
\right) \tag{12}
$$

我们也可以通过下面矩阵来对矩阵 $X$ 在 $Z$ 方向上进行变形，

$$
R_{sh_{2}} = \left(
\begin{matrix}
1 & h_{xy} & h_{xz} \\ 
0 & 1 & 0 \\ 
0 & 0 & 1 
\end{matrix}
\right) \tag{13}
$$

这种情况下，特征值与重数不发生改变，但特征空间现在的维度只有 1，


$$
\left(
\begin{matrix}
1 \\ 
0 \\ 
0 \\ 
\end{matrix}
\right) \tag{14}
$$

最终，我们可以沿着 $Z$ 方向再次对 $Y$ 进行变形，变形矩阵为

$$
R_{sh_{3}} = \left(
\begin{matrix}
1 & h_{xy} & h_{xz} \\ 
0 & 1 & h_{yz} \\ 
0 & 0 & 1 
\end{matrix}
\right) \tag{15}
$$

能够证明，任何剪切矩阵可以用 $R_{sh}$ 矩阵的函数以及合适的正交矩阵来进行表示。

$$
R = OR_{sh_i}O^{T} \tag{16}
$$

### 4. 旋转
<++>

