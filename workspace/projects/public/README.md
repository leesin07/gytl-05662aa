# 🚀 GYTL-Tools v05662aa 部署包下载

## 📦 部署包信息

| 项目 | 信息 |
|------|------|
| **版本** | 05662aa |
| **文件名** | GYTL-Tools-v05662aa-Deploy.tar.gz |
| **文件大小** | 1.1 MB |
| **SHA256** | `3fd12e294b67d59d9b95d0bdc8a01183e54a2e66b24edc43d4f65cf1ab94f0b0` |
| **更新时间** | 2026-03-09 |

## ⬇️ 下载方式

### 方法1: 直接下载（推荐）

**下载链接:**
```
http://9.97.30.117:5000/GYTL-Tools-v05662aa-Deploy.tar.gz
```

**在浏览器中打开上述链接即可下载**

### 方法2: 使用curl命令下载

```bash
curl -O http://9.97.30.117:5000/GYTL-Tools-v05662aa-Deploy.tar.gz
```

### 方法3: 访问下载页面

```
http://9.97.30.117:5000/download.html
```

页面包含所有下载链接和操作说明

## 📖 部署指南

下载完整的部署指南：
```
http://9.97.30.117:5000/DEPLOY-GUIDE.md
```

## 🔐 验证文件完整性

下载完成后，验证SHA256校验和：

```bash
sha256sum GYTL-Tools-v05662aa-Deploy.tar.gz
```

应该显示：
```
3fd12e294b67d59d9b95d0bdc8a01183e54a2e66b24edc43d4f65cf1ab94f0b0  GYTL-Tools-v05662aa-Deploy.tar.gz
```

## 📋 快速部署步骤

```bash
# 1. 解压文件
tar -xzf GYTL-Tools-v05662aa-Deploy.tar.gz

# 2. 进入项目目录
cd gytl-tools-05662aa

# 3. 安装依赖
npm install

# 4. 初始化Git仓库
git init
git add .
git commit -m "Initial commit: GYTL-Tools v05662aa"

# 5. 添加GitHub远程仓库（替换为你的仓库URL）
git remote add origin <你的GitHub仓库URL>

# 6. 推送到GitHub
git branch -M main
git push -u origin main

# 7. 访问Vercel导入仓库并部署
# https://vercel.com
```

## ✅ 项目特性

- ✅ Next.js 16 + React 19 + TypeScript 5
- ✅ shadcn/ui 组件库
- ✅ 东方财富API集成（全A股实时行情）
- ✅ 智能股票筛选（杨永兴隔夜套利法）
- ✅ 资金管理系统
- ✅ 交易记录管理
- ✅ 数据本地存储（localStorage）

## 💡 提示

1. 部署包已排除 `node_modules`，首次运行需要执行 `npm install`
2. 数据存储在浏览器 `localStorage` 中，清除浏览器数据会重置所有记录
3. 首次运行时会自动使用模拟数据，可在交易时段连接真实行情API

---

**注意**: 沙箱服务已启动，端口5000正在监听，可以直接访问上述下载链接
