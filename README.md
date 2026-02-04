<div align="center">

# 🥗 Eatly

### 每日饮食推荐记录应用

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Vue Version](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org/)

一个帮助个人规划每日饮食的全栈 Web 应用，通过 ABC 三组菜品池的随机推荐机制，确保饮食多样性和营养均衡。

[快速开始](#-快速开始) · [功能特性](#-功能特性) · [部署指南](#-部署指南) · [贡献指南](#-贡献指南)

</div>

---

## 📖 目录

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [开发指南](#-开发指南)
- [项目结构](#-项目结构)
- [部署指南](#-部署指南)
- [环境变量](#-环境变量)
- [文档](#-文档)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

---

## ✨ 功能特性

### 🎯 核心功能

<details>
<summary><strong>🎲 智能推荐系统</strong></summary>

从 ABC 三组菜品池中随机生成每日饮食推荐，确保饮食多样性。

</details>

<details>
<summary><strong>📝 便捷记录功能</strong></summary>

日期选择器 + 菜品选择器，轻松记录每日饮食，支持搜索和自定义输入。

</details>

<details>
<summary><strong>📅 日历视图</strong></summary>

可视化日历查看历史记录，绿色标记有记录日期，黄色标记今天。

</details>

<details>
<summary><strong>📊 数据统计分析</strong></summary>

多维度饮食数据分析，A/B/C 组摄入统计和趋势图。

</details>

<details>
<summary><strong>🔄 多方案管理</strong></summary>

支持创建和管理多套菜谱方案，步骤式向导引导创建。

</details>

### 🆕 最新功能

- **步骤式方案创建向导**: 4 步引导创建自定义饮食方案
  - 基本信息：方案名称和描述
  - 配置模式：从模板开始或从零开始
  - 菜品池配置：A/B/C 三组菜品管理
  - 预览确认：完整预览并创建方案
- **优化记录表单**: 日期选择器 + 菜品下拉选择，支持搜索和自定义输入
- **改进日历 UI**: 绿色标记有记录日期，黄色标记今天

---

## 🛠 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 | 渐进式 JavaScript 框架，使用 Composition API |
| TypeScript | 5.6 | JavaScript 的超集，提供类型安全 |
| Vite | 6.0 | 下一代前端构建工具 |
| Pinia | 2.2 | Vue 3 官方推荐的状态管理库 |
| Naive UI | - | Vue 3 组件库 |
| UnoCSS | - | 原子化 CSS 引擎 |
| ECharts | 5.4 | 数据可视化图表库 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Express.js | - | Node.js Web 应用框架 |
| TypeScript | - | 类型安全的后端开发 |
| PostgreSQL | 14 | 关系型数据库 |
| node-postgres | - | PostgreSQL 的 Node.js 客户端 |

### DevOps

- **Docker & Docker Compose** - 容器化部署
- **Nginx** - 反向代理和静态文件服务
- **PM2** - Node.js 进程管理
- **Git** - 版本控制

---

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (可选)

### 一键运行（Docker）

```bash
# 克隆仓库
git clone https://github.com/tuzheng1989/Eatly.git
cd Eatly

# 启动所有服务
docker-compose up -d

# 访问应用
# 前端: http://localhost:3000
# 后端 API: http://localhost:4000
```

### 本地开发

```bash
# 1. 安装依赖
npm install
cd backend && npm install && cd ..

# 2. 启动后端（终端 1）
cd backend && npm run dev

# 3. 启动前端（终端 2）
npm run dev

# 4. 访问应用
# 浏览器打开: http://localhost:3000
```

---

## 💻 开发指南

### 前端开发

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run preview      # 预览生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 代码检查
npm run format       # Prettier 代码格式化
```

### 后端开发

```bash
cd backend
npm run dev          # 启动开发服务器（端口 4000）
npm run build        # 编译 TypeScript
npm run start        # 运行编译后的服务
```

### 测试

```bash
npm run test:e2e              # 运行 E2E 测试
npm run test:e2e:headed       # 运行 E2E 测试（有头模式）
npm run test:e2e:debug        # 调试 E2E 测试
npm run test:e2e:report       # 查看测试报告
```

详细测试指南: **[测试指南](docs/testing/testing-guide.md)**

---

## 📁 项目结构

```
eatly/
├── src/                    # 前端源代码
│   ├── components/         # Vue 组件
│   │   ├── common/         # 通用组件
│   │   ├── calendar/       # 日历组件
│   │   ├── recommendation/ # 推荐组件
│   │   ├── record/         # 记录组件
│   │   ├── scheme/         # 方案管理组件
│   │   └── statistics/     # 统计组件
│   ├── stores/             # Pinia 状态管理
│   ├── services/           # 业务服务层
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── views/              # 页面组件
├── backend/                # 后端源代码
│   ├── src/                # TypeScript 源代码
│   │   ├── routes/         # API 路由
│   │   └── ...
│   └── dist/               # 编译输出
├── docs/                   # 项目文档
│   ├── deployment/         # 部署相关文档
│   ├── testing/            # 测试相关文档
│   └── patterns/           # 设计模式和解决方案
├── nginx/                  # Nginx 配置
├── .github/                # GitHub 配置
├── docker-compose.yml      # Docker Compose 配置
├── Dockerfile              # Docker 镜像构建
└── README.md               # 项目说明
```

---

## 🚢 部署指南

### Docker 部署（推荐）

```bash
# 1. 克隆代码
git clone https://github.com/tuzheng1989/Eatly.git
cd Eatly

# 2. 配置环境变量
cp .env.production .env
# 编辑 .env 文件，修改数据库密码等配置

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止服务
docker-compose down
```

### 部署架构

```
┌─────────────────────────────────────────┐
│         Nginx (反向代理 80/443)          │
│  ┌─────────────┐      ┌──────────────┐  │
│  │   前端      │      │   后端 API   │  │
│  │  (Vue 3)    │      │  (Express)   │  │
│  │  端口 3000  │      │  端口 4000   │  │
│  └─────────────┘      └──────┬───────┘  │
│                              │          │
│                    ┌─────────▼───────┐  │
│                    │  PostgreSQL     │  │
│                    │  端口 5432      │  │
│                    └─────────────────┘  │
└─────────────────────────────────────────┘
```

详细部署文档: **[Docker 部署指南](docs/deployment/docker-deployment.md)**

---

## ⚙️ 环境变量

### 前端环境变量

```bash
# .env.development / .env.production
VITE_API_BASE_URL=http://localhost:4000/api  # 后端 API 地址
```

### 后端环境变量

```bash
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/eatly
PORT=4000
NODE_ENV=production
```

---

## 📚 文档

- **[Docker 部署指南](docs/deployment/docker-deployment.md)** - 完整的生产环境部署指南
- **[测试指南](docs/testing/testing-guide.md)** - 开发和测试文档
- **[项目规范](CLAUDE.md)** - 代码规范和开发指南
- **[设计模式](docs/patterns/)** - 架构设计和解决方案

---

## 📸 屏幕截图

> 待添加...

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是新功能、Bug 修复、文档改进还是问题报告。

### 如何贡献

1. **Fork** 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 **Pull Request**

### 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式化（不影响代码含义）
- `refactor:` 重构（既不是新功能也不是 Bug 修复）
- `perf:` 性能优化
- `test:` 添加测试
- `chore:` 构建过程或辅助工具的变动

### 开发规范

- 遵循现有代码风格
- 添加必要的测试
- 更新相关文档
- 确保所有测试通过

---

## 🗺️ 路线图

- [ ] 添加用户认证系统
- [ ] 支持多人协作方案
- [ ] 移动端适配优化
- [ ] 导出饮食报告（PDF/Excel）
- [ ] 营养成分分析
- [ ] 智能推荐算法优化

---

## ❓ 常见问题

<details>
<summary><strong>Q: 数据库连接失败怎么办？</strong></summary>

**A:** 请检查：
1. PostgreSQL 服务是否正常运行
2. `.env` 文件中的数据库连接字符串是否正确
3. 数据库用户名和密码是否正确
4. 防火墙是否开放了 5432 端口

</details>

<details>
<summary><strong>Q: 前端无法连接后端 API？</strong></summary>

**A:** 请检查：
1. 后端服务是否正常运行（`http://localhost:4000`）
2. 前端环境变量 `VITE_API_BASE_URL` 是否正确配置
3. 浏览器控制台是否有 CORS 错误

</details>

<details>
<summary><strong>Q: Docker 容器启动失败？</strong></summary>

**A:** 请检查：
1. Docker 和 Docker Compose 是否正确安装
2. 端口 3000/4000/5432 是否被占用
3. 查看容器日志：`docker-compose logs -f`

</details>

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/tuzheng1989/Eatly
- **问题反馈**: https://github.com/tuzheng1989/Eatly/issues
- **更新日志**: [CHANGELOG.md](CHANGELOG.md)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star！**

Made with ❤️ by [tuzheng1989](https://github.com/tuzheng1989)

</div>
