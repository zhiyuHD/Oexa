/**
 * Oexa 类型定义
 */

// 站点配置
export interface SiteConfig {
  title: string
  subtitle: string
  description: string
  author: string
  email: string
  url: string
  language: string
  timezone: string
}

// 主题配置
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
}

// 导航项
export interface NavItem {
  name: string
  path: string
  icon: string
}

// 社交链接
export interface SocialLink {
  name: string
  icon: string
  url: string
}

// 文章配置
export interface PostConfig {
  defaultLayout: string
  permalink: string
  perPage: number
  showReadingTime: boolean
  showWordCount: boolean
  showToc: boolean
  tocDepth: number
  defaultCover: string
  excerptLength: number
}

// 首页配置
export interface HomeConfig {
  hero: {
    title: string
    subtitle: string
    background: string
    showActions: boolean
  }
  recentPosts: number
  showTags: boolean
  tagCloudCount: number
}

// 页脚配置
export interface FooterConfig {
  since: number
  icp: string
  customHtml: string
}

// 功能开关
export interface FeaturesConfig {
  search: boolean
  comment: boolean
  share: boolean
  rss: boolean
  sitemap: boolean
  analytics: {
    enabled: boolean
    id: string
  }
}

// Markdown 配置
export interface MarkdownConfig {
  hexoTags: boolean
  math: boolean
  mermaid: boolean
  highlightTheme: string
  footnotes: boolean
  taskLists: boolean
}

// 目录配置
export interface DirsConfig {
  posts: string
  drafts: string
  public: string
  themes: string
}

// 部署配置
export interface DeployConfig {
  type: 'github-pages' | 'vercel' | 'netlify' | 'custom'
  github: {
    repo: string
    branch: string
  }
}

// 完整配置
export interface Config {
  site: SiteConfig
  theme: ThemeConfig
  nav: NavItem[]
  social: SocialLink[]
  post: PostConfig
  home: HomeConfig
  footer: FooterConfig
  features: FeaturesConfig
  markdown: MarkdownConfig
  dirs: DirsConfig
  deploy: DeployConfig
}

// 文章元数据
export interface PostMeta {
  title: string
  date: string
  categories?: string[]
  tags?: string[]
  description?: string
  cover?: string
  keywords?: string[]
  author?: string
  slug: string
  permalink: string
  readingTime?: number
  wordCount?: number
}

// 文章
export interface Post extends PostMeta {
  content: string
  excerpt: string
  toc?: TocItem[]
}

// 目录项
export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}

// 标签
export interface Tag {
  name: string
  count: number
  posts: string[]
}

// 分类
export interface Category {
  name: string
  count: number
  posts: string[]
  children?: Category[]
}

// 归档
export interface Archive {
  year: number
  months: {
    month: number
    posts: PostMeta[]
  }[]
}

// 文章索引
export interface PostIndex {
  posts: PostMeta[]
  tags: Tag[]
  categories: Category[]
  archives: Archive[]
}
