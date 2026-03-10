#!/bin/bash

# GYTL-Tools 一键部署脚本
# 用于自动化完成整个部署流程

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 打印函数
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 配置变量
INSTALL_DIR="/workspace/gytl-tools"
BACKUP_DIR="/workspace/backups"

# 主函数
main() {
    print_header "GYTL-Tools 一键部署"

    # 检查当前目录
    CURRENT_DIR=$(pwd)
    print_info "当前目录: $CURRENT_DIR"

    # 步骤 1：检查环境
    print_header "步骤 1：检查环境"

    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        print_info "请先安装 Node.js 24.x"
        exit 1
    fi
    print_success "Node.js 版本: $(node --version)"

    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm 未安装，正在安装..."
        npm install -g pnpm
        print_success "pnpm 已安装: $(pnpm --version)"
    else
        print_success "pnpm 版本: $(pnpm --version)"
    fi

    # 步骤 2：创建备份
    print_header "步骤 2：创建备份"
    mkdir -p "$BACKUP_DIR"
    BACKUP_PATH="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"

    if [ -d "$INSTALL_DIR/.next" ]; then
        cp -r "$INSTALL_DIR/.next" "$BACKUP_PATH/"
        print_success "已备份构建文件到 $BACKUP_PATH"
    fi

    # 步骤 3：安装依赖
    print_header "步骤 3：安装依赖"
    pnpm install
    print_success "依赖安装完成"

    # 步骤 4：TypeScript 类型检查
    print_header "步骤 4：TypeScript 类型检查"
    if npx tsc --noEmit; then
        print_success "类型检查通过"
    else
        print_error "类型检查失败，请修复错误后重试"
        exit 1
    fi

    # 步骤 5：构建项目
    print_header "步骤 5：构建项目"
    pnpm build
    print_success "项目构建完成"

    # 步骤 6：检查 PM2
    print_header "步骤 6：检查 PM2"

    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 未安装，正在安装..."
        npm install -g pm2
        print_success "PM2 已安装"
    else
        print_success "PM2 已安装"
    fi

    # 步骤 7：启动服务
    print_header "步骤 7：启动服务"

    if pm2 list | grep -q "gytl-tools"; then
        print_info "服务已存在，重新加载..."
        pm2 reload gytl-tools
        print_success "服务已重新加载"
    else
        print_info "启动新服务..."
        pm2 start npm --name "gytl-tools" -- start
        print_success "服务已启动"
    fi

    # 步骤 8：保存配置
    print_header "步骤 8：保存配置"
    pm2 save
    print_success "PM2 配置已保存"

    # 步骤 9：显示状态
    print_header "部署完成"
    print_info "服务状态："
    pm2 status

    print_info "最新日志："
    pm2 logs gytl-tools --lines 20 --nostream

    print_header "访问信息"
    print_success "服务地址: http://localhost:5000"
    print_success "网络地址: http://$(hostname -I | awk '{print $1}'):5000"

    print_info "常用命令："
    echo "  查看状态: pm2 status"
    echo "  查看日志: pm2 logs gytl-tools"
    echo "  重启服务: pm2 restart gytl-tools"
    echo "  停止服务: pm2 stop gytl-tools"

    print_success "部署成功！"
}

# 运行主函数
main
