/**
 * 博客文章生成脚本
 * 解析 posts/ 目录下的 Markdown 文件，生成 JSON 数据
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadConfig, rootDir } from './config.js'
import { processHexoTags, extractExcerpt } from './hexo-tags.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Frontmatter {
  title?: string
  date?: string
  updated?: string
  categories?: string | string[]
  tags?: string[]
  description?: string
  keywords?: string[]
  author?: string
  cover?: string
  thumbnail?: string
  layout?: string
  comments?: boolean
  toc?: boolean
  [key: string]: unknown
}

interface Post {
  slug: string
  url: string
  title: string
  date: string
  updated: string
  categories: string[]
  tags: string[]
  description: string
  keywords: string[]
  author: string
  cover?: string
  readingTime?: number
  wordCount?: number
  layout: string
  comments: boolean
  toc: boolean
  content: string
  raw: string
}

interface PostMeta {
  slug: string
  title: string
  date: string
}

/**
 * 解析 Markdown 文件的 frontmatter
 */
function parseFrontmatter(content: string): { frontmatter: Frontmatter; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { frontmatter: {}, content }
  }
  
  const frontmatterStr = match[1]
  const body = match[2]
  const frontmatter: Frontmatter = {}
  
  // 简单的 YAML 解析
  let currentKey: string | null = null
  let isArray = false
  let arrayItems: string[] = []
  let isMultilineString = false
  let multilineKey: string | null = null
  let multilineValue: string[] = []
  
  for (const line of frontmatterStr!.split('\n')) {
    // 处理多行字符串
    if (isMultilineString) {
      if (line === '  ' + multilineKey + ': |' || line.startsWith('  ')) {
        if (line.trim() === '') {
          multilineValue.push('')
        } else {
          multilineValue.push(line.substring(2))
        }
        continue
      } else {
        if (multilineKey) {
          frontmatter[multilineKey] = multilineValue.join('\n')
        }
        isMultilineString = false
        multilineKey = null
        multilineValue = []
      }
    }
    
    // 数组项
    if (line.match(/^  - (.+)$/)) {
      if (isArray) {
        arrayItems.push(line.replace(/^  - /, ''))
      }
      continue
    }
    
    // 键值对
    const kvMatch: RegExpMatchArray | null = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      // 保存之前的数组
      if (currentKey && isArray) {
        frontmatter[currentKey] = arrayItems
        arrayItems = []
        isArray = false
      }
      
      const key: string = kvMatch[1]!
      let value: string | boolean | number = kvMatch[2]!
      
      // 检查是否是数组开始
      if (value === '') {
        currentKey = key
        isArray = true
        arrayItems = []
      } else if (typeof value === 'string' && (value === '|' || value.startsWith('|'))) {
        // 多行字符串
        isMultilineString = true
        multilineKey = key
        multilineValue = []
      } else {
        // 解析值
        if (value === 'true') value = true
        else if (value === 'false') value = false
        else if (!isNaN(Number(value)) && value !== '') value = Number(value)
        else if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        }
        else if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1)
        }
        
        frontmatter[key] = value
        currentKey = null
        isArray = false
      }
    }
  }
  
  // 保存最后的数组或多行字符串
  if (currentKey && isArray) {
    frontmatter[currentKey] = arrayItems
  }
  if (isMultilineString && multilineKey) {
    frontmatter[multilineKey] = multilineValue.join('\n')
  }
  
  return { frontmatter, content: body! }
}

/**
 * 从文件名生成 slug
 */
function generateSlug(filename: string): string {
  return filename.replace(/\.md$/, '')
}

/**
 * 计算阅读时间（按字数估算）
 */
function calculateReadingTime(content: string): number {
  // 中文约 400 字/分钟，英文约 200 词/分钟
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  const totalMinutes = Math.ceil(chineseChars / 400 + englishWords / 200)
  return Math.max(1, totalMinutes)
}

/**
 * 计算字数
 */
function calculateWordCount(content: string): number {
  // 中文按字数，英文按词数
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
}

/**
 * 生成文章摘要
 */
function generateExcerpt(content: string, length = 200): string {
  // 先检查是否有手动设置的摘要
  const manualExcerpt = extractExcerpt(content)
  if (manualExcerpt && manualExcerpt.length < content.length) {
    content = manualExcerpt
  }
  
  // 移除 Markdown 语法
  let text = content
    .replace(/^#+\s+/gm, '') // 标题
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 粗体
    .replace(/\*([^*]+)\*/g, '$1') // 斜体
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 图片
    .replace(/\$\$[\s\S]*?\$\$/g, '') // 块级公式
    .replace(/\$([^$]+)\$/g, '$1') // 行内公式
    .replace(/<[^>]+>/g, '') // HTML 标签
    .replace(/{%[\s\S]*?%}/g, '') // Hexo 标签
    .replace(/<!--[\s\S]*?-->/g, '') // HTML 注释
    .replace(/\n+/g, ' ') // 换行
    .trim()
  
  if (text.length > length) {
    text = text.substring(0, length) + '...'
  }
  
  return text
}

/**
 * 解析分类（支持层级）
 */
function parseCategories(categories?: string | string[]): string[] {
  if (!categories) return []
  if (typeof categories === 'string') {
    return categories.split('/').map(c => c.trim()).filter(Boolean)
  }
  return categories
}

/**
 * 生成文章 URL
 */
function generatePermalink(frontmatter: Frontmatter, slug: string, permalinkPattern: string): string {
  const date = new Date(frontmatter.date || Date.now())
  
  let url = permalinkPattern
    .replace(':year', date.getFullYear().toString())
    .replace(':month', (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace(':day', date.getDate().toString().padStart(2, '0'))
    .replace(':title', frontmatter.title || slug)
    .replace(':slug', slug)
    .replace(':hash', slug.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0).toString(16))
  
  // 处理分类
  if (url.includes(':categories')) {
    const categories = parseCategories(frontmatter.categories)
    url = url.replace(':categories', categories.join('/'))
  }
  
  return url
}

/**
 * 主函数
 */
async function generate() {
  console.log('🚀 开始生成博客文章数据...\n')
  
  // 加载配置
  const config = await loadConfig()
  console.log(`📝 网站标题: ${config.site.title}`)
  console.log(`👤 作者: ${config.site.author}\n`)
  
  const postsDir = path.join(rootDir, config.dirs.posts)
  const outputDir = path.join(rootDir, config.dirs.public, 'posts')
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // 读取 posts 目录
  if (!fs.existsSync(postsDir)) {
    console.log('⚠️  posts 目录不存在，创建中...')
    fs.mkdirSync(postsDir, { recursive: true })
    return
  }
  
  const files = fs.readdirSync(postsDir).filter((f: string) => f.endsWith('.md'))
  
  if (files.length === 0) {
    console.log('⚠️  没有找到 Markdown 文件')
    return
  }
  
  console.log(`📚 找到 ${files.length} 篇文章\n`)
  
  const posts: Post[] = []
  const categoriesMap: Record<string, PostMeta[]> = {}
  
  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { frontmatter, content: rawBody } = parseFrontmatter(rawContent)
    
    // 处理 Hexo 标签
    const content = config.markdown.hexoTags 
      ? processHexoTags(rawBody) 
      : rawBody
    
    const slug = generateSlug(file)
    const date = frontmatter.date || new Date().toISOString().split('T')[0]
    const categories = parseCategories(frontmatter.categories)
    
    // 生成 URL
    const url = generatePermalink(frontmatter, slug, config.post.permalink)
    
    const post: Post = {
      slug,
      url,
      title: frontmatter.title || slug,
      date: date!,
      updated: frontmatter.updated || frontmatter.date || date!,
      categories,
      tags: frontmatter.tags || [],
      description: frontmatter.description || generateExcerpt(content, config.post.excerptLength),
      keywords: frontmatter.keywords || [],
      author: frontmatter.author || config.site.author,
      layout: frontmatter.layout || config.post.defaultLayout,
      comments: frontmatter.comments !== false && config.features.comment,
      toc: frontmatter.toc !== false && config.post.showToc,
      content,
      raw: rawBody,
    }
    
    // 添加可选字段
    if (frontmatter.cover || frontmatter.thumbnail || config.post.defaultCover) {
      post.cover = frontmatter.cover || frontmatter.thumbnail || config.post.defaultCover
    }
    if (config.post.showReadingTime) {
      post.readingTime = calculateReadingTime(content)
    }
    if (config.post.showWordCount) {
      post.wordCount = calculateWordCount(content)
    }
    
    posts.push(post)
    
    // 构建分类索引
    for (const cat of categories) {
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = []
      }
      categoriesMap[cat].push({
        slug: post.slug,
        title: post.title,
        date: post.date,
      })
    }
    
    // 为每篇文章生成单独的 JSON 文件
    const outputPath = path.join(outputDir, `${slug}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(post, null, 2))
    console.log(`✅ 生成: ${post.title} -> posts/${slug}.json`)
  }
  
  // 按日期排序（最新的在前）
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // 生成文章索引
  const indexData = posts.map(({ content, raw, ...meta }) => meta)
  const indexPath = path.join(outputDir, 'index.json')
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2))
  console.log(`\n📋 生成文章索引: posts/index.json`)
  
  // 生成标签索引
  const tagsMap: Record<string, PostMeta[]> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagsMap[tag]) {
        tagsMap[tag] = []
      }
      tagsMap[tag].push({
        slug: post.slug,
        title: post.title,
        date: post.date,
      })
    }
  }
  const tagsPath = path.join(outputDir, 'tags.json')
  fs.writeFileSync(tagsPath, JSON.stringify(tagsMap, null, 2))
  console.log(`🏷️  生成标签索引: posts/tags.json`)
  
  // 生成分类索引
  const categoriesPath = path.join(outputDir, 'categories.json')
  fs.writeFileSync(categoriesPath, JSON.stringify(categoriesMap, null, 2))
  console.log(`📁 生成分类索引: posts/categories.json`)
  
  // 生成归档索引（按年月分组）
  const archivesMap: Record<string, Record<string, PostMeta[]>> = {}
  for (const post of posts) {
    const postDate = new Date(post.date)
    const year = postDate.getFullYear().toString()
    const month = (postDate.getMonth() + 1).toString().padStart(2, '0')
    
    if (!archivesMap[year]) {
      archivesMap[year] = {}
    }
    if (!archivesMap[year][month]) {
      archivesMap[year][month] = []
    }
    archivesMap[year][month].push({
      slug: post.slug,
      title: post.title,
      date: post.date,
    })
  }
  const archivesPath = path.join(outputDir, 'archives.json')
  fs.writeFileSync(archivesPath, JSON.stringify(archivesMap, null, 2))
  console.log(`📅 生成归档索引: posts/archives.json`)
  
  // 生成站点配置（供前端使用）
  const siteConfig = {
    site: config.site,
    theme: config.theme,
    nav: config.nav,
    social: config.social,
    post: {
      showReadingTime: config.post.showReadingTime,
      showWordCount: config.post.showWordCount,
      showToc: config.post.showToc,
    },
    home: config.home,
    footer: config.footer,
    features: config.features,
  }
  const configPath = path.join(rootDir, config.dirs.public, 'config.json')
  fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2))
  console.log(`⚙️  生成站点配置: config.json`)
  
  console.log(`\n✨ 完成！共处理 ${posts.length} 篇文章`)
}

generate().catch(console.error)
