import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

interface OrganizationUnit {
  id: string;
  name: string;
  code?: string;
  parent_unit_id?: string | null;
  organization_id: string;
  description?: string;
  status: string;
  created_at: string;
  userCount?: number;
  children?: OrganizationUnit[];
}

const OrganizationUnits = () => {
  const { isAuthenticated } = useAuth();
  const [ous, setOUs] = useState<OrganizationUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOUs, setExpandedOUs] = useState<Set<string>>(new Set());
  const [selectedOU, setSelectedOU] = useState<OrganizationUnit | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignUserDialogOpen, setIsAssignUserDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parent_unit_id: null as string | null,
    description: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganizationUnits();
    }
  }, [isAuthenticated]);

  const fetchOrganizationUnits = async () => {
    try {
      // Get current user's organization ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from('organization_units')
        .select(`
          *,
          profiles(count)
        `)
        .eq('organization_id', profileData.organization_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Add user count to each OU
      const unitsWithCount = (data || []).map(unit => ({
        ...unit,
        userCount: unit.profiles?.[0]?.count || 0
      }));
      
      // Organize into tree structure
      const treeData = buildTree(unitsWithCount);
      setOUs(treeData);
    } catch (error) {
      console.error('Error fetching organization units:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTree = (units: OrganizationUnit[]): OrganizationUnit[] => {
    const map = new Map();
    const roots: OrganizationUnit[] = [];

    // Initialize all units
    units.forEach(unit => {
      map.set(unit.id, { ...unit, children: [] });
    });

    // Build tree structure
    units.forEach(unit => {
      if (unit.parent_unit_id) {
        const parent = map.get(unit.parent_unit_id);
        if (parent) {
          parent.children.push(map.get(unit.id));
        }
      } else {
        roots.push(map.get(unit.id));
      }
    });

    return roots;
  };

  const toggleExpanded = (id: string) => {
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

  const handleAddOU = async () => {
    if (formData.name && formData.code) {
      try {
        // Get current user's organization ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) throw profileError;

        const { data, error } = await supabase
          .from('organization_units')
          .insert([{
            name: formData.name,
            code: formData.code,
            parent_unit_id: formData.parent_unit_id,
            description: formData.description,
            organization_id: profileData.organization_id,
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        fetchOrganizationUnits(); // Refresh to rebuild tree
        setFormData({ name: "", code: "", parent_unit_id: null, description: "" });
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Error adding organization unit:', error);
      }
    }
  };

  const handleEditOU = async () => {
    if (selectedOU && formData.name && formData.code) {
      try {
        const { error } = await supabase
          .from('organization_units')
          .update({
            name: formData.name,
            code: formData.code,
            description: formData.description,
          })
          .eq('id', selectedOU.id);
        
        if (error) throw error;
        
        fetchOrganizationUnits(); // Refresh to rebuild tree
        setIsEditDialogOpen(false);
        setSelectedOU(null);
      } catch (error) {
        console.error('Error updating organization unit:', error);
      }
    }
  };

  const handleDeleteOU = async (id: string) => {
    try {
      const { error } = await supabase
        .from('organization_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchOrganizationUnits(); // Refresh to rebuild tree
    } catch (error) {
      console.error('Error deleting organization unit:', error);
    }
  };

  const openEditDialog = (ou: OrganizationUnit) => {
    setSelectedOU(ou);
    setFormData({
      name: ou.name,
      code: ou.code || "",
      parent_unit_id: ou.parent_unit_id,
      description: ou.description || ""
    });
    setIsEditDialogOpen(true);
  };

  const openAssignDialog = (ou: OrganizationUnit) => {
    setSelectedOU(ou);
    setIsAssignUserDialogOpen(true);
  };

  const renderOUTree = (ouList: OrganizationUnit[], level: number = 0) => {
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
                setFormData({ name: "", code: "", parent_unit_id: ou.id, description: "" });
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
          setFormData({ name: "", code: "", parent_unit_id: null, description: "" });
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ou-description" className="text-right">
                คำอธิบาย
              </Label>
              <Input
                id="ou-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="คำอธิบาย (ไม่บังคับ)"
                className="col-span-3"
              />
            </div>
            {formData.parent_unit_id && (
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ou-description" className="text-right">
                คำอธิบาย
              </Label>
              <Input
                id="edit-ou-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="คำอธิบาย (ไม่บังคับ)"
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
                  <div className="text-center text-muted-foreground py-4">
                    ยังไม่มีผู้ใช้งานในระบบ
                  </div>
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