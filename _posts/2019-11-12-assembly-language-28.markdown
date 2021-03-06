---
layout: post
title: 汇编语言 7.7 7.8 7.9 SI DI, [bx+si+idata] [bx+di+idata]
date: 2019-11-12 19:49:24.000000000 +09:00
tags: 汇编语言
---

### 7.7 SI 和 DI

si和di在8086CPU中与bx的功能非常相似，唯一不同的是si和di均不能被拆成两个8位寄存器来使用，如

bx = bh + bl, 但si, di不能这样拆成h和l。

> 问题： 用si和di实现将字符串'welcome to masm!'复制到它后面的数据区中。

```x86asm
assume cs:codesg, ds:datasg
datasg segment
  db 'welcome to masm!'
  db '................'
datasg ends
```
首先就要确认数据的来源地址与复制的目的地址。可以看出数据要从偏移地址0开始复制，长度为16个字节，所以后面数据区的偏移地址为16。我们用si(source)来指明复制的源字符串地址，di(direction)来指明复制的目的地址。

代码如下:

```x86asm
codesg segment
  start:  mov ax, datasg
          mov ds, ax

          si = 0
          di = 16
          cx = 8  ;这里因为每次拷贝两个字节，也就是一个字型数据

      s:  mov ax, ds:[si]
          mov ds:[di], ax    ;这里可以简化为mov 16[si], ax

          add si, 2  ;这里每次拷贝增加一个字型数据长度2
          add di, 2
          loop s

          mov ax, 4c00h
          int 21h
codesg ends
end start
```

### 7.8 [bx+si+idata]和[bx+di+idata]

```x86asm
mov ax, [bx+si+idata]
```
改代码含义为将一个内存单元的内容送入ax, 这个内存单元长度为2字节，存放一个字，偏移地址为bx中的数值加上si的数值再加上idata，段地址在ds中。

该指令的常用格式还有：

```x86asm
mov ax, [bx+200+si]
mov ax, [200+bx+si]
mov ax, 200[bx][si]
mov ax, [bx].200[si]
mov ax, [bx][si].200
```
以上均等价。

> 问题 用Debug查看内存如下：<br>
2000: 1000 BE 00 06 00 6A 22 ...<br>
写出下面程序执行后ax, bx, cx的内容。

```x86asm
mov ax, 2000H
mov ds, ax
mov bx, 1000H
mov si, 0
mov ax, [bx+2+si]
inc si
mov cx, [bx+2+si]
inc si
mov di, si
mov bx, [bx+2+di]
```
注意如bx的值。

bx -> [1004H] = 高位 + 低位(与内存中数据排序相反)= 22 6AH ([1004H]地址指向的是该字型数据的低位，要在前面加上对应的高位数据)



