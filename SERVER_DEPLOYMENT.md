# Eatly Ubuntu 服务器部署指南

## 📋 部署架构

```
┌─────────────────────────────────────────────────────┐
│              Ubuntu 服务器 (101.200.122.190)        │
│                                                     │
│  ┌──────────────┐      ┌──────────────┐           │
│  │   Nginx      │──────│   前端容器    │           │
│  │   :80/:443   │      │   Vue 3 SPA  │           │
│  └──────────────┘      └──────────────┘           │
│         │                                            │
│         └───>/api  ┌──────────────┐                │
│                    │   后端容器    │                │
│                    │   Express API │                │
│                    └──────────────┘                │
│                           │                          │
│                           ↓                          │
│                    ┌──────────────┐                 │
│                    │ PostgreSQL   │                 │
│                    │   :5432      │                 │
│                    └──────────────┘                 │
└─────────────────────────────────────────────────────┘
```

## 🚀 快速部署（推荐）

### 前置要求

1. **本地环境**
   - Git
   - SSH 客户端
   - rsync（文件同步）

2. **服务器环境**
   - Ubuntu 20.04+
   - Docker 已安装
   - Docker Compose 已安装

### 一键部署

```bash
# 1. 克隆项目
git clone <your-repo-url> eatly
cd eatly

# 2. 修改配置（重要！）
nano .env.production
# 修改 DB_PASSWORD 为强密码

# 3. 执行部署脚本
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

**部署脚本会自动完成：**
- ✅ 检查服务器连接
- ✅ 检查 Docker 环境
- ✅ 上传项目文件
- ✅ 构建所有镜像
- ✅ 启动所有服务
- ✅ 健康检查

---

## 📦 手动部署步骤

如果自动部署脚本失败，可以按照以下步骤手动部署：

### 第一步：服务器准备

#### 1.1 安装 Docker

```bash
# SSH 登录服务器
ssh root@101.200.122.190

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
```

#### 1.2 安装 Docker Compose

```bash
# 下载 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

#### 1.3 配置防火墙

```bash
# 允许 HTTP 和 HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 如果需要 SSH，确保 22 端口开放
ufw allow 22/tcp

# 启用防火墙
ufw enable
```

---

### 第二步：上传项目文件

#### 2.1 方式 A：使用 rsync（推荐）

```bash
# 在本地执行
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  ./ root@101.200.122.190:/opt/eatly/
```

#### 2.2 方式 B：使用 SCP

```bash
# 在本地执行
scp -r ./ root@101.200.122.190:/opt/eatly/
```

#### 2.3 方式 C：在服务器上 Git 克隆

```bash
# SSH 登录服务器
ssh root@101.200.122.190

# 克隆项目
cd /opt
git clone <your-repo-url> eatly
cd eatly
```

---

### 第三步：配置环境变量

```bash
# SSH 登录服务器
ssh root@101.200.122.190

# 进入项目目录
cd /opt/eatly

# 复制环境变量文件
cp .env.production .env

# 编辑环境变量
nano .env
```

**重要配置项：**

```env
# 数据库密码（必须修改为强密码！）
DB_PASSWORD=your_secure_password_here

# API 密钥（可选，生产环境建议设置）
API_KEY=your_api_key_here

# 前端 API 地址
VITE_API_URL=http://101.200.122.190/api
VITE_STORAGE_MODE=remote
```

---

### 第四步：启动服务

```bash
# 在服务器上执行
cd /opt/eatly

# 构建镜像（首次部署）
docker compose build

# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

---

### 第五步：验证部署

#### 5.1 检查服务状态

```bash
# 检查所有容器是否运行
docker compose ps

# 应该看到以下容器都在运行：
# - eatly-db (PostgreSQL)
# - eatly-backend (Express API)
# - eatly-frontend (Vue 3)
# - eatly-nginx (Nginx)
```

#### 5.2 测试访问

```bash
# 测试前端
curl http://101.200.122.190/

# 测试后端 API
curl http://101.200.122.190/api/health

# 应该返回: {"success":true,"message":"Eatly API 运行正常"}
```

#### 5.3 浏览器访问

打开浏览器访问：`http://101.200.122.190`

---

## 🔧 常用运维命令

### 查看日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f db

# 查看最近 100 行日志
docker compose logs --tail=100
```

### 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart backend
docker compose restart frontend
```

### 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（⚠️ 危险操作，会删除数据库数据）
docker compose down -v
```

### 更新部署

```bash
# 1. 拉取最新代码
cd /opt/eatly
git pull

# 2. 重新构建镜像
docker compose build

# 3. 重启服务
docker compose up -d
```

### 进入容器调试

```bash
# 进入后端容器
docker exec -it eatly-backend sh

# 进入数据库容器
docker exec -it eatly-db psql -U eatly -d eatly

# 进入前端容器
docker exec -it eatly-frontend sh
```

---

## 🔐 数据库管理

### 备份数据库

```bash
# 手动备份
docker exec eatly-db pg_dump -U eatly eatly > backup_$(date +%Y%m%d).sql

# 恢复备份
docker exec -i eatly-db psql -U eatly eatly < backup_20250203.sql
```

### 自动备份脚本

创建定时备份任务：

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * docker exec eatly-db pg_dump -U eatly eatly > /opt/eatly/backups/eatly_$(date +\%Y\%m\%d).sql
```

---

## 🔒 配置 HTTPS（可选）

### 使用 Let's Encrypt 免费证书

#### 1. 安装 Certbot

```bash
# SSH 登录服务器
ssh root@101.200.122.190

# 安装 Certbot
apt update
apt install certbot -y
```

#### 2. 获取证书

```bash
# 停止 Nginx 容器（释放 80 端口）
docker compose stop nginx

# 获取证书
certbot certonly --standalone -d 101.200.122.190

# 证书位置：
# - /etc/letsencrypt/live/101.200.122.190/fullchain.pem
# - /etc/letsencrypt/live/101.200.122.190/privkey.pem
```

#### 3. 修改 Nginx 配置

编辑 `nginx/conf.d/eatly.conf`，取消 HTTPS 部分的注释：

```nginx
# 修改证书路径
ssl_certificate /etc/nginx/ssl/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/privkey.pem;
```

#### 4. 挂载证书到容器

修改 `docker-compose.yml`：

```yaml
nginx:
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/conf.d:/etc/nginx/conf.d:ro
    - /etc/letsencrypt/live/101.200.122.190:/etc/nginx/ssl:ro  # 添加此行
```

#### 5. 重启服务

```bash
docker compose up -d
```

---

## 🐛 故障排查

### 问题 1：容器无法启动

```bash
# 查看详细错误日志
docker compose logs backend

# 检查端口占用
netstat -tlnp | grep :80
netstat -tlnp | grep :4000
netstat -tlnp | grep :5432
```

### 问题 2：数据库连接失败

```bash
# 检查数据库容器状态
docker compose ps db

# 查看数据库日志
docker compose logs db

# 进入数据库容器测试
docker exec -it eatly-db psql -U eatly -d eatly
```

### 问题 3：前端无法访问后端 API

```bash
# 检查环境变量
docker compose exec backend env | grep VITE_API_URL

# 检查 Nginx 配置
docker compose exec nginx cat /etc/nginx/conf.d/eatly.conf

# 测试 API 连通性
docker compose exec frontend wget -O- http://backend:4000/api/health
```

### 问题 4：端口冲突

```bash
# 查看端口占用
netstat -tlnp | grep :80

# 如果端口被占用，修改 docker-compose.yml 中的端口映射
ports:
  - "8080:80"  # 改为 8080
```

---

## 📊 性能优化

### 1. 数据库优化

编辑 `backend/src/db/schema.sql`，添加索引：

```sql
-- 为常用查询添加索引
CREATE INDEX idx_records_date_range ON records(date DESC);
CREATE INDEX idx_recommendations_date_meal ON recommendations(date, meal_type);
```

### 2. Nginx 缓存

在 `nginx/nginx.conf` 中启用缓存：

```nginx
# 添加缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

# 在 location /api 中添加
proxy_cache api_cache;
proxy_cache_valid 200 10m;
```

### 3. Docker 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 🔐 安全建议

1. **修改默认密码**
   - 数据库密码
   - API Key

2. **配置防火墙**
   - 只开放必要端口（80, 443, 22）
   - 限制 SSH 访问 IP

3. **启用 HTTPS**
   - 使用 Let's Encrypt 免费证书

4. **定期备份**
   - 数据库定期备份
   - 配置文件备份

5. **监控日志**
   - 定期检查访问日志
   - 监控异常访问

---

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Nginx 文档](https://nginx.org/en/docs/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

## 💡 技术支持

如有问题，请检查：
1. Docker 和 Docker Compose 版本是否满足要求
2. 服务器防火墙配置是否正确
3. 环境变量是否正确配置
4. 容器日志中的错误信息

**文档版本:** 1.0.0
**更新日期:** 2025-02-03
