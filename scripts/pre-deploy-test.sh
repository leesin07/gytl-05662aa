#!/bin/bash

# GYTL-Tools 部署前测试脚本
# 用于在部署前进行全面测试

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\3[1;33m'
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
}

# 测试统计
PASSED=0
FAILED=0
TOTAL=0

# 测试函数
run_test() {
    TOTAL=$((TOTAL + 1))
    TEST_NAME=$1
    TEST_COMMAND=$2

    echo -n "测试 $TOTAL: $TEST_NAME ... "

    if eval "$TEST_COMMAND"; then
        print_success "通过"
        PASSED=$((PASSED + 1))
    else
        print_error "失败"
        FAILED=$((FAILED + 1))
    fi
}

# 主函数
main() {
    print_header "GYTL-Tools 部署前测试"

    # 1. TypeScript 类型检查
    print_info "TypeScript 类型检查..."
    if npx tsc --noEmit; then
        print_success "类型检查通过"
    else
        print_error "类型检查失败，请修复错误"
        exit 1
    fi

    # 2. 项目构建测试
    print_info "项目构建测试..."
    if pnpm build; then
        print_success "构建成功"
    else
        print_error "构建失败"
        exit 1
    fi

    # 3. 启动开发服务器（后台）
    print_info "启动开发服务器..."
    pnpm dev > /tmp/gytl-tools-test.log 2>&1 &
    DEV_PID=$!
    sleep 10  # 等待服务器启动

    print_header "功能测试"

    # 4. 测试首页加载
    run_test "首页可访问" "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000 | grep -q '200'"

    # 5. 测试 API 响应
    run_test "API 返回数据" "curl -s http://localhost:5000/api/stocks/list | grep -q 'success'"

    # 6. 测试数据源标识
    run_test "API 返回 metadata" "curl -s http://localhost/stocks/list | grep -q 'metadata'"

    # 7. 测试服务健康状态
    run_test "服务响应时间 < 5s" "curl -s -o /dev/null -w '%{time_total}' http://localhost:5000 | awk '{print int($1*1000) < 5000}'"

    # 停止开发服务器
    kill $DEV_PID 2>/dev/null || true
    print_success "测试服务器已停止"

    # 显示测试结果
    print_header "测试结果"
    echo "总测试数: $TOTAL"
    print_success "通过: $PASSED"
    if [ $FAILED -gt 0 ]; then
        print_error "失败: $FAILED"
        exit 1
    else
        print_success "所有测试通过，可以部署！"
    fi
}

# 运行主函数
main
