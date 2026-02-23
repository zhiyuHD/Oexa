/**
 * Hexo 标签插件兼容层
 * 支持 Hexo 的常用标签语法
 */

/**
 * 解析标签参数
 * {% tagname param1 param2 key1=value1 key2=value2 %}
 *   content
 * {% endtagname %}
 */
function parseTagArgs(argsString: string): {
  args: string[]
  kwargs: Record<string, string>
} {
  const args: string[] = []
  const kwargs: Record<string, string> = {}
  
  // 匹配参数和键值对
  const regex = /(\w+)=["']([^"']*)["']|(\S+)/g
  let match
  
  while ((match = regex.exec(argsString)) !== null) {
    if (match[1] && match[2] !== undefined) {
      // 键值对
      kwargs[match[1]] = match[2]
    } else if (match[3]) {
      // 普通参数
      args.push(match[3])
    }
  }
  
  return { args, kwargs }
}

/**
 * 引用块标签
 * {% blockquote [author[, source]] [link] [link_text] %}
 *   content
 * {% endblockquote %}
 */
function blockquote(args: string, content?: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const author = params[0] || ''
  const source = params[1] || ''
  const link = kwargs.link || params[2] || ''
  const linkText = kwargs.link_text || params[3] || source
  
  let footer = ''
  if (author) {
    footer = `<footer><strong>${author}</strong>`
    if (link) {
      footer += `，<a href="${link}">${linkText || link}</a>`
    } else if (source) {
      footer += `，《${source}》`
    }
    footer += '</footer>'
  }
  
  return `<blockquote>${content ?? ''}${footer}</blockquote>`
}

/**
 * 代码块标签
 * {% codeblock [title] [lang:language] [line_number:true|false] [highlight:true|false] %}
 *   code
 * {% endcodeblock %}
 */
function codeblock(args: string, content?: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const title = params[0] || ''
  const lang = kwargs.lang || params[1] || ''
  const lineNumbers = kwargs.line_number !== 'false'
  
  const langClass = lang ? ` class="language-${lang}"` : ''
  const titleHtml = title ? `<div class="code-title">${title}</div>` : ''
  const lineNumClass = lineNumbers ? ' line-numbers' : ''
  
  return `<div class="code-block${lineNumClass}">${titleHtml}<pre><code${langClass}>${escapeHtml(content ?? '')}</code></pre></div>`
}

/**
 * 图片标签
 * {% img [class names] /path/to/image [width] [height] "title text" 'alt text' %}
 */
function img(args: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const className = kwargs.class || params[0] || ''
  const src = kwargs.src || params.find(p => p.startsWith('/') || p.startsWith('http')) || ''
  const width = kwargs.width || params.find(p => /^\d+$/.test(p)) || ''
  const height = kwargs.height || ''
  const title = kwargs.title || ''
  const alt = kwargs.alt || ''
  
  const classAttr = className ? ` class="${className}"` : ''
  const widthAttr = width ? ` width="${width}"` : ''
  const heightAttr = height ? ` height="${height}"` : ''
  const titleAttr = title ? ` title="${title}"` : ''
  const altAttr = alt ? ` alt="${alt}"` : ''
  
  return `<img src="${src}"${classAttr}${widthAttr}${heightAttr}${titleAttr}${altAttr} loading="lazy">`
}

/**
 * 链接标签
 * {% link text url [external] [title] %}
 */
function link(args: string, content?: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const text = params[0] || content || ''
  const url = params[1] || kwargs.url || ''
  const external = params[2] === 'true' || kwargs.external === 'true'
  const title = kwargs.title || params[3] || ''
  
  const externalAttr = external ? ' target="_blank" rel="noopener noreferrer"' : ''
  const titleAttr = title ? ` title="${title}"` : ''
  
  return `<a href="${url}"${titleAttr}${externalAttr}>${text}</a>`
}

/**
 * 引用文章标签
 * {% post_path slug %}
 * {% post_link slug [title] [escape:false] %}
 */
function postLink(args: string): string {
  const { args: params } = parseTagArgs(args)
  const slug = params[0] || ''
  const title = params[1] || ''
  const escape = params[2] !== 'false'
  
  const displayTitle = escape ? escapeHtml(title || slug) : (title || slug)
  return `<a href="/posts/${slug}">${displayTitle}</a>`
}

/**
 * 资源引用标签
 * {% asset_path slug %}
 * {% asset_img slug [title] %}
 * {% asset_link slug [title] [escape:false] %}
 */
function assetImg(args: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const slug = params[0] || ''
  const title = kwargs.title || params[1] || ''
  const alt = kwargs.alt || title
  
  return `<img src="/assets/${slug}" alt="${alt}" title="${title}" loading="lazy">`
}

/**
 * 文本居中引用
 * {% centerquote %}内容{% endcenterquote %}
 */
function centerquote(args: string, content?: string): string {
  return `<blockquote class="center-quote">${content ?? ''}</blockquote>`
}

/**
 * 高亮文本
 * {% highlight [title] [lang:language] [line_number:true|false] [line_threshold:0] %}
 *   code
 * {% endhighlight %}
 */
function highlight(args: string, content?: string): string {
  return codeblock(args, content)
}

/**
 * 折叠块
 * {% fold [title] [open:false] %}内容{% endfold %}
 */
function fold(args: string, content?: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const title = params[0] || '点击展开'
  const open = kwargs.open === 'true' || params[1] === 'open'
  
  const openAttr = open ? ' open' : ''
  return `<details${openAttr}><summary>${title}</summary><div class="fold-content">${content ?? ''}</div></details>`
}

/**
 * 标签卡
 * {% tabs name, [index] %}
 *   <!-- tab [name] [icon] -->
 *   content
 *   <!-- endtab -->
 * {% endtabs %}
 */
function tabs(args: string, content?: string): string {
  const { args: params } = parseTagArgs(args)
  const name = params[0] || 'tabs'
  const defaultIndex = parseInt(params[1] ?? '1') || 1
  
  // 解析各个 tab
  const tabRegex = /<!--\s*tab\s+([^\[]+?)\s*(?:\[([^\]]+)\])?\s*-->([\s\S]*?)<!--\s*endtab\s*-->/g
  const tabsList: { name: string; icon: string; content: string }[] = []
  let match
  
  while ((match = tabRegex.exec(content ?? '')) !== null) {
    tabsList.push({
      name: match[1]!.trim(),
      icon: match[2] ?? '',
      content: match[3]!.trim(),
    })
  }
  
  if (tabsList.length === 0) return content ?? ''
  
  let html = `<div class="tabs" data-tabs="${name}">`
  html += '<div class="tabs-nav">'
  tabsList.forEach((tab, index) => {
    const active = index === defaultIndex - 1 ? ' active' : ''
    const iconHtml = tab.icon ? `<span class="tab-icon">${tab.icon}</span>` : ''
    html += `<button class="tab-btn${active}" data-index="${index}">${iconHtml}${tab.name}</button>`
  })
  html += '</div>'
  html += '<div class="tabs-content">'
  tabsList.forEach((tab, index) => {
    const active = index === defaultIndex - 1 ? ' active' : ''
    html += `<div class="tab-panel${active}" data-index="${index}">${tab.content}</div>`
  })
  html += '</div></div>'
  
  return html
}

/**
 * 按钮标签
 * {% button url text [icon] [class:class_name] %}
 */
function button(args: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const url = params[0] || kwargs.url || '#'
  const text = params[1] || kwargs.text || 'Button'
  const icon = kwargs.icon || params[2] || ''
  const className = kwargs.class || ''
  
  const iconHtml = icon ? `<span class="btn-icon">${icon}</span>` : ''
  const classAttr = className ? ` class="${className}"` : ''
  
  return `<a href="${url}" class="btn${classAttr}">${iconHtml}${text}</a>`
}

/**
 * Note 标签
 * {% note [class] [no-icon] %}
 *   content
 * {% endnote %}
 */
function note(args: string, content?: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const className = params[0] || 'default'
  const noIcon = params.includes('no-icon') || kwargs.icon === 'false'
  const title = kwargs.title || ''
  
  const iconMap: Record<string, string> = {
    default: 'info',
    primary: 'info',
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    danger: 'error',
  }
  
  const icon = iconMap[className] || 'info'
  const iconHtml = noIcon ? '' : `<span class="note-icon"><mdui-icon name="${icon}"></mdui-icon></span>`
  const titleHtml = title ? `<div class="note-title">${title}</div>` : ''
  
  return `<div class="note note-${className}">${iconHtml}<div class="note-content">${titleHtml}${content ?? ''}</div></div>`
}

/**
 * Label 标签
 * {% label [class]@text %}
 */
function label(args: string): string {
  const match = args.match(/(\w+)?@(.+)/)
  if (!match) return args
  
  const className = match[1] || 'default'
  const text = match[2]
  
  return `<span class="label label-${className}">${text}</span>`
}

/**
 * 视频标签
 * {% video url [type] [width] [height] %}
 */
function video(args: string): string {
  const { args: params, kwargs } = parseTagArgs(args)
  const url = params[0] || kwargs.url || ''
  const type = kwargs.type || params[1] || 'video/mp4'
  const width = kwargs.width || ''
  const height = kwargs.height || ''
  
  const widthAttr = width ? ` width="${width}"` : ''
  const heightAttr = height ? ` height="${height}"` : ''
  
  return `<video controls${widthAttr}${heightAttr}><source src="${url}" type="${type}"></video>`
}

/**
 * HTML 转义
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, m => map[m]!)
}

/**
 * 标签处理器映射
 */
const tagProcessors: Record<string, (args: string, content?: string) => string> = {
  blockquote,
  quote: blockquote,
  codeblock,
  code: codeblock,
  highlight,
  img,
  image: img,
  link,
  post_link: postLink,
  postlink: postLink,
  asset_img: assetImg,
  asset_image: assetImg,
  centerquote,
  cq: centerquote,
  fold,
  tabs,
  button,
  btn: button,
  note,
  label,
  video,
}

/**
 * 处理 Hexo 标签
 */
export function processHexoTags(content: string): string {
  let result = content
  
  // 处理块级标签 {% tagname args %}content{% endtagname %}
  const blockTagRegex = /{%\s*(\w+)\s+([^%]*?)\s*%}([\s\S]*?){%\s*end\1\s*%}/g
  result = result.replace(blockTagRegex, (match, tagName, args, tagContent) => {
    const processor = tagProcessors[tagName.toLowerCase()]
    if (processor) {
      return processor(args.trim(), tagContent.trim())
    }
    return match
  })
  
  // 处理行内标签 {% tagname args %}
  const inlineTagRegex = /{%\s*(\w+)\s+([^%]*?)\s*%}/g
  result = result.replace(inlineTagRegex, (match, tagName, args) => {
    const processor = tagProcessors[tagName.toLowerCase()]
    if (processor) {
      return processor(args.trim())
    }
    return match
  })
  
  // 处理 <!-- more --> 标记
  result = result.replace(/<!--\s*more\s*-->/g, '<div class="read-more-break"></div>')
  
  // 处理 <!-- excerpt --> 标记
  result = result.replace(/<!--\s*excerpt\s*-->/g, '<div class="excerpt-break"></div>')
  
  return result
}

/**
 * 提取摘要（在 more 标记之前的内容）
 */
export function extractExcerpt(content: string): string {
  const moreIndex = content.indexOf('<!-- more -->')
  const excerptIndex = content.indexOf('<!-- excerpt -->')
  const breakIndex = Math.min(
    moreIndex > -1 ? moreIndex : Infinity,
    excerptIndex > -1 ? excerptIndex : Infinity
  )
  
  if (breakIndex !== Infinity) {
    return content.substring(0, breakIndex).trim()
  }
  
  return content
}

export {
  parseTagArgs,
  blockquote,
  codeblock,
  img,
  link,
  postLink,
  assetImg,
  centerquote,
  highlight,
  fold,
  tabs,
  button,
  note,
  label,
  video,
}
