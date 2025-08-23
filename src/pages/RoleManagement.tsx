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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Settings,
  Download,
  Upload,
  Key,
} from "lucide-react";

// Updated role types to match new enum
const systemRoles = [
  {
    id: 'global_admin',
    name: "Global Admin",
    description: "ผู้ดูแลระบบทั่วโลก มีสิทธิ์เต็มทั้งระบบทุก Tenant",
    permissions: ["all_permissions"],
    isSystem: true,
  },
  {
    id: 'tenant_admin',
    name: "Tenant Admin", 
    description: "ผู้ดูแล Tenant สามารถจัดการองค์กรภายใน Tenant",
    permissions: ["manage_organizations", "manage_users", "view_reports"],
    isSystem: true,
  },
  {
    id: 'org_admin',
    name: "Organization Admin",
    description: "ผู้ดูแลองค์กร จัดการผู้ใช้และข้อมูลภายในองค์กร",
    permissions: ["manage_org_users", "manage_org_data", "view_org_reports"],
    isSystem: true,
  },
  {
    id: 'domain_admin',
    name: "Domain Admin",
    description: "ผู้ดูแลโดเมน จัดการโดเมนและอีเมล",
    permissions: ["manage_domains", "manage_email", "view_mail_reports"],
    isSystem: true,
  },
  {
    id: 'system_security',
    name: "System Security",
    description: "ผู้ดูแลความปลอดภัยระบบ",
    permissions: ["manage_security", "view_audit_logs", "manage_policies"],
    isSystem: true,
  },
  {
    id: 'manager',
    name: "Manager",
    description: "ผู้จัดการ มีสิทธิ์จัดการทีมและดูรายงาน",
    permissions: ["manage_team", "view_reports"],
    isSystem: false,
  },
  {
    id: 'user',
    name: "User",
    description: "ผู้ใช้งานทั่วไป ใช้บริการพื้นฐาน",
    permissions: ["use_basic_services", "manage_profile"],
    isSystem: false,
  }
];

const mockPermissions = [
  { id: "user_create", name: "สร้างผู้ใช้", category: "User Management" },
  { id: "user_read", name: "ดูข้อมูลผู้ใช้", category: "User Management" },
  { id: "user_update", name: "แก้ไขผู้ใช้", category: "User Management" },
  { id: "user_delete", name: "ลบผู้ใช้", category: "User Management" },
  { id: "org_create", name: "สร้างองค์กร", category: "Organization" },
  { id: "org_read", name: "ดูข้อมูลองค์กร", category: "Organization" },
  { id: "org_update", name: "แก้ไของค์กร", category: "Organization" },
  { id: "org_delete", name: "ลบองค์กร", category: "Organization" },
  { id: "mail_manage", name: "จัดการอีเมล", category: "Mail Service" },
  { id: "mail_read", name: "อ่านอีเมล", category: "Mail Service" },
  { id: "system_config", name: "ตั้งค่าระบบ", category: "System" },
  { id: "report_read", name: "ดูรายงาน", category: "Reports" },
  { id: "profile_read", name: "ดูโปรไฟล์", category: "Profile" },
  { id: "profile_update", name: "แก้ไขโปรไฟล์", category: "Profile" },
  { id: "calendar_read", name: "ดูปฏิทิน", category: "Calendar" },
];

