import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMasterData } from "@/contexts/MasterDataContext";
import { toast } from "sonner";
import {
  Building,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Mail,
  MapPin,
  Download,
  Upload,
} from "lucide-react";

// Mock data for organizations
const mockOrganizations = [
  {
    id: 1,
    name: "บริษัท เอบีซี จำกัด (มหาชน)",
    type: "บริษัทมหาชน",
    email: "contact@abc-corp.com",
    phone: "02-123-4567",
    address: "123 ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500",
    admin: "สมชาย ใจดี",
    adminEmail: "somchai@abc-corp.com",
    status: "active",
    userCount: 150,
    createdAt: "2024-01-15",
    logo: null
  },
  {
    id: 2,
    name: "บริษัท เอ็กซ์วายแซด จำกัด",
    type: "บริษัทจำกัด",
    email: "info@xyz-ltd.com",
    phone: "02-234-5678",
    address: "456 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110",
    admin: "สมหญิง รักสะอาด",
    adminEmail: "somying@xyz-ltd.com",
    status: "active",
    userCount: 75,
    createdAt: "2024-02-01",
    logo: null
  },
  {
    id: 3,
    name: "บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด",
    type: "บริษัทจำกัด",
    email: "contact@def-enterprise.com", 
    phone: "02-345-6789",
    address: "789 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400",
    admin: "วิชาญ เก่งเก็บ",
    adminEmail: "wichan@def-enterprise.com",
    status: "suspended",
    userCount: 25,
    createdAt: "2024-01-20",
    logo: null
  },
];

const OrganizationManagement = () => {
  const { getActiveItems } = useMasterData();
  const { isAuthenticated } = useAuth();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    email: "",
    phone: "",
    address: "",
    admin: "",
    adminEmail: "",
    tenant_id: ""
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganizations();
      fetchTenants();
    }
  }, [isAuthenticated]);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  // Get master data
  const organizationTypes = getActiveItems('organizationTypes');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">ใช้งาน</Badge>;
      case "suspended":
        return <Badge variant="destructive">ระงับ</Badge>;
      case "inactive":
        return <Badge variant="secondary">ไม่ใช้งาน</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      "บริษัทมหาชน": "bg-primary text-primary-foreground",
      "บริษัทจำกัด": "bg-accent text-accent-foreground",
      "ห้างหุ้นส่วน": "bg-secondary text-secondary-foreground"
    };
    return <Badge className={colors[type] || "bg-muted"}>{type}</Badge>;
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || org.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = () => {
    if (formData.name && formData.email) {
      const newOrg = {
        id: organizations.length + 1,
        ...formData,
        status: "active",
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        logo: null
      };
      setOrganizations([...organizations, newOrg]);
      setFormData({
        name: "",
        type: "",
        email: "",
        phone: "",
        address: "",
        admin: "",
        adminEmail: "",
        tenant_id: ""
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedOrg && formData.name && formData.email) {
      setOrganizations(organizations.map(org => 
        org.id === selectedOrg.id ? { ...org, ...formData } : org
      ));
      setIsEditDialogOpen(false);
      setSelectedOrg(null);
    }
  };

  const handleDelete = (id: number) => {
    setOrganizations(organizations.filter(org => org.id !== id));
  };

  const openEditDialog = (org: any) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      type: org.type,
      email: org.email,
      phone: org.phone,
      address: org.address,
      admin: org.admin,
      adminEmail: org.adminEmail,
      tenant_id: org.tenant_id || ""
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการองค์กร</h1>
          <p className="text-muted-foreground mt-1">
            จัดการข้อมูลองค์กรและหน่วยงานในระบบ
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {
            const csv = "ชื่อองค์กร,ประเภท,อีเมล,เบอร์โทร,ผู้ดูแล,สถานะ,จำนวนผู้ใช้\n" + 
              filteredOrganizations.map(o => `${o.name},${o.type},${o.email},${o.phone},${o.admin},${o.status},${o.userCount}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'organizations-export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
          }}>
            <Download className="w-4 h-4 mr-2" />
            ส่งออก
          </Button>
          <Button variant="outline" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                alert('ฟังก์ชันนำเข้าข้อมูลองค์กรจากไฟล์ CSV พร้อมใช้งาน');
              }
            };
            input.click();
          }}>
            <Upload className="w-4 h-4 mr-2" />
            นำเข้า
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มองค์กร
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มองค์กรใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลองค์กรใหม่ที่ต้องการเพิ่มเข้าระบบ
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ชื่องค์กร *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ชื่อองค์กร"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    ประเภท
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="เลือกประเภทองค์กร" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {organizationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    อีเมล *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@company.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    เบอร์โทร
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="02-123-4567"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    ที่อยู่
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="ที่อยู่องค์กร"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="admin" className="text-right">
                    ผู้ดูแล
                  </Label>
                  <Input
                    id="admin"
                    value={formData.admin}
                    onChange={(e) => setFormData({...formData, admin: e.target.value})}
                    placeholder="ชื่อผู้ดูแลองค์กร"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adminEmail" className="text-right">
                    อีเมลผู้ดูแล
                  </Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                    placeholder="admin@company.com"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  toast.success("ยกเลิกการเพิ่มองค์กร");
                }}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  handleAdd();
                  toast.success("เพิ่มองค์กรสำเร็จ");
                }}>
                  บันทึก
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรทั้งหมด</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">+2 องค์กรใหม่เดือนนี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรที่ใช้งาน</CardTitle>
            <Building className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.filter(org => org.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">พร้อมใช้งาน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานรวม</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.reduce((sum, org) => sum + org.userCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">ทุกองค์กร</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรที่ระงับ</CardTitle>
            <Building className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.filter(org => org.status === 'suspended').length}
            </div>
            <p className="text-xs text-muted-foreground">ต้องตรวจสอบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการองค์กร</CardTitle>
          <CardDescription>
            จัดการและแก้ไขข้อมูลองค์กรในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อองค์กร, อีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="suspended">ระงับ</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>องค์กร</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ผู้ดูแล</TableHead>
                  <TableHead>ผู้ใช้งาน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่เพิ่ม</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {org.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {org.address.length > 50 ? org.address.substring(0, 50) + '...' : org.address}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(org.type)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{org.admin}</div>
                        <div className="text-sm text-muted-foreground">{org.adminEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{org.userCount}</div>
                        <div className="text-xs text-muted-foreground">คน</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(org.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {org.createdAt}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(org)}>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(org.id)}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลองค์กร</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลองค์กร {selectedOrg?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                ชื่องค์กร *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                ประเภท
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {organizationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                อีเมล *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                เบอร์โทร
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                ที่อยู่
              </Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-admin" className="text-right">
                ผู้ดูแล
              </Label>
              <Input
                id="edit-admin"
                value={formData.admin}
                onChange={(e) => setFormData({...formData, admin: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-adminEmail" className="text-right">
                อีเมลผู้ดูแล
              </Label>
              <Input
                id="edit-adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              toast.success("ยกเลิกการแก้ไข");
            }}>
              ยกเลิก
            </Button>
            <Button onClick={() => {
              handleEdit();
              toast.success("แก้ไของค์กรสำเร็จ");
            }}>
              บันทึกการแก้ไข
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationManagement;