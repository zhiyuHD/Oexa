#!/usr/bin/env node

/**
 * create-oexa - 创建新的 Oexa 博客项目
 * 
 * 使用方式:
 *   npm create oexa
 *   npm create oexa my-blog
 *   npx create-oexa
 *   npx create-oexa my-blog
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 项目模板配置
interface ProjectConfig {
  name: string
  description: string
  author: string
  theme: 'default'
}

// 默认配置
const defaultConfig: ProjectConfig = {
  name: 'my-blog',
  description: 'My Oexa Blog',
  author: '',
  theme: 'default',
}

// 获取 npm 用户名
function getNpmAuthor(): string {
  try {
    const result = execSync('npm config get init.author.name', { encoding: 'utf-8' }).trim()
    return result && result !== 'undefined' ? result : ''
  } catch {
    return ''
  }
}

// 创建项目目录
function createProjectDir(targetDir: string): boolean {
  if (existsSync(targetDir)) {
    return false
  }
  mkdirSync(targetDir, { recursive: true })
  return true
}

// 复制模板文件
function copyTemplate(templateDir: string, targetDir: string): void {
  cpSync(templateDir, targetDir, { recursive: true, filter: (src) => !src.includes('node_modules') })
}

// 更新 package.json
function updatePackageJson(targetDir: string, config: ProjectConfig): void {
  const pkgPath = join(targetDir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  
  pkg.name = config.name
  pkg.description = config.description
  pkg.author = config.author
  
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

// 更新 oexa.config.ts
function updateOexaConfig(targetDir: string, config: ProjectConfig): void {
  const configPath = join(targetDir, 'oexa.config.ts')
  if (!existsSync(configPath)) return
  
  let content = readFileSync(configPath, 'utf-8')
  
  // 更新站点信息
  content = content.replace(
    /title:\s*['"][^'"]*['"]/,
    `title: '${config.name}'`
  )
  content = content.replace(
    /description:\s*['"][^'"]*['"]/,
    `description: '${config.description}'`
  )
  content = content.replace(
    /author:\s*['"][^'"]*['"]/,
    `author: '${config.author}'`
  )
  
  writeFileSync(configPath, content)
}

// 主函数
async function main() {
  console.log()
  console.log(chalk.cyan('🚀 欢迎使用 Oexa 博客生成器！'))
  console.log()

  // 获取命令行参数中的目录名
  const argDir = process.argv[2]
  
  // 交互式配置
  const answers = await prompts([
    {
      type: argDir ? null : 'text',
      name: 'name',
      message: '项目名称',
      initial: defaultConfig.name,
    },
    {
      type: 'text',
      name: 'description',
      message: '项目描述',
      initial: defaultConfig.description,
    },
    {
      type: 'text',
      name: 'author',
      message: '作者',
      initial: getNpmAuthor(),
    },
    {
      type: 'confirm',
      name: 'install',
      message: '是否立即安装依赖？',
      initial: true,
    },
  ], {
    onCancel: () => {
      console.log(chalk.red('已取消'))
      process.exit(0)
    }
  })

  // 合并配置
  const config: ProjectConfig = {
    name: argDir || answers.name || defaultConfig.name,
    description: answers.description || defaultConfig.description,
    author: answers.author || defaultConfig.author,
    theme: 'default',
  }

  const targetDir = resolve(process.cwd(), config.name)
  
  // 检查目录是否存在
  if (existsSync(targetDir)) {
    console.log(chalk.red(`❌ 目录 "${config.name}" 已存在！`))
    process.exit(1)
  }

  // 创建项目
  const spinner = ora('正在创建项目...').start()
  
  try {
    // 创建目录
    createProjectDir(targetDir)
    
    // 复制模板
    const templateDir = join(__dirname, '..', '..', 'templates', 'default')
    copyTemplate(templateDir, targetDir)
    
    // 更新配置文件
    updatePackageJson(targetDir, config)
    updateOexaConfig(targetDir, config)
    
    spinner.succeed('项目创建成功！')
    
    // 安装依赖
    if (answers.install) {
      const installSpinner = ora('正在安装依赖...').start()
      try {
        execSync('npm install', { cwd: targetDir, stdio: 'ignore' })
        installSpinner.succeed('依赖安装完成！')
      } catch {
        installSpinner.fail('依赖安装失败，请手动运行 npm install')
      }
    }
    
    // 输出后续步骤
    console.log()
    console.log(chalk.green('✨ 项目创建成功！'))
    console.log()
    console.log('后续步骤：')
    console.log()
    console.log(chalk.cyan(`  cd ${config.name}`))
    if (!answers.install) {
      console.log(chalk.cyan('  npm install'))
    }
    console.log(chalk.cyan('  npm run dev'))
    console.log()
    console.log('开始写作：')
    console.log()
    console.log(chalk.cyan('  # 在 posts/ 目录创建 .md 文件'))
    console.log(chalk.cyan('  # 运行 npm run generate 生成文章数据'))
    console.log()
    console.log(chalk.gray('文档: https://github.com/your-repo/oexa'))
    console.log()
    
  } catch (error) {
    spinner.fail('项目创建失败')
    console.error(error)
    process.exit(1)
  }
}

main()
