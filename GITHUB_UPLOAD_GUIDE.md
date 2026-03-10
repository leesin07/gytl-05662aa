# GYTL-Tools GitHub 上传与部署指南

## 📦 部署包文件清单

本次打包包含以下文件：

| 文件名 | 大小 | 说明 |
|--------|------|------|
| **gytl-tools-deploy-v1.0.1.tar.gz** | 286KB | 主部署包（包含所有源代码和配置） |
| gytl-tools-deploy-v1.0.1.tar.gz.sha256 | - | SHA256 校验文件 |
| gytl-tools-deploy-v1.0.1-VERSION.md | - | 版本信息文档 |
| GITHUB_UPLOAD_GUIDE.md | - | 本文档 |

---

## 🚀 快速开始（3 步上传）

### 步骤 1：下载并解压部署包

#### Windows 用户
```cmd
# 1. 下载 gytl-tools-deploy-v1.0.1.tar.gz
# 2. 使用 WinRAR 或 7-Zip 解压
# 3. 打开解压后的文件夹
```

#### Mac/Linux 用户
```bash
# 1. 下载部署包
# 2. 解压
tar -xzf gytl-tools-deploy-v1.0.1.tar.gz

# 3. 进入项目目录
cd gytl-tools
```

### 步骤 2：推送到 GitHub

#### 2.1 创建 GitHub 仓库

1. 登录 GitHub：https://github.com
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - **Repository name**：`gytl-tools`
   - **Description**：`基于杨永兴隔夜套利法的智能选股工具`
   - **Public/Private**：选择 Public（公开）
   - ✅ **不勾选**任何初始化选项
4. 点击 **Create repository**

#### 2.2 初始化 Git 并推送

**Windows (Git Bash / PowerShell)**：
```bash
cd gytl-tools

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: GYTL-Tools v1.0.1"

# 连接到 GitHub（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/gytl-tools.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

**Mac/Linux**：
```bash
cd gytl-tools

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: GYTL-Tools v1.0.1"

# 连接到 GitHub（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/gytl-tools.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

#### 2.3 处理身份验证

**情况 A：使用 Personal Access Token（推荐）**

如果提示输入密码，使用 Token：

1. 生成 Personal Access Token：
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Note: `gytl-tools-deploy`
   - Expiration: `No expiration`
   - 勾选权限：✅ `repo`
   - Generate token
   - **复制并保存 token**

2. 使用 Token 推送：
```bash
git push -u origin main
# 用户名：GitHub 用户名
# 密码：粘贴刚才复制的 token
```

**情况 B：使用 SSH 密钥（推荐给高级用户）**

```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 复制公钥到 GitHub
cat ~/.ssh/id_ed25519.pub

# 在 GitHub 中：Settings → SSH and GPG keys → New SSH key
# 粘贴公钥并保存

# 使用 SSH 地址推送
git remote set-url origin git@github.com:你的用户名/gytl-tools.git
git push -u origin main
```

### 步骤 3：在 Vercel 上部署

#### 3.1 登录 Vercel

1. 访问：https://vercel.com
2. 点击 **Sign Up** 或 **Login**
3. 选择 **Continue with GitHub**
4. 授权 Vercel 访问 GitHub

#### 3.2 导入项目

1. 登录后，点击 **Add New...**
2. 选择 **Project**
3. 找到 `gytl-tools` 仓库
4. 点击 **Import**

#### 3.3 配置项目

**项目配置**：
- **Project Name**：`gytl-tools`
- **Framework Preset**：`Next.js`
- **Root Directory**：`./`
- **Build Command**：`pnpm run build`
- **Output Directory**：`.next`
- **Install Command**：`pnpm install`

**环境变量**（点击 **Add New** 逐个添加）：

| 变量名 | 值 | 环境 |
|--------|---|------|
| `NEXT_PUBLIC_APP_NAME` | `GYTL-Tools` | Production / Preview / Development |
| `NEXT_PUBLIC_DEFAULT_MIN_CHANGE` | `3` | Production / Preview / Development |
| `NEXT_PUBLIC_DEFAULT_MAX_CHANGE` | `8` | Production / Preview / Development |
| `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME` | `60` | Production / Preview / Development |

