# Mac 本地 + GitHub + Vercel 部署完整指引

> 本文档专门针对 Mac 用户，提供从本地开发到 Vercel 部署的完整步骤说明。

---

## 📋 目录

1. [前置准备](#前置准备)
2. [方式一：从 GitHub Clone（推荐）](#方式一从-github-clone推荐)
3. [方式二：下载部署包解压](#方式二下载部署包解压)
4. [本地测试](#本地测试)
5. [推送到 GitHub](#推送到-github)
6. [Vercel 部署](#vercel-部署)
7. [关于版本覆盖](#关于版本覆盖)
8. [更新迭代流程](#更新迭代流程)

---

## 🛠️ 前置准备

### 检查 Mac 环境

打开「终端」（Terminal），执行以下命令：

```bash
# 1. 检查 Node.js 版本
node --version

# 预期输出：
# v24.0.0 或更高版本

# 如果未安装或版本过低，访问 https://nodejs.org 下载安装

# 2. 检查 pnpm 版本
pnpm --version

# 预期输出：
# 9.0.0 或更高版本

# 如果未安装，运行：
npm install -g pnpm

# 3. 检查 Git 版本
git --version

# 预期输出：
# git version 2.x.x
```

### 安装必要工具

#### 1. 安装 Node.js（如果未安装）

访问 [Node.js 官网](https://nodejs.org)，下载并安装 LTS 版本（推荐 24.x）。

#### 2. 安装 pnpm（如果未安装）

```bash
npm install -g pnpm
```

#### 3. 安装 GitHub CLI（可选，但推荐）

```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 GitHub CLI
brew install gh

# 登录 GitHub
gh auth login
# 按提示操作，选择 GitHub.com，使用浏览器登录
```

---

## 方式一：从 GitHub Clone（推荐）

这是最简单的方式，直接从 GitHub 获取最新代码。

### 步骤 1：创建本地目录

```bash
# 打开终端，创建项目目录
cd ~/Desktop
mkdir gytl-tools
cd gytl-tools

# 或者使用你的工作目录
cd ~/Documents/gytl-tools
```

### 步骤 2：克隆仓库

```bash
# 替换为你的 GitHub 仓库地址
git clone https://github.com/leesin07/gytl-tools.git .

# 注意：最后的 "." 表示克隆到当前目录

# 预期输出：
# Cloning into '.'...
# remote: Enumerating objects: 1234, done.
# remote: Counting objects: 100% (1234/1234), done.
# remote: Compressing objects: 100% (567/567), done.
# remote: Total 1234 (delta 678), reused 1089 (delta 567), pack-reused 0
# Receiving objects: 100% (1234/1234), 5.2 MiB | 2.5 MiB/s, done.
# Resolving deltas: 100% (678/678), done.
```

### 步骤 3：验证文件

```bash
# 查看项目文件
ls -la

# 预期输出：
# total 200
# drwxr-xr-x  20 yourname  staff   640 Mar  6 15:00 .
# drwxr-xr-x   5 yourname  staff   160 Mar  6 15:00 ..
# -rw-r--r--   1 yourname  staff  1234 Mar  6 15:00 .babelrc
# -rw-r--r--   1 yourname  staff   567 Mar  6 15:00 .coze
# -rw-r--r--   1 yourname  staff   234 Mar  6 15:00 .git
# -rw-r--r--   1 yourname  staff   234 Mar  6 15:00 .gitignore
# -rw-r--r--   1 yourname  staff  5678 Mar  6 15:00 CHANGELOG.md
# -rw-r--r--   1 yourname  staff  7890 Mar  6 15:00 README.md
# drwxr-xr-x   3 yourname  staff    96 Mar  6 15:00 scripts
# drwxr-xr-x   5 yourname  staff   160 Mar  6 15:00 src
# -rw-r--r--   1 yourname  staff  2345 Mar  6 15:00 package.json
# -rw-r--r--   1 yourname  staff 567890 Mar  6 15:00 pnpm-lock.yaml
```

### 步骤 4：检查当前版本

```bash
# 查看 package.json 中的版本号
grep '"version"' package.json

# 预期输出：
#   "version": "1.1.0",

# 或查看 README
head -20 README.md

# 预期输出中包含：
# **最新版本：v1.1.0**
```

---

## 方式二：下载部署包解压

如果你有部署包的下载链接，可以使用这种方式。

### 步骤 1：下载部署包

打开浏览器，访问 GitHub Releases 页面：

```
https://github.com/leesin07/gytl-tools/releases
```

找到最新版本 `v1.1.0`，下载 `gytl-tools-v1.1.0.tar.gz` 文件。

或者在终端中使用 `curl` 下载：

```bash
# 创建目录
cd ~/Desktop
mkdir gytl-tools
cd gytl-tools

# 下载部署包
curl -L -o gytl-tools-v1.1.0.tar.gz https://github.com/leesin07/gytl-tools/releases/download/v1.1.0/gytl-tools-v1.1.0.tar.gz

# 预期输出：
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
#   0     0    0     0    0     0      0      0      0      0      0      0 --:--:-- --:--:--
# 100   15M  100   15M    0     0  2.5M      0  0:00:06  0:00:06 --:--:--  2.5M
```

### 步骤 2：验证下载完整性

```bash
# 下载哈希文件
curl -L -o gytl-tools-v1.1.0.tar.gz.sha256 https://github.com/leesin07/gytl-tools/releases/download/v1.1.0/gytl-tools-v1.1.0.tar.gz.sha256

# 验证哈希
shasum -c gytl-tools-v1.1.0.tar.gz.sha256

# 预期输出：
# gytl-tools-v1.1.0.tar.gz: OK
```

### 步骤 3：解压部署包

```bash
# 解压到当前目录
tar -xzf gytl-tools-v1.1.0.tar.gz

# 查看解压内容
ls -la gytl-tools-v1.1.0/

# 预期输出：
# total 64
# drwxr-xr-x 10 yourname  staff   640 Mar  6 15:10 .
# drwxr-xr-x  5 yourname  staff   160 Mar  6 15:10 ..
# -rw-r--r--  1 yourname  staff  1234 Mar  6 15:10 .babelrc
# -rw-r--r--  1 yourname  staff   567 Mar  6 15:10 .coze
# ...（更多文件）
```

### 步骤 4：移动文件到项目目录

```bash
# 移动所有文件到当前目录
mv gytl-tools-v1.1.0/* .

# 删除空目录和压缩包
rmdir gytl-tools-v1.1.0
rm gytl-tools-v1.1.0.tar.gz gytl-tools-v1.1.0.tar.gz.sha256

# 验证文件
ls -la
```

### 步骤 5：初始化 Git 仓库（如果需要）

```bash
# 初始化 Git
git init

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/leesin07/gytl-tools.git

# 预期输出：
# Initialized empty Git repository in /Users/yourname/Desktop/gytl-tools/.git/
```

---

## 💻 本地测试

在推送到 GitHub 之前，建议先在本地测试。

### 步骤 1：安装依赖

```bash
# 确保在项目目录
cd ~/Desktop/gytl-tools

# 安装依赖
pnpm install

# 预期输出（大约需要 2-5 分钟）：
# Lockfile is up to date, resolution step is skipped
# Packages: +1234
# Progress: resolved 1234, reused 0, downloaded 1234, added 1234, done
#
# dependencies:
#   + @aws-sdk/client-s3 3.958.0
#   ...
#
# devDependencies:
#   + @types/node 20.11.0
#   ...
#
# Done in 45s
```

### 步骤 2：类型检查

```bash
# 运行 TypeScript 类型检查
npx tsc --noEmit

# 预期输出（成功时无输出）
# （静默成功，无任何错误信息）
```

### 步骤 3：构建项目

```bash
# 构建生产版本
pnpm build

# 预期输出：
# ▲ Next.js 16.1.1
#
# Creating an optimized production build...
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (5/5)
# ✓ Finalizing page optimization
#
# Build completed in 2m 15s
```

### 步骤 4：本地运行测试

```bash
# 启动开发服务器
pnpm dev

# 预期输出：
# ▲ Next.js 16.1.1
# - Local:        http://localhost:5000
# - Network:      http://192.168.1.100:5000
#
# ✓ Ready in 1.2s
```

### 步骤 5：浏览器访问

打开浏览器，访问：
```
http://localhost:5000
```

**检查点：**
- ✅ 页面正常加载
- ✅ 显示 GYTL-Tools 标题
- ✅ 显示数据来源标识（绿色或橙色）
- ✅ 可以切换三个标签页（选股结果、资金管理、筛选条件）

### 步骤 6：停止开发服务器

在终端中按 `Ctrl + C` 停止服务器。

---

## 🚀 推送到 GitHub

### 步骤 1：检查 Git 状态

```bash
# 查看当前状态
git status

# 预期输出：
# On branch main
# Your branch is up to date with 'origin/main'.
#
# nothing to commit, working tree clean
```

### 步骤 2：如果有更改，提交更改

```bash
# 查看更改的文件
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "Update to v1.1.0"

# 预期输出：
# [main abc1234] Update to v1.1.0
#  10 files changed, 1234 insertions(+), 567 deletions(-)
```

### 步骤 3：推送到 GitHub

#### 方式 A：使用 HTTPS（简单）

```bash
# 推送到远程仓库
git push origin main

# 预期输出：
# Enumerating objects: 45, done.
# Counting objects: 100% (45/45), done.
# Delta compression using up to 8 threads
# Compressing objects: 100% (30/30), done.
# Writing objects: 100% (30/30), 45.2 KiB | 2.5 MiB/s, done.
# Total 30 (delta 15), reused 0 (delta 0), pack-reused 0
# To https://github.com/leesin07/gytl-tools.git
#    def5678..abc1234  main -> main
```

**如果需要认证：**

```bash
# Git 会提示输入用户名和密码
Username: leesin07
Password: your-personal-access-token  # ⚠️ 使用 Personal Access Token，不是 GitHub 密码
```

**如何生成 Personal Access Token：**

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择 `repo` 权限
4. 点击 "Generate token"
5. 复制生成的 token（只显示一次）
6. 在 Git 推送时使用这个 token 作为密码

#### 方式 B：使用 SSH（推荐，更安全）

```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your-email@example.com"

# 预期输出：
# Generating public/private ed25519 key pair.
# Enter file in which to save the key (/Users/yourname/.ssh/id_ed25519):
# （直接按 Enter）
# Enter passphrase (empty for no passphrase):
# （可以输入密码或直接按 Enter）
# Enter same passphrase again:
# （再次输入密码或直接按 Enter）

# 添加 SSH 密钥到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 预期输出：
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG8... your-email@example.com
```

**添加 SSH 密钥到 GitHub：**

1. 访问 https://github.com/settings/ssh/new
2. 将公钥粘贴到 "Key" 文本框
3. 给密钥起个名字（如 "MacBook Pro"）
4. 点击 "Add SSH key"

**设置 Git 使用 SSH：**

```bash
# 更改远程仓库地址为 SSH
git remote set-url origin git@github.com:leesin07/gytl-tools.git

# 推送（这次不需要输入密码）
git push origin main
```

#### 方式 C：使用 GitHub CLI（最简单）

```bash
# 如果已安装 gh cli
gh repo view

# 推送到 GitHub（gh cli 会自动处理认证）
git push origin main

# 如果需要认证
gh auth login
# 按提示操作
```

### 步骤 4：验证推送成功

```bash
# 在浏览器中访问你的 GitHub 仓库
# https://github.com/leesin07/gytl-tools

# 或者使用 GitHub CLI
gh repo view --web

# 检查最近的提交
gh run list

# 预期输出：
# STATUS  TITLE  BRANCH  EVENT  ID  TIME
# success  Update to v1.1.0  main  push  1234567890  about 5 minutes ago
```

---

## 🌐 Vercel 部署

### 步骤 1：准备 Vercel 账号

1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 使用 GitHub 账号登录
4. 授权 Vercel 访问你的 GitHub 仓库

### 步骤 2：导入项目到 Vercel

#### 方式 A：使用网页界面（推荐）

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 点击 "Add New" → "Project"
3. 在 "Import Git Repository" 中找到你的仓库
4. 点击 "Import"

**配置项目：**

```
Framework Preset: Next.js
Root Directory: ./ (保持默认)
Build Command: pnpm build
Output Directory: .next (保持默认)
Install Command: pnpm install
```

5. 点击 "Deploy"

**预期输出：**
```
Building...
✓ Downloading 1234 files
✓ Installing dependencies
✓ Building application
✓ Uploading to Edge Network
```

6. 等待部署完成（大约 2-5 分钟）

7. 部署成功后，会显示：
   - 部署 URL（如：https://gytl-tools-abc123.vercel.app）
   - 域名设置
   - 部署日志

#### 方式 B：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 预期输出：
# Vercel CLI 32.x.x
# ? Set up and develop "⬢"
# ? Which scope do you want to deploy to?
#   > Your Username
# ? Link to existing project?
#   y
# ? What's your project's name?
#   gytl-tools
# ? In which directory is your code located?
#   ./
# ? Want to override the settings?
#   n
# ? Which team owns this project?
#   Your Username

# 预期输出：
# 🔗  Linked to leesin07/gytl-tools
# 🐼  Detected Next.js
# 🔎  Inspect: https://vercel.com/leesin07/gytl-tools
# ✅  Preview: https://gytl-tools-abc123.vercel.app
```

### 步骤 3：查看部署状态

#### 在网页界面

1. 访问 Vercel Dashboard
2. 点击你的项目
3. 查看 "Deployments" 标签
4. 查看最新的部署状态

**部署状态说明：**
- `Building` - 正在构建
- `Queued` - 排队等待
- `Ready` - 部署成功
- `Error` - 部署失败

#### 使用 Vercel CLI

```bash
# 查看部署列表
vercel list

# 预期输出：
# Name                    State     Updated
# gytl-tools              Ready     2m ago
# gytl-tools              Building  5m ago
# gytl-tools              Error     10m ago

# 查看最新部署详情
vercel inspect

# 预期输出：
# Name:      gytl-tools
# State:     Ready
# URL:       https://gytl-tools-abc123.vercel.app
# Updated:   2 minutes ago
```

### 步骤 4：访问部署的应用

**使用 Vercel 提供的 URL：**

```
https://gytl-tools-abc123.vercel.app
```

**配置自定义域名（可选）：**

1. 在 Vercel Dashboard 中点击 "Settings"
2. 点击 "Domains"
3. 输入你的域名（如：app.yourdomain.com）
4. 按提示配置 DNS 记录

### 步骤 5：查看部署日志

如果部署失败，查看日志：

```bash
# 使用 Vercel CLI
vercel logs

# 或在网页界面
# Vercel Dashboard → 项目 → Deployments → 点击失败的部署 → View Logs
```

**常见错误和解决：**

| 错误 | 解决方法 |
|------|---------|
| `Build failed` | 检查 `package.json`，确认 `pnpm install` 可用 |
| `Port 5000 already in use` | Vercel 会自动处理，不需要担心 |
| `Module not found` | 检查 `pnpm install` 是否成功 |
| `TypeScript error` | 运行 `npx tsc --noEmit` 修复类型错误 |

---

## ❓ 关于版本覆盖

### 重要说明：Vercel 部署是覆盖部署！

**是的，Vercel 部署会覆盖之前的版本。**

### 工作原理

```
GitHub 仓库（main 分支）
    ↓ 推送
Vercel 检测到更新
    ↓ 自动部署
旧版本 → 新版本（覆盖）
```

### 版本管理

**每次部署都是独立的：**

1. **部署记录保留**：Vercel 会保留所有部署记录
2. **可以回滚**：可以快速回滚到之前的版本
3. **预览部署**：每个 PR 都会生成预览版本
4. **生产部署**：只有推送到 main 分支才会部署到生产环境

### 如何查看历史版本

```bash
# 使用 Vercel CLI
vercel list

# 在网页界面
# Vercel Dashboard → 项目 → Deployments
```

### 如何回滚到旧版本

#### 方式 A：使用网页界面（最简单）

1. 访问 Vercel Dashboard
2. 点击你的项目
3. 进入 "Deployments" 标签
4. 找到要回滚的旧版本
5. 点击右上角的 "..." 菜单
6. 选择 "Promote to Production"

#### 方式 B：使用 Vercel CLI

```bash
# 查看部署列表
vercel list

# 回滚到特定部署
vercel rollback <deployment-url>

# 示例：
vercel rollback https://gytl-tools-def567.vercel.app
```

#### 方式 C：回滚 Git 代码

```bash
# 回滚 Git 到上一个版本
git checkout HEAD~1

# 强制推送到 GitHub（谨慎使用！）
git push --force origin main

# Vercel 会自动重新部署
```

### 版本管理最佳实践

1. **使用 Git 标签**：为每个发布版本打标签
   ```bash
   git tag -a v1.1.0 -m "Release v1.1.0"
   git push origin v1.1.0
   ```

2. **使用分支**：功能开发在新分支进行
   ```bash
   git checkout -b feature/new-feature
   ```

3. **使用 Pull Request**：通过 PR 合并代码，便于代码审查

4. **保留备份**：重要版本保留备份
   ```bash
   git tag backup-v1.1.0
   ```

---

## 🔄 更新迭代流程

当你需要更新应用时，按以下步骤操作：

### 步骤 1：拉取最新代码

```bash
# 进入项目目录
cd ~/Desktop/gytl-tools

# 拉取最新代码
git pull origin main

# 预期输出：
# Already up to date.
# 或
# Updating abc1234..def5678
# Fast-forward
#  src/app/page.tsx | 12 ++++++------
#  1 file changed, 6 insertions(+), 6 deletions(-)
```

### 步骤 2：本地测试

```bash
# 安装新依赖（如果有）
pnpm install

# 类型检查
npx tsc --noEmit

# 构建
pnpm build

# 本地运行
pnpm dev
```

### 步骤 3：提交更改

```bash
# 查看更改
git status

# 添加更改
git add .

# 提交
git commit -m "feat: 添加新功能"
```

### 步骤 4：推送到 GitHub

```bash
# 推送到 main 分支
git push origin main
```

### 步骤 5：Vercel 自动部署

**Vercel 会自动检测到更新并开始部署！**

无需任何额外操作，等待部署完成即可。

### 步骤 6：验证部署

```bash
# 查看部署状态
vercel list

# 或访问网页界面
# https://vercel.com/dashboard
```

### 步骤 7：访问新版本

```
https://gytl-tools-abc123.vercel.app
```

---

## 📝 完整流程总结

### 首次部署流程

```bash
# 1. Clone 代码
cd ~/Desktop/gytl-tools
git clone https://github.com/leesin07/gytl-tools.git .

# 2. 本地测试
pnpm install
pnpm build
pnpm dev

# 3. 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 4. Vercel 部署
# 访问 https://vercel.com/dashboard
# 导入仓库并部署
```

### 更新迭代流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 本地测试
pnpm install
pnpm build
pnpm dev

# 3. 提交更改
git add .
git commit -m "Update feature"
git push origin main

# 4. Vercel 自动部署（无需操作）
```

---

## ⚠️ 常见问题

### 问题 1：Vercel 部署失败

**症状：**
```
Build failed
Error: Module not found
```

**解决方案：**
```bash
# 检查 package.json
cat package.json

# 确认有正确的 scripts
# "build": "pnpm build"
# "start": "pnpm start"

# 重新提交并推送
git add .
git commit -m "fix: package.json"
git push origin main
```

### 问题 2：Git 推送失败

**症状：**
```
error: failed to push some refs to 'https://github.com/...'
```

**解决方案：**
```bash
# 拉取最新代码
git pull origin main --rebase

# 解决冲突后推送
git push origin main
```

### 问题 3：端口冲突（本地测试）

**症状：**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i:5000

# 停止进程
kill -9 <PID>

# 重新启动
pnpm dev
```

### 问题 4：Personal Access Token 失效

**症状：**
```
remote: Invalid username or password.
```

**解决方案：**
```bash
# 重新生成 Personal Access Token
# 访问 https://github.com/settings/tokens

# 更新 Git 凭据
git config --global credential.helper osxkeychain

# 重新推送
git push origin main
# 输入新的 token 作为密码
```

---

## ✅ 检查清单

### 首次部署

- [ ] 已安装 Node.js 24.x
- [ ] 已安装 pnpm 9.x
- [ ] 已安装 Git
- [ ] 已从 GitHub Clone 代码
- [ ] 已在本地测试通过
- [ ] 已推送到 GitHub
- [ ] 已在 Vercel 导入项目
- [ ] Vercel 部署成功
- [ ] 可以访问部署的 URL

### 更新迭代

- [ ] 已拉取最新代码
- [ ] 已更新本地代码
- [ ] 已在本地测试通过
- [ ] 已提交更改
- [ ] 已推送到 GitHub
- [ ] Vercel 自动部署成功
- [ ] 可以访问新版本

---

## 📚 相关文档

- [迭代部署指引](./ITERATION_DEPLOYMENT_GUIDE.md) - 详细的迭代部署流程
- [工具脚本使用指南](./SCRIPTS_GUIDE.md) - 自动化脚本使用
- [版本历史](./VERSION.md) - 版本变更记录
- [变更日志](./CHANGELOG.md) - 详细的变更说明

---

**文档版本：v1.0.0**
**最后更新：2024-03-06**
**适用平台：macOS**
**部署平台：Vercel**
