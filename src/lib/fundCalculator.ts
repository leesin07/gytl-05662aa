import { FundRecord, Transaction, FundDashboard } from '@/types/fund';

// 持仓信息
interface Position {
  code: string;
  name: string;
  quantity: number;
  buyPrice?: number;
}

// 计算持仓
export function calculatePositions(transactions: Transaction[]): Position[] {
  const positions = new Map<string, Position>();

  transactions.forEach(tx => {
    const key = tx.stockCode;

    if (!positions.has(key)) {
      positions.set(key, {
        code: tx.stockCode,
        name: tx.stockName,
        quantity: 0,
        buyPrice: undefined,
      });
    }

    const position = positions.get(key)!;

    if (tx.type === 'buy') {
      position.quantity += tx.quantity;
      if (!position.buyPrice || position.quantity === tx.quantity) {
        position.buyPrice = tx.price;
      }
    } else if (tx.type === 'sell') {
      position.quantity -= tx.quantity;
    }
  });

  // 只返回有持仓的股票（数量 > 0）
  return Array.from(positions.values()).filter(p => p.quantity > 0);
}

// 计算总市值（基于交易记录，不调用实时行情）
function calculateMarketValue(transactions: Transaction[]): number {
  // 总市值 = 所有买入金额 - 所有卖出金额
  // 这样反映的是当前持仓的买入成本
  const totalBuyAmount = transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + (t.price * t.quantity + t.fee), 0);

  const totalSellAmount = transactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + (t.price * t.quantity - t.fee), 0);

  return totalBuyAmount - totalSellAmount;
}

// 计算资金看板数据
export function calculateFundDashboard(
  fundRecords: FundRecord[],
  transactions: Transaction[]
): FundDashboard {
  // 计算入金总额
  const totalDeposit = fundRecords
    .filter(r => r.type === 'deposit')
    .reduce((sum, r) => sum + r.amount, 0);

  // 计算出金总额（负数）
  const totalWithdraw = fundRecords
    .filter(r => r.type === 'withdraw')
    .reduce((sum, r) => sum + r.amount, 0); // amount 已经是负数

  // 计算总手续费（从所有交易记录中累计）
  const totalFees = transactions.reduce((sum, t) => sum + t.fee, 0);

  // 计算总盈利和总亏损（从交易记录中获取）
  const sellTransactions = transactions.filter(t => t.type === 'sell' && t.profitLoss !== undefined);
  
  const totalProfit = sellTransactions
    .filter(t => t.profitLoss! > 0)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  const totalLoss = sellTransactions
    .filter(t => t.profitLoss! < 0)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0); // 注意：totalLoss 是负数

  // 计算总资产 = 入金 + 出金（负数） + 总盈利 + 总亏损（负数） - 手续费
  const totalAssets = totalDeposit + totalWithdraw + totalProfit + totalLoss - totalFees;

  // 计算持仓
  const positions = calculatePositions(transactions);

  // 计算总市值（基于交易记录：所有买入金额 - 所有卖出金额）
  const marketValue = calculateMarketValue(transactions);

  // 计算盈利率 = 净利润 / 入金
  const netProfit = totalDeposit + totalWithdraw + totalProfit + totalLoss - totalFees;
  const profitRate = totalDeposit > 0 ? (netProfit / totalDeposit) * 100 : 0;

  // 计算交易统计
  const winTransactions = sellTransactions.filter(t => t.profitLoss! > 0).length;
  const lossTransactions = sellTransactions.filter(t => t.profitLoss! < 0).length;
  const totalTransactions = winTransactions + lossTransactions;

  // 计算胜率
  const winRate = totalTransactions > 0 ? (winTransactions / totalTransactions) * 100 : 0;

  // 计算盈亏比
  const avgWin = winTransactions > 0 ? totalProfit / winTransactions : 0;
  const avgLoss = lossTransactions > 0 ? Math.abs(totalLoss) / lossTransactions : 0;
  const profitLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

  return {
    totalCapital: totalAssets, // 总资产
    currentBalance: marketValue, // 总市值
    totalProfit,
    totalLoss: Math.abs(totalLoss), // 显示时取绝对值
    profitRate: parseFloat(profitRate.toFixed(2)),
    winRate: parseFloat(winRate.toFixed(1)),
    totalTransactions,
    winTransactions,
    lossTransactions,
    profitLossRatio: parseFloat(profitLossRatio.toFixed(2))
  };
}

// 添加资金记录
export function addFundRecord(
  records: FundRecord[],
  record: Omit<FundRecord, 'id' | 'balance' | 'timestamp'>
): FundRecord[] {
  const lastBalance = records.length > 0 ? records[records.length - 1].balance : 0;
  const newRecord: FundRecord = {
    ...record,
    id: Date.now().toString(),
    balance: lastBalance + record.amount,
    timestamp: new Date().toISOString()
  };
  return [...records, newRecord];
}

// 添加交易记录
export function addTransaction(
  transactions: Transaction[],
  transaction: Omit<Transaction, 'id' | 'timestamp'>
): Transaction[] {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  return [...transactions, newTransaction];
}
