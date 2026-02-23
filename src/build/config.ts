/**
 * 配置加载器
 * 用于构建时和运行时加载配置
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../..')

// 默认配置
const defaultConfig = {
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
  theme: {
    mode: 'dark' as const,
    primaryColor: '#6750A4',
    borderRadius: 'medium' as const,
  },
  nav: [
    { name: '主页', path: '/', icon: 'home' },
    { name: '文章', path: '/posts', icon: 'article' },
    { name: '标签', path: '/tags', icon: 'label' },
    { name: '关于', path: '/about', icon: 'person' },
  ],
  social: [
    { name: 'GitHub', icon: 'code', url: 'https://github.com' },
    { name: 'Twitter', icon: 'chat', url: 'https://twitter.com' },
    { name: 'Email', icon: 'mail', url: 'mailto:example@example.com' },
  ],
  post: {
    defaultLayout: 'post',
    permalink: '/posts/:slug',
    perPage: 10,
    showReadingTime: true,
    showWordCount: true,
    showToc: true,
    tocDepth: 3,
    defaultCover: '',
    excerptLength: 200,
  },
  home: {
    hero: {
      title: '欢迎来到我的博客',
      subtitle: '记录生活，分享技术',
      background: '',
      showActions: true,
    },
    recentPosts: 5,
    showTags: true,
    tagCloudCount: 20,
  },
  footer: {
    since: 2024,
    icp: '',
    customHtml: '',
  },
  features: {
    search: true,
    comment: false,
    share: true,
    rss: false,
    sitemap: true,
    analytics: {
      enabled: false,
      id: '',
    },
  },
  markdown: {
    hexoTags: true,
    math: true,
    mermaid: false,
    highlightTheme: 'github-dark',
    footnotes: true,
    taskLists: true,
  },
  dirs: {
    posts: 'posts',
    drafts: 'drafts',
    public: 'public',
    themes: 'themes',
  },
  deploy: {
    type: 'github-pages' as const,
    github: {
      repo: '',
      branch: 'gh-pages',
    },
  },
}

export type SiteConfig = typeof defaultConfig.site
export type ThemeConfig = typeof defaultConfig.theme
export type NavItem = typeof defaultConfig.nav[0]
export type SocialItem = typeof defaultConfig.social[0]
export type PostConfig = typeof defaultConfig.post
export type HomeConfig = typeof defaultConfig.home
export type FooterConfig = typeof defaultConfig.footer
export type FeaturesConfig = typeof defaultConfig.features
export type MarkdownConfig = typeof defaultConfig.markdown
export type DirsConfig = typeof defaultConfig.dirs
export type DeployConfig = typeof defaultConfig.deploy

export type Config = typeof defaultConfig

/**
 * 深度合并对象
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null
      ) {
        result[key] = deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>]
      }
    }
  }
  return result
}

/**
 * 加载配置文件（构建时使用）
 */
export async function loadConfig(): Promise<Config> {
  const configPath = path.join(rootDir, 'oexa.config.ts')
  
  if (!fs.existsSync(configPath)) {
    console.log('⚠️  未找到 oexa.config.ts，使用默认配置')
    return defaultConfig
  }
  
  try {
    // 动态导入配置文件
    const configModule = await import(configPath)
    const userConfig = configModule.default || configModule
    
    // 深度合并配置
    return deepMerge(defaultConfig, userConfig)
  } catch (e) {
    console.error('❌ 加载配置文件失败:', e)
    return defaultConfig
  }
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): Config {
  return defaultConfig
}

export { rootDir }
