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
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit2,
  Trash2,
  MoreHorizontal,
  Settings,
  List,
  Save
} from 'lucide-react';

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

export function DropdownManagement() {
  const [categories] = useState<DropdownCategory[]>(mockDropdownCategories);
  const [selectedCategory, setSelectedCategory] = useState<DropdownCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);

  const handleEditCategory = (category: DropdownCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    toast({
      title: "ลบหมวดหมู่สำเร็จ",
      description: "ลบหมวดหมู่ Dropdown แล้ว",
    });
  };

  const handleAddItem = (category: DropdownCategory) => {
    setSelectedCategory(category);
    setIsAddItemDialogOpen(true);
  };

  const handleEditItem = (item: DropdownItem, category: DropdownCategory) => {
    setSelectedItem(item);
    setSelectedCategory(category);
    setIsEditItemDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    toast({
      title: "ลบรายการสำเร็จ",
      description: "ลบรายการใน Dropdown แล้ว",
    });
  };

  const handleToggleItemStatus = (itemId: string) => {
    toast({
      title: "เปลี่ยนสถานะสำเร็จ",
      description: "เปลี่ยนสถานะรายการแล้ว",
    });
  };

  return (
    <div className="space-y-6">
      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมวดหมู่ทั้งหมด</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการทั้งหมด</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.items.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการใช้งาน</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat.items.filter(item => item.isActive).length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการไม่ใช้งาน</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {categories.reduce((sum, cat) => sum + cat.items.filter(item => !item.isActive).length, 0)}
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
              <DialogContent>
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
                  <Button>เพิ่มหมวดหมู่</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            แก้ไขหมวดหมู่
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-red-600">
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
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditItem(item, category)}>
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  แก้ไข
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleItemStatus(item.id)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  {item.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-600">
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขหมวดหมู่</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อหมวดหมู่</Label>
                <Input defaultValue={selectedCategory.name} />
              </div>
              <div className="space-y-2">
                <Label>คำอธิบาย</Label>
                <Textarea defaultValue={selectedCategory.description} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "บันทึกการเปลี่ยนแปลงสำเร็จ",
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มรายการใหม่ - {selectedCategory?.name}</DialogTitle>
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
                  <SelectContent>
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
              <Button>เพิ่มรายการ</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขรายการ - {selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ค่า (Value)</Label>
                  <Input defaultValue={selectedItem.value} />
                </div>
                <div className="space-y-2">
                  <Label>ป้ายกำกับ (Label)</Label>
                  <Input defaultValue={selectedItem.label} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ลำดับ</Label>
                  <Input type="number" defaultValue={selectedItem.order} />
                </div>
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select defaultValue={selectedItem.isActive ? "active" : "inactive"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  toast({
                    title: "บันทึกการเปลี่ยนแปลงสำเร็จ",
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
}