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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Search, Trash2, UserCheck, Users, Shield, Clock } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { enhancedToast } from "@/components/ui/enhanced-toast";

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
  organization_units?: { name: string };
}

interface Role {
  id: string;
  name: string;
  description?: string;
  role_type: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  assigned_by?: string;
  profiles: UserProfile;
  roles: Role;
}

const UserRoleAssignment = () => {
  const { isAuthenticated } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchUserRoles(),
        fetchUsers(),
        fetchRoles()
      ]);
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
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      enhancedToast({ 
        title: "เกิดข้อผิดพลาด", 
        description: "ไม่สามารถดึงข้อมูลการมอบหมายบทบาทได้",
        variant: "error" 
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          email,
          position,
          organization_units:organization_units!profiles_organization_unit_id_fkey (name)
        `)
        .eq('status', 'active')
        .order('first_name');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name, description, role_type')
        .order('name');
      
      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      enhancedToast({ 
        title: "ข้อมูลไม่ครบ", 
        description: "กรุณาเลือกผู้ใช้และบทบาท",
        variant: "warning" 
      });
      return;
    }

    try {
      // Check if user already has this role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', selectedUser)
        .eq('role_id', selectedRole)
        .eq('is_active', true)
        .single();

      if (existingRole) {
        enhancedToast({ 
          title: "บทบาทซ้ำ", 
          description: "ผู้ใช้นี้มีบทบาทนี้อยู่แล้ว",
          variant: "warning" 
        });
        return;
      }

      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: selectedUser,
          role_id: selectedRole,
          expires_at: expiryDate?.toISOString(),
          assigned_by: currentUser.user?.id,
          is_active: true
        }]);
      
      if (error) throw error;
      
      await fetchUserRoles();
      setIsAssignDialogOpen(false);
      setSelectedUser("");
      setSelectedRole("");
      setExpiryDate(undefined);
      
      enhancedToast({ 
        title: "สำเร็จ", 
        description: "มอบหมายบทบาทเรียบร้อยแล้ว",
        variant: "success" 
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      enhancedToast({ 
        title: "เกิดข้อผิดพลาด", 
        description: "ไม่สามารถมอบหมายบทบาทได้",
        variant: "error" 
      });
    }
  };

  const handleRevokeRole = async (userRoleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', userRoleId);
      
      if (error) throw error;
      
      await fetchUserRoles();
      enhancedToast({ 
        title: "สำเร็จ", 
        description: "เพิกถอนบทบาทเรียบร้อยแล้ว",
        variant: "success" 
      });
    } catch (error) {
      console.error('Error revoking role:', error);
      enhancedToast({ 
        title: "เกิดข้อผิดพลาด", 
        description: "ไม่สามารถเพิกถอนบทบาทได้",
        variant: "error" 
      });
    }
  };

  const filteredUserRoles = userRoles.filter(ur =>
    ur.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ur.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ur.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ur.roles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (userRole: UserRole) => {
    if (!userRole.is_active) {
      return <Badge variant="secondary">ถูกเพิกถอน</Badge>;
    }
    if (userRole.expires_at && new Date(userRole.expires_at) < new Date()) {
      return <Badge variant="destructive">หมดอายุ</Badge>;
    }
    return <Badge variant="default">ใช้งานได้</Badge>;
  };

  const activeRolesCount = userRoles.filter(ur => ur.is_active).length;
  const expiredRolesCount = userRoles.filter(ur => 
    ur.expires_at && new Date(ur.expires_at) < new Date()
  ).length;
  const totalUsers = new Set(userRoles.map(ur => ur.user_id)).size;

  if (loading) {
    return <div className="flex justify-center items-center h-64">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">มอบหมายบทบาท</h1>
          <p className="text-muted-foreground mt-1">
            จัดการการมอบหมายบทบาทให้ผู้ใช้งานในระบบ
          </p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              มอบหมายบทบาท
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card">
            <DialogHeader>
              <DialogTitle>มอบหมายบทบาทใหม่</DialogTitle>
              <DialogDescription>
                เลือกผู้ใช้และบทบาทที่ต้องการมอบหมาย
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user">ผู้ใช้งาน *</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกผู้ใช้งาน" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        <div className="flex flex-col">
                          <span>{user.first_name} {user.last_name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">บทบาท *</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span>{role.name}</span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>วันหมดอายุ (ไม่บังคับ)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP", { locale: th }) : "เลือกวันหมดอายุ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleAssignRole}>
                มอบหมาย
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บทบาทที่ใช้งานได้</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRolesCount}</div>
            <p className="text-xs text-muted-foreground">การมอบหมายที่ยังใช้งานได้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ที่ได้รับบทบาท</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">ผู้ใช้ที่มีบทบาท</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บทบาททั้งหมด</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">บทบาทในระบบ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมดอายุ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredRolesCount}</div>
            <p className="text-xs text-muted-foreground">บทบาทที่หมดอายุ</p>
          </CardContent>
        </Card>
      </div>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการมอบหมายบทบาท</CardTitle>
          <CardDescription>
            รายการการมอบหมายบทบาทให้ผู้ใช้งานในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาผู้ใช้ หรือบทบาท..."
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
                  <TableHead>ผู้ใช้งาน</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่มอบหมาย</TableHead>
                  <TableHead>วันหมดอายุ</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUserRoles.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {userRole.profiles?.first_name} {userRole.profiles?.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {userRole.profiles?.email}
                        </span>
                        {userRole.profiles?.organization_units?.name && (
                          <span className="text-xs text-muted-foreground">
                            {userRole.profiles.organization_units.name}
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
                      {getStatusBadge(userRole)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(userRole.assigned_at), "dd/MM/yyyy", { locale: th })}
                    </TableCell>
                    <TableCell>
                      {userRole.expires_at 
                        ? format(new Date(userRole.expires_at), "dd/MM/yyyy", { locale: th })
                        : "ไม่หมดอายุ"
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {userRole.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeRole(userRole.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUserRoles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      ไม่พบข้อมูลการมอบหมายบทบาท
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleAssignment;