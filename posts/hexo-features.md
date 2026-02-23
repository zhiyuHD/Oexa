---
title: Hexo 语法兼容示例
date: 2026-02-20
categories:
  - 教程
tags:
  - Hexo
  - Markdown
  - Oexa
description: 展示 Oexa 对 Hexo 标签插件的兼容支持，帮助你从 Hexo 无缝迁移。
cover: https://picsum.photos/800/400
keywords:
  - Hexo迁移
  - 博客
---

# Hexo 语法兼容示例

本文展示 Oexa 对 Hexo 标签插件的兼容支持。

## 引用块

{% blockquote 张三 《某本书》 %}
这是一段引用文字，可以包含作者和来源信息。
{% endblockquote %}

## 代码块

{% codeblock JavaScript lang:javascript line_number:true %}
function hello(name) {
  console.log(`Hello, ${name}!`);
}

hello('Oexa');
{% endcodeblock %}

## 图片

{% img /assets/example.jpg 这是一张示例图片 %}

## 链接

{% link 访问 GitHub https://github.com true %}

## 文章引用

{% post_link hello-world 查看第一篇文章 %}

## 折叠内容

{% fold 点击展开更多内容 %}
这里是折叠的内容，默认是收起状态。

可以包含多行文字，甚至代码：

```javascript
const foo = 'bar';
```
{% endfold %}

{% fold 默认展开 open:true %}
这个折叠块默认是展开的。
{% endfold %}

## Note 提示框

{% note primary %}
这是一个主要提示框。
{% endnote %}

{% note success %}
这是一个成功提示框。
{% endnote %}

{% note warning %}
这是一个警告提示框。
{% endnote %}

{% note danger %}
这是一个危险提示框。
{% endnote %}

{% note info no-icon %}
这是一个没有图标的提示框。
{% endnote %}

## Label 标签

这是一个 {% label primary@主要标签 %} 和 {% label danger@危险标签 %}，还有 {% label success@成功标签 %}。

## 按钮

{% button /posts 浏览文章 article %}

## 视频

{% video https://example.com/video.mp4 video/mp4 %}

## 文章摘要

<!-- more -->

在 `<!-- more -->` 之前的内容会作为文章摘要显示在列表页。

## 更多功能

Oexa 还支持：

- 数学公式（KaTeX）
- 代码高亮
- 任务列表
- 脚注
- 表格

### 表格示例

| 功能 | 状态 | 说明 |
|------|------|------|
| Markdown | ✅ | 完整支持 |
| Hexo 标签 | ✅ | 大部分兼容 |
| 数学公式 | ✅ | KaTeX |
| 代码高亮 | ✅ | 多主题 |

### 任务列表示例

- [x] 支持 Hexo 标签
- [x] 支持配置文件
- [x] 支持分类和标签
- [ ] 支持评论系统
- [ ] 支持 RSS

### 脚注示例

这是一个脚注引用[^1]，还有另一个[^2]。

[^1]: 这是第一个脚注的内容。
[^2]: 这是第二个脚注的内容。

## 总结

Oexa 致力于提供与 Hexo 兼容的写作体验，让你可以轻松迁移现有博客。
