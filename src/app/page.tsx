'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stock, FilterConfig, DEFAULT_FILTER } from '@/types/stock';
import { FundRecord, Transaction, DEFAULT_FUND_RECORDS, DEFAULT_TRANSACTIONS } from '@/types/fund';
import { getMockStocks, selectStocks, createStockFromQuote } from '@/lib/stockSelector';
import { calculateFundDashboard } from '@/lib/fundCalculator';
import { getStockList, getStocksByChange } from '@/lib/eastmoneyService';
import { TrendingUp, Filter, AlertCircle, CheckCircle, Save, ChevronDown, ChevronUp, DollarSign, List, Upload, Plus, Database, RefreshCw, RotateCcw, Trash2 } from 'lucide-react';

export default function Home() {
  const [allStocksWithTime, setAllStocksWithTime] = useState<Stock[]>([]);
  const [filter, setFilter] = useState<FilterConfig>(DEFAULT_FILTER);
  const [tempFilter, setTempFilter] = useState<FilterConfig>(DEFAULT_FILTER);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  // 当前标签页状态（用于保持刷新后的位置）
  const [currentTab, setCurrentTab] = useState<string>('results');

  // 资金管理状态
  const [fundRecords, setFundRecords] = useState<FundRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardData, setDashboardData] = useState({
    totalCapital: 0,
    currentBalance: 0,
    totalProfit: 0,
    totalLoss: 0,
    profitRate: 0,
    winRate: 0,
    profitLossRatio: 0,
    totalTransactions: 0
  });

  // 从 localStorage 加载数据（数据持久化）
  useEffect(() => {
    try {
      // 加载资金记录
      const savedFundRecords = localStorage.getItem('gytl-fundRecords');
      if (savedFundRecords) {
        setFundRecords(JSON.parse(savedFundRecords));
      }

      // 加载交易记录
      const savedTransactions = localStorage.getItem('gytl-transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }

      // 加载当前标签页
      const savedTab = localStorage.getItem('gytl-currentTab');
      if (savedTab) {
        setCurrentTab(savedTab);
      }

      // 加载筛选条件
      const savedFilter = localStorage.getItem('gytl-filter');
      if (savedFilter) {
        setFilter(JSON.parse(savedFilter));
        setTempFilter(JSON.parse(savedFilter));
      }

      console.log('从 localStorage 加载数据成功');
    } catch (error) {
      console.error('从 localStorage 加载数据失败:', error);
    }
  }, []);

  // 保存数据到 localStorage（数据持久化）
  useEffect(() => {
    try {
      localStorage.setItem('gytl-fundRecords', JSON.stringify(fundRecords));
    } catch (error) {
      console.error('保存资金记录到 localStorage 失败:', error);
    }
  }, [fundRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('gytl-transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('保存交易记录到 localStorage 失败:', error);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('gytl-currentTab', currentTab);
    } catch (error) {
      console.error('保存当前标签页到 localStorage 失败:', error);
    }
  }, [currentTab]);

  useEffect(() => {
    try {
      localStorage.setItem('gytl-filter', JSON.stringify(filter));
    } catch (error) {
      console.error('保存筛选条件到 localStorage 失败:', error);
    }
  }, [filter]);

  // 交易录入表单状态
  const [transactionForm, setTransactionForm] = useState({
    type: 'buy' as 'buy' | 'sell',
    stockCode: '',
    stockName: '',
    quantity: '',
    price: '',
    buyPrice: '', // 买入价（用于卖出时计算盈亏）
    date: '', // 修改：初始为空字符串
    note: ''
  });

  // 资金录入表单状态
  const [fundForm, setFundForm] = useState({
    type: 'deposit' as 'deposit' | 'withdraw' | 'transfer',
    amount: '',
    date: '', // 修改：初始为空字符串
    note: ''
  });

  // 初始化日期（修复 Hydration 错误）
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTransactionForm(prev => ({ ...prev, date: today }));
    setFundForm(prev => ({ ...prev, date: today }));
  }, []); // 只在组件挂载时执行一次

  // 股票筛选状态
  const [isLoadingAllStocks, setIsLoadingAllStocks] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [dataSourceMessage, setDataSourceMessage] = useState('');

  // 数据来源元数据状态
  const [dataSourceMetadata, setDataSourceMetadata] = useState<{
    dataSource: 'real' | 'mock';
    dataSourceLabel: string;
    dataSourceDescription: string;
    mockReason?: string;
    updateTime: string;
    responseTime: number;
    apiStatus: string;
    totalStocks: number;
    isMarketOpen: boolean;
    cacheInfo: string;
    warning?: string;
  } | null>(null);

  // 搜索股票列表（用于模拟数据）
  const [allStocksList, setAllStocksList] = useState<any[]>([]);

  // 加载所有股票列表（用于搜索）
  useEffect(() => {
    loadAllStocks();
  }, []);

  const loadAllStocks = async () => {
    try {
      const result = await getStockList();
      setAllStocksList(result.stocks);

      // 保存数据来源元数据
      if (result.metadata) {
        setDataSourceMetadata(result.metadata);
        setUsingMockData(result.metadata.dataSource === 'mock');
        setDataSourceMessage(result.metadata.mockReason || result.metadata.dataSourceDescription);
      }
    } catch (error) {
      console.error('加载股票列表失败:', error);
      // 使用模拟数据
      const mockStocks = getMockStocks();
      setAllStocksList(mockStocks);
      setUsingMockData(true);
      setDataSourceMessage('API连接失败，使用模拟数据');
    }
  };

  // 计算资金看板数据
  useEffect(() => {
    const data = calculateFundDashboard(fundRecords, transactions);
    console.log('看板数据更新:', data); // 添加调试日志
    setDashboardData(data);
  }, [fundRecords, transactions]);

  const updateTempFilter = (key: keyof FilterConfig, value: number | boolean) => {
    setTempFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveConfirm = () => {
    setFilter(tempFilter);
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setLastSavedTime(timeStr);
  };

  // 处理资金录入提交
  const handleFundSubmit = () => {
    const amount = parseFloat(fundForm.amount);

    if (!fundForm.type || !amount || !fundForm.date) {
      alert('请填写完整的资金录入信息');
      return;
    }

    if (amount <= 0) {
      alert('金额必须大于0');
      return;
    }

    // 计算交易后余额
    const lastBalance = fundRecords.length > 0 ? fundRecords[fundRecords.length - 1].balance : 0;
    const balanceAfter = fundForm.type === 'deposit' ? lastBalance + amount : lastBalance - amount;

    // 创建资金流水记录
    const fundAmount = fundForm.type === 'deposit' ? amount : -amount;
    const newFundRecord: FundRecord = {
      id: Date.now().toString(),
      date: fundForm.date,
      type: fundForm.type,
      amount: fundAmount,
      balance: balanceAfter,
      description: fundForm.note || `${fundForm.type === 'deposit' ? '入金' : '出金'} ¥${amount.toFixed(2)}`,
      timestamp: new Date().toISOString()
    };
    setFundRecords(prev => {
      const newRecords = [...prev, newFundRecord];
      console.log('资金记录已添加:', newRecords); // 添加调试日志
      return newRecords;
    });

    // 重置表单
    const today = new Date().toISOString().split('T')[0];
    setFundForm({
      type: 'deposit',
      amount: '',
      date: today,
      note: ''
    });

    alert('资金记录已添加');
  };

  // 删除资金流水记录
  const handleDeleteFundRecord = (index: number) => {
    if (confirm('确定要删除这条资金流水记录吗？后续记录的余额会重新计算。')) {
      // 删除指定索引的记录
      const newRecords = fundRecords.filter((_, i) => i !== index);

      // 重新计算后续记录的余额
      let runningBalance = 0;
      const recalculatedRecords = newRecords.map(record => {
        runningBalance += record.amount;
        return {
          ...record,
          balance: runningBalance
        };
      });

      setFundRecords(recalculatedRecords);
      console.log('资金记录已删除，余额已重新计算');
    }
  };

  // 删除交易记录
  const handleDeleteTransaction = (index: number) => {
    if (confirm('确定要删除这条交易记录吗？相关联的资金流水也会被删除。')) {
      const transactionToDelete = transactions[index];

      // 删除交易记录
      const newTransactions = transactions.filter((_, i) => i !== index);

      // 删除关联的资金流水记录
      const newFundRecords = fundRecords.filter(record => {
        // 如果是交易类型的记录，检查是否关联到被删除的交易
        if (record.type === 'transaction') {
          // 通过描述匹配（因为资金流水记录的描述包含交易信息）
          const isRelated = record.description.includes(transactionToDelete.stockCode) &&
                           record.description.includes(transactionToDelete.type === 'buy' ? '买入' : '卖出');
          return !isRelated;
        }
        return true;
      });

      // 重新计算资金流水记录的余额
      let runningBalance = 0;
      const recalculatedFundRecords = newFundRecords.map(record => {
        runningBalance += record.amount;
        return {
          ...record,
          balance: runningBalance
        };
      });

      setTransactions(newTransactions);
      setFundRecords(recalculatedFundRecords);
      console.log('交易记录已删除，关联资金流水已删除，余额已重新计算');
    }
  };

  // 自动填充股票信息
  const handleAutoFillStockInfo = async (field: 'code' | 'name', value: string) => {
    if (!value || value.length < 2) return;

    try {
      // 从已加载的股票列表中搜索
      const matchedStock = allStocksList.find(stock => {
        if (field === 'code') {
          return stock.code === value || stock.name === value;
        } else {
          return stock.name.includes(value) || stock.code === value;
        }
      });

      if (matchedStock) {
        if (field === 'code' && !transactionForm.stockName) {
          setTransactionForm(prev => ({ ...prev, stockName: matchedStock.name }));
        } else if (field === 'name' && !transactionForm.stockCode) {
          setTransactionForm(prev => ({ ...prev, stockCode: matchedStock.code }));
        }
      }
    } catch (error) {
      console.error('自动填充股票信息失败:', error);
    }
  };

  // 获取未卖出的买入记录
  const getUnsoldBuyRecords = (stockCode: string) => {
    const buyRecords = transactions.filter(tx => 
      tx.type === 'buy' && tx.stockCode === stockCode
    );

    const sellRecords = transactions.filter(tx => 
      tx.type === 'sell' && tx.stockCode === stockCode
    );

    // 计算每只股票的持仓情况
    const holdings: { [key: string]: { quantity: number, avgPrice: number, totalCost: number } } = {};

    buyRecords.forEach(buy => {
      if (!holdings[buy.id]) {
        holdings[buy.id] = { quantity: buy.quantity, avgPrice: buy.price, totalCost: buy.amount };
      } else {
        holdings[buy.id].quantity += buy.quantity;
        holdings[buy.id].totalCost += buy.amount;
        holdings[buy.id].avgPrice = holdings[buy.id].totalCost / holdings[buy.id].quantity;
      }
    });

    sellRecords.forEach(sell => {
      // 简单处理：假设卖出按先进先出
      const buyIds = Object.keys(holdings);
      for (const buyId of buyIds) {
        if (holdings[buyId].quantity > 0) {
          const sellQuantity = Math.min(sell.quantity, holdings[buyId].quantity);
          holdings[buyId].quantity -= sellQuantity;
          sell.quantity -= sellQuantity;
          if (sell.quantity <= 0) break;
        }
      }
    });

    // 返回仍有持仓的买入记录
    return buyRecords.filter(buy => holdings[buy.id] && holdings[buy.id].quantity > 0);
  };

  // 处理交易提交
  const handleTransactionSubmit = () => {
    const quantity = parseInt(transactionForm.quantity);
    const price = parseFloat(transactionForm.price);
    const buyPrice = parseFloat(transactionForm.buyPrice) || 0;

    if (!transactionForm.stockCode || !transactionForm.stockName || !quantity || !price) {
      alert('请填写完整的交易信息');
      return;
    }

    if (quantity <= 0 || price <= 0) {
      alert('数量和价格必须大于0');
      return;
    }

    // 计算成交金额和手续费（手续费率 0.05%）
    const amount = quantity * price;
    const fee = amount * 0.0005;

    // 计算盈亏和收益率（仅卖出时计算）
    let profitLoss = 0;
    let profitRate = 0;

    if (transactionForm.type === 'sell' && buyPrice > 0) {
      const buyAmount = quantity * buyPrice;
      const buyFee = buyAmount * 0.0005;
      profitLoss = amount - fee - buyAmount - buyFee;
      profitRate = (profitLoss / (buyAmount + buyFee)) * 100;
    }

    // 计算交易后余额
    const lastBalance = fundRecords.length > 0 ? fundRecords[fundRecords.length - 1].balance : 0;
    const balanceAfter = transactionForm.type === 'buy'
      ? lastBalance - amount - fee
      : lastBalance + amount - fee;

    // 创建新交易记录
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      stockCode: transactionForm.stockCode,
      stockName: transactionForm.stockName,
      type: transactionForm.type,
      price,
      quantity,
      amount,
      fee,
      buyPrice: transactionForm.type === 'sell' ? buyPrice : undefined,
      sellPrice: transactionForm.type === 'sell' ? price : undefined,
      profitLoss: transactionForm.type === 'sell' ? profitLoss : undefined,
      profitRate: transactionForm.type === 'sell' ? profitRate : undefined,
      balanceAfter,
      date: transactionForm.date,
      timestamp: new Date().toISOString(),
      note: transactionForm.note || undefined
    };
    setTransactions(prev => {
      const newTransactions = [...prev, newTransaction];
      console.log('交易记录已添加:', newTransactions); // 添加调试日志
      return newTransactions;
    });

    // 同时创建一条资金流水记录
    const fundAmount = transactionForm.type === 'buy' ? -(amount + fee) : (amount - fee);
    const newFundRecord: FundRecord = {
      id: Date.now().toString() + '_fund',
      date: transactionForm.date,
      type: 'transaction', // 修改为 transaction 类型
      amount: fundAmount,
      balance: balanceAfter,
      description: `${transactionForm.type === 'buy' ? '买入' : '卖出'} ${transactionForm.stockCode} ${transactionForm.stockName} ${quantity}股 (手续费¥${fee.toFixed(2)})`,
      timestamp: new Date().toISOString(),
      transactionType: transactionForm.type // 添加交易类型字段
    };
    setFundRecords(prev => {
      const newRecords = [...prev, newFundRecord];
      console.log('资金记录已添加（交易）:', newRecords); // 添加调试日志
      return newRecords;
    });

    // 重置表单
    const today = new Date().toISOString().split('T')[0];
    setTransactionForm({
      type: 'buy',
      stockCode: '',
      stockName: '',
      quantity: '',
      price: '',
      buyPrice: '',
      date: today,
      note: ''
    });

    alert('交易记录已添加');
  };


  // 全A股筛选
  const handleScreenAllStocks = async () => {
    setIsLoadingAllStocks(true);
    setDataSourceMessage('');
    setUsingMockData(false);

    try {
      // 获取所有涨幅符合条件的股票
      const result = await getStocksByChange(filter.minChange, filter.maxChange);

      // 检查是否使用了模拟数据
      if (result.metadata && result.metadata.dataSource === 'mock') {
        setUsingMockData(true);
        setDataSourceMessage(result.metadata.mockReason || '当前使用模拟数据，无法连接到真实行情API');
        setDataSourceMetadata(result.metadata);
      } else if (result.metadata) {
        setDataSourceMetadata(result.metadata);
      }

      // 转换为Stock对象
      const stocksWithQuotes = result.stocks.map((quote: any) => createStockFromQuote(quote));

      // 应用完整的筛选条件
      const filteredStocks = selectStocks(stocksWithQuotes, filter);

      // 添加筛选时间
      const now = new Date();
      const timestamp = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const filteredWithTime = filteredStocks.map(stock => ({
        ...stock,
        filterTimestamp: timestamp
      }));

      // 更新状态
      setAllStocksWithTime(prev => [...filteredWithTime, ...prev]);

      if (result.metadata && result.metadata.dataSource === 'mock') {
        alert(`使用模拟数据筛选出${filteredStocks.length}只符合条件的股票\n（注意：${result.metadata.mockReason || '当前无法连接到真实行情API'}）`);
      } else {
        alert(`成功从全A股中筛选出${filteredStocks.length}只符合条件的股票`);
      }
    } catch (error) {
      console.error('全A股筛选失败:', error);
      setDataSourceMessage('筛选失败：' + (error instanceof Error ? error.message : '未知错误'));
      alert('全A股筛选失败，请稍后重试');
    } finally {
      setIsLoadingAllStocks(false);
    }
  };

  // 自动填充股票代码或名称
  useEffect(() => {
    if (transactionForm.stockCode && transactionForm.stockCode.length >= 2) {
      handleAutoFillStockInfo('code', transactionForm.stockCode);
    }
  }, [transactionForm.stockCode]);

  useEffect(() => {
    if (transactionForm.stockName && transactionForm.stockName.length >= 2) {
      handleAutoFillStockInfo('name', transactionForm.stockName);
    }
  }, [transactionForm.stockName]);

  const toggleStockExpand = (stockCode: string) => {
    setExpandedStock(expandedStock === stockCode ? null : stockCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 页头 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            GYTL-Tools
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            基于涨幅、量比、换手率等指标筛选适合隔夜操作的优质标的
          </p>
        </div>

        {/* 数据来源标识 */}
        {dataSourceMetadata && (
          <div className={`p-4 rounded-lg border ${
            dataSourceMetadata.dataSource === 'real'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                {dataSourceMetadata.dataSource === 'real' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={dataSourceMetadata.dataSource === 'real' ? 'default' : 'secondary'}
                      className={
                        dataSourceMetadata.dataSource === 'real'
                          ? 'bg-green-600 text-white'
                          : 'bg-amber-600 text-white'
                      }
                    >
                      {dataSourceMetadata.dataSourceLabel}
                    </Badge>
                    {dataSourceMetadata.isMarketOpen && (
                      <Badge variant="outline" className="border-blue-600 text-blue-600">
                        交易时段
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    dataSourceMetadata.dataSource === 'real'
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-amber-800 dark:text-amber-200'
                  }`}>
                    {dataSourceMetadata.dataSourceDescription}
                  </p>
                  {dataSourceMetadata.dataSource === 'mock' && dataSourceMetadata.mockReason && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      原因：{dataSourceMetadata.mockReason}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
                    <span>更新时间：{dataSourceMetadata.updateTime}</span>
                    <span>股票总数：{dataSourceMetadata.totalStocks}只</span>
                    <span>响应时间：{dataSourceMetadata.responseTime}ms</span>
                    <span>{dataSourceMetadata.cacheInfo}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAllStocks}
                className="flex-shrink-0"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                重新连接
              </Button>
            </div>
          </div>
        )}

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="results">
              选股结果 ({allStocksWithTime.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              筛选条件
            </TabsTrigger>
            <TabsTrigger value="funds">
              资金管理
            </TabsTrigger>
          </TabsList>

          {/* 选股结果页面 */}
          <TabsContent value="results" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  所有筛选结果
                </h2>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  共 <span className="font-bold text-blue-600">{allStocksWithTime.length}</span> 条筛选记录
                  <span className="ml-2 text-xs text-slate-500">
                    （按筛选时间倒序排列）
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleScreenAllStocks}
                  disabled={isLoadingAllStocks}
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Database className={`h-4 w-4 mr-2 ${isLoadingAllStocks ? 'animate-spin' : ''}`} />
                  全A股筛选
                </Button>
              </div>
            </div>

            {allStocksWithTime.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-16 w-16 text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                    暂无筛选结果
                  </p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm">
                    点击"全A股筛选"按钮开始筛选
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800">
                        <TableHead className="w-[150px]">筛选时间</TableHead>
                        <TableHead className="w-[120px]">股票代码</TableHead>
                        <TableHead className="w-[150px]">股票名称</TableHead>
                        <TableHead className="text-right">当前价格</TableHead>
                        <TableHead className="text-right">涨跌幅</TableHead>
                        <TableHead className="text-right">量比</TableHead>
                        <TableHead className="text-right">换手率</TableHead>
                        <TableHead className="text-right">流通市值</TableHead>
                        <TableHead className="text-right">评分</TableHead>
                        <TableHead className="w-[100px]">详情</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allStocksWithTime.map((stock) => (
                        <React.Fragment key={`${stock.code}-${stock.filterTimestamp}`}>
                          <TableRow key={`${stock.code}-main`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                              {stock.filterTimestamp}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{stock.code}</TableCell>
                            <TableCell className="font-medium">{stock.name}</TableCell>
                            <TableCell className="text-right font-bold">¥{stock.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={stock.change > 0 ? 'default' : 'secondary'}
                                className={
                                  stock.change > 0
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                }
                              >
                                {stock.change > 0 ? '+' : ''}
                                {stock.change.toFixed(2)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{stock.volumeRatio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{stock.turnoverRate.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">{stock.marketCap}亿</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                {stock.score}分
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStockExpand(stock.code)}
                              >
                                {expandedStock === stock.code ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedStock === stock.code && (
                            <TableRow key={`${stock.code}-expanded`}>
                              <TableCell colSpan={9} className="p-4 bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="space-y-4">
                                  {/* 技术指标 */}
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                                      技术指标
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">MA5</div>
                                        <div className="font-semibold">¥{stock.ma5.toFixed(2)}</div>
                                      </div>
                                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">MA10</div>
                                        <div className="font-semibold">¥{stock.ma10.toFixed(2)}</div>
                                      </div>
                                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">MA20</div>
                                        <div className="font-semibold">¥{stock.ma20.toFixed(2)}</div>
                                      </div>
                                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">52周区间</div>
                                        <div className="font-semibold text-xs">
                                          ¥{stock.low52Week.toFixed(2)} - ¥{stock.high52Week.toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 额外信息 */}
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                                      其他信息
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-500">分时走势：</span>
                                        <Badge variant={stock.aboveAveragePrice ? "default" : "secondary"}>
                                          {stock.aboveAveragePrice ? '均价线上方' : '均价线下方'}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-500">20天涨停：</span>
                                        <Badge variant={stock.limitUpDays20 > 0 ? "default" : "secondary"}>
                                          {stock.limitUpDays20} 天
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 符合条件的原因 */}
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        符合条件
                                      </h4>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                                      <ul className="space-y-1 text-sm text-green-900 dark:text-green-100">
                                        {stock.reasons.map((reason, index) => (
                                          <li key={index} className="flex items-start gap-2">
                                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                                            {reason}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 资金管理页面 */}
          <TabsContent value="funds" className="space-y-6">
            <div className="space-y-6">
              {/* 资金数据看板 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        资金及交易数据看板
                      </CardTitle>
                      <CardDescription>查看资金流转和交易统计信息</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('确定要重置资金管理数据吗？此操作将清空所有资金流水和交易记录，无法恢复。')) {
                            setFundRecords([]);
                            setTransactions([]);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        重置资金管理数据
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">总资产</div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        ¥{dashboardData.totalCapital.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-sm text-green-600 dark:text-green-400 mb-1">总市值</div>
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                        ¥{dashboardData.currentBalance.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">总盈利</div>
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        ¥{dashboardData.totalProfit.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-sm text-red-600 dark:text-red-400 mb-1">总亏损</div>
                      <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                        ¥{dashboardData.totalLoss.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">盈利率</div>
                      <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {dashboardData.profitRate.toFixed(2)}%
                      </div>
                    </div>
                    <div className="p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                      <div className="text-sm text-cyan-600 dark:text-cyan-400 mb-1">胜率</div>
                      <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                        {dashboardData.winRate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-950 rounded-lg">
                      <div className="text-sm text-pink-600 dark:text-pink-400 mb-1">盈亏比</div>
                      <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                        {dashboardData.profitLossRatio.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">交易次数</div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {dashboardData.totalTransactions} 笔
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 操作列表 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <List className="h-5 w-5" />
                        操作列表
                      </CardTitle>
                      <CardDescription>
                        资金流水和交易记录
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      导入数据
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="funds" className="w-full">
                    <TabsList>
                      <TabsTrigger value="funds">资金流水</TabsTrigger>
                      <TabsTrigger value="transactions">交易记录</TabsTrigger>
                    </TabsList>

                    <TabsContent value="funds" className="mt-4">
                      {fundRecords.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          暂无资金流水记录
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>类型</TableHead>
                                <TableHead>日期</TableHead>
                                <TableHead>描述</TableHead>
                                <TableHead className="text-right">金额</TableHead>
                                <TableHead className="text-right">余额</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fundRecords.map((record, index) => (
                                <TableRow key={record.id}>
                                  <TableCell className="font-medium">
                                    {record.type === 'transaction'
                                      ? (record.transactionType === 'buy' ? '买入' : '卖出')
                                      : (record.type === 'deposit' ? '入金' :
                                        record.type === 'withdraw' ? '出金' :
                                        record.type === 'profit' ? '盈利' : '亏损')}
                                  </TableCell>
                                  <TableCell>{record.date}</TableCell>
                                  <TableCell className="text-slate-600 dark:text-slate-400">{record.description}</TableCell>
                                  <TableCell className={`text-right font-bold ${record.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {record.amount > 0 ? '+' : ''}¥{record.amount.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    ¥{record.balance.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteFundRecord(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="transactions" className="mt-4">
                      {transactions.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          暂无交易记录
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>股票代码</TableHead>
                                <TableHead>股票名称</TableHead>
                                <TableHead>类型</TableHead>
                                <TableHead>日期</TableHead>
                                <TableHead className="text-right">数量</TableHead>
                                <TableHead className="text-right">价格</TableHead>
                                <TableHead className="text-right">成交额</TableHead>
                                <TableHead className="text-right">手续费</TableHead>
                                <TableHead className="text-right">盈亏</TableHead>
                                <TableHead className="text-right">收益率</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactions.map((tx, index) => (
                                <TableRow key={tx.id}>
                                  <TableCell className="font-medium">{tx.stockCode}</TableCell>
                                  <TableCell>{tx.stockName}</TableCell>
                                  <TableCell>
                                    <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'}>
                                      {tx.type === 'buy' ? '买入' : '卖出'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{tx.date}</TableCell>
                                  <TableCell className="text-right">{tx.quantity}</TableCell>
                                  <TableCell className="text-right">¥{tx.price.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">¥{tx.amount.toFixed(2)}</TableCell>
                                  <TableCell className="text-right text-slate-600 dark:text-slate-400">
                                    ¥{tx.fee.toFixed(2)}
                                  </TableCell>
                                  <TableCell className={`text-right font-bold ${(tx.profitLoss ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : (tx.profitLoss ?? 0) < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                    {tx.profitLoss !== undefined && tx.profitLoss !== 0 ?
                                      (tx.profitLoss > 0 ? '+' : '') + '¥' + tx.profitLoss.toFixed(2) :
                                      tx.type === 'buy' ? '-' : '¥0.00'}
                                  </TableCell>
                                  <TableCell className={`text-right font-semibold ${(tx.profitRate ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : (tx.profitRate ?? 0) < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                    {tx.profitRate !== undefined && tx.profitRate !== 0 ?
                                      (tx.profitRate > 0 ? '+' : '') + tx.profitRate.toFixed(2) + '%' :
                                      tx.type === 'buy' ? '-' : '0.00%'}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteTransaction(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* 录入表单 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    录入资金和交易
                  </CardTitle>
                  <CardDescription>添加新的资金操作或交易记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="fund" className="w-full">
                    <TabsList>
                      <TabsTrigger value="fund">资金录入</TabsTrigger>
                      <TabsTrigger value="transaction">交易录入</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fund" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>操作类型</Label>
                          <Select
                            value={fundForm.type}
                            onValueChange={(value: 'deposit' | 'withdraw' | 'transfer') =>
                              setFundForm(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="deposit">入金</SelectItem>
                              <SelectItem value="withdraw">出金</SelectItem>
                              <SelectItem value="transfer">转账</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>金额</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={fundForm.amount}
                            onChange={(e) => setFundForm(prev => ({ ...prev, amount: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>日期</Label>
                          <Input
                            type="date"
                            value={fundForm.date}
                            onChange={(e) => setFundForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>备注</Label>
                          <Input
                            placeholder="可选备注"
                            value={fundForm.note}
                            onChange={(e) => setFundForm(prev => ({ ...prev, note: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button className="w-full" onClick={handleFundSubmit}>添加资金记录</Button>
                    </TabsContent>

                    <TabsContent value="transaction" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>交易类型</Label>
                          <Select
                            value={transactionForm.type}
                            onValueChange={(value: 'buy' | 'sell') =>
                              setTransactionForm(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buy">买入</SelectItem>
                              <SelectItem value="sell">卖出</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>股票代码</Label>
                          <Input
                            placeholder="如：000001"
                            value={transactionForm.stockCode}
                            onChange={(e) => {
                              setTransactionForm(prev => ({ ...prev, stockCode: e.target.value.toUpperCase() }));
                              handleAutoFillStockInfo('code', e.target.value.toUpperCase());
                            }}
                          />
                          {transactionForm.stockCode && transactionForm.stockName && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              ✓ 自动匹配: {transactionForm.stockName}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>股票名称</Label>
                          <Input
                            placeholder="如：平安银行"
                            value={transactionForm.stockName}
                            onChange={(e) => {
                              setTransactionForm(prev => ({ ...prev, stockName: e.target.value }));
                              handleAutoFillStockInfo('name', e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <Label>数量（股）</Label>
                          <Input
                            type="number"
                            placeholder="100"
                            value={transactionForm.quantity}
                            onChange={(e) => setTransactionForm(prev => ({ ...prev, quantity: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>{transactionForm.type === 'buy' ? '买入价格' : '卖出价格'}</Label>
                          <Input
                            type="number"
                            placeholder="10.00"
                            value={transactionForm.price}
                            onChange={(e) => setTransactionForm(prev => ({ ...prev, price: e.target.value }))}
                          />
                        </div>
                        {transactionForm.type === 'sell' && (
                          <>
                            <div>
                              <Label>买入价格（用于计算盈亏）</Label>
                              <Select
                                value={transactionForm.buyPrice}
                                onValueChange={(value) =>
                                  setTransactionForm(prev => ({ ...prev, buyPrice: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="选择或输入买入价" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getUnsoldBuyRecords(transactionForm.stockCode).map((record) => (
                                    <SelectItem key={record.id} value={record.price.toString()}>
                                      {record.date}: ¥{record.price.toFixed(2)} × {record.quantity}股
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder="10.00"
                                value={transactionForm.buyPrice}
                                onChange={(e) => setTransactionForm(prev => ({ ...prev, buyPrice: e.target.value }))}
                                className="mt-2"
                              />
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                输入当初的买入价以自动计算盈亏（含手续费）
                              </p>
                            </div>
                          </>
                        )}
                        <div>
                          <Label>日期</Label>
                          <Input
                            type="date"
                            value={transactionForm.date}
                            onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>备注</Label>
                          <Input
                            placeholder="可选备注"
                            value={transactionForm.note}
                            onChange={(e) => setTransactionForm(prev => ({ ...prev, note: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* 实时预览盈亏 */}
                      {transactionForm.type === 'sell' && transactionForm.price && transactionForm.buyPrice && transactionForm.quantity && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            盈亏预览（含手续费）
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">买入金额（含手续费）：</span>
                              <span className="font-bold ml-2">
                                ¥{((parseFloat(transactionForm.buyPrice) * parseInt(transactionForm.quantity)) * 1.0005).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">卖出金额（含手续费）：</span>
                              <span className="font-bold ml-2">
                                ¥{((parseFloat(transactionForm.price) * parseInt(transactionForm.quantity)) * 0.9995).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">预计盈亏：</span>
                              <span className={`font-bold ml-2 ${
                                ((parseFloat(transactionForm.price) * parseInt(transactionForm.quantity) * 0.9995) -
                                  (parseFloat(transactionForm.buyPrice) * parseInt(transactionForm.quantity) * 1.0005)) > 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                ¥{((parseFloat(transactionForm.price) * parseInt(transactionForm.quantity) * 0.9995) -
                                  (parseFloat(transactionForm.buyPrice) * parseInt(transactionForm.quantity) * 1.0005)).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">预计收益率：</span>
                              <span className={`font-bold ml-2 ${
                                ((parseFloat(transactionForm.price) - parseFloat(transactionForm.buyPrice)) / parseFloat(transactionForm.buyPrice) * 100) > 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {(((parseFloat(transactionForm.price) * parseInt(transactionForm.quantity) * 0.9995) -
                                  (parseFloat(transactionForm.buyPrice) * parseInt(transactionForm.quantity) * 1.0005)) /
                                  (parseFloat(transactionForm.buyPrice) * parseInt(transactionForm.quantity) * 1.0005) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button className="w-full" onClick={handleTransactionSubmit}>添加交易记录</Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 筛选条件页面 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  选股条件配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 保存控制区域 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>调整参数后请点击确认按钮生效</span>
                    </div>
                    {lastSavedTime && (
                      <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        上次保存时间：{lastSavedTime}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSaveConfirm}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    保存并应用筛选条件
                  </Button>
                </div>

                <Separator />
                {/* 涨幅范围 */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>涨幅范围</Label>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tempFilter.minChange}% - {tempFilter.maxChange}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最小涨幅</Label>
                        <Slider
                          value={[tempFilter.minChange]}
                          onValueChange={([value]) => updateTempFilter('minChange', value)}
                          max={10}
                          min={0}
                          step={0.5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最大涨幅</Label>
                        <Slider
                          value={[tempFilter.maxChange]}
                          onValueChange={([value]) => updateTempFilter('maxChange', value)}
                          max={15}
                          min={3}
                          step={0.5}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 量比 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>最小量比</Label>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tempFilter.minVolumeRatio}
                      </span>
                    </div>
                    <Slider
                      value={[tempFilter.minVolumeRatio]}
                      onValueChange={([value]) => updateTempFilter('minVolumeRatio', value)}
                      max={5}
                      min={1}
                      step={0.1}
                    />
                  </div>

                  <Separator />

                  {/* 换手率 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>换手率范围</Label>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tempFilter.minTurnoverRate}% - {tempFilter.maxTurnoverRate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最小换手率</Label>
                        <Slider
                          value={[tempFilter.minTurnoverRate]}
                          onValueChange={([value]) => updateTempFilter('minTurnoverRate', value)}
                          max={20}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最大换手率</Label>
                        <Slider
                          value={[tempFilter.maxTurnoverRate]}
                          onValueChange={([value]) => updateTempFilter('maxTurnoverRate', value)}
                          max={30}
                          min={5}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 流通市值 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>流通市值范围（亿）</Label>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tempFilter.minMarketCap}亿 - {tempFilter.maxMarketCap}亿
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最小流通市值</Label>
                        <Slider
                          value={[tempFilter.minMarketCap]}
                          onValueChange={([value]) => updateTempFilter('minMarketCap', value)}
                          max={200}
                          min={0}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最大流通市值</Label>
                        <Slider
                          value={[tempFilter.maxMarketCap]}
                          onValueChange={([value]) => updateTempFilter('maxMarketCap', value)}
                          max={1000}
                          min={10}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 股价范围 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>股价范围</Label>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        ¥{tempFilter.minPrice} - ¥{tempFilter.maxPrice}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最低价格</Label>
                        <Slider
                          value={[tempFilter.minPrice]}
                          onValueChange={([value]) => updateTempFilter('minPrice', value)}
                          max={50}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 dark:text-slate-400">最高价格</Label>
                        <Slider
                          value={[tempFilter.maxPrice]}
                          onValueChange={([value]) => updateTempFilter('maxPrice', value)}
                          max={3000}
                          min={10}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 20天内涨停天数 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>20天内最少涨停天数</Label>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tempFilter.minLimitUpDays20} 天
                      </span>
                    </div>
                    <Slider
                      value={[tempFilter.minLimitUpDays20]}
                      onValueChange={([value]) => updateTempFilter('minLimitUpDays20', value)}
                      max={10}
                      min={0}
                      step={1}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      设置为 0 表示不限制涨停天数
                    </p>
                  </div>

                  <Separator />

                  {/* 分时走势全天在均价线上方 */}
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1">
                      <Label>要求分时走势全天在均价线上方</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        开启后将只筛选全天走势强于平均价线的股票
                      </p>
                    </div>
                    <Switch
                      checked={tempFilter.requireAboveAveragePrice}
                      onCheckedChange={(checked) => updateTempFilter('requireAboveAveragePrice', checked)}
                    />
                  </div>

                  <Separator />

                  {/* 操作说明 */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      操作建议
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• 买入时机：尾盘 14:30-15:00 分批买入</li>
                      <li>• 卖出时机：次日早盘 9:30-10:00 冲高卖出</li>
                      <li>• 止损：次日跌破买入价5%立即止损</li>
                      <li>• 止盈：次日涨幅达到5%-8%考虑减仓</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
