# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Eatly** - 全栈每日饮食推荐记录应用。基于 Vue 3 + Express.js + PostgreSQL 的 Web 应用，通过 ABC 三组菜品池的随机推荐机制实现健康饮食规划。

### 技术栈

#### 前端
- **框架**: Vue 3.5 (Composition API + `<script setup>`)
- **语言**: TypeScript 5.6
- **构建**: Vite 6.0
- **状态管理**: Pinia 2.2
- **UI 组件**: Naive UI
- **样式**: UnoCSS (原子化 CSS)
- **图表**: ECharts

#### 后端
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: PostgreSQL 14
- **ORM**: 原生 SQL (node-postgres)
- **部署**: Docker + Docker Compose

### 存储架构

- **开发环境**: API Storage (后端 PostgreSQL)
- **生产环境**: API Storage (后端 PostgreSQL)
- **本地缓存**: LocalStorage (方案 ID、池子状态)

## 环境配置

- **操作系统**: Windows 11 (开发), Ubuntu 22.04 (生产)
- **Shell**: Git Bash (MSYS2) - `/usr/bin/bash`
- **用户目录**: `/c/Users/tuzhe`
- **语言偏好**: 中文
- **生产服务器**: 101.200.122.190

## 命令规范

- ✅ 使用 Unix 风格命令：`ls`, `grep`, `find`, `cat`
- ✅ 使用正斜杠路径：`/c/Users/tuzhe/runspace/eatly`
- ❌ 避免使用 PowerShell/CMD 命令
- ❌ 避免使用反斜杠路径

## 工具偏好

- **文件操作**: 优先使用 Read/Edit/Write 工具
- **搜索**: 优先使用 Grep/Glob 工具
- **复杂搜索**: 使用 Task tool + Explore agent
- **并行执行**: 单次响应中调用多个独立工具

## 关键目录

```
eatly/
├── src/                    # 前端源代码
│   ├── components/         # Vue 组件
│   │   ├── common/         # 通用组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── GlobalMessageProvider.vue
│   │   │   └── MessageInitializer.vue
│   │   ├── calendar/       # 日历组件
│   │   │   └── CalendarView.vue
│   │   ├── recommendation/ # 推荐组件
│   │   ├── record/         # 记录组件
│   │   ├── scheme/         # 方案管理组件
│   │   │   ├── SchemeWizard.vue      # 方案创建向导
│   │   │   └── wizard-steps/         # 向导步骤组件
│   │   └── statistics/     # 统计组件
│   ├── stores/             # Pinia 状态管理
│   │   ├── app.ts
│   │   ├── scheme.ts
│   │   ├── record.ts
│   │   └── recommendation.ts
│   ├── services/           # 业务服务层
│   │   ├── storage/        # 存储适配器
│   │   │   ├── StorageAdapter.interface.ts
│   │   │   ├── IndexedDBStorageService.ts
│   │   │   └── ApiStorageService.ts
│   │   ├── http/
│   │   │   └── http.service.ts
│   │   ├── scheme.service.ts
│   │   ├── record.service.ts
│   │   ├── recommend.service.ts
│   │   └── stats.service.ts
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── constants/          # 常量定义
│   └── views/              # 页面组件
├── backend/                # 后端源代码
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   │   ├── scheme.routes.ts
│   │   │   ├── record.routes.ts
│   │   │   ├── recommendation.routes.ts
│   │   │   └── settings.routes.ts
│   │   └── ...
│   └── dist/              # 编译输出
├── docs/                  # 项目文档
│   ├── deployment/        # 部署相关
│   ├── testing/           # 测试相关
│   └── patterns/          # 设计模式
└── nginx/                 # Nginx 配置
```

## 常用命令

### 前端开发
```bash
npm run dev          # 启动开发服务器（默认端口 3000）
npm run build        # 生产构建
npm run preview      # 预览生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 代码检查
npm run format       # Prettier 代码格式化
```

### 后端开发
```bash
cd backend
npm run dev          # 启动后端开发服务器（端口 4000）
npm run build        # 编译 TypeScript
npm run start        # 运行编译后的服务
```

### Docker 部署
```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 生产环境
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 代码规范

### 文件命名

- **组件**: PascalCase (`RecommendForm.vue`, `SchemeWizard.vue`)
- **工具文件**: kebab-case (`uuid.ts`, `cache.ts`)
- **Store**: kebab-case (`scheme.ts`, `record.ts`)
- **服务**: kebab-case (`scheme.service.ts`, `http.service.ts`)
- **变量**: camelCase (`currentScheme`, `loadRecords`)
- **常量**: UPPER_SNAKE_CASE (`DEFAULT_SCHEME`)
- **类型**: PascalCase (`Scheme`, `Record`, `Recommendation`)

### Vue 组件开发

```vue
<script setup lang="ts">
// 1. 导入依赖
import { ref, computed, onMounted } from 'vue'

// 2. 定义 Props
interface Props {
  foo: string
}
const props = defineProps<Props>()

