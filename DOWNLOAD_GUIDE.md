# GYTL-Tools 部署包下载说明

## 📦 部署包信息

**版本**：v1.0.0
**发布日期**：2026-02-28
**文件大小**：281 KB
**文件名**：`gytl-tools-deploy-v1.0.0.tar.gz`

---

## 🔐 SHA256 校验值

```
06ff84f8baae23b9967a0f5f96e6224c6bfa2d893d4290929abb70e669b84b6f  gytl-tools-deploy-v1.0.0.tar.gz
```

**校验方法**：
```bash
# 下载后，运行以下命令校验文件完整性
sha256sum -c gytl-tools-deploy-v1.0.0.tar.gz.sha256

# 或手动校验
sha256sum gytl-tools-deploy-v1.0.0.tar.gz
```

---

## 🚀 快速部署步骤

### 1. 下载部署包

从项目目录下载：
```bash
cp gytl-tools-deploy-v1.0.0.tar.gz ~/
```

或使用 SCP 从服务器下载：
```bash
scp user@server:/path/to/gytl-tools-deploy-v1.0.0.tar.gz ~/
```

### 2. 解压部署包

```bash
cd ~
tar -xzf gytl-tools-deploy-v1.0.0.tar.gz
```

解压后会得到以下文件：
- `gytl-tools-code.tar.gz` - 源代码压缩包
- `DEPLOYMENT_README.md` - 部署使用说明
- `VERSION_INFO.md` - 版本信息

### 3. 阅读部署说明

```bash
cat DEPLOYMENT_README.md
```

### 4. 解压源代码

```bash
tar -xzf gytl-tools-code.tar.gz
cd gytl-tools
```

### 5. 配置环境变量

```bash
# 复制环境变量示例
cp .env.example .env

# 编辑环境变量
vim .env
```

### 6. 启动服务

**方法一：使用部署脚本（推荐）**
```bash
# 赋予执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

**方法二：使用 Docker Compose**
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

**方法三：手动 Docker 部署**
```bash
# 构建镜像
docker build -t gytl-tools:latest .

# 运行容器
docker run -d \
  --name gytl-tools \
  -p 3000:3000 \
  --restart unless-stopped \
  gytl-tools:latest
```

### 7. 访问应用

- **本地**：http://localhost:3000
- **服务器**：http://your-server-ip:3000
- **域名**：https://your-domain.com（需配置）

---

## 📋 部署要求

### Docker 部署（推荐）
- ✅ Docker 20.10+
- ✅ Docker Compose 2.0+
- ✅ 至少 1GB 可用内存
- ✅ 至少 2GB 可用磁盘空间

### 传统部署
- ✅ Node.js 24.x
- ✅ pnpm 9.x
- ✅ 至少 2GB 可用内存
- ✅ 至少 5GB 可用磁盘空间

---

## 🔧 配置说明

### 环境变量

编辑 `.env` 文件，配置以下参数：

```bash
# 应用名称
NEXT_PUBLIC_APP_NAME=GYTL-Tools

# 筛选条件默认值
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8

# 股票列表缓存时间（秒）
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
```

### 端口配置

默认端口为 `3000`，可通过以下方式修改：

**Docker Compose**：编辑 `docker-compose.yml` 中的 `ports` 配置
**Docker**：修改 `-p 3000:3000` 为 `-p 你的端口:3000`
**传统部署**：修改启动脚本或使用环境变量 `PORT=3000`

---

## 📚 详细文档

部署包内包含完整的部署文档：

1. **DEPLOYMENT_README.md** - 部署使用说明（本文档）
2. **VERSION_INFO.md** - 版本信息和更新日志
3. **README.md** - 项目说明
4. **DEPLOY.md** - 部署文档
5. **CLOUD_DEPLOYMENT_GUIDE.md** - 云服务器部署完整指南
6. **DEPLOYMENT_CHECKLIST.md** - 部署前准备清单
7. **DEPLOYMENT_QUICK_REFERENCE.md** - 部署快速参考卡片

---

## 🎯 功能特性

### 核心功能
- ✅ 全A股筛选（支持5000+只股票）
- ✅ 股票搜索（代码和名称）
- ✅ 资金管理（流水和交易记录）
- ✅ 智能降级（API 失败时使用模拟数据）
- ✅ 实时行情显示

### 技术栈
- Next.js 16.1.1
- React 19.2.3
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- shadcn/ui

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

系统包含智能降级机制：
- 如果无法连接东方财富 API，会自动使用模拟数据
- 不影响核心功能使用
- 部署到真实环境后，API 会正常工作

### 4. 需要更多帮助？

查看详细文档：
- [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md) - 完整部署指南
- [DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md) - 快速参考

---

## 🔒 安全建议

1. **修改默认配置**：根据实际需求修改环境变量
2. **配置防火墙**：仅开放必要的端口（80、443）
3. **使用 HTTPS**：配置 SSL 证书加密传输
4. **定期更新**：保持系统和依赖包最新
5. **备份数据**：定期备份重要配置和数据

---

## 📞 技术支持

如遇问题，请查看：
- **云服务器部署完整指南**：`CLOUD_DEPLOYMENT_GUIDE.md`
- **部署快速参考**：`DEPLOYMENT_QUICK_REFERENCE.md`
- **部署前检查清单**：`DEPLOYMENT_CHECKLIST.md`

---

## 🎉 部署完成

部署成功后，您可以：

1. **访问应用**：打开浏览器访问配置的地址
2. **测试功能**：尝试股票筛选和搜索功能
3. **配置域名**：参考文档配置域名和 SSL
4. **设置监控**：配置日志监控和告警

---

**祝您部署成功！** 🚀

如有任何问题，请查看详细文档或联系技术支持。
