# GYTL-Tools Mac 版完整部署教程

## 📚 目录

1. [准备工作](#准备工作)
2. [第一步：下载部署包](#第一步下载部署包)
3. [第二步：解压文件](#第二步解压文件)
4. [第三步：创建 GitHub 仓库](#第三步创建-github-仓库)
5. [第四步：上传代码到 GitHub](#第四步上传代码到-github)
6. [第五步：在 Vercel 上部署](#第五步在-vercel-上部署)
7. [第六步：验证部署](#第六步验证部署)
8. [常见问题解决](#常见问题解决)

---

## 准备工作

### ✅ 需要准备的账号

| 项目 | 获取方式 |
|------|----------|
| GitHub 账号 | https://github.com（免费注册） |
| Vercel 账号 | https://vercel.com（用 GitHub 登录） |

### ✅ 检查 Git 是否已安装

1. 打开 **终端**（Terminal）
   - 按 `Command + 空格`
   - 输入"终端"或"Terminal"
   - 按回车

2. 输入命令：
```bash
git --version
```

**预期输出**：
```
git version 2.x.x
```

**如果显示 "command not found"**：
- 需要先安装 Git
- 在终端输入：`xcode-select --install`
- 或者访问：https://git-scm.com/download/mac

---

## 第一步：下载部署包

### 📍 文件位置

在沙箱文件系统中找到：

1. **主部署包**：`/workspace/projects/gytl-tools-deploy-v1.0.1.tar.gz`（286KB）
2. **上传指南**：`/workspace/projects/GITHUB_UPLOAD_GUIDE.md`（可选）

### 📥 下载操作

1. 打开 **访达**（Finder）
2. 导航到沙箱文件系统的 `/workspace/projects/` 目录
3. 右键点击 `gytl-tools-deploy-v1.0.1.tar.gz`
4. 选择"下载"
5. 保存到 `/Users/你的用户名/Downloads/`（默认下载文件夹）

### ✅ 下载完成检查

在终端中检查：

```bash
ls ~/Downloads | grep gytl-tools
```

**预期输出**：
```
gytl-tools-deploy-v1.0.1.tar.gz
```

---

## 第二步：解压文件

### 🎯 解压操作

1. **打开终端**（如果还没打开）

2. **进入下载目录**：
```bash
cd ~/Downloads
```

3. **查看文件**：
```bash
ls -la | grep gytl-tools
```

**预期输出**：
```
-rw-r--r--  1 yourname  staff  286K Mar  2 15:39 gytl-tools-deploy-v1.0.1.tar.gz
```

4. **解压文件**：
```bash
tar -xzf gytl-tools-deploy-v1.0.1.tar.gz
```

**说明**：
- `tar`：解压命令
- `-x`：解压
- `-z`：处理 gzip 压缩
- `-f`：指定文件名

5. **查看解压结果**：
```bash
ls -la
```

**预期输出**：
```
drwxr-xr-x  15 yourname  staff   480 Mar  2 15:50 gytl-tools
-rw-r--r--   1 yourname  staff  286K Mar  2 15:39 gytl-tools-deploy-v1.0.1.tar.gz
```

6. **进入项目目录**：
```bash
cd gytl-tools
```

7. **查看项目结构**：
```bash
ls -la
```

**预期输出**：
```
drwxr-xr-x   7 yourname  staff   224 Mar  2 15:50 scripts
drwxr-xr-x   2 yourname  staff   480 Mar  2 15:50 public
drwxr-xr-x   7 yourname  staff   224 Mar  2 15:50 src
-rw-r--r--   1 yourname  staff  4.8K Mar  2 15:50 .coze
-rw-r--r--   1 yourname  staff  140B Mar  2 15:50 .gitignore
-rw-r--r--   1 yourname  staff  3.0K Mar  2 15:50 next.config.ts
-rw-r--r--   1 yourname  staff  2.5K Mar  2 15:50 package.json  ← ⚠️ 重要！
-rw-r--r--   1 yourname  staff  500K Mar  2 15:50 pnpm-lock.yaml
-rw-r--r--   1 yourname  staff  2.0K Mar  2 15:50 tailwind.config.ts
-rw-r--r--   1 yourname  staff  1.2K Mar  2 15:50 tsconfig.json
-rw-r--r--   1 yourname  staff  5.2K Mar  2 15:50 README.md
```

### ✅ 解压成功检查

**关键检查点**：
- ✅ 能看到 `gytl-tools` 文件夹
- ✅ 进入 `gytl-tools` 后能看到 `package.json` 文件
- ✅ 能看到 `src/` 和 `public/` 目录

---

## 第三步：创建 GitHub 仓库

### 🌐 操作步骤

#### 步骤 1：登录 GitHub

1. 打开浏览器（Safari 或 Chrome）
2. 访问：https://github.com
3. 登录你的 GitHub 账号

#### 步骤 2：创建新仓库

1. 点击右上角的 **+** 按钮
2. 选择 **New repository**

#### 步骤 3：填写仓库信息

**Repository name（仓库名）**：
```
gytl-tools
```

**Description（描述，可选）**：
```
基于杨永兴隔夜套利法的智能选股工具
```

**Public/Private（公开/私有）**：
- 选择 **Public**（公开仓库，免费）

**Initialize this repository with**：
- ✅ **不要勾选**任何选项

4. 点击页面底部的 **Create repository** 按钮

#### 步骤 4：记录仓库地址

创建成功后，复制你的仓库地址：

**HTTPS 地址**：
```
https://github.com/你的用户名/gytl-tools.git
```

---

## 第四步：上传代码到 GitHub

### 📝 在终端中执行以下命令

#### 步骤 1：确保在项目目录

```bash
pwd
```

**预期输出**：
```
/Users/你的用户名/Downloads/gytl-tools
```

**如果不是**，执行：
```bash
cd ~/Downloads/gytl-tools
```

#### 步骤 2：初始化 Git 仓库

```bash
git init
```

**预期输出**：
```
Initialized empty Git repository in /Users/你的用户名/Downloads/gytl-tools/.git/
```

#### 步骤 3：查看 Git 状态

```bash
git status
```

**预期输出**：
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.coze
	.gitignore
	next.config.ts
	package.json
	pnpm-lock.yaml
	public/
	README.md
	scripts/
	src/
	tailwind.config.ts
	tsconfig.json

nothing added to commit but untracked files present
```

#### 步骤 4：添加所有文件到暂存区

```bash
git add .
```

#### 步骤 5：提交代码

```bash
git commit -m "Initial commit: GYTL-Tools v1.0.1"
```

**预期输出**：
```
[main (root-commit) abcd123] Initial commit: GYTL-Tools v1.0.1
 150 files changed, 20000 insertions(+)
 create mode 100644 .coze
 create mode 100644 .gitignore
 create mode 100644 next.config.ts
 ...
```

#### 步骤 6：连接到 GitHub 远程仓库

**替换为你的仓库地址**：

```bash
git remote add origin https://github.com/你的用户名/gytl-tools.git
```

#### 步骤 7：验证远程仓库地址

```bash
git remote -v
```

**预期输出**：
```
origin  https://github.com/你的用户名/gytl-tools.git (fetch)
origin  https://github.com/你的用户名/gytl-tools.git (push)
```

#### 步骤 8：设置主分支

```bash
git branch -M main
```

#### 步骤 9：推送代码到 GitHub

```bash
git push -u origin main
```

**如果提示输入用户名和密码**：

```
Username: leeqf1007@163.com
Password: [输入 Personal Access Token 或 GitHub 密码]
```

**预期输出（成功）**：
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (140/140), done.
Writing objects: 100% (150/150), 280.00 KiB | 2.50 MiB/s, done.
Total 150 (delta 15), reused 0 (delta 0)
remote: Resolving deltas: 100% (15/15), done.
To https://github.com/你的用户名/gytl-tools.git
 * [new branch]      main -> main
```

**关键标志**：
- ✅ `Writing objects: 100%`
- ✅ `[new branch] main -> main`

### ✅ 上传成功检查

#### 在浏览器中验证

1. 访问：https://github.com/你的用户名/gytl-tools
2. 查看文件列表
3. 应该能看到：
   - `src/` 文件夹
   - `public/` 文件夹
   - `package.json` 文件
   - `README.md` 文件

#### 在终端中验证

```bash
git status
```

**预期输出**：
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

## 第五步：在 Vercel 上部署

### 🚀 操作步骤

#### 步骤 1：登录 Vercel

1. 在浏览器中访问：https://vercel.com
2. 点击右上角的 **Login**
3. 选择 **Continue with GitHub**
4. 点击"Authorize Vercel"授权

#### 步骤 2：导入项目

1. 点击右上角的 **Add New...** 按钮
2. 选择 **Project**

#### 步骤 3：选择 GitHub 仓库

1. 找到 `gytl-tools` 仓库
2. 点击 **Import** 按钮

#### 步骤 4：确认项目配置

Vercel 会自动配置，检查以下信息：

**Project Name**：
```
gytl-tools
```

**Framework Preset**：
```
Next.js
```

**Build Command**：
```
pnpm run build
```

**Install Command**：
```
pnpm install
```

**Output Directory**：
```
.next
```

#### 步骤 5：添加环境变量（重要！）

向下滚动到 **Environment Variables** 部分，点击 **Add New**：

**第 1 个**：
- Name: `NEXT_PUBLIC_APP_NAME`
- Value: `GYTL-Tools`
- Environment: 全选
- 点击 Add

**第 2 个**：
- Name: `NEXT_PUBLIC_DEFAULT_MIN_CHANGE`
- Value: `3`
- Environment: 全选
- 点击 Add

**第 3 个**：
- Name: `NEXT_PUBLIC_DEFAULT_MAX_CHANGE`
- Value: `8`
- Environment: 全选
- 点击 Add

**第 4 个**：
- Name: `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME`
- Value: `60`
- Environment: 全选
- 点击 Add

#### 步骤 6：开始部署

1. 确认所有配置正确
2. 点击页面底部的 **Deploy** 按钮

#### 步骤 7：等待部署完成

部署过程（2-5 分钟）：
1. Cloning repository
2. Installing dependencies
3. Building project
4. Deploying to edge network

#### 步骤 8：部署成功

成功后会显示：
```
✅ Deployed!
```

并给出访问地址：
```
https://gytl-tools-你的用户名.vercel.app
```

**记下这个地址！**

---

## 第六步：验证部署

### ✅ 操作步骤

#### 步骤 1：访问应用

在浏览器中访问：
```
https://gytl-tools-你的用户名.vercel.app
```

#### 步骤 2：检查页面

**预期效果**：
- ✅ 页面正常显示
- ✅ 标题显示 "GYTL-Tools"
- ✅ 有"选股结果"、"资金管理"、"筛选条件"三个标签页

#### 步骤 3：测试功能

**测试 1：股票筛选**
1. 点击"筛选条件"
2. 调整涨幅范围（如 3% - 8%）
3. 点击"保存条件"
4. 切换到"选股结果"
5. 点击"全 A 股筛选"
6. 等待结果

**测试 2：股票搜索**
1. 在搜索框输入股票代码或名称
2. 查看搜索结果

**测试 3：资金管理**
1. 点击"资金管理"标签
2. 查看资金看板

---

## 常见问题解决

### 问题 1：git push 时提示 "Authentication failed"

**解决方案：使用 Personal Access Token**

1. 生成 Token：
   - 访问：https://github.com/settings/tokens
   - 点击 **Generate new token (classic)**
   - Note: `gytl-tools-deploy`
   - Expiration: `No expiration`
   - 勾选 `repo` 权限
   - Generate token
   - **复制 token**

2. 推送时使用 token：
```bash
git push -u origin main
# Username: leeqf1007@163.com
# Password: 粘贴 token
```

---

### 问题 2：git push 时提示 "Error in the HTTP2 framing layer"

**解决方案：禁用 HTTP/2**

```bash
git config --global http."https://github.com".version HTTP/1.1
git push -u origin main
```

---

### 问题 3：Vercel 构建失败

**解决方案**：

1. 检查环境变量是否配置（4 个都要有）
2. 检查 Build Command 是否为 `pnpm run build`
3. 查看 Vercel Build Logs

---

### 问题 4：页面无法访问

**解决方案**：

1. 等待 1-2 分钟（可能还在部署）
2. 检查 Vercel 部署状态
3. 确认域名输入正确

---

## 📋 完整命令汇总

### 下载和解压

```bash
# 进入下载目录
cd ~/Downloads

# 解压
tar -xzf gytl-tools-deploy-v1.0.1.tar.gz

# 进入项目目录
cd gytl-tools
```

### Git 操作

```bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交代码
git commit -m "Initial commit: GYTL-Tools v1.0.1"

# 连接远程仓库（替换为你的地址）
git remote add origin https://github.com/你的用户名/gytl-tools.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

### 验证

```bash
# 查看状态
git status

# 查看远程地址
git remote -v
```

---

## 🎯 快速开始（一条命令）

如果你想快速复制粘贴，执行以下命令：

```bash
cd ~/Downloads && \
tar -xzf gytl-tools-deploy-v1.0.1.tar.gz && \
cd gytl-tools && \
git init && \
git add . && \
git commit -m "Initial commit: GYTL-Tools v1.0.1" && \
git remote add origin https://github.com/你的用户名/gytl-tools.git && \
git branch -M main && \
git push -u origin main
```

**注意**：将 `你的用户名` 替换为你的 GitHub 用户名。

---

## 📋 操作清单

### 下载和解压
- [ ] 下载 `gytl-tools-deploy-v1.0.1.tar.gz` 到下载文件夹
- [ ] 在终端执行：`cd ~/Downloads`
- [ ] 在终端执行：`tar -xzf gytl-tools-deploy-v1.0.1.tar.gz`
- [ ] 在终端执行：`cd gytl-tools`
- [ ] 确认能看到 `package.json` 文件

### Git 上传
- [ ] 执行：`git init`
- [ ] 执行：`git add .`
- [ ] 执行：`git commit -m "Initial commit: GYTL-Tools v1.0.1"`
- [ ] 在 GitHub 创建仓库
- [ ] 执行：`git remote add origin https://github.com/你的用户名/gytl-tools.git`
- [ ] 执行：`git branch -M main`
- [ ] 执行：`git push -u origin main`
- [ ] 在 GitHub 网页验证文件已上传

### Vercel 部署
- [ ] 登录 Vercel
- [ ] 导入 GitHub 仓库
- [ ] 添加 4 个环境变量
- [ ] 点击 Deploy
- [ ] 等待 2-5 分钟

### 验证
- [ ] 访问 Vercel 提供的域名
- [ ] 测试股票筛选功能
- [ ] 测试股票搜索功能
- [ ] 测试资金管理功能

---

## 🎉 完成！

### 访问地址

```
https://gytl-tools-你的用户名.vercel.app
```

### GitHub 仓库

```
https://github.com/你的用户名/gytl-tools
```

---

## 💡 Mac 终端快捷键

| 快捷键 | 说明 |
|--------|------|
| `Command + 空格` | 打开 Spotlight 搜索 |
| `Command + C` | 复制 |
| `Command + V` | 粘贴 |
| `Command + L` | 清除终端屏幕 |
| `Control + C` | 中断当前命令 |
| `上箭头` | 查看上一个命令 |
| `Tab` | 自动补全命令或路径 |

---

**GYTL-Tools Team**
**2025-03-02**
**版本：v1.0.1**
**Mac 专用版**

祝您部署顺利！🚀
