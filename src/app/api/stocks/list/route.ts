import { NextRequest, NextResponse } from 'next/server';
import { EastmoneyResponse, EastmoneyQuote, SectorType, MarketType } from '@/types/eastmoney';
import { getMockStocks } from '@/lib/stockSelector';

/**
 * 获取A股所有股票列表
 * GET /api/stocks/list?sector=main
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sector = searchParams.get('sector') || ''; // 默认全部市场
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '5000'); // 默认5000条

    // 记录请求开始时间
    const requestStartTime = Date.now();

    // 东方财富获取股票列表的API
    const url = 'http://82.push2.eastmoney.com/api/qt/clist/get';
    
    const params = new URLSearchParams({
      pn: page.toString(),
      pz: pageSize.toString(),
      po: '1', // 排序方式：1=升序
      np: '1',
      fltt: '2',
      invt: '2',
      wbp2u: '|0|0|0|web',
      fid: 'f3', // 按涨跌幅排序
      fs: sector || 'm:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23', // 默认全A股
      fields: 'f12,f13,f14,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f15,f16,f17,f18,f20,f21,f22,f23,f24,f25,f102,f103,f104,f105,f106,f107,f108,f109,f110,f111,f112,f113,f114,f115,f116,f117,f118,f119,f120,f121',
      _: Date.now().toString(),
    });

    let response: Response | null = null;
    let useMockData = false;
    let mockReason = '';
    
    try {
      response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://quote.eastmoney.com/',
        },
        next: { revalidate: 60 }, // 缓存60秒
      });
    } catch (networkError: any) {
      console.warn('网络请求失败，使用模拟数据:', networkError);
      useMockData = true;
      mockReason = `网络连接失败: ${networkError.message || '未知错误'}`;
    }

    if (!useMockData && response && response.ok) {
      const result: EastmoneyResponse = await response.json();

      if (result.rc !== 0) {
        console.warn('API返回错误，使用模拟数据:', result.rc);
        useMockData = true;
        mockReason = `API返回错误码: ${result.rc}`;
      } else {
        const responseTime = Date.now() - requestStartTime;
        
        // 真实API响应 - 添加数据来源元数据
        return NextResponse.json({
          success: true,
          data: {
            stocks: result.data.diff.map(item => transformStockQuote(item)),
            total: result.data.total,
            page,
            pageSize,
          },
          metadata: {
            dataSource: 'real', // 数据来源：实时
            dataSourceLabel: '东方财富实时API',
            dataSourceDescription: '获取自东方财富真实行情API',
            updateTime: new Date().toLocaleString('zh-CN'),
            responseTime: responseTime, // 响应时间（毫秒）
            apiStatus: 'connected', // API状态
            totalStocks: result.data.total, // 总股票数
            isMarketOpen: checkMarketOpen(), // 是否交易时段
            cacheInfo: '60秒缓存',
          },
          timestamp: new Date().toISOString(),
        });
      }
    } else if (useMockData) {
      // 已经在 try-catch 中标记为使用模拟数据
      console.log('使用模拟股票数据，原因:', mockReason);
    } else {
      // response 不存在或非 ok 状态
      useMockData = true;
      mockReason = response ? `HTTP错误: ${response.status}` : '响应为空';
    }

    // 使用模拟数据
    if (useMockData) {
      console.log('使用模拟股票数据，原因:', mockReason);
      const mockStocks = getMockStocks();
      const responseTime = Date.now() - requestStartTime;
      
      // 转换为API返回格式
      const transformedStocks = mockStocks.map(stock => ({
        code: stock.code,
        name: stock.name,
        market: stock.code.startsWith('6') ? 'SH' : 'SZ',
        price: stock.price,
        change: stock.change,
        priceChange: stock.priceChange,
        openPrice: stock.openPrice,
        closePrice: stock.closePrice,
        highPrice: stock.highPrice,
        lowPrice: stock.lowPrice,
        volume: stock.volume,
        turnover: stock.turnover,
        turnoverRate: stock.turnoverRate,
        volumeRatio: stock.volumeRatio,
        marketCap: stock.marketCap,
        pe: 20 + Math.random() * 30,
        pb: 1 + Math.random() * 5,
        buy1: stock.buy1,
        sell1: stock.sell1,
        updateTime: stock.updateTime,
      }));

      // 模拟数据响应 - 添加详细的数据来源元数据
      return NextResponse.json({
        success: true,
        data: {
          stocks: transformedStocks,
          total: transformedStocks.length,
          page,
          pageSize,
        },
        metadata: {
          dataSource: 'mock', // 数据来源：模拟
          dataSourceLabel: '模拟数据（演示用）',
          dataSourceDescription: '使用模拟数据进行演示，非真实行情',
          mockReason: mockReason || 'API连接失败，自动降级到模拟数据',
          updateTime: new Date().toLocaleString('zh-CN'),
          responseTime: responseTime, // 响应时间（毫秒）
          apiStatus: 'disconnected', // API状态
          totalStocks: transformedStocks.length, // 模拟股票数
          isMarketOpen: false, // 模拟数据不区分交易时段
          cacheInfo: '无缓存（模拟数据）',
          warning: '当前使用模拟数据，仅供开发和测试使用',
        },
        timestamp: new Date().toISOString(),
        mock: true, // 标记为模拟数据（向后兼容）
      });
    }

  } catch (error) {
    console.error('获取股票列表失败:', error);
    return NextResponse.json(
      {
        error: '获取股票列表失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * 检查当前是否在交易时段
 */
function checkMarketOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // 周末不开市
  if (day === 0 || day === 6) {
    return false;
  }

  // 交易时段：9:30-11:30, 13:00-15:00
  const morningStart = 9 * 60 + 30;  // 9:30
  const morningEnd = 11 * 60 + 30;   // 11:30
  const afternoonStart = 13 * 60;    // 13:00
  const afternoonEnd = 15 * 60;      // 15:00

  return (currentTime >= morningStart && currentTime <= morningEnd) ||
         (currentTime >= afternoonStart && currentTime <= afternoonEnd);
}

/**
 * 转换东方财富API数据为标准格式
 */
function transformStockQuote(quote: EastmoneyQuote): any {
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
