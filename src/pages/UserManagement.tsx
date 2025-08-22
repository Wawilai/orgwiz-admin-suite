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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { DatePicker } from "@/components/ui/date-picker";
import { useMasterData } from "@/contexts/MasterDataContext";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";
import { useDeleteConfirmation, useStatusChangeConfirmation } from "@/components/ui/confirmation-dialog";
import { useFormValidation, createEmailRule, createPhoneRule, createDuplicateValidator } from "@/hooks/use-form-validation";
import { toastSuccess, toastError, toastWithUndo } from "@/components/ui/enhanced-toast";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  Building,
  Download,
  Upload,
} from "lucide-react";

// Sample user data
const users = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    email: "somchai@company.com",
    phone: "081-234-5678",
    organization: "ABC Corp",
    organizationUnit: "IT Department",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15 10:30",
    avatar: null
  },
  {
    id: 2,
    name: "สมหญิง รักสะอาด",
    email: "somying@company.com", 
    phone: "082-345-6789",
    organization: "XYZ Ltd",
    organizationUnit: "HR Department",
    role: "User",
    status: "active",
    lastLogin: "2024-01-14 15:45",
    avatar: null
  },
  {
    id: 3,
    name: "วิชาญ เก่งเก็บ",
    email: "wichan@company.com",
    phone: "083-456-7890",
    organization: "ABC Corp",
    organizationUnit: "Finance Department",
    role: "Manager",
    status: "suspended",
    lastLogin: "2024-01-10 09:15",
    avatar: null
  },
];

const UserManagement = () => {
  const { getActiveItems } = useMasterData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [usersData, setUsersData] = useState(users);

  // Confirmation dialogs
  const { showDeleteConfirmation, DeleteConfirmationDialog } = useDeleteConfirmation();
  const { showStatusConfirmation, StatusConfirmationDialog } = useStatusChangeConfirmation();

  // Form validation for adding users
  const addUserValidation = useFormValidation({
    name: "",
    email: "",
    phone: "",
    employeeId: "",
    organization: "",
    department: "",
    role: "",
    position: "",
    startDate: "",
    manager: "",
    tempPassword: "",
  }, {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { 
      ...createEmailRule(),
      custom: createDuplicateValidator(usersData, null, (user) => user.email, "อีเมล")
    },
    phone: createPhoneRule(),
    organization: { required: true },
    role: { required: true },
    tempPassword: { required: true, minLength: 8 },
  });

  // Form validation for editing users
  const editUserValidation = useFormValidation({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
  }, {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { 
      ...createEmailRule(),
      custom: createDuplicateValidator(usersData, editingUser?.id, (user) => user.email, "อีเมล")
    },
    phone: createPhoneRule(),
    organization: { required: true },
    role: { required: true },
  });

  // Get master data
  const organizationTypes = getActiveItems('organizationTypes');
  const departments = getActiveItems('departments');
  const positions = getActiveItems('positions');
  const userRoles = getActiveItems('userRoles');

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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-primary text-primary-foreground">ผู้ดูแลระบบ</Badge>;
      case "Manager":
        return <Badge className="bg-accent text-accent-foreground">ผู้จัดการ</Badge>;
      case "User":
        return <Badge variant="outline">ผู้ใช้งาน</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    editUserValidation.setValues({
      name: user.name,
      email: user.email,
      phone: user.phone,
      organization: user.organization,
      role: user.role,
    });
    setIsEditUserOpen(true);
  };

  const handleAddUser = async () => {
    await addUserValidation.handleSubmit(async (values) => {
      const newUser = {
        id: Math.max(...usersData.map(u => u.id), 0) + 1,
        name: values.name,
        email: values.email,
        phone: values.phone,
        organization: values.organization,
        organizationUnit: values.department,
        role: values.role,
        status: "active",
        lastLogin: "ยังไม่เคยเข้าสู่ระบบ",
        avatar: null
      };
      
      setUsersData([...usersData, newUser]);
      setIsAddUserOpen(false);
      addUserValidation.reset();
      
      toastSuccess("เพิ่มผู้ใช้งานสำเร็จ", `เพิ่มผู้ใช้งาน "${values.name}" เรียบร้อยแล้ว`);
    });
  };

  const handleEditUser = async () => {
    await editUserValidation.handleSubmit(async (values) => {
      setUsersData(usersData.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...values }
          : user
      ));
      
      setIsEditUserOpen(false);
      setEditingUser(null);
      editUserValidation.reset();
      
      toastSuccess("แก้ไขผู้ใช้งานสำเร็จ", `แก้ไขข้อมูลผู้ใช้งาน "${values.name}" เรียบร้อยแล้ว`);
    });
  };

  const handleDeleteUser = async (user: any) => {
    const originalUsers = [...usersData];
    setUsersData(usersData.filter(u => u.id !== user.id));
    
    toastWithUndo(
      "ลบผู้ใช้งานสำเร็จ",
      `ลบผู้ใช้งาน "${user.name}" แล้ว`,
      () => {
        setUsersData(originalUsers);
        toastSuccess("เลิกทำการลบ", "กู้คืนผู้ใช้งานเรียบร้อยแล้ว");
      }
    );
  };

  const handleSuspendUser = async (user: any) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const statusText = newStatus === 'suspended' ? 'ระงับ' : 'เปิดใช้งาน';
    
    setUsersData(usersData.map(u => 
      u.id === user.id 
        ? { ...u, status: newStatus } 
        : u
    ));

    toastSuccess(
      `${statusText}ผู้ใช้งานสำเร็จ`,
      `เปลี่ยนสถานะผู้ใช้งาน "${user.name}" เป็น ${statusText} แล้ว`
    );
  };

  const openResetPasswordDialog = (user: any) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const openAssignRoleDialog = (user: any) => {
    setSelectedUser(user);
    setIsAssignRoleOpen(true);
  };

  const openSendEmailDialog = (user: any) => {
    setSelectedUser(user);
    setIsSendEmailOpen(true);
  };

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || user.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground mt-1">
            จัดการบัญชีผู้ใช้งานและสิทธิ์การเข้าถึง
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {
            const csv = "ชื่อ,อีเมล,เบอร์โทร,องค์กร,บทบาท,สถานะ\n" + 
              filteredUsers.map(u => `${u.name},${u.email},${u.phone},${u.organization},${u.role},${u.status}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users-export.csv';
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
                alert('ฟังก์ชันนำเข้าข้อมูลจากไฟล์ CSV พร้อมใช้งาน');
              }
            };
            input.click();
          }}>
            <Upload className="w-4 h-4 mr-2" />
            นำเข้า
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <UserPlus className="w-4 h-4 mr-2" />
                เพิ่มผู้ใช้งาน
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลผู้ใช้งานใหม่ที่ต้องการเพิ่มเข้าระบบ
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="ชื่อ-นามสกุล"
                    required
                    error={addUserValidation.errors.name}
                  >
                    <Input
                      placeholder="กรอกชื่อ-นามสกุล"
                      value={addUserValidation.values.name}
                      onChange={(e) => addUserValidation.setValue('name', e.target.value)}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="อีเมล"
                    required
                    error={addUserValidation.errors.email}
                  >
                    <Input
                      type="email"
                      placeholder="user@company.com"
                      value={addUserValidation.values.email}
                      onChange={(e) => addUserValidation.setValue('email', e.target.value)}
                    />
                  </FormFieldWrapper>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="เบอร์โทร"
                    error={addUserValidation.errors.phone}
                    hint="เช่น 081-234-5678"
                  >
                    <Input
                      placeholder="081-234-5678"
                      value={addUserValidation.values.phone}
                      onChange={(e) => addUserValidation.setValue('phone', e.target.value)}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="รหัสพนักงาน"
                    error={addUserValidation.errors.employeeId}
                  >
                    <Input
                      placeholder="EMP001"
                      value={addUserValidation.values.employeeId}
                      onChange={(e) => addUserValidation.setValue('employeeId', e.target.value)}
                    />
                  </FormFieldWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="องค์กร"
                    required
                    error={addUserValidation.errors.organization}
                  >
                    <Select 
                      value={addUserValidation.values.organization}
                      onValueChange={(value) => addUserValidation.setValue('organization', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกองค์กร" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {organizationTypes.map((org) => (
                          <SelectItem key={org.id} value={org.code}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="หน่วยงาน"
                    error={addUserValidation.errors.department}
                  >
                    <Select 
                      value={addUserValidation.values.department}
                      onValueChange={(value) => addUserValidation.setValue('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหน่วยงาน" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.code}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="บทบาท"
                    required
                    error={addUserValidation.errors.role}
                  >
                    <Select 
                      value={addUserValidation.values.role}
                      onValueChange={(value) => addUserValidation.setValue('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกบทบาท" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {userRoles.map((role) => (
                          <SelectItem key={role.id} value={role.code}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="ตำแหน่ง"
                    error={addUserValidation.errors.position}
                  >
                    <Select 
                      value={addUserValidation.values.position}
                      onValueChange={(value) => addUserValidation.setValue('position', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกตำแหน่ง" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.code}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                </div>

                <FormFieldWrapper
                  label="รหัสผ่านชั่วคราว"
                  required
                  error={addUserValidation.errors.tempPassword}
                  hint="ผู้ใช้จะต้องเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก"
                >
                  <Input
                    type="password"
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    value={addUserValidation.values.tempPassword}
                    onChange={(e) => addUserValidation.setValue('tempPassword', e.target.value)}
                  />
                </FormFieldWrapper>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsAddUserOpen(false);
                  addUserValidation.reset();
                }}>
                  ยกเลิก
                </Button>
                <LoadingButton 
                  loading={addUserValidation.isSubmitting}
                  onClick={handleAddUser}
                >
                  บันทึก
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="bg-card overflow-y-auto">
              <DialogHeader>
                <DialogTitle>แก้ไขข้อมูลผู้ใช้งาน</DialogTitle>
                <DialogDescription>
                  แก้ไขข้อมูลผู้ใช้งานในระบบ
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="ชื่อ-นามสกุล"
                    required
                    error={editUserValidation.errors.name}
                  >
                    <Input
                      placeholder="กรอกชื่อ-นามสกุล"
                      value={editUserValidation.values.name}
                      onChange={(e) => editUserValidation.setValue('name', e.target.value)}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="อีเมล"
                    required
                    error={editUserValidation.errors.email}
                  >
                    <Input
                      type="email"
                      placeholder="user@company.com"
                      value={editUserValidation.values.email}
                      onChange={(e) => editUserValidation.setValue('email', e.target.value)}
                    />
                  </FormFieldWrapper>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="เบอร์โทร"
                    error={editUserValidation.errors.phone}
                    hint="เช่น 081-234-5678"
                  >
                    <Input
                      placeholder="081-234-5678"
                      value={editUserValidation.values.phone}
                      onChange={(e) => editUserValidation.setValue('phone', e.target.value)}
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="องค์กร"
                    required
                    error={editUserValidation.errors.organization}
                  >
                    <Select 
                      value={editUserValidation.values.organization}
                      onValueChange={(value) => editUserValidation.setValue('organization', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกองค์กร" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {organizationTypes.map((org) => (
                          <SelectItem key={org.id} value={org.name}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>
                </div>

                <FormFieldWrapper
                  label="บทบาท"
                  required
                  error={editUserValidation.errors.role}
                >
                  <Select 
                    value={editUserValidation.values.role}
                    onValueChange={(value) => editUserValidation.setValue('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {userRoles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldWrapper>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsEditUserOpen(false);
                  setEditingUser(null);
                  editUserValidation.reset();
                }}>
                  ยกเลิก
                </Button>
                <LoadingButton 
                  loading={editUserValidation.isSubmitting}
                  onClick={handleEditUser}
                >
                  บันทึกการเปลี่ยนแปลง
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>

          {/* Reset Password Dialog */}
          <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
            <DialogContent className="sm:max-w-[425px] bg-card">
              <DialogHeader>
                <DialogTitle>รีเซ็ตรหัสผ่าน</DialogTitle>
                <DialogDescription>
                  รีเซ็ตรหัสผ่านสำหรับ {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">รหัสผ่านใหม่</Label>
                  <Input id="new-password" type="password" placeholder="กรอกรหัสผ่านใหม่" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">ยืนยันรหัสผ่าน</Label>
                  <Input id="confirm-password" type="password" placeholder="ยืนยันรหัสผ่านใหม่" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="force-change" className="rounded" />
                  <Label htmlFor="force-change">บังคับเปลี่ยนรหัสผ่านในการเข้าใช้ครั้งถัดไป</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>ยกเลิก</Button>
                <Button onClick={() => setIsResetPasswordOpen(false)}>รีเซ็ตรหัสผ่าน</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Assign Role Dialog */}
          <Dialog open={isAssignRoleOpen} onOpenChange={setIsAssignRoleOpen}>
            <DialogContent className="sm:max-w-[425px] bg-card">
              <DialogHeader>
                <DialogTitle>มอบสิทธิ์</DialogTitle>
                <DialogDescription>
                  กำหนดบทบาทและสิทธิ์ให้ {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">บทบาท</Label>
                  <Select defaultValue={selectedUser?.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Admin">ผู้ดูแลระบบ</SelectItem>
                      <SelectItem value="Manager">ผู้จัดการ</SelectItem>
                      <SelectItem value="User">ผู้ใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>สิทธิ์พิเศษ</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="manage-users" className="rounded" />
                      <Label htmlFor="manage-users">จัดการผู้ใช้งาน</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="manage-system" className="rounded" />
                      <Label htmlFor="manage-system">จัดการระบบ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="view-reports" className="rounded" />
                      <Label htmlFor="view-reports">ดูรายงาน</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssignRoleOpen(false)}>ยกเลิก</Button>
                <Button onClick={() => setIsAssignRoleOpen(false)}>บันทึก</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Send Email Dialog */}
          <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
            <DialogContent className="sm:max-w-[500px] bg-card">
              <DialogHeader>
                <DialogTitle>ส่งอีเมล</DialogTitle>
                <DialogDescription>
                  ส่งอีเมลถึง {selectedUser?.name} ({selectedUser?.email})
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">หัวข้อ</Label>
                  <Input id="subject" placeholder="กรอกหัวข้ออีเมล" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">ข้อความ</Label>
                  <textarea 
                    id="message" 
                    className="w-full p-3 border rounded-md min-h-[120px]" 
                    placeholder="กรอกข้อความที่ต้องการส่ง"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="urgent" className="rounded" />
                  <Label htmlFor="urgent">อีเมลด่วน</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsSendEmailOpen(false)}>ยกเลิก</Button>
                <Button onClick={() => setIsSendEmailOpen(false)}>ส่งอีเมล</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานใหม่</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">ในเดือนนี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานออนไลน์</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">ในขณะนี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานที่ระงับ</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">ต้องตรวจสอบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>รายการผู้ใช้งาน</CardTitle>
          <CardDescription>
            จัดการและแก้ไขข้อมูลผู้ใช้งานในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อ, อีเมล..."
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

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้งาน</TableHead>
                  <TableHead>องค์กร / หน่วยงาน</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>เข้าใช้ครั้งสุดท้าย</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {user.organization}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.organizationUnit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLogin}
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
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openResetPasswordDialog(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            รีเซ็ตรหัสผ่าน
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => 
                            showStatusConfirmation(
                              `คุณต้องการ${user.status === 'active' ? 'ระงับ' : 'เปิด'}ใช้งานผู้ใช้ "${user.name}" หรือไม่?`,
                              () => handleSuspendUser(user)
                            )
                          }>
                            <Shield className="mr-2 h-4 w-4" />
                            {user.status === 'active' ? 'ระงับใช้งาน' : 'เปิดใช้งาน'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAssignRoleDialog(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            มอบสิทธิ์
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openSendEmailDialog(user)}>
                            <Mail className="mr-2 h-4 w-4" />
                            ส่งอีเมล
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => showDeleteConfirmation(user.name, () => handleDeleteUser(user))}
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

      {/* Confirmation Dialogs */}
      <DeleteConfirmationDialog />
      <StatusConfirmationDialog />
    </div>
  );
};

export default UserManagement;