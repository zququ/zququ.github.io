---
layout: post
title: 如何在 centos-8 中安装 ccls（用于c语言代码自动补全）
date: 2022-07-20:24.000000000 +09:00
tags: vim
---

这里对 centos-8 安装 ccls 方法进行回顾与备注。

简单流程：

1. 首先安装 llvm、clang

从 llvm-project 仓库中，Rleases 下载完整的 llvm + clang 压缩包。

2. 解压后使用以下命令进行安装

```bash
cmake -S llvm -B build -DLLVM_ENABLE_PROJECTS="clang" -DCMAKE_INSTALL_PREFIX=/home/zququ-centos8/Software/llvm-clang/ -DCMAKE_BUILD_TYPE=MinSizeRel
```

这样就可以同时安装 `llvm` 以及 `clang` 。其中 `DCMAKE_INSTALL_PREFIX` 选项默认安装到 `/usr/local/` 中。由于编译包比较大，需要几十个 g，可以考虑安装到 `/home` 中，其实如果这样选择一般后续安装会直接安装到软件编译 `build` 目录的 `bin` 和 `lib` 中。`-DCMAKE_BUILD_TYPE=MinSizeRel` 即按最小体积进行编译，实际证明，已经可以实现后续对于 `ccls` 的安装。

3. 使用以下命令进行编译

```
cmake --build build -j 8
```

4. 安装好后，从 ccls 仓库拉取对应压缩包。

5. 解压后以下命令对 `ccls` 进行编译。

```
cmake -H. -BRelease -DCMAKE_BUILD_TYPE=Release
```

6. 将 `ccls/Release` 中的 `ccls` 加入环境变量。
