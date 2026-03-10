# GYTL-Tools GitHub 部署完整指南

## 🎯 部署方式概览

| 平台 | 推荐度 | 难度 | 免费额度 | SSR 支持 | 说明 |
|------|--------|------|----------|----------|------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐ 简单 | 100GB/月 | ✅ 完美支持 | **最推荐**，与 Next.js 同一家公司 |
| Netlify | ⭐⭐⭐⭐ | ⭐⭐ 简单 | 100GB/月 | ✅ 支持 | 第二选择，也很简单 |
| Railway | ⭐⭐⭐ | ⭐⭐⭐ 中等 | $5/月起 | ✅ 支持 | 支持后端 API，需要信用卡 |
| Render | ⭐⭐⭐ | ⭐⭐⭐ 中等 | 免费版有限制 | ✅ 支持 | 免费版会休眠 |

**推荐使用 Vercel**：最简单、最稳定、与 Next.js 集成最好。

---

## 🚀 方式一：使用 Vercel 部署（最推荐）

### 准备工作

- ✅ GitHub 账号
- ✅ Vercel 账号（可以用 GitHub 登录）
- ✅ 项目代码

---

### 步骤 1：创建 GitHub 仓库

#### 1.1 登录 GitHub
```
访问：https://github.com
```

#### 1.2 创建新仓库

1. 点击右上角的 **+** 按钮
2. 选择 **New repository**

#### 1.3 填写仓库信息

**Repository name**：输入仓库名
```
gytl-tools
```

**Description**（可选）：输入描述
```
基于杨永兴隔夜套利法的智能选股工具
```

**Public/Private**：
- 选择 **Public**（公开仓库，免费）
- 或选择 **Private**（私有仓库，需要付费）

**Initialize this repository with**：
- ✅ 不勾选任何选项（我们已有代码）

4. 点击 **Create repository** 按钮

---

### 步骤 2：推送代码到 GitHub

#### 2.1 在项目目录初始化 Git

在项目根目录（`/workspace/projects/`）执行：

```bash
# 进入项目目录
cd /workspace/projects

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: GYTL-Tools v1.0.0"
```

#### 2.2 连接到 GitHub 仓库

在 GitHub 仓库页面，找到仓库地址：
```
https://github.com/你的用户名/gytl-tools.git
```

执行以下命令（替换为你的仓库地址）：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/gytl-tools.git

# 设置主分支
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

**如果提示输入用户名和密码**：
- 用户名：GitHub 用户名
- 密码：使用 **Personal Access Token**（不是 GitHub 密码）

#### 2.3（可选）创建 Personal Access Token

如果推送时密码验证失败：

1. 在 GitHub 上，点击右上角头像
2. 选择 **Settings**
3. 左侧菜单选择 **Developer settings**
4. 选择 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token (classic)**
6. 设置：
   - Note：输入 `gytl-tools-deploy`
   - Expiration：选择 `No expiration`
   - 勾选权限：✅ `repo`
7. 点击 **Generate token**
8. **复制 token**（只显示一次，务必保存）

使用 token 推送：
```bash
git push -u origin main
# 用户名：GitHub 用户名
# 密码：粘贴刚才复制的 token
```

---

### 步骤 3：连接到 Vercel

#### 3.1 登录 Vercel

```
访问：https://vercel.com
```

1. 点击 **Sign Up** 或 **Login**
2. 选择 **Continue with GitHub**
3. 授权 Vercel 访问你的 GitHub

#### 3.2 导入项目

1. 登录后，点击 **Add New...**
2. 选择 **Project**

#### 3.3 选择 GitHub 仓库

1. 在 **Import Git Repository** 页面
2. 找到你刚才创建的 `gytl-tools` 仓库
3. 点击 **Import** 按钮

---

### 步骤 4：配置 Vercel 项目

#### 4.1 项目配置页面

Vercel 会自动检测到这是一个 Next.js 项目，并显示配置信息：

**Project Name**：
```
gytl-tools
```

**Framework Preset**：
```
Next.js
```

**Root Directory**：
```
./
```

**Build Command**：
```
pnpm run build
```

**Output Directory**：
```
.next
```

