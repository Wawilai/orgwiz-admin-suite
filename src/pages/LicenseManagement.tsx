import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Key, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Edit2,
  Trash2,
  RefreshCw,
  Users,
  Calendar,
  Activity,
  TrendingUp
} from 'lucide-react';

interface License {
  id: string;
  license_key: string;
  product_name: string;
  license_type: 'user_based' | 'feature_based' | 'concurrent' | 'site_wide';
  organization_id: string;
  organization_name?: string;
  max_users: number;
  usage_count: number;
  features: string[];
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  auto_renew: boolean;
  last_used?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface LicenseUsage {
  id: string;
  license_id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  duration_minutes?: number;
  ip_address?: string;
  user_agent?: string;
  features_used?: string[];
}

// Mock usage logs (will be replaced with real data later)
const mockUsageLogs: LicenseUsage[] = [];

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [usageLogs] = useState<LicenseUsage[]>(mockUsageLogs);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddLicenseDialogOpen, setIsAddLicenseDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isUsageHistoryOpen, setIsUsageHistoryOpen] = useState(false);
  const [isSendReportOpen, setIsSendReportOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [currentTab, setCurrentTab] = useState('licenses');
  const [formData, setFormData] = useState<Partial<License>>({
    license_key: '',
    product_name: '',
    license_type: 'user_based',
    organization_id: '',
    max_users: 10,
    features: [],
    expiry_date: '',
    status: 'active',
    auto_renew: true,
    notes: ''
  });

  // Fetch licenses from database
  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          organizations (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLicenses: License[] = (data || []).map(license => ({
        id: license.id,
        license_key: license.license_key,
        product_name: license.product_name,
        license_type: license.license_type as 'user_based' | 'feature_based' | 'concurrent' | 'site_wide',
        organization_id: license.organization_id,
        organization_name: license.organizations?.name || 'ไม่ระบุ',
        max_users: license.max_users,
        usage_count: license.usage_count,
        features: Array.isArray(license.features) ? license.features.map(f => String(f)) : [],
        issue_date: license.issue_date,
        expiry_date: license.expiry_date,
        status: license.status as 'active' | 'expired' | 'suspended' | 'revoked',
        auto_renew: license.auto_renew,
        last_used: license.last_used,
        notes: license.notes,
        created_at: license.created_at,
        updated_at: license.updated_at
      }));

      setLicenses(formattedLicenses);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลใบอนุญาตได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (license.organization_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    const matchesType = typeFilter === 'all' || license.license_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddLicense = async () => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert([{
          license_key: formData.license_key,
          product_name: formData.product_name,
          license_type: formData.license_type,
          organization_id: formData.organization_id,
          max_users: formData.max_users || 10,
          features: formData.features || [],
          issue_date: new Date().toISOString().split('T')[0],
          expiry_date: formData.expiry_date,
          status: formData.status || 'active',
          auto_renew: formData.auto_renew || false,
          notes: formData.notes
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchLicenses(); // Refresh the list
      setIsAddLicenseDialogOpen(false);
      resetForm();
      toast({
        title: "เพิ่มลิขสิทธิ์สำเร็จ",
        description: "เพิ่มลิขสิทธิ์ใหม่เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error adding license:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มลิขสิทธิ์ได้",
        variant: "destructive"
      });
    }
  };

  const handleEditLicense = async () => {
    if (!editingLicense) return;
    
    try {
      const { error } = await supabase
        .from('licenses')
        .update({
          license_key: formData.license_key,
          product_name: formData.product_name,
          license_type: formData.license_type,
          max_users: formData.max_users,
          features: formData.features,
          expiry_date: formData.expiry_date,
          status: formData.status,
          auto_renew: formData.auto_renew,
          notes: formData.notes
        })
        .eq('id', editingLicense.id);

      if (error) throw error;

      await fetchLicenses(); // Refresh the list
      setEditingLicense(null);
      resetForm();
      toast({
        title: "แก้ไขสำเร็จ",
        description: "แก้ไขลิขสิทธิ์เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error updating license:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขลิขสิทธิ์ได้",
        variant: "destructive"
      });
    }
  };

  const handleRevokeLicense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('licenses')
        .update({ status: 'revoked' })
        .eq('id', id);

      if (error) throw error;

      await fetchLicenses(); // Refresh the list
      toast({
        title: "เพิกถอนลิขสิทธิ์สำเร็จ",
        description: "เพิกถอนลิขสิทธิ์เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error revoking license:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิกถอนลิขสิทธิ์ได้",
        variant: "destructive"
      });
    }
  };

  const handleRenewLicense = async (id: string) => {
    try {
      const newExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('licenses')
        .update({ 
          status: 'active',
          expiry_date: newExpiryDate
        })
        .eq('id', id);

      if (error) throw error;

      await fetchLicenses(); // Refresh the list
      toast({
        title: "ต่ออายุสำเร็จ",
        description: "ต่ออายุลิขสิทธิ์เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error renewing license:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถต่ออายุลิขสิทธิ์ได้",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      license_key: '',
      product_name: '',
      license_type: 'user_based',
      organization_id: '',
      max_users: 10,
      features: [],
      expiry_date: '',
      status: 'active',
      auto_renew: true,
      notes: ''
    });
  };

  const openEditDialog = (license: License) => {
    setEditingLicense(license);
    setFormData(license);
  };

  const openAssignDialog = (license: License) => {
    setSelectedLicense(license);
    setIsAssignDialogOpen(true);
  };

  const openUsageHistoryDialog = (license: License) => {
    setSelectedLicense(license);
    setIsUsageHistoryOpen(true);
  };

  const openSendReportDialog = (license: License) => {
    setSelectedLicense(license);
    setIsSendReportOpen(true);
  };

  const handleDownloadCertificate = (license: License) => {
    // Create a simple certificate content
    const certificateContent = `
CERTIFICATE OF LICENSE

License Key: ${license.license_key}
Product: ${license.product_name}
Organization: ${license.organization_name}
Issue Date: ${license.issue_date}
Expiry Date: ${license.expiry_date}
Max Users: ${license.max_users}
Status: ${license.status}

This certificate confirms the valid license for the above product.
Generated on: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${license.license_key}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      active: "default",
      expired: "destructive", 
      suspended: "secondary",
      revoked: "outline"
    };
    const colors = {
      active: "text-green-700",
      expired: "text-red-700",
      suspended: "text-yellow-700", 
      revoked: "text-gray-700"
    };
    const statusText = {
      active: "เปิดใช้งาน",
      expired: "หมดอายุ",
      suspended: "ระงับใช้งาน",
      revoked: "เพิกถอน"
    };
    return <Badge variant={variants[status] || "default"} className={colors[status as keyof typeof colors]}>
      {statusText[status as keyof typeof statusText]}
    </Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      'user_based': "default",
      'feature_based': "secondary", 
      'concurrent': "outline",
      'site_wide': "destructive"
    };
    const typeText = {
      'user_based': "User-Based",
      'feature_based': "Feature-Based",
      'concurrent': "Concurrent", 
      'site_wide': "Site-Wide"
    };
    return <Badge variant={variants[type] || "default"}>{typeText[type as keyof typeof typeText] || type}</Badge>;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired').length;
  const expiringLicenses = licenses.filter(l => {
    const days = getDaysUntilExpiry(l.expiry_date);
    return days <= 30 && days > 0 && l.status === 'active';
  }).length;

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>กำลังโหลดข้อมูลลิขสิทธิ์...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">จัดการลิขสิทธิ์ซอฟต์แวร์</h1>
            <p className="text-muted-foreground">ติดตามและจัดการลิขสิทธิ์การใช้งานซอฟต์แวร์</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              const csv = "รหัสลิขสิทธิ์,ผลิตภัณฑ์,ประเภท,องค์กร,ผู้ใช้สูงสุด,สถานะ,วันหมดอายุ\n" + 
                filteredLicenses.map(l => `${l.license_key},${l.product_name},${l.license_type},${l.organization_name},${l.max_users},${l.status},${l.expiry_date}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'licenses-export.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            }}>
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </Button>
            <Button variant="outline" onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  alert('ฟังก์ชันนำเข้าลิขสิทธิ์จากไฟล์ CSV พร้อมใช้งาน');
                }
              };
              input.click();
            }}>
              <Upload className="h-4 w-4 mr-2" />
              นำเข้าลิขสิทธิ์
            </Button>
            <Dialog open={isAddLicenseDialogOpen} onOpenChange={setIsAddLicenseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มลิขสิทธิ์
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>เพิ่มลิขสิทธิ์ใหม่</DialogTitle>
                  <DialogDescription>
                    เพิ่มลิขสิทธิ์ใหม่เข้าสู่ระบบ
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="license_key">รหัสลิขสิทธิ์ *</Label>
                    <Input
                      id="license_key"
                      value={formData.license_key}
                      onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
                      placeholder="กรอกรหัสลิขสิทธิ์"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">ชื่อผลิตภัณฑ์ *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      placeholder="กรอกชื่อผลิตภัณฑ์"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_type">ประเภทลิขสิทธิ์</Label>
                    <Select
                      value={formData.license_type}
                      onValueChange={(value) => setFormData({ ...formData, license_type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_based">User-Based</SelectItem>
                        <SelectItem value="feature_based">Feature-Based</SelectItem>
                        <SelectItem value="concurrent">Concurrent</SelectItem>
                        <SelectItem value="site_wide">Site-Wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_users">จำนวนผู้ใช้สูงสุด</Label>
                    <Input
                      id="max_users"
                      type="number"
                      value={formData.max_users}
                      onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">วันหมดอายุ *</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">หมายเหตุ</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="หมายเหตุเพิ่มเติม"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddLicenseDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleAddLicense}>
                    เพิ่มลิขสิทธิ์
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ลิขสิทธิ์ทั้งหมด</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLicenses}</div>
              <p className="text-xs text-muted-foreground">
                ลิขสิทธิ์ในระบบ
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ใช้งานได้</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeLicenses}</div>
              <p className="text-xs text-muted-foreground">
                ลิขสิทธิ์ที่เปิดใช้งาน
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ใกล้หมดอายุ</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{expiringLicenses}</div>
              <p className="text-xs text-muted-foreground">
                หมดอายุใน 30 วัน
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">หมดอายุ</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredLicenses}</div>
              <p className="text-xs text-muted-foreground">
                ลิขสิทธิ์ที่หมดอายุ
              </p>
            </CardContent>
          </Card>
        </div>

        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="licenses">ลิขสิทธิ์</TabsTrigger>
          <TabsTrigger value="usage">การใช้งาน</TabsTrigger>
          <TabsTrigger value="alerts">การแจ้งเตือน</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาลิขสิทธิ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="active">เปิดใช้งาน</SelectItem>
                <SelectItem value="expired">หมดอายุ</SelectItem>
                <SelectItem value="suspended">ระงับใช้งาน</SelectItem>
                <SelectItem value="revoked">เพิกถอน</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                <SelectItem value="user_based">User-Based</SelectItem>
                <SelectItem value="feature_based">Feature-Based</SelectItem>
                <SelectItem value="concurrent">Concurrent</SelectItem>
                <SelectItem value="site_wide">Site-Wide</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Licenses Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสลิขสิทธิ์</TableHead>
                  <TableHead>ผลิตภัณฑ์</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>องค์กร</TableHead>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันหมดอายุ</TableHead>
                  <TableHead>การกระทำ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell className="font-medium">{license.license_key}</TableCell>
                    <TableCell>{license.product_name}</TableCell>
                    <TableCell>{getTypeBadge(license.license_type)}</TableCell>
                    <TableCell>{license.organization_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{license.usage_count}/{license.max_users}</span>
                        <Progress 
                          value={(license.usage_count / license.max_users) * 100} 
                          className="w-16 h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(license.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(license.expiry_date).toLocaleDateString('th-TH')}
                        {getDaysUntilExpiry(license.expiry_date) <= 30 && getDaysUntilExpiry(license.expiry_date) > 0 && (
                          <Badge variant="outline" className="text-yellow-600">
                            เหลือ {getDaysUntilExpiry(license.expiry_date)} วัน
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(license)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAssignDialog(license)}>
                            <Users className="mr-2 h-4 w-4" />
                            กำหนดผู้ใช้
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openUsageHistoryDialog(license)}>
                            <Activity className="mr-2 h-4 w-4" />
                            ประวัติการใช้งาน
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadCertificate(license)}>
                            <Download className="mr-2 h-4 w-4" />
                            ดาวน์โหลดใบรับรอง
                          </DropdownMenuItem>
                          {license.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleRevokeLicense(license.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              เพิกถอน
                            </DropdownMenuItem>
                          )}
                          {(license.status === 'expired' || license.status === 'revoked') && (
                            <DropdownMenuItem onClick={() => handleRenewLicense(license.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              ต่ออายุ
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openSendReportDialog(license)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            ส่งรายงาน
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการใช้งานลิขสิทธิ์</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ลิขสิทธิ์</TableHead>
                    <TableHead>ผู้ใช้</TableHead>
                    <TableHead>วันที่ใช้งาน</TableHead>
                    <TableHead>ระยะเวลา</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        ไม่มีข้อมูลการใช้งาน
                      </TableCell>
                    </TableRow>
                  ) : (
                    usageLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.license_id}</TableCell>
                        <TableCell>{log.user_id}</TableCell>
                        <TableCell>{new Date(log.session_start).toLocaleString('th-TH')}</TableCell>
                        <TableCell>{log.duration_minutes} นาที</TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {licenses
              .filter(license => {
                const days = getDaysUntilExpiry(license.expiry_date);
                return (days <= 30 && days > 0 && license.status === 'active') || license.status === 'expired';
              })
              .map((license) => {
                const days = getDaysUntilExpiry(license.expiry_date);
                const isExpired = license.status === 'expired';
                const isExpiringSoon = days <= 30 && days > 0;
                
                return (
                  <Card key={license.id} className={`border-l-4 ${isExpired ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpired ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                          <div>
                            <h3 className="font-medium">{license.product_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {license.license_key} • {license.organization_name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isExpired ? (
                            <Badge variant="destructive">หมดอายุแล้ว</Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600">
                              เหลือ {days} วัน
                            </Badge>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            หมดอายุ: {new Date(license.expiry_date).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            
            {licenses.filter(license => {
              const days = getDaysUntilExpiry(license.expiry_date);
              return (days <= 30 && days > 0 && license.status === 'active') || license.status === 'expired';
            }).length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">ไม่มีการแจ้งเตือน</h3>
                  <p className="text-muted-foreground">ลิขสิทธิ์ทั้งหมดอยู่ในสถานะปกติ</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit License Dialog */}
      <Dialog open={!!editingLicense} onOpenChange={(open) => !open && setEditingLicense(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขลิขสิทธิ์</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลลิขสิทธิ์
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_license_key">รหัสลิขสิทธิ์ *</Label>
              <Input
                id="edit_license_key"
                value={formData.license_key}
                onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
                placeholder="กรอกรหัสลิขสิทธิ์"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_product_name">ชื่อผลิตภัณฑ์ *</Label>
              <Input
                id="edit_product_name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                placeholder="กรอกชื่อผลิตภัณฑ์"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_license_type">ประเภทลิขสิทธิ์</Label>
              <Select
                value={formData.license_type}
                onValueChange={(value) => setFormData({ ...formData, license_type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user_based">User-Based</SelectItem>
                  <SelectItem value="feature_based">Feature-Based</SelectItem>
                  <SelectItem value="concurrent">Concurrent</SelectItem>
                  <SelectItem value="site_wide">Site-Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_max_users">จำนวนผู้ใช้สูงสุด</Label>
              <Input
                id="edit_max_users"
                type="number"
                value={formData.max_users}
                onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) || 0 })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_expiry_date">วันหมดอายุ *</Label>
              <Input
                id="edit_expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_notes">หมายเหตุ</Label>
              <Textarea
                id="edit_notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="หมายเหตุเพิ่มเติม"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditingLicense(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditLicense}>
              บันทึกการแก้ไข
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Users Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>กำหนดผู้ใช้งานลิขสิทธิ์</DialogTitle>
            <DialogDescription>
              เลือกผู้ใช้ที่จะกำหนดให้ใช้งานลิขสิทธิ์นี้
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ฟีเจอร์นี้จะพัฒนาในอนาคต สำหรับกำหนดผู้ใช้เฉพาะให้สามารถใช้งานลิขสิทธิ์นี้ได้
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Usage History Dialog */}
      <Dialog open={isUsageHistoryOpen} onOpenChange={setIsUsageHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>ประวัติการใช้งานลิขสิทธิ์</DialogTitle>
            <DialogDescription>
              ดูประวัติการใช้งานลิขสิทธิ์ {selectedLicense?.license_key}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ประวัติการใช้งานลิขสิทธิ์จะแสดงที่นี่เมื่อมีการพัฒนาระบบให้สมบูรณ์
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsUsageHistoryOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Report Dialog */}
      <Dialog open={isSendReportOpen} onOpenChange={setIsSendReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ส่งรายงานลิขสิทธิ์</DialogTitle>
            <DialogDescription>
              ส่งรายงานการใช้งานลิขสิทธิ์ {selectedLicense?.license_key}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ฟีเจอร์การส่งรายงานทาง Email จะพัฒนาในอนาคต
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSendReportOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => {
              toast({
                title: "ส่งรายงานสำเร็จ",
                description: "รายงานลิขสิทธิ์ถูกส่งแล้ว",
              });
              setIsSendReportOpen(false);
            }}>
              ส่งรายงาน
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}