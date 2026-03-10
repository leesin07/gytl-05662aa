# 真实API vs 模拟数据对比

## 📊 数据对比

| 特性 | 模拟数据 | 真实API数据 |
|------|---------|------------|
| **股票数量** | 固定（约50只） | 5000+只全A股 |
| **数据来源** | 代码生成 | 东方财富实时行情 |
| **更新频率** | 静态 | 实时（交易时段秒级更新） |
| **价格真实性** | 模拟价格 | 真实市场价 |
| **涨跌幅准确性** | 随机生成 | 真实涨跌 |
| **技术指标** | 模拟计算 | 基于真实数据计算 |
| **可用场景** | 开发测试 | 生产环境 |

---

## 🔍 识别当前使用的数据类型

### 方法1：页面提示
打开页面，查看是否有以下提示：

**使用模拟数据：**
```
⚠️ 当前使用模拟数据
无法连接到真实行情API，正在使用模拟数据进行演示
```

**使用真实API：**
```
✅ 实时数据来源：东方财富API
```

### 方法2：浏览器控制台检查

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 刷新页面
4. 找到 `/api/stocks/list` 请求
5. 查看响应内容

**模拟数据响应：**
```json
{
  "success": true,
  "data": {
    "stocks": [...],
    "total": 50
  },
  "mock": true  // ← 这个字段表示使用模拟数据
}
```

**真实API响应：**
```json
{
  "success": true,
  "data": {
    "stocks": [...],
    "total": 5203  // ← 真实A股数量
  }
  // 没有 "mock" 字段
}
```

### 方法3：数据特征判断

| 特征 | 模拟数据 | 真实数据 |
|------|---------|---------|
| 股票总数 | < 100只 | > 5000只 |
| 代码格式 | 规律性强 | 随机分布 |
| 涨跌幅范围 | 固定区间 | 实际波动 |
| 成交量变化 | 规律变化 | 随机波动 |
| 更新时间戳 | 固定格式 | 实时更新 |

---

## 📝 示例数据对比

### 模拟数据示例
```json
{
  "code": "600519",
  "name": "贵州茅台",
  "price": 1850.50,
  "change": 3.25,
  "turnoverRate": 2.5,
  "volumeRatio": 1.8,
  "marketCap": 2350.5,
  "updateTime": "2024-03-06 10:00:00"
}
```
**特点：**
- 价格规整（小数点后两位）
- 涨跌幅为固定值
- 其他指标均匀分布

### 真实API数据示例
```json
{
  "code": "600519",
  "name": "贵州茅台",
  "price": 1847.88,        // ← 精确到分
  "change": 3.18,          // ← 实时涨跌
  "priceChange": 57.00,
  "openPrice": 1820.00,
  "closePrice": 1790.88,
  "highPrice": 1865.00,
  "lowPrice": 1810.00,
  "volume": 2345678,       // ← 真实成交量
  "turnoverRate": 2.13,    // ← 实际换手率
  "volumeRatio": 1.92,     // ← 真实量比
  "marketCap": 2325.8,     // ← 实际市值
  "pe": 32.5,              // ← 真实市盈率
  "pb": 10.8,              // ← 真实市净率
  "updateTime": "2024-03-06 10:35:42"  // ← 实时更新
}
```
**特点：**
- 价格精确到实际分位
- 涨跌幅实时变化
- 包含完整的财务数据
- 成交量真实波动
- 更新时间精确到秒

---

## 🎯 切换数据源

### 自动切换（已实现）

系统已实现智能降级机制：

```typescript
try {
  // 尝试调用真实API
  response = await fetch(realApiUrl);

  if (response.ok) {
    return realData;  // 使用真实数据
  }
} catch (error) {
  console.warn('网络请求失败，使用模拟数据');
}

// 降级到模拟数据
return mockData;
```

### 强制使用真实API

如果您想强制使用真实API（即使失败也不降级），可以修改代码：

