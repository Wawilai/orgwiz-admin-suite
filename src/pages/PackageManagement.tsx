import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  Plus, 
  Search, 
  Crown, 
  Star,
  Clock,
  Users,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';

interface License {
  id: string;
  organization_id: string;
  product_name: string;
  license_type: string;
  license_key: string;
  max_users: number;
  usage_count: number;
  issue_date: string;
  expiry_date: string;
  status: string;
  features: string[];
  notes?: string;
  last_used?: string;
  auto_renew: boolean;
  organizations?: { name: string };
}

const PackageManagement = () => {
  const { isAuthenticated } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLicenses();
    }
  }, [isAuthenticated]);

  const fetchLicenses = async () => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          organizations!licenses_organization_id_fkey (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match our interface
      const formattedLicenses = (data || []).map(license => ({
        ...license,
        features: Array.isArray(license.features) ? license.features.map(f => String(f)) : []
      }));
      
      setLicenses(formattedLicenses);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      expired: 'secondary',
      suspended: 'destructive',
      inactive: 'outline'
    } as const;
    
    const labels = {
      active: 'ใช้งาน',
      expired: 'หมดอายุ',
      suspended: 'ระงับ',
      inactive: 'ไม่ใช้งาน'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getLicenseTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'premium':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'standard':
        return <Star className="h-4 w-4 text-blue-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.license_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (license.organizations?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || license.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getUsagePercentage = (used: number, max: number) => {
    return max > 0 ? Math.round((used / max) * 100) : 0;
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการแพ็คเกจและใบอนุญาต</h1>
          <p className="text-muted-foreground">จัดการแพ็คเกจบริการและใบอนุญาตการใช้งาน</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มใบอนุญาต
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>เพิ่มใบอนุญาตใหม่</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  สร้างใบอนุญาตใหม่สำหรับองค์กร
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button>เพิ่มใบอนุญาต</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใบอนุญาตทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenses.length}</div>
            <p className="text-xs text-muted-foreground">ใบอนุญาตในระบบ</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใช้งานอยู่</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {licenses.filter(l => l.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">ใบอนุญาตที่ใช้งานอยู่</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมดอายุ</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {licenses.filter(l => l.status === 'expired').length}
            </div>
            <p className="text-xs text-muted-foreground">ใบอนุญาตหมดอายุ</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใกล้หมดอายุ</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {licenses.filter(l => isExpiringSoon(l.expiry_date)).length}
            </div>
            <p className="text-xs text-muted-foreground">ภายใน 30 วัน</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>รายการใบอนุญาตและแพ็คเกจ</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อผลิตภัณฑ์, ประเภท, หรือองค์กร..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="expired">หมดอายุ</SelectItem>
                <SelectItem value="suspended">ระงับ</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผลิตภัณฑ์</TableHead>
                <TableHead>องค์กร</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ผู้ใช้งาน</TableHead>
                <TableHead>วันที่หมดอายุ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การต่ออายุอัตโนมัติ</TableHead>
                <TableHead>การใช้งาน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => {
                const usagePercentage = getUsagePercentage(license.usage_count, license.max_users);
                const isExpiring = isExpiringSoon(license.expiry_date);
                
                return (
                  <TableRow key={license.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLicenseTypeIcon(license.license_type)}
                        <div>
                          <div className="font-medium">{license.product_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {license.license_key}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {license.organizations?.name || 'ไม่ระบุ'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{license.license_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{license.usage_count}/{license.max_users}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${isExpiring ? 'text-yellow-600 font-medium' : ''}`}>
                        {new Date(license.expiry_date).toLocaleDateString('th-TH')}
                        {isExpiring && (
                          <div className="text-xs text-yellow-600">ใกล้หมดอายุ</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(license.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={license.auto_renew ? 'default' : 'outline'}>
                        {license.auto_renew ? 'เปิด' : 'ปิด'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{usagePercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              usagePercentage >= 90 ? 'bg-red-500' :
                              usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredLicenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'ไม่พบข้อมูลที่ค้นหา' 
                      : 'ยังไม่มีใบอนุญาตในระบบ'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Package Templates */}
      <Card>
        <CardHeader>
          <CardTitle>แพ็คเกจแนะนำ</CardTitle>
          <p className="text-sm text-muted-foreground">
            แพ็คเกจบริการที่พร้อมใช้งานสำหรับองค์กรต่างๆ
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Basic Plan</CardTitle>
                  <Package className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-2xl font-bold">฿299<span className="text-sm font-normal">/เดือน</span></p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">เหมาะสำหรับธุรกิจเริ่มต้น</p>
                <ul className="space-y-1 text-sm">
                  <li>• ผู้ใช้งาน 10 คน</li>
                  <li>• พื้นที่จัดเก็บ 50 GB</li>
                  <li>• บัญชีอีเมล 10 บัญชี</li>
                  <li>• การสนับสนุนพื้นฐาน</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  เลือกแพ็คเกจนี้
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">แนะนำ</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Standard Plan</CardTitle>
                  <Star className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">฿799<span className="text-sm font-normal">/เดือน</span></p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">เหมาะสำหรับธุรกิจขนาดกลาง</p>
                <ul className="space-y-1 text-sm">
                  <li>• ผู้ใช้งาน 50 คน</li>
                  <li>• พื้นที่จัดเก็บ 500 GB</li>
                  <li>• บัญชีอีเมล 100 บัญชี</li>
                  <li>• การสนับสนุนแบบเร็ว</li>
                  <li>• ระบบรักษาความปลอดภัยขั้นสูง</li>
                </ul>
                <Button className="w-full mt-4">
                  เลือกแพ็คเกจนี้
                </Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Premium Plan</CardTitle>
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold">฿1,999<span className="text-sm font-normal">/เดือน</span></p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">เหมาะสำหรับองค์กรขนาดใหญ่</p>
                <ul className="space-y-1 text-sm">
                  <li>• ผู้ใช้งานไม่จำกัด</li>
                  <li>• พื้นที่จัดเก็บ 2 TB</li>
                  <li>• บัญชีอีเมลไม่จำกัด</li>
                  <li>• การสนับสนุน 24/7</li>
                  <li>• ฟีเจอร์ขั้นสูงทั้งหมด</li>
                  <li>• API Access</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  เลือกแพ็คเกจนี้
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageManagement;