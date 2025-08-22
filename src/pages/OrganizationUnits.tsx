import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Folder,
  FolderOpen,
  Users,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Building2,
  Network,
} from "lucide-react";

// Mock data for Organization Units
const mockOUs = [
  {
    id: 1,
    name: "บริษัท เอบีซี จำกัด (มหาชน)",
    code: "ABC",
    parentId: null,
    level: 0,
    userCount: 150,
    children: [
      {
        id: 2,
        name: "ฝ่ายเทคโนโลยีสารสนเทศ",
        code: "IT",
        parentId: 1,
        level: 1,
        userCount: 25,
        children: [
          {
            id: 3,
            name: "แผนกพัฒนาระบบ",
            code: "DEV",
            parentId: 2,
            level: 2,
            userCount: 15,
            children: []
          },
          {
            id: 4,
            name: "แผนกโครงสร้างระบบ",
            code: "INFRA",
            parentId: 2,
            level: 2,
            userCount: 10,
            children: []
          }
        ]
      },
      {
        id: 5,
        name: "ฝ่ายทรัพยากรบุคคล",
        code: "HR",
        parentId: 1,
        level: 1,
        userCount: 20,
        children: [
          {
            id: 6,
            name: "แผนกสรรหาบุคลากร",
            code: "RECRUIT",
            parentId: 5,
            level: 2,
            userCount: 8,
            children: []
          },
          {
            id: 7,
            name: "แผนกพัฒนาบุคลากร",
            code: "TRAINING",
            parentId: 5,
            level: 2,
            userCount: 12,
            children: []
          }
        ]
      },
      {
        id: 8,
        name: "ฝ่ายการเงิน",
        code: "FIN",
        parentId: 1,
        level: 1,
        userCount: 30,
        children: [
          {
            id: 9,
            name: "แผนกบัญชี",
            code: "ACC",
            parentId: 8,
            level: 2,
            userCount: 18,
            children: []
          },
          {
            id: 10,
            name: "แผนกงบประมาณ",
            code: "BUDGET",
            parentId: 8,
            level: 2,
            userCount: 12,
            children: []
          }
        ]
      }
    ]
  }
];

const mockUsers = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai@abc-corp.com", ouId: 3 },
  { id: 2, name: "สมหญิง รักสะอาด", email: "somying@abc-corp.com", ouId: 6 },
  { id: 3, name: "วิชาญ เก่งเก็บ", email: "wichan@abc-corp.com", ouId: 9 },
];

