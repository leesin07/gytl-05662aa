# GYTL-Tools 迭代部署快速指引

> 本文档提供最简化的迭代部署操作步骤，帮助你快速安全地更新系统。

---

## 🚀 快速开始（推荐）

### 1. 一键更新部署

```bash
# 进入项目目录
cd /workspace/projects

# 拉取最新代码
git pull origin main

# 运行快速部署脚本
./scripts/quick-deploy.sh
```

就这么简单！脚本会自动完成：
- ✅ 拉取最新代码
- ✅ 创建备份
- ✅ 安装依赖
- ✅ 类型检查
- ✅ 构建项目
- ✅ 重新加载服务

### 2. 部署前测试（推荐）

```bash
# 运行部署前测试
./scripts/pre-deploy-test.sh
```

测试内容包括：
- TypeScript 类型检查
- 项目构建测试
- 功能测试（首页、API、性能）

### 3. 快速回滚（如果需要）

```bash
# 运行快速回滚脚本
./scripts/quick-rollback.sh
```

---

## 📋 完整流程（生产环境）

### Step 1: 环境准备

```bash
# 检查 Node.js 版本
node --version  # 应该是 v24.x

# 检查 pnpm 版本
pnpm --version  # 应该是 9.x
```

### Step 2: 备份当前版本

```bash
# 创建备份
mkdir -p /workspace/backups
cp -r /workspace/projects/.next /workspace/backups/$(date +%Y%m%d-%H%M%S)/
```

### Step 3: 拉取最新代码

```bash
git pull origin main
```

### Step 4: 安装依赖

```bash
pnpm install
```

### Step 5: 类型检查

```bash
npx tsc --noEmit
```

如果有错误，必须全部修复后再继续。

### Step 6: 构建项目

```bash
pnpm build
```

### Step 7: 重新部署服务

```bash
# 使用 PM2 重新加载（零停机）
pm2 reload gytl-tools

# 或停止并启动
pm2 stop gytl-tools
pm2 start npm --name "gytl-tools" -- start
pm2 save
```

### Step 8: 验证部署

```bash
# 检查服务状态
pm2 status

# 查看日志
pm2 logs gytl-tools --lines 50

# 访问首页
curl -I http://localhost:5000

# 测试 API
curl -s http://localhost:5000/api/stocks/list | jq '.metadata'
```

---

## ⚠️ 常见问题预防

### 问题 1: TypeScript 类型错误

**预防：** 部署前运行类型检查

```bash
npx tsc --noEmit
```

**解决：** 修复所有类型错误后再部署

### 问题 2: Git 推送失败

**预防：** 使用 Personal Access Token

```bash
# 设置远程仓库使用 token
git remote set-url origin https://<token>@github.com/username/repo.git

# 或使用 SSH
git remote set-url origin git@github.com:username/repo.git
```

### 问题 3: 服务启动失败

**预防：** 检查端口占用

```bash
# 检查端口 5000 是否被占用
lsof -i:5000
# 或
ss -lptn 'sport = :5000'

# 如果被占用，停止旧服务
pm2 stop gytl-tools
```

### 问题 4: 数据丢失

**预防：** 部署前备份

```bash
# 备份构建文件
cp -r .next /workspace/backups/

# 备份环境变量
cp .env /workspace/backups/
```

---

## 🔧 使用工具脚本

### 快速部署脚本

```bash
./scripts/quick-deploy.sh
```

**功能：**
- 自动拉取代码
- 自动创建备份
- 自动安装依赖
- 自动类型检查
- 自动构建
- 自动重新加载服务

### 部署前测试脚本

```bash
./scripts/pre-deploy-test.sh
```

**功能：**
- TypeScript 类型检查
- 项目构建测试
- 功能测试（4 项）
- 显示测试结果

### 快速回滚脚本

```bash
./scripts/quick-rollback.sh
```

**功能：**
- 显示最近的提交
- 选择回滚版本
- 自动回滚代码
- 自动重新构建
- 自动重启服务

### API 连接测试脚本

```bash
node scripts/test-api.js
```

**功能：**
- 测试东方财富 API 连接
- 显示连接状态
- 显示返回的股票数据

---

## 📝 标准工作流程

### 日常更新流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 部署前测试
./scripts/pre-deploy-test.sh

# 3. 如果测试通过，快速部署
./scripts/quick-deploy.sh

# 4. 验证部署
curl -I http://localhost:5000
```

### 紧急修复流程

```bash
# 1. 快速修复
vim src/app/page.tsx

# 2. 测试
./scripts/pre-deploy-test.sh

# 3. 部署
./scripts/quick-deploy.sh
```

### 回滚流程

```bash
# 1. 快速回滚
./scripts/quick-rollback.sh

# 2. 验证
curl -I http://localhost:5000

# 3. 查看日志
pm2 logs gytl-tools --lines 50
```

---

## ✅ 检查清单

### 部署前

- [ ] 已备份当前版本
- [ ] 已拉取最新代码
- [ ] TypeScript 类型检查通过
- [ ] 项目构建成功
- [ ] 已运行部署前测试

### 部署中

- [ ] 依赖安装成功
- [ ] 构建成功
- [ ] 服务启动成功
- [ ] 无错误日志

### 部署后

- [ ] 服务状态正常
- [ ] 首页可访问
- [ ] API 响应正常
- [ ] 数据来源标识正确
- [ ] 所有功能正常工作

---

## 📞 问题排查

### 服务无法访问

```bash
# 检查服务状态
pm2 status

# 查看日志
pm2 logs gytl-tools --lines 50

# 检查端口
lsof -i:5000
```

### 构建失败

```bash
# 清理缓存
rm -rf .next
rm -rf node_modules/.cache

# 重新构建
pnpm build
```

### 类型错误

```bash
# 查看类型错误
npx tsc --noEmit

# 修复所有错误后再构建
```

---

## 📚 相关文档

- [迭代部署指引（完整版）](./ITERATION_DEPLOYMENT_GUIDE.md)
- [工具脚本使用指南](./SCRIPTS_GUIDE.md)
- [部署前检查清单](./DEPLOYMENT_CHECKLIST.md)
- [版本历史](./VERSION.md)
- [变更日志](./CHANGELOG.md)

---

## 🎯 下一步

1. 阅读完整的 [迭代部署指引](./ITERATION_DEPLOYMENT_GUIDE.md)
2. 熟悉 [工具脚本使用指南](./SCRIPTS_GUIDE.md)
3. 了解 [版本历史](./VERSION.md) 和 [变更日志](./CHANGELOG.md)

---

**当前版本：v1.1.0**
**文档版本：v1.0.0**
**最后更新：2024-03-06**
