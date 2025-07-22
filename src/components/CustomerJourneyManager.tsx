import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Phone, 
  MessageSquare,
  Clock,
  Users
} from 'lucide-react';

interface CustomerJourney {
  id: number;
  phone_number: string | null;
  customer_journey: string;
  follow_up: boolean;
  message: string | null;
  message_id: string | null;
  session: string | null;
  created_at: string;
  updated_at: string | null;
}

const CustomerJourneyManager = () => {
  const [journeys, setJourneys] = useState<CustomerJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJourney, setEditingJourney] = useState<CustomerJourney | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [metrics, setMetrics] = useState({
    totalJourneys: 0,
    needFollowUp: 0,
    uniqueCustomers: 0
  });

  const [formData, setFormData] = useState({
    phone_number: '',
    customer_journey: 'pelanggan_tanya',
    follow_up: false,
    message: '',
    message_id: '',
    session: ''
  });

  const journeyTypes = [
    'pelanggan_tanya',
    'pelanggan_tertarik',
    'pelanggan_nego',
    'pelanggan_beli',
    'pelanggan_komplain',
    'pelanggan_follow_up'
  ];

  useEffect(() => {
    fetchJourneys();
    fetchMetrics();
  }, []);

  const fetchJourneys = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_customer_journeys');

      if (error) throw error;
      setJourneys(data || []);
    } catch (error) {
      console.error('Error fetching customer journeys:', error);
      toast.error('Gagal memuat data customer journey');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data: allJourneys } = await supabase
        .rpc('get_customer_journeys');

      if (allJourneys) {
        const uniquePhones = new Set(allJourneys.map(j => j.phone_number).filter(Boolean));
        const needFollowUp = allJourneys.filter(j => j.follow_up).length;

        setMetrics({
          totalJourneys: allJourneys.length,
          needFollowUp,
          uniqueCustomers: uniquePhones.size
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJourney) {
        const { error } = await supabase
          .rpc('update_customer_journey', {
            journey_id: editingJourney.id,
            p_phone_number: formData.phone_number,
            p_customer_journey: formData.customer_journey,
            p_follow_up: formData.follow_up,
            p_message: formData.message,
            p_message_id: formData.message_id,
            p_session: formData.session
          });

        if (error) throw error;
        toast.success('Customer journey berhasil diperbarui');
      } else {
        const { error } = await supabase
          .rpc('create_customer_journey', {
            p_phone_number: formData.phone_number,
            p_customer_journey: formData.customer_journey,
            p_follow_up: formData.follow_up,
            p_message: formData.message,
            p_message_id: formData.message_id,
            p_session: formData.session
          });

        if (error) throw error;
        toast.success('Customer journey berhasil ditambahkan');
      }

      resetForm();
      fetchJourneys();
      fetchMetrics();
    } catch (error) {
      console.error('Error saving customer journey:', error);
      toast.error('Gagal menyimpan customer journey');
    }
  };

  const handleEdit = (journey: CustomerJourney) => {
    setEditingJourney(journey);
    setFormData({
      phone_number: journey.phone_number || '',
      customer_journey: journey.customer_journey,
      follow_up: journey.follow_up,
      message: journey.message || '',
      message_id: journey.message_id || '',
      session: journey.session || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus customer journey ini?')) return;

    try {
      const { error } = await supabase
        .from('CustomerJourney')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Customer journey berhasil dihapus');
      fetchJourneys();
      fetchMetrics();
    } catch (error) {
      console.error('Error deleting customer journey:', error);
      toast.error('Gagal menghapus customer journey');
    }
  };

  const resetForm = () => {
    setFormData({
      phone_number: '',
      customer_journey: 'pelanggan_tanya',
      follow_up: false,
      message: '',
      message_id: '',
      session: ''
    });
    setEditingJourney(null);
    setShowAddForm(false);
  };

  const filteredJourneys = journeys.filter(journey =>
    journey.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journey.customer_journey.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journey.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getJourneyBadgeColor = (journey: string) => {
    switch (journey) {
      case 'pelanggan_tanya': return 'bg-blue-100 text-blue-800';
      case 'pelanggan_tertarik': return 'bg-green-100 text-green-800';
      case 'pelanggan_nego': return 'bg-yellow-100 text-yellow-800';
      case 'pelanggan_beli': return 'bg-emerald-100 text-emerald-800';
      case 'pelanggan_komplain': return 'bg-red-100 text-red-800';
      case 'pelanggan_follow_up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data customer journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Journey</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalJourneys}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Perlu Follow Up</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.needFollowUp}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Customers</p>
                <p className="text-2xl font-bold text-green-600">{metrics.uniqueCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Manajemen Customer Journey
              </CardTitle>
              <CardDescription>
                Kelola dan pantau perjalanan pelanggan dalam sistem
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Journey
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingJourney ? 'Edit Customer Journey' : 'Tambah Customer Journey'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Nomor Telepon</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="08123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_journey">Tahap Journey</Label>
                  <Select 
                    value={formData.customer_journey} 
                    onValueChange={(value) => setFormData({ ...formData, customer_journey: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahap journey" />
                    </SelectTrigger>
                    <SelectContent>
                      {journeyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').replace('pelanggan', 'Pelanggan')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message_id">Message ID</Label>
                  <Input
                    id="message_id"
                    value={formData.message_id}
                    onChange={(e) => setFormData({ ...formData, message_id: e.target.value })}
                    placeholder="Message ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Input
                    id="session"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    placeholder="Session ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Pesan</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Isi pesan..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="follow_up"
                  checked={formData.follow_up}
                  onCheckedChange={(checked) => setFormData({ ...formData, follow_up: checked })}
                />
                <Label htmlFor="follow_up">Perlu Follow Up</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingJourney ? 'Update' : 'Tambah'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nomor telepon, tahap journey, atau pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Journey List */}
      <div className="grid gap-4">
        {filteredJourneys.map((journey) => (
          <Card key={journey.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{journey.phone_number || 'Tidak ada nomor'}</span>
                    <Badge className={getJourneyBadgeColor(journey.customer_journey)}>
                      {journey.customer_journey.replace('_', ' ').replace('pelanggan', 'Pelanggan')}
                    </Badge>
                    {journey.follow_up && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Follow Up
                      </Badge>
                    )}
                  </div>
                  
                  {journey.message && (
                    <p className="text-sm text-muted-foreground">{journey.message}</p>
                  )}
                  
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Session: {journey.session || '-'}</span>
                    <span>Message ID: {journey.message_id || '-'}</span>
                    <span>Created: {new Date(journey.created_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(journey)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(journey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJourneys.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Tidak ada customer journey yang sesuai dengan pencarian' : 'Belum ada customer journey'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerJourneyManager;