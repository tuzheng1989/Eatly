# Eatly 项目部署指南

## 📋 目录

- [项目架构](#项目架构)
- [部署方案对比](#部署方案对比)
- [方案一：Vercel 部署](#方案一vercel-部署推荐)
- [方案二：Nginx 服务器部署](#方案二nginx-服务器部署)
- [方案三：Docker 部署](#方案三docker-部署)
- [常见问题](#常见问题)

---

## 项目架构

### 当前架构：纯前端 SPA

```
浏览器 (客户端)
  ↓
Vue 3 应用
  ↓
数据存储 (IndexedDB + LocalStorage)
```

**特点：**
- ✅ 无需后端服务器
- ✅ 数据存储在用户浏览器中
- ✅ 离线可用
- ✅ 支持后续扩展后端 API

---

## 部署方案对比

| 方案 | 难度 | 费用 | 适用场景 | 访问速度 |
|------|------|------|----------|----------|
| **Vercel** | ⭐ | 免费 | 个人使用、快速上线 | 🌍 全球 CDN |
| **Nginx** | ⭐⭐ | 服务器费用 | 生产环境、自定义域名 | 取决于服务器 |
| **Docker** | ⭐⭐⭐ | 服务器费用 | 容器化部署、可扩展 | 取决于服务器 |

---

## 方案一：Vercel 部署（推荐）

### 优点
- 🚀 零配置，自动部署
- 🌍 全球 CDN 加速
- 🔒 自动 HTTPS
- 💰 免费额度充足

### 步骤

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署

```bash
# 在项目根目录执行
vercel
```

按照提示操作：
- 选择链接到现有项目或创建新项目
- 确认构建设置（Vercel 会自动检测 Vite 项目）
- 等待部署完成

#### 4. 自定义域名（可选）

在 Vercel 控制台中：
1. 进入项目设置 → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

#### 5. 自动部署（可选）

将代码推送到 GitHub，Vercel 会自动部署：

```bash
git add .
git commit -m "feat: 部署到 Vercel"
git push
```

---

## 方案二：Nginx 服务器部署

### 适用场景
- 有自己的云服务器（阿里云、腾讯云等）
- 需要完全控制服务器配置
- 需要配置访问控制、缓存策略等

### 前置要求

- Linux 服务器（Ubuntu/CentOS）
- Nginx 已安装
- 域名（可选）

### 步骤

#### 1. 本地构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建产物在 `dist/` 目录。

#### 2. 上传到服务器

**方式 A：使用部署脚本（推荐）**

```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 部署（修改服务器地址）
./deploy.sh root@your-server-ip
```

**方式 B：手动上传**

```bash
# 使用 scp 上传
scp -r dist/* root@your-server:/var/www/eatly/

# 或使用 rsync
rsync -avz dist/ root@your-server:/var/www/eatly/
```

#### 3. 配置 Nginx

将 `nginx.conf` 复制到服务器：

```bash
scp nginx.conf root@your-server:/etc/nginx/sites-available/eatly
```

在服务器上：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/eatly /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl reload nginx
```

#### 4. 配置 HTTPS（可选）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 方案三：Docker 部署

### 优点
- 🐳 环境隔离，避免依赖问题
- 🔄 易于迁移和扩展
- 📦 标准化部署流程

### 前置要求

- Docker 已安装
- Docker Compose 已安装（可选）

### 步骤

#### 1. 构建镜像

```bash
# 构建镜像
docker build -t eatly:latest .
```

#### 2. 运行容器

**方式 A：使用 Docker 命令**

```bash
# 运行容器
docker run -d \
  --name eatly \
  -p 8080:80 \
  --restart unless-stopped \
  eatly:latest
```

访问：`http://localhost:8080` 或 `http://your-server:8080`

**方式 B：使用 Docker Compose（推荐）**

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 3. 配置 Nginx 反向代理（可选）

如果需要域名访问：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. 更新部署

```bash
# 重新构建镜像
docker-compose build

# 重启服务
docker-compose up -d
```

---

## 常见问题

### Q1: 部署后页面空白？

**检查：**
1. 控制台是否有错误
2. 路由模式是否正确（History 模式需要服务器配置）
3. 构建是否成功

**解决：**
```bash
# 检查构建产物
ls -la dist/

# 检查 Nginx 配置
sudo nginx -t
```

### Q2: 刷新页面 404？

**原因：** Vue Router History 模式需要服务器配置

**解决：** 确保 `nginx.conf` 中有：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Q3: 如何配置环境变量？

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=Eatly 饮食记录
```

在代码中访问：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### Q4: 如何添加后端 API？

项目已预留 `ApiStorageAdapter`：

1. 配置环境变量：
```env
VITE_STORAGE_MODE=api
VITE_API_BASE_URL=https://api.example.com
```

2. 在 `src/services/storage/` 目录下实现 API 接口

3. 修改 Store 的导入即可

### Q5: Docker 容器无法访问？

**检查：**
```bash
# 检查容器状态
docker ps

# 查看容器日志
docker logs eatly

# 检查端口占用
netstat -tlnp | grep 8080
```

### Q6: 如何配置自定义域名？

1. **DNS 解析**：在域名服务商添加 A 记录指向服务器 IP
2. **Nginx 配置**：修改 `server_name` 为你的域名
3. **HTTPS**：使用 Let's Encrypt 获取免费证书

---

## 性能优化建议

### 1. 启用 Gzip 压缩

已在 `nginx.conf` 中配置：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. 配置 CDN

将静态资源上传到 CDN：
- JS/CSS 文件
- 图片资源
- 字体文件

### 3. 浏览器缓存

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 4. 代码分割

Vite 默认已启用代码分割，确保生产构建：

```bash
npm run build
```

---

## 安全建议

1. **配置 HTTPS**：使用 Let's Encrypt 免费证书
2. **安全头**：已在 `nginx.conf` 中配置
3. **CSP 策略**：根据需要配置内容安全策略
4. **限制访问**：使用 Nginx `allow/deny` 限制 IP 访问

---

## 监控和日志

### Nginx 访问日志

```bash
# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### Docker 日志

```bash
# 查看容器日志
docker logs -f eatly

# 查看最近 100 行
docker logs --tail 100 eatly
```

---

## 更新部署

### Vercel

```bash
git push
# Vercel 自动部署
```

### Nginx

```bash
./deploy.sh root@your-server
```

### Docker

```bash
docker-compose build
docker-compose up -d
```

---

## 总结

| 需求 | 推荐方案 |
|------|---------|
| 个人使用、快速上线 | Vercel |
| 生产环境、自定义配置 | Nginx |
| 容器化、可扩展 | Docker |

选择最适合你的方案即可！🚀

---

**文档版本:** 1.0.0
**更新日期:** 2025-02-03
