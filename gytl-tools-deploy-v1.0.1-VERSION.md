# GYTL-Tools 部署包版本信息

## 📦 包信息

- **包名称**：gytl-tools-deploy
- **版本号**：v1.0.1
- **发布日期**：2025-03-02
- **包大小**：286KB
- **文件格式**：tar.gz

## ✨ 版本变更

### v1.0.1 (2025-03-02)
- 🔧 修复 Vercel 部署错误
- 🗑️ 删除未使用的 `assets/` 目录
- ✅ 优化静态资源目录结构

### v1.0.0 (2025-02-27)
- 🎉 初始版本发布
- ✨ 实现完整的选股功能
- 💰 添加资金管理模块
- 📊 支持全 A 股实时筛选

## 📋 包内容

### 包含的文件
```
gytl-tools-deploy-v1.0.1.tar.gz
├── src/                    # 源代码
│   ├── app/               # Next.js 应用路由
│   ├── components/        # React 组件
│   ├── lib/               # 工具函数
│   └── types/             # TypeScript 类型定义
├── public/                # 静态资源
├── scripts/               # 脚本文件
├── .coze                  # 项目配置
├── .gitignore            # Git 忽略文件
├── next.config.ts        # Next.js 配置
├── package.json          # 项目依赖
├── pnpm-lock.yaml        # 依赖锁定文件
├── tailwind.config.ts    # Tailwind 配置
└── tsconfig.json         # TypeScript 配置
```

### 排除的文件
- ❌ `node_modules/` - 依赖包（部署时自动安装）
- ❌ `.next/` - 构建输出（部署时自动生成）
- ❌ `.git/` - Git 仓库（GitHub 上传后自动创建）
- ❌ `*.log` - 日志文件
- ❌ `.coze-logs/` - Coze 日志
- ❌ `*.tgz` - 旧的部署包

## 🔧 部署要求

### 系统要求
- Node.js 18.x 或更高版本
- pnpm 8.x 或更高版本
- Git

### 推荐部署平台
- ✅ Vercel（最推荐）
- ✅ Netlify
- ✅ Railway
- ✅ Render
- ✅ 云服务器（Docker）

### 环境变量
- `NEXT_PUBLIC_APP_NAME` - 应用名称（默认：GYTL-Tools）
- `NEXT_PUBLIC_DEFAULT_MIN_CHANGE` - 默认最小涨幅（默认：3）
- `NEXT_PUBLIC_DEFAULT_MAX_CHANGE` - 默认最大涨幅（默认：8）
- `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME` - 股票列表缓存时间（秒，默认：60）

## 🚀 快速开始

### 方式一：上传到 GitHub + Vercel 部署

1. **解压部署包**
   ```bash
   tar -xzf gytl-tools-deploy-v1.0.1.tar.gz
   cd gytl-tools
   ```

2. **初始化 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GYTL-Tools v1.0.1"
   ```

3. **连接到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/gytl-tools.git
   git branch -M main
   git push -u origin main
   ```

4. **在 Vercel 上部署**
   - 访问：https://vercel.com
   - 导入 GitHub 仓库
   - 配置环境变量
   - 点击部署

### 方式二：本地开发

1. **解压部署包**
   ```bash
   tar -xzf gytl-tools-deploy-v1.0.1.tar.gz
   cd gytl-tools
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **访问应用**
   - 打开浏览器访问：http://localhost:5000

## 📚 相关文档

- **GitHub 部署指南**：`GITHUB_DEPLOYMENT_GUIDE.md`
- **部署检查清单**：`GITHUB_DEPLOYMENT_CHECKLIST.md`
- **项目说明**：`README.md`
- **云服务器部署**：`CLOUD_DEPLOYMENT_GUIDE.md`

## 🔐 校验信息

### SHA256 校验和
```
9b50b15120d3e5a3dcfd58aa0f3116e345e5f162a6f857b019ae6ae62f7395b9  gytl-tools-deploy-v1.0.1.tar.gz
```

### 校验方法
```bash
sha256sum -c gytl-tools-deploy-v1.0.1.tar.gz.sha256
```

## 📞 技术支持

如果遇到问题：
1. 查看 `GITHUB_DEPLOYMENT_GUIDE.md` 详细指南
2. 检查 `GITHUB_DEPLOYMENT_CHECKLIST.md` 排查清单
3. 联系技术支持

## 📄 许可证

本项目仅供个人学习和研究使用。

---

**GYTL-Tools Team**
**2025-03-02**
