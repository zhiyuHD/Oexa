/**
 * 运行时配置
 * 从 /config.json 加载站点配置
 */

import { ref, readonly } from 'vue'

// 默认配置（作为后备）
const defaultConfig = {
  site: {
    title: 'Oexa Blog',
    subtitle: '记录生活，分享技术',
    description: '一个基于 Vue 3 + Vite 的静态博客',
    author: '博主',
    email: 'example@example.com',
    url: 'https://example.com',
    language: 'zh-CN',
  },
  theme: {
    mode: 'dark' as const,
    primaryColor: '#6750A4',
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
    showReadingTime: true,
    showWordCount: true,
    showToc: true,
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
  },
  features: {
    search: true,
    comment: false,
    share: true,
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

export type RuntimeConfig = typeof defaultConfig

// 配置状态
const config = ref<RuntimeConfig>(defaultConfig)
const loading = ref(true)
const error = ref<Error | null>(null)

/**
 * 加载配置
 */
async function loadConfig(): Promise<void> {
  try {
    const res = await fetch('/config.json')
    if (!res.ok) {
      throw new Error(`Failed to load config: ${res.status}`)
    }
    const data = await res.json()
    config.value = { ...defaultConfig, ...data }
    
    // 应用主题
    applyTheme(config.value.theme)
    
    // 更新页面标题
    document.title = config.value.site.title
  } catch (e) {
    console.error('Failed to load config:', e)
    error.value = e as Error
  } finally {
    loading.value = false
  }
}

/**
 * 应用主题设置
 */
function applyTheme(theme: ThemeConfig): void {
  const html = document.documentElement
  
  // 设置主题模式
  if (theme.mode === 'dark') {
    html.classList.add('mdui-theme-dark')
    html.classList.remove('mdui-theme-light')
  } else if (theme.mode === 'light') {
    html.classList.add('mdui-theme-light')
    html.classList.remove('mdui-theme-dark')
  } else {
    // auto: 跟随系统
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      html.classList.add('mdui-theme-dark')
      html.classList.remove('mdui-theme-light')
    } else {
      html.classList.add('mdui-theme-light')
      html.classList.remove('mdui-theme-dark')
    }
  }
  
  // 设置主色调
  if (theme.primaryColor) {
    html.style.setProperty('--mdui-color-primary', theme.primaryColor)
  }
}

// 初始化加载配置
if (typeof window !== 'undefined') {
  loadConfig()
}

/**
 * 使用配置
 */
export function useConfig() {
  return {
    config: readonly(config),
    loading: readonly(loading),
    error: readonly(error),
    reload: loadConfig,
  }
}

/**
 * 获取站点信息
 */
export function useSite() {
  return {
    site: readonly(ref(config.value.site)),
  }
}

/**
 * 获取导航配置
 */
export function useNav() {
  return {
    nav: readonly(ref(config.value.nav)),
  }
}

/**
 * 获取社交链接
 */
export function useSocial() {
  return {
    social: readonly(ref(config.value.social)),
  }
}

/**
 * 获取首页配置
 */
export function useHome() {
  return {
    home: readonly(ref(config.value.home)),
  }
}

/**
 * 获取页脚配置
 */
export function useFooter() {
  return {
    footer: readonly(ref(config.value.footer)),
  }
}

export { defaultConfig }
