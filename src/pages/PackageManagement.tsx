import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { 
  Package, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Crown, 
  Star,
  Clock,
  Users,
  MoreHorizontal,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface PackagePlan {
  id: string;
  name: string;
  description: string;
  type: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  price: number;
  billingCycle: 'Monthly' | 'Yearly';
  features: PackageFeature[];
  maxUsers: number;
  storageGB: number;
  emailAccounts: number;
  supportLevel: 'Basic' | 'Priority' | '24/7';
  status: 'Active' | 'Inactive' | 'Deprecated';
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PackageFeature {
  id: string;
  name: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

interface Subscription {
  id: string;
  organizationId: string;
  organizationName: string;
  packageId: string;
  packageName: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Cancelled';
  startDate: string;
  endDate: string;
  price: number;
  billingCycle: 'Monthly' | 'Yearly';
  autoRenew: boolean;
  usedUsers: number;
  usedStorage: number;
  lastPayment: string;
}

const mockFeatures: PackageFeature[] = [
  { id: '1', name: 'Email Service', included: true },
  { id: '2', name: 'Chat & Messaging', included: true },
  { id: '3', name: 'Video Conference', included: true, limit: 100, unit: 'participants' },
  { id: '4', name: 'File Storage', included: true, limit: 100, unit: 'GB' },
  { id: '5', name: 'Advanced Security', included: false },
  { id: '6', name: 'API Access', included: false },
  { id: '7', name: 'Custom Domain', included: false },
  { id: '8', name: 'Priority Support', included: false }
];

const mockPackages: PackagePlan[] = [
  {
    id: '1',
    name: 'Basic Plan',
    description: 'เหมาะสำหรับธุรกิจเริ่มต้น',
    type: 'Basic',
    price: 299,
    billingCycle: 'Monthly',
    features: mockFeatures.slice(0, 4),
    maxUsers: 10,
    storageGB: 50,
    emailAccounts: 10,
    supportLevel: 'Basic',
    status: 'Active',
    isPopular: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Standard Plan',
    description: 'เหมาะสำหรับธุรกิจขนาดกลาง',
    type: 'Standard',
    price: 799,
    billingCycle: 'Monthly',
    features: mockFeatures.slice(0, 6),
    maxUsers: 50,
    storageGB: 200,
    emailAccounts: 50,
    supportLevel: 'Priority',
    status: 'Active',
    isPopular: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Premium Plan',
    description: 'เหมาะสำหรับธุรกิจขนาดใหญ่',
    type: 'Premium',
    price: 1499,
    billingCycle: 'Monthly',
    features: mockFeatures.slice(0, 7),
    maxUsers: 200,
    storageGB: 500,
    emailAccounts: 200,
    supportLevel: '24/7',
    status: 'Active',
    isPopular: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Enterprise Plan',
    description: 'เหมาะสำหรับองค์กรขนาดใหญ่',
    type: 'Enterprise',
    price: 2999,
    billingCycle: 'Monthly',
    features: mockFeatures,
    maxUsers: 1000,
    storageGB: 2000,
    emailAccounts: 1000,
    supportLevel: '24/7',
    status: 'Active',
    isPopular: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    organizationId: 'org-001',
    organizationName: 'บริษัท เทคโนโลยี จำกัด',
    packageId: '2',
    packageName: 'Standard Plan',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    price: 799,
    billingCycle: 'Monthly',
    autoRenew: true,
    usedUsers: 35,
    usedStorage: 150,
    lastPayment: '2024-01-20'
  },
  {
    id: '2',
    organizationId: 'org-002',
    organizationName: 'บริษัท การตลาด จำกัด',
    packageId: '1',
    packageName: 'Basic Plan',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    price: 299,
    billingCycle: 'Monthly',
    autoRenew: false,
    usedUsers: 8,
    usedStorage: 25,
    lastPayment: '2024-01-15'
  }
];

export default function PackageManagement() {
  const [packages, setPackages] = useState<PackagePlan[]>(mockPackages);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackagePlan | null>(null);
  const [formData, setFormData] = useState<Partial<PackagePlan>>({
    name: '',
    description: '',
    type: 'Basic',
    price: 0,
    billingCycle: 'Monthly',
    features: [],
    maxUsers: 10,
    storageGB: 50,
    emailAccounts: 10,
    supportLevel: 'Basic',
    status: 'Active',
    isPopular: false
  });

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || pkg.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddPackage = () => {
    const newPackage: PackagePlan = {
      id: Date.now().toString(),
      ...formData as PackagePlan,
      features: formData.features || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPackages([...packages, newPackage]);
    setIsAddPackageDialogOpen(false);
    resetForm();
    toast({
      title: "เพิ่มแพ็กเกจสำเร็จ",
      description: "เพิ่มแพ็กเกจใหม่เรียบร้อยแล้ว",
    });
  };

  const handleEditPackage = () => {
    if (!editingPackage) return;
    setPackages(packages.map(pkg => 
      pkg.id === editingPackage.id 
        ? { ...pkg, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : pkg
    ));
    setEditingPackage(null);
    resetForm();
    toast({
      title: "แก้ไขสำเร็จ",
      description: "แก้ไขแพ็กเกจเรียบร้อยแล้ว",
    });
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast({
      title: "ลบสำเร็จ",
      description: "ลบแพ็กเกจเรียบร้อยแล้ว",
    });
  };

  const handleUpgradeSubscription = (subscriptionId: string, packageId: string) => {
    const targetPackage = packages.find(pkg => pkg.id === packageId);
    if (!targetPackage) return;

    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId 
        ? { 
            ...sub, 
            packageId: targetPackage.id,
            packageName: targetPackage.name,
            price: targetPackage.price,
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        : sub
    ));
    toast({
      title: "อัปเกรดสำเร็จ",
      description: `อัปเกรดเป็น ${targetPackage.name} เรียบร้อยแล้ว`,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Basic',
      price: 0,
      billingCycle: 'Monthly',
      features: [],
      maxUsers: 10,
      storageGB: 50,
      emailAccounts: 10,
      supportLevel: 'Basic',
      status: 'Active',
      isPopular: false
    });
  };

  const openEditDialog = (pkg: PackagePlan) => {
    setEditingPackage(pkg);
    setFormData(pkg);
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Basic: "secondary",
      Standard: "default",
      Premium: "destructive",
      Enterprise: "outline"
    };
    const colors = {
      Basic: "text-gray-700",
      Standard: "text-blue-700",
      Premium: "text-purple-700",
      Enterprise: "text-gold-700"
    };
    return <Badge variant={variants[type] || "default"} className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Active: "default",
      Inactive: "secondary",
      Deprecated: "destructive",
      Expired: "destructive",
      Suspended: "destructive",
      Cancelled: "outline"
    };
    const statusText = {
      Active: "เปิดใช้งาน",
      Inactive: "ปิดใช้งาน",
      Deprecated: "เลิกใช้",
      Expired: "หมดอายุ",
      Suspended: "ถูกระงับ",
      Cancelled: "ยกเลิก"
    };
    return <Badge variant={variants[status] || "default"}>{statusText[status as keyof typeof statusText]}</Badge>;
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.status === 'Active' ? sub.price : 0), 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการแพ็กเกจบริการ</h1>
          <p className="text-muted-foreground">จัดการแผนบริการและการสมัครสมาชิก</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            ส่งออก
          </Button>
          <Dialog open={isAddPackageDialogOpen} onOpenChange={setIsAddPackageDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มแพ็กเกจ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>เพิ่มแพ็กเกจใหม่</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อแพ็กเกจ *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="กรอกชื่อแพ็กเกจ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">ประเภท</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">ราคา (บาท)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">รอบการเก็บเงิน</Label>
                  <Select
                    value={formData.billingCycle}
                    onValueChange={(value) => setFormData({ ...formData, billingCycle: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">รายเดือน</SelectItem>
                      <SelectItem value="Yearly">รายปี</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="storageGB">พื้นที่เก็บข้อมูล (GB)</Label>
                  <Input
                    id="storageGB"
                    type="number"
                    value={formData.storageGB}
                    onChange={(e) => setFormData({ ...formData, storageGB: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAccounts">จำนวนอีเมลแอคเคาท์</Label>
                  <Input
                    id="emailAccounts"
                    type="number"
                    value={formData.emailAccounts}
                    onChange={(e) => setFormData({ ...formData, emailAccounts: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportLevel">ระดับการสนับสนุน</Label>
                  <Select
                    value={formData.supportLevel}
                    onValueChange={(value) => setFormData({ ...formData, supportLevel: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Priority">Priority</SelectItem>
                      <SelectItem value="24/7">24/7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">รายละเอียด</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="กรอกรายละเอียดแพ็กเกจ"
                    rows={3}
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                  />
                  <Label htmlFor="isPopular">แพ็กเกจยอดนิยม</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddPackageDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAddPackage}>
                  เพิ่มแพ็กเกจ
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
            <CardTitle className="text-sm font-medium">แพ็กเกจทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การสมัครสมาชิกที่ใช้งาน</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">ต่อเดือน</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แพ็กเกจยอดนิยม</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {packages.filter(pkg => pkg.isPopular).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`relative ${pkg.isPopular ? 'border-primary shadow-lg' : ''}`}>
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  ยอดนิยม
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openEditDialog(pkg)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      แก้ไข
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="py-4">
                <div className="text-3xl font-bold">
                  ฿{pkg.price.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{pkg.billingCycle === 'Monthly' ? 'เดือน' : 'ปี'}
                  </span>
                </div>
                {getTypeBadge(pkg.type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">ผู้ใช้สูงสุด:</span>
                  <span className="text-sm font-medium">{pkg.maxUsers} คน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">พื้นที่เก็บข้อมูล:</span>
                  <span className="text-sm font-medium">{pkg.storageGB} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">อีเมลแอคเคาท์:</span>
                  <span className="text-sm font-medium">{pkg.emailAccounts} บัญชี</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">การสนับสนุน:</span>
                  <span className="text-sm font-medium">{pkg.supportLevel}</span>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">ฟีเจอร์ที่รวม:</h4>
                  <div className="space-y-1">
                    {pkg.features.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="flex items-center gap-2 text-xs">
                        {feature.included ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-600" />
                        )}
                        <span>{feature.name}</span>
                        {feature.limit && (
                          <span className="text-muted-foreground">
                            ({feature.limit} {feature.unit})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {getStatusBadge(pkg.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>การสมัครสมาชิกปัจจุบัน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>องค์กร</TableHead>
                <TableHead>แพ็กเกจ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การใช้งาน</TableHead>
                <TableHead>วันหมดอายุ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => {
                const pkg = packages.find(p => p.id === subscription.packageId);
                const userUtilization = (subscription.usedUsers / (pkg?.maxUsers || 1)) * 100;
                const storageUtilization = (subscription.usedStorage / (pkg?.storageGB || 1)) * 100;
                
                return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="font-medium">{subscription.organizationName}</div>
                      <div className="text-sm text-muted-foreground">{subscription.organizationId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{subscription.packageName}</div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.billingCycle === 'Monthly' ? 'รายเดือน' : 'รายปี'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>ผู้ใช้:</span>
                            <span>{subscription.usedUsers}/{pkg?.maxUsers}</span>
                          </div>
                          <Progress value={userUtilization} className="h-1" />
                        </div>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>Storage:</span>
                            <span>{subscription.usedStorage}/{pkg?.storageGB} GB</span>
                          </div>
                          <Progress value={storageUtilization} className="h-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {subscription.endDate}
                      </div>
                      {subscription.autoRenew && (
                        <Badge variant="outline" className="text-xs mt-1">ต่ออายุอัตโนมัติ</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">฿{subscription.price.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpgradeSubscription(subscription.id, '3')}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            อัปเกรด
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            ต่ออายุ
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            ยกเลิก
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

      {/* Edit Dialog */}
      <Dialog open={editingPackage !== null} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขแพ็กเกจ</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">ชื่อแพ็กเกจ *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรอกชื่อแพ็กเกจ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">ประเภท</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">ราคา (บาท)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-billingCycle">รอบการเก็บเงิน</Label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value) => setFormData({ ...formData, billingCycle: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">รายเดือน</SelectItem>
                  <SelectItem value="Yearly">รายปี</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="edit-storageGB">พื้นที่เก็บข้อมูล (GB)</Label>
              <Input
                id="edit-storageGB"
                type="number"
                value={formData.storageGB}
                onChange={(e) => setFormData({ ...formData, storageGB: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-emailAccounts">จำนวนอีเมลแอคเคาท์</Label>
              <Input
                id="edit-emailAccounts"
                type="number"
                value={formData.emailAccounts}
                onChange={(e) => setFormData({ ...formData, emailAccounts: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-supportLevel">ระดับการสนับสนุน</Label>
              <Select
                value={formData.supportLevel}
                onValueChange={(value) => setFormData({ ...formData, supportLevel: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Priority">Priority</SelectItem>
                  <SelectItem value="24/7">24/7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">รายละเอียด</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="กรอกรายละเอียดแพ็กเกจ"
                rows={3}
              />
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="edit-isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
              />
              <Label htmlFor="edit-isPopular">แพ็กเกจยอดนิยม</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingPackage(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditPackage}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}