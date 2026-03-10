# 📋 部署快速参考卡片

## 常用命令速查

### Docker 相关

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看容器日志
docker logs -f gytl-tools

# 查看最近 100 行日志
docker logs --tail 100 gytl-tools

# 停止容器
docker stop gytl-tools

# 启动容器
docker start gytl-tools

# 重启容器
docker restart gytl-tools

# 删除容器
docker rm gytl-tools

# 查看容器资源使用
docker stats gytl-tools

# 进入容器
docker exec -it gytl-tools /bin/bash
```

### Docker Compose 相关

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 重新构建并启动
docker-compose up -d --build

# 查看资源使用
docker-compose top
```

### Nginx 相关

```bash
# 测试 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 系统相关

```bash
# 查看系统资源使用
htop
# 或
top

# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看端口占用
sudo netstat -tulpn | grep 3000
# 或
sudo ss -tulpn | grep 3000

# 查看进程
ps aux | grep node

# 杀死进程
sudo kill -9 <PID>
```

### SSL 证书（Certbot）

```bash
# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试续期
sudo certbot renew --dry-run

# 手动续期
sudo certbot renew

# 查看证书信息
sudo certbot certificates

# 删除证书
sudo certbot delete
```

### 防火墙（UFW）

```bash
# 启用防火墙
sudo ufw enable

# 禁用防火墙
sudo ufw disable

# 查看防火墙状态
sudo ufw status

# 允许端口
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 删除规则
sudo ufw delete allow 22/tcp
```

---

## 重要文件路径

### Docker 相关

```
Dockerfile                    # Docker 镜像构建文件
docker-compose.yml           # Docker Compose 配置文件
.dockerignore                # Docker 构建忽略文件
```

### 应用配置

```
.env                         # 环境变量配置
.next/                       # Next.js 构建输出
node_modules/                # 依赖包
public/                      # 静态资源
```

### Nginx 配置

```
/etc/nginx/nginx.conf        # Nginx 主配置
/etc/nginx/sites-available/   # 站点配置目录
/etc/nginx/sites-enabled/     # 已启用的站点配置
/etc/nginx/sites-available/gytl-tools  # 本项目站点配置
```

### 日志文件

```
/var/log/nginx/access.log    # Nginx 访问日志
/var/log/nginx/error.log     # Nginx 错误日志
/home/deploy/backups/        # 备份目录
```

### SSL 证书

```
/etc/letsencrypt/live/your-domain.com/  # SSL 证书目录
```

---

## 端口配置

| 端口 | 协议 | 用途 |
|------|------|------|
| 22 | TCP | SSH（远程登录）|
| 80 | TCP | HTTP（网页访问）|
| 443 | TCP | HTTPS（加密网页访问）|
| 3000 | TCP | 应用端口（仅内部使用）|

---

## 环境变量说明

```bash
# 应用名称
NEXT_PUBLIC_APP_NAME=GYTL-Tools

# 筛选条件默认值
NEXT_PUBLIC_DEFAULT_MIN_CHANGE=3
NEXT_PUBLIC_DEFAULT_MAX_CHANGE=8

# 股票列表缓存时间（秒）
NEXT_PUBLIC_STOCK_LIST_CACHE_TIME=60
```

---

## 快速故障排除

### 问题：容器无法启动

```bash
# 1. 查看容器日志
docker logs gytl-tools

# 2. 查看容器状态
docker ps -a

# 3. 重新构建镜像
docker-compose build --no-cache

# 4. 重新启动容器
docker-compose up -d
```

### 问题：无法访问网站

```bash
# 1. 检查容器是否运行
docker ps

# 2. 检查端口是否开放
sudo netstat -tulpn | grep 3000

# 3. 检查防火墙
sudo ufw status

# 4. 检查 Nginx 配置
sudo nginx -t

# 5. 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 问题：SSL 证书错误

```bash
# 1. 检查证书状态
sudo certbot certificates

# 2. 重新获取证书
sudo certbot --nginx -d your-domain.com

# 3. 查看证书日志
sudo journalctl -u certbot.timer -f
```

### 问题：应用运行缓慢

```bash
# 1. 查看容器资源使用
docker stats gytl-tools

# 2. 查看系统资源
htop

# 3. 清理 Docker 缓存
docker system prune -a

# 4. 查看应用日志
docker logs -f gytl-tools
```

---

## 监控命令

### 实时监控

```bash
# 监控容器状态
watch -n 1 'docker ps'

# 监控系统资源
htop

# 监控 Nginx 访问日志
tail -f /var/log/nginx/access.log

# 监控应用日志
docker logs -f gytl-tools
```

### 定期检查

```bash
# 每天检查磁盘使用
df -h

# 每天检查内存使用
free -h

# 每天检查容器状态
docker ps

# 每周检查 SSL 证书
sudo certbot certificates
```

---

## 备份相关

### 备份命令

```bash
# 备份应用目录
tar -czf backup_$(date +%Y%m%d).tar.gz /home/deploy/apps/gytl-tools

# 备份 Nginx 配置
tar -czf nginx_backup_$(date +%Y%m%d).tar.gz /etc/nginx

# 备份 SSL 证书
tar -czf ssl_backup_$(date +%Y%m%d).tar.gz /etc/letsencrypt
```

### 恢复命令

```bash
# 恢复应用目录
tar -xzf backup_YYYYMMDD.tar.gz -C /

# 恢复 Nginx 配置
tar -xzf nginx_backup_YYYYMMDD.tar.gz -C /

# 恢复 SSL 证书
tar -xzf ssl_backup_YYYYMMDD.tar.gz -C /
```

---

## 更新相关

### 更新应用

```bash
# 1. 拉取最新代码
cd /home/deploy/apps/gytl-tools
git pull

# 2. 重新构建镜像
docker-compose build

# 3. 重启容器
docker-compose up -d

# 4. 查看日志确认启动成功
docker-compose logs -f
```

### 更新系统

```bash
# 更新软件包列表
sudo apt update

# 升级软件包
sudo apt upgrade -y

# 清理不需要的包
sudo apt autoremove -y
```

### 更新 Docker

```bash
# 查看 Docker 版本
docker --version

# 更新 Docker（根据安装方式选择对应命令）
# 使用 get.docker.com 安装的：
curl -fsSL https://get.docker.com | sh

# 使用 apt 安装的：
sudo apt update
sudo apt upgrade docker-ce docker-ce-cli containerd.io
```

---

## 常用网址

| 名称 | 地址 |
|------|------|
| Docker 官方文档 | https://docs.docker.com/ |
| Nginx 官方文档 | https://nginx.org/en/docs/ |
| Certbot 官方文档 | https://certbot.eff.org/ |
| Ubuntu 文档 | https://ubuntu.com/server/docs |
| Next.js 文档 | https://nextjs.org/docs |

---

## 帮助资源

### 获取帮助

```bash
# Docker 帮助
docker --help
docker-compose --help

# Nginx 帮助
man nginx

# UFW 帮助
ufw --help

# Certbot 帮助
certbot --help
```

### 查看版本信息

```bash
# 系统版本
lsb_release -a

# Docker 版本
docker --version
docker-compose --version

# Nginx 版本
nginx -v

# Node.js 版本（在容器内）
docker exec gytl-tools node --version

# pnpm 版本（在容器内）
docker exec gytl-tools pnpm --version
```

---

## 🔖 打印建议

将此文件保存到本地，或打印出来，方便部署时快速查阅。

建议打印为 A4 纸，双面打印，方便随身携带。
