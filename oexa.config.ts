/**
 * Oexa 博客配置文件
 * 支持自定义网站信息、主题、导航、社交链接等
 */

export default {
  // ==================== 网站信息 ====================
  site: {
    title: 'Oexa Blog',
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
    // 主题模式: 'light' | 'dark' | 'auto'
    mode: 'dark' as const,
    // 主色调 (MDUI 支持: primary, secondary, tertiary, error, etc.)
    primaryColor: '#6750A4',
    // 圆角大小
    borderRadius: 'medium' as const, // 'none' | 'small' | 'medium' | 'large' | 'full'
  },

  // ==================== 导航设置 ====================
  nav: [
    { name: '主页', path: '/', icon: 'home' },
    { name: '文章', path: '/#/posts', icon: 'article' },
    { name: '标签', path: '/#/tags', icon: 'label' },
    { name: '归档', path: '/#/archives', icon: 'archive' },
    { name: '关于', path: '/#/about', icon: 'person' },
  ],

  // ==================== 社交链接 ====================
  social: [
    { name: 'GitHub', icon: 'code', url: 'https://github.com' },
    { name: 'Twitter', icon: 'chat', url: 'https://twitter.com' },
    { name: 'Email', icon: 'mail', url: 'mailto:example@example.com' },
    // 更多图标: https://fonts.google.com/icons
  ],

  // ==================== 文章设置 ====================
  post: {
    // 文章默认布局
    defaultLayout: 'post',
    // 文章链接格式 (:year, :month, :day, :title, :slug, :categories, :hash)
    permalink: '/#/posts/:slug',
    // 每页显示文章数
    perPage: 10,
    // 显示阅读时间
    showReadingTime: true,
    // 显示字数统计
    showWordCount: true,
    // 显示文章目录
    showToc: true,
    // 目录层级深度
    tocDepth: 3,
    // 默认封面图
    defaultCover: '',
    // 文章摘要长度
    excerptLength: 200,
  },

  // ==================== 首页设置 ====================
  home: {
    // Hero 区域
    hero: {
      title: '欢迎来到我的博客',
      subtitle: '记录生活，分享技术',
      background: '', // 背景图片 URL
      showActions: true,
    },
    // 显示最新文章数量
    recentPosts: 5,
    // 显示标签云
    showTags: true,
    // 标签云数量
    tagCloudCount: 20,
  },

  // ==================== 页脚设置 ====================
  footer: {
    // 建站年份
    since: 2024,
    // 备案号
    icp: '',
    // 自定义页脚 HTML
    customHtml: '',
  },

  // ==================== 功能开关 ====================
  features: {
    // 搜索功能
    search: true,
    // 评论功能 (需要配置评论服务)
    comment: false,
    // 文章分享
    share: true,
    // RSS 订阅
    rss: false,
    // 站点地图
    sitemap: true,
    // Google Analytics
    analytics: {
      enabled: false,
      id: '',
    },
  },

  // ==================== Markdown 设置 ====================
  markdown: {
    // 启用 Hexo 标签插件
    hexoTags: true,
    // 启用数学公式 (KaTeX)
    math: true,
    // 启用 Mermaid 图表
    mermaid: false,
    // 代码高亮主题
    highlightTheme: 'github-dark',
    // 启用脚注
    footnotes: true,
    // 启用任务列表
    taskLists: true,
  },

  // ==================== 目录设置 ====================
  dirs: {
    // 文章目录
    posts: 'posts',
    // 草稿目录
    drafts: 'drafts',
    // 静态资源目录
    public: 'public',
    // 主题目录
    themes: 'themes',
  },

  // ==================== 部署设置 ====================
  deploy: {
    // 部署类型: 'github-pages' | 'vercel' | 'netlify' | 'custom'
    type: 'github-pages' as const,
    // GitHub Pages 设置
    github: {
      repo: '',
      branch: 'gh-pages',
    },
  },
}

// 类型导出
export type Config = typeof import('./oexa.config')
