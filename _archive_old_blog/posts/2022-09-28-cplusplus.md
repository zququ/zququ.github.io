---
layout: post
title: C++ 代码收集
date: 2022-09-28 16:54:55
comments: true
tags: C++
---

## 计数

### 2022-09-28

```c++
for (int n=0; n<5; n++)
for (int i = v.size() ? v.size() : 5; i > 0; i --){
	v.add(randomInteger(-1000, 1000));
	}
}
```

## 特殊符号

### 2022-11-09

```c++
std::ostream &operator<<(std::ostream &os, Point point) {
    return os << point.toString();
}
```
这里含义为描述类为标准库中 `ostream` 类的操作符 `<<` 定义，输入参数为 `ostream` 类以及 `Point` 类中的 `point`。

这里第一行不能更改为

```
std::ostream operator
```

的原因是，会影响 `<<` 的连续使用，即

```c++
std::cout a << b << c;
```

只能使用

```c++
std::cout a << b;
std::cout b << c;
```

