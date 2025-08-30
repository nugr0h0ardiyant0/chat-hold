import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StyleCSManager = () => {
  const [promptData, setPromptData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    gaya_bahasa: '',
    informasi_tambahan: ''
  });

  useEffect(() => {
    fetchPromptData();
  }, []);

  const fetchPromptData = async () => {
    try {
      // Using type assertion until AIPrompt table is created
      const { data, error } = await (supabase as any)
        .from('AIPrompt')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      setPromptData(data);
      if (data) {
        setFormData({
          gaya_bahasa: data.gaya_bahasa || '',
          informasi_tambahan: data.informasi_tambahan || ''
        });
      }
    } catch (error) {
      console.error('Error fetching prompt data:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data Style CS",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      gaya_bahasa: promptData?.gaya_bahasa || '',
      informasi_tambahan: promptData?.informasi_tambahan || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        gaya_bahasa: formData.gaya_bahasa,
        informasi_tambahan: formData.informasi_tambahan,
      };

      if (promptData) {
        const { error } = await (supabase as any)
          .from('AIPrompt')
          .update(dataToSave)
          .eq('id', promptData.id);

        if (error) throw error;

        toast({
          title: "Sukses",
          description: "Style CS berhasil diperbarui"
        });
      } else {
        const { error } = await (supabase as any)
          .from('AIPrompt')
          .insert(dataToSave);

        if (error) throw error;

        toast({
          title: "Sukses",
          description: "Style CS berhasil dibuat"
        });
      }

      setIsDialogOpen(false);
      fetchPromptData();
    } catch (error) {
      console.error('Error saving Style CS:', error);
      toast({
        title: "Error",
        description: `Gagal ${promptData ? 'memperbarui' : 'membuat'} Style CS`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const canEdit = userProfile?.role === 'admin' || userProfile?.role === 'operator';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Style CS</CardTitle>
            <CardDescription>Kelola gaya bahasa dan informasi tambahan untuk AI Customer Service</CardDescription>
          </div>
          {canEdit && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openEditDialog}>
                  {promptData ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {promptData ? 'Edit Style CS' : 'Buat Style CS'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {promptData ? 'Edit Style CS' : 'Buat Style CS Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    Atur gaya bahasa dan informasi tambahan untuk AI Customer Service
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="gaya_bahasa">Gaya Bahasa</Label>
                      <Textarea
                        id="gaya_bahasa"
                        value={formData.gaya_bahasa}
                        onChange={(e) => setFormData({...formData, gaya_bahasa: e.target.value})}
                        placeholder="Contoh: Gunakan bahasa yang ramah dan profesional, hindari kata-kata kasar..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="informasi_tambahan">Informasi Tambahan</Label>
                      <Textarea
                        id="informasi_tambahan"
                        value={formData.informasi_tambahan}
                        onChange={(e) => setFormData({...formData, informasi_tambahan: e.target.value})}
                        placeholder="Informasi tambahan yang perlu diketahui AI..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Menyimpan...' : (promptData ? 'Perbarui' : 'Simpan')}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {promptData ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Gaya Bahasa</h4>
              <div className="p-4 bg-muted/30 rounded-lg border">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {promptData.gaya_bahasa || 'Belum diatur'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Informasi Tambahan</h4>
              <div className="p-4 bg-muted/30 rounded-lg border">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {promptData.informasi_tambahan || 'Belum diatur'}
                </p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Terakhir diperbarui: {new Date(promptData.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Edit className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-2">Belum ada Style CS</h3>
              <p className="text-sm">Buat style CS untuk mengatur gaya bahasa AI Customer Service</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StyleCSManager;