# Eatly Backend Dockerfile
# 多阶段构建：构建阶段 + 运行阶段

# ========== 阶段1: 构建后端 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# ========== 阶段2: 运行后端 ==========
FROM node:20-alpine

WORKDIR /app

# 安装 dumb-init（处理信号）
RUN apk add --no-cache dumb-init

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 从构建阶段复制构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 4000

# 使用 dumb-init 启动
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/app.js"]
