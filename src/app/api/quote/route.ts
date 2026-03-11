import { NextRequest, NextResponse } from 'next/server';

/**
 * 创建带CORS头部的响应
 */
function createCorsResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * 处理OPTIONS请求（CORS预检）
 */
export async function OPTIONS() {
  return createCorsResponse({ success: true }, 200);
}

/**
 * 获取股票实时行情
 * GET /api/quote?codes=000001,600519
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.get('codes');

    if (!codes) {
      return createCorsResponse(
        { error: '股票代码不能为空' },
        400
      );
    }

    // 格式化股票代码（添加前缀）
    const formattedCodes = codes
      .split(',')
      .map(code => {
        code = code.trim();
        // 沪股（6开头）添加sh前缀，深股（0/3开头）添加sz前缀
        if (code.startsWith('6')) {
          return `sh${code}`;
        } else if (code.startsWith('0') || code.startsWith('3')) {
          return `sz${code}`;
        }
        return code;
      })
      .join(',');

    // 调用新浪财经API（使用HTTPS）
    const url = `https://hq.sinajs.cn/list=${formattedCodes}`;

    // 创建超时控制器（5秒超时）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let response: Response | null = null;

    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/plain',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (networkError: any) {
      clearTimeout(timeoutId);

      if (networkError.name === 'AbortError') {
        console.error('获取行情超时:', codes);
        return createCorsResponse({
          success: false,
          error: '获取行情超时',
          message: 'API请求超时，请稍后重试',
        }, 500);
      } else {
        throw networkError;
      }
    }

    if (!response.ok) {
      throw new Error('获取行情数据失败');
    }

    const text = await response.text();

    // 解析新浪API返回的数据
    const quotes = parseSinaQuote(text);

    return createCorsResponse({
      success: true,
      data: quotes,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('获取股票行情失败:', error);
    return createCorsResponse(
      { 
        error: '获取股票行情失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      500
    );
  }
}

/**
 * 解析新浪财经API返回的数据
 */
function parseSinaQuote(text: string) {
  const quotes: any[] = [];
  
  // 使用正则匹配所有行情数据
  const regex = /var hq_str_(\w+)="([^"]+)";/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const code = match[1];
    const data = match[2];

    if (!data) continue;

    const fields = data.split(',');
    
    // 新浪财经API字段说明：
    // 0:股票名称, 1:开盘价, 2:昨收价, 3:当前价, 4:最高价, 5:最低价, 
    // 6:买一价, 7:卖一价, 8:成交量(手), 9:成交额(元)
    // 10:买一量, 11:买一价, 12:买二量, 13:买二价, 14:买三量, 15:买三价
    // 16:买四量, 17:买四价, 18:买五量, 19:买五价
    // 20:卖一量, 21:卖一价, 22:卖二量, 23:卖二价, 24:卖三量, 25:卖三价
    // 26:卖四量, 27:卖四价, 28:卖五量, 29:卖五价
    // 30:日期, 31:时间

    const quote = {
      code: code.replace(/^(sh|sz)/, ''), // 去掉前缀
      name: fields[0],
      open: parseFloat(fields[1]) || 0,
      preClose: parseFloat(fields[2]) || 0,
      price: parseFloat(fields[3]) || 0,
      high: parseFloat(fields[4]) || 0,
      low: parseFloat(fields[5]) || 0,
      bid: parseFloat(fields[6]) || 0,
      ask: parseFloat(fields[7]) || 0,
      volume: parseFloat(fields[8]) || 0,
      amount: parseFloat(fields[9]) || 0,
      b1_v: parseFloat(fields[10]) || 0,
      b1_p: parseFloat(fields[11]) || 0,
      b2_v: parseFloat(fields[12]) || 0,
      b2_p: parseFloat(fields[13]) || 0,
      b3_v: parseFloat(fields[14]) || 0,
      b3_p: parseFloat(fields[15]) || 0,
      b4_v: parseFloat(fields[16]) || 0,
      b4_p: parseFloat(fields[17]) || 0,
      b5_v: parseFloat(fields[18]) || 0,
      b5_p: parseFloat(fields[19]) || 0,
      a1_v: parseFloat(fields[20]) || 0,
      a1_p: parseFloat(fields[21]) || 0,
      a2_v: parseFloat(fields[22]) || 0,
      a2_p: parseFloat(fields[23]) || 0,
      a3_v: parseFloat(fields[24]) || 0,
      a3_p: parseFloat(fields[25]) || 0,
      a4_v: parseFloat(fields[26]) || 0,
      a4_p: parseFloat(fields[27]) || 0,
      a5_v: parseFloat(fields[28]) || 0,
      a5_p: parseFloat(fields[29]) || 0,
      date: fields[30] || '',
      time: fields[31] || '',
      priceChange: 0,
      priceChangePercent: 0
    } as any;

    // 计算涨跌幅
    if (quote.preClose > 0) {
      quote.priceChange = quote.price - quote.preClose;
      quote.priceChangePercent = (quote.priceChange / quote.preClose) * 100;
    }

    quotes.push(quote);
  }

  return quotes;
}
