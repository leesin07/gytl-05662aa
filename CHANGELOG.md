# GYTL-Tools 变更日志

本文档记录了 GYTL-Tools 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.1.0] - 2024-03-06

### 新增 (Added)

- **数据来源标识功能**
  - 添加实时/模拟数据源区分标识
  - 页面顶部显示数据来源卡片（绿色=实时，橙色=模拟）
  - 显示详细的数据源元数据：
    - 数据来源类型（real/mock）
    - 数据来源标签和描述
    - 模拟数据的原因（如果是模拟数据）
    - 更新时间
    - 股票总数
    - API 响应时间
    - 缓存信息
    - 交易时段标识（仅实时数据）
  - 添加"重新连接"按钮，支持手动重新尝试连接 API

- **API 响应增强**
  - 在所有 API 响应中添加 `metadata` 字段
  - 实时数据响应包含：
    - `dataSource: "real"`
    - `dataSourceLabel: "东方财富实时API"`
    - `dataSourceDescription: "获取自东方财富真实行情API"`
    - `apiStatus: "connected"`
    - `isMarketOpen: true/false`
    - `cacheInfo: "60秒缓存"`
  - 模拟数据响应包含：
    - `dataSource: "mock"`
    - `dataSourceLabel: "模拟数据（演示用）"`
    - `mockReason: "网络连接失败: ..."`
    - `warning: "当前使用模拟数据，仅供开发和测试使用"`

- **资金管理功能**
  - 添加资金管理重置按钮，一键清空所有数据
  - 实现股票代码/名称自动关联功能
  - 实现卖出时自动识别未卖出股票记录
  - 盈亏计算包含手续费（0.05%）和佣金
  - 修正资金流水列表中的类型显示（买入/卖出）
  - 在交易记录表格中添加"手续费"列

- **工具脚本**
  - `scripts/quick-deploy.sh` - 快速部署脚本
  - `scripts/pre-deploy-test.sh` - 部署前测试脚本
  - `scripts/quick-rollback.sh` - 快速回滚脚本
  - `scripts/test-api.js` - API 连接测试脚本

- **文档**
  - `ITERATION_DEPLOYMENT_GUIDE.md` - 迭代部署完整指引
  - `API_STATUS.md` - API 状态说明文档
  - `REAL_API_GUIDE.md` - 真实 API 对接指南
  - `MOCK_VS_REAL_DATA.md` - 真实 vs 模拟数据对比
  - `SCRIPTS_GUIDE.md` - 工具脚本使用指南
  - `VERSION.md` - 版本历史文档

### 变更 (Changed)

- 更新 `FundRecord` 类型定义，添加 `'transfer'` 和 `'transaction'` 类型
- 更新 `FundRecord` 接口，添加 `transactionType` 可选字段
- 优化 `getStockList()` 函数返回完整响应（包含 metadata）
- 优化 `getStocksByChange()` 函数传递 metadata 信息
- 移除页面中重复的数据源提示（改为使用统一的数据来源卡片）

### 修复 (Fixed)

- 修复资金管理页面 6 个功能问题：
  - 股票搜索功能现在可以正常显示搜索结果
  - 资金管理重置按钮可以正常重置所有数据
  - 资金记录提交功能现在可以正常添加记录
  - 股票代码/名称自动关联功能正常工作
  - 卖出时自动识别未卖出股票并同步买入价
  - 盈亏计算正确包含手续费和佣金
  - 资金流水列表正确显示买入/卖出类型
- 修复 TypeScript 类型错误（Variable 'response' used before being assigned）
- 优化股票搜索功能，支持模拟数据下的搜索

### 技术改进 (Technical Improvements)

- 实现 `checkMarketOpen()` 函数，判断当前是否在交易时段
- 添加详细的日志记录和错误处理
- 优化 API 响应结构，统一 metadata 格式
- 改进错误提示信息，更清晰地说明问题原因

---

## [1.0.1] - 2024-03-05

### 修复 (Fixed)

- 修复 Vercel 构建错误，移除未使用的 `assets/` 目录
- 修复 TypeScript 类型错误
- 优化 API 错误处理逻辑

### 文档 (Documentation)

- 更新部署文档，添加常见问题解决方法
- 添加 GitHub 部署指南
- 添加部署前检查清单
- 更新 README.md，添加更多部署说明

---

## [1.0.0] - 2024-03-05

### 新增 (Added)

#### 核心功能

