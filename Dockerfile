# Eatly 前端 Docker 配置
# 多阶段构建：构建阶段 + 运行阶段

# ========== 阶段1: 构建前端 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 接受构建参数（API URL）
ARG VITE_API_URL=http://localhost/api
ENV VITE_API_URL=$VITE_API_URL

# 构建生产版本
RUN npm run build

# ========== 阶段2: Nginx 服务器 ==========
FROM nginx:alpine

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置（支持 SPA 路由）
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
