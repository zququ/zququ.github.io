---
layout: post
title: 傅里叶与图像的关系
date: 2022-07-09 09:20:10:24.000000000 +09:00
tags: cryo-EM
---

<!-- TOC GFM -->

* [离散二维傅里叶变换](#离散二维傅里叶变换)
	- [元素图像（elementary images）的数学表征](#元素图像elementary-images的数学表征)
	- [傅里叶如何表征图像特征](#傅里叶如何表征图像特征)
	- [傅里叶表征图像的常用表达式](#傅里叶表征图像的常用表达式)
* [傅里叶变换的特征](#傅里叶变换的特征)
	- [线性（Linearity）特征](#线性linearity特征)
	- [参数缩放特征](#参数缩放特征)
	- [对称性质](#对称性质)
	- [振幅和相位](#振幅和相位)
	- [移位理论](#移位理论)

<!-- /TOC -->

参考自 Jachim Frank 著作的 《Three-Dimensional Electron Microscopy of Macromolecular Assemblies》

## 离散二维傅里叶变换

### 元素图像（elementary images）的数学表征

假设一个矩形的图像，我们把他的长和宽分别分别分割为 $K$ 与 $I$ 份，分割后的每一小部分分别用 $\Delta y$ 与 $\Delta x$ 表示，这样就可以通过这四个符号表示该矩形图像的长和宽，如下图所表示

![p1](/assets/20220707/2022-07-09-09-55-58.png) 

则电镜所得分子在二维方向上的投影表示为，

$$
p_{ik} = p(x_{i}, y_{k}); i = 1,...,I; k = 1,...,K\tag{1}
$$

### 傅里叶如何表征图像特征

傅里叶变换利用正弦曲线或者复指数形式作为基函数（基函数）去表征图像信息。作为可以表征图像中包含信息的另一种方法，从正交归一化基函数集合的许多其他扩展中选择傅里叶变换的原因如下：

1. 容易地分析仪器相差的影响以及对象中周期性的存在。
2. 提供了理解投影和它们所源自的对象之间的关系。
3. 理解三维重建原理的关键。

使用傅里叶去表征图像以一系列基图像（elementary images）集合作为基函数。

以正弦变换为例，这时这些基图像为正弦密度分布：

$$
e_{lm|_{ik}} = e_{lm}(x_{i}, y_{k})=\sin[2\pi(u_{l}x_{i} + v_{m}y_{k})] \tag{2}
$$

我们给出两个新的参数来描述周期性质，如下

$$
\begin{cases}
u_{l} = \frac{l}{I\Delta x}, & l=0, ... , I-1 \\ 
\\ 
v_{m} = \frac{m}{k\Delta y}, & m=0, ... , K-1
\end{cases}\tag{3}
$$

每个图像由正方形晶格位置（ $x_{i}$, $y_{k}$ ）处的离散像素集表示，其特征在于离散傅里叶空间频率分量（ $u_{l}$, $v_{m}$ ）描述在水平（ $l$ ）和垂直方向（ $m$ ）适合框架中的全波数量。见下图

![p2](/assets/20220707/2022-07-09-14-32-01.png) 

其中可见 $l$ 和 $m$ 可以控制基图像的方向。

使用适当的振幅 $a_{lm}$ 与波相位 $\varphi_{lm}$，**任何离散图像 $\{p_{ik}; i=1,...,I; k=1,...,K\}$ 可以用基图像的叠加来表示**，

$$
p_{ik} = p(x_{i}, y_{k})= \sum_{l=0}^{I-1}\sum_{m=0}^{K-1}a_{lm}\sin{\left[2\pi\left(\frac{li}{I} + \frac{mk}{K}\right) + \phi_{lm}\right]}\tag{4}
$$

其中，

$$
\begin{cases}
u_{l} = l/(I\Delta x) \\ 
v_{m} = l/(K\Delta y) \\ 
x = i\Delta x \\ 
y = k\Delta y \\ 
\end{cases}
$$

### 傅里叶表征图像的常用表达式

实际中，傅里叶表示的方法与 $eqn(3)$ 往往不同，常利用“圆形”复指数波：

$$
\exp\left[-2\pi i\left(\frac{li}{I} + \frac{mk}{K}\right)\right]=\cos\left[2\pi\left(\frac{li}{I} + \frac{mk}{K}\right)\right] + i\sin\left[2\pi\left(\frac{li}{I} + \frac{mk}{K}\right)\right]\tag{5}
$$

以便更容易处理数学公式。

傅里叶公式去表征一个图象的方法如下，

$$
p_{ik} = \sum_{l=0}^{I-1}\sum_{m=0}^{K-1}F_{lm}\exp{\left[-2\pi i\left(\frac{li}{I}+\frac{mk}{K}\right)\right]}\tag{6}
$$

用符号表示为，

$$
p(x, y) = \mathfrak{F}\{F(u, v)\} , \phantom{kkk} \text{(“Fourier synthesis”)} \tag{7}
$$

相反地，给定图像，也可以通过类似的互逆表达式获得傅里叶系数 $F_{lm}$：

$$
F_{lm} = \sum_{l=0}^{I-1}\sum_{m=0}^{K-1}p_{ik}\exp{\left[2\pi i\left(\frac{li}{I} + \frac{mk}{K}\right)\right]}\tag{8}
$$

符号表达式为，

$$
F(u,v)=\mathfrak{F}^{-1}\{p(x,y)\}, \phantom{kkk} \text{(“inverse Fourier transformation”)} \tag{9}
$$

## 傅里叶变换的特征

### 线性（Linearity）特征

如果一幅图像为两张图像的线性结合，

$$
f(\mathbf{r}) = c_{1}f_{1}(\mathbf{r}) + c_{2}f_{2}(\mathbf{r})
$$

则其傅里叶变换为，

$$
\begin{cases}
F(\mathbf{k}) = c_{1}F_{1}(\mathbf{k}) + c_{2}F_{2}(\mathbf{k}) \\ 
 \\ 
F(\mathbf{k}) = \mathfrak{F}\{f(\mathbf{r})\}
\end{cases}\tag{10}
$$

### 参数缩放特征

同一物体在不同放大倍数下的不同图像，

$$
f_{2}(\mathbf{r}) = f_{1}(s\mathbf{r})
$$

其中 $s$ 为比例因子，其傅里叶变换为，

$$
\begin{cases}
F_{2}(\mathbf{k}) = F_{1}(1/s \mathbf{k}) \\ 
 \\ 
F(k) = \mathfrak{F}\{f(\mathbf{r})\}
\end{cases}\tag{11}
$$

### 对称性质

通过 $eqn(8)$ 可以看到，对于实值函数正常复值傅里叶变换具有以下性质：

$$
F_{-l-m} = [F_{lm}]^{*}\tag{12}
$$

在 X 射线晶体学中，该式被成为弗里德尔对称（Friedel sysmmetry），

其中星号代表取复共轭，即：

$$
[F_{lm}]^{*} = \{{\mathfrak{R}\mathrm{e}\{F_{lm}\}}, -\mathfrak{I}\mathrm{m}\{F_{lm}\}\}\tag{13}
$$

可将复数 $F$ 表示为复平面中的向量。其中 $A$ 为振幅或者模（modulus），表示向量的长，而 $\phi$ 为相位，表示为角（逆时针 counterclockwise 为正）表示向量相对于实轴的旋转。

![p3](/assets/20220707/2022-07-10-10-30-38.png) 

由傅里叶的对称性质，对于实值图像，傅里叶变换的一半确定另一半的值，所以在所有计算和存储中通常只需要一半。

### 振幅和相位

复系数 $F_{lm}$ 可以通过复平面中的一个向量来表示，如上图所示。

其长度（傅里叶变换的振幅）为，

$$
|F_{lm}| = [|\mathfrak{R}\mathrm{e}\{F_{lm}\}|^2 + |\mathfrak{I}\mathrm{m}{F_{lm}}|^{2}]^{1/2}\tag{14}
$$

其相位为，

$$
\varphi_{lm} = \arctan[\mathfrak{I}\mathrm{m}\{F_{lm}\}/\mathfrak{R}\mathrm{e}\{F_{lm}\}]\tag{15}
$$

### 移位理论

当图像按照向量 $\Delta\mathbf{r}= (\Delta x, \Delta y)$ 平移，得到图像 $p(x+\Delta x, y+\Delta y)$ ，其傅里叶变换根据 $eqn(8)$ 与指数因子相乘，有

$$
\mathfrak{F}^{-1}{p(x+\Delta x, y + \Delta y)} =F(u, v)\exp[2\pi i(u\Delta x+ v\Delta y)]\tag{16}
$$
















