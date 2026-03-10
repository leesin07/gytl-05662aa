# GYTL-Tools 部署包使用说明

## 📦 包含内容

本部署包包含以下文件和目录：

### 核心文件
- `Dockerfile` - Docker 镜像构建文件
- `docker-compose.yml` - Docker Compose 配置
- `deploy.sh` - 快速部署脚本
- `.env.example` - 环境变量配置示例

### 源代码
- `src/` - 源代码目录
  - `app/` - Next.js 应用代码
  - `components/` - React 组件
  - `lib/` - 工具函数
  - `types/` - TypeScript 类型定义

### 配置文件
- `package.json` - 项目依赖配置
- `pnpm-lock.yaml` - 依赖锁定文件
- `next.config.ts` - Next.js 配置
- `.dockerignore` - Docker 构建忽略文件
- `nginx.conf.example` - Nginx 配置示例

### 文档
- `README.md` - 项目说明
- `DEPLOY.md` - 部署文档
- `CLOUD_DEPLOYMENT_GUIDE.md` - 云服务器部署完整指南
- `DEPLOYMENT_CHECKLIST.md` - 部署前准备清单
- `DEPLOYMENT_QUICK_REFERENCE.md` - 部署快速参考卡片

---

## 🚀 快速部署

### 方法一：使用 Docker Compose（推荐）

1. **解压部署包**
   ```bash
   tar -xzf gytl-tools-deploy.tar.gz
   cd gytl-tools
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，根据需要修改配置
   vim .env
   ```

3. **启动服务**
   ```bash
   # 赋予执行权限
   chmod +x deploy.sh

   # 运行部署脚本
   ./deploy.sh
   ```

   或手动执行：
   ```bash
   docker-compose up -d
   ```

4. **访问应用**
   ```
   http://localhost:3000
   ```

---

### 方法二：手动 Docker 部署

1. **解压部署包**
   ```bash
   tar -xzf gytl-tools-deploy.tar.gz
   cd gytl-tools
   ```

2. **构建镜像**
   ```bash
   docker build -t gytl-tools:latest .
   ```

3. **运行容器**
   ```bash
   docker run -d \
     --name gytl-tools \
     -p 3000:3000 \
     --restart unless-stopped \
     gytl-tools:latest
   ```

4. **查看日志**
   ```bash
   docker logs -f gytl-tools
   ```

---

### 方法三：传统部署（需要 Node.js 环境）

1. **解压部署包**
   ```bash
   tar -xzf gytl-tools-deploy.tar.gz
   cd gytl-tools
   ```

2. **安装依赖**
   ```bash
   # 安装 pnpm（如果没有）
   npm install -g pnpm

   # 安装项目依赖
   pnpm install
   ```

3. **构建项目**
   ```bash
   pnpm run build
   ```

4. **启动服务**
   ```bash
   # 生产环境
   pnpm start

   # 或使用 PM2
   npm install -g pm2
   pm2 start npm --name "gytl-tools" -- start
   ```

---

## 📋 环境要求

### Docker 部署（推荐）
- Docker 20.10+
- Docker Compose 2.0+

### 传统部署
- Node.js 24.x
- pnpm 9.x

---

## 🔧 环境变量配置

复制 `.env.example` 为 `.env` 并配置：

```bash
# 应用配置
NEXT_PUBLIC_APP_NAME=GYTL-Tools

# 筛选条件默认值
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8

# 股票列表缓存时间（秒）
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
```

---

## 🌐 域名和 SSL 配置

详细步骤请参考：
- [云服务器部署完整指南](./CLOUD_DEPLOYMENT_GUIDE.md)

快速配置：
1. 配置域名解析到服务器 IP
2. 安装 Nginx 和 Certbot
3. 获取 SSL 证书：
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📊 端口说明

| 端口 | 说明 |
|------|------|
| 3000 | 应用端口（默认）|
| 80 | HTTP（Nginx 反向代理）|
| 443 | HTTPS（SSL 证书）|

---

## 📝 常用命令

```bash
# Docker 命令
docker ps                    # 查看运行中的容器
docker logs -f gytl-tools    # 查看日志
docker restart gytl-tools    # 重启容器
docker stop gytl-tools       # 停止容器

# Docker Compose 命令
docker-compose up -d         # 启动服务
docker-compose down          # 停止服务
docker-compose logs -f       # 查看日志
docker-compose restart       # 重启服务

# 查看资源使用
docker stats gytl-tools
```

---

## 🆘 常见问题

### 1. 容器无法启动

```bash
# 查看日志
docker logs gytl-tools

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 2. 无法访问应用

```bash
# 检查容器状态
docker ps

# 检查端口占用
sudo netstat -tulpn | grep 3000

# 检查防火墙
sudo ufw status
```

### 3. API 调用失败

当前版本包含智能降级机制：
- 如果无法连接东方财富 API，会自动使用模拟数据
- 不影响核心功能使用
- 部署到真实环境后，API 会正常工作

---

## 📚 更多文档

- [README.md](./README.md) - 项目说明
- [DEPLOY.md](./DEPLOY.md) - 部署文档
- [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md) - 云服务器部署完整指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署前准备清单
- [DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md) - 部署快速参考卡片

---

## 🎉 部署完成

部署成功后，访问地址：
- 本地：http://localhost:3000
- 服务器：http://your-server-ip:3000
- 域名：https://your-domain.com

祝您使用愉快！🚀
