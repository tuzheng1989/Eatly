# 🚢 Eatly Docker 部署指南

## 📋 部署概述

本文档详细介绍如何使用 Docker 将 Eatly 应用部署到 Ubuntu 服务器。

### 服务器信息

- **IP 地址**: 101.200.122.190
- **操作系统**: Ubuntu 22.04 LTS
- **部署方式**: Docker + Docker Compose
- **服务架构**: Nginx + Frontend + Backend + PostgreSQL

### 服务架构图

```
Internet
    │
    ↓
Nginx (端口 80/443)
    ├─ / → Frontend (Vue 3 SPA, 端口 3000)
    ├─ /api → Backend (Express API, 端口 4000)
    └─ /static → Static files
         │
         ↓
    PostgreSQL (端口 5432)
```

---

## 🔧 第一步：服务器环境配置

### 1.1 登录服务器

```bash
ssh root@101.200.122.190
# 或使用你的用户名
ssh your-username@101.200.122.190
```

### 1.2 更新系统

```bash
# 更新软件包列表
apt update

# 升级已安装的软件包
apt upgrade -y

# 安装必要工具
apt install -y curl wget git vim ufw
```

### 1.3 配置防火墙

```bash
# 允许 SSH
ufw allow 22/tcp

# 允许 HTTP 和 HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 启用防火墙
ufw enable

# 查看防火墙状态
ufw status
```

---

## 🐳 第二步：安装 Docker 和 Docker Compose

### 2.1 安装 Docker

```bash
# 安装依赖
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 官方 GPG 密钥
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
```

### 2.2 安装 Docker Compose（独立版本）

```bash
# 下载 Docker Compose
curl -SL https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 2.3 配置 Docker 用户组（可选）

```bash
# 创建 docker 组（如果不存在）
groupadd docker

# 将当前用户添加到 docker 组
usermod -aG docker your-username

# 刷新组权限（需要重新登录）
newgrp docker
```

---

## 📥 第三步：克隆项目代码

### 3.1 安装 Git

```bash
apt install -y git
```

### 3.2 克隆项目

```bash
# 进入项目目录（通常在 /opt 或 /home）
cd /opt

# 克隆代码仓库
git clone https://github.com/tuzheng1989/Eatly.git

# 进入项目目录
cd Eatly
```

### 3.3 验证项目结构

```bash
# 查看项目结构
ls -la

# 应该看到以下文件/目录：
# - docker-compose.yml
# - Dockerfile
# - nginx.conf
# - src/ (前端源码)
# - backend/ (后端源码)
```

---

## ⚙️ 第四步：配置环境变量

### 4.1 复制环境变量文件

```bash
# 从开发环境配置复制
cp .env.production .env
```

### 4.2 编辑环境变量

```bash
# 使用 vim 编辑
vim .env
```

### 4.3 环境变量配置说明

```bash
# ==================== 数据库配置 ====================
DB_HOST=postgres
DB_PORT=5432
DB_NAME=eatly
DB_USER=eatly
# ⚠️ 重要：修改为强密码（至少16位，包含大小写字母、数字、特殊字符）
DB_PASSWORD=your-strong-password-here-change-me

# ==================== 后端配置 ====================
NODE_ENV=production
PORT=4000
CORS_ORIGIN=http://101.200.122.190

# ==================== 前端配置 ====================
VITE_API_BASE_URL=http://101.200.122.190/api

# ==================== 存储配置 ====================
VITE_STORAGE_TYPE=api

# ==================== JWT 配置 ====================
# JWT 密钥（用于生成推荐令牌）
JWT_SECRET=your-jwt-secret-key-change-me

# ==================== 应用配置 ====================
APP_NAME=Eatly
APP_URL=http://101.200.122.190
```

**安全提示**：
- ✅ 必须修改 `DB_PASSWORD` 为强密码
- ✅ 必须修改 `JWT_SECRET` 为随机字符串
- ✅ 生产环境不要使用默认密码

### 4.4 生成安全的随机密码

```bash
# 生成数据库密码（32字符随机字符串）
openssl rand -base64 32

# 生成 JWT 密钥（64字符随机字符串）
openssl rand -base64 64
```

---

## 🏗️ 第五步：构建和启动服务

### 5.1 构建镜像

```bash
# 使用 Docker Compose 构建所有镜像
docker-compose build

# 或者分别构建
docker-compose build frontend
docker-compose build backend
```

### 5.2 启动服务

```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 5.3 验证服务

```bash
# 检查容器状态
docker-compose ps

# 应该看到以下容器正在运行：
# NAME                 STATUS
# eatly-frontend-1     Up (healthy)
# eatly-backend-1      Up (healthy)
# eatly-postgres-1     Up (healthy)
# eatly-nginx-1        Up (running)

# 检查前端服务
curl http://localhost:3000

# 检查后端服务
curl http://localhost:4000/api/health

# 检查数据库连接
docker-compose exec postgres psql -U eatly -d eatly -c "SELECT version();"
```

### 5.4 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# 查看最近100行日志
docker-compose logs --tail=100
```

---

## 🌐 第六步：配置 Nginx 反向代理

### 6.1 Nginx 配置文件

项目已包含 Nginx 配置文件 (`nginx.conf`)，主要内容如下：

```nginx
server {
    listen 80;
    server_name 101.200.122.190;

    # 前端静态文件
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查端点
    location /health {
        proxy_pass http://backend:4000/api/health;
        access_log off;
    }
}
```

### 6.2 重启 Nginx

如果修改了 Nginx 配置：

```bash
# 重启 Nginx 容器
docker-compose restart nginx

