import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, RefreshCw, Clock, Package, User, MapPin, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RingkasanOrder {
  nama_penerima: string;
  no_hp_penerima: string;
  alamat_penerima: string;
  status: string;
  proses: boolean;
  total_pembayaran: number;
  total_ongkir: number;
  order_id: string;
}

interface PembelianWithRingkasan extends RingkasanOrder {
  ringkasan?: string;
  id?: string;
}

const PembelianManager = () => {
  const [pembelian, setPembelian] = useState<PembelianWithRingkasan[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    proses: 0,
    belum_proses: 0
  });
  const { toast } = useToast();

  const fetchPembelian = async () => {
    setIsRefreshing(true);
    try {
      // Use raw SQL query to call the function since it's not in types
      const { data: ordersData, error: ordersError } = await supabase
        .from('Order')
        .select(`
          id,
          nama_penerima,
          no_hp_penerima,
          alamat_penerima,
          status,
          proses,
          total_pembayaran
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get Cart data with ringkasan for each order
      const ordersWithRingkasan = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: cartData } = await supabase
            .from('Cart')
            .select('ringkasan, total_ongkir')
            .eq('id', order.id.replace('order_', ''))
            .maybeSingle();
          
          return {
            ...order,
            order_id: order.id,
            total_ongkir: cartData?.total_ongkir || 0,
            ringkasan: cartData?.ringkasan || 'Tidak ada ringkasan'
          };
        })
      );

      setPembelian(ordersWithRingkasan);
      
      // Calculate summary
      const total = ordersWithRingkasan?.length || 0;
      const proses = ordersWithRingkasan?.filter(item => item.proses).length || 0;
      const belum_proses = total - proses;

      setSummary({ total, proses, belum_proses });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pembelian",
        variant: "destructive",
      });
      console.error('Error fetching pembelian:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateProses = async (id: string, proses: boolean) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ proses, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Status proses ${proses ? 'diaktifkan' : 'dinonaktifkan'}`,
      });

      fetchPembelian();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate status proses",
        variant: "destructive",
      });
      console.error('Error updating proses:', error);
    }
  };

  useEffect(() => {
    fetchPembelian();

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
          fetchPembelian();
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
          <h1 className="text-3xl font-bold text-foreground">Kelola Pembelian</h1>
          <p className="text-muted-foreground">
            Manajemen order dan tracking pembelian pelanggan
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPembelian}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{summary.total}</div>
            <p className="text-sm text-muted-foreground">Total Pembelian</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{summary.proses}</div>
            <p className="text-sm text-muted-foreground">Sedang Diproses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">{summary.belum_proses}</div>
            <p className="text-sm text-muted-foreground">Belum Diproses</p>
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
          {pembelian.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Belum ada data pembelian
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {pembelian.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            <span className="font-mono text-sm text-muted-foreground">#{item.order_id}</span>
                            <Badge variant={item.proses ? "default" : "secondary"}>
                              {item.proses ? 'Sedang Diproses' : 'Belum Diproses'}
                            </Badge>
                            {item.status && (
                              <Badge variant="outline">
                                {item.status}
                              </Badge>
                            )}
                          </div>
                         
                         <div className="flex items-center gap-2 text-sm">
                           <User className="h-4 w-4 text-muted-foreground" />
                           <span className="font-medium">{item.nama_penerima || 'Belum diisi'}</span>
                         </div>
                         
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <ShoppingCart className="h-4 w-4" />
                           <span>{item.no_hp_penerima || 'No HP belum diisi'}</span>
                         </div>
                         
                         <div className="flex items-start gap-2 text-sm text-muted-foreground">
                           <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                           <span>{item.alamat_penerima || 'Alamat belum diisi'}</span>
                         </div>
                       </div>
                       
                        <div className="text-right space-y-2">
                         <div className="flex items-center gap-2">
                           <Settings className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm">Status Proses:</span>
                           <Switch
                             checked={item.proses}
                             onCheckedChange={(checked) => updateProses(item.order_id, checked)}
                           />
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-muted/20 p-6 rounded-lg border-l-4 border-l-primary">
                       <h4 className="text-lg font-semibold mb-4 text-foreground">Ringkasan Pembelian</h4>
                       <div className="bg-background p-4 rounded-md border max-h-96 overflow-y-auto">
                         <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                           {item.ringkasan || 'Tidak ada ringkasan'}
                         </pre>
                       </div>
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