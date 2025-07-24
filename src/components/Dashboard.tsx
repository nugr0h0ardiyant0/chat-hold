import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import HoldManager from '@/components/HoldManager';
import PromoManager from '@/components/PromoManager';
import ProductManager from '@/components/ProductManager';
import KeluhaneManager from '@/components/KeluhaneManager';
import CustomerJourneyManager from '@/components/CustomerJourneyManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  MessageSquare, 
  AlertTriangle, 
  ShoppingCart, 
  Users, 
  Package, 
  Percent,
  Shield,
  Navigation,
  CalendarDays,
  Download,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [metrics, setMetrics] = useState({
    chatToday: 0,
    complaintsToday: 0,
    checkoutToday: 0,
    customerJourneyToday: 0,
    followUpNeeded: 0
  });
  const [timeRange, setTimeRange] = useState('today');
  const [dailyMetrics, setDailyMetrics] = useState<any[]>([]);

  const fetchDailyMetrics = async () => {
    try {
      const { start, end } = getDateRange('30days'); // Always show last 30 days for chart
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];

      const { data, error } = await supabase
        .rpc('get_daily_metrics_range', {
          start_date: startDate,
          end_date: endDate
        });

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('id-ID', { 
          month: 'short', 
          day: 'numeric' 
        }),
        chat: item.total_chats || 0,
        keluhan: item.total_complaints || 0,
        checkout: item.total_checkouts || 0,
        journey: item.pelanggan_tanya + item.masuk_keranjang + item.inisiasi_payment_belum_bayar + 
                item.invoice_gagal_bayar + item.sudah_bayar + item.keluhan || 0
      })) || [];

      setDailyMetrics(formattedData);
    } catch (error) {
      console.error('Error fetching daily metrics:', error);
    }
  };

  const downloadCSV = async (type: 'chat' | 'complaints' | 'checkout') => {
    try {
      const { start, end } = getDateRange(timeRange);
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];
      
      let data: any[] = [];
      let filename = '';
      
      if (type === 'chat') {
        const { data: chatData } = await supabase
          .from('User')
          .select('phone_number, created_at, updated_at, last_message')
          .gte('updated_at', startDate)
          .lte('updated_at', endDate + 'T23:59:59');
        data = chatData || [];
        filename = `chat_data_${timeRange}.csv`;
      } else if (type === 'complaints') {
        const { data: complaintsData } = await supabase
          .from('Keluhan')
          .select('id, Nomor_Pelanggan, Keluhan, Datetime, sudah_ditangani')
          .gte('Datetime', startDate)
          .lte('Datetime', endDate + 'T23:59:59');
        data = complaintsData || [];
        filename = `keluhan_data_${timeRange}.csv`;
      } else if (type === 'checkout') {
        const { data: checkoutData } = await supabase
          .from('Order')
          .select('id, nama_penerima, no_hp_penerima, alamat_penerima, status, created_at')
          .eq('status', 'PROCESSING')
          .gte('created_at', startDate)
          .lte('created_at', endDate + 'T23:59:59');
        data = checkoutData || [];
        filename = `checkout_data_${timeRange}.csv`;
      }
      
      if (data.length === 0) {
        alert('Tidak ada data untuk periode yang dipilih');
        return;
      }
      
      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          }).join(',')
        )
      ].join('\n');
      
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Gagal mengunduh data CSV');
    }
  };

  if (!userProfile) return null;

  const isAdmin = userProfile.role === 'admin';
  const isOperator = userProfile.role === 'operator';

  const getDateRange = (range: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return { start: today, end: today };
      case '7days':
        const week = new Date(today);
        week.setDate(week.getDate() - 6);
        return { start: week, end: today };
      case '30days':
        const month = new Date(today);
        month.setDate(month.getDate() - 29);
        return { start: month, end: today };
      case '1year':
        const year = new Date(today);
        year.setFullYear(year.getFullYear() - 1);
        return { start: year, end: today };
      default:
        return { start: today, end: today };
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { start, end } = getDateRange(timeRange);
        const startDate = start.toISOString().split('T')[0];
        const endDate = end.toISOString().split('T')[0];
        
        // Use range functions if available, fallback to original queries
        try {
          const [chatData, complaintsData, checkoutData, journeyData, followUpData] = await Promise.all([
            supabase.rpc('get_chat_metrics_range', { start_date: startDate, end_date: endDate }),
            supabase.rpc('get_complaints_metrics_range', { start_date: startDate, end_date: endDate }),
            supabase.rpc('get_checkout_metrics_range', { start_date: startDate, end_date: endDate }),
            supabase.rpc('get_customer_journey_metrics_range', { start_date: startDate, end_date: endDate }),
            supabase.rpc('get_follow_up_count')
          ]);

          setMetrics({
            chatToday: chatData.data || 0,
            complaintsToday: complaintsData.data || 0,
            checkoutToday: checkoutData.data || 0,
            customerJourneyToday: journeyData.data || 0,
            followUpNeeded: followUpData.data || 0
          });
        } catch (error) {
          console.log('Using fallback queries');
          
          // Fallback to original queries
          const { data: chatData } = await supabase
            .from('User')
            .select('phone_number')
            .gte('updated_at', startDate)
            .lte('updated_at', endDate + 'T23:59:59');
          
          const uniqueChats = new Set(chatData?.map(item => item.phone_number));
          
          const { data: complaintsData } = await supabase
            .from('Keluhan')
            .select('id')
            .gte('Datetime', startDate)
            .lte('Datetime', endDate + 'T23:59:59');
          
          const { data: checkoutData } = await supabase
            .from('Order')
            .select('id')
            .eq('status', 'PROCESSING')
            .gte('created_at', startDate)
            .lte('created_at', endDate + 'T23:59:59');

          let journeyData = 0;
          let followUpData = 0;
          
          try {
            const { data: jData } = await supabase.rpc('get_customer_journey_metrics_range', { start_date: startDate, end_date: endDate });
            journeyData = jData || 0;
          } catch (error) {
            console.log('Customer journey metrics function not available');
          }

          try {
            const { data: fData } = await supabase.rpc('get_follow_up_count');
            followUpData = fData || 0;
          } catch (error) {
            console.log('Follow up count function not available');
          }

          setMetrics({
            chatToday: uniqueChats.size,
            complaintsToday: complaintsData?.length || 0,
            checkoutToday: checkoutData?.length || 0,
            customerJourneyToday: journeyData || 0,
            followUpNeeded: followUpData || 0
          });
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    fetchDailyMetrics();

    // Set up real-time subscriptions
    const customerJourneyChannel = supabase
      .channel('customerjourney-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'CustomerJourney' }, 
        () => fetchMetrics()
      )
      .subscribe();

    const userChannel = supabase
      .channel('user-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'User' }, 
        () => fetchMetrics()
      )
      .subscribe();

    const keluhanChannel = supabase
      .channel('keluhan-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Keluhan' }, 
        () => fetchMetrics()
      )
      .subscribe();

    const orderChannel = supabase
      .channel('order-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Order' }, 
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(customerJourneyChannel);
      supabase.removeChannel(userChannel);
      supabase.removeChannel(keluhanChannel);
      supabase.removeChannel(orderChannel);
    };
  }, [timeRange]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selamat Datang, {userProfile.username}!
            </CardTitle>
            <CardDescription>
              Dashboard {isAdmin ? 'Administrator' : 'Operator'} - Akses sesuai peran Anda
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Time Range Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Periode:</span>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                      <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                      <SelectItem value="1year">1 Tahun Terakhir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Download CSV:</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadCSV('chat')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Chat
                  </Button>
                  {isAdmin && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadCSV('complaints')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Keluhan
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadCSV('checkout')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Checkout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Jumlah Chat Hari Ini - Visible to all roles */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Jumlah Chat {timeRange === 'today' ? 'Hari Ini' : timeRange === '7days' ? '7 Hari' : timeRange === '30days' ? '30 Hari' : '1 Tahun'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.chatToday}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Jumlah Keluhan Hari Ini - Admin only */}
          {isAdmin && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Jumlah Keluhan {timeRange === 'today' ? 'Hari Ini' : timeRange === '7days' ? '7 Hari' : timeRange === '30days' ? '30 Hari' : '1 Tahun'}
                    </p>
                    <p className="text-2xl font-bold text-red-600">{metrics.complaintsToday}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Jumlah Checkout Hari Ini - Admin only */}
          {isAdmin && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Jumlah Checkout {timeRange === 'today' ? 'Hari Ini' : timeRange === '7days' ? '7 Hari' : timeRange === '30days' ? '30 Hari' : '1 Tahun'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">{metrics.checkoutToday}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customer Journey Metrics - Admin only */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Journey {timeRange === 'today' ? 'Hari Ini' : timeRange === '7days' ? '7 Hari' : timeRange === '30days' ? '30 Hari' : '1 Tahun'}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.customerJourneyToday}</p>
                </div>
                  <Navigation className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Follow Up Diperlukan</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.followUpNeeded}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Historical Charts - Admin only */}
        {isAdmin && dailyMetrics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Grafik Perkembangan Harian (30 Hari Terakhir)
              </CardTitle>
              <CardDescription>
                Tracking perkembangan metrics dari hari ke hari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="chat" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Chat"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="keluhan" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Keluhan"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="checkout" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Checkout"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="journey" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Customer Journey"
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue={isAdmin ? "hold" : "promo"} className="space-y-4">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-2'}`}>
            {/* Hold Management Tab - Admin only */}
            {isAdmin && (
              <TabsTrigger value="hold" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Pengelola Hold
              </TabsTrigger>
            )}
            
            {/* Complaints Management Tab - Admin only */}
            {isAdmin && (
              <TabsTrigger value="keluhan" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Keluhan
              </TabsTrigger>
            )}

            {/* Customer Journey Tab - Admin only */}
            {isAdmin && (
              <TabsTrigger value="customer-journey" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Customer Journey
              </TabsTrigger>
            )}
            
            {/* Promo Management Tab - All roles */}
            <TabsTrigger value="promo" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Manajemen Promo
            </TabsTrigger>
            
            {/* Product Management Tab - All roles */}
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Manajemen Produk
            </TabsTrigger>
          </TabsList>

          {/* Hold Management Content - Admin only */}
          {isAdmin && (
            <TabsContent value="hold" className="space-y-4">
              <div className="border rounded-lg p-1">
                <HoldManager />
              </div>
            </TabsContent>
          )}

          {/* Complaints Management Content - Admin only */}
          {isAdmin && (
            <TabsContent value="keluhan" className="space-y-4">
              <KeluhaneManager />
            </TabsContent>
          )}

          {/* Customer Journey Management Content - Admin only */}
          {isAdmin && (
            <TabsContent value="customer-journey" className="space-y-4">
              <CustomerJourneyManager />
            </TabsContent>
          )}

          {/* Promo Management Content */}
          <TabsContent value="promo" className="space-y-4">
            <PromoManager />
          </TabsContent>

          {/* Product Management Content */}
          <TabsContent value="product" className="space-y-4">
            <ProductManager />
          </TabsContent>
        </Tabs>

        {/* Role Information */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Peran Anda:</strong> {isAdmin ? 'Administrator' : 'Operator'}</p>
              <div className="mt-2">
                <p><strong>Akses yang Anda miliki:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {isAdmin ? (
                    <>
                      <li>Pengelola Responder WhatsApp (Hold Management)</li>
                      <li>Manajemen Keluhan</li>
                      <li>Manajemen Customer Journey</li>
                      <li>Semua metrik operasional</li>
                      <li>Manajemen Promo (CRUD lengkap)</li>
                      <li>Manajemen Produk (CRUD lengkap)</li>
                    </>
                  ) : (
                    <>
                      <li>Metrik chat harian</li>
                      <li>Manajemen Promo (CRUD lengkap)</li>
                      <li>Manajemen Produk (Tambah dan Edit)</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;