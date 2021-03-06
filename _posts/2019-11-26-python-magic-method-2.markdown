---
layout: post
title: python 魔法方法 (2) 算术运算
date: 2019-11-26 16:14:24.000000000 +09:00
tags: python
---
整理自小甲鱼[鱼C论坛](https://fishc.com.cn/)
### 算数运算

Python 2.2以后，对类和类型进行了统一，做法就是将int(), float(), str(), list(), tuple()这些BIF转换为工厂函数：

```python
>>> type(len)
<class 'builtin_function_or_method'>
>>> type(int)
<class 'type'>
```
这与一般的类相同：
```python
>>> class C:
        pass

>>> type(C)
<class 'type'>
```

type类型也就是类对象，所谓的工厂函数就是一个类对象。当调用它们的时候，事实上就是创建一个相应的实例对象，并且类对象本身可以用于运算

```python
>>> a = int('123')
>>> b = int('345')
>>> a + b
```

常见的算数运算相关的魔法方法：

| 魔法方法                          | 含义                                |
|-----------------------------------|-------------------------------------|
| \_\_add\_\_(self, other)          | 定义加法的行为：+                   |
| \_\_sub\_\_(self, other)          | 定义减法的行为：-                   |
| \_\_mul\_\_(self, other)          | 定义乘法的行为：\*                  |
| \_\_truediv\_\_(self, other)      | 定义真除法行为：/                   |
| \_\_floordiv\_\_(self,ohter)      | 定义整数除法行为：//                |
| \_\_mod\_\_(self, other)          | 定义取模算法的行为：%               |
| \_\_divmod\_\_(self, other)       | 定义当被divmod()调用时的行为        |
| \_\_pow\_\_(self, other[,modulo]) | 定义当贝power()调用或\*\*运算时的行为 |
| 以下为汇编行为：                  |                                     |
| \_\_lshift\_\_(self, other)       | 定义按位左移位的行为：<<            |
| \_\_rshift\_\_(self, other)       | 定义按位右移位的行为：>>            |
| \_\_and\_\_(self, other)          | 定义按位与操作的行为：&             |
| \_\_xor\_\_(self, other)          | 定义按位异或操作的行为：^           |
| \_\_or\_\_(self, other)           | 定义按位或操作的行为：\|            |

具体用法，如编程一个新的New\_int类，使得加法与减法运算结果相反：

```python
>>> class New_int(int):
        def __add__(self, other):
            return int.__sub__(self, other)

>>> a = New_int(3)
>>> b = New_int(5)
>>> a + b
-2
```

下面观察下面代码的问题出在哪里？

```python
>>> class Try_int(int):
        def __add__(self, other):
            return self + other

>>> a = Try_int(1)
>>> b = Try_int(2)
>>> a + b
RecursionError: maximum recursion depth exceeded
```
在我们在通过对Try\_intA()进行实例化以后，执行`a + b`时，读到`a +`时开始执行\_\_add\_\_()函数，返回`self +`即`a +`而后再次执行\_\_add\_\_()函数，继而陷入无限递归。

我们可以通过将返回值强制修改为数值运算，就可以避免这个问题：

```python
>>> class Try_int(int):
        def __add__(self, other):
            return int(self) + int(other)
```
这样在执行`a + b`时，读到`a +`执行\_\_add\_\_()函数，返回a的值与b的值的和，这样，即使再次调用\_\_add\_\_()函数，由于缺少实例对象而就不会再次进入递归。

有一点值得注意，看一下代码有什么问题，

```python
class Foo:
        def __init__(self):
            self.foo = 'Result'

        def foo(self):
            return self.food

>>> foo = Foo()
>>> foo.foo()
TypeError: 'str' object is not callable
```

问题在于，在\_\_init\_\_()方法里，如果类中方法名和属性同名，属性会覆盖方法，所以在调用实例对象foo的foo函数时，由于foo函数被属性`self.foo = 'Result'`所替代，所以会出现TypeError说字符串类型无法被调用。

### 鸭子类型( duck typing )

鸭子类型是一种**动态类型的一种风格**，这种风格中，**一个对象有效的语义，不是由继承特定的类或实现特定的接口，而是由当前方法和属性的集合决定**。

这个名字的由来源自于 James Whitcomb Riley提出的鸭子测试：

> 当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称作鸭子。

鸭子类型应避免使用type()或者isinstance()等测试类型是否合法。

如下代码，

```python
class Duck:
    def quack(self):
        print('呱呱呱')
    def feathers(self):
        print(‘灰白色羽毛)

class Person:
    def quack(self):
        print('啊啊啊')
    def feathers(self):
        print('穿着羽绒服')

def location(duck):
    duck.quack()
    duck.feathers()

def game():
    donald = Duck()
    john = Person()
    location(donald)
    location(john)

game()
```
location()函数中对参数duck只有一个要求：就是可以实现quack()和feathers()方法，然而Duck类型和Person类都实现了quack()和feathers()的方法，因此donald和john都可以作为location()的参数。

鸭子类型给予了Python这样的动态语言以多态，但是这种多态的实现完全由程序员来约束强制实现，并没有语言上的约束。因此这种方法既灵活，由提高了要求。

又如，

```python
def calc(a, b, c):
        return (a + b) * c

a = calc(1, 2, 3)
b = calc([1, 2, 3], [4, 5, 6], 2)
c = calc('A', 'B', 3)
```

> 问题：

(1) 定义一个Nstr类，支持字符串的相间操作：A - B，从A中去除所有B的子字符串。

```python
>>> a = Nstr('ABC')
>>> b = Nstr('A')
>>> a - b
'BC'
```

```python
class Nstr(str):
    def __sub__(self, other):
        return self.replace(other, '')    # 使用字符串的replece函数
```

#### replace 函数

> 描述

Python replace() 方法把字符串中的 old（旧字符串） 替换成 new(新字符串)，如果指定第三个参数max，则替换不超过 max 次。

> 语法

replace()方法语法：

```python
stR.replace(old, new[, max])
```

> 参数

old -- 将被替换的子字符串。
new -- 新字符串，用于替换old子字符串。
max -- 可选字符串, 替换不超过 max 次

> 返回值

返回字符串中的 old（旧字符串） 替换成 new(新字符串)后生成的新字符串，如果指定第三个参数max，则替换不超过 max 次。

(2) 移位操作符是应用于二进制操作数的，现在需要你定义一个新的类Nstr，也支持移位操作符的运算：

如下：
```python
>>> a = Nstr('ABCDEFGHK')
>>> a << 3
'DEFGHKABC'
>>> a >> 3
'GHKABCDEF'
```
利用`__lshift__()`函数以及`__rshift__()`函数

```python
class Nstr(str):
    def __lshift__(self, other):
        return self[other:] + self[:other]

    def __rshift__(self, other):
        return self[-other:] + self[:-other]
```

(3) 定义一个类 Nstr, 当该类的实例对象间发生的加、减、乘、除运算时，将该对象的所有字符串的ASCII码之和进行计算：

如下，

```python
>>> a = Nstr('FishC')
>>> b = Nstr('love')
>>> a + b
899
>>> a - b
23
>>> a * b
201918
>>> a / b
1.052511415525114
>>> a // b
1
```
代码如下：

```python
class Nstr:
    def __init__(self, arg = ''):
        if isinstance(arg, str):
            self.total = 0
            for each in arg:
                self.total += ord(each)

        else:
            print('输入有误，请重新输入！')
    def __add__(self, other):
        return self.total + other.total
    def __sub__(self, other):
        return self.total - other.total
    def __mul__(self, other):
        return self.total * other.total
    def __truediv__(self, other):
        return self.total / other.total
    def __floordiv__(self, other):
        return self.total // other.total
```
代码的前半部分可以这样改写：

```python
class Nstr(int):
    def __new__(cls, arg=0):
        if isinstance(arg, str):
            total = 0
            for each in arg:
                total += ord(each)
            arg = total    #注意__new__()方法需要将最终参数传回arg
        return int.__new__(cls, arg)
```


