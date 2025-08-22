import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
const mockServerLocations: MasterDataItem[] = [
  { id: 1, code: "DC_A", name: "Data Center A", description: "ศูนย์ข้อมูลหลัก", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "DC_B", name: "Data Center B", description: "ศูนย์ข้อมูลสำรอง", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "DC_C", name: "Data Center C", description: "ศูนย์ข้อมูลระยะไกล", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "CLOUD_1", name: "Cloud Region 1", description: "คลาวด์ภูมิภาคที่ 1", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, code: "CLOUD_2", name: "Cloud Region 2", description: "คลาวด์ภูมิภาคที่ 2", isActive: false, order: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockServerTypes: MasterDataItem[] = [
  { id: 1, code: "WEB", name: "เว็บเซิร์ฟเวอร์", description: "เซิร์ฟเวอร์สำหรับเว็บแอปพลิเคชัน", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "DB", name: "ฐานข้อมูล", description: "เซิร์ฟเวอร์ฐานข้อมูล", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "MAIL", name: "เมลเซิร์ฟเวอร์", description: "เซิร์ฟเวอร์จดหมายอิเล็กทรอนิกส์", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "FILE", name: "ไฟล์เซิร์ฟเวอร์", description: "เซิร์ฟเวอร์จัดเก็บไฟล์", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, code: "LB", name: "โหลดบาลานเซอร์", description: "เซิร์ฟเวอร์กระจายโหลด", isActive: true, order: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockBackupTypes: MasterDataItem[] = [
  { id: 1, code: "FULL", name: "สำรองข้อมูลแบบเต็ม", description: "สำรองข้อมูลทั้งหมด", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "INCREMENTAL", name: "สำรองข้อมูลแบบเพิ่มเติม", description: "สำรองข้อมูลส่วนที่เปลี่ยนแปลง", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "DIFFERENTIAL", name: "สำรองข้อมูลแบบต่าง", description: "สำรองข้อมูลที่แตกต่างจากครั้งล่าสุด", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "MIRROR", name: "สำรองข้อมูลแบบมิเรอร์", description: "สำรองข้อมูลแบบสะท้อน", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockCertificateTypes: MasterDataItem[] = [
  { id: 1, code: "SSL_TLS", name: "SSL/TLS Certificate", description: "ใบรับรองการเข้ารหัสเว็บไซต์", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "CODE_SIGN", name: "Code Signing Certificate", description: "ใบรับรองสำหรับลงนามโค้ด", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "CLIENT_CERT", name: "Client Certificate", description: "ใบรับรองสำหรับลูกค้า", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "DOC_SIGN", name: "Document Signing Certificate", description: "ใบรับรองสำหรับลงนามเอกสาร", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
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

// Organization data types
const organizationDataTypes = [
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

// Server data types
const serverDataTypes = [
  { 
    key: "server-locations", 
    name: "สถานที่เซิร์ฟเวอร์", 
    description: "จัดการสถานที่ตั้งเซิร์ฟเวอร์ต่างๆ",
    icon: Database,
    data: mockServerLocations 
  },
  { 
    key: "server-types", 
    name: "ประเภทเซิร์ฟเวอร์", 
    description: "จัดการประเภทของเซิร์ฟเวอร์",
    icon: Database,
    data: mockServerTypes 
  },
  { 
    key: "backup-types", 
    name: "ประเภทการสำรอง", 
    description: "จัดการประเภทการสำรองข้อมูล",
    icon: Database,
    data: mockBackupTypes 
  },
  { 
    key: "certificate-types", 
    name: "ประเภทใบรับรอง", 
    description: "จัดการประเภทใบรับรองดิจิทัล",
    icon: Database,
    data: mockCertificateTypes 
  },
];

// All master data types combined
const masterDataTypes = [...organizationDataTypes, ...serverDataTypes];

const MasterDataManagement = () => {
  const [selectedType, setSelectedType] = useState(masterDataTypes[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null);
  const [accordionValue, setAccordionValue] = useState("organization-group");
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
    
    // Set accordion value based on the selected type
    if (organizationDataTypes.find(type => type.key === newType)) {
      setAccordionValue("organization-group");
    } else if (serverDataTypes.find(type => type.key === newType)) {
      setAccordionValue("server-group");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">จัดการข้อมูลหลัก</h1>
        <p className="text-muted-foreground mt-1">
          จัดการข้อมูลหลักที่ใช้ในระบบทั้งหมด
        </p>
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
            <CardTitle className="text-sm font-medium">ข้อมูลระบบ</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockServerLocations.length + mockServerTypes.length + mockBackupTypes.length + mockCertificateTypes.length}
            </div>
            <p className="text-xs text-muted-foreground">รายการสำหรับระบบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Accordion for different master data types */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ข้อมูลหลัก</CardTitle>
              <CardDescription>เลือกประเภทข้อมูลหลักที่ต้องการจัดการ</CardDescription>
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
        </CardHeader>
        <CardContent>
          <Accordion type="single" value={accordionValue} onValueChange={setAccordionValue} collapsible className="space-y-2">
            {/* Organization Data Group */}
            <AccordionItem value="organization-group" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span className="font-semibold">ข้อมูลองค์กร</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {organizationDataTypes.map((type) => (
                    <Button
                      key={type.key}
                      variant={selectedType === type.key ? "default" : "ghost"}
                      className="w-full justify-start h-auto py-3"
                      onClick={() => handleTypeChange(type.key)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <type.icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{type.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Server Data Group */}
            <AccordionItem value="server-group" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <span className="font-semibold">ข้อมูลเซิร์ฟเวอร์</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {serverDataTypes.map((type) => (
                    <Button
                      key={type.key}
                      variant={selectedType === type.key ? "default" : "ghost"}
                      className="w-full justify-start h-auto py-3"
                      onClick={() => handleTypeChange(type.key)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <type.icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{type.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Data Display Section */}
          {currentType && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <currentType.icon className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{currentType.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentType.description}</p>
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
            </div>
          )}
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