// 3. 定义 Emits
interface Emits {
  change: [value: string]
}
const emit = defineEmits<Emits>()

// 4. 响应式状态
const count = ref(0)

// 5. 计算属性
const double = computed(() => count.value * 2)

// 6. 方法
function increment() {
  count.value++
}
</script>

<style scoped>
/* 使用 scoped 避免样式污染 */
</style>
```

### Pinia Store 开发

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useXxxStore = defineStore('xxx', () => {
  // 1. 状态
  const items = ref<Item[]>([])

  // 2. 计算属性
  const itemCount = computed(() => items.value.length)

  // 3. 操作
  async function loadItems() {
    items.value = await xxxService.getAll()
  }

  // 4. 返回公开 API
  return { items, itemCount, loadItems }
})
```

### API 路由开发（后端）

```typescript
import { Router } from 'express'
import { pool } from '../app'

const router = Router()

const success = <T,>(data: T) => ({ success: true, data })
const error = (message: string) => ({ success: false, error: message })

// GET /api/resource
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table')
    res.json(success(result.rows))
  } catch (err) {
    res.status(500).json(error(err.message))
  }
})

export default router
```

## 重要约定

### 全局 API

- `$message` 全局消息提示: `window.$message?.success('操作成功')`
- **初始化位置**: `src/components/common/MessageInitializer.vue`
- **注意事项**: 不要在 main.ts 或 GlobalMessageProvider.vue 中重复定义

### 日期处理

- 统一使用 `dayjs`
- 数据库存储格式: `YYYY-MM-DD` (如 `2025-01-15`)
- 显示格式: `dayjs(date).format('YYYY年MM月DD日')`

### UUID 生成

- 使用 `generateUUID()` 工具函数
- 位置: `src/utils/uuid.ts`

### LocalStorage 缓存

- 方案 ID: `currentSchemeId`
- 池子状态: `currentPools`
- 应用设置: `settings`

### 错误处理

- **Service 层**: 抛出错误
- **Store 层**: 不捕获错误，向上传递
- **组件层**: 使用 try-catch 处理

### API 响应格式

```typescript
// 成功响应
{ success: true, data: T }

// 错误响应
{ success: false, error: string }
```

### 类型安全

- 避免使用 `any` 类型
- 使用接口定义数据结构
- 优先使用类型推导

## 核心概念

### 存储适配器模式

项目使用存储适配器模式，支持多种存储方式：

```
Services (业务逻辑)
  ↓
Storage Adapter (适配器接口)
  ↓
├─ IndexedDB (本地存储，已弃用)
└─ API Storage (后端 PostgreSQL，当前使用)
```

**关键文件**:
- `src/services/storage/StorageAdapter.interface.ts` - 适配器接口
- `src/services/storage/ApiStorageService.ts` - API 存储实现
- `src/services/storage/storage.ts` - 统一导出

### 池子管理

- **双层存储**: PostgreSQL (完整配置) + LocalStorage (工作状态)
- **自动重置**: 池子为空时自动从 originalPools 重置
- **pools**: 当前工作池子（动态变化）
- **originalPools**: 原始池子（用于重置）

### 步骤式向导

方案创建使用步骤式向导模式：

```
SchemeWizard (主向导)
  ├─ StepBasicInfo (步骤1: 基本信息)
  ├─ StepConfigMode (步骤2: 配置模式)
  ├─ StepPoolConfig (步骤3: 菜品池配置)
  └─ StepPreview (步骤4: 预览确认)
```

**状态管理**: 使用 Provide/Inject 模式共享数据

### 分层架构

```
┌─────────────────────────────────────┐
│         Views (页面)                  │
│  Home | Calendar | Record | Scheme   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Components (组件)              │
│  WizardForms | CalendarView ...     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Stores (状态管理)             │
│  useSchemeStore | useRecordStore    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services (业务逻辑)            │
│  schemeService | recordService      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Storage Adapter (存储适配)       │
│  ApiStorageService → HTTP Service   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Backend (后端 API)           │
│  Express.js | PostgreSQL | Docker   │
└─────────────────────────────────────┘
```

## 开发工作流

1. **理解需求**: 确保理解功能需求和现有架构
2. **类型安全**: 使用 TypeScript 严格模式
3. **代码检查**: 运行 `npm run type-check` 和 `npm run lint`
4. **符合规范**: 遵循项目代码规范
5. **测试验证**: 手动测试或运行 E2E 测试

## 部署相关

### 环境变量

- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.test` - 测试环境

### Docker 服务

- **frontend**: 前端服务 (端口 3000)
- **backend**: 后端 API (端口 4000)
- **postgres**: PostgreSQL 数据库 (端口 5432)
- **nginx**: 反向代理 (端口 80/443)

### 服务器信息

- **IP**: 101.200.122.190
- **系统**: Ubuntu 22.04
- **部署方式**: Docker Compose

详细部署指南：**[Docker 部署指南](docs/deployment/docker-deployment.md)**
