#!/bin/bash

# GYTL-Tools 快速部署脚本

set -e

echo "🚀 GYTL-Tools 部署脚本"
echo "===================="
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    echo "   Ubuntu: curl -fsSL https://get.docker.com | sh"
    echo "   CentOS: sudo yum install docker-ce"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    echo "   sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose"
    exit 1
fi

echo "✅ Docker和Docker Compose已安装"
echo ""

# 检查.env文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "✅ 已创建.env文件，请根据需要修改配置"
    echo ""
fi

# 构建镜像
echo "🔨 构建Docker镜像..."
docker-compose build

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 检查服务状态
echo ""
echo "📊 服务状态："
docker-compose ps

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
echo "   http://localhost:3000"
echo ""
echo "📋 常用命令："
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart"
echo "   更新服务: docker-compose pull && docker-compose up -d"
echo ""
