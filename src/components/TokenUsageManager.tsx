import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

interface TokenData {
  date: string;
  input_token: number;
  output_token: number;
  total: number;
}

const TokenUsageManager = () => {
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [totalUsage, setTotalUsage] = useState({
    input: 0,
    output: 0,
    total: 0
  });
  const { toast } = useToast();

  const getDateRange = (range: string) => {
    const now = new Date();
    let start: Date;
    let end: Date = endOfDay(now);

    switch (range) {
      case 'today':
        start = startOfDay(now);
        break;
      case '7days':
        start = startOfDay(subDays(now, 6));
        break;
      case '30days':
        start = startOfDay(subDays(now, 29));
        break;
      case 'thisWeek':
        start = startOfWeek(now);
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        start = startOfDay(subDays(now, 6));
    }

    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    };
  };

  const fetchTokenUsage = async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange(timeRange);

      // Use direct query with any type casting to bypass TypeScript issues
      const { data, error } = await supabase
        .from('TokenUsage' as any)
        .select('input_token, output_token, total, timestamp')
        .gte('timestamp', start)
        .lte('timestamp', end)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      processTokenData(data || []);

    } catch (error) {
      console.error('Error fetching token usage:', error);
      // Create mock data for demonstration if table doesn't exist or has issues
      const mockData = generateMockData();
      processTokenData(mockData);
      
      toast({
        title: "Using Demo Data",
        description: "Token usage data not available, showing demo data",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const { start } = getDateRange(timeRange);
    const data = [];
    const days = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : timeRange === 'thisWeek' ? 7 : timeRange === '30days' ? 30 : 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        timestamp: date.toISOString(),
        input_token: Math.floor(Math.random() * 10000) + 1000,
        output_token: Math.floor(Math.random() * 8000) + 800,
        total: Math.floor(Math.random() * 18000) + 1800
      });
    }
    return data.reverse();
  };

  const processTokenData = (data: any[]) => {
    // Group data by date
    const groupedData: { [key: string]: TokenData } = {};
    let totalInput = 0;
    let totalOutput = 0;
    let totalTokens = 0;

    data.forEach((item) => {
      const date = format(new Date(item.timestamp), 'yyyy-MM-dd');
      
      if (!groupedData[date]) {
        groupedData[date] = {
          date: format(new Date(item.timestamp), 'MMM dd'),
          input_token: 0,
          output_token: 0,
          total: 0
        };
      }
      
      groupedData[date].input_token += item.input_token || 0;
      groupedData[date].output_token += item.output_token || 0;
      groupedData[date].total += item.total || 0;

      totalInput += item.input_token || 0;
      totalOutput += item.output_token || 0;
      totalTokens += item.total || 0;
    });

    setTokenData(Object.values(groupedData));
    setTotalUsage({
      input: totalInput,
      output: totalOutput,
      total: totalTokens
    });
  };

  useEffect(() => {
    fetchTokenUsage();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Token Usage Analytics</h2>
          <p className="text-muted-foreground">
            Track and monitor token consumption across your AI services
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="7days">7 Hari Terakhir</SelectItem>
            <SelectItem value="thisWeek">Minggu Ini</SelectItem>
            <SelectItem value="30days">30 Hari Terakhir</SelectItem>
            <SelectItem value="thisMonth">Bulan Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Input Tokens</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUsage.input)}</div>
            <p className="text-xs text-muted-foreground">
              Tokens sent to AI models
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Output Tokens</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUsage.output)}</div>
            <p className="text-xs text-muted-foreground">
              Tokens generated by AI
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUsage.total)}</div>
            <p className="text-xs text-muted-foreground">
              Combined token usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Token Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Token Usage Trends</CardTitle>
          <CardDescription>
            Daily breakdown of token consumption across different types
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-pulse text-muted-foreground">Loading token data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-muted-foreground"
                  fontSize={12}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    name === 'input_token' ? 'Input Tokens' :
                    name === 'output_token' ? 'Output Tokens' : 'Total Tokens'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="input_token" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Input Tokens"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="output_token" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Output Tokens"
                  dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--accent-foreground))" 
                  strokeWidth={2}
                  name="Total Tokens"
                  dot={{ fill: 'hsl(var(--accent-foreground))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenUsageManager;