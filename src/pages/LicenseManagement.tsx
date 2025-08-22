import { useState } from 'react';
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
  licenseKey: string;
  productName: string;
  licenseType: 'User-Based' | 'Feature-Based' | 'Concurrent' | 'Site-Wide';
  organizationId: string;
  organizationName: string;
  assignedUsers: string[];
  maxUsers: number;
  features: string[];
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Revoked';
  autoRenew: boolean;
  usageCount: number;
  lastUsed: string;
  notes: string;
}

interface LicenseUsage {
  id: string;
  licenseId: string;
  userId: string;
  userName: string;
  usageDate: string;
  duration: number;
  ipAddress: string;
  userAgent: string;
}

const mockLicenses: License[] = [
  {
    id: '1',
    licenseKey: 'ENT-2024-TECH001-ABCD1234',
    productName: 'Enterprise Communication Suite',
    licenseType: 'User-Based',
    organizationId: 'org-001',
    organizationName: 'บริษัท เทคโนโลยี จำกัด',
    assignedUsers: ['user-001', 'user-002', 'user-003'],
    maxUsers: 50,
    features: ['Email', 'Chat', 'Video Conference', 'File Sharing', 'Advanced Security'],
    issueDate: '2024-01-01',
    expiryDate: '2024-12-31',
    status: 'Active',
    autoRenew: true,
    usageCount: 125,
    lastUsed: '2024-01-25T14:30:00',
    notes: 'ลิขสิทธิ์หลักสำหรับระบบสื่อสารองค์กร'
  },
  {
    id: '2',
    licenseKey: 'STD-2024-MARK002-EFGH5678',
    productName: 'Standard Business Package',
    licenseType: 'Feature-Based',
    organizationId: 'org-002',
    organizationName: 'บริษัท การตลาด จำกัด',
    assignedUsers: ['user-004', 'user-005'],
    maxUsers: 10,
    features: ['Email', 'Chat', 'Basic Reports'],
    issueDate: '2024-01-15',
    expiryDate: '2024-07-15',
    status: 'Active',
    autoRenew: false,
    usageCount: 45,
    lastUsed: '2024-01-24T09:15:00',
    notes: 'แพ็กเกจพื้นฐานสำหรับธุรกิจขนาดเล็ก'
  },
  {
    id: '3',
    licenseKey: 'CONC-2024-DIGI003-IJKL9012',
    productName: 'Concurrent Access License',
    licenseType: 'Concurrent',
    organizationId: 'org-003',
    organizationName: 'บริษัท ดิจิทัล จำกัด',
    assignedUsers: [],
    maxUsers: 25,
    features: ['All Features', 'API Access', 'Custom Integration'],
    issueDate: '2024-01-10',
    expiryDate: '2024-01-31',
    status: 'Expired',
    autoRenew: true,
    usageCount: 89,
    lastUsed: '2024-01-31T23:59:59',
    notes: 'ลิขสิทธิ์แบบ Concurrent หมดอายุ'
  }
];

