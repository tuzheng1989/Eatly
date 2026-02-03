#!/bin/bash

# Eatly 项目部署到 Ubuntu 服务器脚本
# 目标服务器: 101.200.122.190
# 使用方法: ./deploy-to-server.sh

set -e  # 遇到错误立即退出

# ========== 配置变量 ==========
SERVER_USER="root"  # 服务器用户名
SERVER_HOST="101.200.122.190"  # 服务器 IP
SERVER_DIR="/opt/eatly"  # 服务器上的部署目录
DOCKER_COMPOSE_FILE="docker-compose.yml"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Eatly 项目部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "目标服务器: ${GREEN}${SERVER_USER}@${SERVER_HOST}${NC}"
echo -e "部署目录: ${GREEN}${SERVER_DIR}${NC}"
echo ""

# 1. 检查本地环境
echo -e "${YELLOW}[1/7] 检查本地环境...${NC}"

# 检查必要的命令
if ! command -v rsync &> /dev/null; then
    echo -e "${RED}错误: 未找到 rsync 命令${NC}"
    echo "请安装 rsync: apt install rsync 或 brew install rsync"
    exit 1
fi

if ! command -v ssh &> /dev/null; then
    echo -e "${RED}错误: 未找到 ssh 命令${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 本地环境检查通过${NC}"
echo ""

# 2. 测试服务器连接
echo -e "${YELLOW}[2/7] 测试服务器连接...${NC}"
if ! ssh -o ConnectTimeout=5 "${SERVER_USER}@${SERVER_HOST}" "echo '连接成功'" > /dev/null 2>&1; then
    echo -e "${RED}错误: 无法连接到服务器 ${SERVER_USER}@${SERVER_HOST}${NC}"
    echo "请检查:"
    echo "  1. 服务器 IP 是否正确"
    echo "  2. SSH 密钥是否配置"
    echo "  3. 网络连接是否正常"
    exit 1
fi
echo -e "${GREEN}✓ 服务器连接成功${NC}"
echo ""

# 3. 检查服务器环境
echo -e "${YELLOW}[3/7] 检查服务器环境...${NC}"
ssh "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        echo "错误: 服务器未安装 Docker"
        echo "请先安装 Docker: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi

    # 检查 Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo "错误: 服务器未安装 Docker Compose"
        echo "请先安装 Docker Compose"
        exit 1
    fi

    echo "✓ 服务器环境检查通过"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}服务器环境检查失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务器环境检查通过${NC}"
echo ""

# 4. 创建部署目录
echo -e "${YELLOW}[4/7] 创建部署目录...${NC}"
ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${SERVER_DIR}"
echo -e "${GREEN}✓ 部署目录创建完成${NC}"
echo ""

# 5. 上传项目文件
echo -e "${YELLOW}[5/7] 上传项目文件...${NC}"
echo "正在同步文件到服务器..."

rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude 'dist' \
    --exclude '.git' \
    --exclude '__pycache__' \
    --exclude '*.log' \
    --exclude '.DS_Store' \
    --exclude 'coverage' \
    --exclude '.env.local' \
    --exclude '.vscode' \
    ./ \
    "${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 文件上传完成${NC}"
else
    echo -e "${RED}✗ 文件上传失败${NC}"
    exit 1
fi
echo ""

# 6. 在服务器上构建和启动
echo -e "${YELLOW}[6/7] 在服务器上构建和启动服务...${NC}"
ssh "${SERVER_USER}@${SERVER_HOST}" << ENDSSH
    cd ${SERVER_DIR}

    echo "停止旧容器..."
    docker compose down || true

    echo "构建镜像..."
    docker compose build --no-cache

    echo "启动服务..."
    docker compose up -d

    echo "等待服务启动..."
    sleep 10

    echo "检查服务状态..."
    docker compose ps

    echo "查看日志..."
    docker compose logs --tail=20
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 服务启动成功${NC}"
else
    echo -e "${RED}✗ 服务启动失败${NC}"
    exit 1
fi
echo ""

# 7. 健康检查
echo -e "${YELLOW}[7/7] 健康检查...${NC}"
sleep 5

# 检查前端
if curl -s -f "http://${SERVER_HOST}/" > /dev/null; then
    echo -e "${GREEN}✓ 前端服务正常${NC}"
else
    echo -e "${YELLOW}⚠ 前端服务可能未启动，请手动检查${NC}"
fi

# 检查后端 API
if curl -s -f "http://${SERVER_HOST}/api/health" > /dev/null; then
    echo -e "${GREEN}✓ 后端 API 服务正常${NC}"
else
    echo -e "${YELLOW}⚠ 后端 API 服务可能未启动，请手动检查${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}    部署完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "访问地址:"
echo -e "  前端: ${GREEN}http://${SERVER_HOST}/${NC}"
echo -e "  API:  ${GREEN}http://${SERVER_HOST}/api/health${NC}"
echo ""
echo -e "常用命令:"
echo -e "  查看日志: ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_DIR} && docker compose logs -f'"
echo -e "  重启服务: ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_DIR} && docker compose restart'"
echo -e "  停止服务: ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_DIR} && docker compose down'"
echo ""
