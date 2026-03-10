# GYTL-Tools 部署包版本信息

## 📦 版本：v1.0.0

**发布日期**：2026-02-28
**构建状态**：✅ 成功
**TypeScript 检查**：✅ 通过
**生产构建**：✅ 成功

---

## 📋 包含内容

### 1. 源代码
- Next.js 16.1.1
- React 19.2.3
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- shadcn/ui 组件库

### 2. 核心功能
- ✅ 全A股筛选（支持5000+只股票）
- ✅ 股票搜索（代码和名称）
- ✅ 资金管理（流水和交易记录）
- ✅ 智能降级（API 失败时使用模拟数据）
- ✅ 实时行情显示

### 3. API 接口
- `GET /api/stocks/list` - 获取股票列表
- `GET /api/stocks/quote` - 获取实时行情
- `GET /api/quote` - 兼容接口（已废弃）

### 4. 部署文件
- `Dockerfile` - Docker 镜像构建
- `docker-compose.yml` - Docker Compose 配置
- `deploy.sh` - 快速部署脚本
- `nginx.conf.example` - Nginx 配置示例

### 5. 文档
- `README.md` - 项目说明
- `DEPLOY.md` - 部署文档
- `CLOUD_DEPLOYMENT_GUIDE.md` - 云服务器部署完整指南
- `DEPLOYMENT_CHECKLIST.md` - 部署前准备清单
- `DEPLOYMENT_QUICK_REFERENCE.md` - 部署快速参考卡片

---

## 🔧 环境要求

### Docker 部署（推荐）
- Docker 20.10+
- Docker Compose 2.0+

### 传统部署
- Node.js 24.x
- pnpm 9.x

---

## 📊 文件信息

**文件名**：`gytl-tools-deploy-v1.0.0.tar.gz`
**大小**：279 KB
**SHA256**：`dc81a860b263877a93986a6823af41bd2c9c1ea8d1c7ad58e8d61f8e55430865`

---

## 🚀 快速开始

### 1. 下载部署包
```bash
wget <download-url>/gytl-tools-deploy-v1.0.0.tar.gz
```

### 2. 解压
```bash
tar -xzf gytl-tools-deploy-v1.0.0.tar.gz
```

### 3. 阅读说明
```bash
cat DEPLOYMENT_README.md
```

### 4. 解压真实代码包
```bash
tar -xzf gytl-tools-deploy.tar.gz
cd gytl-tools
```

### 5. 配置并部署
```bash
cp .env.example .env
vim .env
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 更新日志

### v1.0.0 (2026-02-28)

**新增功能**：
- ✅ 接入东方财富 API，支持全A股实时行情
- ✅ 智能筛选功能，支持多维度筛选条件
- ✅ 股票搜索功能，支持代码和名称搜索
- ✅ 资金管理功能，支持流水和交易记录
- ✅ 数据降级机制，API 失败时使用模拟数据

**修复问题**：
- ✅ 修复 TypeScript 类型错误（变量在赋值前使用）
- ✅ 修复字段映射错误（东方财富 API 数据转换）
- ✅ 修复网络请求失败的降级逻辑

**优化改进**：
- ✅ 移除"热门股票"功能，扩大选股范围
- ✅ 添加数据源状态提示
- ✅ 优化错误处理和用户提示
- ✅ 完善部署文档和指南

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
- [DEPLOYMENT_README.md](./DEPLOYMENT_README.md) - 部署使用说明
- [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md) - 详细部署指南
- [DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md) - 快速参考

---

## 📄 许可证

本项目仅供学习和研究使用。

---

**GYTL-Tools - 基于杨永兴隔夜套利法的智能选股工具**

祝您使用愉快！🚀
