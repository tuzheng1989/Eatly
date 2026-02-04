# Eatly 部署包 v1.0.0

## 版本信息

- **版本号**: 1.0.0
- **构建日期**: 2025-02-04
- **Git Commit**: $(git log -1 --pretty=format:"%H" | head -1)
- **环境**: 生产环境

## 包含文件

### 核心文件
- `docker-compose.yml` - Docker Compose 配置
- `Dockerfile` - Docker 镜像构建文件
- `nginx.conf` - Nginx 配置文件
- `.env.production` - 生产环境变量模板

### 前端文件
- `dist/` - 前端构建输出

### 后端文件
- `backend/dist/` - 后端编译输出
- `backend/package.json` - 后端依赖

### 文档
- `README.md` - 项目说明
- `CLAUDE.md` - 开发指南
- `docs/deployment/docker-deployment.md` - 部署指南

## 部署步骤

1. 解压部署包到服务器
   ```bash
   tar -xzf eatly-deploy-v1.0.0.tar.gz
   cd eatly-deploy-v1.0.0
   ```

2. 配置环境变量
   ```bash
   cp .env.production .env
   vim .env  # 修改数据库密码等配置
   ```

3. 启动服务
   ```bash
   docker-compose up -d
   ```

4. 验证部署
   ```bash
   curl http://localhost:80
   curl http://localhost:4000/api/health
   ```

## 技术支持

- **部署文档**: [Docker 部署指南](../docs/deployment/docker-deployment.md)
- **GitHub**: https://github.com/tuzheng1989/Eatly
- **问题反馈**: https://github.com/tuzheng1989/Eatly/issues
