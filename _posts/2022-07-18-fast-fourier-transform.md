---
layout: post
title: 快速傅里叶变换（FFT）算法
date: 2022-07-18 15:53:24.000000000 +09:00
tags: cryo-EM
---



## 多项式表示方法

对于一个多项式,

$$
P(x) = p_{0} + p_{1}x + p_{2}x^{2} + ... + p_{d}x^{d}
$$

通常可以有两种方法去表示：

1. 系数表示法

$$
[p_{0}, p_{1}, ... ,p_{d}]
$$

2. 数值表示法

$$
\lbrace(x_{0}, P(x_{0})), (x_{1}, P(x_{1})), ... , (x_{d}, P(x_{d}))\rbrace
$$

通过数值表示法可以通过如下关系快速确定多项式乘法后的函数关系式：

![p1](/assets/20220718/2022-07-18-16-28-02.png) 

如上图中，

$$
\begin{cases}
A(x) = x^2 + 2x + 1, && [(-2, 1), (-1, 0), (0, 1), (1, 4), (2, 9)] \\ 
 \\ 
B(x) = x^2 - 2x + 1, && [(-2, 9), (-1, 4), (0, 1), (1, 0), (2, 1)]
\end{cases}
$$

通过 $A(x)$ 与 $B(x)$ 的四个数值表示法来确定 $C(x) =  A(x) \cdot B(x)$，

$$
C(x) =  x^4 - 2x^2 + 1, \phantom{kkk}[(-2, 9), (-1, 0), (0, 1), (1, 0), (2, 9)]
$$

从而实现快速多项式乘法。

为了实现这种快速算法，先用系数表示法对多项式乘法进行表示，

$$
\begin{cases}
A(x) = 2 + 3x + x^2, &&& \rightarrow A=[2, 3, 1] \\ 
 \\ 
B(x) = 1 + 0x + 2x^2, &&& \rightarrow B=[1, 0, 2] \\ 
\end{cases}
$$

则可以得出，

$$
\begin{aligned}
C(x) & = A(x) \cdot B(x) & \\ 
&= 2 + 3x + 5x^2 + 6x^3 + 2x^4 \\ 
\rightarrow C &=[2, 3, 5, 6, 2]
\end{aligned}
$$

采用这种方法，可以实现简明的表示多项式乘法，但其实现速度并没有改变，

$$
O(d^2)
$$

继续将这种想法继续代入，这样我们就得到了多项式表示法的一般形式：

$$
C[k] = \text{coeff of} \phantom{k}k^{th} \text{ term of polynomial} \phantom{k} C(x)
$$

下一步，需要先承认一个定理，即 $(d+1)$ 个点可以确定一个 $d$ 阶多项式。

例如 

$$
\lbrace(-3, 1), (-1, -1), (1, 3)\rbrace
$$ 

可以确定 

$$
P(x)=\frac{3}{4}x^2 + 2x + \frac{1}{4}
$$

![p2](/assets/20220718/2022-07-19-09-31-06.png) 

$$
\lbrace(-1, 0), (0, 1), (1, 0), (2, 1)\rbrace
$$

可以确定

$$
P(x)=\frac{2}{3}x^3 - x^2 - \frac{2}{3}x + 1
$$

![p3](/assets/20220718/2022-07-19-09-31-39.png)

用数学关系来表示这一特性，

$$
P(x) = p_{0} + p_{1}x + p_{2}x^2 + ... + p_{d}x^d \\ 
P(x_{0}) = p_{0} + p_{1}x_{0} + p_{2}x_{0}^2 + ... + p_{d}x_{0}^d \\ 
\vdots \\ 
P(x_{d}) = p_{0} + p_{1}x_{d} + p_{2}x_{d}^2 + \dots + p_{d}x_{d}^d 
$$

将该数值表示法代入的关系式用矩阵形式表示有，

$$
\left[
\begin{matrix}
P(x_{0}) \\ 
P(x_{1}) \\ 
\vdots \\ 
P(x_{d})
\end{matrix}
\right]=
\left[
\begin{matrix}
1 & x_{0} & x_{0}^2 & \dots & x_{0}^d \\ 
1 & x_{1} & x_{1}^2 & \dots & x_{1}^d \\ 
\vdots & \vdots & \vdots & \ddots & \vdots \\ 
1 & x_{d} & x_{d}^2 & \dots & x_{d}^d \\ 
\end{matrix}
\right]
\left[
\begin{matrix}
p_{0} \\ 
p_{1} \\ 
\vdots \\ 
p_{d}
\end{matrix} 
\right]
$$

想要证明 $(d+1)$ 个点能够确定一个 $d$ 阶多项式，即证明矩阵中中间的矩阵






