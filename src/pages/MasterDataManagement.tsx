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
  List,
  Edit2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

// Dropdown Management Interfaces (moved from DropdownManagement component)
interface DropdownItem {
  id: string;
  value: string;
  label: string;
  isActive: boolean;
  order: number;
}

interface DropdownCategory {
  id: string;
  name: string;
  description: string;
  items: DropdownItem[];
}

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

// Mock data for dropdown categories  
const mockDropdownCategories: DropdownCategory[] = [
  {
    id: '1',
    name: 'Server Locations',
    description: 'สถานที่ตั้งเซิร์ฟเวอร์',
    items: [
      { id: '1', value: 'Data Center A', label: 'Data Center A', isActive: true, order: 1 },
      { id: '2', value: 'Data Center B', label: 'Data Center B', isActive: true, order: 2 },
      { id: '3', value: 'Data Center C', label: 'Data Center C', isActive: true, order: 3 },
      { id: '4', value: 'Cloud Region 1', label: 'Cloud Region 1', isActive: true, order: 4 },
      { id: '5', value: 'Cloud Region 2', label: 'Cloud Region 2', isActive: false, order: 5 },
    ]
  },
  {
    id: '2',
    name: 'Server Types',
    description: 'ประเภทเซิร์ฟเวอร์',
    items: [
      { id: '6', value: 'Web Server', label: 'เว็บเซิร์ฟเวอร์', isActive: true, order: 1 },
      { id: '7', value: 'Database', label: 'ฐานข้อมูล', isActive: true, order: 2 },
      { id: '8', value: 'Mail Server', label: 'เมลเซิร์ฟเวอร์', isActive: true, order: 3 },
      { id: '9', value: 'File Server', label: 'ไฟล์เซิร์ฟเวอร์', isActive: true, order: 4 },
      { id: '10', value: 'Load Balancer', label: 'โหลดบาลานเซอร์', isActive: true, order: 5 },
    ]
  },
  {
    id: '3',
    name: 'Backup Types',
    description: 'ประเภทการสำรองข้อมูล',
    items: [
      { id: '11', value: 'Full Backup', label: 'สำรองข้อมูลแบบเต็ม', isActive: true, order: 1 },
      { id: '12', value: 'Incremental', label: 'สำรองข้อมูลแบบเพิ่มเติม', isActive: true, order: 2 },
      { id: '13', value: 'Differential', label: 'สำรองข้อมูลแบบต่าง', isActive: true, order: 3 },
      { id: '14', value: 'Mirror', label: 'สำรองข้อมูลแบบมิเรอร์', isActive: true, order: 4 },
    ]
  },
  {
    id: '4',
    name: 'Certificate Types',
    description: 'ประเภทใบรับรอง',
    items: [
      { id: '15', value: 'SSL/TLS', label: 'SSL/TLS Certificate', isActive: true, order: 1 },
      { id: '16', value: 'Code Signing', label: 'Code Signing Certificate', isActive: true, order: 2 },
      { id: '17', value: 'Client Certificate', label: 'Client Certificate', isActive: true, order: 3 },
      { id: '18', value: 'Document Signing', label: 'Document Signing Certificate', isActive: true, order: 4 },
    ]
  }
];
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
  { 
    key: "dropdown-management", 
    name: "จัดการ Dropdown", 
    description: "จัดการ Dropdown สำหรับระบบและเซิร์ฟเวอร์",
    icon: List,
    data: [] // ใช้ข้อมูลแยกต่างหาก
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

  // Dropdown Management State
  const [dropdownCategories] = useState<DropdownCategory[]>(mockDropdownCategories);
  const [selectedDropdownCategory, setSelectedDropdownCategory] = useState<DropdownCategory | null>(null);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState<DropdownItem | null>(null);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);

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

  // Dropdown Management Functions
  const handleEditCategory = (category: DropdownCategory) => {
    setSelectedDropdownCategory(category);
    setIsEditCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    toast.success("ลบหมวดหมู่สำเร็จ", {
      description: "ลบหมวดหมู่ Dropdown แล้ว",
    });
  };

  const handleAddItem = (category: DropdownCategory) => {
    setSelectedDropdownCategory(category);
    setIsAddItemDialogOpen(true);
  };

  const handleEditItem = (item: DropdownItem, category: DropdownCategory) => {
    setSelectedDropdownItem(item);
    setSelectedDropdownCategory(category);
    setIsEditItemDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    toast.success("ลบรายการสำเร็จ", {
      description: "ลบรายการใน Dropdown แล้ว",
    });
  };

  const handleToggleItemStatus = (itemId: string) => {
    toast.success("เปลี่ยนสถานะสำเร็จ", {
      description: "เปลี่ยนสถานะรายการแล้ว",
    });
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
            <TabsList className="grid w-full grid-cols-6">
              {masterDataTypes.map((type) => (
                <TabsTrigger key={type.key} value={type.key} className="text-xs">
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {masterDataTypes.map((type) => (
              <TabsContent key={type.key} value={type.key} className="space-y-4">
                {type.key === "dropdown-management" ? (
                  // Dropdown Management Content
                  <div className="space-y-6">
                    {/* Categories Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">หมวดหมู่ทั้งหมด</CardTitle>
                          <List className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dropdownCategories.length}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">รายการทั้งหมด</CardTitle>
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dropdownCategories.reduce((sum, cat) => sum + cat.items.length, 0)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">รายการใช้งาน</CardTitle>
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-success">
                            {dropdownCategories.reduce((sum, cat) => sum + cat.items.filter(item => item.isActive).length, 0)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">รายการไม่ใช้งาน</CardTitle>
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-destructive">
                            {dropdownCategories.reduce((sum, cat) => sum + cat.items.filter(item => !item.isActive).length, 0)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Categories Management */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>จัดการหมวดหมู่ Dropdown</CardTitle>
                          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                            <DialogTrigger asChild>
                              <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                เพิ่มหมวดหมู่
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card">
                              <DialogHeader>
                                <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>ชื่อหมวดหมู่</Label>
                                  <Input placeholder="เช่น Server Locations" />
                                </div>
                                <div className="space-y-2">
                                  <Label>คำอธิบาย</Label>
                                  <Textarea placeholder="อธิบายหมวดหมู่นี้" />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                                  ยกเลิก
                                </Button>
                                <Button onClick={() => {
                                  setIsAddCategoryDialogOpen(false);
                                  toast.success("เพิ่มหมวดหมู่สำเร็จ");
                                }}>เพิ่มหมวดหมู่</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dropdownCategories.map((category) => (
                            <Card key={category.id}>
                              <CardHeader>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <CardTitle className="text-lg">{category.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{category.description}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleAddItem(category)}>
                                      <Plus className="h-4 w-4 mr-2" />
                                      เพิ่มรายการ
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="bg-popover">
                                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                          <Edit2 className="mr-2 h-4 w-4" />
                                          แก้ไขหมวดหมู่
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-destructive">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          ลบหมวดหมู่
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>ลำดับ</TableHead>
                                      <TableHead>ค่า</TableHead>
                                      <TableHead>ป้ายกำกับ</TableHead>
                                      <TableHead>สถานะ</TableHead>
                                      <TableHead>จัดการ</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {category.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.order}</TableCell>
                                        <TableCell className="font-mono">{item.value}</TableCell>
                                        <TableCell>{item.label}</TableCell>
                                        <TableCell>
                                          <Badge 
                                            variant={item.isActive ? "default" : "secondary"}
                                            className="cursor-pointer"
                                            onClick={() => handleToggleItemStatus(item.id)}
                                          >
                                            {item.isActive ? "ใช้งาน" : "ไม่ใช้งาน"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-popover">
                                              <DropdownMenuItem onClick={() => handleEditItem(item, category)}>
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                แก้ไข
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleToggleItemStatus(item.id)}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                {item.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive">
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
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  // Regular Master Data Content
                  <>
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
                  </>
                )}
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

      {/* Dropdown Management Dialogs */}
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขหมวดหมู่</DialogTitle>
          </DialogHeader>
          {selectedDropdownCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อหมวดหมู่</Label>
                <Input defaultValue={selectedDropdownCategory.name} />
              </div>
              <div className="space-y-2">
                <Label>คำอธิบาย</Label>
                <Textarea defaultValue={selectedDropdownCategory.description} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast.success("บันทึกการเปลี่ยนแปลงสำเร็จ", {
                    description: "แก้ไขหมวดหมู่เรียบร้อยแล้ว",
                  });
                  setIsEditCategoryDialogOpen(false);
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึก
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>เพิ่มรายการใหม่ - {selectedDropdownCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ค่า (Value)</Label>
                <Input placeholder="เช่น Data Center D" />
              </div>
              <div className="space-y-2">
                <Label>ป้ายกำกับ (Label)</Label>
                <Input placeholder="เช่น ศูนย์ข้อมูล D" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ลำดับ</Label>
                <Input type="number" placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label>สถานะ</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="active">ใช้งาน</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={() => {
                setIsAddItemDialogOpen(false);
                toast.success("เพิ่มรายการสำเร็จ");
              }}>เพิ่มรายการ</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขรายการ - {selectedDropdownCategory?.name}</DialogTitle>
          </DialogHeader>
          {selectedDropdownItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ค่า (Value)</Label>
                  <Input defaultValue={selectedDropdownItem.value} />
                </div>
                <div className="space-y-2">
                  <Label>ป้ายกำกับ (Label)</Label>
                  <Input defaultValue={selectedDropdownItem.label} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ลำดับ</Label>
                  <Input type="number" defaultValue={selectedDropdownItem.order} />
                </div>
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select defaultValue={selectedDropdownItem.isActive ? "active" : "inactive"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast.success("บันทึกการเปลี่ยนแปลงสำเร็จ", {
                    description: "แก้ไขรายการเรียบร้อยแล้ว",
                  });
                  setIsEditItemDialogOpen(false);
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึก
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterDataManagement;