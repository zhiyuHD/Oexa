# Oexa NPM 包架构说明

## 📦 包结构

本项目已重构为 monorepo 架构，包含两个可发布的 npm 包：

```
oexa/
├── packages/
│   ├── oexa/                    # 核心库包
│   │   ├── src/
│   │   │   ├── index.ts         # 主入口
│   │   │   ├── cli.ts           # CLI 工具
│   │   │   ├── main.ts          # 应用入口
│   │   │   ├── types.ts         # 类型定义
│   │   │   ├── components/      # Vue 组件
│   │   │   ├── composables/     # 组合式函数
│   │   │   ├── router/          # 路由配置
│   │   │   └── build/           # 构建脚本
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   │
│   └── create-oexa/             # 脚手架包
│       ├── src/
│       │   └── index.ts         # 初始化逻辑
│       └── package.json
│
├── templates/
│   └── default/                 # 默认项目模板
│       ├── package.json
│       ├── oexa.config.ts
│       ├── index.html
│       └── posts/
│           └── hello-world.md
│
└── package.json                 # monorepo 根配置
```

## 🚀 使用方式

### 用户创建新项目

```sh
# 方式 1: npm create
npm create oexa

# 方式 2: npx
npx create-oexa

# 方式 3: 指定项目名
npm create oexa my-blog
```

### 项目内命令

```sh
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run preview    # 预览构建结果
npm run generate   # 生成文章数据
npx oexa new "标题" # 创建新文章
```

## 📋 发布步骤

### 1. 安装依赖

```sh
npm install
```

### 2. 构建所有包

```sh
npm run build:all
```

### 3. 发布到 npm

```sh
# 首次发布需要登录
npm login

# 发布 oexa 核心包
cd packages/oexa
npm publish

# 发布 create-oexa 脚手架
cd ../create-oexa
npm publish
```

### 使用 Changesets 管理（推荐）

```sh
# 添加变更记录
npx changeset

# 版本升级
npx changeset version

# 发布
npx changeset publish
```

## 🔧 开发指南

### 本地开发

```sh
# 在 monorepo 根目录
npm install

# 开发模式
npm run dev

# 构建
npm run build:all
```

### 本地测试脚手架

```sh
# 在 create-oexa 目录
cd packages/create-oexa
npm link

# 测试
cd ~/test-dir
npm create oexa test-blog
```

## 📝 需要迁移的文件

将现有 `src/` 目录下的文件迁移到 `packages/oexa/src/`：

| 原位置 | 新位置 |
|--------|--------|
| `src/components/` | `packages/oexa/src/components/` |
| `src/composables/` | `packages/oexa/src/composables/` |
| `src/router/` | `packages/oexa/src/router/` |
| `src/build/` | `packages/oexa/src/build/` |
| `src/pages/` | `packages/oexa/src/pages/` |
| `src/App.vue` | `packages/oexa/src/App.vue` |
| `src/main.ts` | `packages/oexa/src/main.ts` |
| `src/assets/` | `packages/oexa/src/assets/` |

## 🎯 下一步

1. **迁移现有代码** - 将 `src/` 目录内容复制到 `packages/oexa/src/`
2. **完善 CLI** - 确保 CLI 命令正常工作
3. **测试模板** - 测试 `npm create oexa` 创建的项目能否正常运行
4. **添加测试** - 添加单元测试和集成测试
5. **完善文档** - 编写详细的使用文档

## 📦 包依赖关系

```
create-oexa (脚手架)
    └── templates/default (模板)
            └── oexa (核心库)
                    ├── vue
                    ├── vue-router
                    ├── vite
                    ├── marked
                    └── mdui
```

## 🔗 npm 包名

- **核心库**: `oexa`
- **脚手架**: `create-oexa`

用户使用 `npm create oexa` 时，npm 会自动查找并执行 `create-oexa` 包。
