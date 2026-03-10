// 股票实时行情数据类型

export interface StockQuote {
  // 基本信息
  code: string; // 股票代码
  name: string; // 股票名称
  
  // 价格信息
  currentPrice: number; // 当前价格
  openPrice: number; // 开盘价
  closePrice: number; // 昨收价
  highPrice: number; // 最高价
  lowPrice: number; // 最低价
  
  // 涨跌信息
  priceChange: number; // 涨跌额
  priceChangePercent: number; // 涨跌幅（%）
  
  // 成交信息
  volume: number; // 成交量（手）
  turnover: number; // 成交额（元）
  
  // 委买卖信息
  buy1: number; // 买一价
  buy2: number; // 买二价
  buy3: number; // 买三价
  buy4: number; // 买四价
  buy5: number; // 买五价
  sell1: number; // 卖一价
  sell2: number; // 卖二价
  sell3: number; // 卖三价
  sell4: number; // 卖四价
  sell5: number; // 卖五价
  
  // 时间戳
  updateTime: string; // 更新时间
}

// 新浪财经API返回的原始数据结构
export interface SinaQuoteRaw {
  name: string;
  open: number;
  preClose: number;
  price: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
  volume: number;
  amount: number;
  b1_v: number;
  b1_p: number;
  b2_v: number;
  b2_p: number;
  b3_v: number;
  b3_p: number;
  b4_v: number;
  b4_p: number;
  b5_v: number;
  b5_p: number;
  a1_v: number;
  a1_p: number;
  a2_v: number;
  a2_p: number;
  a3_v: number;
  a3_p: number;
  a4_v: number;
  a4_p: number;
  a5_v: number;
  a5_p: number;
  date: string;
  time: string;
  priceChange: number; // 涨跌额
  priceChangePercent: number; // 涨跌幅
}
