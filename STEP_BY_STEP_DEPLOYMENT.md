# GYTL-Tools 完整部署操作指引（从零开始）

> 本文档提供从下载部署包到完成部署的每一步详细操作指引，适用于首次部署或全新安装。

---

## 📋 部署前准备

### 服务器要求

- **操作系统**：Linux（推荐 Ubuntu 20.04+ 或 CentOS 7+）
- **CPU**：1 核心或更多
- **内存**：1GB 或更多（推荐 2GB+）
- **磁盘空间**：2GB 可用空间
- **网络**：可访问互联网（用于下载依赖和访问 API）

### 软件要求

| 软件 | 版本要求 | 检查命令 |
|------|---------|---------|
| Node.js | 24.x | `node --version` |
| pnpm | 9.x | `pnpm --version` |
| Git | 2.x+ | `git --version` |
| PM2 | 最新版 | `pm2 --version`（可选） |

### 端口要求

- **5000**：应用端口（必需）
- **22**：SSH 端口（远程访问）

---

## 📥 步骤 1：下载部署包

### 方式 A：从 GitHub 下载（推荐）

```bash
# 1. 进入临时目录
cd /tmp

# 2. 下载最新版本的部署包
wget https://github.com/leesin07/gytl-tools/releases/download/v1.1.0/gytl-tools-v1.1.0.tar.gz

# 预期输出：
# --2024-03-06 14:30:00--  https://github.com/...
# Resolving github.com... 140.82.113.3
# Connecting to github.com|140.82.113.3|:443... connected.
# HTTP request sent, awaiting response... 200 OK
# Length: 15728640 (15M) [application/octet-stream]
# Saving to: 'gytl-tools-v1.1.0.tar.gz'
#
# gytl-tools-v1.1.0.tar.gz              100%[==================================================>]  15M  2.5MB/s    in 6.2s
```

### 方式 B：从本地上传

```bash
# 在本地机器上
scp /path/to/gytl-tools-v1.1.0.tar.gz user@your-server-ip:/tmp/
```

### 方式 C：使用 curl 下载

```bash
cd /tmp
curl -L -o gytl-tools-v1.1.0.tar.gz https://github.com/leesin07/gytl-tools/releases/download/v1.1.0/gytl-tools-v1.1.0.tar.gz
```

### 验证下载完整性

```bash
# 1. 下载哈希文件
wget https://github.com/leesin07/gytl-tools/releases/download/v1.1.0/gytl-tools-v1.1.0.tar.gz.sha256

# 2. 验证哈希
sha256sum -c gytl-tools-v1.1.0.tar.gz.sha256

# 预期输出：
# gytl-tools-v1.1.0.tar.gz: OK
```

**如果验证失败：**
```bash
# 删除损坏的文件
rm gytl-tools-v1.1.0.tar.gz

# 重新下载
# （重复步骤 1 的下载命令）
```

---

## 📦 步骤 2：解压部署包

```bash
# 1. 进入临时目录
cd /tmp

# 2. 解压部署包
tar -xzf gytl-tools-v1.1.0.tar.gz

# 预期输出：无输出（静默解压）

# 3. 查看解压内容
ls -la gytl-tools-v1.1.0/

# 预期输出：
# total 64
# drwxr-xr-x 10 root root 4096 Mar  6 14:35 .
# drwxrwxrwt 10 root root 4096 Mar  6 14:35 ..
# -rw-r--r--  1 root root 1234 Mar  6 14:35 .babelrc
# -rw-r--r--  1 root root  567 Mar  6 14:35 .coze
# -rw-r--r--  1 root root   89 Mar  6 14:35 .dockerignore
# -rw-r--r--  1 root root  234 Mar  6 14:35 .gitignore
# -rw-r--r--  1 root root 1234 Mar  6 14:35 DEPLOYMENT_README.md
# -rw-r--r--  1 root root 5678 Mar  6 14:35 README.md
# drwxr-xr-x  3 root root 4096 Mar  6 14:35 docs
# -rw-r--r--  1 root root 7890 Mar  6 14:35 next.config.js
# -rw-r--r--  1 root root 2345 Mar  6 14:35 package.json
# -rw-r--r--  1 root root 567890 Mar  6 14:35 pnpm-lock.yaml
# -rw-r--r--  1 root root 4567 Mar  6 14:35 scripts
# drwxr-xr-x  5 root root 4096 Mar  6 14:35 src
# -rw-r--r--  1 root root 7890 Mar  6 14:35 tailwind.config.ts
# -rw-r--r--  1 root root 3456 Mar  6 14:35 tsconfig.json
```

