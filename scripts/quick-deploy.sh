#!/bin/bash

# GYTL-Tools 快速迭代部署脚本
# 用于快速更新和部署项目到生产环境

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 检查函数
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装"
        exit 1
    fi
}

# 主函数
main() {
    print_header "GYTL-Tools 快速迭代部署"

    # 1. 环境检查
    print_info "检查环境..."
    check_command "node"
    check_command "pnpm"
    check_command "git"

    NODE_VERSION=$(node --version)
    PNPM_VERSION=$(pnpm --version)

    print_success "Node.js 版本: $NODE_VERSION"
    print_success "pnpm 版本: $PNPM_VERSION"

    # 2. 拉取最新代码
    print_info "拉取最新代码..."
    git fetch origin
    git pull origin main
    print_success "代码已更新"

    # 3. 创建备份
    print_info "创建备份..."
    BACKUP_DIR="/workspace/backups/gytl-tools-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"

    # 备份构建文件
    if [ -d ".next" ]; then
        cp -r .next "$BACKUP_DIR/"
        print_success "已备份构建文件到 $BACKUP_DIR"
    fi

    # 4. 安装依赖
    print_info "安装依赖..."
    pnpm install
    print_success "依赖已安装"

    # 5. TypeScript 类型检查
    print_info "运行 TypeScript 类型检查..."
    if npx tsc --noEmit; then
        print_success "类型检查通过"
    else
        print_error "类型检查失败，请修复错误后重试"
        exit 1
    fi

    # 6. 构建项目
    print_info "构建项目..."
    pnpm build
    print_success "项目已构建"

    # 7. 检查服务状态
    print_info "检查服务状态..."
    if pm2 list | grep -q "gytl-tools"; then
        print_info "服务正在运行，准备重新加载..."
        pm2 reload gytl-tools
        print_success "服务已重新加载"
    else
        print_warning "服务未运行，准备启动..."
        pm2 start npm --name "gytl-tools" -- start
        print_success "服务已启动"
    fi

    # 8. 保存 PM2 配置
    pm2 save

    # 9. 显示服务状态
    print_header "部署完成"
    print_info "服务状态："
    pm2 status

    print_info "最新日志："
    pm2 logs gytl-tools --lines 20 --nostream

    print_success "部署成功！"
    print_info "访问 http://localhost:5000 查看应用"
}

# 运行主函数
main