const OrganizationUnits = () => {
  const [ous, setOUs] = useState(mockOUs);
  const [expandedOUs, setExpandedOUs] = useState<Set<number>>(new Set([1, 2, 5, 8]));
  const [selectedOU, setSelectedOU] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignUserDialogOpen, setIsAssignUserDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parentId: null as number | null,
  });

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedOUs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOUs(newExpanded);
  };

  const findOUById = (ous: any[], id: number): any => {
    for (const ou of ous) {
      if (ou.id === id) return ou;
      if (ou.children) {
        const found = findOUById(ou.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const addOUToTree = (ous: any[], newOU: any): any[] => {
    return ous.map(ou => {
      if (ou.id === newOU.parentId) {
        return {
          ...ou,
          children: [...ou.children, { ...newOU, children: [] }]
        };
      }
      return {
        ...ou,
        children: ou.children ? addOUToTree(ou.children, newOU) : []
      };
    });
  };

  const updateOUInTree = (ous: any[], updatedOU: any): any[] => {
    return ous.map(ou => {
      if (ou.id === updatedOU.id) {
        return { ...ou, ...updatedOU };
      }
      return {
        ...ou,
        children: ou.children ? updateOUInTree(ou.children, updatedOU) : []
      };
    });
  };

  const deleteOUFromTree = (ous: any[], idToDelete: number): any[] => {
    return ous.filter(ou => ou.id !== idToDelete).map(ou => ({
      ...ou,
      children: ou.children ? deleteOUFromTree(ou.children, idToDelete) : []
    }));
  };

  const handleAddOU = () => {
    if (formData.name && formData.code) {
      const newOU = {
        id: Date.now(),
        ...formData,
        level: selectedOU ? selectedOU.level + 1 : 0,
        userCount: 0,
        children: []
      };

      if (formData.parentId) {
        setOUs(addOUToTree(ous, newOU));
      } else {
        setOUs([...ous, newOU]);
      }

      setFormData({ name: "", code: "", parentId: null });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditOU = () => {
    if (selectedOU && formData.name && formData.code) {
      const updatedOU = { ...selectedOU, ...formData };
      setOUs(updateOUInTree(ous, updatedOU));
      setIsEditDialogOpen(false);
      setSelectedOU(null);
    }
  };

  const handleDeleteOU = (id: number) => {
    setOUs(deleteOUFromTree(ous, id));
  };

  const openEditDialog = (ou: any) => {
    setSelectedOU(ou);
    setFormData({
      name: ou.name,
      code: ou.code,
      parentId: ou.parentId
    });
    setIsEditDialogOpen(true);
  };

  const openAssignDialog = (ou: any) => {
    setSelectedOU(ou);
    setIsAssignUserDialogOpen(true);
  };

  const renderOUTree = (ouList: any[], level: number = 0) => {
    return ouList.map((ou) => (
      <div key={ou.id} className={`ml-${level * 4}`}>
        <div className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-card hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              onClick={() => toggleExpanded(ou.id)}
              disabled={!ou.children || ou.children.length === 0}
            >
              {ou.children && ou.children.length > 0 ? (
                expandedOUs.has(ou.id) ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )
              ) : (
                <Building2 className="h-4 w-4" />
              )}
            </Button>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{ou.name}</span>
                <Badge variant="outline" className="text-xs">
                  {ou.code}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {ou.userCount} คน
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedOU(ou);
                setFormData({ name: "", code: "", parentId: ou.id });
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openAssignDialog(ou)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(ou)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteOU(ou.id)}
              disabled={ou.children && ou.children.length > 0}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        
        {ou.children && 
         ou.children.length > 0 && 
         expandedOUs.has(ou.id) && 
         renderOUTree(ou.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">โครงสร้างองค์กร (OU)</h1>
          <p className="text-muted-foreground mt-1">
            จัดการโครงสร้างหน่วยงานและแผนกในองค์กร
          </p>
        </div>
        <Button onClick={() => {
          setSelectedOU(null);
          setFormData({ name: "", code: "", parentId: null });
          setIsAddDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          เพิ่ม OU หลัก
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OU ทั้งหมด</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">หน่วยงาน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OU ระดับบน</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">องค์กรหลัก</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ฝ่าย/แผนก</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">หน่วยงานย่อย</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกรวม</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">ผู้ใช้งาน</p>
          </CardContent>
        </Card>
      </div>

      {/* OU Tree */}
      <Card>
        <CardHeader>
          <CardTitle>โครงสร้างองค์กร</CardTitle>
          <CardDescription>
            แสดงโครงสร้างหน่วยงานแบบต้นไม้ สามารถจัดการ OU และกำหนดผู้ใช้งานได้
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderOUTree(ous)}
          </div>
        </CardContent>
      </Card>

      {/* Add OU Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle>เพิ่ม OU ใหม่</DialogTitle>
            <DialogDescription>
              สร้างหน่วยงาน/แผนกใหม่ในโครงสร้างองค์กร
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ou-name" className="text-right">
                ชื่อ OU *
              </Label>
              <Input
                id="ou-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ชื่อหน่วยงาน"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ou-code" className="text-right">
                รหัส OU *
              </Label>
              <Input
                id="ou-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="รหัสหน่วยงาน"
                className="col-span-3"
              />
            </div>
            {formData.parentId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  OU แม่
                </Label>
                <div className="col-span-3 text-sm text-muted-foreground">
                  {selectedOU?.name}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleAddOU}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit OU Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไข OU</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูล {selectedOU?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ou-name" className="text-right">
                ชื่อ OU *
              </Label>
              <Input
                id="edit-ou-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ou-code" className="text-right">
                รหัส OU *
              </Label>
              <Input
                id="edit-ou-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditOU}>
              บันทึกการแก้ไข
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign User Dialog */}
      <Dialog open={isAssignUserDialogOpen} onOpenChange={setIsAssignUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>กำหนดผู้ใช้งานใน OU</DialogTitle>
            <DialogDescription>
              เพิ่มผู้ใช้งานเข้า {selectedOU?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label>เลือกผู้ใช้งาน</Label>
              <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      {user.ouId === selectedOU?.id ? "ลบออก" : "เพิ่ม"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAssignUserDialogOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationUnits;