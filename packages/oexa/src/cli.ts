#!/usr/bin/env node

/**
 * Oexa CLI - 命令行工具
 * 
 * 使用方式:
 *   oexa dev        启动开发服务器
 *   oexa build      构建生产版本
 *   oexa preview    预览构建结果
 *   oexa generate   生成文章数据
 *   oexa init       初始化新项目
 */

import { execSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 检查是否在项目目录中
function checkProjectDir(): boolean {
  return existsSync('oexa.config.ts') || existsSync('oexa.config.js')
}

// 检查 node_modules 是否存在
function checkDependencies(): boolean {
  return existsSync('node_modules')
}

// 运行命令
function runCommand(command: string, message: string): void {
  const spinner = ora(message).start()
  try {
    execSync(command, { stdio: 'inherit' })
    spinner.succeed()
  } catch (error) {
    spinner.fail()
    process.exit(1)
  }
}

program
  .name('oexa')
  .description('Oexa 静态博客生成器')
  .version('0.1.0')

// dev 命令
program
  .command('dev')
  .description('启动开发服务器')
  .option('-p, --port <port>', '端口号', '5173')
  .option('-h, --host', '监听所有网络接口')
  .action((options) => {
    if (!checkProjectDir()) {
      console.log(chalk.red('❌ 请在 Oexa 项目目录中运行此命令'))
      console.log(chalk.gray('   提示: 运行 npm create oexa 创建新项目'))
      process.exit(1)
    }
    
    if (!checkDependencies()) {
      console.log(chalk.yellow('⚠️  依赖未安装，正在安装...'))
      runCommand('npm install', '安装依赖')
    }
    
    // 先生成文章数据
    console.log(chalk.cyan('📝 生成文章数据...'))
    try {
      execSync('npx tsx node_modules/oexa/dist/build/generate.js', { stdio: 'inherit' })
    } catch {
      // 忽略错误
    }
    
    // 启动 Vite
    const args = ['vite', '--port', options.port]
    if (options.host) args.push('--host')
    runCommand(`npx ${args.join(' ')}`, '启动开发服务器')
  })

// build 命令
program
  .command('build')
  .description('构建生产版本')
  .action(() => {
    if (!checkProjectDir()) {
      console.log(chalk.red('❌ 请在 Oexa 项目目录中运行此命令'))
      process.exit(1)
    }
    
    // 生成文章数据
    console.log(chalk.cyan('📝 生成文章数据...'))
    try {
      execSync('npx tsx node_modules/oexa/dist/build/generate.js', { stdio: 'inherit' })
    } catch {
      // 忽略错误
    }
    
    // 构建
    runCommand('npx vite build', '构建项目')
    console.log(chalk.green('✨ 构建完成！'))
    console.log(chalk.gray('   输出目录: dist/'))
  })

// preview 命令
program
  .command('preview')
  .description('预览构建结果')
  .option('-p, --port <port>', '端口号', '4173')
  .action((options) => {
    if (!existsSync('dist')) {
      console.log(chalk.red('❌ 未找到构建结果，请先运行 oexa build'))
      process.exit(1)
    }
    
    runCommand(`npx vite preview --port ${options.port}`, '启动预览服务器')
  })

// generate 命令
program
  .command('generate')
  .description('生成文章数据')
  .action(() => {
    if (!checkProjectDir()) {
      console.log(chalk.red('❌ 请在 Oexa 项目目录中运行此命令'))
      process.exit(1)
    }
    
    const spinner = ora('生成文章数据...').start()
    try {
      execSync('npx tsx node_modules/oexa/dist/build/generate.js', { stdio: 'inherit' })
      spinner.succeed('文章数据生成完成！')
    } catch (error) {
      spinner.fail('生成失败')
      process.exit(1)
    }
  })

// init 命令
program
  .command('init [name]')
  .description('初始化新项目')
  .action((name) => {
    console.log(chalk.cyan('🚀 使用 npm create oexa 创建新项目'))
    console.log()
    execSync(`npm create oexa${name ? ` ${name}` : ''}`, { stdio: 'inherit' })
  })

// new 命令 - 创建新文章
program
  .command('new <title>')
  .description('创建新文章')
  .option('-c, --category <category>', '分类')
  .option('-t, --tags <tags>', '标签（逗号分隔）')
  .action((title, options) => {
    if (!checkProjectDir()) {
      console.log(chalk.red('❌ 请在 Oexa 项目目录中运行此命令'))
      process.exit(1)
    }
    
    const { writeFileSync, existsSync, mkdirSync } = require('fs')
    const { join } = require('path')
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const date = new Date().toISOString().split('T')[0]
    const postsDir = join(process.cwd(), 'posts')
    
    if (!existsSync(postsDir)) {
      mkdirSync(postsDir, { recursive: true })
    }
    
    const filePath = join(postsDir, `${slug}.md`)
    
    if (existsSync(filePath)) {
      console.log(chalk.red(`❌ 文章 "${slug}.md" 已存在`))
      process.exit(1)
    }
    
    const frontmatter = `---
title: ${title}
date: ${date}
${options.category ? `categories:\n  - ${options.category}` : ''}
${options.tags ? `tags:\n${options.tags.split(',').map((t: string) => `  - ${t.trim()}`).join('\n')}` : ''}
description: 
---

# ${title}

开始写作...
`
    
    writeFileSync(filePath, frontmatter)
    console.log(chalk.green(`✨ 文章创建成功: posts/${slug}.md`))
  })

program.parse()
