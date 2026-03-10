// 资金记录
export interface FundRecord {
  id: string;
  date: string; // 日期
  type: 'deposit' | 'withdraw' | 'profit' | 'loss' | 'transfer' | 'transaction'; // 类型：存入、取出、盈利、亏损、转账、交易
  amount: number; // 金额
  balance: number; // 余额
  description: string; // 描述
  timestamp: string; // 时间戳
  transactionType?: 'buy' | 'sell'; // 交易类型（仅当 type 为 'transaction' 时使用）
}

// 交易记录
export interface Transaction {
  id: string;
  stockCode: string; // 股票代码
  stockName: string; // 股票名称
  type: 'buy' | 'sell'; // 买入或卖出
  price: number; // 成交价格
  quantity: number; // 数量（股）
  amount: number; // 成交金额
  fee: number; // 手续费
  buyPrice?: number; // 买入价（卖出时记录）
  sellPrice?: number; // 卖出价
  profitLoss?: number; // 盈亏（卖出时计算）
  profitRate?: number; // 收益率（%）
  balanceAfter?: number; // 交易后余额
  date: string; // 交易日期
  timestamp: string; // 时间戳
  note?: string; // 备注
}

// 资金看板数据
export interface FundDashboard {
  totalCapital: number; // 总资产（入金 + 出金（负数） + 总盈利 + 总亏损（负数）- 手续费）
  currentBalance: number; // 总市值（当前未卖出的股票的总市值）
  totalProfit: number; // 总盈利
  totalLoss: number; // 总亏损
  profitRate: number; // 盈利率（%）
  winRate: number; // 胜率（%）
  totalTransactions: number; // 总交易次数
  winTransactions: number; // 盈利交易次数
  lossTransactions: number; // 亏损交易次数
  profitLossRatio: number; // 盈亏比
}

// 默认资金记录（示例数据）
export const DEFAULT_FUND_RECORDS: FundRecord[] = [
  {
    id: '1',
    date: '2024-01-01',
    type: 'deposit',
    amount: 100000,
    balance: 100000,
    description: '初始入金',
    timestamp: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    date: '2024-01-05',
    type: 'withdraw',
    amount: -5000,
    balance: 95000,
    description: '提取部分资金',
    timestamp: '2024-01-05 14:00:00'
  }
];

// 默认交易记录（示例数据）
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    stockCode: '000001',
    stockName: '平安银行',
    type: 'buy',
    price: 10.50,
    quantity: 1000,
    amount: 10500,
    fee: 5.25,
    profitLoss: 0,
    balanceAfter: 89494.75,
    date: '2024-01-10',
    timestamp: '2024-01-10 09:30:00',
    note: '买入持有'
  },
  {
    id: '2',
    stockCode: '000001',
    stockName: '平安银行',
    type: 'sell',
    price: 11.20,
    quantity: 1000,
    amount: 11200,
    fee: 5.60,
    buyPrice: 10.50,
    sellPrice: 11.20,
    profitLoss: 689.15,
    profitRate: 6.47,
    balanceAfter: 90178.15,
    date: '2024-01-11',
    timestamp: '2024-01-11 10:00:00',
    note: '盈利卖出'
  },
  {
    id: '3',
    stockCode: '600519',
    stockName: '贵州茅台',
    type: 'buy',
    price: 1800.00,
    quantity: 50,
    amount: 90000,
    fee: 45.00,
    profitLoss: 0,
    balanceAfter: 133.15,
    date: '2024-01-15',
    timestamp: '2024-01-15 14:30:00',
    note: '买入茅台'
  },
  {
    id: '4',
    stockCode: '600519',
    stockName: '贵州茅台',
    type: 'sell',
    price: 1750.00,
    quantity: 50,
    amount: 87500,
    fee: 43.75,
    buyPrice: 1800.00,
    sellPrice: 1750.00,
    profitLoss: -2543.75,
    profitRate: -2.78,
    balanceAfter: 86188.40,
    date: '2024-01-16',
    timestamp: '2024-01-16 09:45:00',
    note: '止损卖出'
  }
];
