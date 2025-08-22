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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [usersData, setUsersData] = useState(users);

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
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsersData(usersData.filter(user => user.id !== userId));
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
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                    <Input
                      id="name"
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@company.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทร</Label>
                    <Input
                      id="phone"
                      placeholder="081-234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">รหัสพนักงาน</Label>
                    <Input
                      id="employee-id"
                      placeholder="EMP001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">องค์กร *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกองค์กร" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="abc-corp">ABC Corp</SelectItem>
                        <SelectItem value="xyz-ltd">XYZ Ltd</SelectItem>
                        <SelectItem value="def-co">DEF Co</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">หน่วยงาน</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหน่วยงาน" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="it">IT Department</SelectItem>
                        <SelectItem value="hr">HR Department</SelectItem>
                        <SelectItem value="finance">Finance Department</SelectItem>
                        <SelectItem value="marketing">Marketing Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">บทบาท *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกบทบาท" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                        <SelectItem value="manager">ผู้จัดการ</SelectItem>
                        <SelectItem value="supervisor">หัวหน้างาน</SelectItem>
                        <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">ตำแหน่ง</Label>
                    <Input
                      id="position"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">วันที่เริ่มงาน</Label>
                    <DatePicker
                      placeholder="เลือกวันที่เริ่มงาน"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">ผู้บังคับบัญชา</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกผู้บังคับบัญชา" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="manager1">นายสมชาย ใจดี</SelectItem>
                        <SelectItem value="manager2">นางสาววิชาญ เก่งกาจ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temp-password">รหัสผ่านชั่วคราว</Label>
                  <Input
                    id="temp-password"
                    type="password"
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                  />
                  <p className="text-sm text-muted-foreground">
                    ผู้ใช้จะต้องเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => setIsAddUserOpen(false)}>
                  บันทึก
                </Button>
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
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">ชื่อ-นามสกุล *</Label>
                    <Input
                      id="edit-name"
                      defaultValue={editingUser?.name || ""}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">อีเมล *</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      defaultValue={editingUser?.email || ""}
                      placeholder="user@company.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">เบอร์โทร</Label>
                    <Input
                      id="edit-phone"
                      defaultValue={editingUser?.phone || ""}
                      placeholder="081-234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-organization">องค์กร</Label>
                    <Select defaultValue={editingUser?.organization || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกองค์กร" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="ABC Corp">ABC Corp</SelectItem>
                        <SelectItem value="XYZ Ltd">XYZ Ltd</SelectItem>
                        <SelectItem value="DEF Co">DEF Co</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">บทบาท</Label>
                    <Select defaultValue={editingUser?.role || ""}>
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
                    <Label htmlFor="edit-status">สถานะ</Label>
                    <Select defaultValue={editingUser?.status || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสถานะ" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="active">ใช้งาน</SelectItem>
                        <SelectItem value="suspended">ระงับ</SelectItem>
                        <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => setIsEditUserOpen(false)}>
                  บันทึกการเปลี่ยนแปลง
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
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
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
    </div>
  );
};

export default UserManagement;