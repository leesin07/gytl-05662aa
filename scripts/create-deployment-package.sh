#!/bin/bash

# GYTL-Tools 部署包打包脚本
# 用于生成可部署的压缩包

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

# 获取当前版本
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')

# 创建临时目录
TEMP_DIR=$(mktemp -d)
DIST_DIR="$TEMP_DIR/gytl-tools-v$VERSION"

print_header "GYTL-Tools 部署包打包"

print_info "版本: $VERSION"
print_info "临时目录: $TEMP_DIR"
print_info "分发目录: $DIST_DIR"

# 创建分发目录结构
mkdir -p "$DIST_DIR"
mkdir -p "$DIST_DIR/src"
mkdir -p "$DIST_DIR/public"
mkdir -p "$DIST_DIR/scripts"
mkdir -p "$DIST_DIR/docs"

print_info "复制文件..."

# 复制核心文件
cp package.json "$DIST_DIR/"
cp pnpm-lock.yaml "$DIST_DIR/"
cp tsconfig.json "$DIST_DIR/"
cp next.config.js "$DIST_DIR/"
cp .coze "$DIST_DIR/"
cp tailwind.config.ts "$DIST_DIR/"
cp .babelrc "$DIST_DIR/"

# 复制源代码
print_info "复制源代码..."
cp -r src/app "$DIST_DIR/src/"
cp -r src/components "$DIST_DIR/src/"
cp -r src/lib "$DIST_DIR/src/"
cp -r src/types "$DIST_DIR/src/"

# 复制静态资源
print_info "复制静态资源..."
if [ -d "public" ]; then
    cp -r public/* "$DIST_DIR/public/" 2>/dev/null || true
fi

# 复制脚本
print_info "复制脚本..."
cp scripts/build.sh "$DIST_DIR/scripts/"
cp scripts/start.sh "$DIST_DIR/scripts/"
cp scripts/dev.sh "$DIST_DIR/scripts/"
cp scripts/test-api.js "$DIST_DIR/scripts/"
cp scripts/quick-deploy.sh "$DIST_DIR/scripts/"
cp scripts/pre-deploy-test.sh "$DIST_DIR/scripts/"
cp scripts/quick-rollback.sh "$DIST_DIR/scripts/"

# 赋予脚本执行权限
chmod +x "$DIST_DIR/scripts"/*.sh

# 复制文档
print_info "复制文档..."
cp README.md "$DIST_DIR/"
cp CHANGELOG.md "$DIST_DIR/"
cp VERSION.md "$DIST_DIR/docs/"
cp ITERATION_QUICK_START.md "$DIST_DIR/docs/"
cp SCRIPTS_GUIDE.md "$DIST_DIR/docs/"

# 创建部署说明文件
cat > "$DIST_DIR/DEPLOYMENT_README.md" << 'EOF'
# GYTL-Tools 部署说明

## 快速部署

```bash
# 1. 安装依赖
pnpm install

# 2. 构建项目
pnpm build

# 3. 启动服务
pnpm start
```

## 使用 PM2 管理

```bash
# 启动服务
pm2 start npm --name "gytl-tools" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs gytl-tools

# 重启服务
pm2 restart gytl-tools
```

## 详细文档

- README.md - 项目介绍
- docs/VERSION.md - 版本历史
- docs/ITERATION_QUICK_START.md - 快速开始
- docs/SCRIPTS_GUIDE.md - 脚本使用指南
EOF

# 创建 .dockerignore
cat > "$DIST_DIR/.dockerignore" << 'EOF'
node_modules
.next
.git
.env.local
.env.*.local
.DS_Store
*.log
EOF

# 创建 .gitignore
cat > "$DIST_DIR/.gitignore" << 'EOF'
node_modules
.next
.env
.env.local
.env.*.local
.DS_Store
*.log
dist
build
EOF

print_success "文件复制完成"

# 创建压缩包
print_info "创建压缩包..."
cd "$TEMP_DIR"
tar -czf "gytl-tools-v$VERSION.tar.gz" "gytl-tools-v$VERSION"
cd - > /dev/null

# 计算哈希值
HASH=$(sha256sum "$TEMP_DIR/gytl-tools-v$VERSION.tar.gz" | awk '{print $1}')

# 移动压缩包到项目根目录
cp "$TEMP_DIR/gytl-tools-v$VERSION.tar.gz" ./gytl-tools-v$VERSION.tar.gz
echo "$HASH  gytl-tools-v$VERSION.tar.gz" > ./gytl-tools-v$VERSION.tar.gz.sha256

# 清理临时目录
rm -rf "$TEMP_DIR"

# 显示结果
print_header "打包完成"
print_success "部署包已创建: gytl-tools-v$VERSION.tar.gz"
print_info "文件大小: $(du -h ./gytl-tools-v$VERSION.tar.gz | awk '{print $1}')"
print_info "SHA256: $HASH"
print_info ""
print_info "验证哈希:"
echo "sha256sum gytl-tools-v$VERSION.tar.gz"
print_info ""
print_info "下一步:"
echo "1. 上传部署包到服务器"
echo "2. 在服务器上解压"
echo "3. 运行 pnpm install"
echo "4. 运行 pnpm build"
echo "5. 运行 pnpm start"

print_success "打包完成！"
