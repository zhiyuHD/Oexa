/**
 * Oexa 博客配置文件
 * 文档: https://github.com/your-repo/oexa
 */

export default {
  // ==================== 网站信息 ====================
  site: {
    title: 'My Blog',
    subtitle: '记录生活，分享技术',
    description: '一个基于 Vue 3 + Vite 的静态博客',
    author: '博主',
    email: 'example@example.com',
    url: 'https://example.com',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
  },

  // ==================== 主题设置 ====================
  theme: {
    mode: 'auto' as const, // 'light' | 'dark' | 'auto'
    primaryColor: '#6750A4',
    borderRadius: 'medium' as const,
  },

  // ==================== 导航设置 ====================
  nav: [
    { name: '主页', path: '/', icon: 'home' },
    { name: '文章', path: '/posts', icon: 'article' },
    { name: '标签', path: '/tags', icon: 'label' },
    { name: '归档', path: '/archives', icon: 'archive' },
    { name: '关于', path: '/about', icon: 'person' },
  ],

  // ==================== 社交链接 ====================
  social: [
    { name: 'GitHub', icon: 'code', url: 'https://github.com' },
    { name: 'Email', icon: 'mail', url: 'mailto:example@example.com' },
  ],

  // ==================== 文章设置 ====================
  post: {
    permalink: '/posts/:slug',
    perPage: 10,
    showReadingTime: true,
    showWordCount: true,
    showToc: true,
    tocDepth: 3,
    excerptLength: 200,
  },

  // ==================== 首页设置 ====================
  home: {
    hero: {
      title: '欢迎来到我的博客',
      subtitle: '记录生活，分享技术',
    },
    recentPosts: 5,
    showTags: true,
  },

  // ==================== 页脚设置 ====================
  footer: {
    since: 2024,
    icp: '',
  },

  // ==================== 功能开关 ====================
  features: {
    search: true,
    comment: false,
    share: true,
    rss: false,
  },

  // ==================== Markdown 设置 ====================
  markdown: {
    hexoTags: true,
    math: true,
    mermaid: false,
    footnotes: true,
    taskLists: true,
  },
}
