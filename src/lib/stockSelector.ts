import { Stock, FilterConfig, DEFAULT_FILTER } from '@/types/stock';

// 模拟股票数据（实际应用中应从数据源获取）
const mockStocks: Stock[] = [
  {
    code: '600000',
    name: '浦发银行',
    price: 12.56,
    change: 4.5,
    priceChange: 0.54,
    volume: 125000,
    turnover: 15714000,
    turnoverRate: 8.5,
    volumeRatio: 2.1,
    marketCap: 85,
    high52Week: 15.20,
    low52Week: 8.50,
    ma5: 12.10,
    ma10: 11.80,
    ma20: 11.50,
    aboveAveragePrice: true,
    limitUpDays20: 2,
    score: 85,
    reasons: [],
    filterTimestamp: '',
    openPrice: 12.10,
    closePrice: 12.02,
    highPrice: 12.80,
    lowPrice: 12.05,
    buy1: 12.55,
    sell1: 12.56,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '000001',
    name: '平安银行',
    price: 11.23,
    change: 3.2,
    priceChange: 0.35,
    volume: 98000,
    turnover: 11005400,
    turnoverRate: 6.8,
    volumeRatio: 1.8,
    marketCap: 120,
    high52Week: 14.50,
    low52Week: 9.20,
    ma5: 10.95,
    ma10: 10.70,
    ma20: 10.40,
    aboveAveragePrice: false,
    limitUpDays20: 1,
    score: 82,
    reasons: [],
    filterTimestamp: '',
    openPrice: 10.90,
    closePrice: 10.88,
    highPrice: 11.35,
    lowPrice: 10.88,
    buy1: 11.22,
    sell1: 11.23,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '000002',
    name: '万科A',
    price: 15.67,
    change: 5.8,
    priceChange: 0.86,
    volume: 156000,
    turnover: 24445200,
    turnoverRate: 9.2,
    volumeRatio: 2.3,
    marketCap: 95,
    high52Week: 18.50,
    low52Week: 12.30,
    ma5: 15.20,
    ma10: 14.90,
    ma20: 14.60,
    aboveAveragePrice: true,
    limitUpDays20: 3,
    score: 88,
    reasons: [],
    filterTimestamp: '',
    openPrice: 15.10,
    closePrice: 14.81,
    highPrice: 15.90,
    lowPrice: 15.05,
    buy1: 15.66,
    sell1: 15.67,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '600036',
    name: '招商银行',
    price: 35.80,
    change: 4.2,
    priceChange: 1.44,
    volume: 89000,
    turnover: 31862000,
    turnoverRate: 7.5,
    volumeRatio: 1.9,
    marketCap: 280,
    high52Week: 42.00,
    low52Week: 28.50,
    ma5: 35.20,
    ma10: 34.80,
    ma20: 34.30,
    aboveAveragePrice: true,
    limitUpDays20: 1,
    score: 86,
    reasons: [],
    filterTimestamp: '',
    openPrice: 35.00,
    closePrice: 34.36,
    highPrice: 36.20,
    lowPrice: 34.90,
    buy1: 35.79,
    sell1: 35.80,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '601318',
    name: '中国平安',
    price: 45.60,
    change: 3.8,
    priceChange: 1.67,
    volume: 112000,
    turnover: 51072000,
    turnoverRate: 8.9,
    volumeRatio: 2.2,
    marketCap: 320,
    high52Week: 55.00,
    low52Week: 38.20,
    ma5: 45.00,
    ma10: 44.60,
    ma20: 44.10,
    aboveAveragePrice: true,
    limitUpDays20: 2,
    score: 87,
    reasons: [],
    filterTimestamp: '',
    openPrice: 44.80,
    closePrice: 43.93,
    highPrice: 46.10,
    lowPrice: 44.75,
    buy1: 45.59,
    sell1: 45.60,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '000333',
    name: '美的集团',
    price: 62.40,
    change: 5.1,
    priceChange: 3.03,
    volume: 78000,
    turnover: 48672000,
    turnoverRate: 10.2,
    volumeRatio: 2.5,
    marketCap: 180,
    high52Week: 75.00,
    low52Week: 52.30,
    ma5: 61.50,
    ma10: 60.80,
    ma20: 60.20,
    aboveAveragePrice: true,
    limitUpDays20: 2,
    score: 89,
    reasons: [],
    filterTimestamp: '',
    openPrice: 61.20,
    closePrice: 59.37,
    highPrice: 62.90,
    lowPrice: 61.10,
    buy1: 62.39,
    sell1: 62.40,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '600276',
    name: '恒瑞医药',
    price: 48.90,
    change: 4.6,
    priceChange: 2.16,
    volume: 65000,
    turnover: 31785000,
    turnoverRate: 7.8,
    volumeRatio: 2.0,
    marketCap: 145,
    high52Week: 58.00,
    low52Week: 42.50,
    ma5: 48.20,
    ma10: 47.70,
    ma20: 47.20,
    aboveAveragePrice: false,
    limitUpDays20: 1,
    score: 84,
    reasons: [],
    filterTimestamp: '',
    openPrice: 48.00,
    closePrice: 46.74,
    highPrice: 49.30,
    lowPrice: 47.90,
    buy1: 48.89,
    sell1: 48.90,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '002415',
    name: '海康威视',
    price: 33.50,
    change: 3.5,
    priceChange: 1.13,
    volume: 145000,
    turnover: 48575000,
    turnoverRate: 8.6,
    volumeRatio: 1.8,
    marketCap: 160,
    high52Week: 42.00,
    low52Week: 29.80,
    ma5: 33.00,
    ma10: 32.60,
    ma20: 32.20,
    aboveAveragePrice: true,
    limitUpDays20: 2,
    score: 83,
    reasons: [],
    filterTimestamp: '',
    openPrice: 33.00,
    closePrice: 32.37,
    highPrice: 33.90,
    lowPrice: 32.90,
    buy1: 33.49,
    sell1: 33.50,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '601012',
    name: '隆基绿能',
    price: 28.70,
    change: 6.2,
    priceChange: 1.68,
    volume: 188000,
    turnover: 53956000,
    turnoverRate: 11.5,
    volumeRatio: 2.8,
    marketCap: 120,
    high52Week: 38.00,
    low52Week: 24.50,
    ma5: 28.00,
    ma10: 27.40,
    ma20: 26.90,
    aboveAveragePrice: true,
    limitUpDays20: 3,
    score: 90,
    reasons: [],
    filterTimestamp: '',
    openPrice: 27.80,
    closePrice: 27.02,
    highPrice: 29.10,
    lowPrice: 27.70,
    buy1: 28.69,
    sell1: 28.70,
    updateTime: '2024-01-15 15:00:00',
  },
  {
    code: '300750',
    name: '宁德时代',
    price: 185.20,
    change: 4.9,
    priceChange: 8.65,
    volume: 45000,
    turnover: 83340000,
    turnoverRate: 9.8,
    volumeRatio: 2.1,
    marketCap: 380,
    high52Week: 220.00,
    low52Week: 155.00,
    ma5: 182.00,
    ma10: 180.00,
    ma20: 178.00,
    aboveAveragePrice: true,
    limitUpDays20: 2,
    score: 88,
    reasons: [],
    filterTimestamp: '',
    openPrice: 182.00,
    closePrice: 176.55,
    highPrice: 186.50,
    lowPrice: 181.80,
    buy1: 185.19,
    sell1: 185.20,
    updateTime: '2024-01-15 15:00:00',
  },
];

/**
 * 根据筛选条件选择股票
 * @param stocks 股票列表
 * @param filter 筛选条件
 * @returns 筛选后的股票列表
 */
export function selectStocks(stocks: Stock[], filter: FilterConfig = DEFAULT_FILTER): Stock[] {
  const selectedStocks: Stock[] = [];

  for (const stock of stocks) {
    const reasons: string[] = [];
    let score = 0;

    // 1. 涨幅筛选
    if (stock.change >= filter.minChange && stock.change <= filter.maxChange) {
      reasons.push(`涨幅${stock.change.toFixed(2)}%符合条件`);
      score += 15;
    } else if (stock.change < filter.minChange) {
      continue; // 涨幅过低，直接跳过
    } else if (stock.change > filter.maxChange) {
      continue; // 涨幅过高，风险太大
    }

    // 2. 量比筛选
    if (stock.volumeRatio >= filter.minVolumeRatio) {
      reasons.push(`量比${stock.volumeRatio.toFixed(2)}`);
      score += 10;
    }

    // 3. 换手率筛选
    if (stock.turnoverRate >= filter.minTurnoverRate && stock.turnoverRate <= filter.maxTurnoverRate) {
      reasons.push(`换手率${stock.turnoverRate.toFixed(2)}%`);
      score += 10;
    }

    // 4. 流通市值筛选
    if (stock.marketCap >= filter.minMarketCap && stock.marketCap <= filter.maxMarketCap) {
      reasons.push(`市值${stock.marketCap.toFixed(1)}亿`);
      score += 10;
    }

    // 5. 股价筛选
    if (stock.price >= filter.minPrice && stock.price <= filter.maxPrice) {
      reasons.push(`股价¥${stock.price.toFixed(2)}`);
      score += 10;
    }

    // 6. 分时走势筛选
    if (filter.requireAboveAveragePrice && stock.aboveAveragePrice) {
      reasons.push('分时走势在均价线上方');
      score += 10;
    } else if (!filter.requireAboveAveragePrice) {
      score += 5;
    }

    // 7. 均线条件筛选
    let maScore = 0;
    if (filter.requireAboveMA5 && stock.ma5 > 0 && stock.price > stock.ma5) {
      reasons.push('股价在5日均线上方');
      maScore += 5;
    }
    if (filter.requireAboveMA10 && stock.ma10 > 0 && stock.price > stock.ma10) {
      reasons.push('股价在10日均线上方');
      maScore += 5;
    }
    if (filter.requireAboveMA20 && stock.ma20 > 0 && stock.price > stock.ma20) {
      reasons.push('股价在20日均线上方');
      maScore += 5;
    }
    // 如果没有启用均线条件，给基础分
    if (!filter.requireAboveMA5 && !filter.requireAboveMA10 && !filter.requireAboveMA20) {
      maScore += 5;
    }
    score += maScore;

    // 8. 20天内涨停天数筛选
    if (stock.limitUpDays20 >= filter.minLimitUpDays20) {
      if (stock.limitUpDays20 > 0) {
        reasons.push(`20天内涨停${stock.limitUpDays20}次`);
      }
      score += 7;
    }

    // 综合评分筛选（分数 >= 70 才入选）
    if (score >= 70) {
      selectedStocks.push({
        ...stock,
        score,
        reasons,
      });
    }
  }

  // 按评分降序排序
  return selectedStocks.sort((a, b) => b.score - a.score);
}

