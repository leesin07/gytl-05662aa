# GYTL-Tools

<div align="center">

**基于杨永兴隔夜套利法的智能选股工具**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-1.0.0-black?style=flat-square)](https://ui.shadcn.com)

[在线演示](#) · [快速开始](#快速开始) · [部署文档](#部署) · [功能特性](#功能特性)

## 🚀 快速操作

**最新版本：v1.1.0** | [查看更新日志](./VERSION.md)

### 一键部署（推荐）

```bash
# 快速部署到生产环境
./scripts/quick-deploy.sh

# 部署前测试
./scripts/pre-deploy-test.sh

# 快速回滚
./scripts/quick-rollback.sh
```

详细脚本使用请查看：[工具脚本使用指南](./SCRIPTS_GUIDE.md)

### 迭代更新指引

- 📖 [迭代部署指引](./ITERATION_GUIDE.md) - 完整的迭代部署流程
- 📋 [部署前检查清单](./DEPLOYMENT_CHECKLIST.md) - 部署前必查项
- 🔧 [工具脚本使用指南](./SCRIPTS_GUIDE.md) - 自动化脚本使用方法

### 从零开始部署

- 🚀 [逐步部署操作指引](./STEP_BY_STEP_DEPLOYMENT.md) - 从下载部署包到完成部署的每一步详解
- 📋 [快速参考卡片](./QUICK_REFERENCE.md) - 关键命令快速参考
- 🍎 [Mac本地+GitHub+Vercel部署](./MAC_VERCEL_DEPLOYMENT.md) - **针对Mac用户的完整部署流程**

</div>

## 📖 简介

GYTL-Tools 是一个专业的股票选股工具，基于杨永兴隔夜套利法，支持实时行情数据接入和全A股筛选。

### ⚡ 重要说明：真实API对接

**✅ 代码已实现真实的东方财富API对接！**

- 🎯 无需修改任何代码，部署到真实环境即可使用5000+只A股实时行情
- 📊 当前沙箱环境使用模拟数据（网络限制，正常现象）
- 🚀 部署后自动切换到真实API，数据实时更新
- 📖 详细说明请查看：[API状态说明](./API_STATUS.md) | [真实API对接指南](./REAL_API_GUIDE.md)

### ✨ 核心特性

- 🚀 **实时行情**：接入东方财富API，支持5000+只A股实时数据
- 📊 **智能筛选**：基于涨幅、量比、换手率等多维度指标筛选
- 💰 **资金管理**：完善的资金流水和交易记录管理
- 📈 **数据可视化**：直观的图表和数据展示
- 🔍 **股票搜索**：支持股票代码和名称快速搜索
- 🎯 **全A股筛选**：一键筛选全A股符合条件股票
- 📱 **响应式设计**：完美适配桌面和移动设备

## 🎯 功能特性

### 1. 选股功能
- ✅ 全A股筛选（基于东方财富API，支持5000+只股票）
- ✅ 多维度筛选条件（涨幅、量比、换手率、市值等）
- ✅ 自动评分和排序
- ✅ 筛选结果历史记录
- ✅ 智能降级机制（API不可用时自动使用模拟数据）

### 2. 资金管理
- ✅ 资金流水记录
- ✅ 交易记录管理
- ✅ 自动计算盈亏和收益率
- ✅ 数据看板展示

### 3. 股票搜索
- ✅ 支持代码搜索
- ✅ 支持名称搜索
- ✅ 实时搜索结果
- ✅ 快速查看详情

### 4. 数据源
- ✅ 东方财富API（主要数据源）
- ✅ 支持5000+只A股实时行情
- ✅ 完整的价格、成交量、财务指标
- ✅ 60秒缓存优化
- ✅ 智能降级机制（API失败时自动使用模拟数据）

**📌 关于数据源的重要说明：**
- 开发环境（沙箱）：使用模拟数据
- 生产环境（部署后）：自动使用真实API
- 查看 [真实API vs 模拟数据对比](./MOCK_VS_REAL_DATA.md)

## 🚀 快速开始

### 前置要求

- Node.js 24.x
- pnpm 9.x

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd gytl-tools

# 安装依赖
pnpm install

# 启动开发服务器
coze dev
```

启动后，在浏览器中打开 [http://localhost:5000](http://localhost:5000) 查看应用。

### 构建生产版本

```bash
# 构建
coze build

# 启动生产服务器
coze start
```

## 📦 部署

本项目支持多种部署方式：

**快速开始** 🚀
- [部署前准备清单](./DEPLOYMENT_CHECKLIST.md) - 部署前需要准备什么？
- [云服务器部署完整指南](./CLOUD_DEPLOYMENT_GUIDE.md) - 详细的操作指引

**API文档** 📊
- [API状态说明](./API_STATUS.md) - 当前API对接状态和验证方法
- [真实API对接指南](./REAL_API_GUIDE.md) - 完整的API对接文档
- [真实vs模拟数据对比](./MOCK_VS_REAL_DATA.md) - 数据源对比和切换说明

### Docker 部署（推荐）

```bash
# 构建镜像
docker build -t gytl-tools:latest .

# 运行容器
docker run -d -p 3000:3000 --name gytl-tools gytl-tools:latest

# 或使用 Docker Compose
docker-compose up -d
```

### 快速部署脚本

```bash
chmod +x deploy.sh
./deploy.sh
```

### 其他部署方式

详细部署文档请查看 [DEPLOY.md](./DEPLOY.md)

## 📁 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── stocks/         # 股票相关API
│   │   │   ├── list/       # 股票列表
│   │   │   └── quote/      # 实时行情
│   │   └── quote/          # 新浪行情API（已废弃）
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # React组件
│   └── ui/                 # shadcn/ui组件
├── lib/                    # 工具函数
│   ├── eastmoneyService.ts # 东方财富API服务
│   ├── fundCalculator.ts   # 资金计算
│   ├── stockQuote.ts       # 股票行情
│   └── stockSelector.ts    # 选股逻辑
└── types/                  # TypeScript类型
    ├── eastmoney.ts        # 东方财富类型
    ├── fund.ts            # 资金类型
    ├── quote.ts           # 行情类型
    └── stock.ts           # 股票类型
```

## 🔧 配置说明

### 环境变量

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

主要配置项：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | GYTL-Tools |
| `NEXT_PUBLIC_DEFAULT_MIN_CHANGE` | 最小涨幅 | 3 |
| `NEXT_PUBLIC_DEFAULT_MAX_CHANGE` | 最大涨幅 | 8 |
| `NEXT_PUBLIC_STOCK_LIST_CACHE_TIME` | 股票列表缓存时间（秒） | 60 |

详细配置说明请查看 [DEPLOY.md](./DEPLOY.md)

## 📊 数据源说明

### 东方财富API

本项目使用东方财富免费API：

- **股票列表**：http://82.push2.eastmoney.com/api/qt/clist/get
- **实时行情**：http://push2.eastmoney.com/api/qt/ulist.np/get

**优势**：
- ✅ 数据完整（5000+只A股）
- ✅ 稳定性好
- ✅ 更新及时
- ✅ 免费使用

**注意事项**：
- 股票列表接口有缓存（默认60秒）
- 实时行情接口无缓存，数据实时更新
- 建议合理控制请求频率

## 🛠️ 开发指南

### 使用 shadcn/ui 组件

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button>点击</Button>
      </CardContent>
    </Card>
  );
}
```

### 添加新功能

1. 在 `src/app/api/` 添加API路由
2. 在 `src/lib/` 添加业务逻辑
3. 在 `src/types/` 添加类型定义
4. 在 `src/components/` 添加UI组件

### 样式开发

使用 Tailwind CSS v4：

```tsx
<div className="flex items-center gap-4 p-4 bg-background">
  <Button className="bg-primary">按钮</Button>