const RoleManagement = () => {
  const { isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchRoles();
      fetchUserRoles();
    }
  }, [isAuthenticated]);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Combine system roles with database roles
      const combinedRoles = [
        ...systemRoles.map((role, index) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          isSystem: role.isSystem,
          userCount: 0,
          createdAt: '2024-01-01'
        })),
        ...(data || []).map(role => ({
          ...role,
          userCount: 0,
          createdAt: role.created_at?.split('T')[0] || '2024-01-01'
        }))
      ];
      
      setRoles(combinedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }  
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles:profiles!user_roles_user_id_fkey (
            id,
            user_id,
            first_name,
            last_name,
            email,
            position,
            organization_units:organization_units!profiles_organization_unit_id_fkey (name)
          ),
          roles:roles!user_roles_role_id_fkey (
            id,
            name,
            description,
            role_type
          )
        `)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPermissions = mockPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, typeof mockPermissions>);

  const handleAdd = async () => {
    if (formData.name) {
      try {
        const { data, error } = await supabase
          .from('roles')
          .insert([{
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
            role_type: 'user' // Default role type
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        const newRole = {
          ...data,
          userCount: 0,
          isSystem: false,
          createdAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        };
        
        setRoles([...roles, newRole]);
        setFormData({ name: "", description: "", permissions: [] });
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Error adding role:', error);
      }
    }
  };

  const handleEdit = async () => {
    if (selectedRole && formData.name) {
      try {
        const { error } = await supabase
          .from('roles')
          .update({
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions
          })
          .eq('id', selectedRole.id);
        
        if (error) throw error;
        
        setRoles(roles.map(role => 
          role.id === selectedRole.id ? { ...role, ...formData } : role
        ));
        setIsEditDialogOpen(false);
        setSelectedRole(null);
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };

  const handleDelete = async (id: string | number) => {
    const roleToDelete = roles.find(r => r.id === id);
    if (roleToDelete?.isSystem) return; // ป้องกันการลบ role ระบบ
    
    try {
      if (typeof id === 'string' && !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        // System role with string ID - cannot delete
        return;
      }
      
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', String(id));
      
      if (error) throw error;
      
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const openEditDialog = (role: any) => {
    if (role.isSystem) return; // ป้องกันการแก้ไข role ระบบ
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    const newPermissions = formData.permissions.includes(permissionId)
      ? formData.permissions.filter(p => p !== permissionId)
      : [...formData.permissions, permissionId];
    setFormData({ ...formData, permissions: newPermissions });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการบทบาทและสิทธิ์</h1>
          <p className="text-muted-foreground mt-1">
            กำหนดบทบาทผู้ใช้และสิทธิ์การเข้าถึงระบบ
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ส่งออก
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            นำเข้า
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มบทบาท
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มบทบาทใหม่</DialogTitle>
                <DialogDescription>
                  สร้างบทบาทใหม่และกำหนดสิทธิ์การเข้าถึง
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role-name" className="text-right">
                    ชื่อบทบาท *
                  </Label>
                  <Input
                    id="role-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ชื่อบทบาท"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="role-desc" className="text-right pt-2">
                    คำอธิบาย
                  </Label>
                  <Textarea
                    id="role-desc"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="อธิบายบทบาทและหน้าที่"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="col-span-4">
                  <Label className="text-sm font-medium mb-3 block">สิทธิ์การเข้าถึง</Label>
                  <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm mb-2 text-primary">{category}</h4>
                        <div className="grid grid-cols-2 gap-2 ml-4">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={formData.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บทบาททั้งหมด</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">+2 บทบาทเดือนนี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บทบาทระบบ</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter(r => r.isSystem).length}
            </div>
            <p className="text-xs text-muted-foreground">ไม่สามารถแก้ไขได้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สิทธิ์ทั้งหมด</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPermissions.length}</div>
            <p className="text-xs text-muted-foreground">สิทธิ์ในระบบ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ที่มีบทบาท</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">รวมทั้งระบบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Table */}
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">จัดการบทบาท</TabsTrigger>
          <TabsTrigger value="assignments">ผู้ใช้ที่ได้รับบทบาท</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>รายการบทบาท</CardTitle>
              <CardDescription>
                จัดการบทบาทและกำหนดสิทธิ์การเข้าถึงระบบ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาบทบาท..."
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
                      <TableHead>บทบาท</TableHead>
                      <TableHead>คำอธิบาย</TableHead>
                      <TableHead className="text-center">จำนวนสิทธิ์</TableHead>
                      <TableHead className="text-center">ผู้ใช้</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วันที่สร้าง</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {role.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm line-clamp-2">{role.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{role.permissions.length}</div>
                            <div className="text-xs text-muted-foreground">สิทธิ์</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">
                              {userRoles.filter(ur => ur.role_id === role.id).length}
                            </div>
                            <div className="text-xs text-muted-foreground">คน</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {role.isSystem ? (
                            <Badge variant="secondary">ระบบ</Badge>
                          ) : (
                            <Badge variant="outline">กำหนดเอง</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {role.createdAt}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(role)}
                              disabled={role.isSystem}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleDelete(String(role.id))}
                               disabled={role.isSystem}
                               className="text-destructive hover:text-destructive"
                             >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>ผู้ใช้ที่ได้รับบทบาท</CardTitle>
              <CardDescription>
                รายการผู้ใช้งานที่ได้รับมอบหมายบทบาทต่างๆ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ผู้ใช้งาน</TableHead>
                      <TableHead>บทบาท</TableHead>
                      <TableHead>หน่วยงาน</TableHead>
                      <TableHead>วันที่มอบหมาย</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((userRole) => (
                      <TableRow key={userRole.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {userRole.profiles?.first_name} {userRole.profiles?.last_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {userRole.profiles?.email}
                            </span>
                            {userRole.profiles?.position && (
                              <span className="text-xs text-muted-foreground">
                                {userRole.profiles.position}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{userRole.roles?.name}</span>
                            {userRole.roles?.description && (
                              <span className="text-xs text-muted-foreground">
                                {userRole.roles.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {userRole.profiles?.organization_units?.name || 'ไม่ระบุ'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(userRole.assigned_at).toLocaleDateString('th-TH')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {userRoles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          ยังไม่มีการมอบหมายบทบาทให้ผู้ใช้งาน
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขบทบาท</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลบทบาท {selectedRole?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role-name" className="text-right">
                ชื่อบทบาท *
              </Label>
              <Input
                id="edit-role-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-role-desc" className="text-right pt-2">
                คำอธิบาย
              </Label>
              <Textarea
                id="edit-role-desc"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="col-span-4">
              <Label className="text-sm font-medium mb-3 block">สิทธิ์การเข้าถึง</Label>
              <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm mb-2 text-primary">{category}</h4>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEdit}>
              บันทึกการแก้ไข
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;