---

## 📁 步骤 3：移动到安装目录

```bash
# 1. 创建安装目录
sudo mkdir -p /workspace

# 2. 移动解压的文件到安装目录
sudo mv /tmp/gytl-tools-v1.1.0 /workspace/gytl-tools

# 3. 设置正确的权限
sudo chown -R $USER:$USER /workspace/gytl-tools

# 4. 进入项目目录
cd /workspace/gytl-tools

# 5. 查看文件结构
tree -L 2

# 预期输出：
# .
# ├── DEPLOYMENT_README.md
# ├── README.md
# ├── next.config.js
# ├── package.json
# ├── pnpm-lock.yaml
# ├── scripts
# ├── src
# ├── tailwind.config.ts
# ├── tsconfig.json
# └── docs
```

---

## 🔧 步骤 4：安装 Node.js（如果未安装）

### 检查 Node.js 版本

```bash
node --version

# 预期输出：
# v24.0.0 或更高版本
```

### 如果未安装或版本过低，安装 Node.js 24

#### 方式 A：使用 nvm（推荐）

```bash
# 1. 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. 重新加载 shell 配置
source ~/.bashrc

# 3. 安装 Node.js 24
nvm install 24

# 4. 设置为默认版本
nvm alias default 24

# 5. 验证安装
node --version

# 预期输出：
# v24.0.0
```

#### 方式 B：使用官方二进制包

```bash
# 1. 下载 Node.js 24
wget https://nodejs.org/dist/v24.0.0/node-v24.0.0-linux-x64.tar.xz

# 2. 解压
tar -xf node-v24.0.0-linux-x64.tar.xz

# 3. 移动到 /usr/local
sudo mv node-v24.0.0-linux-x64 /usr/local/nodejs

# 4. 创建符号链接
sudo ln -s /usr/local/nodejs/bin/node /usr/bin/node
sudo ln -s /usr/local/nodejs/bin/npm /usr/bin/npm

# 5. 验证安装
node --version

# 预期输出：
# v24.0.0
```

---

## 📦 步骤 5：安装 pnpm

### 检查 pnpm 版本

```bash
pnpm --version

# 预期输出：
# 9.0.0 或更高版本
```

### 如果未安装，安装 pnpm

```bash
# 使用 npm 安装 pnpm（全局）
npm install -g pnpm

# 预期输出：
# added 1 package, and audited 1 package in 5s
# found 0 vulnerabilities

# 验证安装
pnpm --version

# 预期输出：
# 9.0.0
```

---

## 📚 步骤 6：安装项目依赖

```bash
# 1. 确保在项目目录
cd /workspace/gytl-tools
pwd

# 预期输出：
# /workspace/gytl-tools

# 2. 安装依赖
pnpm install

# 预期输出（大约需要 2-5 分钟）：
# Lockfile is up to date, resolution step is skipped
# Packages: +1234
# Progress: resolved 1234, reused 0, downloaded 1234, added 1234, done
#
# dependencies:
#   + @aws-sdk/client-s3 3.958.0
#   + @aws-sdk/lib-storage 3.958.0
#   + @hookform/resolvers 5.2.2
#   + ...（更多依赖）
#
# devDependencies:
#   + @types/node 20.11.0
#   + ...（更多依赖）
#
# Done in 45s

# 3. 验证依赖安装
ls -la node_modules/ | head -20

# 预期输出：
# drwxr-xr-x  20 user group 4096 Mar  6 14:40 .
# drwxr-xr-x   5 user group 4096 Mar  6 14:40 ..
# drwxr-xr-x   3 user group 4096 Mar  6 14:40 @aws-sdk
# drwxr-xr-x   3 user group 4096 Mar  6 14:40 @hookform
# ...（更多依赖目录）
```

**如果安装失败：**

```bash
# 清理并重新安装
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## 🔨 步骤 7：TypeScript 类型检查

```bash
# 1. 运行类型检查
npx tsc --noEmit

