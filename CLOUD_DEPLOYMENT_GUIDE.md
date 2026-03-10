# GYTL-Tools 云服务器部署完整指南

## 📋 目录

1. [服务器准备](#服务器准备)
2. [系统初始化](#系统初始化)
3. [Docker 环境安装](#docker-环境安装)
4. [项目部署](#项目部署)
5. [域名与 SSL 配置](#域名与-ssl-配置)
6. [Nginx 反向代理](#nginx-反向代理)
7. [监控与日志](#监控与日志)
8. [常见问题排查](#常见问题排查)
9. [安全加固](#安全加固)

---

## 服务器准备

### 1. 云服务器选购建议

| 配置项 | 推荐配置 | 最低配置 | 说明 |
|--------|----------|----------|------|
| CPU | 2核及以上 | 1核 | Next.js 构建需要 CPU |
| 内存 | 4GB 及以上 | 2GB | Node.js 运行需要内存 |
| 存储 | 40GB SSD | 20GB SSD | SSD 性能更好 |
| 带宽 | 3Mbps 及以上 | 1Mbps | 影响页面加载速度 |
| 操作系统 | Ubuntu 20.04/22.04 | Ubuntu 20.04/22.04 | 本文档基于 Ubuntu |

### 2. 推荐云服务商

- **阿里云 ECS**：https://www.aliyun.com/product/ecs
- **腾讯云 CVM**：https://cloud.tencent.com/product/cvm
- **华为云 ECS**：https://www.huaweicloud.com/product/ecs.html
- **DigitalOcean**：https://www.digitalocean.com/ (海外)

### 3. 服务器安全组配置

开放以下端口：

| 端口 | 协议 | 说明 |
|------|------|------|
| 22 | TCP | SSH (限制IP) |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3000 | TCP | 应用端口 (可选，仅用于测试) |

**安全建议**：
- ✅ 端口 22 只允许你的 IP 访问
- ✅ 使用 SSH 密钥而非密码登录
- ❌ 不要开放数据库端口到公网

---

## 系统初始化

### 1. 连接服务器

```bash
# 使用 SSH 密钥
ssh -i /path/to/your-key.pem root@your-server-ip

# 或使用密码（不推荐）
ssh root@your-server-ip
```

### 2. 更新系统

```bash
# 更新软件包列表
apt update

# 升级已安装的软件包
apt upgrade -y

# 安装基础工具
apt install -y curl wget git vim ufw fail2ban
```

### 3. 创建部署用户（推荐）

```bash
# 创建用户
adduser deploy

# 赋予 sudo 权限
usermod -aG sudo deploy

# 切换到部署用户
su - deploy
```

### 4. 配置 SSH 密钥（可选）

```bash
# 在本地生成 SSH 密钥（如果没有）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 将公钥复制到服务器
ssh-copy-id deploy@your-server-ip

# 禁用密码登录（编辑 /etc/ssh/sshd_config）
sudo vim /etc/ssh/sshd_config

# 修改以下配置
PasswordAuthentication no
PubkeyAuthentication yes

# 重启 SSH 服务
sudo systemctl restart sshd
```

---

## Docker 环境安装

### 1. 安装 Docker

```bash
# 下载并安装 Docker
curl -fsSL https://get.docker.com | sh

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录使权限生效
exit
ssh deploy@your-server-ip
```

### 2. 验证 Docker 安装

```bash
# 检查 Docker 版本
docker --version

# 测试 Docker 是否正常运行
docker run hello-world

# 如果看到 "Hello from Docker!" 说明安装成功
```

### 3. 安装 Docker Compose

```bash
# 下载 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 赋予执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 4. 配置 Docker 开机自启

```bash
# 设置 Docker 开机自启
sudo systemctl enable docker

# 启动 Docker
sudo systemctl start docker

# 检查 Docker 状态
sudo systemctl status docker
```

---

## 项目部署

### 1. 克隆项目

```bash
# 创建项目目录
mkdir -p ~/apps
cd ~/apps

# 克隆项目（替换为你的仓库地址）
git clone <your-repository-url> gytl-tools
cd gytl-tools
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量
vim .env
```

环境变量配置示例：

```bash
# 应用配置
NEXT_PUBLIC_APP_NAME=GYTL-Tools

# 筛选条件默认值
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8

# 股票列表缓存时间（秒）
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
```

### 3. 使用快速部署脚本

```bash
# 赋予执行权限
chmod +x deploy.sh

# 执行部署脚本
./deploy.sh
```

部署脚本会自动：
- ✅ 检查 Docker 和 Docker Compose
- ✅ 创建环境变量文件
- ✅ 构建 Docker 镜像
- ✅ 启动服务

### 4. 手动部署（如果脚本失败）

```bash
# 构建 Docker 镜像
docker build -t gytl-tools:latest .

# 运行容器
docker run -d \
  --name gytl-tools \
  -p 3000:3000 \
  --restart unless-stopped \
  gytl-tools:latest

# 或使用 Docker Compose
docker-compose up -d
```

### 5. 验证部署

```bash
# 检查容器状态
docker ps

# 查看容器日志
docker logs -f gytl-tools

# 测试服务是否正常运行
curl http://localhost:3000

# 如果返回 HTML 内容，说明部署成功
```

### 6. 防火墙配置

```bash
# 启用 UFW 防火墙
sudo ufw enable

# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 查看防火墙状态
sudo ufw status
```

---

## 域名与 SSL 配置

### 1. 购买域名

推荐域名注册商：
- 阿里云：https://wanwang.aliyun.com/
- 腾讯云：https://dnspod.cloud.tencent.com/
- Cloudflare：https://www.cloudflare.com/products/registrar/

### 2. 配置域名解析

在你的域名服务商添加解析记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|----------|--------|-----|
| A | @ | 你的服务器IP | 600 |
| A | www | 你的服务器IP | 600 |

等待 DNS 生效（通常 10-30 分钟）

### 3. 验证域名解析

```bash
# 在本地执行
ping your-domain.com
nslookup your-domain.com
```

### 4. 安装 Certbot（SSL 证书）

```bash
# 安装 Certbot
sudo apt install -y certbot

# 安装 Certbot Nginx 插件
sudo apt install -y python3-certbot-nginx
```

### 5. 获取 SSL 证书

```bash
# 自动配置 Nginx 并获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按提示输入邮箱和同意条款
```

### 6. 自动续期 SSL 证书

```bash
# 测试续期
sudo certbot renew --dry-run

# Certbot 会自动配置定时任务
# 查看定时任务
sudo systemctl status certbot.timer
```

---

## Nginx 反向代理

### 1. 安装 Nginx

```bash
# 安装 Nginx
sudo apt install -y nginx

# 启动 Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 检查 Nginx 状态
sudo systemctl status nginx
```

### 2. 配置 Nginx

```bash
# 创建站点配置文件
sudo vim /etc/nginx/sites-available/gytl-tools
```

配置内容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置（Certbot 会自动添加）
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志配置
    access_log /var/log/nginx/gytl-tools-access.log;
    error_log /var/log/nginx/gytl-tools-error.log;

    # 客户端上传大小限制
    client_max_body_size 10M;

    # 代理到应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. 启用站点配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/gytl-tools /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 4. 删除默认站点（可选）

```bash
# 删除默认站点
sudo rm /etc/nginx/sites-enabled/default

# 重新加载 Nginx
sudo systemctl reload nginx
```

---

## 监控与日志

### 1. 查看应用日志

```bash
# 查看实时日志
docker logs -f gytl-tools

# 查看最近 100 行日志
docker logs --tail 100 gytl-tools

# 查看最近 1 小时的日志
docker logs --since 1h gytl-tools
```

### 2. 查看容器资源使用

```bash
# 查看容器资源使用情况
docker stats gytl-tools

# 查看容器详细信息
docker inspect gytl-tools
```

### 3. 安装监控工具（可选）

```bash
# 安装 htop
sudo apt install -y htop

# 查看系统资源
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 4. 配置日志轮转

```bash
# 创建日志轮转配置
sudo vim /etc/logrotate.d/gytl-tools
```

配置内容：

```
/home/deploy/apps/gytl-tools/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 deploy deploy
}
```

### 5. 设置告警（可选）

```bash
# 安装 fail2ban
sudo apt install -y fail2ban

# 启动 fail2ban
sudo systemctl start fail2ban

# 设置开机自启
sudo systemctl enable fail2ban
```

---

## 常见问题排查

### 1. 容器无法启动

```bash
# 查看容器日志
docker logs gytl-tools

# 检查容器状态
docker ps -a

# 重新构建镜像
docker-compose build --no-cache

# 重新启动容器
docker-compose up -d
```

### 2. 端口被占用

```bash
# 查看端口占用
sudo netstat -tulpn | grep 3000
sudo ss -tulpn | grep 3000

# 杀死占用端口的进程
sudo kill -9 <PID>
```

### 3. 域名无法访问

```bash
# 检查 DNS 解析
nslookup your-domain.com

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 检查防火墙
sudo ufw status
```

### 4. SSL 证书问题

```bash
# 重新获取证书
sudo certbot certonly --nginx -d your-domain.com

# 强制续期
sudo certbot renew --force-renewal

# 删除并重新申请
sudo certbot delete
sudo certbot --nginx -d your-domain.com
```

### 5. 应用运行缓慢

```bash
# 查看容器资源使用
docker stats gytl-tools

# 检查系统资源
htop

# 清理 Docker 缓存
docker system prune -a

# 增加容器内存限制（修改 docker-compose.yml）
```

### 6. API 无法连接

```bash
# 测试网络连接
curl -I http://82.push2.eastmoney.com

# 检查 DNS 解析
nslookup 82.push2.eastmoney.com

# 查看应用日志
docker logs gytl-tools | grep -i "error"

# 检查防火墙规则
sudo ufw status
```

---

## 安全加固

### 1. 配置自动安全更新

```bash
# 安装 unattended-upgrades
sudo apt install -y unattended-upgrades

# 配置自动更新
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 2. 配置 Fail2ban

```bash
# 复制配置文件
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# 编辑配置
sudo vim /etc/fail2ban/jail.local

# 启用 SSH 保护
[sshd]
enabled = true
port = ssh
maxretry = 3
bantime = 3600

# 重启 Fail2ban
sudo systemctl restart fail2ban
```

### 3. 禁用 root 登录

```bash
# 编辑 SSH 配置
sudo vim /etc/ssh/sshd_config

# 修改以下配置
PermitRootLogin no

# 重启 SSH
sudo systemctl restart sshd
```

### 4. 配置防火墙规则

```bash
# 重置防火墙规则
sudo ufw --force reset

# 默认拒绝所有入站
sudo ufw default deny incoming

# 默认允许所有出站
sudo ufw default allow outgoing

# 允许 SSH（替换为你的IP）
sudo ufw allow from YOUR_IP_ADDRESS to any port 22

# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable
```

### 5. 定期备份数据

```bash
# 创建备份脚本
vim ~/backup.sh
```

备份脚本内容：

```bash
#!/bin/bash

# 备份目录
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/deploy/apps/gytl-tools"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用目录
tar -czf $BACKUP_DIR/gytl-tools_$DATE.tar.gz -C $APP_DIR .

# 删除 7 天前的备份
find $BACKUP_DIR -name "gytl-tools_*.tar.gz" -mtime +7 -delete

echo "Backup completed: gytl-tools_$DATE.tar.gz"
```

```bash
# 赋予执行权限
chmod +x ~/backup.sh

# 添加到定时任务
crontab -e

# 添加以下行（每天凌晨 2 点备份）
0 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

---

## 📝 部署清单

部署前确认以下项目：

- [ ] 云服务器已购买并可访问
- [ ] 服务器系统已更新（`apt update && apt upgrade`）
- [ ] Docker 和 Docker Compose 已安装
- [ ] 项目代码已克隆到服务器
- [ ] 环境变量已配置（`.env` 文件）
- [ ] Docker 容器已启动并正常运行
- [ ] 防火墙已配置（开放 80、443 端口）
- [ ] 域名已购买并解析到服务器 IP
- [ ] SSL 证书已安装并配置自动续期
- [ ] Nginx 已配置反向代理
- [ ] 监控和日志已配置
- [ ] 备份脚本已设置定时任务
- [ ] 安全加固已完成

---

## 🎉 完成

恭喜！你的 GYTL-Tools 应用已成功部署到云服务器。

访问地址：https://your-domain.com

### 后续维护

1. **定期更新**：定期检查并更新应用和系统
2. **监控日志**：定期查看应用日志，及时发现问题
3. **备份数据**：定期备份重要数据
4. **安全检查**：定期检查系统安全性

### 获取帮助

如遇问题，请查看：
- 项目文档：[README.md](./README.md)
- 部署文档：[DEPLOY.md](./DEPLOY.md)
- Nginx 文档：https://nginx.org/en/docs/
- Docker 文档：https://docs.docker.com/
