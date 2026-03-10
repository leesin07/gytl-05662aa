# Mac + Vercel 部署快速参考

> ⚡ 从下载代码到完成部署的最快路径

---

## 📋 预检查

```bash
# 检查环境
node --version   # 需要 v24.x
pnpm --version   # 需要 v9.x
git --version    # 需要 v2.x

# 如果缺少 pnpm，运行：
npm install -g pnpm
```

---

## 🚀 两种方式获取代码

### 方式一：Git Clone（推荐）

```bash
# 1. 创建目录
cd ~/Desktop/gytl-tools

# 2. Clone 代码（替换为你的仓库地址）
git clone https://github.com/leesin07/gytl-tools.git .

# 3. 验证
ls -la
```

### 方式二：下载解压

```bash
# 1. 下载
curl -L -o gytl-tools.tar.gz https://github.com/leesin07/gytl-tools/archive/refs/tags/v1.1.0.tar.gz

# 2. 解压
tar -xzf gytl-tools.tar.gz
mv gytl-tools-1.1.0/* .

# 3. 清理
rm gytl-tools.tar.gz
rm -rf gytl-tools-1.1.0

# 4. 初始化 Git
git init
git remote add origin https://github.com/leesin07/gytl-tools.git
```

---

## 💻 本地测试

```bash
# 安装依赖（2-5分钟）
pnpm install

# 类型检查
npx tsc --noEmit

# 构建
pnpm build

# 运行（在另一个终端）
pnpm dev
```

访问：http://localhost:5000

---

## 📤 推送到 GitHub

```bash
# 查看状态
git status

# 提交更改
git add .
git commit -m "Deploy v1.1.0"

# 推送（需要 GitHub Personal Access Token）
git push origin main

# 如果需要认证：
# Username: leesin07
# Password: your-personal-access-token（不是密码！）
```

**如何获取 Personal Access Token：**
1. 访问 https://github.com/settings/tokens
2. Generate new token → 选择 `repo` 权限 → 生成并复制

---

## 🌐 Vercel 部署

### 网页部署（最简单）

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New" → "Project"
3. 选择你的仓库 → Import
4. 保持默认配置 → Deploy
5. 等待 2-5 分钟

### CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel
```

---

## ✅ 验证部署

```bash
# 查看部署状态
vercel list

# 访问应用
# https://gytl-tools-abc123.vercel.app
```

---

## 🔄 更新流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 本地测试
pnpm install && pnpm build && pnpm dev

# 3. 提交更改
git add .
git commit -m "Update feature"
git push origin main

# 4. Vercel 自动部署（无需操作）
```

---

## ❓ 版本覆盖？

**是的，Vercel 会覆盖旧版本！**

- ✅ 可以回滚到任何历史版本
- ✅ 每次部署都有记录
- ✅ 预览部署不影响生产环境

**回滚方法：**
```bash
# 方式一：网页界面
Vercel Dashboard → Deployments → 选择旧版本 → Promote to Production

# 方式二：CLI
vercel list
vercel rollback <deployment-url>
```

---

## 🔥 完整命令清单

```bash
# ========== 从零开始 ==========
git clone https://github.com/leesin07/gytl-tools.git .
pnpm install
pnpm build
pnpm dev

# ========== 推送到 GitHub ==========
git add .
git commit -m "Deploy v1.1.0"
git push origin main

# ========== Vercel 部署 ==========
# 访问 https://vercel.com/dashboard
# 导入仓库并部署

# ========== 更新迭代 ==========
git pull origin main
# 修改代码...
pnpm install && pnpm build && pnpm dev
git add .
git commit -m "Update feature"
git push origin main
# Vercel 自动部署

# ========== 查看状态 ==========
vercel list
git status
git log --oneline -5

# ========== 回滚 ==========
vercel list
vercel rollback <deployment-url>
```

---

## 📚 详细文档

- 📖 [完整部署指引](./MAC_VERCEL_DEPLOYMENT.md) - 详细的步骤说明
- 🔧 [迭代部署指引](./ITERATION_GUIDE.md) - 更新迭代流程
- 📋 [部署前检查清单](./DEPLOYMENT_CHECKLIST.md) - 部署前必查项

---

**最后更新：2024-03-06**
**版本：v1.0.0**
