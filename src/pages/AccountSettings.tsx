import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Shield, 
  Key, 
  Smartphone, 
  Bell, 
  Palette, 
  Globe, 
  Clock,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  first_name: string;
  last_name: string;
  first_name_en?: string;
  last_name_en?: string;
  display_name?: string;
  national_id?: string;
  employee_id?: string;
  email: string;
  backup_email?: string;
  phone?: string;
  phone_office?: string;
  phone_mobile?: string;
  position?: string;
  organization_id: string;
  organization_unit_id?: string;
  address?: string;
  avatar_url?: string;
  bio?: string;
  start_date?: string;
  end_date?: string;
  last_login?: string;
  timezone?: string;
  language?: string;
  user_type?: string;
  status: string;
}

const AccountSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState('profile');

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !user?.id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          first_name_en: profile.first_name_en,
          last_name_en: profile.last_name_en,
          display_name: profile.display_name,
          national_id: profile.national_id,
          employee_id: profile.employee_id,
          username: profile.username,
          phone: profile.phone,
          phone_mobile: profile.phone_mobile,
          phone_office: profile.phone_office,
          backup_email: profile.backup_email,
          position: profile.position,
          start_date: profile.start_date,
          end_date: profile.end_date,
          bio: profile.bio,
          timezone: profile.timezone,
          language: profile.language,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Show success message
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle avatar upload logic
      console.log('Uploading avatar:', file.name);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ตั้งค่าบัญชี</h1>
            <p className="text-muted-foreground">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีผู้ใช้</p>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
          <TabsTrigger value="preferences">ความต้องการ</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal" className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    ข้อมูลส่วนตัว
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    ข้อมูลติดต่อ
                  </TabsTrigger>
                  <TabsTrigger value="work" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    ข้อมูลงาน
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 mt-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-medium">รูปโปรไฟล์</h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <label className="cursor-pointer">
                            <Camera className="h-4 w-4 mr-2" />
                            อัปโหลดรูป
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                          </label>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ไฟล์ JPG, PNG ขนาดไม่เกิน 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">ชื่อ *</Label>
                      <Input
                        id="firstName"
                        value={profile?.first_name || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, first_name: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">นามสกุล *</Label>
                      <Input
                        id="lastName"
                        value={profile?.last_name || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, last_name: e.target.value } : null
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstNameEn">ชื่อ (อังกฤษ)</Label>
                      <Input
                        id="firstNameEn"
                        value={profile?.first_name_en || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, first_name_en: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastNameEn">นามสกุล (อังกฤษ)</Label>
                      <Input
                        id="lastNameEn"
                        value={profile?.last_name_en || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, last_name_en: e.target.value } : null
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">ชื่อแสดง</Label>
                      <Input
                        id="displayName"
                        value={profile?.display_name || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, display_name: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">เลขบัตรประชาชน</Label>
                      <Input
                        id="nationalId"
                        value={profile?.national_id || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, national_id: e.target.value } : null
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">ข้อมูลเพิ่มเติม</Label>
                    <Textarea
                      id="bio"
                      value={profile?.bio || ''}
                      onChange={(e) => setProfile(prev => 
                        prev ? { ...prev, bio: e.target.value } : null
                      )}
                      placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับตัวคุณ"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupEmail">อีเมลสำรอง</Label>
                    <Input
                      id="backupEmail"
                      type="email"
                      value={profile?.backup_email || ''}
                      onChange={(e) => setProfile(prev => 
                        prev ? { ...prev, backup_email: e.target.value } : null
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                      <Input
                        id="phone"
                        value={profile?.phone || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, phone: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneMobile">มือถือ</Label>
                      <Input
                        id="phoneMobile"
                        value={profile?.phone_mobile || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, phone_mobile: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneOffice">โทรศัพท์ออฟฟิศ</Label>
                      <Input
                        id="phoneOffice"
                        value={profile?.phone_office || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, phone_office: e.target.value } : null
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">รหัสพนักงาน</Label>
                      <Input
                        id="employeeId"
                        value={profile?.employee_id || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, employee_id: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">ชื่อผู้ใช้</Label>
                      <Input
                        id="username"
                        value={profile?.username || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, username: e.target.value } : null
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">ตำแหน่ง</Label>
                    <Input
                      id="position"
                      value={profile?.position || ''}
                      onChange={(e) => setProfile(prev => 
                        prev ? { ...prev, position: e.target.value } : null
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">วันที่เริ่มงาน</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={profile?.start_date || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, start_date: e.target.value } : null
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">วันที่สิ้นสุดงาน</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={profile?.end_date || ''}
                        onChange={(e) => setProfile(prev => 
                          prev ? { ...prev, end_date: e.target.value } : null
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">เขตเวลา</Label>
                      <Select
                        value={profile?.timezone || 'Asia/Bangkok'}
                        onValueChange={(value) => setProfile(prev => 
                          prev ? { ...prev, timezone: value } : null
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Bangkok">เอเชีย/กรุงเทพฯ</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">อเมริกา/นิวยอร์ก</SelectItem>
                          <SelectItem value="Europe/London">ยุโรป/ลอนดอน</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">ภาษา</Label>
                      <Select
                        value={profile?.language || 'th'}
                        onValueChange={(value) => setProfile(prev => 
                          prev ? { ...prev, language: value } : null
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="th">ไทย</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6 pt-6 border-t">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                การตั้งค่าความปลอดภัย
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>การยืนยันตัวตนสองขั้นตอน (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    เพิ่มความปลอดภัยด้วยการยืนยันตัวตนสองขั้นตอน
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>แจ้งเตือนการเข้าสู่ระบบ</Label>
                  <p className="text-sm text-muted-foreground">
                    รับการแจ้งเตือนเมื่อมีการเข้าสู่ระบบใหม่
                  </p>
                </div>
                <Switch
                  checked={loginNotifications}
                  onCheckedChange={setLoginNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label>หมดเวลาการใช้งาน (นาที)</Label>
                <Select
                  value={sessionTimeout.toString()}
                  onValueChange={(value) => setSessionTimeout(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 นาที</SelectItem>
                    <SelectItem value="30">30 นาที</SelectItem>
                    <SelectItem value="60">1 ชั่วโมง</SelectItem>
                    <SelectItem value="240">4 ชั่วโมง</SelectItem>
                    <SelectItem value="480">8 ชั่วโมง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  เปลี่ยนรหัสผ่าน
                </Button>
                <Button variant="outline" className="w-full">
                  <Smartphone className="h-4 w-4 mr-2" />
                  จัดการอุปกรณ์ที่เชื่อถือได้
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                การตั้งค่าการแจ้งเตือน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>การแจ้งเตือนทางอีเมล</Label>
                  <p className="text-sm text-muted-foreground">
                    รับการแจ้งเตือนสำคัญทางอีเมล
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>การแจ้งเตือนแบบ Push</Label>
                  <p className="text-sm text-muted-foreground">
                    รับการแจ้งเตือนแบบทันทีบนเบราว์เซอร์
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>การแจ้งเตือนทาง SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    รับการแจ้งเตือนฉุกเฉินทาง SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>รายงานประจำสัปดาห์</Label>
                  <p className="text-sm text-muted-foreground">
                    รับสรุปการใช้งานประจำสัปดาห์
                  </p>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>การแจ้งเตือนระบบ</Label>
                  <p className="text-sm text-muted-foreground">
                    รับการแจ้งเตือนเกี่ยวกับการอัปเดตระบบ
                  </p>
                </div>
                <Switch
                  checked={systemAlerts}
                  onCheckedChange={setSystemAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* Preference Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                ความต้องการส่วนตัว
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>ธีมการแสดงผล</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">สว่าง</SelectItem>
                      <SelectItem value="dark">มืด</SelectItem>
                      <SelectItem value="system">ตามระบบ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>รูปแบบวันที่</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>รูปแบบเวลา</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 ชั่วโมง (AM/PM)</SelectItem>
                      <SelectItem value="24">24 ชั่วโมง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>จำนวนรายการต่อหน้า</Label>
                  <Select defaultValue="20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 รายการ</SelectItem>
                      <SelectItem value="20">20 รายการ</SelectItem>
                      <SelectItem value="50">50 รายการ</SelectItem>
                      <SelectItem value="100">100 รายการ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;