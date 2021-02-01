---
layout: post
title: 关于线性回归不会产生局部最优解的解释
date: 2020-11-18 17:59:24.000000000 +09:00
tags: MachineLearning
---

对于一个线性回归函数式：

$$
y = b + w\cdot x_{cp}
$$

利用 Linear regression 与 Gradient Descent 方法，核心思想是寻找函数曲线极值。即，

$$
w^*,b^* = \arg\min_{w, b}L(w, b)
$$

如果我们固定 $b$, 仅仅思考 $w$ 对于 Gradient Descent 寻找函数曲线极值的影响，经常会出现下图的情况，

![pic1](/assets/202006/2020-06-26-23-00-53.png) 

无法避免利用 Gradient Descent 只能找到局部最优解的问题
