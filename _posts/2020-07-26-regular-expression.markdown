---
layout: post
title: python 正则表达式
date: 2020-07-23 12:59:24.000000000 +09:00
tags: python
---

## python 正则表达式 `re` 模块

python 通过 `re` 模块来实现

```python
>>> import re
>>> re.research(r'FishC', 'I love FishC.com')
<_sre.SRE_Match object; span=(7, 12), match = 'FishC'>
```
> `search()` 方法用于在字符串中搜索正则表达式模式第一次出现的 **位置** 。

这种方法类似于 `find()`方法，

```python
>>> "I love FishC.com!".find('FishC')
7
```

注意事项：

+ 第一个参数是正则表达式模式，也就是要描述的搜索规则，需要使用原始字符串来写

+ 返回的范围下标从 0 开始。找不到则返回 None

### `re.compile()`

> 可以將欲搜尋字符串的正則表達式當做字符串參數放在此方法內，然後會傳回一個 Regex (Regular expression)，如，

```python
phoneRule = re.compile(r'\d\d\d\d-\d\d\d-\d\d\d') #建立 phoneRule 對象
```

### `re.search()`

在 Regex 對象內有 `search()` 方法，可以由 Regex 對象啓用，然後將欲搜尋的字符串放在這個方法內，如，

```python
phoneNum = phoneRule.search()
```

可以使用，

```python
re.search(pattern, string, flags)
```

省略 `re.compile()`，其中 `pattern` 是欲搜寻的正则表达方式；`string` 是所搜寻的字符串。

### `findall()`

> 這個方法會將搜尋到的元素用列表方式傳回，這樣就不會有只顯示第一個搜尋關鍵元素的缺點，如果沒有比對相符的元素就傳回空列表。

```python
pheoneRule = re.compile(r'\d\d\d\d-\d\d\d-\d\d\d')  #建立 phoneRule 對象
phoneNum = phoneRule.findall(string)  #string 是欲搜尋的字符串
```

與 `search()` 函數相同，`findall()` 也同樣可以由 `re` 模塊直接調用，而省略 `re.compile()`：

```python
re.findall(pattern, string, flags)
```

## 通配符

和字符串 `find()` 方法相比较，正则表达式较强的地方在于可以使用通配符。

> python 正则表达式中的通配符 `.` 可以匹配除了换行符之外的任何字符

```python
>>> re.search(r'.', 'I love FishC.com!')
<_sre.SRE_Match object; span=(0, 1), match = 'I'>

>>> re.search(r'Fish.', 'I love FishC.com!')
<_sre.SRE_Match object; span=(7, 12), match = 'FishC'>
# 这里 '.' 只替代一个字母
```

## 反斜杠

```python
>>> re.search(r'.', 'I love FishC.com!')
<_sre.SRE_Match object; span=(0, 1), match = 'I'>

>>> re.search(r'\.', 'I love FIshC.com!')
<_sre.SRE_Match object; span=(12, 13), match = '.'>
```

> 正则表达式中，反斜杠用来剥夺元字符的特殊能力。元字符就是拥有特殊能力的符号，如 `.`

## 分组符 `()` 以及 `group()`

使用 `()` 进行分组，如

```python
r`\d\d-\d\d\d\d\d\d\d\d` #可以改写为
r`(\d\d)-(\d\d\d\d\d\d\d\d)`
```

其中分组后有个一个好处就是可以使用 `group()` 进行选择，

```python
print("完整的号码：%s phoneNum.group(0))
```

其中 `group()` 或者 `group(0)` 传回第一个比对相符的文字，`group(1)` 等则传回括号的第一组文字等。

值得注意的是如果使用 `()` 分组后，当使用 `findall()` 后，会传回元组的列表，如

```python
import re

msg = 'Please call my secretary using 02-26669999 or 02-11112222'
pattern = r'(\d{2}) - (\d{8})'
phoneNum = re.findall(patterm, msg) #传回搜寻结果
print(phoneNum)

#输出结果：

[('02', '26669999'), ('02', '11112222')]
```

## `groups()`

可以使用 `group()` 进行多重指定，如

```python
pattern = r'(\d{2})-(\d{8})'
phoneNum = re.serach(patterm, msg)
areaNum, localNum = phoneNum.groups()
```

## 字符类 `[]`

为了表示一个字符的范围，可以创建一个字符类。使用中括号将任何内容包起来就是一个字符类，**它的含义是只要匹配这个字符类中的任何字符，结果就算做匹配**。

```python
>>> re.search(r'[aeiou]', 'I love 123 FishC.com')
<_sre.SRE_Match object; span=(3, 4), match = 'o'>
```

同时也可以使用 `-` 做字母或数字范围的搜索：

```python
# 在规定字母顺序范围内搜索
>>> re.search(r'[a-z]', 'I love 123 FishC.com!')
<_sre.SRE_Match object; span=(2, 3), match = 'l'>

# 在规定数字顺序范围内搜索
>>> re.search(r'[0-2][0-5][0-5]', 'I love 123 FishC.com!')
<_sre.SRE_Match object; span=(7, 10), match = '123'>
```

有以下两个注意事项：

+ `re.search` 对于字符的搜索区分大小写
+ `re.search` 只能遍历字符串，并将满足条件的第一个结果返回

## 重复匹配 `{}`

使用 `{}` 大括号对元字符实现重复匹配功能：

```python
>>> re.search(r'ab{3}c', 'abbbc')
<_sre.SRE_Match object; span=(0, 5), match = 'abbbc'>

# 重复次数可以规定范围
>>> re.search(r'ab{3, 5}c', 'abbbbbc')
<_sre.SRE_Match object; span=(0, 7), match = 'abbbbbc'>
>>> re.search(r'ab{3, 5}c', 'abbbbbc')
<_sre.SRE_Match object; span=(0, 5), match = 'abbbc'>
```

对于重复匹配有以下注意事项：

+ 正则表达式匹配的是 **字符串而非数字** ，所以在匹配大于 10 的数字时需要额外考虑
+ 可以利用 `{0, 1}` 来解决大于 10 数字不好搜索的问题

例如利用正则表达式匹配 ip 地址：

```python
>>> re.search(r'(([0-1]{0, 1}\d{0, 1}\d|2[0-4]\d|25[0-5])\.){3}([0-1]{0, 1}\d{0, 1}\d|2[0-4]\d|25[0-5])', 'other192.168.1.1other'])
<_sre.SRE_Match object; span=(5, 16), match = '192.168.1.1'>
```

## 特殊符号

| 字符 | 使用說明                                                |
|------|---------------------------------------------------------|
| \d   | 0~9的整數字元                                           |
| \D   | 除了0~9的整數字元以外的其他字符                         |
| \s   | 空白、定位、Tab鍵、換行、換頁字符                       |
| \S   | 除了空白、定位、Tab鍵、換行、換頁字符以外的其他字符     |
| \w   | 數字、字母和底線\_字符，[A-Za-z0-9\_]                   |
| \W   | 除了數字、字母和底線\_字符，[A-Za-z0-9\_]以外的其他字符 |

Python 3 正则表达式的特殊符号及用法见 [re regular expression 文档](https://docs.python.org/3.8/library/re.html)。

如，

```python
pattern = '\w+' # 把不限長度的數字、字母和底線字符當做符合搜尋
pattern = 'John\w' # John開頭後面接0~多個數字、字母和底線字符
```
## 搜索时的特殊符号

### 使用 `？` 做搜寻

正则表达式中若某些括号内的字符串或正则表达式可有可无，执行搜寻时皆算成功。如，


```python
msg = 'Please call my secretary using 02-26669999'
pattern = r'(\d\d-)?(\d{8})`
phoneNum = re.search(pattern, msg)
print("完整的号码是： %s" % phoneNum.group())
```

### 使用 `*` 做搜寻

正则表达式中若某些字符串或者正则表达式可从0到多次，执行皆算成功，例如，na 字可从0到多次，表达方式是 (na)\*。

### 使用 `+` 做搜寻

正则表达式中若某些字符串或者正则表达式可从1到多次，执行皆算成功，例如，na 字可从1到多次，表达方式是 (na)+。

### 搜寻时忽略大小写

在 `search()` 和 `find()` 内增加第三个参数（`flags`），`re.I` 或者 `re.IGNORECASE`，搜寻结果就会忽略大小写，至于打印时仍然会以原字符打印。如，

```python
txt = re.findall(pattern, msg, re.I)
```

## 元字符

### 管道符 `|` 

管道符 `|` 类似于逻辑或操作，同时搜寻比对多个字符串

```python
>>> re.search(r"Fish(C|D)", "FishC")
<_sre.SRE_Match object; span=(0, 5), match = 'FishC'>
>>> re.search(r"Fish(C|D)", "FishD")
<_sre.SRE_Match object; span=(0, 5), match = 'FishD'>
```

**注意：单引号及管道符号两侧不能留空白。**

同时，管道符可以用于多个字符串的同时搜索，如

```python
pattern = 'John(son|nason|nathan)'
```

### 脱字符 `^`

脱字符 `^` 表示匹配字符串需要开始的位置，**只有在目标字符串的开头时才会发生匹配** 。

```python
>>> re.search(r"^FishC", "I love FishC.com!")
>>> re.search(r"^FishC", "FishC.com!")
<_sre.SRE_Match object; span=(0, 5), match = 'FishD'>
```

### 美元符 `$`

则表示匹配字符串的结束位置，也就是说，只有目标字符串出现在末尾才会匹配：

```python
>>> re.search(r"FishC$", "FishC.com"
```


















