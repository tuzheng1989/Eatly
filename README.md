# 🥗 Eatly - 每日饮食推荐记录

## 简介

Eatly 是一个帮助个人规划每日饮食的 Web 应用，通过 ABC 三组菜池的随机推荐机制，确保饮食多样性和营养均衡。

## 功能特性

- 🎲 **随机推荐**: 从 ABC 三组菜品池中随机生成推荐
- 📝 **饮食记录**: 记录每日实际饮食
- 📅 **日历查看**: 通过日历查看历史记录
- 📊 **统计分析**: 多维度饮食数据分析
- 🔄 **多方案管理**: 支持创建和管理多套菜谱方案

## 技术栈

- Vue 3 + TypeScript
- Vite
- Naive UI
- Pinia
- Dexie.js (IndexedDB)
- ECharts
- UnoCSS

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

访问 http://localhost:3000

## 构建

```bash
npm run build
```

## 测试

```bash
# 单元测试
npm run test:unit

# E2E 测试
npm run test:e2e
```

## 部署

### 🚀 快速部署到 Ubuntu 服务器

```bash
# 1. 修改环境变量（重要！）
nano .env.production
# 修改 DB_PASSWORD 为强密码

# 2. 一键部署
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

详细部署文档请查看：
- **[快速部署指南](QUICK_DEPLOY.md)** - 三步完成部署
- **[完整部署文档](SERVER_DEPLOYMENT.md)** - 详细的部署和运维指南

### 部署架构

```
Ubuntu 服务器
├── Nginx (反向代理)
├── 前端容器 (Vue 3 SPA)
├── 后端容器 (Express API)
└── PostgreSQL (数据库)
```

## 使用说明

1. **创建方案**: 在"方案管理"中创建或编辑菜谱方案
2. **获取推荐**: 在"推荐"页面生成随机推荐
3. **记录饮食**: 确认推荐或手动记录饮食
4. **查看历史**: 在"日历"页面查看历史记录
5. **分析统计**: 在"统计"页面查看饮食分析

## 许可证

MIT
