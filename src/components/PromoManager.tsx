import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Promo {
  kategori: string;
  product_id: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  created_at?: string;
  updated_at?: string;
}

const PromoManager = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    kategori: '',
    product_id: '',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const { data, error } = await supabase
        .from('Promo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromos(data || []);
    } catch (error) {
      console.error('Error fetching promos:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data promo",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      kategori: '',
      product_id: '',
      deskripsi: '',
      tanggal_mulai: '',
      tanggal_selesai: ''
    });
    setEditingPromo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promoData = {
        ...formData,
        tanggal_mulai: new Date(formData.tanggal_mulai).toISOString(),
        tanggal_selesai: new Date(formData.tanggal_selesai).toISOString(),
      };

      if (editingPromo) {
        const { error } = await supabase
          .from('Promo')
          .update({ ...promoData, updated_at: new Date().toISOString() })
          .eq('kategori', editingPromo.kategori)
          .eq('product_id', editingPromo.product_id);

        if (error) throw error;

        toast({
          title: "Sukses",
          description: "Promo berhasil diperbarui"
        });
      } else {
        const { error } = await supabase
          .from('Promo')
          .insert(promoData);

        if (error) throw error;

        toast({
          title: "Sukses", 
          description: "Promo berhasil ditambahkan"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPromos();
    } catch (error) {
      console.error('Error saving promo:', error);
      toast({
        title: "Error",
        description: `Gagal ${editingPromo ? 'memperbarui' : 'menambahkan'} promo`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setFormData({
      kategori: promo.kategori || '',
      product_id: promo.product_id || '',
      deskripsi: promo.deskripsi || '',
      tanggal_mulai: promo.tanggal_mulai ? new Date(promo.tanggal_mulai).toISOString().split('T')[0] : '',
      tanggal_selesai: promo.tanggal_selesai ? new Date(promo.tanggal_selesai).toISOString().split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (kategori: string, product_id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus promo ini?')) return;

    try {
      const { error } = await supabase
        .from('Promo')
        .delete()
        .eq('kategori', kategori)
        .eq('product_id', product_id);

      if (error) throw error;

      toast({
        title: "Sukses",
        description: "Promo berhasil dihapus"
      });
      fetchPromos();
    } catch (error) {
      console.error('Error deleting promo:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus promo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manajemen Promo</CardTitle>
            <CardDescription>Kelola promo dan penawaran khusus</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Promo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromo ? 'Edit Promo' : 'Tambah Promo Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingPromo ? 'Perbarui informasi promo' : 'Masukkan detail promo baru'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kategori">Kategori</Label>
                      <Input
                        id="kategori"
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                        placeholder="Contoh: Elektronik"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_id">Product ID</Label>
                      <Input
                        id="product_id"
                        value={formData.product_id}
                        onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                        placeholder="ID produk"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      placeholder="Deskripsi promo"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                      <Input
                        id="tanggal_mulai"
                        type="date"
                        value={formData.tanggal_mulai}
                        onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                      <Input
                        id="tanggal_selesai"
                        type="date"
                        value={formData.tanggal_selesai}
                        onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Menyimpan...' : (editingPromo ? 'Perbarui' : 'Simpan')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.map((promo, index) => (
              <TableRow key={`${promo.kategori}-${promo.product_id}-${index}`}>
                <TableCell className="font-medium">{promo.kategori}</TableCell>
                <TableCell>{promo.product_id}</TableCell>
                <TableCell>{promo.deskripsi || '-'}</TableCell>
                <TableCell>
                  {promo.tanggal_mulai ? new Date(promo.tanggal_mulai).toLocaleDateString('id-ID') : '-'}
                </TableCell>
                <TableCell>
                  {promo.tanggal_selesai ? new Date(promo.tanggal_selesai).toLocaleDateString('id-ID') : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(promo.kategori, promo.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {promos.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            Belum ada promo yang ditambahkan
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromoManager;