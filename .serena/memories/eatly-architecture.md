# Eatly 项目架构

## 技术栈

### 前端
- **框架**: Vue 3.5 (Composition API + `<script setup>`)
- **语言**: TypeScript 5.6
- **构建**: Vite 6.0
- **状态管理**: Pinia 2.2
- **UI 组件**: Naive UI
- **本地存储**: Dexie.js 4.0 (IndexedDB)
- **样式**: UnoCSS (原子化 CSS)
- **HTTP 客户端**: Axios 1.6

### 后端（计划中）
- **运行时**: Node.js
- **框架**: Express
- **数据库**: PostgreSQL
- **ORM**: Sequelize
- **反向代理**: Nginx

## 目录结构

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
│   ├── storage/      # 存储抽象层
│   │   ├── StorageAdapter.interface.ts
│   │   ├── storage.service.ts
│   │   └── ApiStorage.adapter.ts
│   ├── scheme.service.ts
│   ├── record.service.ts
│   ├── recommend.service.ts
│   └── stats.service.ts
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── constants/        # 常量定义
└── views/            # 页面组件
```

## 分层架构

```
┌─────────────────────────────────────┐
│         Views (页面)                  │
├─────────────────────────────────────┤
│      Components (组件)               │
├─────────────────────────────────────┤
│       Stores (状态管理)              │
├─────────────────────────────────────┤
│      Services (业务逻辑)             │
├─────────────────────────────────────┤
│    Storage (数据访问层)              │
│  ┌─────────────┬─────────────────┐  │
│  │  IndexedDB  │   HTTP API      │  │
│  │   (Dexie)   │   (Axios)       │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

## 核心实体

### Scheme（方案）
```typescript
interface Scheme {
  id: string
  name: string
  description: string
  created: string
  modified: string
  pools: Pool[]
  settings: SchemeSettings
}
```

### Record（记录）
```typescript
interface Record {
  id: string
  date: string
  schemeId: string
  meals: Meal[]
  createdAt: string
  updatedAt: string
}
```

### Recommendation（推荐）
```typescript
interface Recommendation {
  id: string
  schemeId: string
  date: string
  selectedItems: SelectedItem[]
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
  updatedAt: string
}
```

## 全局 API

- **$message**: `window.$message?.success('操作成功')`

## 日期处理

- 统一使用 `dayjs`
- 存储格式: `YYYY-MM-DD`
- 显示格式: `dayjs(date).format('YYYY年MM月DD日')`

## 环境配置

- **开发**: `.env.development` → `VITE_STORAGE_MODE=local`
- **生产**: `.env.production` → `VITE_STORAGE_MODE=remote`

## 关键约定

1. **不可变性**: 始终创建新对象，不修改原对象
2. **错误处理**: Service 层抛出，Store 层不捕获，Component 层处理
3. **类型安全**: 避免 any，使用接口定义
4. **文件规范**: 组件 PascalCase，工具 kebab-case，变量 camelCase