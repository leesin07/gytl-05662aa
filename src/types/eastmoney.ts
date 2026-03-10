// 东方财富API相关类型定义

// 股票基本信息
export interface StockBasicInfo {
  code: string; // 股票代码
  name: string; // 股票名称
  market: string; // 市场（沪市/深市）
  industry?: string; // 行业
}

// 东方财富API返回的行情数据
export interface EastmoneyQuote {
  f12: string; // 股票代码
  f13: number; // 市场代码（1=沪市，0=深市）
  f14: string; // 股票名称
  f2: number; // 最新价
  f3: number; // 涨跌幅（%）
  f4: number; // 涨跌额
  f5: number; // 成交量（手）
  f6: number; // 成交额（元）
  f7: number; // 振幅（%）
  f8: number; // 最高价
  f9: number; // 最低价
  f10: number; // 今开价
  f11: number; // 昨收价
  f15: number; // 最高价
  f16: number; // 最低价
  f17: number; // 成交量（手）
  f18: number; // 成交额
  f20: number; // 总市值（元）
  f21: number; // 流通市值（元）
  f22: number; // 换手率（%）
  f23: number; // 市盈率（动态）
  f24: number; // 市净率
  f25: number; // 量比
  
  // 买五档
  f102: number; // 买一量
  f103: number; // 买一价
  f104: number; // 买二量
  f105: number; // 买二价
  f106: number; // 买三量
  f107: number; // 买三价
  f108: number; // 买四量
  f109: number; // 买四价
  f110: number; // 买五量
  f111: number; // 买五价
  
  // 卖五档
  f112: number; // 卖一量
  f113: number; // 卖一价
  f114: number; // 卖二量
  f115: number; // 卖二价
  f116: number; // 卖三量
  f117: number; // 卖三价
  f118: number; // 卖四量
  f119: number; // 卖四价
  f120: number; // 卖五量
  f121: number; // 卖五价
}

// 东方财富API响应格式
export interface EastmoneyResponse {
  rc: number;
  rt: number;
  svr: number;
  lt: number;
  full: number;
  dlmkts: string;
  data: {
    diff: EastmoneyQuote[];
    total: number;
  };
}

// 市场类型
export enum MarketType {
  SH = '1', // 沪市
  SZ = '0', // 深市
}

// 板块类型
export enum SectorType {
  ALL = '', // 全部
  MAIN = 'm.90', // 主板
  SME = 'm.0+t.2', // 中小板
  CHINEXT = 'm.0+t.80', // 创业板
  STAR = 'm.1+t.2+n.6', // 科创板
  BEI = 'm.1+t.23', // 北交所
}
