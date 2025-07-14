import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import HoldManager from '@/components/HoldManager';
import PromoManager from '@/components/PromoManager';
import ProductManager from '@/components/ProductManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  AlertTriangle, 
  ShoppingCart, 
  Users, 
  Package, 
  Percent,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const isAdmin = userProfile.role === 'admin';
  const isOperator = userProfile.role === 'operator';

  // Mock metrics data - replace with real data
  const metrics = {
    totalChats: 156,
    complaints: 23,
    checkouts: 45
  };

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
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalChats}</p>
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
                    <p className="text-2xl font-bold text-red-600">{metrics.complaints}</p>
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
                    <p className="text-2xl font-bold text-green-600">{metrics.checkouts}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={isAdmin ? "hold" : "promo"} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {/* Hold Management Tab - Admin only */}
            {isAdmin && (
              <TabsTrigger value="hold" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Pengelola Hold
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