// 获取模拟数据
export function getMockStocks(): Stock[] {
  return mockStocks;
}

/**
 * 从实时行情数据创建股票对象
 * @param quote 实时行情数据
 * @returns Stock对象
 */
export function createStockFromQuote(quote: any): Stock {
  // 简化的计算逻辑，实际应用中需要更多历史数据
  
  // 计算涨跌幅
  const change = quote.change || 0;
  
  // 计算流通市值（使用API返回的市值）
  const marketCap = quote.marketCap || 0;
  
  // 模拟生成其他指标（实际需要更多数据）
  return {
    code: quote.code || '',
    name: quote.name || '',
    price: quote.price || 0,
    change: change,
    priceChange: quote.priceChange || 0,
    volume: quote.volume || 0,
    turnover: quote.turnover || 0,
    turnoverRate: quote.turnoverRate || 0,
    volumeRatio: quote.volumeRatio || 0,
    marketCap: marketCap,
    high52Week: quote.price * 1.3, // 简化估算
    low52Week: quote.price * 0.7, // 简化估算
    ma5: quote.price * (1 - Math.random() * 0.05), // 简化估算
    ma10: quote.price * (1 - Math.random() * 0.08), // 简化估算
    ma20: quote.price * (1 - Math.random() * 0.12), // 简化估算
    aboveAveragePrice: Math.random() > 0.3, // 70%概率满足
    limitUpDays20: Math.floor(Math.random() * 3), // 0-2 天
    score: 0,
    reasons: [],
    filterTimestamp: '',
    
    // 实时行情扩展字段
    openPrice: quote.openPrice || 0,
    closePrice: quote.closePrice || 0,
    highPrice: quote.highPrice || 0,
    lowPrice: quote.lowPrice || 0,
    buy1: quote.buy1 || 0,
    sell1: quote.sell1 || 0,
    updateTime: quote.updateTime || new Date().toLocaleString('zh-CN'),
  };
}

/**
 * 获取热门股票代码（用于测试）
 */
export function getHotStockCodes(): string[] {
  return [
    '600519', // 贵州茅台
    '000858', // 五粮液
    '600036', // 招商银行
    '000001', // 平安银行
    '601318', // 中国平安
    '000333', // 美的集团
    '600276', // 恒瑞医药
    '002415', // 海康威视
    '601012', // 隆基绿能
    '300750', // 宁德时代
    '600030', // 中信证券
    '600887', // 伊利股份
    '000651', // 格力电器
    '600031', // 三一重工
    '002594', // 比亚迪
  ];
}
