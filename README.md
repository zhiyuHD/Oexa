# Oexa

一个基于 Vue 3 + Vite 的静态博客生成器，支持 Hexo 语法兼容。

## 特性

- 🚀 基于 Vite 构建，开发体验极佳
- 🎨 使用 MDUI 组件库，Material Design 风格
- 📝 支持 Markdown 写作，兼容 Hexo 标签语法
- 🏷️ 支持标签和分类
- 📅 支持归档页面
- 🔍 支持文章搜索
- ⚙️ 灵活的配置系统
- 📱 响应式设计，支持桌面端和移动端

## 快速开始

### 安装依赖

```sh
npm install
```

### 开发模式

```sh
npm run dev
```

### 构建生产版本

```sh
npm run build
```

### 预览构建结果

```sh
npm run preview
```

## 配置文件

在项目根目录创建 `oexa.config.ts` 文件进行配置：

```typescript
export default {
  // 网站信息
  site: {
    title: '我的博客',
    subtitle: '记录生活，分享技术',
    description: '一个基于 Vue 3 + Vite 的静态博客',
    author: '博主',
    email: 'example@example.com',
    url: 'https://example.com',
  },

  // 主题设置
  theme: {
    mode: 'dark', // 'light' | 'dark' | 'auto'
    primaryColor: '#6750A4',
  },

  // 导航菜单
  nav: [
    { name: '主页', path: '/', icon: 'home' },
    { name: '文章', path: '/posts', icon: 'article' },
    { name: '标签', path: '/tags', icon: 'label' },
    { name: '归档', path: '/archives', icon: 'archive' },
    { name: '关于', path: '/about', icon: 'person' },
  ],

  // 社交链接
  social: [
    { name: 'GitHub', icon: 'code', url: 'https://github.com' },
    { name: 'Twitter', icon: 'chat', url: 'https://twitter.com' },
    { name: 'Email', icon: 'mail', url: 'mailto:example@example.com' },
  ],

  // 文章设置
  post: {
    permalink: '/posts/:slug', // 文章链接格式
    perPage: 10, // 每页文章数
    showReadingTime: true, // 显示阅读时间
    showWordCount: true, // 显示字数统计
    showToc: true, // 显示目录
    excerptLength: 200, // 摘要长度
  },

  // 首页设置
  home: {
    hero: {
      title: '欢迎来到我的博客',
      subtitle: '记录生活，分享技术',
    },
    recentPosts: 5, // 显示最新文章数量
    showTags: true, // 显示标签云
  },

  // 页脚设置
  footer: {
    since: 2024, // 建站年份
    icp: '', // 备案号
  },
}
```

## 文章格式

### Frontmatter

```yaml
---
title: 文章标题
date: 2026-02-23
categories:
  - 前端
  - Vue
tags:
  - Vue 3
  - TypeScript
description: 文章描述
cover: /images/cover.jpg
keywords:
  - 关键词1
  - 关键词2
author: 作者名
---
```

### Permalink 格式

支持以下占位符：

| 占位符 | 说明 |
|--------|------|
| `:year` | 发布年份 |
| `:month` | 发布月份 |
| `:day` | 发布日期 |
| `:title` | 文章标题 |
| `:slug` | 文件名（不含扩展名） |
| `:categories` | 分类路径 |
| `:hash` | 文件名哈希值 |

## Hexo 标签兼容

Oexa 支持大部分 Hexo 标签语法，方便从 Hexo 迁移。

### 引用块

```markdown
{% blockquote 作者名, 来源 %}
引用内容
{% endblockquote %}
```

### 代码块

```markdown
{% codeblock 标题 lang:javascript line_number:true %}
代码内容
{% endcodeblock %}
```

### 图片

```markdown
{% img /path/to/image.jpg 图片描述 %}
```

### 链接

```markdown
{% link 链接文字 https://example.com true %}
```

### 文章引用

```markdown
{% post_link article-slug 显示标题 %}
```

### 折叠内容

```markdown
{% fold 点击展开 %}
折叠的内容
{% endfold %}

{% fold 默认展开 open:true %}
默认展开的内容
{% endfold %}
```

### Note 提示框

```markdown
{% note primary %}
主要提示
{% endnote %}

{% note success %}
成功提示
{% endnote %}

{% note warning %}
警告提示
{% endnote %}

{% note danger %}
危险提示
{% endnote %}
```

### Label 标签

```markdown
这是一个 {% label primary@主要标签 %}
```

### 按钮

```markdown
{% button /posts 浏览文章 article %}
```

### 文章摘要

```markdown
摘要内容...

<!-- more -->

正文内容...
```

## 目录结构

```
oexa/
├── oexa.config.ts      # 配置文件
├── posts/              # 文章目录
│   ├── hello-world.md
│   └── ...
├── public/             # 静态资源
│   ├── posts/          # 生成的文章数据
│   │   ├── index.json
│   │   ├── tags.json
│   │   ├── categories.json
│   │   └── archives.json
│   └── config.json     # 站点配置
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── pages/          # 页面组件
│   ├── components/     # 通用组件
│   ├── composables/    # 组合式函数
│   ├── router/         # 路由配置
│   ├── assets/         # 静态资源
│   └── build/          # 构建脚本
│       ├── generate.ts # 文章生成脚本
│       ├── config.ts   # 配置加载
│       └── hexo-tags.ts # Hexo 标签处理
└── package.json
```

## 从 Hexo 迁移

1. 将 Hexo 的 `source/_posts` 目录中的 Markdown 文件复制到 `posts/` 目录
2. 根据需要调整 `oexa.config.ts` 配置
3. 运行 `npm run generate` 生成文章数据
4. 运行 `npm run dev` 预览效果

## 技术栈

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vue Router](https://router.vuejs.org/) - Vue.js 官方路由
- [MDUI](https://www.mdui.org/) - Material Design UI 组件库
- [marked](https://marked.js.org/) - Markdown 解析器
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

## License

MIT