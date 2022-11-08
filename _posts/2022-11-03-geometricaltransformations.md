---
layout: post
title: 图像几何变换
date: 2022-11-02 12:11:00:24.000000000 +09:00
tags: cryo-EM
---

<!-- TOC GFM -->

* [齐次坐标表示](#齐次坐标表示)
* [变换细节](#变换细节)
    - [1. 平移](#1-平移)
    - [2. 放大](#2-放大)
    - [3. 切变（Shearing）](#3-切变shearing)
    - [4. 镜面](#4-镜面)
    - [5. 旋转](#5-旋转)
        + [旋转矩阵推导（附）](#旋转矩阵推导附)
    - [6. 欧拉角](#6-欧拉角)

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
s_x & 0 & 0\\ 
0   & s_y & 0\\  
0 & 0 & s_z\\ 
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
\tilde{\mathbf{r}}\_{A}  = (s_xr_x, s_yr_y, s_zr_z, 1)^{T} \tag{8}
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

### 3. 切变（Shearing）

剪切过程可以理解为用不同强度和不同方向压缩每个轴的结果，导致体积的变形。

假设通过压缩 X 轴在 Y 方向上的体积的方式来进行变形，相应的变换矩阵为，

$$
R_{sh_{1}} = \left(
\begin{matrix}
1 & h_{xy} & 0 \\ 
0 & 1 & 0 \\ 
0 & 0 & 1 \\ 
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

### 4. 镜面

根据一个面进行镜面处理，通过简单的翻转一个坐标。如根据 $\mathrm{YZ}$ 平面进行翻转，

$$
R_{plane} = \left(
\begin{matrix}
-1 & 0 & 0 \\ 
 0 & 1 & 0 \\ 
 0 & 0 & 1 \\ 
\end{matrix}
\right) \tag{17}
$$

此时特征值为 -1（重数为 1，特征空间为 1 维） 和 1（重数为 2， 特征空间为 2 维）。

也可以根据一条线进行镜面处理。如根据 $\mathrm{Z}$ 轴进行镜面操作，

$$
R_{line} = \left(
\begin{matrix}
-1 &  0 & 0 \\ 
 0 & -1 & 0 \\ 
 0 &  0 & 1 \\ 
\end{matrix}
\right) \tag{18}
$$

根据点镜面操作则为，


$$
R_{line} = \left(
\begin{matrix}
-1 &  0 &  0 \\ 
 0 & -1 &  0 \\ 
 0 &  0 & -1 \\ 
\end{matrix}
\right) \tag{19}
$$

与之前变换相似，可以通过使用合适的正交矩阵遵从任意平面或线操作，

$$
R = OR_{i}O^{T} \tag{20}
$$

### 5. 旋转

旋转矩阵能够帮助将重构出的体积与实验投影相关联，是非常重要的。如果矩阵属于 $SO(3)$（三次特殊正交群——例如，具有实系数且行列式为 1 的 $3\times3$ 正交矩阵集合）。

3DEM 中，围绕其中轴旋转执行左手旋转规则（正旋转为顺时针旋转）：

$$
R_{X}(\alpha) = \left(
\begin{matrix}
1 & 0            & 0            \\ 
0 & \cos{\alpha} & \sin{\alpha} \\ 
0 & -\sin{\alpha}& \cos{\alpha} \\ 
\end{matrix}
\right) \tag{21}
$$

$$
R_{Y}(\alpha) = \left(
\begin{matrix}
\cos{\alpha} & 0 & -\sin{\alpha} \\ 
0 & 1 & 0 \\ 
\sin{\alpha} & 0 & \cos{\alpha} \\ 
\end{matrix}
\right) \tag{22}
$$

$$
R_{Z}{(\alpha)} = \left(
\begin{matrix}
\cos{\alpha} & \sin{\alpha} & 0 \\ 
-\sin{\alpha} & \cos{\alpha} & 0 \\ 
0 & 0 & 1 \\ 
\end{matrix} \tag{23}
\right)
$$

旋转矩阵的特征值为 $e^{ia}$ ， $e^{-ia}$ 和 1 。重数均为 1 且相关特征空间维度为 1 。

同样可以利用合适正交矩阵求解围绕任意轴的旋转矩阵，

$$
R = OR_{i}O^{T} \tag{24}
$$

然而实际上，对于任意旋转的更紧凑的方法————欧拉角（Euler angles）或四元数（quaternions）和视图向量（view vectors）。

#### 旋转矩阵推导（附）

对于一个直角坐标系，可以使用极坐标表示，例如，

![p1](/assets/202211/2022-11-07-12-59-01.png){: width='400'}

$$
\begin{cases}
x = \cos{\psi}\cdot r \\ 
 \\ 
y = \sin{\psi}\cdot r \\ 
\end{cases} \tag{S1}
$$

其中 $r$ 为极坐标旋转半径。

对于经过旋转处理后的坐标，

$$
\begin{cases}
x' = \cos{(\psi + \phi)}\cdot r \\ 
 \\ 
y' = \sin{(\psi + \phi)}\cdot r \\ 
\end{cases} \tag{S2}
$$

将 (S2) 中三角函数展开有，


$$
\begin{cases}
x' = (\cos{\psi}\cos{\phi} - \sin{\psi}\sin{\phi}) \cdot r \\ 
 \\ 
y' = (\sin{\psi}\cos{\phi} + \sin{\phi}\cos{\psi})\cdot r \\ 
\end{cases} \tag{S2}
$$

将 (S1) 带入 (S1) 可得，

$$
\begin{cases}
x' = \cos{\phi}\cdot x -\sin{\phi}\cdot y \\ 
 \\ 
y' = \sin{\phi}\cdot x + \cos{\phi}\cdot y \\ 
\end{cases} \tag{S3}
$$

### 6. 欧拉角

欧拉角是3DEM中表示旋转的最常用的表示方法。描述为，首先围绕给定坐标轴进行第一次旋转，这样就形成一组新的旋转坐标系，后围绕其中一个变换轴进行第二次旋转，最后围绕两次变换轴进行第三次旋转。在数学上，表示为

$$
R =R_3R_2R_1 \tag{S4}
$$

如图所示，

![p2](/assets/202211/2022-11-07-13-21-39.png){: width='400'}

这是一种非常紧凑的表示方式，因为只有 3 个数字（三个欧拉角），就可以表示完整的旋转矩阵（ $3\times3$ ）。3DEM 中最广泛使用的惯例为 $ZYZ$ ：第一次旋转围绕 $Z$ 轴（被称为旋转角，rotational angle，$\phi$ ），第二次旋转围绕 $Y$ 轴（成为方位角，azimuthal angle，$\theta$ ），第三次正旋转围绕 $Z$ 轴（ 称为平面内旋转，in-plane rotation，$\psi$ ）。

按照欧拉角定义，将(23)、(24)带入(S4)，

得到，

$$
\left(
\begin{matrix}
\cos{\phi} & \sin{\phi} & 0 \\ 
\cos{\phi} & \cos{\phi} & 0 \\ 
0 & 0 & 1
\end{matrix}
\right)
\cdot
\left(
\begin{matrix}
\cos{\theta} & 0 & -\sin{\theta} \\ 
0 & 1 & 0 \\ 
\sin{\theta} & 0 & \cos{\theta} \\ 
\end{matrix}
\right)
\cdot
\left(
\begin{matrix}
\cos{\psi} & \sin{\psi} & 0 \\ 
\cos{\psi} & \cos{\psi} & 0 \\ 
0 & 0 & 1 \\ 
\end{matrix}
\right)
$$

最终推导出相关的欧拉矩阵为，

$$
\begin{aligned}
R & = R_Z(\psi)R_Y(\theta)R_Z(\phi) \\ 
  & = \left[
\begin{matrix}
\cos{\psi}\cos{\theta}\cos{\phi}-\sin{\psi}\sin{\phi} & \cos{\psi}\cos{\theta}\sin{\phi}+\sin{\psi}\cos{\theta} & -\cos{\psi}\sin{\theta} \\ 
-\sin{\psi}\cos{\theta}\cos{\phi} - \cos{\psi}\sin{\theta} & -\sin{\psi}\cos{\theta}\sin{\theta} + \cos{\psi}\cos{\phi} & \sin{\psi}\sin{\theta} \\ 
\sin{\theta}\cos{\phi} & \sin{\theta}\sin{\phi} & \cos{\theta} 
\end{matrix}
\right]
\end{aligned}\tag{S5}
$$

在 Imagic 中，旋转矩阵为右手旋转定则（逆时针），所以使用角（ $-\phi, \theta, -\psi$ ）而
对于MRC，则需要使用角 ( $\phi,\theta,-\psi$ )。

给定旋转矩阵，可以通过以下计算来获得欧拉角，(S5) 中的每个元素用 r(row, col) 来表示，则明显可以得到，

$$
\begin{aligned}
\lvert\sin{\theta}\rvert &= \sqrt{r_{13}^2 + r_{23}^2} \\ 
& = \sqrt{\sin^2{\theta}(\cos^2{\theta + \sin^2{\theta}})}
\end{aligned} \tag{S6}
$$

这里考虑一些，欧拉角是否为 0 或 $\pi$ 的临界情况，

首先如果 $\lvert\sin{\theta}\rvert > 0$ ，

$$
\theta = atan2(r_{32}, r_{31}) = \arctan{\left(\frac{\sin{\theta}\sin{\phi}}{\sin{\theta}\cos{\phi}}\right)}
 \\ 
\psi = atan2(r_{23}, -r_{13}) = \arctan{\left(\frac{\sin{\psi}\sin{\theta}}{\cos{\psi}\sin{\theta}}\right)}\tag{S7}
$$

这里通过 $\psi$ 的值来推算 $\sin{\theta}$ 的符号 $s$ ，

$$
\begin{cases}
\sin{\psi} = 0 && s=\mathrm{sign}\left(\frac{-r_{13}}{\cos{\psi}}\right) = \mathrm{sign}(-\sin{\theta}) \\ 
 \\ 
\sin{\psi}\neq 0 && s=\mathrm{sign}\left(\frac{r_{23}}{\sin(\psi)}\right) = \mathrm{sign}(\sin{\theta})
\end{cases} \tag{S8}
$$

最终求出 $\theta$ 的值为，

$$
\theta = atan2(s\lvert\sin{\theta}\rvert, r_{33})\tag{S9}
$$

同理，当 $\theta = 0$ 时，

$$
\begin{cases}
\mathrm{sign}(r_{33}) = \cos{\theta}>0 && \theta=0, \psi=atan2(r_{21}, -r_{11}) \\ 
  \\ 
\mathrm{sign}(r_{33})<0 && \theta=\pi, \psi=atan2(r_{21}, -r_{11})
\end{cases} \tag{S10}
$$

不同软件对于欧拉角计算存在差异，如 EMAN 使用 $ZXZ$ ，但可以通过算法进行转换。在 EMAN 中使用 $\phi$，方位角（azimuth, az），以及高度（altitude, alt），

$$
R_{EMAN} = R_Z{\phi_{EMAN}}R_X(alt)R_Z(az) \tag{S11}
$$

两个系统中的转换关系如下：

$$
az = \phi + \frac{\pi}{2}
$$
$$
alt = \phi
$$
$$
\phi_{EMAN} = \psi - \frac{\pi}{2} \tag{S12}
$$

