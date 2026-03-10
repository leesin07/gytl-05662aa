import { StockQuote, SinaQuoteRaw } from '@/types/quote';

/**
 * 获取股票实时行情
 * @param codes 股票代码，多个代码用逗号分隔，如 "000001,600519"
 */
export async function getStockQuotes(codes: string): Promise<StockQuote[]> {
  try {
    const response = await fetch(`/api/quote?codes=${codes}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('获取行情数据失败');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取行情数据失败');
    }

    return transformToStockQuotes(result.data);
  } catch (error) {
    console.error('获取股票行情失败:', error);
    throw error;
  }
}

/**
 * 获取单个股票实时行情
 */
export async function getStockQuote(code: string): Promise<StockQuote | null> {
  try {
    const quotes = await getStockQuotes(code);
    return quotes.length > 0 ? quotes[0] : null;
  } catch (error) {
    console.error('获取股票行情失败:', error);
    return null;
  }
}

/**
 * 转换新浪API原始数据为标准格式
 */
function transformToStockQuotes(rawData: SinaQuoteRaw[]): StockQuote[] {
  return rawData.map(item => ({
    code: item.name,
    name: item.name,
    currentPrice: item.price,
    openPrice: item.open,
    closePrice: item.preClose,
    highPrice: item.high,
    lowPrice: item.low,
    priceChange: (item.priceChange || 0),
    priceChangePercent: (item.priceChangePercent || 0),
    volume: item.volume,
    turnover: item.amount,
    buy1: item.b1_p,
    buy2: item.b2_p,
    buy3: item.b3_p,
    buy4: item.b4_p,
    buy5: item.b5_p,
    sell1: item.a1_p,
    sell2: item.a2_p,
    sell3: item.a3_p,
    sell4: item.a4_p,
    sell5: item.a5_p,
    updateTime: `${item.date} ${item.time}`
  }));
}

/**
 * 格式化股票代码（添加交易所前缀）
 */
export function formatStockCode(code: string): string {
  code = code.trim();
  if (code.startsWith('6')) {
    return `sh${code}`;
  } else if (code.startsWith('0') || code.startsWith('3')) {
    return `sz${code}`;
  }
  return code;
}

/**
 * 获取量比（简化计算，实际需要更多历史数据）
 */
export function getVolumeRatio(currentVolume: number, avgVolume5Day: number): number {
  if (!avgVolume5Day || avgVolume5Day === 0) return 1;
  return currentVolume / avgVolume5Day;
}

/**
 * 获取换手率（需要流通股本数据）
 */
export function getTurnoverRate(volume: number, totalShares: number): number {
  if (!totalShares || totalShares === 0) return 0;
  return (volume * 100) / totalShares; //成交量是手，转换为股
}
