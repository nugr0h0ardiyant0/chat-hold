import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  product_id: number;
  nama: string;
  deskripsi: string;
  kategori: string;
  harga: number;
  stok: number;
  berat: number;
  ukuran: string;
  warna: string;
  created_at: string;
  updated_at: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    kategori: '',
    harga: '',
    stok: '',
    berat: '',
    ukuran: '',
    warna: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('Produk')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data produk",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      deskripsi: '',
      kategori: '',
      harga: '',
      stok: '',
      berat: '',
      ukuran: '',
      warna: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        kategori: formData.kategori,
        harga: parseFloat(formData.harga),
        stok: parseInt(formData.stok),
        berat: parseFloat(formData.berat),
        ukuran: formData.ukuran,
        warna: formData.warna,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('Produk')
          .update({ ...productData, updated_at: new Date().toISOString() })
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Sukses",
          description: "Produk berhasil diperbarui"
        });
      } else {
        const { error } = await supabase
          .from('Produk')
          .insert(productData as any);

        if (error) throw error;

        toast({
          title: "Sukses",
          description: "Produk berhasil ditambahkan"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Gagal ${editingProduct ? 'memperbarui' : 'menambahkan'} produk`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nama: product.nama,
      deskripsi: product.deskripsi || '',
      kategori: product.kategori || '',
      harga: product.harga?.toString() || '',
      stok: product.stok?.toString() || '',
      berat: product.berat?.toString() || '',
      ukuran: product.ukuran || '',
      warna: product.warna || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      const { error } = await supabase
        .from('Produk')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sukses",
        description: "Produk berhasil dihapus"
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus produk",
        variant: "destructive"
      });
    }
  };

  // Check permissions
  const canDelete = userProfile?.role === 'admin';
  const canEdit = userProfile?.role === 'admin' || userProfile?.role === 'operator';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manajemen Produk</CardTitle>
            <CardDescription>Kelola produk dan inventori</CardDescription>
          </div>
          {canEdit && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct ? 'Perbarui informasi produk' : 'Masukkan detail produk baru'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Produk *</Label>
                        <Input
                          id="nama"
                          value={formData.nama}
                          onChange={(e) => setFormData({...formData, nama: e.target.value})}
                          placeholder="Nama produk"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="kategori">Kategori</Label>
                        <Input
                          id="kategori"
                          value={formData.kategori}
                          onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                          placeholder="Kategori produk"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Deskripsi</Label>
                      <Textarea
                        id="deskripsi"
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                        placeholder="Deskripsi produk"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="harga">Harga (Rp)</Label>
                        <Input
                          id="harga"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.harga}
                          onChange={(e) => setFormData({...formData, harga: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stok">Stok</Label>
                        <Input
                          id="stok"
                          type="number"
                          min="0"
                          value={formData.stok}
                          onChange={(e) => setFormData({...formData, stok: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="berat">Berat (gram)</Label>
                        <Input
                          id="berat"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.berat}
                          onChange={(e) => setFormData({...formData, berat: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ukuran">Ukuran</Label>
                        <Input
                          id="ukuran"
                          value={formData.ukuran}
                          onChange={(e) => setFormData({...formData, ukuran: e.target.value})}
                          placeholder="S, M, L, XL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="warna">Warna</Label>
                        <Input
                          id="warna"
                          value={formData.warna}
                          onChange={(e) => setFormData({...formData, warna: e.target.value})}
                          placeholder="Merah, Biru, dll"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Menyimpan...' : (editingProduct ? 'Perbarui' : 'Simpan')}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Ukuran</TableHead>
              <TableHead>Warna</TableHead>
              {canEdit && <TableHead>Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.nama}</TableCell>
                <TableCell>{product.kategori || '-'}</TableCell>
                <TableCell>
                  {product.harga ? `Rp ${product.harga.toLocaleString('id-ID')}` : '-'}
                </TableCell>
                <TableCell>{product.stok || 0}</TableCell>
                <TableCell>{product.ukuran || '-'}</TableCell>
                <TableCell>{product.warna || '-'}</TableCell>
                {canEdit && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            Belum ada produk yang ditambahkan
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductManager;