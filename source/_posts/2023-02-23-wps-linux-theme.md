---
layout: post
title: linux WPS 主题更换
date: 2023-02-23 13:34:24
comments: true
tags: DailyUpdate
---

## 一款可以用于更换 linux wps 主题更换的软件

最近在github上，找到一个可以用于 linux 更换主题的软件，[链接在这里](https://github.com/Prayag2/wps-skin-installer)。

安装后，需要对 script.py 的进行一些修改。

比如使用 wps linux 管网下载的，安装目录需要改为对应安装默认地址：

```
wps_path = "/opt/kingsoft/wps-office/office6/skins"
```

另外，由于 zh 地区带有云功能的 wps linux 版本，默认使用的主题不在 `skins` 文件夹中，所以将 script.py 中的 `2019white` 改为 `2019dark`。
