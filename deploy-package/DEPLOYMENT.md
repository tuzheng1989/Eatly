# Eatly 部署包摘要

## 📦 部署包信息

**文件名**: `eatly-deploy-v1.0.0.tar.gz`
**大小**: 633 KB
**版本**: v1.0.0
**构建日期**: 2025-02-04
**Git Commit**: cc6a335

---

## 📋 部署包内容

```
deploy-package/
├── dist/                        # 前端构建输出
│   ├── assets/                  # 静态资源（CSS、JS、图片等）
│   ├── index.html              # 入口 HTML
│   └── routes/                  # 前端路由（可选）
├── backend/                     # 后端文件
│   ├── dist/                    # 后端编译输出
│   │   ├── app.js               # 后端入口
│   │   ├── db/                   # 数据库迁移脚本
│   │   └── routes/               # API 路由
│   └── package.json             # 后端依赖
├── docker-compose.yml           # Docker Compose 配置
├── Dockerfile                   # Docker 镜像构建
├── nginx.conf                   # Nginx 配置
├── .env.production             # 生产环境变量模板
├── deploy.sh                    # 快速部署脚本（可执行）
├── README.md                    # 部署包说明
└── docs/                       # 完整文档
    ├── deployment/             # 部署文档
    ├── testing/                # 测试文档
    └── patterns/               # 设计模式
```

---

## 🚀 快速部署步骤

### 方法 1：使用部署包（推荐）

```bash
# 1. 上传部署包到服务器
scp eatly-deploy-v1.0.0.tar.gz root@101.200.122.190:/opt/

# 2. 登录服务器
ssh root@101.200.122.190

# 3. 解压部署包
cd /opt
tar -xzf eatly-deploy-v1.0.0.tar.gz
cd deploy-package

# 4. 配置环境变量
cp .env.production .env
vim .env  # 修改数据库密码、JWT密钥等

# 5. 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方法 2：使用 Git 仓库

```bash
# 1. 克隆代码
git clone https://github.com/tuzheng1989/Eatly.git
cd Eatly

# 2. 切换到生产版本
git checkout v1.0.0  # 或使用最新的 master 分支

# 3. 配置环境变量
cp .env.production .env
vim .env

# 4. 启动服务
docker-compose up -d
```

---

## ✅ 验证部署

部署完成后，访问以下地址验证：

- **前端**: http://101.200.122.190
- **后端健康检查**: http://101.200.122.190/api/health
- **Nginx**: http://101.200.122.190

---

## 🔧 配置说明

### 必须修改的环境变量

在 `.env` 文件中，**必须**修改以下配置：

```bash
# 数据库密码（至少16位，包含大小写字母、数字、特殊字符）
DB_PASSWORD=your-strong-password-here

# JWT 密钥（至少64位随机字符串）
JWT_SECRET=your-jwt-secret-key-change-me
```

### 生成安全密码

```bash
# 生成数据库密码
openssl rand -base64 32

# 生成 JWT 密钥
openssl rand -base64 64
```

---

## 📊 部署后服务

部署完成后，以下服务将运行：

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| **nginx** | 80, 443 | 反向代理和静态文件服务 |
| **frontend** | 3000 | Vue 3 前端应用 |
| **backend** | 4000 | Express.js 后端 API |
| **postgres** | 5432 | PostgreSQL 数据库 |

---

## 🛠️ 常用管理命令

### 查看服务状态

```bash
docker-compose ps
```

### 查看服务日志

```bash
# 所有服务日志
docker-compose logs -f

# 特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart frontend
docker-compose restart backend
```

### 停止服务

```bash
docker-compose down
```

### 更新服务

```bash
# 拉取最新代码
git pull origin master

# 重新构建和启动
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📈 监控和维护

### 数据库备份

```bash
# 手动备份
docker-compose exec postgres pg_dump -U eatly eatly > backup-$(date +%Y%m%d).sql

# 恢复数据库
docker-compose exec -T postgres psql -U eatly eatly < backup-20250204.sql
```

### 查看资源使用

```bash
# 容器资源使用情况
docker stats

# 磁盘使用情况
df -h
```

### 清理未使用资源

```bash
# 清理未使用的 Docker 镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune
```

---

## 🐛 故障排查

### 问题1: 容器无法启动

```bash
# 查看容器日志
docker-compose logs backend
docker-compose logs frontend

# 检查端口占用
netstat -tlnp | grep -E ':3000|:4000|:5432'
```

### 问题2: 数据库连接失败

```bash
# 检查数据库状态
docker-compose exec postgres pg_isready -U eatly

# 测试数据库连接
docker-compose exec postgres psql -U eatly -d eatly
```

### 问题3: 前端无法访问后端

```bash
# 检查环境变量
docker-compose exec frontend env | grep VITE_API

# 检查后端健康状态
curl http://localhost:4000/api/health
```

---

## 📞 技术支持

如有问题，请通过以下方式获取帮助：

- **GitHub Issues**: https://github.com/tuzheng1989/Eatly/issues
- **部署文档**: [docs/deployment/docker-deployment.md](docs/deployment/docker-deployment.md)
- **开发文档**: [CLAUDE.md](CLAUDE.md)

---

## 📝 更新日志

### v1.0.0 (2025-02-04)

- ✅ 初始生产版本
- ✅ 完整的部署包
- ✅ Docker Compose 配置
- ✅ 自动部署脚本
- ✅ 完整文档

### 已修复的问题

- ✅ 修复了全局 message API 初始化错误
- ✅ 优化了后端 API 返回逻辑（记录不存在时返回 200 + null）
- ✅ 改进了日历 UI（绿色标记有记录日期）
- ✅ 添加了步骤式方案创建向导
- ✅ 优化了记录表单（日期选择器 + 菜品下拉选择）
- ✅ 修复了 TypeScript 类型错误

---

**部署完成时间**: 2025-02-04
**维护者**: tuzheng1989
**许可证**: MIT