- **选股功能**
  - 全 A 股筛选（基于东方财富 API，支持 5000+ 只股票）
  - 多维度筛选条件：
    - 涨幅范围（最小/最大）
    - 最小量比
    - 最小换手率
    - 最大流通市值
  - 自动评分和排序
  - 筛选结果历史记录
  - 智能降级机制（API 不可用时自动使用模拟数据）
  - 支持详情展开（技术指标、其他信息、符合条件的原因）

- **资金管理**
  - 资金流水记录（入金、出金、转账）
  - 交易记录管理（买入、卖出）
  - 自动计算：
    - 盈亏（含手续费）
    - 收益率
    - 总本金
    - 当前余额
    - 总盈利/总亏损
    - 盈利率
    - 胜率
    - 盈亏比
    - 交易次数
  - 数据看板展示（8个关键指标）
  - 资金录入表单
  - 交易录入表单（支持自动填充和盈亏预览）

- **股票搜索**
  - 支持股票代码搜索
  - 支持股票名称搜索
  - 实时搜索结果
  - 防抖机制（300ms）
  - 搜索结果快速填充

- **数据源**
  - 东方财富 API 集成
  - 支持 5000+ 只 A 股
  - 实时行情数据
  - 60秒缓存优化
  - 智能降级机制

#### 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui 组件库
- pnpm 包管理器

#### 部署支持

- Docker 部署
- Docker Compose 部署
- Vercel 部署
- 云服务器部署（阿里云、腾讯云、华为云）
- Kubernetes 部署

#### 文档

- README.md - 项目介绍和快速开始
- DEPLOYMENT_GUIDE.md - 完整部署指南
- DEPLOYMENT_CHECKLIST.md - 部署前检查清单
- CLOUD_DEPLOYMENT_GUIDE.md - 云服务器部署详解
- GITHUB_DEPLOYMENT_GUIDE.md - GitHub 部署指南
- MAC_DEPLOYMENT_TUTORIAL.md - Mac 部署教程
- COMPLETE_DEPLOYMENT_TUTORIAL.md - 完整部署教程

### 技术细节 (Technical Details)

#### 项目结构

```
gytl-tools/
├── src/
│   ├── app/
│   │   ├── api/stocks/list/       # 股票列表 API
│   │   └── page.tsx               # 主页面
│   ├── components/ui/             # UI 组件
│   ├── lib/
│   │   ├── eastmoneyService.ts    # 东方财富 API 服务
│   │   ├── fundCalculator.ts      # 资金计算
│   │   └── stockSelector.ts       # 股票筛选
│   └── types/
│       ├── eastmoney.ts           # 东方财富类型
│       ├── fund.ts                # 资金类型
│       └── stock.ts               # 股票类型
├── public/                        # 静态资源
├── scripts/                       # 工具脚本
├── package.json                   # 项目配置
└── README.md                      # 项目文档
```

#### 核心 API

- `GET /api/stocks/list` - 获取股票列表
  - 参数：`sector`, `page`, `pageSize`
  - 响应：股票列表、总数、metadata

#### 数据流

```
前端页面 → Next.js API Routes → 东方财富 API
                        ↓
              （网络失败时降级到模拟数据）
```

---

## 版本说明

### 版本号规则

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **MAJOR（主版本号）**：不兼容的 API 修改
- **MINOR（次版本号）**：向下兼容的功能新增
- **PATCH（修订号）**：向下兼容的问题修复

### 发布流程

1. 更新代码和文档
2. 运行完整测试
3. 更新版本号（`package.json`）
4. 更新 CHANGELOG.md
5. 创建 Git 标签
6. 推送到远程仓库
7. 部署到生产环境

### 变更类型说明

- **新增 (Added)** - 新增的功能
- **变更 (Changed)** - 现有功能的变更
- **弃用 (Deprecated)** - 即将移除的功能
- **移除 (Removed)** - 已移除的功能
- **修复 (Fixed)** - Bug 修复
- **安全 (Security)** - 安全性修复

---

## 未来计划 (Future Plans)

### [1.2.0] - 计划中

- [ ] 添加技术指标计算（MACD、KDJ、RSI）
- [ ] 实现数据导出功能（Excel、CSV）
- [ ] 添加 WebSocket 实时推送
- [ ] 实现用户系统和个人配置
- [ ] 添加回测功能

### [1.3.0] - 计划中

- [ ] 实现多数据源支持（新浪、腾讯等）
- [ ] 添加数据可视化图表（K 线图、分时图）
- [ ] 实现策略回测和优化
- [ ] 添加告警通知功能

---

**维护者：GYTL-Tools Team**
**最后更新：2024-03-06**
