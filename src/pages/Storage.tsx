import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  HardDrive, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Users, 
  Building2, 
  AlertTriangle,
  TrendingUp,
  Edit2,
  MoreHorizontal,
  Trash2,
  FileText,
  BarChart3,
  RefreshCw,
  Activity
} from 'lucide-react';

interface StorageQuota {
  id: string;
  entityType: 'User' | 'Organization' | 'Department';
  entityName: string;
  entityId: string;
  allocatedSpace: number; // in GB
  usedSpace: number; // in GB
  warningThreshold: number; // percentage
  status: 'Normal' | 'Warning' | 'Critical' | 'Exceeded';
  lastUpdated: string;
  createdAt: string;
  department?: string;
  organization?: string;
}

interface UsageLog {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'User' | 'Organization' | 'Department';
  date: string;
  usedSpace: number;
  allocatedSpace: number;
  utilizationRate: number;
}

const mockQuotas: StorageQuota[] = [
  {
    id: '1',
    entityType: 'User',
    entityName: 'สมชาย ใจดี',
    entityId: 'user-001',
    allocatedSpace: 50,
    usedSpace: 35.2,
    warningThreshold: 80,
    status: 'Normal',
    lastUpdated: '2024-01-25T10:30:00',
    createdAt: '2024-01-01',
    department: 'ฝ่ายไอที',
    organization: 'บริษัท เทคโนโลยี จำกัด'
  },
  {
    id: '2',
    entityType: 'User',
    entityName: 'นภา สว่างใส',
    entityId: 'user-002',
    allocatedSpace: 30,
    usedSpace: 27.8,
    warningThreshold: 80,
    status: 'Warning',
    lastUpdated: '2024-01-25T11:15:00',
    createdAt: '2024-01-01',
    department: 'ฝ่ายขาย',
    organization: 'บริษัท เทคโนโลยี จำกัด'
  },
  {
    id: '3',
    entityType: 'Department',
    entityName: 'ฝ่ายไอที',
    entityId: 'dept-001',
    allocatedSpace: 500,
    usedSpace: 325.6,
    warningThreshold: 85,
    status: 'Normal',
    lastUpdated: '2024-01-25T12:00:00',
    createdAt: '2024-01-01',
    organization: 'บริษัท เทคโนโลยี จำกัด'
  },
  {
    id: '4',
    entityType: 'Organization',
    entityName: 'บริษัท เทคโนโลยี จำกัด',
    entityId: 'org-001',
    allocatedSpace: 2000,
    usedSpace: 1850.3,
    warningThreshold: 90,
    status: 'Critical',
    lastUpdated: '2024-01-25T13:00:00',
    createdAt: '2024-01-01'
  }
];

const mockUsageLogs: UsageLog[] = [
  {
    id: '1',
    entityId: 'user-001',
    entityName: 'สมชาย ใจดี',
    entityType: 'User',
    date: '2024-01-25',
    usedSpace: 35.2,
    allocatedSpace: 50,
    utilizationRate: 70.4
  },
  {
    id: '2',
    entityId: 'user-002',
    entityName: 'นภา สว่างใส',
    entityType: 'User',
    date: '2024-01-25',
    usedSpace: 27.8,
    allocatedSpace: 30,
    utilizationRate: 92.7
  },
  {
    id: '3',
    entityId: 'org-001',
    entityName: 'บริษัท เทคโนโลยี จำกัด',
    entityType: 'Organization',
    date: '2024-01-25',
    usedSpace: 1850.3,
    allocatedSpace: 2000,
    utilizationRate: 92.5
  }
];

const mockDepartments = [
  'ฝ่ายไอที',
  'ฝ่ายขาย',
  'ฝ่ายการตลาด',
  'ฝ่ายบุคคล',
  'ฝ่ายบัญชี',
  'ฝ่ายผลิต',
  'ฝ่ายคุณภาพ',
  'ฝ่ายธุรการ'
];

const mockOrganizations = [
  'บริษัท เทคโนโลยี จำกัด',
  'บริษัท นวัตกรรม จำกัด',
  'บริษัท ดิจิทัล จำกัด',
  'บริษัท อนาคต จำกัด',
  'บริษัท สมาร์ท จำกัด'
];

export default function Storage() {
  const { user, isAuthenticated } = useAuth();
  const [quotas, setQuotas] = useState<StorageQuota[]>([]);
  const [usageLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStorageQuotas();
    }
  }, [isAuthenticated]);

  const fetchStorageQuotas = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_quotas')
        .select(`
          *,
          organization:organizations(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedQuotas = data?.map(quota => ({
        id: quota.id,
        entityType: 'Organization' as const,
        entityName: quota.organization?.name || 'Unknown',
        entityId: quota.organization_id,
        allocatedSpace: quota.allocated_mb / 1024, // Convert MB to GB
        usedSpace: quota.used_mb / 1024, // Convert MB to GB
        warningThreshold: 80,
        status: getStorageStatus(quota.used_mb, quota.allocated_mb),
        lastUpdated: quota.last_calculated || new Date().toISOString(),
        createdAt: quota.created_at,
        organization: quota.organization?.name
      })) || [];
      
      setQuotas(formattedQuotas);
    } catch (error) {
      console.error('Error fetching storage quotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStorageStatus = (used: number, allocated: number): StorageQuota['status'] => {
    const percentage = (used / allocated) * 100;
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 95) return 'Critical';
    if (percentage >= 80) return 'Warning';
    return 'Normal';
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddQuotaDialogOpen, setIsAddQuotaDialogOpen] = useState(false);
  const [editingQuota, setEditingQuota] = useState<StorageQuota | null>(null);
  const [isResetQuotaOpen, setIsResetQuotaOpen] = useState(false);
  const [isSendAlertOpen, setIsSendAlertOpen] = useState(false);
  const [isViewHistoryOpen, setIsViewHistoryOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<StorageQuota | null>(null);
  const [formData, setFormData] = useState<Partial<StorageQuota>>({
    entityType: 'User',
    entityName: '',
    entityId: '',
    allocatedSpace: 10,
    warningThreshold: 80,
    department: '',
    organization: ''
  });

  const filteredQuotas = quotas.filter(quota => {
    const matchesSearch = quota.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quota.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntityType = entityTypeFilter === 'all' || quota.entityType === entityTypeFilter;
    const matchesStatus = statusFilter === 'all' || quota.status === statusFilter;
    return matchesSearch && matchesEntityType && matchesStatus;
  });

  const handleAddQuota = () => {
    const utilizationRate = (formData.usedSpace || 0) / (formData.allocatedSpace || 1) * 100;
    let status: StorageQuota['status'] = 'Normal';
    
    if (utilizationRate >= 100) status = 'Exceeded';
    else if (utilizationRate >= 95) status = 'Critical';
    else if (utilizationRate >= (formData.warningThreshold || 80)) status = 'Warning';

    const newQuota: StorageQuota = {
      id: Date.now().toString(),
      ...formData as StorageQuota,
      usedSpace: 0,
      status,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    setQuotas([...quotas, newQuota]);
    setIsAddQuotaDialogOpen(false);
    resetForm();
    toast({
      title: "เพิ่ม Quota สำเร็จ",
      description: "กำหนด Storage Quota เรียบร้อยแล้ว",
    });
  };

  const handleEditQuota = () => {
    if (!editingQuota) return;
    
    const utilizationRate = (formData.usedSpace || 0) / (formData.allocatedSpace || 1) * 100;
    let status: StorageQuota['status'] = 'Normal';
    
    if (utilizationRate >= 100) status = 'Exceeded';
    else if (utilizationRate >= 95) status = 'Critical';
    else if (utilizationRate >= (formData.warningThreshold || 80)) status = 'Warning';

    setQuotas(quotas.map(quota => 
      quota.id === editingQuota.id 
        ? { ...quota, ...formData, status, lastUpdated: new Date().toISOString() }
        : quota
    ));
    setEditingQuota(null);
    resetForm();
    toast({
      title: "แก้ไขสำเร็จ",
      description: "แก้ไข Storage Quota เรียบร้อยแล้ว",
    });
  };

  const handleDeleteQuota = (id: string) => {
    setQuotas(quotas.filter(quota => quota.id !== id));
    toast({
      title: "ลบสำเร็จ",
      description: "ลบ Storage Quota เรียบร้อยแล้ว",
    });
  };

  const resetForm = () => {
    setFormData({
      entityType: 'User',
      entityName: '',
      entityId: '',
      allocatedSpace: 10,
      warningThreshold: 80,
      department: '',
      organization: ''
    });
  };

  const openEditDialog = (quota: StorageQuota) => {
    setEditingQuota(quota);
    setFormData(quota);
  };

  const openResetQuotaDialog = (quota: StorageQuota) => {
    setSelectedQuota(quota);
    setIsResetQuotaOpen(true);
  };

  const openSendAlertDialog = (quota: StorageQuota) => {
    setSelectedQuota(quota);
    setIsSendAlertOpen(true);
  };

  const openViewHistoryDialog = (quota: StorageQuota) => {
    setSelectedQuota(quota);
    setIsViewHistoryOpen(true);
  };

  const handleResetQuota = (id: string) => {
    setQuotas(quotas.map(quota => 
      quota.id === id ? { ...quota, usedSpace: 0, status: 'Normal' } : quota
    ));
    toast({
      title: "รีเซ็ต Quota สำเร็จ",
      description: "รีเซ็ตการใช้งาน Storage สำเร็จ",
    });
    setIsResetQuotaOpen(false);
  };

  const handleExtendQuota = (id: string, additionalSpace: number) => {
    setQuotas(quotas.map(quota => 
      quota.id === id ? { ...quota, allocatedSpace: quota.allocatedSpace + additionalSpace } : quota
    ));
    toast({
      title: "ขยาย Quota สำเร็จ",
      description: "ขยายพื้นที่จัดเก็บเรียบร้อยแล้ว",
    });
  };

  const getStatusBadge = (status: string, utilizationRate: number) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Normal: "secondary",
      Warning: "default",
      Critical: "destructive",
      Exceeded: "destructive"
    };
    const colors = {
      Normal: "text-green-700",
      Warning: "text-yellow-700",
      Critical: "text-red-700",
      Exceeded: "text-red-700"
    };
    
    const statusText = {
      Normal: "ปกติ",
      Warning: "เตือน",
      Critical: "วิกฤต",
      Exceeded: "เกินขีด"
    };

    return (
      <div className="space-y-1">
        <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
          {statusText[status as keyof typeof statusText]} ({utilizationRate.toFixed(1)}%)
        </Badge>
      </div>
    );
  };

  const getEntityIcon = (entityType: string) => {
    const icons = {
      User: Users,
      Department: Building2,
      Organization: Building2
    };
    const Icon = icons[entityType as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  const calculateUtilizationRate = (used: number, allocated: number) => {
    return (used / allocated) * 100;
  };

  const totalAllocated = quotas.reduce((sum, quota) => sum + quota.allocatedSpace, 0);
  const totalUsed = quotas.reduce((sum, quota) => sum + quota.usedSpace, 0);
  const overallUtilization = (totalUsed / totalAllocated) * 100;
  
  const criticalCount = quotas.filter(q => q.status === 'Critical' || q.status === 'Exceeded').length;
  const warningCount = quotas.filter(q => q.status === 'Warning').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการพื้นที่จัดเก็บ</h1>
          <p className="text-muted-foreground">ตั้งค่าและติดตาม Storage Quota ของผู้ใช้และองค์กร</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            // Navigate to storage reports
            window.location.href = '/storage/reports';
          }}>
            <BarChart3 className="h-4 w-4 mr-2" />
            ดูรายงาน
          </Button>
          <Dialog open={isAddQuotaDialogOpen} onOpenChange={setIsAddQuotaDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่ม Quota
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>เพิ่ม Storage Quota</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entityType">ประเภท</Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) => setFormData({ ...formData, entityType: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">ผู้ใช้</SelectItem>
                      <SelectItem value="Department">แผนก</SelectItem>
                      <SelectItem value="Organization">องค์กร</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entityName">ชื่อ *</Label>
                    <Input
                      id="entityName"
                      value={formData.entityName}
                      onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                      placeholder="กรอกชื่อ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entityId">รหัส *</Label>
                    <Input
                      id="entityId"
                      value={formData.entityId}
                      onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                      placeholder="กรอกรหัส"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allocatedSpace">พื้นที่ (GB) *</Label>
                    <Input
                      id="allocatedSpace"
                      type="number"
                      value={formData.allocatedSpace}
                      onChange={(e) => setFormData({ ...formData, allocatedSpace: parseFloat(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warningThreshold">เกณฑ์เตือน (%)</Label>
                    <Input
                      id="warningThreshold"
                      type="number"
                      value={formData.warningThreshold}
                      onChange={(e) => setFormData({ ...formData, warningThreshold: parseFloat(e.target.value) })}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                {formData.entityType === 'User' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">แผนก</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกแผนก" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">องค์กร</Label>
                      <Select
                        value={formData.organization}
                        onValueChange={(value) => setFormData({ ...formData, organization: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกองค์กร" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOrganizations.map((org) => (
                            <SelectItem key={org} value={org}>
                              {org}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddQuotaDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAddQuota}>
                  เพิ่ม Quota
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พื้นที่รวม</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated.toFixed(1)} GB</div>
            <div className="text-xs text-muted-foreground mt-1">
              ใช้แล้ว {totalUsed.toFixed(1)} GB ({overallUtilization.toFixed(1)}%)
            </div>
            <Progress value={overallUtilization} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quota ทั้งหมด</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotas.length}</div>
            <div className="text-xs text-muted-foreground">
              รายการที่กำหนด
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เตือนและวิกฤต</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">
              เตือน {warningCount} รายการ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การเติบโต</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+5.2%</div>
            <div className="text-xs text-muted-foreground">
              เทียบกับเดือนก่อน
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Quotas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Quota Management</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อ รหัส..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="User">ผู้ใช้</SelectItem>
                <SelectItem value="Department">แผนก</SelectItem>
                <SelectItem value="Organization">องค์กร</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="Normal">ปกติ</SelectItem>
                <SelectItem value="Warning">เตือน</SelectItem>
                <SelectItem value="Critical">วิกฤต</SelectItem>
                <SelectItem value="Exceeded">เกินขีด</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ประเภท</TableHead>
                <TableHead>ชื่อ/รหัส</TableHead>
                <TableHead>แผนก/องค์กร</TableHead>
                <TableHead>การใช้งาน</TableHead>
                <TableHead>พื้นที่</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>อัปเดตล่าสุด</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotas.map((quota) => {
                const utilizationRate = calculateUtilizationRate(quota.usedSpace, quota.allocatedSpace);
                return (
                  <TableRow key={quota.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(quota.entityType)}
                        {quota.entityType === 'User' ? 'ผู้ใช้' : 
                         quota.entityType === 'Department' ? 'แผนก' : 'องค์กร'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quota.entityName}</div>
                        <div className="text-sm text-muted-foreground">{quota.entityId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quota.entityType === 'User' && (
                        <div className="text-sm">
                          <div>{quota.department}</div>
                          <div className="text-muted-foreground">{quota.organization}</div>
                        </div>
                      )}
                      {quota.entityType === 'Department' && (
                        <div className="text-sm">{quota.organization}</div>
                      )}
                      {quota.entityType === 'Organization' && (
                        <div className="text-sm text-muted-foreground">-</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={utilizationRate} className="w-24" />
                        <div className="text-xs text-muted-foreground">
                          {utilizationRate.toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{quota.usedSpace.toFixed(1)} / {quota.allocatedSpace} GB</div>
                        <div className="text-muted-foreground">
                          เหลือ {(quota.allocatedSpace - quota.usedSpace).toFixed(1)} GB
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(quota.status, utilizationRate)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(quota.lastUpdated).toLocaleDateString('th-TH')}
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
                          <DropdownMenuItem onClick={() => openEditDialog(quota)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openResetQuotaDialog(quota)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            รีเซ็ต Quota
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExtendQuota(quota.id, 10)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            ขยาย Quota
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openSendAlertDialog(quota)}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            ส่งเตือน
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openViewHistoryDialog(quota)}>
                            <Activity className="mr-2 h-4 w-4" />
                            ดูประวัติ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = '/storage/reports'}>
                            <FileText className="mr-2 h-4 w-4" />
                            ดูรายงาน
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteQuota(quota.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Usage Logs */}
      <Card>
        <CardHeader>
          <CardTitle>บันทึกการใช้งาน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>ชื่อ/ประเภท</TableHead>
                <TableHead>การใช้งาน</TableHead>
                <TableHead>อัตราการใช้งาน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageLogs.slice(0, 10).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.date).toLocaleDateString('th-TH')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEntityIcon(log.entityType)}
                      <div>
                        <div className="font-medium">{log.entityName}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.entityType === 'User' ? 'ผู้ใช้' : 
                           log.entityType === 'Department' ? 'แผนก' : 'องค์กร'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {log.usedSpace.toFixed(1)} / {log.allocatedSpace} GB
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={log.utilizationRate} className="w-20" />
                      <span className="text-sm">{log.utilizationRate.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editingQuota !== null} onOpenChange={() => setEditingQuota(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>แก้ไข Storage Quota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-entityType">ประเภท</Label>
              <Select
                value={formData.entityType}
                onValueChange={(value) => setFormData({ ...formData, entityType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">ผู้ใช้</SelectItem>
                  <SelectItem value="Department">แผนก</SelectItem>
                  <SelectItem value="Organization">องค์กร</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-entityName">ชื่อ *</Label>
                <Input
                  id="edit-entityName"
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  placeholder="กรอกชื่อ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-entityId">รหัส *</Label>
                <Input
                  id="edit-entityId"
                  value={formData.entityId}
                  onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                  placeholder="กรอกรหัส"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-allocatedSpace">พื้นที่ (GB) *</Label>
                <Input
                  id="edit-allocatedSpace"
                  type="number"
                  value={formData.allocatedSpace}
                  onChange={(e) => setFormData({ ...formData, allocatedSpace: parseFloat(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-warningThreshold">เกณฑ์เตือน (%)</Label>
                <Input
                  id="edit-warningThreshold"
                  type="number"
                  value={formData.warningThreshold}
                  onChange={(e) => setFormData({ ...formData, warningThreshold: parseFloat(e.target.value) })}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            {formData.entityType === 'User' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">แผนก</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกแผนก" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-organization">องค์กร</Label>
                  <Select
                    value={formData.organization}
                    onValueChange={(value) => setFormData({ ...formData, organization: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกองค์กร" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOrganizations.map((org) => (
                        <SelectItem key={org} value={org}>
                          {org}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingQuota(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditQuota}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Quota Dialog */}
      <Dialog open={isResetQuotaOpen} onOpenChange={setIsResetQuotaOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>รีเซ็ต Storage Quota</DialogTitle>
            <DialogDescription>
              รีเซ็ตการใช้งาน Storage สำหรับ {selectedQuota?.entityName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              การดำเนินการนี้จะรีเซ็ตการใช้งานพื้นที่จัดเก็บเป็น 0 GB และเปลี่ยนสถานะเป็น "ปกติ"
            </p>
            <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>คำเตือน:</strong> การรีเซ็ตนี้จะไม่ลบไฟล์จริง แต่จะรีเซ็ตเฉพาะตัวเลขการใช้งานในระบบเท่านั้น
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsResetQuotaOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => handleResetQuota(selectedQuota?.id || '')}>
              รีเซ็ต
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Alert Dialog */}
      <Dialog open={isSendAlertOpen} onOpenChange={setIsSendAlertOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>ส่งการแจ้งเตือน</DialogTitle>
            <DialogDescription>
              ส่งการแจ้งเตือนการใช้งาน Storage ถึง {selectedQuota?.entityName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="alert-type">ประเภทการแจ้งเตือน</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">เตือนการใช้งานใกล้เต็ม</SelectItem>
                  <SelectItem value="exceeded">แจ้งเตือนใช้งานเกินขีด</SelectItem>
                  <SelectItem value="cleanup">แจ้งให้จัดการไฟล์</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">ข้อความเพิ่มเติม</Label>
              <textarea 
                id="message" 
                className="w-full p-3 border rounded-md min-h-[100px]" 
                placeholder="ข้อความเพิ่มเติม (ไม่บังคับ)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="email-alert" className="rounded" defaultChecked />
              <Label htmlFor="email-alert">ส่งผ่านอีเมล</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSendAlertOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => setIsSendAlertOpen(false)}>
              ส่งการแจ้งเตือน
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View History Dialog */}
      <Dialog open={isViewHistoryOpen} onOpenChange={setIsViewHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ประวัติการใช้งาน Storage</DialogTitle>
            <DialogDescription>
              ประวัติการใช้งานของ {selectedQuota?.entityName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>การใช้งาน</TableHead>
                  <TableHead>การเปลี่ยนแปลง</TableHead>
                  <TableHead>หมายเหตุ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>25/01/2024</TableCell>
                  <TableCell>35.2 GB</TableCell>
                  <TableCell className="text-green-600">+2.1 GB</TableCell>
                  <TableCell>อัปโหลดไฟล์โปรเจ็กต์</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>24/01/2024</TableCell>
                  <TableCell>33.1 GB</TableCell>
                  <TableCell className="text-red-600">-0.5 GB</TableCell>
                  <TableCell>ลบไฟล์ชั่วคราว</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2024</TableCell>
                  <TableCell>33.6 GB</TableCell>
                  <TableCell className="text-green-600">+1.8 GB</TableCell>
                  <TableCell>สำรองข้อมูล</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}