# 预期输出（成功时无输出）
# （静默成功，无任何错误信息）

# 如果有错误，会显示：
# src/app/page.tsx:123:7 - error TS2322: Type 'string' is not assignable to type 'number'.
# Found 1 error in 1 file.
```

**如果出现类型错误：**

```bash
# 查看详细错误
npx tsc --noEmit

# 检查是否有文件缺失
ls -la src/

# 如果类型定义缺失，重新安装类型
pnpm add -D @types/node @types/react
```

---

## 🏗️ 步骤 8：构建项目

```bash
# 1. 构建生产版本
pnpm build

# 预期输出（大约需要 1-3 分钟）：
# ▲ Next.js 16.1.1
#
# Creating an optimized production build...
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (5/5)
# ✓ Finalizing page optimization
#
# Route (app)                              Size     First Load JS
# ┌ ○ /                                   5.2 kB          89 kB
# ├ ○ /_not-found                          872 B          85 kB
# └ ○ /api/stocks/list                    1.1 kB          85 kB
# ┌ ○ /api/stocks/quote                  1.2 kB          85 kB
# └ ○ /api/stocks/search                 1.3 kB          85 kB
#
# λ (Server)  server side renders at runtime
# ○ (Static)  prerenders as static HTML
#
# Build completed in 2m 15s
```

**如果构建失败：**

```bash
# 清理缓存并重新构建
rm -rf .next
pnpm build

# 如果仍然失败，检查 Node.js 版本
node --version  # 应该是 v24.x
```

---

## 🚀 步骤 9：启动服务

### 方式 A：直接启动（测试用）

```bash
# 1. 启动开发服务器
pnpm start

# 预期输出：
# ▲ Next.js 16.1.1
# - Local:        http://localhost:5000
# - Network:      http://192.168.1.100:5000
#
# ✓ Ready in 1.2s

# 服务启动后，按 Ctrl+C 停止
```

### 方式 B：使用 PM2（生产环境推荐）

```bash
# 1. 安装 PM2（如果未安装）
npm install -g pm2

# 2. 启动服务
pm2 start npm --name "gytl-tools" -- start

# 预期输出：
# [PM2] Spawning PM2 daemon with pm2_home=/root/.pm2
# [PM2] Applying action restartProcessId on app [gytl-tools] (ids: [ 0 ])
# [PM2] [gytl-tools](0) ✓ Executed
# ┌────┬──────────────────┬─────────────┬─────────┬──────────┬──────────┐
# │ id │ name             │ version    │ mode    │ status   │ cpu      │
# ├────┼──────────────────┼─────────────┼─────────┼──────────┼──────────┤
# │ 0  │ gytl-tools       │ 1.1.0      │ fork    │ online   │ 0%       │
# └────┴──────────────────┴─────────────┴─────────┴──────────┴──────────┘

# 3. 保存 PM2 配置
pm2 save

# 预期输出：
# [PM2] Saving current process list...
# [PM2] Successfully saved process list to file: /root/.pm2/dump.pm2

# 4. 设置开机自启
pm2 startup

# 预期输出：
# [PM2] Init System found: systemd
# ...
# [PM2] To setup the Startup Script, copy/paste the following command:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# 5. 执行显示的命令（示例）
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### 方式 C：使用 Docker（可选）

```bash
# 1. 创建 Dockerfile（如果没有）
cat > Dockerfile << 'EOF'
FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 5000

CMD ["pnpm", "start"]
EOF

# 2. 构建镜像
docker build -t gytl-tools:v1.1.0 .

# 3. 运行容器
docker run -d \
  --name gytl-tools \
  -p 5000:5000 \
  --restart unless-stopped \
  gytl-tools:v1.1.0

# 4. 查看容器日志
docker logs -f gytl-tools
```

---

## ✅ 步骤 10：验证部署

### 1. 检查服务状态

