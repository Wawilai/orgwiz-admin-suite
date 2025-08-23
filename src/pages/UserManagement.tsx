import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus } from "lucide-react";

const UserManagement = () => {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

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
        <Button variant="default">
          <UserPlus className="w-4 h-4 mr-2" />
          เพิ่มผู้ใช้งาน
        </Button>
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
                  <div className="text-sm">
                    <div>{user.organization}</div>
                    <div className="text-muted-foreground">{user.status}</div>
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
    </div>
  );
};

export default UserManagement;