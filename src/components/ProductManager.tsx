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
  produk_id: number;
  item_id: number;
  item_name: string;
  item_description: string;
  item_code: string;
  item_price: number;
  item_stok_available: number;
  item_weight: number;
  item_variations: string;
  item_image: string;
  created_at: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Products are read-only - no editing functionality

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Produk</CardTitle>
            <CardDescription>Lihat daftar produk (read-only)</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            disabled={loading}
            className="gap-2"
          >
            <Plus className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Produk</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Variasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.produk_id}>
                <TableCell className="font-mono text-sm">{product.item_id}</TableCell>
                <TableCell className="font-medium">{product.item_name || '-'}</TableCell>
                <TableCell className="font-mono text-sm">{product.item_code || '-'}</TableCell>
                <TableCell>
                  {product.item_price ? `Rp ${product.item_price.toLocaleString('id-ID')}` : '-'}
                </TableCell>
                <TableCell>{product.item_stok_available || 0}</TableCell>
                <TableCell>{product.item_weight ? `${product.item_weight}g` : '-'}</TableCell>
                <TableCell>{product.item_variations || '-'}</TableCell>
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