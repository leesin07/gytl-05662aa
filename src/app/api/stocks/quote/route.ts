import { NextRequest, NextResponse } from 'next/server';
import { EastmoneyResponse, EastmoneyQuote } from '@/types/eastmoney';

/**
 * 获取股票实时行情（批量）
 * GET /api/stocks/quote?codes=600519,000001,002594
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.get('codes');

    if (!codes) {
      return NextResponse.json(
        { error: '股票代码不能为空' },
        { status: 400 }
      );
    }

    // 转换股票代码格式（东方财富需要带市场前缀）
    const stockCodes = codes.split(',').map(code => {
      const cleanCode = code.trim();
      // 6开头是沪市，其他是深市
      if (cleanCode.startsWith('6')) {
        return `1.${cleanCode}`; // 1表示沪市
      } else if (cleanCode.startsWith('8') || cleanCode.startsWith('4')) {
        return `0.${cleanCode}`; // 0表示深市（北交所也用这个）
      } else {
        return `0.${cleanCode}`; // 0表示深市
      }
    }).join(',');

    // 东方财富实时行情API
    const url = 'http://push2.eastmoney.com/api/qt/ulist.np/get';
    
    const params = new URLSearchParams({
      fltt: '2',
      invt: '2',
      fields: 'f12,f13,f14,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f15,f16,f17,f18,f20,f21,f22,f23,f24,f25,f62,f63,f71,f72,f60,f61,f69,f70,f58,f59,f67,f68,f56,f57,f65,f66,f54,f55,f63,f64',
      secids: stockCodes,
      _: Date.now().toString(),
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://quote.eastmoney.com/',
      },
      // 实时数据不缓存
    });

    if (!response.ok) {
      throw new Error('获取实时行情失败');
    }

    const result: EastmoneyResponse = await response.json();

    if (result.rc !== 0) {
      throw new Error(`API返回错误: ${result.rc}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        quotes: result.data.diff.map(item => transformQuote(item)),
        count: result.data.diff.length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('获取实时行情失败:', error);
    return NextResponse.json(
      {
        error: '获取实时行情失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * 转换东方财富行情数据为标准格式
 */
function transformQuote(quote: EastmoneyQuote): any {
  return {
    code: quote.f12,
    name: quote.f14,
    market: quote.f13 === 1 ? 'SH' : 'SZ',
    price: quote.f2 || 0,
    change: quote.f3 || 0,
    priceChange: quote.f4 || 0,
    openPrice: quote.f10 || 0,
    closePrice: quote.f11 || 0,
    highPrice: quote.f8 || 0,
    lowPrice: quote.f9 || 0,
    volume: quote.f5 || 0,
    turnover: quote.f6 || 0,
    turnoverRate: quote.f22 || 0,
    volumeRatio: quote.f25 || 0,
    marketCap: (quote.f21 || 0) / 100000000, // 转换为亿
    pe: quote.f23 || 0,
    pb: quote.f24 || 0,
    amplitude: quote.f7 || 0, // 振幅
    buy1: quote.f103 || 0,
    buy2: quote.f105 || 0,
    buy3: quote.f107 || 0,
    buy4: quote.f109 || 0,
    buy5: quote.f111 || 0,
    sell1: quote.f113 || 0,
    sell2: quote.f115 || 0,
    sell3: quote.f117 || 0,
    sell4: quote.f119 || 0,
    sell5: quote.f121 || 0,
    updateTime: new Date().toLocaleString('zh-CN'),
  };
}
