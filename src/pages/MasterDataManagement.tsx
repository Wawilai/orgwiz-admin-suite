import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Database,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Building,
  Users,
  Shield,
  Globe,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

// Master Data Types
interface MasterDataItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for different master data types
const mockOrganizationTypes: MasterDataItem[] = [
  { id: 1, code: "PUBLIC", name: "บริษัทมหาชน", description: "บริษัทจดทะเบียนในตลาดหลักทรัพย์", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "LIMITED", name: "บริษัทจำกัด", description: "บริษัทจำกัดทั่วไป", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "PARTNERSHIP", name: "ห้างหุ้นส่วน", description: "ห้างหุ้นส่วนจำกัด", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockDepartments: MasterDataItem[] = [
  { id: 1, code: "IT", name: "แผนกเทคโนโลยีสารสนเทศ", description: "จัดการระบบและเทคโนโลยี", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "HR", name: "แผนกทรัพยากรบุคคล", description: "จัดการบุคลากรและสวัสดิการ", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "FINANCE", name: "แผนกการเงิน", description: "จัดการเงินและบัญชี", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "MARKETING", name: "แผนกการตลาด", description: "จัดการการตลาดและประชาสัมพันธ์", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockPositions: MasterDataItem[] = [
  { id: 1, code: "CEO", name: "ประธานเจ้าหน้าที่บริหาร", description: "ผู้บริหารสูงสุด", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "MANAGER", name: "ผู้จัดการ", description: "ผู้จัดการระดับกลาง", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "SUPERVISOR", name: "หัวหน้างาน", description: "หัวหน้าทีมงาน", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "STAFF", name: "พนักงาน", description: "พนักงานทั่วไป", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockUserRoles: MasterDataItem[] = [
  { id: 1, code: "SUPER_ADMIN", name: "ผู้ดูแลระบบสูงสุด", description: "สิทธิ์เต็มทั้งระบบ", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "ORG_ADMIN", name: "ผู้ดูแลองค์กร", description: "จัดการผู้ใช้ในองค์กร", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "HR_MANAGER", name: "ผู้จัดการทรัพยากรบุคคล", description: "จัดการข้อมูลบุคลากร", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "USER", name: "ผู้ใช้งานทั่วไป", description: "สิทธิ์การใช้งานพื้นฐาน", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockCountries: MasterDataItem[] = [
  { id: 1, code: "TH", name: "ประเทศไทย", description: "Thailand", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "US", name: "สหรัฐอเมริกา", description: "United States", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "JP", name: "ญี่ปุ่น", description: "Japan", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const masterDataTypes = [
  { 
    key: "organization-types", 
    name: "ประเภทองค์กร", 
    description: "จัดการประเภทขององค์กรต่างๆ",
    icon: Building,
    data: mockOrganizationTypes 
  },
  { 
    key: "departments", 
    name: "แผนก/หน่วยงาน", 
    description: "จัดการแผนกและหน่วยงานต่างๆ",
    icon: Users,
    data: mockDepartments 
  },
  { 
    key: "positions", 
    name: "ตำแหน่งงาน", 
    description: "จัดการตำแหน่งงานต่างๆ",
    icon: Shield,
    data: mockPositions 
  },
  { 
    key: "user-roles", 
    name: "บทบาทผู้ใช้", 
    description: "จัดการบทบาทและสิทธิ์ผู้ใช้",
    icon: Shield,
    data: mockUserRoles 
  },
  { 
    key: "countries", 
    name: "ประเทศ", 
    description: "จัดการข้อมูลประเทศต่างๆ",
    icon: Globe,
    data: mockCountries 
  },
];

const MasterDataManagement = () => {
  const [selectedType, setSelectedType] = useState(masterDataTypes[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
    order: 0,
  });

  const currentType = masterDataTypes.find(type => type.key === selectedType);
  const [currentData, setCurrentData] = useState<MasterDataItem[]>(currentType?.data || []);

  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    if (formData.code && formData.name) {
      const newItem: MasterDataItem = {
        id: Math.max(...currentData.map(i => i.id), 0) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setCurrentData([...currentData, newItem]);
      setFormData({ code: "", name: "", description: "", isActive: true, order: 0 });
      setIsAddDialogOpen(false);
      toast.success("เพิ่มข้อมูลสำเร็จ");
    }
  };

  const handleEdit = () => {
    if (selectedItem && formData.code && formData.name) {
      setCurrentData(currentData.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      ));
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast.success("แก้ไขข้อมูลสำเร็จ");
    }
  };

  const handleDelete = (id: number) => {
    setCurrentData(currentData.filter(item => item.id !== id));
    toast.success("ลบข้อมูลสำเร็จ");
  };

  const handleToggleStatus = (id: number) => {
    setCurrentData(currentData.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
    toast.success("เปลี่ยนสถานะสำเร็จ");
  };

  const openEditDialog = (item: MasterDataItem) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || "",
      isActive: item.isActive,
      order: item.order,
    });
    setIsEditDialogOpen(true);
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    const typeData = masterDataTypes.find(type => type.key === newType);
    setCurrentData(typeData?.data || []);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการข้อมูลหลัก</h1>
          <p className="text-muted-foreground mt-1">
            จัดการข้อมูลหลักที่ใช้ในระบบทั้งหมด
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มข้อมูล
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>เพิ่มข้อมูลใหม่</DialogTitle>
              <DialogDescription>
                เพิ่มข้อมูลใหม่สำหรับ {currentType?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">รหัส *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="รหัส"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">ชื่อ *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ชื่อ"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="คำอธิบาย (ไม่บังคับ)"
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">ลำดับ</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  placeholder="ลำดับ"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleAdd}>
                บันทึก
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ประเภทข้อมูลหลัก</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masterDataTypes.length}</div>
            <p className="text-xs text-muted-foreground">ประเภททั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการทั้งหมด</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {masterDataTypes.reduce((sum, type) => sum + type.data.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใช้งานอยู่</CardTitle>
            <Badge className="bg-success text-success-foreground h-4 w-4 p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.filter(item => item.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">ใน {currentType?.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ไม่ใช้งาน</CardTitle>
            <Badge variant="secondary" className="h-4 w-4 p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.filter(item => !item.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">ใน {currentType?.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different master data types */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลหลัก</CardTitle>
          <CardDescription>เลือกประเภทข้อมูลหลักที่ต้องการจัดการ</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={handleTypeChange} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              {masterDataTypes.map((type) => (
                <TabsTrigger key={type.key} value={type.key} className="text-xs">
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {masterDataTypes.map((type) => (
              <TabsContent key={type.key} value={type.key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <type.icon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหา..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัส</TableHead>
                        <TableHead>ชื่อ</TableHead>
                        <TableHead>คำอธิบาย</TableHead>
                        <TableHead className="text-center">ลำดับ</TableHead>
                        <TableHead className="text-center">สถานะ</TableHead>
                        <TableHead>วันที่อัปเดต</TableHead>
                        <TableHead className="text-right">การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm line-clamp-2">{item.description || "-"}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.order}</TableCell>
                          <TableCell className="text-center">
                            {item.isActive ? (
                              <Badge className="bg-success text-success-foreground">ใช้งาน</Badge>
                            ) : (
                              <Badge variant="secondary">ไม่ใช้งาน</Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.updatedAt}</TableCell>
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
                                <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  แก้ไข
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(item.id)}>
                                  <Settings className="h-4 w-4 mr-2" />
                                  {item.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(item.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูล</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลสำหรับ {currentType?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-code" className="text-right">รหัส *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="รหัส"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">ชื่อ *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ชื่อ"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">คำอธิบาย</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="คำอธิบาย (ไม่บังคับ)"
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-order" className="text-right">ลำดับ</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                placeholder="ลำดับ"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">สถานะ</Label>
              <Select 
                value={formData.isActive ? "active" : "inactive"} 
                onValueChange={(value) => setFormData({...formData, isActive: value === "active"})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEdit}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterDataManagement;