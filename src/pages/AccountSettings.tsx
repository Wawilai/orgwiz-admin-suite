import { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
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
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface UserProfile {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  nationalId?: string;
  email: string;
  backupEmail?: string;
  phone: string;
  phoneOffice?: string;
  position: string;
  department: string;
  departmentEn?: string;
  organization: string;
  address: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
  timezone: string;
  language: string;
  userType?: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: TrustedDevice[];
  loginHistory: LoginHistory[];
}

interface TrustedDevice {
  id: string;
  name: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  ipAddress: string;
  lastAccess: string;
  isCurrent: boolean;
}

interface LoginHistory {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  success: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

const mockProfile: UserProfile = {
  id: 'user-001',
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  email: 'somchai@company.com',
  phone: '081-234-5678',
  position: 'ผู้จัดการฝ่ายไอที',
  department: 'ฝ่ายไอที',
  organization: 'บริษัท เทคโนโลยี จำกัด',
  address: '123 ถนนเทคโนโลยี กรุงเทพฯ 10110',
  avatar: '',
  joinDate: '2023-01-15',
  lastLogin: '2024-01-25T14:30:00',
  timezone: 'Asia/Bangkok',
  language: 'th'
};

const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: true,
  passwordLastChanged: '2024-01-01',
  loginNotifications: true,
  sessionTimeout: 30,
  trustedDevices: [
    {
      id: '1',
      name: 'MacBook Pro',
      deviceType: 'Desktop',
      browser: 'Chrome 120',
      ipAddress: '192.168.1.100',
      lastAccess: '2024-01-25T14:30:00',
      isCurrent: true
    },
    {
      id: '2', 
      name: 'iPhone 15',
      deviceType: 'Mobile',
      browser: 'Safari 17',
      ipAddress: '192.168.1.101',
      lastAccess: '2024-01-24T08:15:00',
      isCurrent: false
    }
  ],
  loginHistory: [
    {
      id: '1',
      timestamp: '2024-01-25T14:30:00',
      ipAddress: '192.168.1.100',
      location: 'กรุงเทพฯ, ประเทศไทย',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      success: true
    },
    {
      id: '2',
      timestamp: '2024-01-24T08:15:00', 
      ipAddress: '192.168.1.101',
      location: 'กรุงเทพฯ, ประเทศไทย',
      device: 'iPhone 15',
      browser: 'Safari 17',
      success: true
    },
    {
      id: '3',
      timestamp: '2024-01-23T18:45:00',
      ipAddress: '103.22.200.15',
      location: 'เชียงใหม่, ประเทศไทย',
      device: 'Unknown Device',
      browser: 'Firefox 121',
      success: false
    }
  ]
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  weeklyReports: true,
  systemAlerts: true,
  marketingEmails: false
};

export default function AccountSettings() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [currentTab, setCurrentTab] = useState('profile');
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isMFADialogOpen, setIsMFADialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = () => {
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลโปรไฟล์ได้รับการอัปเดตเรียบร้อยแล้ว",
    });
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านใหม่และการยืนยัน",
        variant: "destructive"
      });
      return;
    }
    
    setSecuritySettings({
      ...securitySettings,
      passwordLastChanged: new Date().toISOString().split('T')[0]
    });
    setIsChangePasswordDialogOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast({
      title: "เปลี่ยนรหัสผ่านสำเร็จ",
      description: "รหัสผ่านใหม่ได้รับการบันทึกเรียบร้อยแล้ว",
    });
  };

  const handleToggleMFA = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorEnabled: !securitySettings.twoFactorEnabled
    });
    toast({
      title: securitySettings.twoFactorEnabled ? "ปิด MFA สำเร็จ" : "เปิด MFA สำเร็จ",
      description: securitySettings.twoFactorEnabled ? "ปิดการรักษาความปลอดภัยสองขั้นตอน" : "เปิดการรักษาความปลอดภัยสองขั้นตอน",
    });
  };

  const handleRemoveTrustedDevice = (deviceId: string) => {
    setSecuritySettings({
      ...securitySettings,
      trustedDevices: securitySettings.trustedDevices.filter(device => device.id !== deviceId)
    });
    toast({
      title: "ลบอุปกรณ์สำเร็จ",
      description: "อุปกรณ์ถูกลบออกจากรายการที่เชื่อถือแล้ว",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "การตั้งค่าการแจ้งเตือนได้รับการอัปเดตเรียบร้อยแล้ว",
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'Mobile': return <Smartphone className="h-4 w-4" />;
      case 'Desktop': return <Settings className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getLoginStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        สำเร็จ
      </Badge>
    ) : (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        ล้มเหลว
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ตั้งค่าบัญชี</h1>
            <p className="text-muted-foreground">จัดการข้อมูลส่วนตัว ความปลอดภัย และการแจ้งเตือน</p>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="profile">โปรไฟล์</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
          <TabsTrigger value="preferences">การตั้งค่า</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ข้อมูลส่วนตัว
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" onClick={() => {
                    // Simulate file upload
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          setProfile({ ...profile, avatar: result });
                          toast({
                            title: "อัปโหลดรูปภาพสำเร็จ",
                            description: "รูปโปรไฟล์ใหม่ได้รับการบันทึกแล้ว",
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}>
                    <Camera className="h-4 w-4 mr-2" />
                    เปลี่ยนรูปโปรไฟล์
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    ไฟล์ JPG, PNG หรือ GIF ขนาดไม่เกิน 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ (ไทย)</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล (ไทย)</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstNameEn">ชื่อ (อังกฤษ)</Label>
                  <Input
                    id="firstNameEn"
                    placeholder="First Name"
                    value={profile.firstNameEn || ""}
                    onChange={(e) => setProfile({ ...profile, firstNameEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastNameEn">นามสกุล (อังกฤษ)</Label>
                  <Input
                    id="lastNameEn"
                    placeholder="Last Name"
                    value={profile.lastNameEn || ""}
                    onChange={(e) => setProfile({ ...profile, lastNameEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">ชื่อผู้ใช้</Label>
                  <Input
                    id="username"
                    value={profile.username || ""}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">เลขบัตรประชาชน</Label>
                  <Input
                    id="nationalId"
                    placeholder="1234567890123"
                    maxLength={13}
                    value={profile.nationalId || ""}
                    onChange={(e) => setProfile({ ...profile, nationalId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <Button variant="outline" size="sm">
                      ยืนยัน
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupEmail">อีเมลสำรอง</Label>
                  <Input
                    id="backupEmail"
                    type="email"
                    value={profile.backupEmail || ""}
                    onChange={(e) => setProfile({ ...profile, backupEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneOffice">โทรศัพท์สำนักงาน</Label>
                  <Input
                    id="phoneOffice"
                    placeholder="02-123-4567"
                    value={profile.phoneOffice || ""}
                    onChange={(e) => setProfile({ ...profile, phoneOffice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">โทรศัพท์มือถือ</Label>
                  <Input
                    id="phone"
                    placeholder="081-234-5678"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">แผนก (ไทย)</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departmentEn">แผนก (อังกฤษ)</Label>
                  <Input
                    id="departmentEn"
                    placeholder="Department Name"
                    value={profile.departmentEn || ""}
                    onChange={(e) => setProfile({ ...profile, departmentEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">ประเภทผู้ใช้</Label>
                  <Select
                    value={profile.userType || "user"}
                    onValueChange={(value) => setProfile({ ...profile, userType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">ผู้ใช้งานทั่วไป</SelectItem>
                      <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                      <SelectItem value="manager">ผู้จัดการ</SelectItem>
                      <SelectItem value="supervisor">หัวหน้างาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">องค์กร</Label>
                <Input
                  id="organization"
                  value={profile.organization}
                  onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Account Information */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>วันที่เข้าร่วม</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(profile.joinDate).toLocaleDateString('th-TH')}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>เข้าสู่ระบบล่าสุด</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(profile.lastLogin).toLocaleString('th-TH')}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>บันทึกการเปลี่ยนแปลง</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Password & Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                รหัสผ่านและการยืนยันตัวตน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">รหัสผ่าน</h4>
                  <p className="text-sm text-muted-foreground">
                    เปลี่ยนแปลงล่าสุด: {new Date(securitySettings.passwordLastChanged).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">เปลี่ยนรหัสผ่าน</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรใหญ่ เล็ก ตัวเลข และสัญลักษณ์
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsChangePasswordDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={handleChangePassword}>
                        เปลี่ยนรหัสผ่าน
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">การรักษาความปลอดภัยสองขั้นตอน (MFA)</h4>
                  <p className="text-sm text-muted-foreground">
                    เพิ่มความปลอดภัยให้กับบัญชีด้วยการยืนยันตัวตนสองขั้นตอน
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.twoFactorEnabled ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      เปิดใช้งาน
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ปิดใช้งาน
                    </Badge>
                  )}
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={handleToggleMFA}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">การแจ้งเตือนการเข้าสู่ระบบ</h4>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, loginNotifications: checked })
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">หมดเวลาเซสชัน</h4>
                    <p className="text-sm text-muted-foreground">ระยะเวลาที่ไม่ได้ใช้งานก่อนออกจากระบบอัตโนมัติ</p>
                  </div>
                  <Select
                    value={securitySettings.sessionTimeout.toString()}
                    onValueChange={(value) => 
                      setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 นาที</SelectItem>
                      <SelectItem value="30">30 นาที</SelectItem>
                      <SelectItem value="60">1 ชั่วโมง</SelectItem>
                      <SelectItem value="120">2 ชั่วโมง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trusted Devices */}
          <Card>
            <CardHeader>
              <CardTitle>อุปกรณ์ที่เชื่อถือ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securitySettings.trustedDevices.map((device) => (
                  <div key={device.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.deviceType)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {device.name}
                          {device.isCurrent && (
                            <Badge variant="outline" className="text-xs">ปัจจุบัน</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {device.browser} • {device.ipAddress}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          เข้าใช้ล่าสุด: {new Date(device.lastAccess).toLocaleString('th-TH')}
                        </div>
                      </div>
                    </div>
                    {!device.isCurrent && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveTrustedDevice(device.id)}
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการเข้าสู่ระบบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securitySettings.loginHistory.map((login) => (
                  <div key={login.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                          {new Date(login.timestamp).toLocaleString('th-TH')}
                        </div>
                        {getLoginStatusBadge(login.success)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {login.device} • {login.browser} • {login.ipAddress}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {login.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                การแจ้งเตือน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">การแจ้งเตือนทางอีเมล</h4>
                    <p className="text-sm text-muted-foreground">รับการแจ้งเตือนสำคัญทางอีเมล</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">การแจ้งเตือนแบบ Push</h4>
                    <p className="text-sm text-muted-foreground">รับการแจ้งเตือนในเบราว์เซอร์</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">การแจ้งเตือนทาง SMS</h4>
                    <p className="text-sm text-muted-foreground">รับการแจ้งเตือนสำคัญทางข้อความ</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">ประเภทการแจ้งเตือน</h4>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">รายงานประจำสัปดาห์</h5>
                    <p className="text-sm text-muted-foreground">สรุปกิจกรรมและสถิติประจำสัปดาห์</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">การแจ้งเตือนระบบ</h5>
                    <p className="text-sm text-muted-foreground">การแจ้งเตือนเกี่ยวกับระบบและการบำรุงรักษา</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, systemAlerts: checked })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">อีเมลการตลาด</h5>
                    <p className="text-sm text-muted-foreground">ข่าวสารและโปรโมชั่นจากเรา</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>บันทึกการตั้งค่า</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                การตั้งค่าทั่วไป
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">ภาษา</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="th">ไทย</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">เขตเวลา</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">การดาวน์โหลดข้อมูล</h4>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    ดาวน์โหลดข้อมูลส่วนตัว
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    ดาวน์โหลดกิจกรรม
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ดาวน์โหลดข้อมูลของคุณในรูปแบบ JSON หรือ CSV
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">โซนอันตราย</h4>
                <div className="space-y-2">
                  <Button variant="destructive" disabled>
                    ลบบัญชี
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    การลบบัญชีจะไม่สามารถยกเลิกได้ กรุณาติดต่อผู้ดูแลระบบหากต้องการลบบัญชี
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>บันทึกการตั้งค่า</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}