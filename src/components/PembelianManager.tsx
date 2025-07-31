import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, RefreshCw, Clock, Package, User, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  nama_penerima: string;
  alamat_penerima: string;
  updated_at: string;
  status: string;
  cart_summary?: string;
  total_pembayaran?: number;
}

const PembelianManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      // Get orders with cart summary
      const { data: orderData, error: orderError } = await supabase
        .from('Order')
        .select(`
          id,
          nama_penerima,
          alamat_penerima,
          updated_at,
          status
        `)
        .order('updated_at', { ascending: false });

      if (orderError) throw orderError;

      // Get cart summaries for each order
      const ordersWithSummary = await Promise.all(
        (orderData || []).map(async (order) => {
          const { data: cartData, error: cartError } = await supabase
            .from('Cart')
            .select('ringkasan, total_pembayaran')
            .eq('id', order.id)
            .single();

          return {
            ...order,
            cart_summary: cartData?.ringkasan || 'Tidak ada ringkasan',
            total_pembayaran: cartData?.total_pembayaran || 0
          };
        })
      );

      setOrders(ordersWithSummary);
      
      // Calculate summary
      const total = ordersWithSummary.length;
      const processing = ordersWithSummary.filter(o => o.status === 'PROCESSING').length;
      const completed = ordersWithSummary.filter(o => o.status === 'COMPLETED').length;
      const cancelled = ordersWithSummary.filter(o => o.status === 'CANCELLED').length;

      setSummary({ total, processing, completed, cancelled });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pembelian",
        variant: "destructive",
      });
      console.error('Error fetching orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Order'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'Diproses';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      case 'DRAFT': return 'Draft';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kelola Pembelian</h1>
          <p className="text-muted-foreground">
            Manajemen order dan tracking pembelian pelanggan
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{summary.total}</div>
            <p className="text-sm text-muted-foreground">Total Order</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{summary.processing}</div>
            <p className="text-sm text-muted-foreground">Diproses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{summary.completed}</div>
            <p className="text-sm text-muted-foreground">Selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{summary.cancelled}</div>
            <p className="text-sm text-muted-foreground">Dibatalkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Data Pembelian
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Belum ada data pembelian
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm text-muted-foreground">#{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{order.nama_penerima || 'Belum diisi'}</span>
                        </div>
                        
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{order.alamat_penerima || 'Alamat belum diisi'}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          Rp {order.total_pembayaran?.toLocaleString('id-ID') || '0'}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.updated_at).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Ringkasan Order:</h4>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                        {order.cart_summary}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PembelianManager;