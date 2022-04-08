---
layout: post
title: 如何通过Github Action为Github Pages添加mermaid流程图
date: 2022-04-08 16:11:25:24.000000000 +09:00
tags: blog
---

虽然目前Github网站已经支持通过Markdown添加Mermaid流程图，但Github Pages目前仍然没有适配。

网上寻找解决办法的过程中，发现了一个优化库 [jeffreytse/jekyll-spaceship](https://github.com/jeffreytse/jekyll-spaceship)，可以通过Markdown添加流程图、音乐，可以实现Html代码与Markdown同时使用、并优化了表格系统等等，如下图：

![流程图例](https://user-images.githubusercontent.com/9413601/85282355-2e317300-b4be-11ea-9c30-8f9d61540d14.png) 

![流程图例2](https://user-images.githubusercontent.com/9413601/82813883-9180b300-9ec8-11ea-8778-f450e0056938.png) 

![添加音乐](https://user-images.githubusercontent.com/9413601/133599796-1d213033-8184-4059-9ec2-5415e50c94dc.png)

具体可以去作者库中看一看详细信息（[jeffreytse/jekyll-spaceship](https://github.com/jeffreytse/jekyll-spaceship)）。

按照作者的使用说明(Installation 部分)配置后，发现还是不能搞定，仔细看说明发现作者做了声明：

Tip: Note that GitHub Pages runs in safe mode and only allows a set of whitelisted plugins. To use the gem in GitHub Pages, you need to build locally or use CI (e.g. travis, github workflow) and deploy to your gh-pages branch.
Additions for Unlimited GitHub Pages

Here is a GitHub Action named jekyll-deploy-action for Jekyll site deployment conveniently. 
Here is a Jekyll site using Travis to build and deploy to GitHub Pages for your references.

并给出了最优解决方案，[jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action)。但是需要通过Github Action功能先进行配置。以下为主要流程：

1. 在自己的博客库根目录下添加文件 --> .github/workflows/build-jekyll.yml
2. build-jekyll.yml中添加如下：
```
name: Build and Deploy to Github Pages

on:
  push:
    branches:
      - master  # Here source code branch is `master`, it could be other branch

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # Use GitHub Actions' cache to cache dependencies on servers
      - uses: actions/cache@v2
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gems-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gems-

      # Use GitHub Deploy Action to build and deploy to Github
      - uses: jeffreytse/jekyll-deploy-action@v0.3.1
        with:
          provider: 'github'
          token: ${{ secrets.GITHUB_TOKEN }} # It's your Personal Access Token(PAT)
          repository: ''             # Default is current repository
          branch: 'gh-pages'         # Default is gh-pages for github provider
          jekyll_src: './'           # Default is root directory
          jekyll_cfg: '_config.yml'  # Default is _config.yml
          jekyll_baseurl: ''         # Default is according to _config.yml
          bundler_ver: '>=0'         # Default is latest bundler version
          cname: ''                  # Default is to not use a cname
          actor: ''                  # Default is the GITHUB_ACTOR
          pre_build_commands: ''     # Installing additional dependencies (Arch Linux)
```

其中将branches下master改为自己的推送branch名。

3. 再进行新一轮push后，如果正确将自动添加一个新的branch名称为gh-pages。
4. 进入仓库设置，将默认页面改为gh-pages。