**Install Command**：
```
pnpm install
```

#### 4.2 环境变量配置

在 **Environment Variables** 部分，添加以下变量：

点击 **Add New**，逐个添加：

**Variable 1**：
- Name: `NEXT_PUBLIC_APP_NAME`
- Value: `GYTL-Tools`
- Environment: 选择 `Production`, `Preview`, `Development`（全选）

**Variable 2**：
- Name: `NEXT_PUBLIC_DEFAULT_MIN_CHANGE`
- Value: `3`
- Environment: 全选

**Variable 3**：
- Name: `NEXT_PUBLIC_DEFAULT_MAX_CHANGE`
- Value: `8`
- Environment: 全选

**Variable 4**：
- Name: `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME`
- Value: `60`
- Environment: 全选

#### 4.3 高级设置（可选）

点击 **Advanced** → **Environment Variables**，确保上面添加的变量都在列表中。

---

### 步骤 5：部署项目

#### 5.1 开始部署

1. 确认所有配置正确
2. 点击页面底部的 **Deploy** 按钮

#### 5.2 等待部署完成

部署过程通常需要 2-5 分钟，你会看到：
- ✅ Cloning repository
- ✅ Installing dependencies
- ✅ Building project
- ✅ Deploying to edge network

#### 5.3 部署成功

部署成功后，你会看到：
```
✅ Deployed!
```

Vercel 会提供一个默认域名：
```
https://gytl-tools-你的用户名.vercel.app
```

---

### 步骤 6：配置自定义域名（可选）

#### 6.1 添加域名

1. 在 Vercel 项目页面，点击 **Settings** 标签
2. 选择 **Domains**
3. 点击 **Add** 按钮
4. 输入你的域名（如：`gytl-tools.com`）

#### 6.2 配置 DNS

Vercel 会显示需要配置的 DNS 记录：

**如果使用 Vercel DNS**：
- 直接点击 **Use Vercel DNS** 按钮

**如果使用其他 DNS 服务商**：
在你的域名服务商（阿里云、腾讯云等）添加以下记录：

**记录 1**：
- 类型：`A`
- 主机记录：`@`
- 记录值：`76.76.21.21`
- TTL：`600`

**记录 2**：
- 类型：`CNAME`
- 主机记录：`www`
- 记录值：`cname.vercel-dns.com`
- TTL：`600`

#### 6.3 等待 DNS 生效

DNS 生效通常需要 10-30 分钟，最长可能需要 48 小时。

#### 6.4 自动配置 SSL

Vercel 会自动为你的域名配置 HTTPS 证书，无需手动操作。

---

### 步骤 7：验证部署

#### 7.1 访问应用

在浏览器中访问：
```
https://gytl-tools-你的用户名.vercel.app
```

#### 7.2 测试功能

测试以下功能：
- ✅ 页面是否正常加载
- ✅ 股票筛选功能是否正常
- ✅ 股票搜索功能是否正常
- ✅ 资金管理功能是否正常

#### 7.3 查看日志

如果遇到问题：
1. 在 Vercel 项目页面，点击 **Deployments** 标签
2. 找到最近的部署记录
3. 点击查看详情
4. 查看 **Build Logs** 和 **Function Logs**

---

## 🔄 方式二：使用 Netlify 部署

### 步骤 1-2：创建 GitHub 仓库并推送代码

与 Vercel 相同，参考上面的步骤 1-2。

### 步骤 3：连接到 Netlify

#### 3.1 登录 Netlify

```
访问：https://netlify.com
```

1. 点击 **Sign up** 或 **Log in**
2. 选择 **Sign up with GitHub**

#### 3.2 导入项目

1. 登录后，点击 **Add new site** → **Import an existing project**
2. 选择 GitHub
3. 授权 Netlify 访问你的 GitHub
4. 找到 `gytl-tools` 仓库
5. 点击 **Import site**

### 步骤 4：配置 Netlify

#### 4.1 构建配置

**Build command**：
```
pnpm run build
```

**Publish directory**：
```
.next
```

#### 4.2 环境变量

在 **Environment variables** 部分，添加：

```
NEXT_PUBLIC_APP_NAME=GYTL-Tools
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
```

#### 4.3 高级设置

在 **Advanced** → **Build settings** → **Build environment variables**，添加：

```
NODE_VERSION=24
```

### 步骤 5：部署

1. 点击 **Deploy site** 按钮
2. 等待部署完成
3. 访问 Netlify 提供的域名

---

## 🌐 方式三：使用 Railway 部署（支持后端 API）

### 步骤 1-2：创建 GitHub 仓库并推送代码

与 Vercel 相同，参考上面的步骤 1-2。

### 步骤 3：连接到 Railway

#### 3.1 登录 Railway

```
访问：https://railway.app
```

1. 点击 **Login**
2. 选择 **Continue with GitHub**

#### 3.2 创建新项目

1. 登录后，点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 找到 `gytl-tools` 仓库
4. 点击 **Deploy Now**

### 步骤 4：配置 Railway

#### 4.1 配置构建

Railway 会自动检测 Next.js 项目，但需要手动配置：

在 **Settings** → **Variables**，添加：

```
NODE_VERSION=24
PNPM_VERSION=9
```

#### 4.2 配置环境变量

在 **Variables** 标签，添加：

```
NEXT_PUBLIC_APP_NAME=GYTL-Tools
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
PORT=3000
```

### 步骤 5：配置启动命令

在 **Settings** → **Deployment**，设置：

**Start Command**：
```
pnpm start
```

### 步骤 6：获取域名

部署完成后，Railway 会提供一个域名：
```
https://gytl-tools-production.up.railway.app
```

---

## 📊 部署方式对比

| 特性 | Vercel | Netlify | Railway |
|------|--------|---------|---------|
| 部署难度 | ⭐ 最简单 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| 免费额度 | 100GB/月 | 100GB/月 | $5/月起 |
| 自定义域名 | ✅ 免费 | ✅ 免费 | ✅ 免费 |
| SSL 证书 | ✅ 自动 | ✅ 自动 | ✅ 自动 |
| 边缘网络 | ✅ 全球 CDN | ✅ 全球 CDN | ✅ 部分地区 |
| Next.js 支持 | ✅ 完美 | ✅ 很好 | ✅ 支持 |
| API 支持 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 数据库 | ❌ 需要单独 | ❌ 需要单独 | ✅ 内置 |
| 推荐指数 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🆘 常见问题

### Q1: 推送代码时提示 "Authentication failed"

**A**: 使用 Personal Access Token：
1. 生成 GitHub Personal Access Token
2. 推送时使用 token 作为密码

### Q2: Vercel 部署失败

**A**: 检查以下项：
1. 确认 `package.json` 中有正确的构建命令
2. 检查环境变量是否正确配置
3. 查看 Vercel 的构建日志

### Q3: API 调用失败

**A**: 系统包含智能降级机制：
- 如果无法连接东方财富 API，会自动使用模拟数据
- 不影响核心功能使用
- 部署到真实环境后，API 会正常工作

### Q4: 如何更新部署？

**A**:
1. 修改代码
2. 提交并推送到 GitHub
3. Vercel/Netlify 会自动部署新版本

### Q5: 如何查看日志？

**A**:
- **Vercel**: 项目页面 → Deployments → 选择部署 → 查看日志
- **Netlify**: 项目页面 → Deploys → 选择部署 → View deploy log
- **Railway**: 项目页面 → Deployments → 选择部署 → 查看日志

---

## 📝 部署清单

### Vercel 部署清单

- [ ] 创建 GitHub 仓库
- [ ] 初始化 Git 并推送代码
- [ ] 登录 Vercel
- [ ] 导入 GitHub 仓库
- [ ] 配置环境变量
- [ ] 点击部署按钮
- [ ] 等待部署完成
- [ ] 访问应用测试功能
- [ ] （可选）配置自定义域名

---

## 🎉 部署完成

恭喜！你的 GYTL-Tools 应用已成功部署到 GitHub + Vercel！

**访问地址**：
```
https://gytl-tools-你的用户名.vercel.app
```

**后续更新**：
- 修改代码后，直接推送到 GitHub
- Vercel 会自动部署新版本
- 无需手动操作

---

**祝你部署成功！** 🚀
