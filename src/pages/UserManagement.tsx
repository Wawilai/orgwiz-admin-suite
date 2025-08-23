import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const UserManagement = () => {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [organizationUnits, setOrganizationUnits] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    first_name_en: "",
    last_name_en: "",
    email: "",
    backup_email: "",
    phone: "",
    phone_mobile: "",
    phone_office: "",
    position: "",
    employee_id: "",
    national_id: "",
    display_name: "",
    username: "",
    bio: "",
    organization_id: "",
    organization_unit_id: "",
    manager_id: "",
    start_date: "",
    end_date: "",
    timezone: "Asia/Bangkok",
    language: "th",
    user_type: "user"
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchOrganizations();
      fetchOrganizationUnits();
    }
  }, [isAuthenticated]);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchOrganizationUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_units')
        .select('id, name, organization_id')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      setOrganizationUnits(data || []);
    } catch (error) {
      console.error('Error fetching organization units:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations!profiles_organization_id_fkey (name),
          organization_units!profiles_organization_unit_id_fkey (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedUsers = (data || []).map(profile => ({
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || profile.phone_mobile,
        organization: profile.organizations?.name || 'ไม่ระบุ',
        organizationUnit: profile.organization_units?.name || 'ไม่ระบุ',
        role: profile.user_type || 'user',
        status: profile.status,
        lastLogin: profile.last_login ? new Date(profile.last_login).toLocaleString('th-TH') : 'ยังไม่เคยเข้าสู่ระบบ',
        avatar: profile.avatar_url
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.organization_id) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          ...formData,
          user_id: crypto.randomUUID(), // Temporary user ID
        }]);
      
      if (error) throw error;
      
      await fetchUsers();
      setIsAddUserOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        first_name_en: "",
        last_name_en: "",
        email: "",
        backup_email: "",
        phone: "",
        phone_mobile: "",
        phone_office: "",
        position: "",
        employee_id: "",
        national_id: "",
        display_name: "",
        username: "",
        bio: "",
        organization_id: "",
        organization_unit_id: "",
        manager_id: "",
        start_date: "",
        end_date: "",
        timezone: "Asia/Bangkok",
        language: "th",
        user_type: "user"
      });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      await fetchUsers();
      setIsEditUserOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.name.split(' ')[0] || '',
      last_name: user.name.split(' ')[1] || '',
      first_name_en: '',
      last_name_en: '',
      email: user.email,
      backup_email: '',
      phone: user.phone || '',
      phone_mobile: '',
      phone_office: '',
      position: user.position || '',
      employee_id: '',
      national_id: '',
      display_name: '',
      username: '',
      bio: '',
      organization_id: '',
      organization_unit_id: '',
      manager_id: '',
      start_date: '',
      end_date: '',
      timezone: 'Asia/Bangkok',
      language: 'th',
      user_type: user.role || 'user'
    });
    setIsEditUserOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  }

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
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <UserPlus className="w-4 h-4 mr-2" />
              เพิ่มผู้ใช้งาน
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
              <DialogDescription>
                เพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">ชื่อ *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">นามสกุล *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name_en">ชื่อ (อังกฤษ)</Label>
                  <Input
                    id="first_name_en"
                    value={formData.first_name_en}
                    onChange={(e) => setFormData({...formData, first_name_en: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name_en">นามสกุล (อังกฤษ)</Label>
                  <Input
                    id="last_name_en"
                    value={formData.last_name_en}
                    onChange={(e) => setFormData({...formData, last_name_en: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="display_name">ชื่อแสดง</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">ชื่อผู้ใช้</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="employee_id">รหัสพนักงาน</Label>
                  <Input
                    id="employee_id"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">อีเมล *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="backup_email">อีเมลสำรอง</Label>
                <Input
                  id="backup_email"
                  type="email"
                  value={formData.backup_email}
                  onChange={(e) => setFormData({...formData, backup_email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone_mobile">มือถือ</Label>
                  <Input
                    id="phone_mobile"
                    value={formData.phone_mobile}
                    onChange={(e) => setFormData({...formData, phone_mobile: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone_office">โทรศัพท์ออฟฟิศ</Label>
                  <Input
                    id="phone_office"
                    value={formData.phone_office}
                    onChange={(e) => setFormData({...formData, phone_office: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="position">ตำแหน่ง</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="national_id">เลขบัตรประชาชน</Label>
                <Input
                  id="national_id"
                  value={formData.national_id}
                  onChange={(e) => setFormData({...formData, national_id: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization_id">องค์กร *</Label>
                  <Select value={formData.organization_id} onValueChange={(value) => setFormData({...formData, organization_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกองค์กร" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="organization_unit_id">หน่วยงาน</Label>
                  <Select value={formData.organization_unit_id} onValueChange={(value) => setFormData({...formData, organization_unit_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหน่วยงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationUnits
                        .filter(unit => !formData.organization_id || unit.organization_id === formData.organization_id)
                        .map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">วันที่เริ่มงาน</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">วันที่สิ้นสุดงาน</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user_type">ประเภทผู้ใช้</Label>
                  <Select value={formData.user_type} onValueChange={(value) => setFormData({...formData, user_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทผู้ใช้" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                      <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                      <SelectItem value="manager">ผู้จัดการ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">ภาษา</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกภาษา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="th">ภาษาไทย</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">หมายเหตุ</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับผู้ใช้"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleAddUser} disabled={submitting}>
                {submitting ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">ผู้ใช้งานในระบบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>รายการผู้ใช้งาน</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-right mr-4">
                      <div>{user.organization}</div>
                      <div className="text-muted-foreground">{user.status}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              ยังไม่มีผู้ใช้งานในระบบ
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขผู้ใช้งาน</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลผู้ใช้งาน
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_first_name">ชื่อ *</Label>
                <Input
                  id="edit_first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_last_name">นามสกุล *</Label>
                <Input
                  id="edit_last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_email">อีเมล *</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_phone">เบอร์โทร</Label>
              <Input
                id="edit_phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_position">ตำแหน่ง</Label>
              <Input
                id="edit_position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditUser} disabled={submitting}>
              {submitting ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;