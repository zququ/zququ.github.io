---
layout: post
title: 为什么矩阵行、列空间维度相同
date: 2021-05-06 17:48:00:24.000000000 +09:00
tags: 数学
---
转自：[stackexchange 论坛](https://math.stackexchange.com/questions/1900437/proof-that-the-dimension-of-a-matrix-row-space-is-equal-to-the-dimension-of-its)

Proof. Suppose that $\lbrace v_1,v_2,\dots,v_k\rbrace$ is a basis for the column space of $A$. Then each column of $A$ can be expressed as a linear combination of these vectors; suppose that the $i$-th column $c_i$ is given by 

$$c_i = \gamma_{1i}v_1+\gamma_{2i}v_2+\dots+\gamma_{ki}v_k$$ 

Now form two matrices as follows: $B$ is an $m\times k$ matrix whose columns are the basis vectors $v_i$, while $C=(\gamma_{ij})$ is a $k\times n$ matrix whose $i$-th column contains the coefficients $\gamma_{1i},\gamma_{2i,}\dots,\gamma_{ki}$. It then follows$^7$ that $A=BC$.

However, we can also view the product $A= BC$ as expressing the rows of $A$ as a linear combination of the rows of $C$ with the $i$-th row of $B$ giving the coefficients for the linear combination that determines the $i$-th row of $A$. Therefore, the rows of $C$ are a spanning set for the row space of $A$, and so the dimension of the row space of $A$ is at most $k$. We conclude that: 

$$\dim(\operatorname{rowsp}(A))\leq\dim(\operatorname{colsp}(A))$$ 

Applying the same argument to $A^t$, we conclude that:

$$\dim(\operatorname{colsp}(A))\leq\dim(\operatorname{rowsp}(A))$$

and hence these values are equal




