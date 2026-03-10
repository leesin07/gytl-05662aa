# GYTL-Tools 完整部署教程（从下载到上线）

## 📚 目录

1. [准备工作](#准备工作)
2. [第一步：下载部署包](#第一步下载部署包)
3. [第二步：在本地解压](#第二步在本地解压)
4. [第三步：创建 GitHub 仓库](#第三步创建-github-仓库)
5. [第四步：上传代码到 GitHub](#第四步上传代码到-github)
6. [第五步：在 Vercel 上部署](#第五步在-vercel-上部署)
7. [第六步：验证部署](#第六步验证部署)
8. [常见问题解决](#常见问题解决)

---

## 准备工作

### ✅ 需要准备的账号和工具

| 项目 | 说明 | 获取方式 |
|------|------|----------|
| GitHub 账号 | 用于托管代码 | https://github.com（免费注册） |
| Vercel 账号 | 用于部署应用 | https://vercel.com（用 GitHub 登录） |
| Git | 版本控制工具 | Mac 通常已安装，终端输入 `git --version` 检查 |
| 终端（Terminal） | 执行命令 | Mac 自带 |

### ✅ 检查 Git 是否已安装

打开终端（Terminal），输入：

```bash
git --version
```

**预期输出**：
```
git version 2.x.x
```

**如果显示 "command not found"**：
- 需要先安装 Git
- 访问：https://git-scm.com/download/mac
- 下载并安装 Git

---

## 第一步：下载部署包

### 📍 文件位置

在沙箱文件系统中找到这两个文件：

1. **主部署包**：`/workspace/projects/gytl-tools-deploy-v1.0.1.tar.gz`（286KB）
2. **上传指南**：`/workspace/projects/GITHUB_UPLOAD_GUIDE.md`（7.3KB）

### 📥 下载操作

#### Windows 用户

1. 打开文件管理器
2. 导航到沙箱文件系统的 `/workspace/projects/` 目录
3. 右键点击 `gytl-tools-deploy-v1.0.1.tar.gz`
4. 选择"下载"
5. 保存到 `C:\Users\你的用户名\Downloads\` 或任意位置

#### Mac 用户

1. 打开 Finder（访达）
2. 导航到沙箱文件系统的 `/workspace/projects/` 目录
3. 右键点击 `gytl-tools-deploy-v1.0.1.tar.gz`
4. 选择"下载"
5. 保存到 `/Users/你的用户名/Downloads/`（默认下载文件夹）

### ✅ 下载完成检查

下载完成后，在你的下载文件夹应该能看到：

**Mac 用户**：
```bash
ls ~/Downloads/ | grep gytl-tools
```

应该能看到：
```
gytl-tools-deploy-v1.0.1.tar.gz
```

---

## 第二步：在本地解压

### 🎯 解压操作

#### Mac 用户（推荐使用终端）

1. **打开终端**：
   - 按 `Command + 空格`
   - 输入"终端"或"Terminal"
   - 按回车

2. **进入下载目录**：
   ```bash
   cd ~/Downloads
   ```

3. **查看文件**：
   ```bash
   ls -la | grep gytl-tools
   ```
   应该能看到：
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

   应该能看到：
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
   -rw-r--r--   1 yourname  staff  2.5K Mar  2 15:50 package.json  ← ⚠️ 重要！必须有这个文件
   -rw-r--r--   1 yourname  staff  500K Mar  2 15:50 pnpm-lock.yaml
   -rw-r--r--   1 yourname  staff  2.0K Mar  2 15:50 tailwind.config.ts
   -rw-r--r--   1 yourname  staff  1.2K Mar  2 15:50 tsconfig.json
   -rw-r--r--   1 yourname  staff  5.2K Mar  2 15:50 README.md
   ```

#### Windows 用户（使用 WinRAR 或 7-Zip）

1. 打开下载文件夹
2. 找到 `gytl-tools-deploy-v1.0.1.tar.gz`
3. 右键点击文件
4. 选择"解压到当前文件夹"或"提取到此处"
5. 解压后会得到一个名为 `gytl-tools` 的文件夹

### ✅ 解压成功检查

**关键检查点**：
- ✅ 能看到 `gytl-tools` 文件夹
- ✅ 进入 `gytl-tools` 后能看到 `package.json` 文件
- ✅ 能看到 `src/` 和 `public/` 目录

---

## 第三步：创建 GitHub 仓库

### 🌐 操作步骤

#### 步骤 1：登录 GitHub

1. 打开浏览器
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
- ✅ **不要勾选**任何选项（Add a README file、Add .gitignore、Choose a license）
- 因为我们已经有了代码

4. 点击页面底部的 **Create repository** 按钮

#### 步骤 4：记录仓库地址

创建成功后，GitHub 会显示仓库地址：

**HTTPS 地址**：
```
https://github.com/你的用户名/gytl-tools.git
```

**SSH 地址**：
```
git@github.com:你的用户名/gytl-tools.git
```

**记下这个地址**，后面会用到。

---

## 第四步：上传代码到 GitHub

### 📝 操作步骤（Mac 终端）

#### 步骤 1：确保在项目目录

```bash
# 查看当前目录
pwd
```

**预期输出**：
```
/Users/你的用户名/Downloads/gytl-tools
```

**如果不是**，进入正确的目录：
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

**说明**：
- `git init`：在当前目录创建一个 Git 仓库
- 会生成一个隐藏的 `.git` 目录

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

**说明**：
- 显示所有未跟踪的文件
- 这些文件还没有被 Git 管理

#### 步骤 4：添加所有文件到暂存区

```bash
git add .
```

**说明**：
- `git add .`：添加当前目录下所有文件到暂存区
- `.` 表示当前目录

#### 步骤 5：再次查看 Git 状态

```bash
git status
```

**预期输出**：
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   .coze
	new file:   .gitignore
	new file:   next.config.ts
	new file:   package.json
	new file:   pnpm-lock.yaml
	new file:   public/file.svg
	new file:   public/globe.svg
	new file:   public/next.svg
	new file:   public/vercel.svg
	new file:   public/window.svg
	new file:   README.md
	new file:   scripts/...
	new file:   src/...

nothing added to commit but untracked files present
```

**说明**：
- 文件已添加到暂存区
- 准备提交

#### 步骤 6：提交代码

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

**说明**：
- `git commit`：提交暂存区的文件
- `-m`：指定提交信息
- `abcd123`：提交 ID（每次提交都不同）

#### 步骤 7：连接到 GitHub 远程仓库

**方式 A：使用 HTTPS（推荐新手）**

```bash
# 替换为你的仓库地址
git remote add origin https://github.com/你的用户名/gytl-tools.git
```

**方式 B：使用 SSH（推荐高级用户）**

如果你已经配置了 SSH 密钥：

```bash
git remote add origin git@github.com:你的用户名/gytl-tools.git
```

#### 步骤 8：验证远程仓库地址

```bash
git remote -v
```

**预期输出**：
```
origin  https://github.com/你的用户名/gytl-tools.git (fetch)
origin  https://github.com/你的用户名/gytl-tools.git (push)
```

**说明**：
- 显示远程仓库的地址
- `fetch`：拉取地址
- `push`：推送地址

#### 步骤 9：设置主分支

```bash
git branch -M main
```

**说明**：
- 将当前分支重命名为 `main`
- GitHub 默认使用 `main` 作为主分支

#### 步骤 10：推送代码到 GitHub

```bash
git push -u origin main
```

**如果使用 HTTPS**，可能会提示输入用户名和密码：

```
Username: leeqf1007@163.com
Password: [输入 Personal Access Token 或 GitHub 密码]
```

**预期输出**（成功）：
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
- ✅ `Writing objects: 100%` → 写入完成
- ✅ `remote: Resolving deltas: 100%` → 远程处理完成
- ✅ `[new branch] main -> main` → 新分支创建成功

### ✅ 上传成功检查

#### 检查 1：GitHub 网页验证

1. 访问你的仓库：https://github.com/你的用户名/gytl-tools
2. 查看文件列表
3. 应该能看到：
   - `src/` 文件夹
   - `public/` 文件夹
   - `package.json` 文件
   - `README.md` 文件
   - 等等...

#### 检查 2：终端验证

```bash
git status
```

**预期输出**：
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

**关键标志**：
- ✅ `up to date with 'origin/main'` → 与远程同步

---

## 第五步：在 Vercel 上部署

### 🚀 操作步骤

#### 步骤 1：登录 Vercel

1. 打开浏览器
2. 访问：https://vercel.com
3. 点击右上角的 **Login**
4. 选择 **Continue with GitHub**
5. 授权 Vercel 访问你的 GitHub

**说明**：
- Vercel 会请求访问你的 GitHub 仓库权限
- 点击"Authorize Vercel"授权

#### 步骤 2：导入项目

1. 登录后，点击页面右上角的 **Add New...** 按钮
2. 选择 **Project**

#### 步骤 3：选择 GitHub 仓库

1. 在 **Import Git Repository** 页面
2. 找到你刚才创建的 `gytl-tools` 仓库
3. 点击 **Import** 按钮

**说明**：
- 如果找不到仓库，点击"Configure Git"或"Adjust"
- 确保已授权 Vercel 访问你的 GitHub

#### 步骤 4：配置项目

Vercel 会自动检测到这是一个 Next.js 项目，并显示配置信息：

**Project Name（项目名）**：
```
gytl-tools
```

**Framework Preset（框架预设）**：
```
Next.js
```

**Root Directory（根目录）**：
```
./
```

**Build Command（构建命令）**：
```
pnpm run build
```

**Output Directory（输出目录）**：
```
.next
```

**Install Command（安装命令）**：
```
pnpm install
```

**说明**：
- Vercel 会自动识别这些配置
- 通常不需要修改

#### 步骤 5：配置环境变量

**重要步骤**：必须配置环境变量！

1. 向下滚动到 **Environment Variables** 部分
2. 点击 **Add New** 按钮

**添加第 1 个环境变量**：

- **Name**: `NEXT_PUBLIC_APP_NAME`
- **Value**: `GYTL-Tools`
- **Environment**: 勾选 `Production`、`Preview`、`Development`（全选）
- 点击 **Add**

**添加第 2 个环境变量**：

- **Name**: `NEXT_PUBLIC_DEFAULT_MIN_CHANGE`
- **Value**: `3`
- **Environment**: 全选
- 点击 **Add**

**添加第 3 个环境变量**：

- **Name**: `NEXT_PUBLIC_DEFAULT_MAX_CHANGE`
- **Value**: `8`
- **Environment**: 全选
- 点击 **Add**

**添加第 4 个环境变量**：

- **Name**: `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME`
- **Value**: `60`
- **Environment**: 全选
- 点击 **Add**

**完成后应该看到 4 个环境变量**：
```
NEXT_PUBLIC_APP_NAME                    Production, Preview, Development
NEXT_PUBLIC_DEFAULT_MIN_CHANGE          Production, Preview, Development
NEXT_PUBLIC_DEFAULT_MAX_CHANGE          Production, Preview, Development
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME       Production, Preview, Development
```

#### 步骤 6：开始部署

1. 确认所有配置正确
2. 点击页面底部的 **Deploy** 按钮

#### 步骤 7：等待部署完成

部署过程通常需要 2-5 分钟，你会看到以下进度：

1. **Cloning repository** - 克隆代码
2. **Installing dependencies** - 安装依赖（运行 `pnpm install`）
3. **Building project** - 构建项目（运行 `pnpm run build`）
4. **Deploying to edge network** - 部署到边缘网络

**预计时间**：2-5 分钟

**说明**：
- 可以查看详细的构建日志
- 如果有错误，日志会显示在页面上

#### 步骤 8：部署成功

部署成功后，你会看到：

```
✅ Deployed!
```

Vercel 会提供一个默认域名：
```
https://gytl-tools-你的用户名.vercel.app
```

**记下这个域名**，这是你应用的访问地址。

---

## 第六步：验证部署

### ✅ 操作步骤

#### 步骤 1：访问应用

在浏览器中访问 Vercel 提供的域名：
```
https://gytl-tools-你的用户名.vercel.app
```

#### 步骤 2：检查页面是否正常加载

**预期效果**：
- ✅ 页面正常显示
- ✅ 标题显示 "GYTL-Tools"
- ✅ 有"选股结果"、"资金管理"、"筛选条件"三个标签页

#### 步骤 3：测试功能

**测试 1：股票筛选功能**

1. 点击"筛选条件"标签页
2. 调整筛选条件（如：涨幅 3% - 8%）
3. 点击"保存条件"按钮
4. 切换到"选股结果"标签页
5. 点击"全 A 股筛选"按钮
6. 等待筛选结果

**预期效果**：
- ✅ 显示筛选出的股票列表
- ✅ 每只股票显示代码、名称、涨幅等信息

**测试 2：股票搜索功能**

1. 在搜索框输入股票代码或名称（如：600519 或 贵州茅台）
2. 查看搜索结果

**预期效果**：
- ✅ 显示匹配的股票
- ✅ 支持实时搜索

**测试 3：资金管理功能**

1. 点击"资金管理"标签页
2. 查看资金看板数据

**预期效果**：
- ✅ 显示总资金、当前余额、总收益等信息
- ✅ 显示交易记录列表

#### 步骤 4：检查浏览器控制台

如果页面有异常：

1. 按 `F12` 打开开发者工具
2. 切换到 **Console（控制台）** 标签
3. 查看是否有错误信息

**常见警告（可以忽略）**：
```
Current using mock data
```

**说明**：
- 如果无法连接到真实 API，系统会自动使用模拟数据
- 不影响使用

---

## 常见问题解决

### 问题 1：git push 时提示 "Authentication failed"

**原因**：GitHub 密码验证失败

**解决方案**：

**方式 A：使用 Personal Access Token（推荐）**

1. 生成 Personal Access Token：
   - 访问：https://github.com/settings/tokens
   - 点击 **Generate new token (classic)**
   - Note: `gytl-tools-deploy`
   - Expiration: `No expiration`
   - 勾选权限：✅ `repo`
   - Generate token
   - **复制 token**

2. 使用 token 推送：
   ```bash
   git push -u origin main
   # Username: leeqf1007@163.com
   # Password: 粘贴刚才复制的 token
   ```

**方式 B：使用 SSH**

参考上面的 SSH 配置步骤。

---

### 问题 2：git push 时提示 "Error in the HTTP2 framing layer"

**原因**：Git 与 GitHub 通信时 HTTP/2 协议兼容性问题

**解决方案**：

```bash
# 禁用 HTTP/2
git config --global http."https://github.com".version HTTP/1.1

# 重新推送
git push -u origin main
```

---

### 问题 3：Vercel 构建失败 - "Cannot find module"

**原因**：依赖安装失败

**解决方案**：

1. 检查 **Install Command** 是否为 `pnpm install`
2. 检查 **Build Command** 是否为 `pnpm run build`
3. 重新部署

---

### 问题 4：Vercel 构建失败 - "Command failed"

**原因**：构建命令执行失败

**解决方案**：

1. 查看 Vercel Build Logs 获取详细错误信息
2. 检查 `package.json` 中的 scripts 是否正确
3. 修复错误后重新部署

---

### 问题 5：页面无法访问 - 404 Not Found

**原因**：
- 域名输入错误
- 部署还在进行中
- 部署失败

**解决方案**：

1. 等待 1-2 分钟（可能还在部署中）
2. 检查 Vercel 部署状态
3. 确认域名输入正确
4. 查看浏览器控制台错误信息

---

### 问题 6：API 调用失败

**说明**：
- 系统会自动使用模拟数据
- 不影响使用

**如果需要真实数据**：

1. 检查网络连接
2. 确认 API 服务可用
3. 查看浏览器控制台错误信息

---

## 📋 完整操作清单

### 下载阶段
- [ ] 从沙箱下载 `gytl-tools-deploy-v1.0.1.tar.gz`
- [ ] 保存到下载文件夹

### 解压阶段
- [ ] 打开终端
- [ ] 进入下载目录：`cd ~/Downloads`
- [ ] 解压文件：`tar -xzf gytl-tools-deploy-v1.0.1.tar.gz`
- [ ] 进入项目目录：`cd gytl-tools`
- [ ] 检查文件：`ls -la`（确认能看到 `package.json`）

### Git 初始化阶段
- [ ] 初始化 Git 仓库：`git init`
- [ ] 添加文件：`git add .`
- [ ] 提交代码：`git commit -m "Initial commit: GYTL-Tools v1.0.1"`

### GitHub 上传阶段
- [ ] 创建 GitHub 仓库
- [ ] 连接远程仓库：`git remote add origin https://github.com/你的用户名/gytl-tools.git`
- [ ] 设置主分支：`git branch -M main`
- [ ] 推送代码：`git push -u origin main`
- [ ] 在 GitHub 网页验证文件已上传

### Vercel 部署阶段
- [ ] 登录 Vercel
- [ ] 导入 GitHub 仓库
- [ ] 确认项目配置
- [ ] 添加 4 个环境变量
- [ ] 点击 Deploy
- [ ] 等待部署完成（2-5 分钟）

### 验证阶段
- [ ] 访问 Vercel 提供的域名
- [ ] 检查页面是否正常加载
- [ ] 测试股票筛选功能
- [ ] 测试股票搜索功能
- [ ] 测试资金管理功能

---

## 🎉 完成！

当你完成所有步骤后，恭喜你！

### 你将获得：

✅ 一个部署到 Vercel 的 GYTL-Tools 应用
✅ 一个 GitHub 仓库托管代码
✅ 一个可访问的公网域名

### 访问地址：

```
https://gytl-tools-你的用户名.vercel.app
```

### GitHub 仓库：

```
https://github.com/你的用户名/gytl-tools
```

---

## 💡 下一步

1. **配置自定义域名**（可选）
   - 在 Vercel 项目设置中添加你的域名
   - 配置 DNS 记录

2. **分享给你的朋友**
   - 直接分享 Vercel 提供的域名
   - 或配置自定义域名后分享

3. **持续优化**
   - 根据使用反馈调整功能
   - 在 GitHub 上提交 issue 或 PR

---

## 📞 获取帮助

如果遇到问题：

1. **查看本文档的常见问题部分**
2. **查看 Vercel Build Logs**
3. **查看浏览器控制台错误信息**
4. **联系技术支持**

---

**GYTL-Tools Team**
**2025-03-02**
**版本：v1.0.1**

祝您部署顺利！🚀