```bash
# 使用 PM2
pm2 status

# 预期输出：
# ┌────┬──────────────────┬─────────────┬─────────┬──────────┬──────────┐
# │ id │ name             │ version    │ mode    │ status   │ cpu      │
# ├────┼──────────────────┼─────────────┼─────────┼──────────┼──────────┤
# │ 0  │ gytl-tools       │ 1.1.0      │ fork    │ online   │ 0.5%     │
# └────┴──────────────────┴─────────────┴─────────┴──────────┴──────────┘

# 查看详细信息
pm2 info gytl-tools

# 预期输出：
# ┌────────────────────┬──────────────────────────────────┐
# │ status             │ online                           │
# │ name               │ gytl-tools                       │
# │ version            │ 1.1.0                            │
# │ restarts           │ 0                                │
# │ uptime             │ 0h                               │
# │ script path        │ /usr/bin/npm                     │
# │ script args        | start                            │
# │ error log path     │ /root/.pm2/logs/gytl-tools-error.log│
# │ out log path       │ /root/.pm2/logs/gytl-tools-out.log  │
# │ pid path           │ /root/.pm2/pids/gytl-tools.pid   │
# │ interpreter        │ node                             │
# │ interpreter args   │                                  │
# │ script id          │ 0                                │
# │ exec cwd           │ /workspace/gytl-tools            │
# │ exec mode          │ fork_mode                        │
# │ node.js version    │ 24.0.0                           │
# │ watch & reload     │ ✗                                │
# │ automatic restart  │ ✓                                │
# │ size               │ 0B                               │
# │ restart count      │ 0                                │
# │ uptime             │ 0h                               │
# └────────────────────┴──────────────────────────────────┘
```

### 2. 检查端口监听

```bash
# 检查 5000 端口
ss -lptn 'sport = :5000'

# 预期输出：
# State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
# LISTEN 0      511                *:5000            *:*    users:(("node",pid=1234,fd=10))

# 或使用 lsof
lsof -i:5000

# 预期输出：
# COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
# node    1234 root   10u  IPv4  12345      0t0  TCP *:5000 (LISTEN)
```

### 3. 测试 HTTP 访问

```bash
# 测试首页
curl -I http://localhost:5000

# 预期输出：
# HTTP/1.1 200 OK
# Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
# Cache-Control: no-store, must-revalidate
# X-Powered-By: Next.js
# Content-Type: text/html; charset=utf-8
# Date: Fri, 06 Mar 2026 14:50:00 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5

# 测试 API
curl -s http://localhost:5000/api/stocks/list | jq '.metadata.dataSource'

# 预期输出（沙箱环境）：
# "mock"

# 预期输出（真实环境）：
# "real"
```

### 4. 查看服务日志

```bash
# 查看 PM2 日志
pm2 logs gytl-tools --lines 50

# 预期输出：
# │ gytl-tools | ▲ Next.js 16.1.1
# │ gytl-tools | - Local:        http://localhost:5000
# │ gytl-tools | - Network:      http://192.168.1.100:5000
# │ gytl-tools |
# │ gytl-tools | ✓ Ready in 1.2s
# │ gytl-tools | ✓ Server listening on http://localhost:5000
```

### 5. 浏览器访问

在浏览器中访问：
- 本地访问：http://localhost:5000
- 网络访问：http://your-server-ip:5000

**预期看到：**
- GYTL-Tools 页面标题
- 数据来源标识卡片（绿色或橙色）
- 选股结果、资金管理、筛选条件三个标签页

---

## 🛡️ 步骤 11：配置防火墙（如果需要）

### Ubuntu/Debian

```bash
# 1. 允许 5000 端口
sudo ufw allow 5000/tcp

# 预期输出：
# Rule added
# Rule added (v6)

# 2. 查看防火墙状态
sudo ufw status

# 预期输出：
# Status: active
#
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 5000/tcp                   ALLOW       Anywhere
```

### CentOS/RHEL

```bash
# 1. 允许 5000 端口
sudo firewall-cmd --permanent --add-port=5000/tcp

# 2. 重载防火墙
sudo firewall-cmd --reload

# 3. 查看规则
sudo firewall-cmd --list-ports

# 预期输出：
# 5000/tcp
```

---

## 🔄 步骤 12：配置 Nginx 反向代理（可选）

### 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

### 创建 Nginx 配置

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/gytl-tools

# 添加以下内容
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 保存并退出（Ctrl+X, Y, Enter）
```

### 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/gytl-tools /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 预期输出：
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# 重启 Nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
```

### 配置 SSL（可选，推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 按提示操作
# 预期会自动配置 HTTPS
```

---

## 📊 步骤 13：监控和维护

### 查看 PM2 监控

```bash
# 实时监控
pm2 monit

