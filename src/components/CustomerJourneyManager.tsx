import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, RefreshCw, Clock, Phone, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerJourney {
  id: number;
  phone_number: string;
  customer_journey: string;
  follow_up: boolean;
  message: string;
  updated_at: string;
}

const CustomerJourneyManager = () => {
  const [journeys, setJourneys] = useState<CustomerJourney[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    followUp: 0,
    pelangganTanya: 0,
    masukKeranjang: 0,
    inisiasiPayment: 0,
    invoiceGagal: 0,
    sudahBayar: 0,
    keluhan: 0
  });
  const { toast } = useToast();

  const fetchJourneys = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .rpc('get_customer_journeys');

      if (error) throw error;
      
      setJourneys(data || []);
      
      // Calculate summary - follow_up FALSE means needs follow up
      const total = data?.length || 0;
      const followUp = data?.filter(j => !j.follow_up).length || 0; // Count FALSE as needing follow up
      const stages = data?.reduce((acc: any, journey: any) => {
        acc[journey.customer_journey] = (acc[journey.customer_journey] || 0) + 1;
        return acc;
      }, {}) || {};

      setSummary({
        total,
        followUp,
        pelangganTanya: stages.pelanggan_tanya || 0,
        masukKeranjang: stages.masuk_keranjang || 0,
        inisiasiPayment: stages.inisiasi_payment_belum_bayar || 0,
        invoiceGagal: stages.invoice_gagal_bayar || 0,
        sudahBayar: stages.sudah_bayar || 0,
        keluhan: stages.keluhan || 0
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data customer journey",
        variant: "destructive",
      });
      console.error('Error fetching journeys:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleFollowUp = async (journeyId: number, currentFollowUp: boolean) => {
    try {
      const { error } = await supabase
        .rpc('update_customer_journey_followup', {
          journey_id: journeyId,
          new_follow_up: !currentFollowUp
        });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: currentFollowUp ? "Follow up diaktifkan" : "Follow up dinonaktifkan",
        duration: 2000, // 2 detik
      });
      fetchJourneys();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status follow up",
        variant: "destructive",
      });
      console.error('Error toggling follow up:', error);
    }
  };

  const updateCustomerJourney = async (journeyId: number, newStage: string) => {
    try {
      const { error } = await supabase
        .from('CustomerJourney')
        .update({ customer_journey: newStage, updated_at: new Date().toISOString() })
        .eq('id', journeyId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Status customer journey berhasil diupdate",
      });
      fetchJourneys();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate customer journey",
        variant: "destructive",
      });
      console.error('Error updating customer journey:', error);
    }
  };

  useEffect(() => {
    fetchJourneys();

    // Set up real-time subscription
    const channel = supabase
      .channel('customer-journey-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'CustomerJourney'
        },
        () => {
          fetchJourneys();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'pelanggan_tanya': return 'bg-blue-100 text-blue-800';
      case 'masuk_keranjang': return 'bg-yellow-100 text-yellow-800';
      case 'inisiasi_payment_belum_bayar': return 'bg-orange-100 text-orange-800';
      case 'invoice_gagal_bayar': return 'bg-red-100 text-red-800';
      case 'sudah_bayar': return 'bg-green-100 text-green-800';
      case 'keluhan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStage = (stage: string) => {
    switch (stage) {
      case 'pelanggan_tanya': return 'Pelanggan Tanya';
      case 'masuk_keranjang': return 'Masuk Keranjang';
      case 'inisiasi_payment_belum_bayar': return 'Inisiasi Payment';
      case 'invoice_gagal_bayar': return 'Invoice Gagal';
      case 'sudah_bayar': return 'Sudah Bayar';
      case 'keluhan': return 'Keluhan';
      default: return stage;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Journey</h1>
          <p className="text-muted-foreground">
            Tracking perjalanan dan interaksi pelanggan
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchJourneys}
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
            <p className="text-sm text-muted-foreground">Total Journey</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{summary.followUp}</div>
            <p className="text-sm text-muted-foreground">Perlu Follow Up</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{summary.sudahBayar}</div>
            <p className="text-sm text-muted-foreground">Sudah Bayar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{summary.keluhan}</div>
            <p className="text-sm text-muted-foreground">Keluhan</p>
          </CardContent>
        </Card>
      </div>

      {/* Journey List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Data Customer Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          {journeys.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Belum ada data customer journey
              </h3>
            </div>
          ) : (
            <div className="space-y-3">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className="p-4 rounded-lg border bg-card"
                >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-medium">{journey.phone_number}</span>
                          <Badge className={getStageColor(journey.customer_journey)}>
                            {formatStage(journey.customer_journey)}
                          </Badge>
                          {!journey.follow_up && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Perlu Follow Up
                            </Badge>
                          )}
                          {journey.follow_up && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Follow Up Selesai
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p><span className="font-medium">Message:</span> {journey.message || '-'}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Status:</span>
                          <Select
                            value={journey.customer_journey}
                            onValueChange={(value) => updateCustomerJourney(journey.id, value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pelanggan_tanya">Pelanggan Tanya</SelectItem>
                              <SelectItem value="masuk_keranjang">Masuk Keranjang</SelectItem>
                              <SelectItem value="keluhan">Keluhan</SelectItem>
                              <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                              <SelectItem value="inisiasi_payment_belum_bayar">Inisiasi Payment Belum Bayar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Updated: {new Date(journey.updated_at).toLocaleString('id-ID')}
                        </div>
                      </div>
                      
                      <Button
                        variant={journey.follow_up ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFollowUp(journey.id, journey.follow_up)}
                        className="gap-2"
                      >
                        {journey.follow_up ? 'Selesai Follow Up' : 'Butuh Follow Up'}
                      </Button>
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

export default CustomerJourneyManager;