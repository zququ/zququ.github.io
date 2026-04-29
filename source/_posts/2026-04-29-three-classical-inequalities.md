---
title: 三角不等式、算术-几何不等式与柯西-施瓦茨不等式
date: 2026-04-29 20:00:00
tags:
  - 数学
  - 不等式
  - 线性代数
comments: true
---

重新开始写博客，第一篇先从三个最基础、也最耐用的不等式开始：三角不等式、算术-几何不等式，以及柯西-施瓦茨不等式。

它们看起来分别属于不同语境：一个讲距离，一个讲平均数，一个讲内积。但本质上它们都在表达同一类思想：结构会限制极端情况。距离不能因为绕路变短，乘积不能在总和固定时随便变大，两个向量的内积不能超过它们长度相乘。

## 1. 三角不等式

### 1.1 概念

三角不等式最朴素的说法是：

> 两点之间直线最短。

如果从点 $A$ 到点 $C$，直接走不会比先绕到 $B$ 再走到 $C$ 更长。因此在几何中有

$$
|AC| \le |AB| + |BC|.
$$

在代数里，对任意实数或复数 $x,y$，三角不等式写作

$$
|x+y| \le |x| + |y|.
$$

它说的是：两个量相加之后的大小，不会超过它们各自大小之和。

在向量空间中，三角不等式写作

$$
\lVert u+v\rVert \le \lVert u\rVert + \lVert v\rVert.
$$

这里 $\lVert u\rVert$ 表示向量 $u$ 的长度。直观地说，先走向量 $u$，再走向量 $v$，总效果是 $u+v$。直接从起点走到终点的距离不会超过两段路程之和。

### 1.2 实数情形的证明

先证明最基本的实数形式：

$$
|x+y| \le |x| + |y|.
$$

两边都是非负数，所以可以平方比较。注意

$$
|x+y|^2 = (x+y)^2 = x^2 + 2xy + y^2.
$$

另一方面，

$$
(|x|+|y|)^2 = |x|^2 + 2|x||y| + |y|^2
= x^2 + 2|xy| + y^2.
$$

因为

$$
xy \le |xy|,
$$

所以

$$
x^2 + 2xy + y^2 \le x^2 + 2|xy| + y^2.
$$

也就是

$$
|x+y|^2 \le (|x|+|y|)^2.
$$

两边非负，开方得到

$$
|x+y| \le |x| + |y|.
$$

### 1.3 等号什么时候成立

上面的证明里，唯一可能产生严格不等号的地方是

$$
xy \le |xy|.
$$

等号成立当且仅当

$$
xy \ge 0.
$$

也就是说，$x$ 和 $y$ 同号，或者其中一个为 $0$。直观上，这表示两个数在数轴上指向同一个方向，所以相加时没有抵消。

例如：

$$
|3+5| = |3|+|5| = 8.
$$

但如果方向相反：

$$
|3+(-5)| = 2 < 8 = |3|+|-5|.
$$

抵消出现以后，等号就不成立了。

### 1.4 向量情形的证明

对欧氏空间中的向量 $u,v$，我们希望证明

$$
\lVert u+v\rVert \le \lVert u\rVert+\lVert v\rVert.
$$

仍然平方。由内积定义，

$$
\lVert u+v\rVert^2
= \langle u+v,u+v\rangle
= \lVert u\rVert^2 + 2\langle u,v\rangle + \lVert v\rVert^2.
$$

柯西-施瓦茨不等式告诉我们

$$
\langle u,v\rangle \le |\langle u,v\rangle| \le \lVert u\rVert\lVert v\rVert.
$$

因此

$$
\lVert u+v\rVert^2
\le \lVert u\rVert^2 + 2\lVert u\rVert\lVert v\rVert + \lVert v\rVert^2
= (\lVert u\rVert+\lVert v\rVert)^2.
$$

两边非负，开方得

$$
\lVert u+v\rVert \le \lVert u\rVert+\lVert v\rVert.
$$

这个证明把三角不等式和柯西-施瓦茨不等式连接起来：向量长度的三角不等式，本质上依赖于内积不能过大。

## 2. 算术-几何不等式

### 2.1 概念

算术-几何不等式通常简称 AM-GM。不等式名字里的 AM 是 arithmetic mean，算术平均数；GM 是 geometric mean，几何平均数。

对两个非负数 $a,b$，算术平均数是

$$
\frac{a+b}{2},
$$

几何平均数是

$$
\sqrt{ab}.
$$

AM-GM 说：

$$
\frac{a+b}{2} \ge \sqrt{ab},
\quad a,b\ge 0.
$$

它的含义很重要：在非负数里，直接平均不小于乘积意义下的平均。

更一般地，对 $n$ 个非负数 $x_1,x_2,\dots,x_n$，有

$$
\frac{x_1+x_2+\cdots+x_n}{n}
\ge
\sqrt[n]{x_1x_2\cdots x_n}.
$$

等号成立当且仅当

$$
x_1=x_2=\cdots=x_n.
$$

### 2.2 两个数情形的证明

对 $a,b\ge 0$，从一个显然成立的平方开始：

$$
(\sqrt a-\sqrt b)^2 \ge 0.
$$

展开：

$$
a - 2\sqrt{ab} + b \ge 0.
$$

移项：

$$
a+b \ge 2\sqrt{ab}.
$$

两边除以 $2$，得到

$$
\frac{a+b}{2} \ge \sqrt{ab}.
$$

等号成立当且仅当

$$
\sqrt a-\sqrt b=0,
$$

也就是

$$
a=b.
$$

这个证明非常短，但它揭示了 AM-GM 的核心：平均之后更均匀，而均匀状态让乘积达到最大。

### 2.3 从两个数推广到 n 个数

现在证明一般形式：

$$
\frac{x_1+x_2+\cdots+x_n}{n}
\ge
\sqrt[n]{x_1x_2\cdots x_n},
\quad x_i\ge 0.
$$

记算术平均数为

$$
A=\frac{x_1+x_2+\cdots+x_n}{n}.
$$

我们要证明

$$
A^n \ge x_1x_2\cdots x_n.
$$

先考虑 $n=2^k$ 的情形。

当 $n=2$ 时，刚才已经证明。假设 AM-GM 对 $n$ 个数成立。对 $2n$ 个非负数

$$
x_1,\dots,x_n,x_{n+1},\dots,x_{2n},
$$

分别记前一半和后一半的平均数为

$$
A_1=\frac{x_1+\cdots+x_n}{n},
\quad
A_2=\frac{x_{n+1}+\cdots+x_{2n}}{n}.
$$

由归纳假设，

$$
A_1 \ge \sqrt[n]{x_1x_2\cdots x_n},
$$

$$
A_2 \ge \sqrt[n]{x_{n+1}x_{n+2}\cdots x_{2n}}.
$$

整个 $2n$ 个数的平均数是

$$
A=\frac{A_1+A_2}{2}.
$$

再对 $A_1,A_2$ 使用两个数的 AM-GM：

$$
A=\frac{A_1+A_2}{2}\ge \sqrt{A_1A_2}.
$$

结合前面的不等式：

$$
\sqrt{A_1A_2}
\ge
\sqrt{
\sqrt[n]{x_1\cdots x_n}
\sqrt[n]{x_{n+1}\cdots x_{2n}}
}.
$$

右边整理后就是

$$
\sqrt[2n]{x_1x_2\cdots x_{2n}}.
$$

所以 AM-GM 对 $2n$ 个数成立。由归纳法，它对所有 $2^k$ 个数成立。

接着处理任意 $n$。

取一个 $N=2^k$，使得

$$
N\ge n.
$$

把原来的 $n$ 个数后面补上 $N-n$ 个数，每个都等于 $A$。于是这 $N$ 个数的平均数仍然是 $A$，因为补进去的是平均数本身。

对这 $N$ 个数使用已经证明的 AM-GM：

$$
A
\ge
\sqrt[N]{x_1x_2\cdots x_n A^{N-n}}.
$$

如果 $A=0$，那么所有 $x_i=0$，结论显然成立。若 $A>0$，两边取 $N$ 次方：

$$
A^N \ge x_1x_2\cdots x_n A^{N-n}.
$$

除以 $A^{N-n}$，得到

$$
A^n \ge x_1x_2\cdots x_n.
$$

因此

$$
A \ge \sqrt[n]{x_1x_2\cdots x_n}.
$$

这就证明了 $n$ 个非负数的 AM-GM。

### 2.4 等号条件

两个数情形中，等号当且仅当两个数相等。

一般情形中，等号成立当且仅当所有数都相等：

$$
x_1=x_2=\cdots=x_n.
$$

直观解释是：如果总和固定，把一大一小两个数拉近，它们的乘积会变大。例如总和固定为 $10$：

$$
1\cdot 9=9,\quad 2\cdot 8=16,\quad 5\cdot 5=25.
$$

越均匀，乘积越大；完全均匀时达到最大。

## 3. 柯西-施瓦茨不等式

### 3.1 概念

柯西-施瓦茨不等式描述的是内积和长度之间的关系。

对两个实向量

$$
a=(a_1,a_2,\dots,a_n),
\quad
b=(b_1,b_2,\dots,b_n),
$$

它说：

$$
(a_1b_1+a_2b_2+\cdots+a_nb_n)^2
\le
(a_1^2+a_2^2+\cdots+a_n^2)
(b_1^2+b_2^2+\cdots+b_n^2).
$$

用内积和范数写得更简洁：

$$
|\langle a,b\rangle| \le \lVert a\rVert\lVert b\rVert.
$$

其中

$$
\langle a,b\rangle = a_1b_1+\cdots+a_nb_n,
$$

$$
\lVert a\rVert=\sqrt{a_1^2+\cdots+a_n^2}.
$$

如果把内积写成几何形式：

$$
\langle a,b\rangle = \lVert a\rVert\lVert b\rVert\cos\theta,
$$

那么柯西-施瓦茨不等式其实就是在说

$$
|\cos\theta|\le 1.
$$

但它的力量在于：即使我们没有明确画出角度，也可以用代数形式控制内积。

### 3.2 二次函数证明

如果 $b=0$，那么两边都是 $0$，结论显然成立。下面假设 $b\ne 0$。

考虑关于实数 $t$ 的函数

$$
f(t)=\sum_{i=1}^n (a_i-tb_i)^2.
$$

因为每一项都是平方，所以对任意 $t$，都有

$$
f(t)\ge 0.
$$

展开：

$$
\begin{aligned}
f(t)
&= \sum_{i=1}^n a_i^2
-2t\sum_{i=1}^n a_ib_i
+t^2\sum_{i=1}^n b_i^2.
\end{aligned}
$$

这是一个关于 $t$ 的二次函数：

$$
f(t)=
\left(\sum b_i^2\right)t^2
-2\left(\sum a_ib_i\right)t
+\sum a_i^2.
$$

它对所有实数 $t$ 都非负。因此这个二次函数不能有两个不同的实根。于是判别式必须满足

$$
\Delta \le 0.
$$

计算判别式：

$$
\begin{aligned}
\Delta
&= \left[-2\sum a_ib_i\right]^2
-4\left(\sum b_i^2\right)\left(\sum a_i^2\right).
\end{aligned}
$$

所以

$$
4\left(\sum a_ib_i\right)^2
-4\left(\sum a_i^2\right)\left(\sum b_i^2\right)
\le 0.
$$

两边除以 $4$，得到

$$
\left(\sum a_ib_i\right)^2
\le
\left(\sum a_i^2\right)\left(\sum b_i^2\right).
$$

这就是柯西-施瓦茨不等式。

### 3.3 等号条件

在二次函数证明中，等号成立意味着判别式为 $0$，也就是存在某个 $t$，使得

$$
f(t)=0.
$$

而

$$
f(t)=\sum_{i=1}^n(a_i-tb_i)^2.
$$

平方和等于 $0$，当且仅当每一项都等于 $0$：

$$
a_i-tb_i=0,\quad i=1,\dots,n.
$$

也就是

$$
a_i=tb_i.
$$

所以等号成立当且仅当 $a$ 和 $b$ 线性相关，即一个向量是另一个向量的常数倍。

几何上，这表示两个向量在同一条直线上，方向相同或相反。只有这时，内积的绝对值才能达到长度乘积。

### 3.4 一个常用例子

取

$$
a=(x_1,x_2,\dots,x_n),
\quad
b=(1,1,\dots,1).
$$

柯西-施瓦茨给出

$$
(x_1+x_2+\cdots+x_n)^2
\le
(x_1^2+x_2^2+\cdots+x_n^2)\cdot n.
$$

也就是

$$
\frac{x_1+x_2+\cdots+x_n}{n}
\le
\sqrt{\frac{x_1^2+x_2^2+\cdots+x_n^2}{n}},
$$

当 $x_i\ge 0$ 时，这说明算术平均数不超过平方平均数。它是很多平均值不等式链条的一部分：

$$
\text{几何平均数}
\le
\text{算术平均数}
\le
\text{平方平均数}.
$$

## 4. 三个不等式的关系

这三个不等式不是孤立的公式。

三角不等式控制“合成之后的长度”：

$$
\lVert u+v\rVert\le \lVert u\rVert+\lVert v\rVert.
$$

AM-GM 控制“总和固定时的乘积”：

$$
\frac{x_1+\cdots+x_n}{n}
\ge
\sqrt[n]{x_1\cdots x_n}.
$$

柯西-施瓦茨控制“内积不能超过长度乘积”：

$$
|\langle a,b\rangle|\le \lVert a\rVert\lVert b\rVert.
$$

三角不等式的向量证明依赖柯西-施瓦茨；AM-GM 的基本证明来自平方非负；柯西-施瓦茨的证明也来自平方和非负。它们背后的共同形式是：

$$
\text{平方} \ge 0.
$$

这是初等不等式里最重要的出发点之一。很多看起来复杂的不等式，最后都可以被还原成某个平方、某个平方和，或者某个距离的非负性。

## 5. 记忆方式

三角不等式：

$$
|x+y|\le |x|+|y|.
$$

关键词是“绕路不会更短”。

算术-几何不等式：

$$
\frac{x_1+\cdots+x_n}{n}
\ge
\sqrt[n]{x_1\cdots x_n}.
$$

关键词是“均匀时乘积最大”。

柯西-施瓦茨不等式：

$$
\left(\sum a_ib_i\right)^2
\le
\left(\sum a_i^2\right)\left(\sum b_i^2\right).
$$

关键词是“内积不超过长度乘积”。

如果只记公式，很容易忘；如果记住它们分别在控制距离、乘积和内积，就能在更多场景里重新把它们想起来。
