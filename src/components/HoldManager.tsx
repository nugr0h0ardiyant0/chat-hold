import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Plus, RefreshCw, Shield, ShieldOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  phone_number: string;
  is_hold: boolean;
  created_at: string;
  updated_at: string;
  last_message: string | null;
}

export default function HoldManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive",
      });
      console.error('Error fetching users:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const addToHold = async () => {
    if (!newPhoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor telepon tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('User')
        .upsert([
          {
            phone_number: newPhoneNumber.trim(),
            is_hold: true,
            updated_at: new Date().toISOString(),
          }
        ], {
          onConflict: 'phone_number'
        });

      if (error) throw error;

      setNewPhoneNumber("");
      toast({
        title: "Berhasil",
        description: "Nomor berhasil ditambahkan ke daftar hold",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan nomor ke daftar hold",
        variant: "destructive",
      });
      console.error('Error adding to hold:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHoldStatus = async (phoneNumber: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('User')
        .update({
          is_hold: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('phone_number', phoneNumber);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Status hold ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status hold",
        variant: "destructive",
      });
      console.error('Error toggling hold status:', error);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'User'
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const heldUsers = users.filter(user => user.is_hold);
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Pengelola Responder WhatsApp
          </h1>
          <p className="text-muted-foreground">
            Kelola nomor telepon yang harus diblokir dari menerima respons WhatsApp
            otomatis. Tambahkan nomor ke daftar hold untuk mencegah respons bot.
          </p>
        </div>

        {/* Add New Hold Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Nomor Hold Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Nomor Telepon
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="contoh: 6281234567890"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToHold()}
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Alasan
                </label>
                <div className="text-sm text-muted-foreground">
                  Spam, konten tidak pantas
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <Button 
                  onClick={addToHold}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  Tambah ke Daftar Hold
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hold List Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Daftar Hold ({heldUsers.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Tidak ada nomor dalam daftar hold
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tambahkan nomor sekarang untuk memulai
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.phone_number}
                    className={`p-4 rounded-lg border transition-colors ${
                      user.is_hold 
                        ? 'bg-holdCard border-warning' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">
                            {user.phone_number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Terakhir diperbarui: {new Date(user.updated_at).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={user.is_hold ? "destructive" : "secondary"}
                          className="gap-1"
                        >
                          {user.is_hold ? (
                            <>
                              <ShieldOff className="h-3 w-3" />
                              ON HOLD
                            </>
                          ) : (
                            <>
                              <Shield className="h-3 w-3" />
                              ACTIVE
                            </>
                          )}
                        </Badge>
                        <Button
                          variant={user.is_hold ? "default" : "destructive"}
                          size="sm"
                          onClick={() => toggleHoldStatus(user.phone_number, user.is_hold)}
                          className="gap-2"
                        >
                          {user.is_hold ? (
                            <>
                              <Shield className="h-4 w-4" />
                              Release Hold
                            </>
                          ) : (
                            <>
                              <ShieldOff className="h-4 w-4" />
                              Place Hold
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
              <p className="text-sm text-muted-foreground">Total Nomor</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-warning">{heldUsers.length}</div>
              <p className="text-sm text-muted-foreground">Sedang Hold</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">{totalUsers - heldUsers.length}</div>
              <p className="text-sm text-muted-foreground">Aktif</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}