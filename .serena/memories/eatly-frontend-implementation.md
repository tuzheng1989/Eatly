# Eatly 前端存储抽象层改造

## 会话概述

**任务**: Eatly 云端部署前端存储抽象层改造  
**日期**: 2025-02-03  
**状态**: ✅ 前端改造完成

## 核心变更

### 技术架构

从单一 IndexedDB 存储改造为适配器模式的双存储架构：

```
Services (scheme, record)
    ↓
StorageAdapter (interface)
    ↓
├── StorageService (IndexedDB/Dexie) - 本地开发
└── ApiStorageAdapter (HTTP API) - 云端生产
```

### 存储切换机制

```typescript
// 环境变量控制
const storageMode = import.meta.env.VITE_STORAGE_MODE || 'local'
this.storage = storageMode === 'remote' ? apiStorageAdapter : storageService
```

| 环境 | VITE_STORAGE_MODE | 存储实现 |
|------|------------------|----------|
| 开发 | local | IndexedDB (Dexie) |
| 生产 | remote | HTTP API (Axios) |

## 新增文件

1. **StorageAdapter.interface.ts** - 存储适配器接口定义
   - 定义所有 CRUD 操作
   - Scheme, Record, Recommendation, Settings 实体

2. **ApiStorage.adapter.ts** - HTTP API 存储适配器
   - Axios 实例配置
   - 统一错误处理
   - 标准化 API 响应格式

3. **.env.development** - 开发环境配置
   ```bash
   VITE_STORAGE_MODE=local
   ```

4. **.env.production** - 生产环境配置
   ```bash
   VITE_STORAGE_MODE=remote
   VITE_API_URL=https://your-domain.com/api
   VITE_API_KEY=your-production-api-key
   ```

## 修改文件

1. **storage.service.ts** - 实现 StorageAdapter 接口
2. **scheme.service.ts** - 添加存储适配器选择逻辑
3. **record.service.ts** - 添加存储适配器选择逻辑
4. **package.json** - 添加 axios、vue-tsc 依赖

## API 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

## 验证结果

- ✅ TypeScript 类型检查通过
- ✅ 依赖安装成功
- ✅ 代码符合项目规范

## 下一步计划

### 后端开发（待开始）

1. 创建 Node.js + Express + PostgreSQL 后端项目
2. 实现与 StorageAdapter 接口对应的 REST API
3. 数据库表设计（schemes, records, recommendations, settings）
4. API 安全（API Key 认证）

### 服务器部署（待开始）

1. Ubuntu 服务器配置
2. Nginx 反向代理
3. SSL 证书配置
4. 前端生产构建部署

### 数据迁移（待开始）

1. IndexedDB 数据导出工具
2. 数据导入 PostgreSQL 脚本

## 技术决策记录

- **适配器模式**: 实现存储方式无缝切换
- **环境变量控制**: 避免代码分支，配置化决策
- **接口优先**: 定义清晰的存储抽象
- **向后兼容**: 保持现有 IndexedDB 实现不变