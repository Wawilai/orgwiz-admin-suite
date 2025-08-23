import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MasterDataItem {
  id: string;
  code: string;
  name: string;
  name_en?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  type_id: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

interface MasterDataType {
  id: string;
  type_name: string;
  name_en?: string;
  description?: string;
  is_system_type: boolean;
  created_at: string;
}

const fetchMasterDataTypes = async () => {
  const { data, error } = await supabase
    .from('master_data_types')
    .select('*')
    .order('type_name');
  
  if (error) {
    console.error('Error fetching master data types:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลประเภทมาสเตอร์ดาต้าได้",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

const fetchMasterDataItems = async (typeId: string) => {
  const { data, error } = await supabase
    .from('master_data_items')
    .select('*')
    .eq('type_id', typeId)
    .order('sort_order');
  
  if (error) {
    console.error('Error fetching master data items:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลรายการมาสเตอร์ดาต้าได้",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

const createMasterDataItem = async (itemData: any) => {
  const { data, error } = await supabase
    .from('master_data_items')
    .insert([itemData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating master data item:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถเพิ่มข้อมูลมาสเตอร์ดาต้าได้",
      variant: "destructive",
    });
    return null;
  }
  
  return data;
};

const updateMasterDataItem = async (id: string, itemData: any) => {
  const { error } = await supabase
    .from('master_data_items')
    .update(itemData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating master data item:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถแก้ไขข้อมูลมาสเตอร์ดาต้าได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const deleteMasterDataItem = async (id: string) => {
  const { error } = await supabase
    .from('master_data_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting master data item:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถลบข้อมูลมาสเตอร์ดาต้าได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const MasterDataManagement = () => {
  const { user } = useAuth();
  const [masterDataTypes, setMasterDataTypes] = useState<MasterDataType[]>([]);
  const [masterDataItems, setMasterDataItems] = useState<MasterDataItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    name_en: "",
    description: "",
    is_active: true,
    sort_order: 1
  });

  useEffect(() => {
    loadMasterDataTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadMasterDataItems();
    }
  }, [selectedType]);

  const loadMasterDataTypes = async () => {
    setLoading(true);
    const types = await fetchMasterDataTypes();
    setMasterDataTypes(types);
    if (types.length > 0) {
      setSelectedType(types[0].id);
    }
    setLoading(false);
  };

  const loadMasterDataItems = async () => {
    if (!selectedType) return;
    
    const items = await fetchMasterDataItems(selectedType);
    setMasterDataItems(items);
  };

  const filteredItems = masterDataItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentType = masterDataTypes.find(type => type.id === selectedType);

  const handleAdd = async () => {
    if (!user || !selectedType) return;
    
    setSubmitting(true);
    const itemData = {
      ...formData,
      type_id: selectedType,
      organization_id: user.user_metadata?.organization_id || null
    };
    
    const newItem = await createMasterDataItem(itemData);
    if (newItem) {
      await loadMasterDataItems();
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "เพิ่มข้อมูลสำเร็จ",
        description: `เพิ่ม "${formData.name}" เรียบร้อยแล้ว`,
      });
    }
    setSubmitting(false);
  };

  const handleEdit = async () => {
    if (!selectedItem) return;
    
    setSubmitting(true);
    const success = await updateMasterDataItem(selectedItem.id, formData);
    if (success) {
      await loadMasterDataItems();
      setSelectedItem(null);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "แก้ไขสำเร็จ",
        description: `แก้ไข "${formData.name}" เรียบร้อยแล้ว`,
      });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const success = await deleteMasterDataItem(id);
    if (success) {
      await loadMasterDataItems();
      toast({
        title: "ลบสำเร็จ",
        description: `ลบ "${name}" เรียบร้อยแล้ว`,
      });
    }
  };

  const handleToggleStatus = async (item: MasterDataItem) => {
    const success = await updateMasterDataItem(item.id, { is_active: !item.is_active });
    if (success) {
      await loadMasterDataItems();
      toast({
        title: "เปลี่ยนสถานะสำเร็จ",
        description: `เปลี่ยนสถานะ "${item.name}" เรียบร้อยแล้ว`,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      name_en: "",
      description: "",
      is_active: true,
      sort_order: 1
    });
  };

  const openEditDialog = (item: MasterDataItem) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      name_en: item.name_en || "",
      description: item.description || "",
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">กำลังโหลดข้อมูล...</div>;
  }

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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>เพิ่มข้อมูลใหม่</DialogTitle>
              <DialogDescription>
                เพิ่มข้อมูลใหม่สำหรับ {currentType?.type_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">รหัส *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="รหัส (เช่น ORG_001)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ชื่อ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">ชื่อ (ภาษาอังกฤษ)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="English Name (Optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="คำอธิบาย (ไม่บังคับ)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">ลำดับ</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                  placeholder="ลำดับ"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <LoadingButton loading={submitting} onClick={handleAdd}>
                บันทึก
              </LoadingButton>
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
            <div className="text-2xl font-bold">{masterDataItems.length}</div>
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
              {masterDataItems.filter(item => item.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">ใช้งานอยู่</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ไม่ใช้งาน</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {masterDataItems.filter(item => !item.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">ไม่ใช้งาน</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ข้อมูลหลัก</CardTitle>
              <CardDescription>เลือกประเภทข้อมูลหลักที่ต้องการจัดการ</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="เลือกประเภทข้อมูล" />
                </SelectTrigger>
                <SelectContent>
                  {masterDataTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentType && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{currentType.type_name}</h3>
                  <p className="text-sm text-muted-foreground">{currentType.description}</p>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัส</TableHead>
                      <TableHead>ชื่อ</TableHead>
                      <TableHead>ชื่อ (EN)</TableHead>
                      <TableHead>คำอธิบาย</TableHead>
                      <TableHead className="text-center">ลำดับ</TableHead>
                      <TableHead className="text-center">สถานะ</TableHead>
                      <TableHead>วันที่อัปเดต</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm">
                            {item.name_en || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm line-clamp-2">{item.description || "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.sort_order}</TableCell>
                        <TableCell className="text-center">
                          {item.is_active ? (
                            <Badge className="bg-success text-success-foreground">ใช้งาน</Badge>
                          ) : (
                            <Badge variant="secondary">ไม่ใช้งาน</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(item.updated_at).toLocaleDateString('th-TH')}
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
                              <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                <Edit className="h-4 w-4 mr-2" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(item)}>
                                <Settings className="h-4 w-4 mr-2" />
                                {item.is_active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(item.id, item.name)}
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
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีข้อมูลในประเภทนี้'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูล</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลสำหรับ {currentType?.type_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">รหัส *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="รหัส"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">ชื่อ *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ชื่อ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name_en">ชื่อ (ภาษาอังกฤษ)</Label>
              <Input
                id="edit-name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="English Name (Optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">คำอธิบาย</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="คำอธิบาย (ไม่บังคับ)"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sort_order">ลำดับ</Label>
                <Input
                  id="edit-sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                  placeholder="ลำดับ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">สถานะ</Label>
                <Select 
                  value={formData.is_active ? "active" : "inactive"} 
                  onValueChange={(value) => setFormData({ ...formData, is_active: value === "active" })}
                >
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
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <LoadingButton loading={submitting} onClick={handleEdit}>
              บันทึก
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterDataManagement;