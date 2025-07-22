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
import { 
  MessageSquare, 
  AlertTriangle, 
  ShoppingCart, 
  Users, 
  Package, 
  Percent,
  Shield,
  Navigation
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

  if (!userProfile) return null;

  const isAdmin = userProfile.role === 'admin';
  const isOperator = userProfile.role === 'operator';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch chat metrics
        const { data: chatData } = await supabase
          .from('User')
          .select('phone_number')
          .gte('updated_at', today);
        
        const uniqueChats = new Set(chatData?.map(item => item.phone_number));
        
        // Fetch complaints metrics
        const { data: complaintsData } = await supabase
          .from('Keluhan')
          .select('id')
          .gte('Datetime', today);
        
        // Fetch checkout metrics
        const { data: checkoutData } = await supabase
          .from('Order')
          .select('id')
          .eq('status', 'PROCESSING')
          .gte('created_at', today);

        // Fetch customer journey metrics using raw SQL
        const { data: journeyData } = await supabase
          .rpc('get_daily_customer_journey_metrics');

        // Fetch follow up metrics using raw SQL
        const { data: followUpData } = await supabase
          .rpc('get_follow_up_count');

        setMetrics({
          chatToday: uniqueChats.size,
          complaintsToday: complaintsData?.length || 0,
          checkoutToday: checkoutData?.length || 0,
          customerJourneyToday: journeyData || 0,
          followUpNeeded: followUpData || 0
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

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

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Jumlah Chat Hari Ini - Visible to all roles */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jumlah Chat Hari Ini</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Jumlah Keluhan Hari Ini</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Jumlah Checkout Hari Ini</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Customer Journey Hari Ini</p>
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