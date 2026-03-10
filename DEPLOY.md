# GYTL-Tools 部署文档

## 概述

GYTL-Tools 是一个基于杨永兴隔夜套利法的智能选股工具，支持实时行情数据接入和全A股筛选。

## 系统要求

- Node.js 24.x
- pnpm 9.x
- Docker (可选)
- Docker Compose (可选)

## 部署方式

### 方式一：Docker 部署（推荐）

#### 1. 克隆项目

```bash
git clone <repository-url>
cd gytl-tools
```

#### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 根据需要修改配置
nano .env
```

#### 3. 构建镜像

```bash
docker build -t gytl-tools:latest .
```

#### 4. 运行容器

```bash
docker run -d \
  --name gytl-tools \
  -p 3000:3000 \
  --restart unless-stopped \
  gytl-tools:latest
```

#### 5. 使用 Docker Compose（推荐）

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 6. 配置 Nginx 反向代理（可选）

```bash
# 复制Nginx配置
cp nginx.conf.example nginx.conf

# 修改配置
nano nginx.conf

# 使用Nginx启动
docker-compose --profile nginx up -d
```

### 方式二：传统部署

#### 1. 安装依赖

```bash
# 安装pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

#### 2. 构建项目

```bash
pnpm run build
```

#### 3. 启动服务

```bash
# 生产环境
pnpm start

# 或者使用PM2
npm install -g pm2
pm2 start npm --name "gytl-tools" -- start
```

#### 4. 配置反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 方式三：云服务器部署（阿里云/腾讯云）

#### 1. 购买云服务器

- 配置建议：2核4GB及以上
- 操作系统：Ubuntu 20.04 或 CentOS 7+
- 带宽：3Mbps及以上

#### 2. 安装Docker

```bash
# Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# CentOS
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

#### 3. 安装Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 4. 部署应用

```bash
# 克隆项目
git clone <repository-url>
cd gytl-tools

# 使用Docker Compose启动
docker-compose up -d
```

#### 5. 配置域名（可选）

```bash
# 购买域名并解析到服务器IP
# 配置Nginx反向代理
```

### 方式四：Vercel 部署（最简单）

#### 1. 推送代码到GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

#### 2. 导入到Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择你的GitHub仓库
4. 配置环境变量（如果有）
5. 点击 "Deploy"

#### 3. 完成！

Vercel会自动构建和部署，提供HTTPS支持。

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | GYTL-Tools |
| `NEXT_PUBLIC_APP_VERSION` | 应用版本 | 1.0.0 |
| `NEXT_PUBLIC_API_BASE_URL` | API基础路径 | /api |
| `NEXT_PUBLIC_DEFAULT_MIN_CHANGE` | 最小涨幅 | 3 |
| `NEXT_PUBLIC_DEFAULT_MAX_CHANGE` | 最大涨幅 | 8 |
| `NEXT_PUBLIC_DEFAULT_MIN_VOLUME_RATIO` | 最小量比 | 1.5 |
| `NEXT_PUBLIC_DEFAULT_MIN_TURNOVER_RATE` | 最小换手率 | 5 |
| `NEXT_PUBLIC_DEFAULT_MAX_TURNOVER_RATE` | 最大换手率 | 15 |
| `NEXT_PUBLIC_DEFAULT_MIN_MARKET_CAP` | 最小市值 | 0 |
| `NEXT_PUBLIC_DEFAULT_MAX_MARKET_CAP` | 最大市值 | 100 |
| `NEXT_PUBLIC_DEFAULT_MIN_PRICE` | 最低价格 | 10 |
| `NEXT_PUBLIC_DEFAULT_MAX_PRICE` | 最高价格 | 50 |
| `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME` | 股票列表缓存时间（秒） | 60 |
| `NEXT_PUBLIC_QUOTE_CACHE_TIME` | 实时行情缓存时间（秒） | 5 |
| `NEXT_PUBLIC_MAX_STOCKS_PER_QUERY` | 每次最大查询数量 | 200 |
| `NEXT_PUBLIC_MAX_SEARCH_RESULTS` | 搜索结果最大数量 | 100 |

## 性能优化

### 1. 启用CDN

建议使用CDN加速静态资源：
- Vercel自动提供
- 或使用Cloudflare、阿里云CDN等

### 2. 启用缓存

Next.js已内置缓存策略：
- 静态文件：365天
- API路由：60秒（可配置）

### 3. 数据库（可选）

如需持久化数据，可添加数据库：
- PostgreSQL
- MongoDB
- Redis（缓存）

### 4. 负载均衡（高并发场景）

使用Nginx负载均衡：
```nginx
upstream app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}
```

## 监控和日志

### 1. 查看日志

```bash
# Docker
docker logs -f gytl-tools

# Docker Compose
docker-compose logs -f app

# PM2
pm2 logs gytl-tools
```

### 2. 健康检查

访问 `/health` 端点检查服务状态：
```bash
curl http://localhost:3000/health
```

### 3. 监控工具

- 使用Prometheus + Grafana监控
- 使用Sentry记录错误
- 使用Google Analytics分析用户行为

## 安全配置

### 1. HTTPS配置

使用Let's Encrypt免费SSL证书：
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. 防火墙配置

```bash
# Ubuntu
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. 限制API访问

在Nginx中添加速率限制：
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ...
}
```

## 故障排查

### 问题1：无法访问外部API

**原因**：防火墙或网络限制

**解决方案**：
```bash
# 检查网络连接
ping push2.eastmoney.com

# 检查防火墙
sudo ufw status
sudo ufw allow out 80/tcp
sudo ufw allow out 443/tcp
```

### 问题2：Docker容器无法启动

**原因**：端口被占用或配置错误

**解决方案**：
```bash
# 检查端口占用
sudo lsof -i :3000

# 停止占用端口的服务
sudo systemctl stop nginx  # 如果Nginx占用

# 重新启动容器
docker-compose restart app
```

### 问题3：构建失败

**原因**：依赖版本冲突

**解决方案**：
```bash
# 清除缓存
pnpm store prune
rm -rf node_modules .next

# 重新安装
pnpm install
pnpm run build
```

### 问题4：数据加载缓慢

**原因**：API响应慢或网络延迟

**解决方案**：
- 调整缓存时间
- 使用CDN
- 优化查询逻辑
- 考虑使用Redis缓存

## 更新部署

### 1. 拉取最新代码

```bash
git pull origin main
```

### 2. 重新构建

```bash
# Docker
docker-compose build
docker-compose up -d

# 传统部署
pnpm install
pnpm run build
pm2 restart gytl-tools
```

### 3. 回滚（如果需要）

```bash
# Docker
git checkout <previous-commit>
docker-compose build
docker-compose up -d

# PM2
pm2 reload gytl-tools
```

## 备份与恢复

### 1. 数据备份

```bash
# 备份环境变量
cp .env .env.backup

# 备份数据库（如果有）
pg_dump -U username dbname > backup.sql
```

### 2. 数据恢复

```bash
# 恢复环境变量
cp .env.backup .env

# 恢复数据库
psql -U username dbname < backup.sql
```

## 成本估算

### 云服务器

- 阿里云ECS：2核4GB ≈ ¥200/月
- 腾讯云CVM：2核4GB ≈ ¥180/月
- AWS EC2：t3.medium ≈ ¥150/月

### 域名和SSL

- 域名：¥50-100/年
- SSL证书：免费（Let's Encrypt）

### CDN

- 阿里云CDN：按流量计费，¥0.24/GB
- Cloudflare：免费套餐足够使用

**总成本**：约 ¥200-300/月

## 技术支持

如有问题，请通过以下方式联系：
- GitHub Issues
- Email: support@example.com
- 文档: https://docs.example.com

## 许可证

MIT License
