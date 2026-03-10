# GYTL-Tools 迭代部署指引

> 本文档详细说明如何在生产环境中安全、高效地更新迭代 GYTL-Tools 系统，避免之前遇到的部署问题。

---

## 📋 目录

1. [迭代部署概述](#迭代部署概述)
2. [前置准备](#前置准备)
3. [标准迭代流程](#标准迭代流程)
4. [本地更新和测试](#本地更新和测试)
5. [Git 提交和推送](#git-提交和推送)
6. [不同部署环境的更新](#不同部署环境的更新)
7. [常见问题预防](#常见问题预防)
8. [回滚策略](#回滚策略)
9. [CI/CD 自动化建议](#cicd-自动化建议)
10. [检查清单](#检查清单)

---

## 📌 迭代部署概述

### 目标
- ✅ 安全更新代码
- ✅ 最小化停机时间
- ✅ 快速回滚能力
- ✅ 避免之前遇到的部署问题

### 之前遇到的部署问题回顾

| 问题 | 原因 | 预防措施 |
|------|------|---------|
| TypeScript 编译错误 | 变量未初始化就使用 | 更新前运行 `npx tsc --noEmit` |
| Vercel 构建失败 | 未使用的 assets/ 目录 | 排除无关文件，使用 .dockerignore |
| Git push 鉴权失败 | 密码认证被弃用 | 使用 Personal Access Token |
| SSL 超时 | HTTP/2 兼容性问题 | 禁用 HTTP/2 或使用 SSH |
| SSH 目录不存在 | 未生成 SSH 密钥 | 提前生成并配置 SSH |

---

## 🛠️ 前置准备

### 1. 环境检查清单

在开始更新前，请确保：

- [ ] 本地 Node.js 版本：24.x
- [ ] 本地 pnpm 版本：9.x
- [ ] 已安装 Git
- [ ] 有服务器访问权限（SSH 或密码）
- [ ] 有 GitHub 仓库访问权限
- [ ] 备份了当前生产环境的数据（数据库、配置文件）

### 2. 安装必要的工具

```bash
# 检查 Node.js 版本
node --version  # 应该是 v24.x

# 检查 pnpm 版本
pnpm --version  # 应该是 9.x

# 检查 Git 版本
git --version

# 如果没有 pnpm，安装它
npm install -g pnpm
```

### 3. 创建备份脚本

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/workspace/backups/gytl-tools-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "开始备份..."

# 备份数据库（如果有）
# pg_dump -U username -d gytl_tools > "$BACKUP_DIR/database.sql"

# 备份配置文件
cp /workspace/projects/.env "$BACKUP_DIR/" 2>/dev/null

# 备份构建文件
cp -r /workspace/projects/.next "$BACKUP_DIR/" 2>/dev/null

echo "备份完成: $BACKUP_DIR"
```

```bash
# 赋予执行权限
chmod +x scripts/backup.sh

# 运行备份
./scripts/backup.sh
```

---

## 🔄 标准迭代流程

### 流程图

```
本地开发 → 代码审查 → 本地测试 → Git 提交 → 推送到远程 → 自动部署/手动部署 → 生产验证
    ↑                                                                                                      ↓
    └─────────────────────────────────── 回滚（如果失败） ───────────────────────────────────────────────┘
```

### 详细步骤

#### Step 1: 创建新分支

```bash
# 进入项目目录
cd /workspace/projects

# 拉取最新代码
git pull origin main

# 创建功能分支
git checkout -b feature/your-feature-name

# 示例：git checkout -b feature/add-data-source-indicator
```

#### Step 2: 本地开发和测试

参考 [本地更新和测试](#本地更新和测试) 部分

#### Step 3: Git 提交

参考 [Git 提交和推送](#git-提交和推送) 部分

#### Step 4: 推送到远程并创建 PR

```bash
# 推送分支到远程
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

#### Step 5: 部署到生产环境

参考 [不同部署环境的更新](#不同部署环境的更新) 部分

#### Step 6: 生产验证

参考 [生产验证](#生产验证) 部分

---

## 💻 本地更新和测试

### 1. 安装依赖

```bash
cd /workspace/projects

# 安装新依赖（如果有）
pnpm install

# 或者更新所有依赖（谨慎使用）
pnpm update
```

### 2. 代码修改

修改代码时请注意：
- 遵循现有的代码风格
- 添加必要的注释
- 更新相关文档

### 3. 本地构建测试

**重要：在部署前必须进行完整测试**

#### 3.1 TypeScript 类型检查

```bash
# 检查 TypeScript 类型错误
npx tsc --noEmit

# 如果有错误，必须全部修复后再继续
```

#### 3.2 本地启动测试

```bash
# 启动开发服务器
pnpm dev

# 在浏览器中访问 http://localhost:5000
# 测试所有功能：
# - 数据加载
# - 筛选功能
# - 搜索功能
# - 资金管理
# - 数据来源标识
```

#### 3.3 生产构建测试

```bash
# 构建生产版本
pnpm build

# 如果构建失败，检查错误信息并修复
```

#### 3.4 API 接口测试（如果有 API）

```bash
# 测试股票列表 API
curl -s http://localhost:5000/api/stocks/list | jq '.metadata.dataSource'

# 应该返回：
# - "real" （真实环境）
# - "mock" （沙箱环境）
```

### 4. 测试检查清单

- [ ] TypeScript 类型检查通过
- [ ] 本地开发服务器正常启动
- [ ] 所有页面正常加载
- [ ] 数据来源标识正确显示
- [ ] 筛选功能正常工作
- [ ] 搜索功能正常工作
- [ ] 资金管理功能正常工作
- [ ] 生产构建成功
- [ ] API 接口返回正确

---

## 📤 Git 提交和推送

### 1. 检查更改

```bash
# 查看所有更改的文件
git status

# 查看具体更改
git diff

# 查看暂存的更改
git diff --staged
```

### 2. 添加文件到暂存区

```bash
# 添加所有更改
git add .

# 或者只添加特定文件
git add src/app/page.tsx src/app/api/stocks/list/route.ts

# 添加文档
git add README.md CHANGELOG.md
```

### 3. 提交更改

```bash
# 使用有意义的提交信息（遵循 Conventional Commits）
git commit -m "feat: 添加数据来源实时/模拟区分标识功能"

# 或
git commit -m "fix: 修复资金管理页面6个功能问题"

# 或
git commit -m "docs: 更新部署文档"

# 带详细描述的提交
git commit -m "feat: 添加数据来源标识

- API 响应添加 metadata 字段
- 前页面显示数据来源卡片
- 支持手动重新连接功能

Closes #123"
```

### 4. 推送到远程（避免之前遇到的问题）

#### 问题预防：使用 HTTPS + Personal Access Token

```bash
# 如果使用 HTTPS
# 1. 生成 GitHub Personal Access Token
#    访问：https://github.com/settings/tokens
#    选择：repo 权限
#    生成并复制 token

# 2. 使用 token 推送（推荐使用 credential helper）
git remote set-url origin https://<your-token>@github.com/leesin07/gytl-tools.git

# 3. 推送
git push origin feature/your-feature-name
```

#### 问题预防：使用 SSH

```bash
# 如果使用 SSH（推荐用于生产环境）

# 1. 检查 SSH 密钥是否存在
ls -la ~/.ssh/id_rsa.pub

# 2. 如果不存在，生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
# 按提示操作，默认配置即可

# 3. 添加密钥到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

# 4. 复制公钥
cat ~/.ssh/id_rsa.pub

# 5. 将公钥添加到 GitHub
#    Settings → SSH and GPG keys → New SSH key

# 6. 测试 SSH 连接
ssh -T git@github.com

# 7. 设置远程仓库为 SSH
git remote set-url origin git@github.com:leesin07/gytl-tools.git

# 8. 推送
git push origin feature/your-feature-name
```

#### 问题预防：处理 SSL 超时

```bash
# 如果遇到 SSL 超时问题

# 方法1：禁用 HTTP/2
git config --global http."https://github.com".version HTTP/1.1

# 方法2：增加超时时间
git config --global http.postBuffer 524288000

# 方法3：使用 SSH（推荐）
git remote set-url origin git@github.com:leesin07/gytl-tools.git
```

### 5. 创建 Pull Request

```bash
# 使用 GitHub CLI 创建 PR
gh pr create --title "添加数据来源标识功能" --body "详细说明..."

# 或者在 GitHub 网页上创建
# 访问：https://github.com/leesin07/gytl-tools/pulls
# 点击 "New pull request"
```

---

## 🚀 不同部署环境的更新

### 方案 1：云服务器部署（推荐）

#### 更新步骤

```bash
# 1. SSH 连接到服务器
ssh user@your-server-ip

# 2. 进入项目目录
cd /path/to/gytl-tools

# 3. 拉取最新代码
git pull origin main

# 4. 备份当前版本（重要！）
./scripts/backup.sh

# 5. 安装依赖（如果有新依赖）
pnpm install

# 6. 构建项目
pnpm build

# 7. 停止旧服务（使用 PM2）
pm2 stop gytl-tools

# 8. 启动新服务
pm2 start npm --name "gytl-tools" -- start

# 9. 保存 PM2 配置
pm2 save

# 10. 查看服务状态
pm2 status
pm2 logs gytl-tools --lines 50
```

#### 零停机部署（使用 PM2 集群模式）

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
pnpm install

# 3. 构建项目
pnpm build

# 4. 使用 PM2 重新加载（零停机）
pm2 reload gytl-tools

# 5. 查看服务状态
pm2 status
```

#### 使用 Docker 更新

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建镜像
docker build -t gytl-tools:latest .

# 3. 停止旧容器
docker stop gytl-tools

# 4. 删除旧容器
docker rm gytl-tools

# 5. 启动新容器
docker run -d \
  --name gytl-tools \
  -p 5000:5000 \
  --restart unless-stopped \
  gytl-tools:latest

# 6. 查看容器日志
docker logs -f gytl-tools
```

#### 使用 Docker Compose 更新

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并启动
docker-compose down
docker-compose up -d --build

# 3. 查看日志
docker-compose logs -f
```

### 方案 2：Vercel 部署（最简单）

#### 自动部署（推荐）

```bash
# Vercel 会在每次推送到 main 分支时自动部署
# 只需合并 PR 到 main 分支即可

# 1. 创建 Pull Request
gh pr create --title "新功能" --body "详细说明..."

# 2. 合并 PR（Vercel 会自动部署）
# 在 GitHub 上点击 "Merge pull request"

# 3. 等待 Vercel 部署完成
# 访问 Vercel Dashboard 查看部署状态
```

#### 手动部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署到预览环境
vercel

# 4. 部署到生产环境
vercel --prod
```

#### Vercel 部署问题预防

**问题：未使用的文件导致构建失败**

```dockerfile
# .dockerignore（确保添加）
node_modules
.next
.git
.env.local
.env.*.local
assets/
*.log
```

**问题：环境变量缺失**

```bash
# 在 Vercel 项目设置中配置环境变量
# Settings → Environment Variables

# 必需的环境变量（如果有）
# NEXT_PUBLIC_API_URL
# DATABASE_URL
```

### 方案 3：Kubernetes 部署

```bash
# 1. 更新镜像版本
# 修改 deployment.yaml 中的镜像版本

# 2. 应用更新
kubectl apply -f k8s/deployment.yaml

# 3. 查看部署状态
kubectl rollout status deployment/gytl-tools

# 4. 查看日志
kubectl logs -f deployment/gytl-tools
```

---

## 🛡️ 常见问题预防

### 1. TypeScript 编译错误

**问题：** `Variable 'response' is used before being assigned`

**预防：**
```bash
# 在部署前运行类型检查
npx tsc --noEmit

# 如果有错误，必须全部修复
```

**修复示例：**
```typescript
// ❌ 错误写法
let response: Response;

try {
  response = await fetch(url);
} catch (error) {
  console.error(error);
}
// response 可能未初始化

// ✅ 正确写法
let response: Response | null = null;

try {
  response = await fetch(url);
} catch (error) {
  console.error(error);
}

if (response && response.ok) {
  // 安全使用 response
}
```

### 2. 构建失败

**问题：** 无法找到某些文件或资源

**预防：**
```bash
# 检查构建输出
pnpm build

# 查看构建日志
# 确保没有错误或警告
```

**常见原因和解决：**
```bash
# 1. 移除未使用的文件
rm -rf assets/
rm -rf public/*.png

# 2. 更新依赖
pnpm install

# 3. 清理缓存
rm -rf .next
rm -rf node_modules/.cache

# 4. 重新构建
pnpm build
```

### 3. Git 推送失败

**问题：** 鉴权失败、SSL 超时、SSH 连接失败

**预防：**
```bash
# 1. 使用 HTTPS + Personal Access Token
git remote set-url origin https://<token>@github.com/user/repo.git

# 2. 或使用 SSH
git remote set-url origin git@github.com:user/repo.git

# 3. 禁用 HTTP/2（如果 SSL 超时）
git config --global http."https://github.com".version HTTP/1.1

# 4. 增加 Git 缓冲区
git config --global http.postBuffer 524288000
```

### 4. 服务器部署失败

**问题：** 服务启动失败、端口占用

**预防：**
```bash
# 1. 检查端口是否被占用
lsof -i:5000
# 或
ss -lptn 'sport = :5000'

# 2. 如果端口被占用，停止旧服务
pm2 stop gytl-tools

# 3. 启动新服务
pm2 start npm --name "gytl-tools" -- start

# 4. 查看日志
pm2 logs gytl-tools --lines 50
```

### 5. 数据丢失

**问题：** 更新后数据丢失或配置错误

**预防：**
```bash
# 1. 更新前备份数据
./scripts/backup.sh

# 2. 备份环境变量文件
cp .env .env.backup

# 3. 备份数据库（如果有）
pg_dump -U username -d gytl_tools > database.sql

# 4. 确认备份成功
ls -lh /workspace/backups/
```

---

## ⏪ 回滚策略

### 快速回滚（Git）

```bash
# 查看最近的提交
git log --oneline -10

# 回滚到上一个版本
git revert HEAD

# 或回滚到特定版本
git revert <commit-hash>

# 推送回滚
git push origin main

# 重新部署
pm2 restart gytl-tools
```

### 使用 PM2 回滚

```bash
# 查看应用列表
pm2 list

# 停止当前版本
pm2 stop gytl-tools

# 删除当前版本
pm2 delete gytl-tools

# 检出上一个版本
git checkout <previous-tag>

# 重新部署
pnpm install
pnpm build
pm2 start npm --name "gytl-tools" -- start
```

### 使用 Docker 回滚

```bash
# 查看可用的镜像
docker images | grep gytl-tools

# 停止当前容器
docker stop gytl-tools

# 删除当前容器
docker rm gytl-tools

# 启动旧版本容器
docker run -d \
  --name gytl-tools \
  -p 5000:5000 \
  gytl-tools:v1.0.0  # 使用旧版本标签
```

### 数据库回滚（如果有）

```bash
# 恢复数据库备份
psql -U username -d gytl_tools < /workspace/backups/gytl-tools-20240306-140532/database.sql
```

---

## 🤖 CI/CD 自动化建议

### GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '24'
        cache: 'pnpm'

    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 9

    - name: Install dependencies
      run: pnpm install

    - name: Type check
      run: npx tsc --noEmit

    - name: Build
      run: pnpm build

    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/gytl-tools
          git pull origin main
          pnpm install
          pnpm build
          pm2 reload gytl-tools
```

### 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：
- `SERVER_HOST`: 服务器 IP 地址
- `SERVER_USER`: 服务器用户名
- `SSH_PRIVATE_KEY`: SSH 私钥

---

## ✅ 检查清单

### 更新前检查

- [ ] 已阅读本次更新的说明文档
- [ ] 已备份当前生产环境和数据
- [ ] 已在本地完成所有测试
- [ ] TypeScript 类型检查通过
- [ ] 生产构建成功
- [ ] 已更新相关文档
- [ ] 已通知团队成员（如果需要）

### 更新中检查

- [ ] Git 提交信息规范且清晰
- [ ] 代码已推送到远程仓库
- [ ] Pull Request 已审查并合并
- [ ] 服务已成功部署
- [ ] 服务运行正常（无错误日志）

### 更新后验证

- [ ] 所有页面正常加载
- [ ] 数据来源标识正确显示
- [ ] 所有功能正常工作
- [ ] API 接口返回正确数据
- [ ] 日志中无错误信息
- [ ] 性能符合预期
- [ ] 已通知用户（如果需要）

---

## 📞 问题排查

### 部署失败

1. 查看部署日志
2. 检查服务器资源（CPU、内存、磁盘）
3. 验证环境变量配置
4. 检查网络连接
5. 查看 GitHub Actions 日志（如果使用 CI/CD）

### 功能异常

1. 查看应用日志
2. 检查 API 响应
3. 验证数据来源（实时/模拟）
4. 检查浏览器控制台错误
5. 对比本地环境和生产环境

### 性能问题

1. 检查服务器负载
2. 查看应用响应时间
3. 检查数据库查询（如果有）
4. 优化缓存策略
5. 考虑使用 CDN

---

## 📚 相关文档

- [真实 API 对接说明](./REAL_API_GUIDE.md)
- [API 状态说明](./API_STATUS.md)
- [云服务器部署指南](./CLOUD_DEPLOYMENT_GUIDE.md)
- [GitHub 部署指南](./GITHUB_DEPLOYMENT_GUIDE.md)
- [部署前检查清单](./DEPLOYMENT_CHECKLIST.md)

---

**文档版本：v1.0.0**
**最后更新：2024-03-06**
**维护者：GYTL-Tools Team**
