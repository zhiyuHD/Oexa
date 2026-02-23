# Oexa

一个基于 Vue 3 + Vite 的静态博客生成器，支持 Hexo 语法兼容。

## 快速开始

### 创建新项目

```sh
# 使用 npm
npm create oexa

# 使用 npx
npx create-oexa

# 指定项目名
npm create oexa my-blog
```

### 项目命令

```sh
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 生成文章数据
npm run generate

# 创建新文章
npx oexa new "文章标题"
```

## 写文章

在 `posts/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2026-02-23
categories:
  - 前端
tags:
  - Vue
  - TypeScript
description: 文章描述
---

文章内容...
```

## 配置

编辑 `oexa.config.ts` 自定义站点信息、主题、导航等。

## 特性

- 🚀 基于 Vite 构建，开发体验极佳
- 🎨 使用 MDUI 组件库，Material Design 风格
- 📝 支持 Markdown 写作，兼容 Hexo 标签语法
- 🏷️ 支持标签和分类
- 📅 支持归档页面
- 🔍 支持文章搜索
- ⚙️ 灵活的配置系统
- 📱 响应式设计

## License

MIT
