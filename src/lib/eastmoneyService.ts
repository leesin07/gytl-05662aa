// 东方财富API前端服务函数

/**
 * 获取A股股票列表
 * @param sector 板块类型（可选）
 * @param page 页码（默认1）
 * @param pageSize 每页数量（默认5000）
 */
export async function getStockList(
  sector: string = '',
  page: number = 1,
  pageSize: number = 5000
) {
  try {
    const sectorParam = sector ? `sector=${sector}` : '';
    const url = `/api/stocks/list?${sectorParam}&page=${page}&pageSize=${pageSize}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('获取股票列表失败');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || '获取股票列表失败');
    }

    // 返回完整的响应，包括 metadata
    return {
      stocks: result.data.stocks,
      total: result.data.total,
      page: result.data.page,
      pageSize: result.data.pageSize,
      metadata: result.metadata || null, // 数据来源元数据
    };
  } catch (error) {
    console.error('获取股票列表失败:', error);
    throw error;
  }
}

/**
 * 获取股票实时行情（批量）
 * @param codes 股票代码数组，如 ['600519', '000001']
 */
export async function getStockQuotes(codes: string[]) {
  try {
    if (codes.length === 0) {
      return { quotes: [], count: 0 };
    }

    // 每次最多查询200只股票
    const batchSize = 200;
    const batches: string[][] = [];
    
    for (let i = 0; i < codes.length; i += batchSize) {
      batches.push(codes.slice(i, i + batchSize));
    }

    const allQuotes: any[] = [];

    for (const batch of batches) {
      const codesStr = batch.join(',');
      const response = await fetch(`/api/stocks/quote?codes=${codesStr}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`获取股票行情失败: ${codesStr}`);
        continue;
      }

      const result = await response.json();
      
      if (result.success && result.data.quotes) {
        allQuotes.push(...result.data.quotes);
      }
    }

    return {
      quotes: allQuotes,
      count: allQuotes.length,
    };
  } catch (error) {
    console.error('获取股票行情失败:', error);
    throw error;
  }
}

/**
 * 获取单只股票行情
 */
export async function getStockQuote(code: string) {
  try {
    const result = await getStockQuotes([code]);
    return result.quotes.length > 0 ? result.quotes[0] : null;
  } catch (error) {
    console.error('获取股票行情失败:', error);
    return null;
  }
}

/**
 * 按涨幅获取股票列表
 * @param minChange 最小涨幅（默认3%）
 * @param maxChange 最大涨幅（默认10%）
 */
export async function getStocksByChange(
  minChange: number = 3,
  maxChange: number = 10
) {
  try {
    const data = await getStockList();

    // 按涨幅筛选
    const filteredStocks = data.stocks.filter((stock: any) => {
      const change = stock.change || 0;
      return change >= minChange && change <= maxChange;
    });

    return {
      stocks: filteredStocks,
      count: filteredStocks.length,
      metadata: data.metadata, // 传递metadata
    };
  } catch (error) {
    console.error('获取涨幅股票列表失败:', error);
    throw error;
  }
}

/**
 * 获取热门股票（涨幅排名前50）
 */
export async function getTopStocks(limit: number = 50) {
  try {
    const data = await getStockList();
    
    // 按涨幅排序
    const sortedStocks = [...data.stocks].sort((a: any, b: any) => {
      return (b.change || 0) - (a.change || 0);
    });

    return {
      stocks: sortedStocks.slice(0, limit),
      count: Math.min(limit, sortedStocks.length),
    };
  } catch (error) {
    console.error('获取热门股票失败:', error);
    throw error;
  }
}

/**
 * 搜索股票
 * @param keyword 搜索关键词（股票代码或名称）
 */
export async function searchStocks(keyword: string) {
  try {
    if (!keyword || keyword.length < 1) {
      return { stocks: [], count: 0 };
    }

    const data = await getStockList();
    
    // 搜索股票代码或名称
    const filteredStocks = data.stocks.filter((stock: any) => {
      const codeMatch = stock.code.includes(keyword);
      const nameMatch = stock.name.includes(keyword);
      return codeMatch || nameMatch;
    });

    return {
      stocks: filteredStocks.slice(0, 100), // 最多返回100条
      count: filteredStocks.length,
    };
  } catch (error) {
    console.error('搜索股票失败:', error);
    throw error;
  }
}

// 板块类型枚举
export const SECTOR_TYPES = {
  ALL: '', // 全部A股
  MAIN: 'm.90', // 主板
  SME: 'm.0+t.2', // 中小板
  CHINEXT: 'm.0+t.80', // 创业板
  STAR: 'm.1+t.2+n.6', // 科创板
  BEI: 'm.1+t.23', // 北交所
} as const;
