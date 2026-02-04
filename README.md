# 🥗 Eatly - 每日饮食推荐记录应用

## 简介

Eatly 是一个帮助个人规划每日饮食的全栈 Web 应用，通过 ABC 三组菜池的随机推荐机制，确保饮食多样性和营养均衡。

## ✨ 功能特性

### 🎯 核心功能
- 🎲 **智能推荐**: 从 ABC 三组菜品池中随机生成每日饮食推荐
- 📝 **便捷记录**: 日期选择器 + 菜品选择器，轻松记录每日饮食
- 📅 **日历视图**: 可视化日历查看历史记录，绿色标记有记录日期
- 📊 **统计分析**: 多维度饮食数据分析，A/B/C 组摄入统计
- 🔄 **多方案管理**: 支持创建和管理多套菜谱方案

### 🆕 新增功能
- **步骤式方案创建向导**: 4 步引导创建自定义饮食方案
  - 基本信息：方案名称和描述
  - 配置模式：从模板开始或从零开始
  - 菜品池配置：A/B/C 三组菜品管理
  - 预览确认：完整预览并创建方案
- **优化记录表单**: 日期选择器 + 菜品下拉选择，支持搜索和自定义输入
- **改进日历 UI**: 绿色标记有记录日期，黄色标记今天

## 🛠 技术栈

### 前端
- **框架**: Vue 3.5 (Composition API + `<script setup>`)
- **语言**: TypeScript 5.6
- **构建**: Vite 6.0
- **UI 组件**: Naive UI
- **状态管理**: Pinia 2.2
- **图表**: ECharts
- **样式**: UnoCSS (原子化 CSS)

### 后端
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: PostgreSQL 14
- **ORM**: 原生 SQL (node-postgres)
- **部署**: Docker + Docker Compose

### DevOps
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **进程管理**: PM2
- **版本控制**: Git

## 📦 安装

### 前置要求
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14 (可选，Docker 部署时会自动安装)

### 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

## 🚀 开发

### 前端开发
```bash
npm run dev
```
访问 http://localhost:3000

### 后端开发
```bash
cd backend
npm run dev
```
后端运行在 http://localhost:4000

### 完整开发环境
使用 Docker Compose 启动完整开发环境：
```bash
docker-compose -f docker-compose.dev.yml up -d
```

## 🏗 构建

```bash
# 构建前端
npm run build

# 构建后端
cd backend
npm run build
cd ..
```

## 🧪 测试

```bash
# 运行 E2E 测试
npm run test:e2e

# 查看测试覆盖率
npm run test:coverage
```

详细测试指南请查看：**[测试指南](docs/testing/testing-guide.md)**

## 📋 文档

- **[Docker 部署指南](docs/deployment/docker-deployment.md)** - 完整的生产环境部署指南
- **[测试指南](docs/testing/testing-guide.md)** - 开发和测试文档
- **[项目规范](CLAUDE.md)** - 代码规范和开发指南

## 🚢 部署

### Docker 部署（推荐）

快速部署到 Ubuntu 服务器：

```bash
# 1. 克隆代码
git clone https://github.com/tuzheng1989/Eatly.git
cd Eatly

# 2. 配置环境变量
cp .env.production .env
# 编辑 .env 文件，修改数据库密码等配置

# 3. 启动服务
docker-compose up -d
```

详细部署文档请查看：**[Docker 部署指南](docs/deployment/docker-deployment.md)**

### 部署架构

```
Ubuntu 服务器 (101.200.122.190)
├── Nginx (反向代理，端口 80/443)
│   ├── /api → 后端容器
│   └── / → 前端静态文件
├── 前端容器 (Vue 3 SPA，端口 3000)
├── 后端容器 (Express API，端口 4000)
└── PostgreSQL (数据库，端口 5432)
```

## 📖 使用说明

1. **创建方案**: 进入"方案管理" → 点击"创建新方案" → 按向导完成配置
2. **获取推荐**: 进入"推荐"页面 → 点击"生成推荐" → 查看 ABC 三组菜品
3. **记录饮食**:
   - 选择日期
   - 从下拉框选择 A/B/C 组菜品
   - 点击"保存记录"
4. **查看历史**: 进入"日历"页面 → 绿色标记显示有记录的日期
5. **分析统计**: 进入"统计"页面 → 查看各组摄入统计和趋势图

## 📁 项目结构

```
eatly/
├── src/                    # 前端源代码
│   ├── components/         # Vue 组件
│   │   ├── common/        # 通用组件
│   │   ├── calendar/      # 日历组件
│   │   ├── recommendation/ # 推荐组件
│   │   ├── record/        # 记录组件
│   │   ├── scheme/        # 方案管理组件
│   │   └── statistics/    # 统计组件
│   ├── stores/            # Pinia 状态管理
│   ├── services/          # 业务服务层
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
├── backend/               # 后端源代码
│   ├── src/              # TypeScript 源代码
│   │   ├── routes/       # API 路由
│   │   └── ...
│   └── dist/             # 编译输出
├── docs/                 # 项目文档
│   ├── deployment/       # 部署相关文档
│   ├── testing/          # 测试相关文档
│   └── patterns/         # 设计模式和解决方案
├── nginx/                # Nginx 配置
├── docker-compose.yml    # Docker Compose 配置
└── Dockerfile           # Docker 镜像构建
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- **在线演示**: [即将上线]
- **GitHub 仓库**: https://github.com/tuzheng1989/Eatly
- **问题反馈**: https://github.com/tuzheng1989/Eatly/issues