const mockUsageLogs: LicenseUsage[] = [
  {
    id: '1',
    licenseId: '1',
    userId: 'user-001',
    userName: 'สมชาย ใจดี',
    usageDate: '2024-01-25T14:30:00',
    duration: 120,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    licenseId: '1',
    userId: 'user-002',
    userName: 'นภา สว่างใส',
    usageDate: '2024-01-25T13:15:00',
    duration: 95,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: '3',
    licenseId: '2',
    userId: 'user-004',
    userName: 'วิชัย เก่งกาจ',
    usageDate: '2024-01-24T09:15:00',
    duration: 180,
    ipAddress: '192.168.2.50',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  }
];

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [usageLogs] = useState<LicenseUsage[]>(mockUsageLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddLicenseDialogOpen, setIsAddLicenseDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [currentTab, setCurrentTab] = useState('licenses');
  const [formData, setFormData] = useState<Partial<License>>({
    licenseKey: '',
    productName: '',
    licenseType: 'User-Based',
    organizationId: '',
    organizationName: '',
    maxUsers: 10,
    features: [],
    expiryDate: '',
    status: 'Active',
    autoRenew: true,
    notes: ''
  });

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.licenseKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    const matchesType = typeFilter === 'all' || license.licenseType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddLicense = () => {
    const newLicense: License = {
      id: Date.now().toString(),
      ...formData as License,
      assignedUsers: [],
      issueDate: new Date().toISOString().split('T')[0],
      usageCount: 0,
      lastUsed: new Date().toISOString(),
      features: formData.features || []
    };
    setLicenses([...licenses, newLicense]);
    setIsAddLicenseDialogOpen(false);
    resetForm();
    toast({
      title: "เพิ่มลิขสิทธิ์สำเร็จ",
      description: "เพิ่มลิขสิทธิ์ใหม่เรียบร้อยแล้ว",
    });
  };

  const handleEditLicense = () => {
    if (!editingLicense) return;
    setLicenses(licenses.map(license => 
      license.id === editingLicense.id ? { ...license, ...formData } : license
    ));
    setEditingLicense(null);
    resetForm();
    toast({
      title: "แก้ไขสำเร็จ",
      description: "แก้ไขลิขสิทธิ์เรียบร้อยแล้ว",
    });
  };

  const handleRevokeLicense = (id: string) => {
    setLicenses(licenses.map(license => 
      license.id === id ? { ...license, status: 'Revoked' as const } : license
    ));
    toast({
      title: "เพิกถอนลิขสิทธิ์สำเร็จ",
      description: "เพิกถอนลิขสิทธิ์เรียบร้อยแล้ว",
    });
  };

  const handleRenewLicense = (id: string) => {
    setLicenses(licenses.map(license => 
      license.id === id 
        ? { 
            ...license, 
            status: 'Active' as const,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          } 
        : license
    ));
    toast({
      title: "ต่ออายุสำเร็จ",
      description: "ต่ออายุลิขสิทธิ์เรียบร้อยแล้ว",
    });
  };

  const resetForm = () => {
    setFormData({
      licenseKey: '',
      productName: '',
      licenseType: 'User-Based',
      organizationId: '',
      organizationName: '',
      maxUsers: 10,
      features: [],
      expiryDate: '',
      status: 'Active',
      autoRenew: true,
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Active: "default",
      Expired: "destructive",
      Suspended: "secondary",
      Revoked: "outline"
    };
    const colors = {
      Active: "text-green-700",
      Expired: "text-red-700",
      Suspended: "text-yellow-700",
      Revoked: "text-gray-700"
    };
    const statusText = {
      Active: "เปิดใช้งาน",
      Expired: "หมดอายุ",
      Suspended: "ระงับใช้งาน",
      Revoked: "เพิกถอน"
    };
    return <Badge variant={variants[status] || "default"} className={colors[status as keyof typeof colors]}>
      {statusText[status as keyof typeof statusText]}
    </Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      'User-Based': "default",
      'Feature-Based': "secondary",
      'Concurrent': "outline",
      'Site-Wide': "destructive"
    };
    return <Badge variant={variants[type] || "default"}>{type}</Badge>;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(l => l.status === 'Active').length;
  const expiredLicenses = licenses.filter(l => l.status === 'Expired').length;
  const expiringLicenses = licenses.filter(l => {
    const days = getDaysUntilExpiry(l.expiryDate);
    return days <= 30 && days > 0 && l.status === 'Active';
  }).length;

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
                filteredLicenses.map(l => `${l.licenseKey},${l.productName},${l.licenseType},${l.organizationName},${l.maxUsers},${l.status},${l.expiryDate}`).join('\n');
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
                    <Label htmlFor="licenseKey">รหัสลิขสิทธิ์ *</Label>
                    <Input
                      id="licenseKey"
                      value={formData.licenseKey}
                      onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
                      placeholder="กรอกรหัสลิขสิทธิ์"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productName">ชื่อผลิตภัณฑ์ *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="กรอกชื่อผลิตภัณฑ์"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseType">ประเภทลิขสิทธิ์</Label>
                    <Select
                      value={formData.licenseType}
                      onValueChange={(value) => setFormData({ ...formData, licenseType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User-Based">User-Based</SelectItem>
                        <SelectItem value="Feature-Based">Feature-Based</SelectItem>
                        <SelectItem value="Concurrent">Concurrent</SelectItem>
                        <SelectItem value="Site-Wide">Site-Wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">องค์กร *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="กรอกชื่อองค์กร"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">จำนวนผู้ใช้สูงสุด</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">วันหมดอายุ</Label>
                    <DatePicker
                      placeholder="เลือกวันหมดอายุ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">สถานะ</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">เปิดใช้งาน</SelectItem>
                        <SelectItem value="Suspended">ระงับใช้งาน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">หมายเหตุ</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="กรอกหมายเหตุ"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
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

        <TabsList>
          <TabsTrigger value="licenses">ลิขสิทธิ์</TabsTrigger>
          <TabsTrigger value="usage">การใช้งาน</TabsTrigger>
          <TabsTrigger value="alerts">การแจ้งเตือน</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ลิขสิทธิ์ทั้งหมด</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLicenses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">เปิดใช้งาน</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeLicenses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ใกล้หมดอายุ</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{expiringLicenses}</div>
                <div className="text-xs text-muted-foreground">ใน 30 วัน</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">หมดอายุ</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{expiredLicenses}</div>
              </CardContent>
            </Card>
          </div>

          {/* Licenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายการลิขสิทธิ์</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหารหัสลิขสิทธิ์ ชื่อผลิตภัณฑ์ หรือองค์กร..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="Active">เปิดใช้งาน</SelectItem>
                    <SelectItem value="Expired">หมดอายุ</SelectItem>
                    <SelectItem value="Suspended">ระงับใช้งาน</SelectItem>
                    <SelectItem value="Revoked">เพิกถอน</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="ประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="User-Based">User-Based</SelectItem>
                    <SelectItem value="Feature-Based">Feature-Based</SelectItem>
                    <SelectItem value="Concurrent">Concurrent</SelectItem>
                    <SelectItem value="Site-Wide">Site-Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสลิขสิทธิ์</TableHead>
                    <TableHead>ผลิตภัณฑ์</TableHead>
                    <TableHead>องค์กร</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>การใช้งาน</TableHead>
                    <TableHead>วันหมดอายุ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses.map((license) => {
                    const usage = (license.assignedUsers.length / license.maxUsers) * 100;
                    const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);
                    
                    return (
                      <TableRow key={license.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{license.licenseKey}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{license.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {license.features.slice(0, 2).join(', ')}
                              {license.features.length > 2 && ` +${license.features.length - 2} more`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{license.organizationName}</div>
                            <div className="text-sm text-muted-foreground">{license.organizationId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(license.licenseType)}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{license.assignedUsers.length}/{license.maxUsers}</span>
                              <span>{usage.toFixed(0)}%</span>
                            </div>
                            <Progress value={usage} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              ใช้งาน {license.usageCount} ครั้ง
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">{license.expiryDate}</span>
                            </div>
                            {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                              <Badge variant="outline" className="text-xs text-yellow-700">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {daysUntilExpiry} วัน
                              </Badge>
                            )}
                            {license.autoRenew && (
                              <Badge variant="outline" className="text-xs">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                ต่ออายุอัตโนมัติ
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(license.status)}</TableCell>
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
                              {license.status === 'Expired' && (
                                <DropdownMenuItem onClick={() => handleRenewLicense(license.id)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  ต่ออายุ
                                </DropdownMenuItem>
                              )}
                              {license.status === 'Active' && (
                                <DropdownMenuItem 
                                  onClick={() => handleRevokeLicense(license.id)}
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  เพิกถอน
                                </DropdownMenuItem>
                              )}
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
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>บันทึกการใช้งานล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่ใช้งาน</TableHead>
                    <TableHead>ผู้ใช้</TableHead>
                    <TableHead>ลิขสิทธิ์</TableHead>
                    <TableHead>ระยะเวลา</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageLogs.map((usage) => {
                    const license = licenses.find(l => l.id === usage.licenseId);
                    return (
                      <TableRow key={usage.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            {new Date(usage.usageDate).toLocaleString('th-TH')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{usage.userName}</div>
                            <div className="text-sm text-muted-foreground">{usage.userId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{license?.productName}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {license?.licenseKey}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {usage.duration} นาที
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{usage.ipAddress}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs">
                          {usage.userAgent}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-4">
            {licenses.filter(l => {
              const days = getDaysUntilExpiry(l.expiryDate);
              return (days <= 30 && days > 0 && l.status === 'Active') || l.status === 'Expired';
            }).map((license) => {
              const days = getDaysUntilExpiry(license.expiryDate);
              const isExpired = license.status === 'Expired';
              const isExpiringSoon = days <= 30 && days > 0;
              
              return (
                <Card key={license.id} className={`${isExpired ? 'border-red-200' : isExpiringSoon ? 'border-yellow-200' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {isExpired ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        <CardTitle className="text-lg">
                          {isExpired ? 'ลิขสิทธิ์หมดอายุ' : 'ลิขสิทธิ์ใกล้หมดอายุ'}
                        </CardTitle>
                      </div>
                      <Badge variant={isExpired ? "destructive" : "outline"}>
                        {isExpired ? 'หมดอายุแล้ว' : `${days} วัน`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">ผลิตภัณฑ์:</span>
                        <span>{license.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">องค์กร:</span>
                        <span>{license.organizationName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">รหัสลิขสิทธิ์:</span>
                        <span className="font-mono text-sm">{license.licenseKey}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">วันหมดอายุ:</span>
                        <span>{license.expiryDate}</span>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => openEditDialog(license)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          แก้ไข
                        </Button>
                        <Button onClick={() => handleRenewLicense(license.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          ต่ออายุ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editingLicense !== null} onOpenChange={() => setEditingLicense(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขลิขสิทธิ์</DialogTitle>
            <DialogDescription>
              แก้ไขรายละเอียดลิขสิทธิ์ที่เลือก
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-licenseKey">รหัสลิขสิทธิ์ *</Label>
              <Input
                id="edit-licenseKey"
                value={formData.licenseKey}
                onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
                placeholder="กรอกรหัสลิขสิทธิ์"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-productName">ชื่อผลิตภัณฑ์ *</Label>
              <Input
                id="edit-productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="กรอกชื่อผลิตภัณฑ์"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-licenseType">ประเภทลิขสิทธิ์</Label>
              <Select
                value={formData.licenseType}
                onValueChange={(value) => setFormData({ ...formData, licenseType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User-Based">User-Based</SelectItem>
                  <SelectItem value="Feature-Based">Feature-Based</SelectItem>
                  <SelectItem value="Concurrent">Concurrent</SelectItem>
                  <SelectItem value="Site-Wide">Site-Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-organizationName">องค์กร *</Label>
              <Input
                id="edit-organizationName"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="กรอกชื่อองค์กร"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxUsers">จำนวนผู้ใช้สูงสุด</Label>
              <Input
                id="edit-maxUsers"
                type="number"
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expiryDate">วันหมดอายุ</Label>
              <DatePicker
                placeholder="เลือกวันหมดอายุ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">สถานะ</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">เปิดใช้งาน</SelectItem>
                  <SelectItem value="Suspended">ระงับใช้งาน</SelectItem>
                  <SelectItem value="Revoked">เพิกถอน</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-notes">หมายเหตุ</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="กรอกหมายเหตุ"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingLicense(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditLicense}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Users Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>กำหนดผู้ใช้ลิขสิทธิ์</DialogTitle>
            <DialogDescription>
              จัดการการกำหนดผู้ใช้สำหรับลิขสิทธิ์
            </DialogDescription>
          </DialogHeader>
          {selectedLicense && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">ลิขสิทธิ์</Label>
                <p className="text-sm">{selectedLicense.productName}</p>
                <p className="text-xs text-muted-foreground font-mono">{selectedLicense.licenseKey}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">จำนวนผู้ใช้ปัจจุบัน</Label>
                <p className="text-sm">{selectedLicense.assignedUsers.length} / {selectedLicense.maxUsers}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                ฟีเจอร์การกำหนดผู้ใช้จะเชื่อมต่อกับระบบ User Management
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}