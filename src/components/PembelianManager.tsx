import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, RefreshCw, Clock, Package, User, MapPin, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderExportData {
  export_id: string;
  order_id: string;
  nama_lengkap: string;
  nomor_hp: string;
  alamat_jalan: string;
  alamat_kecamatan: string;
  alamat_kota_kabupaten: string;
  alamat_provinsi: string;
  kode_pos: string;
  status: string;
  waktu_transaksi: string;
  subtotal: number;
  harga_ongkir: number;
  grand_total: number;
  orderan: any;
  created_at: string;
}

const PembelianManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    draft: 0
  });
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      // For now, use Order table until OrderExport is available
      const { data: ordersData, error } = await supabase
        .from('Order')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(ordersData || []);
      
      // Calculate summary based on available status
      const total = ordersData?.length || 0;
      const processing = ordersData?.filter((item: any) => item.status === 'PROCESSING').length || 0;
      const draft = ordersData?.filter((item: any) => item.status === 'DRAFT').length || 0;
      const pending = ordersData?.filter((item: any) => item.proses === true).length || 0;

      setSummary({ total, paid: processing, pending, draft });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data tracking pembelian",
        variant: "destructive",
      });
      console.error('Error fetching orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // No update functionality needed - this is for tracking only

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


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tracking Pembelian</h1>
          <p className="text-muted-foreground">
            Tracking dan monitoring data pembelian pelanggan
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{summary.total}</div>
            <p className="text-sm text-muted-foreground">Total Order</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{summary.paid}</div>
            <p className="text-sm text-muted-foreground">Sudah Bayar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">{summary.draft}</div>
            <p className="text-sm text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Data Tracking Pembelian
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Belum ada data tracking pembelian
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
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
                            <Badge variant={
                              order.status === 'PROCESSING' ? 'default' : 
                              order.proses ? 'secondary' : 
                              'outline'
                            }>
                              {order.status || 'DRAFT'}
                            </Badge>
                          </div>
                         
                         <div className="flex items-center gap-2 text-sm">
                           <User className="h-4 w-4 text-muted-foreground" />
                           <span className="font-medium">{order.nama_penerima || 'Belum diisi'}</span>
                         </div>
                         
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <ShoppingCart className="h-4 w-4" />
                           <span>{order.no_hp_penerima || 'No HP belum diisi'}</span>
                         </div>
                         
                         <div className="flex items-start gap-2 text-sm text-muted-foreground">
                           <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                           <span>
                             {order.alamat_penerima || 'Alamat belum diisi'}
                           </span>
                         </div>
                         
                         {order.created_at && (
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                             <Clock className="h-4 w-4" />
                             <span>{new Date(order.created_at).toLocaleString('id-ID')}</span>
                           </div>
                         )}
                       </div>
                       
                        <div className="text-right space-y-2">
                          <div className="text-lg font-bold text-primary">
                            Rp {order.total_pembayaran?.toLocaleString('id-ID') || '0'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Status: {order.status || 'DRAFT'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Proses: {order.proses ? 'Ya' : 'Tidak'}
                          </div>
                       </div>
                     </div>
                     
                     {order.ringkasan && (
                       <div className="bg-muted/20 p-6 rounded-lg border-l-4 border-l-primary">
                         <h4 className="text-lg font-semibold mb-4 text-foreground">Ringkasan Order</h4>
                         <div className="bg-background p-4 rounded-md border max-h-96 overflow-y-auto">
                           <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                             {order.ringkasan || 'Tidak ada ringkasan'}
                           </pre>
                         </div>
                       </div>
                     )}
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