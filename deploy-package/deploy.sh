#!/bin/bash

# Eatly 快速部署脚本
# 版本: 1.0.0
# 日期: 2025-02-04

set -e  # 遇到错误立即退出

echo "======================================"
echo "   Eatly 生产环境快速部署脚本"
echo "   版本: v1.0.0"
echo "======================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker
echo -e "${YELLOW}检查 Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/engine/install/"
    exit 1
fi
echo -e "${GREEN}✓ Docker 已安装${NC}"
echo ""

# 检查 Docker Compose
echo -e "${YELLOW}检查 Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose 已安装${NC}"
echo ""

# 检查环境变量文件
echo -e "${YELLOW}检查环境配置...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}未找到 .env 文件${NC}"
    if [ -f .env.production ]; then
        echo "从 .env.production 创建 .env 文件..."
        cp .env.production .env
        echo -e "${YELLOW}⚠️  请先编辑 .env 文件，修改数据库密码等配置！${NC}"
        echo "运行: vim .env"
        echo ""
        read -p "是否已完成配置? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "部署已取消。请配置完成后再运行此脚本。"
            exit 0
        fi
    else
        echo -e "${RED}错误: 未找到环境变量配置文件${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ 环境配置文件已存在${NC}"
fi
echo ""

# 停止旧容器（如果存在）
echo -e "${YELLOW}停止旧容器...${NC}"
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✓ 旧容器已停止${NC}"
echo ""

# 构建镜像
echo -e "${YELLOW}构建 Docker 镜像...${NC}"
docker-compose build
echo -e "${GREEN}✓ 镜像构建完成${NC}"
echo ""

# 启动服务
echo -e "${YELLOW}启动服务...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ 服务启动完成${NC}"
echo ""

# 等待服务就绪
echo -e "${YELLOW}等待服务就绪...${NC}"
sleep 10
echo ""

# 验证服务
echo -e "${YELLOW}验证服务状态...${NC}"
echo "前端服务:"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 前端服务正常${NC}"
else
    echo -e "${RED}✗ 前端服务异常${NC}"
fi

echo ""
echo "后端服务:"
if curl -s http://localhost:4000/api/health | grep -q "success"; then
    echo -e "${GREEN}✓ 后端服务正常${NC}"
else
    echo -e "${RED}✗ 后端服务异常${NC}"
fi

echo ""
echo "数据库:"
if docker-compose exec -T postgres pg_isready -U eatly > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 数据库连接正常${NC}"
else
    echo -e "${YELLOW}⚠ 数据库可能未完全就绪${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}部署完成！${NC}"
echo "======================================"
echo ""
echo "访问地址:"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:4000"
echo "  Nginx: http://localhost:80"
echo ""
echo "常用命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo ""
echo "详细文档: [Docker 部署指南](../docs/deployment/docker-deployment.md)"
echo ""
