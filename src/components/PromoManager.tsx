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
  promo_id: number;
  promo_name: string;
  discount_amount: number;
  min_spending: number;
  valid_from: string;
  valid_to?: string | null;
  applicable_item_id?: number | null;
  is_active: boolean;
}

const PromoManager = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    promo_name: '',
    discount_amount: '',
    min_spending: '',
    valid_from: '',
    valid_to: '',
    applicable_item_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const { data, error } = await supabase
        .from('Promo')
        .select('*')
        .order('valid_from', { ascending: false });

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
      promo_name: '',
      discount_amount: '',
      min_spending: '',
      valid_from: '',
      valid_to: '',
      applicable_item_id: '',
      is_active: true
    });
    setEditingPromo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promoData = {
        promo_name: formData.promo_name,
        discount_amount: parseFloat(formData.discount_amount),
        min_spending: parseFloat(formData.min_spending),
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_to: formData.valid_to ? new Date(formData.valid_to).toISOString() : null,
        applicable_item_id: formData.applicable_item_id ? parseInt(formData.applicable_item_id) : null,
        is_active: formData.is_active,
      };

      if (editingPromo) {
        const { error } = await (supabase as any)
          .from('Promo')
          .update(promoData)
          .eq('promo_id', editingPromo.promo_id);

        if (error) throw error;

        toast({
          title: "Sukses",
          description: "Promo berhasil diperbarui"
        });
      } else {
        const { error } = await (supabase as any)
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

  const handleEdit = (promo: any) => {
    setEditingPromo(promo);
    setFormData({
      promo_name: promo.promo_name || '',
      discount_amount: promo.discount_amount?.toString() || '',
      min_spending: promo.min_spending?.toString() || '',
      valid_from: promo.valid_from ? new Date(promo.valid_from).toISOString().split('T')[0] : '',
      valid_to: promo.valid_to ? new Date(promo.valid_to).toISOString().split('T')[0] : '',
      applicable_item_id: promo.applicable_item_id?.toString() || '',
      is_active: promo.is_active ?? true
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (promo_id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus promo ini?')) return;

    try {
      const { error } = await (supabase as any)
        .from('Promo')
        .delete()
        .eq('promo_id', promo_id);

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
                  <div className="space-y-2">
                    <Label htmlFor="promo_name">Nama Promo</Label>
                    <Input
                      id="promo_name"
                      value={formData.promo_name}
                      onChange={(e) => setFormData({...formData, promo_name: e.target.value})}
                      placeholder="Contoh: Diskon Akhir Tahun"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount_amount">Jumlah Diskon</Label>
                      <Input
                        id="discount_amount"
                        type="number"
                        value={formData.discount_amount}
                        onChange={(e) => setFormData({...formData, discount_amount: e.target.value})}
                        placeholder="50000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min_spending">Minimum Pembelian</Label>
                      <Input
                        id="min_spending"
                        type="number"
                        value={formData.min_spending}
                        onChange={(e) => setFormData({...formData, min_spending: e.target.value})}
                        placeholder="100000"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicable_item_id">ID Item (Opsional)</Label>
                    <Input
                      id="applicable_item_id"
                      type="number"
                      value={formData.applicable_item_id}
                      onChange={(e) => setFormData({...formData, applicable_item_id: e.target.value})}
                      placeholder="ID item spesifik (kosongkan untuk semua item)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valid_from">Tanggal Mulai</Label>
                      <Input
                        id="valid_from"
                        type="date"
                        value={formData.valid_from}
                        onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valid_to">Tanggal Selesai</Label>
                      <Input
                        id="valid_to"
                        type="date"
                        value={formData.valid_to}
                        onChange={(e) => setFormData({...formData, valid_to: e.target.value})}
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
              <TableHead>Nama Promo</TableHead>
              <TableHead>Diskon</TableHead>
              <TableHead>Min. Pembelian</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.map((promo: any) => (
              <TableRow key={promo.promo_id}>
                <TableCell className="font-medium">{promo.promo_name}</TableCell>
                <TableCell>Rp {promo.discount_amount?.toLocaleString('id-ID')}</TableCell>
                <TableCell>Rp {promo.min_spending?.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  {promo.valid_from ? new Date(promo.valid_from).toLocaleDateString('id-ID') : '-'}
                </TableCell>
                <TableCell>
                  {promo.valid_to ? new Date(promo.valid_to).toLocaleDateString('id-ID') : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {promo.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </span>
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
                      onClick={() => handleDelete(promo.promo_id)}
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