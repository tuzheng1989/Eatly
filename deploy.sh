#!/bin/bash

# Eatly 项目部署脚本
# 使用方法: ./deploy.sh [服务器IP或域名]

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
SERVER=${1:-"root@your-server"}  # 服务器地址，默认需要修改
REMOTE_DIR="/var/www/eatly"       # 服务器上的目录
LOCAL_DIST="./dist"               # 本地构建目录

echo -e "${GREEN}=== Eatly 部署脚本 ===${NC}"
echo ""

# 1. 检查本地环境
echo -e "${YELLOW}1. 检查本地环境...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到 npm，请先安装 Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm 已安装${NC}"

# 2. 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}2. 安装依赖...${NC}"
    npm install
fi

# 3. 构建项目
echo -e "${YELLOW}3. 构建生产版本...${NC}"
npm run build

if [ ! -d "$LOCAL_DIST" ]; then
    echo -e "${RED}错误: 构建失败，dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"

# 4. 上传到服务器
echo -e "${YELLOW}4. 上传文件到服务器...${NC}"
echo -e "服务器: $SERVER"
echo -e "远程目录: $REMOTE_DIR"

# 创建远程目录
ssh "$SERVER" "mkdir -p $REMOTE_DIR"

# 上传构建文件
rsync -avz --delete \
    --exclude '.DS_Store' \
    --exclude '.git' \
    --exclude 'node_modules' \
    "$LOCAL_DIST/" \
    "$SERVER:$REMOTE_DIR/"

echo -e "${GREEN}✓ 文件上传成功${NC}"

# 5. 设置权限
echo -e "${YELLOW}5. 设置文件权限...${NC}"
ssh "$SERVER" "chmod -R 755 $REMOTE_DIR && chown -R www-data:www-data $REMOTE_DIR"

echo -e "${GREEN}✓ 权限设置完成${NC}"

# 6. 重启 Nginx（可选）
echo -e "${YELLOW}6. 是否重启 Nginx? (y/n)${NC}"
read -r answer
if [ "$answer" = "y" ]; then
    ssh "$SERVER" "nginx -t && systemctl reload nginx"
    echo -e "${GREEN}✓ Nginx 已重启${NC}"
fi

echo ""
echo -e "${GREEN}=== 部署完成! ===${NC}"
echo -e "访问地址: http://your-domain.com"