#### 3.4 部署

1. 确认所有配置正确
2. 点击 **Deploy** 按钮
3. 等待 2-5 分钟
4. 部署成功后，访问：`https://gytl-tools-你的用户名.vercel.app`

---

## ✅ 验证部署

### 1. 检查 GitHub 仓库

访问你的 GitHub 仓库：
```
https://github.com/你的用户名/gytl-tools
```

确认文件已上传：
- ✅ `src/` 目录
- ✅ `public/` 目录
- ✅ `package.json`
- ✅ `.coze` 配置文件
- ✅ `README.md`

### 2. 检查 Vercel 部署

访问 Vercel 项目页面，确认：
- ✅ 状态显示：`Ready`
- ✅ 域名可访问
- ✅ 无构建错误

### 3. 测试应用功能

在浏览器中访问你的应用，测试：
- ✅ 页面正常加载
- ✅ 股票筛选功能
- ✅ 股票搜索功能
- ✅ 资金管理功能

---

## 🔧 常见问题解决

### 问题 1：推送代码失败 - Authentication failed

**解决方案**：
使用 Personal Access Token 替代密码

```bash
git push -u origin main
# Username: your_github_username
# Password: your_personal_access_token
```

### 问题 2：Vercel 构建失败 - Cannot find module

**解决方案**：
1. 检查 `package.json` 是否存在
2. 确认 **Install Command** 为 `pnpm install`
3. 重新部署

### 问题 3：Vercel 构建失败 - Command failed

**解决方案**：
1. 检查 **Build Command** 是否为 `pnpm run build`
2. 查看 Vercel Build Logs 获取详细错误信息
3. 修复后重新部署

### 问题 4：页面无法访问 - 404 Not Found

**解决方案**：
1. 等待 1-2 分钟（可能还在部署中）
2. 检查 Vercel 部署状态
3. 确认域名输入正确

### 问题 5：API 调用失败

**说明**：
系统会自动使用模拟数据，不影响使用。如果需要真实数据：
1. 检查网络连接
2. 确认 API 服务可用
3. 查看浏览器控制台错误信息

---

## 📊 预计时间

| 步骤 | 预计时间 |
|------|----------|
| 下载并解压部署包 | 1-2 分钟 |
| 创建 GitHub 仓库 | 2-3 分钟 |
| 推送代码到 GitHub | 2-5 分钟 |
| 连接 Vercel | 2-3 分钟 |
| 配置项目 | 3-5 分钟 |
| 部署 | 2-5 分钟 |
| 验证功能 | 2-3 分钟 |
| **总计** | **14-26 分钟** |

---

## 🎯 下一步操作

部署完成后，您可以：

### 1. 配置自定义域名（可选）

在 Vercel 项目页面：
- Settings → Domains
- 添加你的域名
- 配置 DNS 记录
- 等待生效

### 2. 查看详细文档

- **GITHUB_DEPLOYMENT_GUIDE.md** - 详细部署指南
- **GITHUB_DEPLOYMENT_CHECKLIST.md** - 部署检查清单
- **README.md** - 项目说明

### 3. 开始使用

- 使用股票筛选功能
- 添加资金记录
- 录入交易记录
- 查看数据分析

---

## 📞 获取帮助

如果遇到问题：

1. **查看文档**
   - 阅读相关文档获取详细说明

2. **检查日志**
   - Vercel Build Logs
   - 浏览器控制台

3. **提交 Issue**
   - 在 GitHub 仓库提交 Issue

---

## 🎉 完成标准

当你完成以下步骤，说明部署成功：

- [x] 代码已推送到 GitHub
- [x] Vercel 项目已创建
- [x] 环境变量已配置
- [x] 应用已成功部署
- [x] 功能测试通过

**访问地址**：
```
https://gytl-tools-你的用户名.vercel.app
```

---

**GYTL-Tools Team**
**2025-03-02**
**版本：v1.0.1**