</div>
```

## 📝 更新日志

### v1.1.0 (2024-02-28)
- ✅ 接入东方财富API
- ✅ 支持全A股筛选
- ✅ 添加股票搜索功能
- ✅ 添加Docker部署支持
- ✅ 优化资金管理功能

### v1.0.0 (2024-02-28)
- 🎉 初始版本发布
- ✅ 基础选股功能
- ✅ 资金管理功能
- ✅ shadcn/ui集成

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📮 联系方式

- GitHub Issues
- Email: support@example.com

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给一个星标！**

Made with ❤️ by [Your Name]

</div>

**主题变量**

主题变量定义在 `src/app/globals.css` 中，支持亮色/暗色模式：

- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`

### 5. 表单开发

推荐使用 `react-hook-form` + `zod` 进行表单开发：

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符'),
  email: z.string().email('请输入有效的邮箱'),
});

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '' },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('username')} />
      <Input {...form.register('email')} />
      <Button type="submit">提交</Button>
    </form>
  );
}
```

### 6. 数据获取

**服务端组件（推荐）**

```tsx
// src/app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // 或 'force-cache'
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**客户端组件**

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

## 常见开发场景

### 添加新页面

1. 在 `src/app/` 下创建文件夹和 `page.tsx`
2. 使用 shadcn 组件构建 UI
3. 根据需要添加 `layout.tsx` 和 `loading.tsx`

### 创建业务组件

1. 在 `src/components/` 下创建组件文件（非 UI 组件）
2. 优先组合使用 `src/components/ui/` 中的基础组件
3. 使用 TypeScript 定义 Props 类型

### 添加全局状态

推荐使用 React Context 或 Zustand：

```tsx
// src/lib/store.ts
import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### 集成数据库

推荐使用 Prisma 或 Drizzle ORM，在 `src/lib/db.ts` 中配置。

## 技术栈

- **框架**: Next.js 16.1.1 (App Router)
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS v4
- **表单**: React Hook Form + Zod
- **图标**: Lucide React
- **字体**: Geist Sans & Geist Mono
- **包管理器**: pnpm 9+
- **TypeScript**: 5.x

## 参考文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)

## 重要提示

1. **必须使用 pnpm** 作为包管理器
2. **优先使用 shadcn/ui 组件** 而不是从零开发基础组件
3. **遵循 Next.js App Router 规范**，正确区分服务端/客户端组件
4. **使用 TypeScript** 进行类型安全开发
5. **使用 `@/` 路径别名** 导入模块（已配置）
