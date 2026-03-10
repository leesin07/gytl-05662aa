#!/usr/bin/env node

/**
 * API连接测试脚本
 * 用于验证东方财富API是否正常工作
 */

const http = require('http');

const API_URL = 'http://82.push2.eastmoney.com/api/qt/clist/get';

function testAPIConnection() {
  console.log('🔍 开始测试东方财富API连接...\n');

  const params = new URLSearchParams({
    pn: '1',
    pz: '10',
    po: '1',
    np: '1',
    fltt: '2',
    invt: '2',
    wbp2u: '|0|0|0|web',
    fid: 'f3',
    fs: 'm:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23',
    fields: 'f12,f13,f14,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f15,f16,f17,f18,f20,f21,f22,f23,f24,f25',
    _: Date.now().toString(),
  });

  const options = {
    hostname: '82.push2.eastmoney.com',
    port: 80,
    path: `/api/qt/clist/get?${params.toString()}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://quote.eastmoney.com/',
      'Accept': 'application/json',
    },
    timeout: 10000, // 10秒超时
  };

  const req = http.request(options, (res) => {
    console.log('✅ 请求已发送');
    console.log(`📡 状态码: ${res.statusCode}\n`);

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);

        if (result.rc === 0 && result.data) {
          console.log('✨ API连接成功！\n');
          console.log(`📊 数据统计:`);
          console.log(`   - 总股票数: ${result.data.total}`);
          console.log(`   - 当前返回: ${result.data.diff.length} 条\n`);
          console.log('📋 前3条股票数据:');
          console.log('─'.repeat(80));

          result.data.diff.slice(0, 3).forEach((stock, index) => {
            console.log(`${index + 1}. 代码: ${stock.f12} | 名称: ${stock.f14}`);
            console.log(`   现价: ¥${stock.f2?.toFixed(2)} | 涨跌幅: ${stock.f3?.toFixed(2)}%`);
            console.log(`   成交量: ${stock.f5} | 换手率: ${stock.f22?.toFixed(2)}%\n`);
          });

          console.log('─'.repeat(80));
          console.log('✅ 测试通过！真实API可正常使用\n');
          process.exit(0);
        } else {
          console.log('❌ API返回错误:', result.rc);
          console.log('提示: 可能是请求参数问题或API限制\n');
          process.exit(1);
        }
      } catch (error) {
        console.log('❌ 解析响应数据失败:', error.message);
        console.log('原始数据:', data.substring(0, 200));
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ 连接失败:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 原因分析:');
      console.log('   - 可能被防火墙拦截');
      console.log('   - 东方财富服务器拒绝连接');
      console.log('   - 网络环境限制\n');
      console.log('📌 建议解决方案:');
      console.log('   1. 在本地开发环境测试');
      console.log('   2. 部署到云服务器后测试');
      console.log('   3. 检查防火墙设置\n');
      console.log('📝 注意: 在沙箱环境中这是正常现象');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 原因分析:');
      console.log('   - 网络连接超时');
      console.log('   - 可能是网络延迟过高\n');
    }

    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ 请求超时（10秒）');
    console.log('💡 建议: 检查网络连接或增加超时时间\n');
    req.destroy();
    process.exit(1);
  });

  req.end();
}

console.log('========================================');
console.log('  GYTL-Tools API连接测试工具');
console.log('========================================\n');

testAPIConnection();
