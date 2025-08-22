import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import {
  Building2,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  UserCheck,
  Settings
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  type: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  adminId?: string;
  adminName?: string;
  createdDate: string;
  status: 'active' | 'inactive' | 'suspended';
  employeeCount: number;
  description?: string;
}

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'บริษัท เทคโนโลยี ABC จำกัด',
    type: 'เอกชน',
    address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
    phone: '02-234-5678',
    email: 'contact@abc-tech.com',
    website: 'www.abc-tech.com',
    adminName: 'นายสมชาย ใจดี',
    createdDate: '2023-01-15',
    status: 'active',
    employeeCount: 250,
    description: 'บริษัทพัฒนาซอฟต์แวร์และให้บริการด้าน IT'
  },
  {
    id: '2',
    name: 'มหาวิทยาลัยเทคโนโลยี XYZ',
    type: 'การศึกษา',
    address: '456 ถนนพหลโยธิน กรุงเทพฯ 10400',
    phone: '02-345-6789',
    email: 'info@xyz-uni.ac.th',
    website: 'www.xyz-uni.ac.th',
    adminName: 'ผศ.ดร.วิชาญ เก่งกาจ',
    createdDate: '2022-08-20',
    status: 'active',
    employeeCount: 1200,
    description: 'สถาบันการศึกษาระดับอุดมศึกษา'
  },
  {
    id: '3',
    name: 'โรงพยาบาล สุขภาพดี',
    type: 'สาธารณสุข',
    address: '789 ถนนราชดำริ กรุงเทพฯ 10330',
    phone: '02-456-7890',
    email: 'contact@healthgood.co.th',
    website: 'www.healthgood.co.th',
    adminName: 'นพ.สุขสันต์ ใจเย็น',
    createdDate: '2021-12-01',
    status: 'inactive',
    employeeCount: 450,
    description: 'โรงพยาบาลเอกชน ให้บริการด้านสุขภาพครบวงจร'
  }
];

export default function EnhancedOrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    const matchesType = typeFilter === 'all' || org.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">ใช้งาน</Badge>;
      case 'inactive':
        return <Badge variant="secondary">ไม่ใช้งาน</Badge>;
      case 'suspended':
        return <Badge variant="destructive">ระงับ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateOrganization = () => {
    toast({
      title: "สร้างองค์กรสำเร็จ",
      description: "เพิ่มองค์กรใหม่เข้าระบบเรียบร้อยแล้ว",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditOrganization = () => {
    toast({
      title: "แก้ไของค์กรสำเร็จ",
      description: "บันทึกข้อมูลองค์กรเรียบร้อยแล้ว",
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteOrganization = (orgId: string) => {
    setOrganizations(organizations.filter(org => org.id !== orgId));
    toast({
      title: "ลบองค์กรสำเร็จ",
      description: "ลบข้อมูลองค์กรออกจากระบบแล้ว",
    });
  };

  const handleExportData = () => {
    toast({
      title: "กำลังส่งออกข้อมูล",
      description: "ไฟล์จะถูกดาวน์โหลดในอีกสักครู่",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการองค์กร</h1>
          <p className="text-muted-foreground mt-1">
            บริหารจัดการข้อมูลองค์กร (Tenant) และผู้ดูแลระบบ
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            ส่งออก
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            นำเข้า
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มองค์กร
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>เพิ่มองค์กรใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลสำหรับเพิ่มองค์กรใหม่เข้าสู่ระบบ
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">ชื่อองค์กร *</Label>
                    <Input
                      id="org-name"
                      placeholder="บริษัท ABC จำกัด"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-type">ประเภทองค์กร *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="private">เอกชน</SelectItem>
                        <SelectItem value="government">รัฐบาล</SelectItem>
                        <SelectItem value="education">การศึกษา</SelectItem>
                        <SelectItem value="healthcare">สาธารณสุข</SelectItem>
                        <SelectItem value="nonprofit">ไม่แสวงหาผลกำไร</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-address">ที่อยู่องค์กร *</Label>
                  <Textarea
                    id="org-address"
                    placeholder="123 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="org-phone"
                      placeholder="02-234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-email">อีเมลองค์กร</Label>
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-website">เว็บไซต์</Label>
                    <Input
                      id="org-website"
                      placeholder="www.company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-admin">ผู้ดูแลองค์กร</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกผู้ดูแล" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="admin1">นายสมชาย ใจดี</SelectItem>
                        <SelectItem value="admin2">นางสาววิชาญ เก่งกาจ</SelectItem>
                        <SelectItem value="admin3">นายสุรชัย มั่นคง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-description">คำอธิบายองค์กร</Label>
                  <Textarea
                    id="org-description"
                    placeholder="รายละเอียดเกี่ยวกับองค์กร..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-logo">โลโก้องค์กร</Label>
                  <Input
                    id="org-logo"
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleCreateOrganization}>
                  บันทึก
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรทั้งหมด</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 จากเดือนที่แล้ว
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรใหม่</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              ในเดือนนี้
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานรวม</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.reduce((sum, org) => sum + org.employeeCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              ผู้ใช้งานในทุกองค์กร
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรที่ใช้งาน</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.filter(org => org.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              กำลังใช้งานระบบ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>รายการองค์กร</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อองค์กร, อีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                <SelectItem value="suspended">ระงับ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">ประเภททั้งหมด</SelectItem>
                <SelectItem value="เอกชน">เอกชน</SelectItem>
                <SelectItem value="รัฐบาล">รัฐบาล</SelectItem>
                <SelectItem value="การศึกษา">การศึกษา</SelectItem>
                <SelectItem value="สาธารณสุข">สาธารณสุข</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organizations Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">องค์กร</TableHead>
                  <TableHead className="min-w-[150px]">ประเภท</TableHead>
                  <TableHead className="min-w-[200px]">ติดต่อ</TableHead>
                  <TableHead className="min-w-[150px]">ผู้ดูแล</TableHead>
                  <TableHead className="min-w-[100px]">จำนวนพนักงาน</TableHead>
                  <TableHead className="min-w-[120px]">สถานะ</TableHead>
                  <TableHead className="text-right min-w-[100px]">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={org.logo} />
                          <AvatarFallback>
                            {org.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {org.website}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {org.email}
                        </div>
                        <div className="text-sm flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {org.phone}
                        </div>
                        <div className="text-sm flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {org.address.substring(0, 30)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {org.adminName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{org.adminName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{org.employeeCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">คน</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(org.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => {
                            setSelectedOrg(org);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            ตั้งค่า
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteOrganization(org.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedOrg && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลองค์กร</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลรายละเอียดขององค์กร
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-org-name">ชื่อองค์กร *</Label>
                  <Input
                    id="edit-org-name"
                    defaultValue={selectedOrg.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-org-type">ประเภทองค์กร *</Label>
                  <Select defaultValue={selectedOrg.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="เอกชน">เอกชน</SelectItem>
                      <SelectItem value="รัฐบาล">รัฐบาล</SelectItem>
                      <SelectItem value="การศึกษา">การศึกษา</SelectItem>
                      <SelectItem value="สาธารณสุข">สาธารณสุข</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-org-address">ที่อยู่องค์กร *</Label>
                <Textarea
                  id="edit-org-address"
                  defaultValue={selectedOrg.address}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-org-phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="edit-org-phone"
                    defaultValue={selectedOrg.phone}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-org-email">อีเมลองค์กร</Label>
                  <Input
                    id="edit-org-email"
                    defaultValue={selectedOrg.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-org-website">เว็บไซต์</Label>
                  <Input
                    id="edit-org-website"
                    defaultValue={selectedOrg.website}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-org-status">สถานะ</Label>
                  <Select defaultValue={selectedOrg.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                      <SelectItem value="suspended">ระงับ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleEditOrganization}>
                บันทึกการแก้ไข
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}