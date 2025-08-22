import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// Mock data for roles and permissions
const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    description: "ผู้ดูแลระบบสูงสุด มีสิทธิ์เต็มทั้งระบบ",
    userCount: 2,
    permissions: ["user_create", "user_read", "user_update", "user_delete", "org_create", "org_read", "org_update", "org_delete", "system_config"],
    isSystem: true,
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Organization Admin",
    description: "ผู้ดูแลองค์กร สามารถจัดการผู้ใช้และข้อมูลในองค์กร",
    userCount: 15,
    permissions: ["user_create", "user_read", "user_update", "org_read", "org_update", "mail_manage"],
    isSystem: false,
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "HR Manager",
    description: "ผู้จัดการทรัพยากรบุคคล จัดการผู้ใช้และข้อมูลบุคลากร",
    userCount: 8,
    permissions: ["user_create", "user_read", "user_update", "report_read"],
    isSystem: false,
    createdAt: "2024-01-20"
  },
  {
    id: 4,
    name: "User",
    description: "ผู้ใช้งานทั่วไป สามารถใช้บริการพื้นฐาน",
    userCount: 125,
    permissions: ["profile_read", "profile_update", "mail_read", "calendar_read"],
    isSystem: true,
    createdAt: "2024-01-01"
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
  const [roles, setRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

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

  const handleAdd = () => {
    if (formData.name) {
      const newRole = {
        id: roles.length + 1,
        ...formData,
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
      setFormData({ name: "", description: "", permissions: [] });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedRole && formData.name) {
      setRoles(roles.map(role => 
        role.id === selectedRole.id ? { ...role, ...formData } : role
      ));
      setIsEditDialogOpen(false);
      setSelectedRole(null);
    }
  };

  const handleDelete = (id: number) => {
    const roleToDelete = roles.find(r => r.id === id);
    if (roleToDelete?.isSystem) return; // ป้องกันการลบ role ระบบ
    setRoles(roles.filter(role => role.id !== id));
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
                        <div className="font-medium">{role.userCount}</div>
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
                          onClick={() => handleDelete(role.id)}
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