# 预期会显示实时监控界面，包含：
# - CPU 使用率
# - 内存使用率
# - 请求速率
# - 响应时间
```

### 查看详细日志

```bash
# 查看错误日志
pm2 logs gytl-tools --err

# 查看输出日志
pm2 logs gytl-tools --out

# 查看所有日志
pm2 logs gytl-tools
```

### 重启服务

```bash
# 重启服务
pm2 restart gytl-tools

# 预期输出：
# [PM2] Applying action restartProcessId on app [gytl-tools] (ids: [ 0 ])
# [PM2] [gytl-tools](0) ✓ Executed
```

### 停止服务

```bash
# 停止服务
pm2 stop gytl-tools

# 预期输出：
# [PM2] [gytl-tools](0) ✓ Stopped
```

### 删除服务

```bash
# 删除服务
pm2 delete gytl-tools

# 预期输出：
# [PM2] [gytl-tools](0) ✓ Deleted
```

---

## ⚠️ 常见问题排查

### 问题 1：端口 5000 已被占用

**症状：**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**解决方案：**
```bash
# 1. 查找占用端口的进程
lsof -i:5000

# 2. 停止占用进程
kill -9 <PID>

# 3. 重新启动服务
pm2 restart gytl-tools
```

### 问题 2：内存不足

**症状：**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**解决方案：**
```bash
# 1. 增加内存限制
echo "NODE_OPTIONS=--max-old-space-size=2048" >> ~/.bashrc
source ~/.bashrc

# 2. 重启服务
pm2 restart gytl-tools
```

### 问题 3：API 无法连接

**症状：**
```
当前使用模拟数据
原因：网络连接失败: socket hang up
```

**解决方案：**
```bash
# 1. 测试网络连接
curl -I http://82.push2.eastmoney.com

# 2. 检查防火墙
sudo ufw status

# 3. 这是正常的（沙箱环境），部署到真实服务器后会自动使用真实 API
```

### 问题 4：权限错误

**症状：**
```
Error: EACCES: permission denied
```

**解决方案：**
```bash
# 1. 修复权限
sudo chown -R $USER:$USER /workspace/gytl-tools

# 2. 重新启动服务
pm2 restart gytl-tools
```

---

## 📝 部署检查清单

- [ ] 下载了正确的部署包版本
- [ ] 验证了文件完整性（SHA256）
- [ ] 解压成功，文件完整
- [ ] 安装目录权限正确
- [ ] Node.js 版本正确（v24.x）
- [ ] pnpm 版本正确（9.x）
- [ ] 依赖安装成功
- [ ] TypeScript 类型检查通过
- [ ] 项目构建成功
- [ ] 服务启动成功
- [ ] 端口 5000 正常监听
- [ ] HTTP 访问正常
- [ ] 页面显示正常
- [ ] 数据来源标识正确
- [ ] PM2 配置已保存
- [ ] 开机自启已配置
- [ ] 防火墙规则已配置（如需要）
- [ ] Nginx 反向代理已配置（如需要）

---

## 🎉 部署完成

恭喜！您已成功部署 GYTL-Tools 系统。

### 下一步

1. **访问应用**
   - 本地：http://localhost:5000
   - 网络：http://your-server-ip:5000

2. **测试功能**
   - 尝试筛选股票
   - 测试搜索功能
   - 添加资金记录
   - 添加交易记录

3. **配置域名**（可选）
   - 配置 DNS 解析
   - 配置 SSL 证书
   - 设置 Nginx 反向代理

4. **定期维护**
   - 查看日志：`pm2 logs gytl-tools`
   - 监控状态：`pm2 monit`
   - 更新代码：参考《迭代部署指引》

### 获取帮助

- 📖 [README.md](./README.md) - 项目介绍
- 🚀 [迭代部署指引](./ITERATION_DEPLOYMENT_GUIDE.md) - 如何更新
- 🛠️ [工具脚本使用指南](./SCRIPTS_GUIDE.md) - 脚本使用方法
- 📞 [问题排查](./docs/TROUBLESHOOTING.md) - 常见问题

---

**部署完成时间：2024-03-06**
**文档版本：v1.0.0**
**维护者：GYTL-Tools Team**
