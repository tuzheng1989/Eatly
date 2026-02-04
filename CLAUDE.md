# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Eatly** - 全栈每日饮食推荐记录应用。基于 Vue 3 + Express.js + PostgreSQL 的 Web 应用，通过 ABC 三组菜品池的随机推荐机制实现健康饮食规划。

## 技术栈

**前端**: Vue 3.5 (Composition API) + TypeScript 5.6 + Vite 6.0 + Pinia 2.2 + Naive UI + UnoCSS

**后端**: Express.js + TypeScript + PostgreSQL 14 + Docker Compose

**存储**: API Storage (PostgreSQL) + LocalStorage (本地缓存)

## 环境配置

- **操作系统**: Windows 11 (开发), Ubuntu 22.04 (生产)
- **Shell**: Git Bash (MSYS2) - `/usr/bin/bash`
- **用户目录**: `/c/Users/tuzhe`
- **语言偏好**: 中文
- **生产服务器**: 101.200.122.190

## 命令规范

- ✅ 使用 Unix 风格命令：`ls`, `grep`, `find`, `cat`
- ✅ 使用正斜杠路径：`/c/Users/tuzhe/runspace/eatly`
- ❌ 避免使用 PowerShell/CMD 命令和反斜杠路径

## 工具偏好

- **文件操作**: 优先使用 Read/Edit/Write 工具
- **搜索**: 优先使用 Grep/Glob 工具
- **复杂搜索**: 使用 Task tool + Explore agent
- **并行执行**: 单次响应中调用多个独立工具

## 关键目录

```
eatly/
├── src/                    # 前端源代码
│   ├── components/         # Vue 组件 (common, calendar, recommendation, record, scheme, statistics)
│   ├── stores/             # Pinia 状态管理
│   ├── services/           # 业务服务层 (storage/, http/)
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── views/              # 页面组件
├── backend/                # 后端源代码
│   ├── src/routes/         # API 路由
│   └── dist/              # 编译输出
└── docs/                  # 项目文档
```

## 常用命令

**前端**: `npm run dev` | `npm run build` | `npm run type-check` | `npm run lint`

**后端**: `cd backend && npm run dev` | `npm run build`

**Docker**: `docker-compose up -d` | `docker-compose logs -f` | `docker-compose down`

## 代码规范

### 文件命名

- **组件**: PascalCase (`SchemeWizard.vue`)
- **工具/Store/服务**: kebab-case (`uuid.ts`, `scheme.service.ts`)
- **变量**: camelCase (`currentScheme`)
- **常量**: UPPER_SNAKE_CASE (`DEFAULT_SCHEME`)
- **类型**: PascalCase (`Scheme`, `Record`)

### Vue 组件

- 使用 `<script setup lang="ts">` 语法
- Props/Emits 使用 TypeScript 接口定义
- 样式使用 `scoped` 避免污染

### Pinia Store

- 使用 Composition API 风格 `defineStore(name, () => {})`
- 状态使用 `ref`，计算属性使用 `computed`
- 返回公开 API

### 后端 API

- 路由使用 Express Router
- 统一响应格式: `{ success: boolean, data?: T, error?: string }`
- 使用 PostgreSQL 连接池 `pool.query()`

## 重要约定

### 全局 API

- `$message` 消息提示: `window.$message?.success('操作成功')`
- 初始化位置: `src/components/common/MessageInitializer.vue`

### 日期处理

- 统一使用 `dayjs`
- 数据库格式: `YYYY-MM-DD`
- 显示格式: `dayjs(date).format('YYYY年MM月DD日')`

### UUID 生成

- 使用 `generateUUID()` 工具函数 (位置: `src/utils/uuid.ts`)

### LocalStorage 缓存

- 方案 ID: `currentSchemeId`
- 池子状态: `currentPools`
- 应用设置: `settings`

### 错误处理

- Service 层抛出错误
- Store 层不捕获，向上传递
- 组件层使用 try-catch 处理

### 类型安全

- 避免使用 `any` 类型
- 使用接口定义数据结构
- 优先使用类型推导

## 核心概念

### 存储适配器模式

Services → Storage Adapter (interface) → ApiStorageService (PostgreSQL)

### 池子管理

- 双层存储: PostgreSQL (完整配置) + LocalStorage (工作状态)
- 自动重置: 池子为空时从 originalPools 重置
- pools (动态) vs originalPools (原始配置)

### 步骤式向导

方案创建使用多步骤向导，状态管理使用 Provide/Inject 模式。

### 分层架构

Views → Components → Stores → Services → Storage Adapter → Backend API

## 开发工作流

1. 理解需求和现有架构
2. 使用 TypeScript 严格模式
3. 运行 `npm run type-check` 和 `npm run lint`
4. 遵循项目代码规范
5. 手动测试或运行 E2E 测试

## 部署信息

- **环境变量**: `.env.development` | `.env.production` | `.env.test`
- **Docker 服务**: frontend (3000) | backend (4000) | postgres (5432) | nginx (80/443)
- **服务器**: 101.200.122.190 (Ubuntu 22.04, Docker Compose)

详细部署指南: [Docker 部署指南](docs/deployment/docker-deployment.md)
