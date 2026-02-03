# Eatly 项目 Docker 部署 - 快速指南

## 🎯 部署架构

```
101.200.122.190 (Ubuntu 服务器)
├── Nginx (端口 80/443) - 反向代理
│   ├── / → 前端 (Vue 3 SPA)
│   └── /api → 后端 (Express API)
├── 前端容器 (Vue 3 + Vite)
├── 后端容器 (Express + TypeScript)
└── PostgreSQL (数据库 :5432)
```

---

## ⚡ 三步快速部署

### 1️⃣ 准备服务器

```bash
# SSH 登录服务器
ssh root@101.200.122.190

# 安装 Docker 和 Docker Compose
curl -fsSL https://get.docker.com | sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2️⃣ 本地一键部署

```bash
# 在本地项目目录执行
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

**脚本会自动完成：**
- ✅ 检查服务器环境和连接
- ✅ 上传项目文件
- ✅ 构建所有 Docker 镜像
- ✅ 启动所有服务（前端 + 后端 + 数据库 + Nginx）
- ✅ 健康检查

### 3️⃣ 访问应用

打开浏览器访问：**http://101.200.122.190**

---

## 📁 项目结构

```
eatly/
├── backend/              # 后端 API
│   ├── src/
│   │   ├── routes/      # API 路由
│   │   ├── db/          # 数据库配置
│   │   └── app.ts       # 主应用
│   ├── Dockerfile       # 后端镜像构建
│   └── package.json
├── nginx/               # Nginx 配置
│   ├── nginx.conf
│   └── conf.d/
│       └── eatly.conf   # 站点配置
├── docker-compose.yml   # 容器编排
├── deploy-to-server.sh  # 一键部署脚本
└── .env.production      # 环境变量配置
```

---

## 🔧 手动部署（可选）

如果自动部署脚本失败，可以手动执行：

```bash
# 1. 本地上传文件到服务器
rsync -avz --exclude 'node_modules' \
  --exclude 'dist' \
  ./ root@101.200.122.190:/opt/eatly/

# 2. SSH 登录服务器
ssh root@101.200.122.190

# 3. 进入项目目录
cd /opt/eatly

# 4. 修改环境变量（重要！）
nano .env
# 修改 DB_PASSWORD 为强密码

# 5. 构建并启动
docker compose build
docker compose up -d

# 6. 查看状态
docker compose ps
docker compose logs -f
```

---

## 🔐 重要配置

### 修改数据库密码

编辑 `.env.production` 或服务器上的 `.env` 文件：

```env
DB_PASSWORD=your_secure_password_here
```

### 配置 API Key（可选）

```env
API_KEY=your_api_key_here
```

### 修改前端 API 地址

```env
VITE_API_URL=http://101.200.122.190/api
```

---

## 📊 常用命令

### 查看服务状态

```bash
ssh root@101.200.122.190 'cd /opt/eatly && docker compose ps'
```

### 查看日志

```bash
ssh root@101.200.122.190 'cd /opt/eatly && docker compose logs -f'
```

### 重启服务

```bash
ssh root@101.200.122.190 'cd /opt/eatly && docker compose restart'
```

### 停止服务

```bash
ssh root@101.200.122.190 'cd /opt/eatly && docker compose down'
```

### 更新部署

```bash
# 本地执行
./deploy-to-server.sh
```

或在服务器上：

```bash
cd /opt/eatly
git pull
docker compose build
docker compose up -d
```

---

## 🧪 测试验证

```bash
# 测试前端
curl http://101.200.122.190/

# 测试后端 API
curl http://101.200.122.190/api/health

# 返回: {"success":true,"message":"Eatly API 运行正常"}
```

---

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
ssh root@101.200.122.190 'cd /opt/eatly && docker compose logs backend'
```

### 端口冲突

```bash
# 检查端口占用
ssh root@101.200.122.190 'netstat -tlnp | grep :80'
```

### 数据库连接失败

```bash
# 进入数据库容器
ssh root@101.200.122.190 'docker exec -it eatly-db psql -U eatly -d eatly'
```

---

## 📚 详细文档

- **完整部署指南**: [SERVER_DEPLOYMENT.md](SERVER_DEPLOYMENT.md)
- **通用部署文档**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎉 部署完成清单

- [ ] Docker 和 Docker Compose 已安装
- [ ] 防火墙已配置（80 端口开放）
- [ ] 数据库密码已修改
- [ ] 所有容器正常运行
- [ ] 前端可正常访问
- [ ] 后端 API 响应正常
- [ ] 数据库连接正常

---

## 📞 技术支持

如有问题，请检查：
1. [SERVER_DEPLOYMENT.md](SERVER_DEPLOYMENT.md) - 完整部署文档
2. 容器日志：`docker compose logs`
3. 服务状态：`docker compose ps`

---

**部署版本**: 1.0.0
**最后更新**: 2025-02-03
