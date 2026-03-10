# GYTL-Tools 快速部署参考卡片

> 打印此卡片，方便快速参考关键命令。

---

## 🚀 一键部署（推荐）

```bash
# 一键部署脚本
./scripts/one-click-deploy.sh
```

---

## 📋 手动部署步骤

### 1️⃣ 下载部署包

```bash
cd /tmp
wget https://github.com/leesin07/gytl-tools/releases/download/v1.1.0/gytl-tools-v1.1.0.tar.gz
```

### 2️⃣ 解压并移动

```bash
tar -xzf gytl-tools-v1.1.0.tar.gz
sudo mv gytl-tools-v1.1.0 /workspace/gytl-tools
cd /workspace/gytl-tools
```

### 3️⃣ 安装依赖

```bash
pnpm install
```

### 4️⃣ 构建项目

```bash
pnpm build
```

### 5️⃣ 启动服务

```bash
pm2 start npm --name "gytl-tools" -- start
pm2 save
```

---

## 🔍 验证部署

```bash
# 检查服务状态
pm2 status

# 检查端口
ss -lptn 'sport = :5000'

# 测试访问
curl -I http://localhost:5000
```

---

## 🛠️ 常用命令

### 服务管理

```bash
# 重启
pm2 restart gytl-tools

# 停止
pm2 stop gytl-tools

# 查看日志
pm2 logs gytl-tools

# 查看监控
pm2 monit
```

### 快速更新

```bash
# 快速部署（用于迭代更新）
./scripts/quick-deploy.sh

# 部署前测试
./scripts/pre-deploy-test.sh

# 快速回滚
./scripts/quick-rollback.sh
```

### API 测试

```bash
# 测试 API
curl -s http://localhost:5000/api/stocks/list | jq '.metadata'

# 测试 API 连接
node scripts/test-api.js
```

---

## ⚠️ 故障排查

### 端口被占用

```bash
lsof -i:5000
kill -9 <PID>
```

### 重启服务

```bash
pm2 restart gytl-tools
```

### 查看错误日志

```bash
pm2 logs gytl-tools --err
```

### 重新构建

```bash
rm -rf .next
pnpm build
```

---

## 📚 文档链接

| 文档 | 说明 |
|------|------|
| [逐步部署指引](./STEP_BY_STEP_DEPLOYMENT.md) | 完整的逐步部署指南 |
| [迭代部署指引](./ITERATION_DEPLOYMENT_GUIDE.md) | 迭代更新指南 |
| [快速开始](./ITERATION_QUICK_START.md) | 快速开始指南 |
| [脚本使用指南](./SCRIPTS_GUIDE.md) | 工具脚本使用 |
| [API 状态说明](./API_STATUS.md) | API 对接说明 |
| [版本历史](./VERSION.md) | 版本变更记录 |

---

## 🆘 获取帮助

- 查看 README.md：详细项目说明
- 查看日志：`pm2 logs gytl-tools`
- 查看文档：`docs/` 目录

---

**版本：v1.1.0**
**最后更新：2024-03-06**
