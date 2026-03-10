// 股票数据类型定义
export interface Stock {
  code: string; // 股票代码
  name: string; // 股票名称
  price: number; // 当前价格
  change: number; // 涨跌幅（百分比）
  priceChange: number; // 涨跌额
  volume: number; // 成交量（手）
  turnover: number; // 成交额（元）
  turnoverRate: number; // 换手率（百分比）
  volumeRatio: number; // 量比
  marketCap: number; // 流通市值（亿）
  high52Week: number; // 52周最高
  low52Week: number; // 52周最低
  ma5: number; // 5日均线
  ma10: number; // 10日均线
  ma20: number; // 20日均线
  aboveAveragePrice: boolean; // 分时走势全天在均价线上方
  limitUpDays20: number; // 20天内涨停天数
  score: number; // 综合评分
  reasons: string[]; // 符合条件的原因
  filterTimestamp: string; // 筛选时间
  
  // 实时行情扩展字段
  openPrice: number; // 开盘价
  closePrice: number; // 昨收价
  highPrice: number; // 今日最高
  lowPrice: number; // 今日最低
  buy1: number; // 买一价
  sell1: number; // 卖一价
  updateTime: string; // 更新时间
}

// 选股条件配置
export interface FilterConfig {
  minChange: number; // 最小涨幅
  maxChange: number; // 最大涨幅
  minVolumeRatio: number; // 最小量比
  minTurnoverRate: number; // 最小换手率
  maxTurnoverRate: number; // 最大换手率
  minMarketCap: number; // 最小流通市值（亿）
  maxMarketCap: number; // 最大流通市值（亿）
  minPrice: number; // 最低价格
  maxPrice: number; // 最高价格
  requireAboveAveragePrice: boolean; // 要求分时走势全天在均价线上方
  requireAboveMA5: boolean; // 要求股价在5日均线上方
  requireAboveMA10: boolean; // 要求股价在10日均线上方
  requireAboveMA20: boolean; // 要求股价在20日均线上方
  minLimitUpDays20: number; // 最少20天内涨停天数
}

// 默认选股条件（基于杨永兴隔夜套利法）
export const DEFAULT_FILTER: FilterConfig = {
  minChange: 3, // 最小涨幅 3%
  maxChange: 8, // 最大涨幅 8%
  minVolumeRatio: 1.5, // 量比 > 1.5
  minTurnoverRate: 5, // 换手率 > 5%
  maxTurnoverRate: 15, // 换手率 < 15%
  minMarketCap: 0, // 最小流通市值 0亿（不限）
  maxMarketCap: 100, // 最大流通市值 100亿
  minPrice: 10, // 价格 > 10元
  maxPrice: 50, // 价格 < 50元
  requireAboveAveragePrice: false, // 不强制要求分时走势全天在均价线上方
  requireAboveMA5: false, // 不强制要求股价在5日均线上方
  requireAboveMA10: false, // 不强制要求股价在10日均线上方
  requireAboveMA20: false, // 不强制要求股价在20日均线上方
  minLimitUpDays20: 0, // 最少20天内涨停天数（不限）
};

// 筛选历史记录
export interface FilterHistory {
  id: string; // 唯一标识
  timestamp: string; // 筛选时间
  filter: FilterConfig; // 使用的筛选条件
  stocks: Stock[]; // 筛选结果
  count: number; // 筛选出的股票数量
}