```typescript
// src/app/api/stocks/list/route.ts

// 移除降级逻辑
response = await fetch(realApiUrl);

if (!response.ok) {
  throw new Error('API调用失败');
}

// 强制返回真实数据
return response.json();
```

⚠️ **警告：** 强制模式可能导致系统在API失败时完全不可用，不建议在生产环境使用。

### 强制使用模拟数据

如果想在真实环境中测试模拟数据功能：

```typescript
// 临时禁用真实API
const useMockOnly = true;  // 设置为true

if (useMockOnly) {
  return mockData;
}
```

---

## 🚀 部署验证清单

部署到生产环境后，请按以下步骤验证：

- [ ] 1. 检查页面是否有"使用模拟数据"提示
- [ ] 2. 打开浏览器控制台查看API响应
- [ ] 3. 验证返回的股票总数是否 > 5000
- [ ] 4. 检查股票价格是否精确到分
- [ ] 5. 验证涨跌幅是否在合理范围内（-10% 到 +10%）
- [ ] 6. 检查数据是否实时更新（刷新页面看价格变化）
- [ ] 7. 验证搜索功能是否能找到所有A股
- [ ] 8. 测试筛选功能是否能正确筛选

**所有检查项通过 = 真实API正常工作 ✅**

---

## 📊 性能对比

### 模拟数据性能
- ✅ 响应速度快（< 100ms）
- ✅ 不消耗API配额
- ✅ 无网络延迟
- ❌ 数据不准确

### 真实API性能
- ✅ 数据准确实时
- ✅ 覆盖全A股
- ⚠️ 响应速度（200ms - 2s）
- ⚠️ 可能触发限流
- ⚠️ 需要网络连接

### 优化建议

**提升真实API性能：**

1. **添加缓存**
```typescript
// 缓存60秒，避免频繁请求
next: { revalidate: 60 }
```

2. **使用CDN**
```typescript
// 通过CDN加速API请求
const cdnUrl = 'https://api-cdn.example.com/stocks';
```

3. **请求优化**
```typescript
// 只请求需要的字段
const fields = 'f12,f13,f14,f2,f3';  // 仅代码、名称、价格、涨跌
```

4. **批量查询**
```typescript
// 每次查询200只股票
const batchSize = 200;
```

---

## 🔄 数据同步策略

### 实时更新（推荐用于生产）
```typescript
// 每秒自动刷新
setInterval(() => {
  fetchStockData();
}, 5000);  // 5秒更新一次
```

### 定时更新（推荐用于开发）
```typescript
// 每分钟更新
setInterval(() => {
  fetchStockData();
}, 60000);  // 60秒更新一次
```

### 手动更新（推荐用于演示）
```typescript
// 用户主动刷新
<Button onClick={refreshData}>刷新数据</Button>
```

---

## 💡 最佳实践

### 1. 开发环境
- 使用模拟数据进行开发和测试
- 避免频繁调用API浪费配额

### 2. 测试环境
- 使用真实API验证功能
- 设置合理缓存策略

### 3. 生产环境
- 强制使用真实API
- 配置完善的缓存和降级机制
- 监控API调用成功率和延迟

### 4. 特殊场景
- **演示环境**：使用模拟数据
- **回测系统**：使用历史真实数据
- **实盘系统**：使用实时真实数据

---

## 📞 问题排查

### 问题：部署后仍然显示模拟数据

**可能原因：**
1. 网络连接问题
2. 防火墙阻止API请求
3. 服务器时间同步问题

**解决方案：**
```bash
# 1. 测试网络连接
curl -I http://82.push2.eastmoney.com

# 2. 检查防火墙
sudo ufw status

# 3. 同步时间
sudo ntpdate time.windows.com
```

### 问题：API返回数据不完整

**可能原因：**
- API限流
- 请求参数错误

**解决方案：**
```typescript
// 添加重试机制
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1));  // 指数退避
    }
  }
}
```

---

## 📚 相关文档

- [真实API对接说明](./REAL_API_GUIDE.md)
- [东方财富API文档](https://quote.eastmoney.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**最后更新时间：2024-03-06**
**文档版本：v1.0.0**
