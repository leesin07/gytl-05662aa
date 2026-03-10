#!/bin/bash

# GYTL-Tools 快速回滚脚本
# 用于在部署失败时快速回滚到上一个版本

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

# 主函数
main() {
    print_header "GYTL-Tools 快速回滚"

    # 1. 显示最近的提交
    print_info "最近的提交："
    git log --oneline -10

    echo ""
    print_info "选择要回滚到的版本："
    echo "1. 回滚到上一个版本"
    echo "2. 回滚到指定版本"
    echo "0. 取消"

    read -p "请选择 [0-2]: " choice

    case $choice in
        1)
            COMMIT_HASH="HEAD~1"
            ;;
        2)
            read -p "请输入提交哈希或标签: " COMMIT_HASH
            ;;
        0)
            print_info "已取消"
            exit 0
            ;;
        *)
            print_error "无效选择"
            exit 1
            ;;
    esac

    # 2. 确认回滚
    print_warning "即将回滚到: $COMMIT_HASH"
    read -p "确认回滚? [y/N]: " confirm

    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "已取消"
        exit 0
    fi

    # 3. 停止服务
    print_info "停止服务..."
    pm2 stop gytl-tools
    print_success "服务已停止"

    # 4. 回滚代码
    print_info "回滚代码..."
    git reset --hard $COMMIT_HASH
    print_success "代码已回滚"

    # 5. 恢复依赖（如果需要）
    print_info "安装依赖..."
    pnpm install
    print_success "依赖已安装"

    # 6. 重新构建
    print_info "重新构建..."
    pnpm build
    print_success "项目已构建"

    # 7. 启动服务
    print_info "启动服务..."
    pm2 start npm --name "gytl-tools" -- start
    pm2 save
    print_success "服务已启动"

    # 8. 显示服务状态
    print_header "回滚完成"
    print_info "服务状态："
    pm2 status

    print_info "当前版本："
    git log --oneline -1

    print_success "回滚成功！"
}

# 运行主函数
main
