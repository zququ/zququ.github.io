---
layout: post
title: C语言 常量 宏定义
date: 2019-12-09 14:46:24.000000000 +09:00
tags: C语言
---
整理自小甲鱼[鱼C论坛](https://fishc.com.cn/)

### 常量

在程序运行的过程中，它的值不能够被改变，成为**常量**。

C语言中常见的常量如下：

1. 整型常量：520，1314，123
2. 实型常量：3.14，5.12，8.97
3. 字符常量：
   1. 普通字符：'A', 'B'
   2. 转义字符：'\n', '\t'
4. 字符串常量：'ABCD'
5. 符号常量：使用之前必须定义

#### 定义符号常量

符号常量的定义格式：

`#define 标识符 常量`

\#define是一条预处理命令(预处理命令都以"#"开头)，也称为宏定义命令。\#define的功能就是把程序中所有出现的标识符都替换为随后的常量。

代码示例，

```c
#include <studio.h>

#define NAME "ABCD"
#define YEAR 2019

int main(void)
{
      printf("name is %s in year %d \n", NAME, YEAR)
      return 0;
}
```

#### 标识符

在C语言中，标识符指的就是一切的名字。比附符号常量名是标识符，变量名也是一个标识符，即将学到的函数、数组、自定义类型的名字都称为标识符。并且满足变量的命名规律。

#### 字符串常量

用一个特殊的转义字符来表示字符串的结束位置，这样当操作系统读取到这个转义字符的时候，就知道该字符串到此为止了，这个转义字符就是空字符：'\0'。表示字符串的结束位置(自动追加)。

问题：

(1) 转义字符占一个字节

(2) 有符号常量定义如下：

`#define F(n) 2*n`

则F(3+2) == 2\*3+2 == 8，这是因为宏定义是在程序编译时先进行预处理，做法是直接将标识符替换为常量，并不会进行相关运算。因此，直接将F(3+2)替换为2\*3+2。

(3) 定义两个宏，分别叫S(r)和C(r)，通过它可以计算得到半径为r的圆的面积和周长。

程序如下，

```c
#include <studio.h>

#define PI 3.14159
#define S(r) PI * r * r
#define C(r) 2 * PI * r

int main()
{
        int r = 5;
        printf("半径为%d的圆，面积是：%.2f，周长是：%.2f\n", r, S(r), C(r));
        return 0;
}
```

