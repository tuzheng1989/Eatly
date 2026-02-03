# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Eatly** - 每日饮食推荐记录应用。基于 Vue 3 + TypeScript + Vite 的 Web 应用，通过 ABC 三组菜品池的随机推荐机制实现健康饮食规划。

### 技术栈

- Vue 3.5 (Composition API + `<script setup>`)
- TypeScript 5.6
- Vite 6.0
- Pinia 2.2 (状态管理)
- Naive UI (组件库)
- Dexie.js 4.0 (IndexedDB)
- UnoCSS (原子化 CSS)

## 环境配置

- **操作系统**: Windows 11
- **Shell**: Git Bash (MSYS2) - `/usr/bin/bash`
- **用户目录**: `/c/Users/tuzhe`
- **语言偏好**: 中文

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
src/
├── components/       # Vue 组件
│   ├── common/       # 通用组件
│   ├── recommendation/
│   ├── record/
│   ├── calendar/
│   └── statistics/
├── stores/           # Pinia 状态管理
│   ├── app.ts
│   ├── scheme.ts
│   ├── record.ts
│   └── recommendation.ts
├── services/         # 业务服务层
│   ├── storage/      # Dexie 数据库
│   ├── scheme.service.ts
│   ├── record.service.ts
│   ├── recommend.service.ts
│   └── stats.service.ts
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数 (uuid.ts, cache.ts)
├── constants/        # 常量定义
└── views/            # 页面组件
```

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器（默认端口 3000）
npm run build        # 生产构建
npm run preview      # 预览生产构建

# 代码质量
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 代码检查
npm run format       # Prettier 代码格式化

# 依赖
npm install          # 安装依赖
npm install <pkg>    # 添加新依赖
npm install -D <pkg> # 添加开发依赖
```

## 代码规范

### 文件命名

- **组件**: PascalCase (`RecommendForm.vue`)
- **工具文件**: kebab-case (`uuid.ts`, `cache.ts`)
- **Store**: kebab-case (`scheme.ts`, `record.ts`)
- **变量**: camelCase (`currentScheme`, `loadRecords`)
- **常量**: UPPER_SNAKE_CASE (`DEFAULT_SCHEME`)
- **类型**: PascalCase (`Scheme`, `Record`, `Recommendation`)

### 组件开发

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

### Store 开发

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

## 重要约定

### 全局 API

- `$message` 全局消息提示: `window.$message?.success('操作成功')`
- 使用可选链避免 TypeScript 错误

### 日期处理

- 统一使用 `dayjs`
- 数据库存储格式: `YYYY-MM-DD` (如 `2025-01-15`)
- 显示格式: `dayjs(date).format('YYYY年MM月DD日')`

### UUID 生成

- 使用 `generateUUID()` 工具函数
- 位置: `src/utils/uuid.ts`

### LocalStorage 缓存

- 池子状态: `currentPools`
- 方案 ID: `currentSchemeId`
- 应用设置: `settings`

### 错误处理

- Service 层抛出错误
- Store 层不捕获错误
- 组件层使用 try-catch 处理

### 类型安全

- 避免使用 `any` 类型
- 使用接口定义数据结构
- 优先使用类型推导

## 核心概念

### 池子管理

- **双层存储**: IndexedDB (完整配置) + LocalStorage (工作状态)
- **自动重置**: 池子为空时自动从 originalPools 重置
- **pools**: 当前工作池子（动态变化）
- **originalPools**: 原始池子（用于重置）

### 分层架构

```
Views (页面)
  ↓
Components (组件)
  ↓
Stores (状态管理)
  ↓
Services (业务逻辑)
  ↓
Storage (数据访问 - Dexie + IndexedDB)
```

## 开发工作流

1. 修改代码前确保理解现有架构
2. 使用 TypeScript 严格模式，确保类型安全
3. 完成后运行 `npm run type-check` 和 `npm run lint`
4. 确保代码符合项目规范
