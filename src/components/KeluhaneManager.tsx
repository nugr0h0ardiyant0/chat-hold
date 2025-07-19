import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Keluhan {
  id: string;
  Nomor_Pelanggan: number | null;
  Nama_Pelanggan: string | null;
  Keluhan: string | null;
  sudah_ditangani: boolean;
  Datetime: string;
}

const KeluhaneManager = () => {
  const [keluhanList, setKeluhanList] = useState<Keluhan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchKeluhan = async () => {
    try {
      const { data, error } = await supabase
        .from('Keluhan')
        .select('*')
        .order('Datetime', { ascending: false });

      if (error) throw error;
      setKeluhanList(data || []);
    } catch (error) {
      console.error('Error fetching keluhan:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data keluhan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('Keluhan')
        .update({ sudah_ditangani: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Keluhan berhasil ditandai sebagai ${!currentStatus ? 'sudah ditangani' : 'belum ditangani'}`,
      });

      fetchKeluhan();
    } catch (error) {
      console.error('Error updating keluhan status:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status keluhan",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchKeluhan();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Memuat data keluhan...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Manajemen Keluhan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keluhanList.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada keluhan yang ditemukan
            </div>
          ) : (
            keluhanList.map((keluhan) => (
              <Card key={keluhan.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">No. Pelanggan:</span>
                        <span className="text-sm bg-muted px-2 py-1 rounded">
                          {keluhan.Nomor_Pelanggan}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Nama:</span>
                        <span>{keluhan.Nama_Pelanggan}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(keluhan.Datetime).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={keluhan.sudah_ditangani ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {keluhan.sudah_ditangani ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Sudah Ditangani
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Belum Ditangani
                          </>
                        )}
                      </Badge>
                      <Button
                        size="sm"
                        variant={keluhan.sudah_ditangani ? "outline" : "default"}
                        onClick={() => handleToggleStatus(keluhan.id, keluhan.sudah_ditangani)}
                      >
                        {keluhan.sudah_ditangani ? 'Tandai Belum' : 'Tandai Selesai'}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium">Keluhan:</span>
                    <p className="mt-1 text-sm bg-muted p-3 rounded">
                      {keluhan.Keluhan}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeluhaneManager;