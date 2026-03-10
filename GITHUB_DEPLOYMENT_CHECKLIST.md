# GitHub 部署快速检查清单

## 🚀 快速开始（Vercel 部署）

### 第一阶段：GitHub 准备

- [ ] **步骤 1.1**：登录 GitHub (https://github.com)
- [ ] **步骤 1.2**：创建新仓库
  - 仓库名：`gytl-tools`
  - 描述：`基于杨永兴隔夜套利法的智能选股工具`
  - 选择 Public（公开）
  - 不勾选任何初始化选项
  - 点击 **Create repository**
- [ ] **步骤 1.3**：复制仓库地址（如：`https://github.com/你的用户名/gytl-tools.git`）

### 第二阶段：推送代码

- [ ] **步骤 2.1**：初始化 Git 仓库
  ```bash
  cd /workspace/projects
  git init
  git add .
  git commit -m "Initial commit: GYTL-Tools v1.0.0"
  ```

- [ ] **步骤 2.2**：连接到 GitHub
  ```bash
  git remote add origin https://github.com/你的用户名/gytl-tools.git
  git branch -M main
  git push -u origin main
  ```
  - 用户名：GitHub 用户名
  - 密码：Personal Access Token（如果需要）

- [ ] **步骤 2.3**：验证推送成功
  - 在 GitHub 仓库页面查看代码是否已上传

### 第三阶段：连接 Vercel

- [ ] **步骤 3.1**：登录 Vercel
  - 访问：https://vercel.com
  - 点击 **Sign Up** 或 **Login**
  - 选择 **Continue with GitHub**
  - 授权 Vercel 访问 GitHub

- [ ] **步骤 3.2**：导入项目
  - 点击 **Add New...** → **Project**
  - 找到 `gytl-tools` 仓库
  - 点击 **Import**

### 第四阶段：配置项目

- [ ] **步骤 4.1**：确认项目配置
  - Project Name: `gytl-tools`
  - Framework Preset: `Next.js`
  - Root Directory: `./`
  - Build Command: `pnpm run build`
  - Output Directory: `.next`
  - Install Command: `pnpm install`

- [ ] **步骤 4.2**：配置环境变量
  点击 **Add New**，逐个添加：
  - `NEXT_PUBLIC_APP_NAME` = `GYTL-Tools`
  - `NEXT_PUBLIC_DEFAULT_MIN_CHANGE` = `3`
  - `NEXT_PUBLIC_DEFAULT_MAX_CHANGE` = `8`
  - `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME` = `60`
  - 每个变量都选择 Production、Preview、Development

### 第五阶段：部署

- [ ] **步骤 5.1**：开始部署
  - 检查所有配置是否正确
  - 点击 **Deploy** 按钮

- [ ] **步骤 5.2**：等待部署完成
  - 预计时间：2-5 分钟
  - 观察部署进度

- [ ] **步骤 5.3**：部署成功
  - 看到 `✅ Deployed!` 提示
  - 记录提供的域名（如：`https://gytl-tools-你的用户名.vercel.app`）

### 第六阶段：验证

- [ ] **步骤 6.1**：访问应用
  - 在浏览器中访问 Vercel 提供的域名

- [ ] **步骤 6.2**：测试功能
  - ✅ 页面正常加载
  - ✅ 股票筛选功能正常
  - ✅ 股票搜索功能正常
  - ✅ 资金管理功能正常

- [ ] **步骤 6.3**：（可选）配置自定义域名
  - 在 Vercel 项目页面 → Settings → Domains
  - 添加自定义域名
  - 配置 DNS 记录
  - 等待 DNS 生效（10-30 分钟）

---

## 📋 预计时间

| 阶段 | 预计时间 |
|------|----------|
| GitHub 准备 | 5-10 分钟 |
| 推送代码 | 5-10 分钟 |
| 连接 Vercel | 3-5 分钟 |
| 配置项目 | 5-10 分钟 |
| 部署 | 2-5 分钟 |
| 验证 | 5-10 分钟 |
| **总计** | **25-50 分钟** |

---

## 🔑 重要信息

### Personal Access Token（如需要）

**生成步骤**：
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Note: `gytl-tools-deploy`
5. Expiration: `No expiration`
6. 勾选 `repo` 权限
7. Generate token
8. **复制并保存 token**

### 环境变量配置

在 Vercel 中必须配置的环境变量：

```bash
NEXT_PUBLIC_APP_NAME=GYTL-Tools
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
```

---

## 🆘 常见问题快速解决

### 问题 1：推送代码失败

**解决方案**：使用 Personal Access Token
```bash
git push -u origin main
# 用户名：GitHub 用户名
# 密码：粘贴 token
```

### 问题 2：Vercel 部署失败

**解决方案**：
1. 检查构建日志
2. 确认 `package.json` 中的脚本正确
3. 检查环境变量是否配置

### 问题 3：页面无法访问

**解决方案**：
1. 等待 1-2 分钟，可能还在部署中
2. 检查 Vercel 部署日志
3. 确认域名输入正确

### 问题 4：API 调用失败

**说明**：系统会自动使用模拟数据，不影响使用

---

## 📚 相关文档

- **详细部署指南**：`GITHUB_DEPLOYMENT_GUIDE.md`
- **项目说明**：`README.md`
- **部署参考**：`DEPLOY.md`
- **云服务器部署**：`CLOUD_DEPLOYMENT_GUIDE.md`

---

## 🎉 完成标准

当所有项目都打钩后，说明你已成功部署：

- [x] GitHub 仓库创建完成
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

**祝部署成功！** 🚀
