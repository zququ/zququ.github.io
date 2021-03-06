---
layout: post
title: 汇编语言 实验10 (2) 解决除法溢出的问题
date: 2019-12-29 15:48:24.000000000 +09:00
tags: 汇编语言
---

### div 复习

div指令可以做除法。当进行8位除法的时候，用al存储结果的商，ah存储结果的余数；进行16位除法的时候，用ax存储结果的商，dx存储结果的余数，

| 数据类型 | 寄存器 | 存放内容 |
|----------|--------|----------|
| 8位      | al     | 商       |
|          | ah     | 余数     |
| 16位     | ax     | 商       |
|          | dx     | 余数     |

可是，现在有一个问题，如果结果的商大于al或ax的所能存储的最大值，将如何？

如下，进行的是8位除法，结果的商为1000，而1000在al中放不下。

```x86asm
mov bh, 1
mov ax, 1000
div bh
```

又如，进行的是16位除法，结果的商为11000H，而11000H在ax中存放不下。

```x86asm
mov ax, 1000H
mov dx, 1
mov bx, 1
div bx
```

当结果的商过大，超出了寄存器所能存储的范围。当CPU执行div等除法指令的时候，如果发生这样的情况，将引发CPU的一个内部错误，这个错误被称为：**除法溢出**。我们可以通过特殊的程序来处理这个错误。

所以，由于有这样的问题，我们再进行除法运算的时候要注意除数和被除数的值，比如1000000/10就不能用div指令来执行计算。

### 问题

设计子程序，

名称：divdw

功能：进行不会产生溢出的除法运算，被除数为dword型，除数为word型，结果为dword型。

参数：

(ax) = dword型数据的低16位，<br>
(dx) = dword型数据的高16位，<br>
(cx) = 除数

返回：

(ax) = 结果的低16位，<br>
(dx) = 结果的高16位，<br>
(cx) = 余数

应用举例：计算1000000/10(F4240H/0AH)

```x86asm
mov ax, 4240H
mov dx, 000FH
mov cx, 0AH
call divdw
```
结果：

(ax) = 86A0H，<br>
(dx) = 0001H，<br>
(cx) = 0

提示：

给出一个公式:

X：被除数，范围：[0, FFFFFFFF]<br>
N：除数，范围：[0, FFFF]<br>
H：X高16位，范围：[0, FFFF]<br>
L：X低16位，范围：[0, FFFF]<br>
int()：描述性运算符，取商，比如，int(38/10)=3<br>
rem()：描述性运算符，取余数，比如，rem(38/10)=8

公式：X/N = int(H/N)\*65536+[rem(H/N)\*65536+L]/N

关于公式的详细解析：

X/N代表着目标可能会存在溢出问题的除法，可以被分解为两个因式。第一个分式，int(H/N)意味着X的高16位与除数之间的除法后的商，由于本身是高16位所以要乘以一个65526($2^{16}$)系数，这个时候同样会产生一个余数，即位rem(H/N)，同样的也要乘以65526并加X的低16位，并将二者相加除以除数N。最终再将高位的商与低位(高位余数与低位的和)的商相加即为X/N的商，而低位的余数即位X/N的余数。

这个公式将可能产生溢出的除法运算：X/N，转变为多个不会产生溢出的除法运算。公式中，等号右边的所有除法运算都可以用div指令来做，肯定不会导致除法溢出。

代码，

```x86asm
start: mov ax, 4240H
       mov dx, 000F
       mov cx, 0AH
       call divdw

divdw: push si
       push bx
       push ax

       mov ax, dx
       mov dx, 0  ;dx寄存器清零，用于稍后存放余数
       div cx  ;执行int(H/N)*65536，高16位的商在ax，余数在dx
       mov si, ax  ;将高16位商存放在si
       pop ax    ;低位被除数出栈
       div cx  ;此时，ax中是低位被除数，dx中存放高位除法余数，
               ;所以这里执行的即：[rem(H/N)*65536+L]/N
               ;低位的商在ax，低位的余数在dx
       mov cx, dx   ;低位的余数即为最终的余数
       mov dx, si   ;高位的商即为最终的商的高位

       pop bx
       pop si
       ret

code ends
end start
```

### 公式防溢出的证明

1.(X/N) = (H\*65536)/N + (L/N) <br>
2.(X/N) = [int(H/N) + rem(H/N)]\*65536/N + (L/N)<br>
3.(X/N) = int(H/N)\*65536 + [rem(H/N)\*65536 + L]/N<br>
由3可知，高16位除法的商即为最终的高16位商

本实验共执行了两次除法，

第一次，H/N
的二次，[rem(H/N)\*65536 + L]/N

因为H ≤ 65535，所以H/N不会溢出

1.L ≤ 65535<br>
2.rem(H/N) ≤ (N-1)<br>
由2得，<br>
3.rem(H/N)\*65536 ≤ (N-1)\*65536<br>
由1,3有，<br>
4.rem(H/N)\*65536+L ≤ (N-1)\*65536 + 65535<br>
5.[rem(H/N)\*65536+L]/N ≤ [(N-1)\*65536 + 65535]/N<br>
6.[rem(H/N)\*65536+L]/N ≤ [65536-(1/N)]<br>

所以不会发生溢出。
























