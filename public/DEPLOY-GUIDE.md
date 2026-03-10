# GYTL-Tools v05662aa 部署指南

## 📦 部署包信息

- **版本**: 05662aa
- **文件名**: GYTL-Tools-v05662aa-Deploy.tar.gz
- **文件大小**: 1.1 MB
- **SHA256**: `3fd12e294b67d59d9b95d0bdc8a01183e54a2e66b24edc43d4f65cf1ab94f0b0`

## 🚀 快速开始

### 步骤1: 下载部署包

```bash
curl -O http://9.97.30.117:5000/GYTL-Tools-v05662aa-Deploy.tar.gz
```

### 步骤2: 验证文件完整性

```bash
sha256sum GYTL-Tools-v05662aa-Deploy.tar.gz
# 应该显示: 3fd12e294b67d59d9b95d0bdc8a01183e54a2e66b24edc43d4f65cf1ab94f0b0  GYTL-Tools-v05662aa-Deploy.tar.gz
```

### 步骤3: 解压并部署到GitHub

```bash
# 解压文件
tar -xzf GYTL-Tools-v05662aa-Deploy.tar.gz

# 进入项目目录
cd gytl-tools-05662aa

# 安装依赖
npm install

# 初始化Git仓库
git init
git add .
git commit -m "Initial commit: GYTL-Tools v05662aa"

# 在GitHub上创建新仓库后，添加远程仓库
git remote add origin <你的GitHub仓库URL>

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤4: 部署到Vercel

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 导入你刚创建的GitHub仓库
4. 点击 "Deploy"

---

**版本**: 05662aa
**更新时间**: 2026-03-09
