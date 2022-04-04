---
layout: post
title: Ranger 操作手册
date: 2021-02-01 17:16:00:24.000000000 +09:00
tags: Linux
---
之前年前一直在忙，现在把 ranger 的配置文件和相应操作命令行总结一下，发出来备用吧。

首先是 ranger 配置文件, [ranger\_config](https://github.com/zququ/ranger/blob/master/rc.conf) 

下面是对应的操作命令行：

## Ranger 快捷命令行

1. gg 到文件最上面；G 到文件最下面
2. 可以用默认编辑器打开文档或按 "r" 直接运行对应脚本
3. '['，']'来移动副目录
4. 'H'退回历史操作；'L'历史记录上调
5. 可自定义进入文件夹的快捷键, 例如
	+ gi -> github
	+ gh -> home
	+ gr -> root
	+ g 显示可跳跃的目录快捷键
6. zh 显示掩藏文件
7. o 排序模式
8. '/' -> ： search() 搜索
9. f -> 只显示含有目标文件
10. 真正进入文件夹 (shift+s) 'S'
11. *fzf 显示出好多文件，可以模糊匹配*
12. 复制文件内容：
	+ yp -> 复制文件地址
	+ yn -> 复制文件名
	+ y. -> 复制去掉文件后缀的文件名
13. 'V' -> 用vim打开文件
14. 'M' -> 创建文件夹
15. cw -> 重新命名文件，或者'a'与'A'句前句后重命名
16. 按 v 或 space 多选文件，按 cw，识别是否为多文件，如果为多文件则打开vim，并将文件名复制进入批量处理（调用':bulkrename'）
	+ 操作方法：Ctrl + v -> 进入 visual box 模式，选中后 'shift + u' ('U') 插入
17. 文件操作方法：
	+ yy -> 文件变灰
	+ pp -> 粘贴，当文件较大按'w'可看进度条
	+ 再 pp -> 文件名.txt\_ 加下划线
	+ po 覆盖粘贴
	+ dd 剪切
	+ dD 删除，当删除文件夹时会询问
	+ dU 看文件目录大小
	+ 退出任务管理器 -> 'q'或'w'
	+ 打包压缩 -> v选中后  ':compress'
	+ 'x' -> 解压缩
	+ Markdwon -> cp 制作成pdf
	+ ytv -> 下载文件（视频）
18. 配置 ranger:
	+ ranger 目录: ~/.config/ranger/
	+ ranger --copy-config=all
	+ RANGER\_LOAD\_DEFAULT\_RC FALSE
	+ `export RANGER_LOAD_DEFAULT_RC=FALSE` -> bashrc
	+	`set -g -x RANGER_LOAD_DEFAULT_RC FALSE` -> fishrc
	+ command.py
	+ rc.conf -> 主要配置
	+ rifle.conf -> 默认程序
	+ scope.sh -> 预览配置
	+ github plugins -> Ranger Devicon (depand on nerdfont)
	+ github 脚本 -> Custom commands
	+ console -> 执行 ranger 命令等
19. 其他:
	+ vcs\_aware 改成TRUE -> github查看状态:`set vcs_aware true`
	+ 官方image preview，安装 w3m 浏览器 image loader -> terminal里显示文件

		```
		set preview_images w3m
		set preview_images_method w3m
		```
	+ 视频：`scope_sh -> vedeo`取消批注
20. 如何定义快捷键 -\>github -> keybindings -> Archwikis