# 或重新创建容器
docker-compose up -d --force-recreate nginx
```

---

## 🔒 第七步：配置 SSL/HTTPS（可选但推荐）

### 7.1 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
certbot --nginx -d 101.200.122.190

# 按提示输入邮箱并同意服务条款

# 自动续期
certbot renew --dry-run
```

### 7.2 修改 Nginx 配置

Certbot 会自动修改 Nginx 配置，添加 SSL 支持。或者手动配置：

```nginx
server {
    listen 443 ssl http2;
    server_name 101.200.122.190;

    ssl_certificate /etc/letsencrypt/live/101.200.122.190/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/101.200.122.190/privkey.pem;

    # ... 其他配置同上
}

server {
    listen 80;
    server_name 101.200.122.190;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 第八步：监控和维护

### 8.1 查看服务状态

```bash
# 查看所有容器状态
docker-compose ps

# 查看容器资源使用情况
docker stats

# 查看容器详细信息
docker inspect eatly-backend-1
```

### 8.2 备份数据库

```bash
# 创建备份目录
mkdir -p /backups

# 备份数据库
docker-compose exec postgres pg_dump -U eatly eatly > /backups/eatly-backup-$(date +%Y%m%d).sql

# 恢复数据库
docker-compose exec -T postgres psql -U eatly eatly < /backups/eatly-backup-20250204.sql
```

### 8.3 设置自动备份（Cron）

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨2点自动备份
0 2 * * * docker-compose exec postgres pg_dump -U eatly eatly > /backups/eatly-backup-$(date +\%Y\%m\%d).sql

# 保留最近30天的备份
0 3 * * * find /backups -name "eatly-backup-*.sql" -mtime +30 -delete
```

### 8.4 日志管理

```bash
# 查看容器日志大小
du -sh /var/lib/docker/containers/*/*-json.log

# 清理旧日志（保留最近7天）
truncate -s 0 /var/lib/docker/containers/*/*-json.log

# 或使用 logrotate 配置日志轮转
vim /etc/logrotate.d/docker
```

---

## 🔄 第九步：更新和重启

### 9.1 更新代码

```bash
# 拉取最新代码
cd /opt/Eatly
git pull origin master

# 重新构建和启动
docker-compose down
docker-compose build
docker-compose up -d
```

### 9.2 滚动更新（零停机）

```bash
# 更新后端
docker-compose up -d --no-deps --build backend

# 更新前端
docker-compose up -d --no-deps --build frontend

# 更新数据库（需要谨慎）
docker-compose up -d --no-deps --build postgres
```

### 9.3 回滚版本

```bash
# 查看提交历史
git log --oneline

# 回滚到指定版本
git checkout <commit-hash>

# 重新构建
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🛠️ 常见问题排查

### 问题1: 容器无法启动

```bash
# 查看容器日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# 检查容器状态
docker-compose ps

# 检查网络连接
docker network inspect eatly_default
```

### 问题2: 数据库连接失败

```bash
# 检查环境变量
docker-compose exec backend env | grep DB_

# 测试数据库连接
docker-compose exec postgres psql -U eatly -d eatly

# 检查数据库日志
docker-compose logs postgres
```

### 问题3: 端口冲突

```bash
# 查看端口占用
netstat -tlnp | grep :3000
netstat -tlnp | grep :4000
netstat -tlnp | grep :5432

# 停止占用端口的服务
systemctl stop nginx  # 如果系统有 Nginx 运行
```

### 问题4: 权限问题

```bash
# 检查文件权限
ls -la /opt/Eatly

# 修改权限
chown -R $USER:$USER /opt/Eatly
chmod -R 755 /opt/Eatly
```

### 问题5: 磁盘空间不足

```bash
# 查看磁盘使用情况
df -h

# 清理 Docker 资源
docker system prune -a

# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune
```

---

## 🔐 安全建议

### 10.1 系统安全

```bash
# 禁用 root 登录
vim /etc/ssh/sshd_config
# 修改: PermitRootLogin no

# 使用 SSH 密钥认证
ssh-keygen -t rsa -b 4096

# 配置自动安全更新
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 10.2 应用安全

- ✅ 定期更新依赖包
- ✅ 使用强密码（数据库、JWT）
- ✅ 启用 HTTPS
- ✅ 配置防火墙规则
- ✅ 定期备份数据
- ✅ 监控系统日志

### 10.3 数据库安全

```bash
# 限制数据库远程访问（仅本地）
# 在 docker-compose.yml 中配置：
# postgres:
#   ports:
#     - "127.0.0.1:5432:5432"  # 仅本地访问

# 定期备份数据库
# 设置自动备份 cron 任务
```

---

## 📞 技术支持

如有问题，请通过以下方式联系：

- **GitHub Issues**: https://github.com/tuzheng1989/Eatly/issues
- **项目文档**: [README.md](../../README.md)
- **开发指南**: [CLAUDE.md](../../CLAUDE.md)

---

## 📝 附录

### A. 完整的 docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:14-alpine
    container_name: eatly-postgres
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # 后端 API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: eatly-backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      PORT: 4000
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "4000:4000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # 前端应用
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: eatly-frontend
    environment:
      VITE_API_BASE_URL: ${VITE_API_BASE_URL}
    depends_on:
      - backend
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: eatly-nginx
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped

volumes:
  postgres-data:
```

### B. 有用的 Docker 命令

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据）
docker-compose down -v

# 查看容器资源使用
docker stats

# 进入容器
docker-compose exec backend bash
docker-compose exec postgres psql -U eatly -d eatly

# 查看容器日志
docker-compose logs -f --tail=100 backend

# 重启单个服务
docker-compose restart backend

# 更新镜像
docker-compose pull
docker-compose up -d
```

---

**部署完成！** 🎉

访问 http://101.200.122.190 即可使用 Eatly 应用。
