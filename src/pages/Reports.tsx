import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Download, 
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Video,
  HardDrive,
  Activity,
  Eye
} from 'lucide-react';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
}

interface SystemHealth {
  component: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  uptime: number;
  lastCheck: string;
  responseTime: number;
}

interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
  totalLogins: number;
  avgSessionTime: number;
}

interface ServiceUsage {
  service: string;
  totalUsage: number;
  uniqueUsers: number;
  avgUsageTime: number;
  growthRate: number;
}

const mockMetrics: DashboardMetric[] = [
  {
    id: '1',
    title: 'ผู้ใช้งานรวม',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    icon: Users,
    color: 'blue'
  },
  {
    id: '2', 
    title: 'ผู้ใช้งานออนไลน์',
    value: 324,
    change: 8.3,
    changeType: 'increase',
    icon: Activity,
    color: 'green'
  },
  {
    id: '3',
    title: 'อีเมลส่งวันนี้',
    value: '2,543',
    change: -5.2,
    changeType: 'decrease',
    icon: Mail,
    color: 'orange'
  },
  {
    id: '4',
    title: 'การประชุมออนไลน์',
    value: 89,
    change: 23.1,
    changeType: 'increase',
    icon: Video,
    color: 'purple'
  },
  {
    id: '5',
    title: 'พื้นที่จัดเก็บใช้งาน',
    value: '78%',
    change: 2.5,
    changeType: 'increase',
    icon: HardDrive,
    color: 'red'
  },
  {
    id: '6',
    title: 'ข้อความแชท',
    value: '15,234',
    change: 18.7,
    changeType: 'increase',
    icon: MessageSquare,
    color: 'cyan'
  }
];

const mockSystemHealth: SystemHealth[] = [
  {
    component: 'Web Server',
    status: 'Healthy',
    uptime: 99.9,
    lastCheck: '2024-01-25T15:30:00',
    responseTime: 45
  },
  {
    component: 'Database',
    status: 'Healthy',
    uptime: 99.8,
    lastCheck: '2024-01-25T15:29:30',
    responseTime: 12
  },
  {
    component: 'Email Service',
    status: 'Warning',
    uptime: 98.5,
    lastCheck: '2024-01-25T15:28:45',
    responseTime: 120
  },
  {
    component: 'File Storage',
    status: 'Healthy',
    uptime: 99.7,
    lastCheck: '2024-01-25T15:30:15',
    responseTime: 35
  },
  {
    component: 'Authentication',
    status: 'Critical',
    uptime: 95.2,
    lastCheck: '2024-01-25T15:25:00',
    responseTime: 250
  }
];

const mockUserActivity: UserActivity[] = [
  { date: '2024-01-21', activeUsers: 1180, newUsers: 15, totalLogins: 2340, avgSessionTime: 45 },
  { date: '2024-01-22', activeUsers: 1205, newUsers: 22, totalLogins: 2410, avgSessionTime: 48 },
  { date: '2024-01-23', activeUsers: 1189, newUsers: 18, totalLogins: 2378, avgSessionTime: 42 },
  { date: '2024-01-24', activeUsers: 1234, newUsers: 28, totalLogins: 2468, avgSessionTime: 51 },
  { date: '2024-01-25', activeUsers: 1247, newUsers: 31, totalLogins: 2494, avgSessionTime: 47 }
];

const mockServiceUsage: ServiceUsage[] = [
  { service: 'Email', totalUsage: 45230, uniqueUsers: 1180, avgUsageTime: 35, growthRate: 12.5 },
  { service: 'Chat', totalUsage: 89450, uniqueUsers: 934, avgUsageTime: 125, growthRate: 28.3 },
  { service: 'Video Conference', totalUsage: 12340, uniqueUsers: 456, avgUsageTime: 65, growthRate: 45.2 },
  { service: 'File Storage', totalUsage: 156780, uniqueUsers: 1089, avgUsageTime: 15, growthRate: 8.7 },
  { service: 'Calendar', totalUsage: 34560, uniqueUsers: 789, avgUsageTime: 20, growthRate: 15.6 }
];

export default function Reports() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('7days');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');

  const handleRefreshData = () => {
    toast({
      title: "รีเฟรชข้อมูลสำเร็จ",
      description: "อัปเดตข้อมูลล่าสุดเรียบร้อยแล้ว",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "ส่งออกรายงานสำเร็จ",
      description: `กำลังดาวน์โหลด ${selectedReport}`,
    });
    setIsExportDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Healthy: "default",
      Warning: "secondary", 
      Critical: "destructive"
    };
    const colors = {
      Healthy: "text-green-700",
      Warning: "text-yellow-700",
      Critical: "text-red-700"
    };
    const statusText = {
      Healthy: "ปกติ",
      Warning: "เตือน",
      Critical: "วิกฤต"
    };
    return <Badge variant={variants[status] || "default"} className={colors[status as keyof typeof colors]}>
      {statusText[status as keyof typeof statusText]}
    </Badge>;
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const totalActiveUsers = mockUserActivity[mockUserActivity.length - 1]?.activeUsers || 0;
  const avgUptime = mockSystemHealth.reduce((sum, health) => sum + health.uptime, 0) / mockSystemHealth.length;
  const criticalIssues = mockSystemHealth.filter(h => h.status === 'Critical').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">รายงานและการวิเคราะห์</h1>
            <p className="text-muted-foreground">ติดตามประสิทธิภาพและการใช้งานระบบ</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">วันนี้</SelectItem>
                <SelectItem value="7days">7 วัน</SelectItem>
                <SelectItem value="30days">30 วัน</SelectItem>
                <SelectItem value="90days">90 วัน</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              รีเฟรช
            </Button>
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออกรายงาน
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ส่งออกรายงาน</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportType">ประเภทรายงาน</Label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกรายงาน" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard Summary</SelectItem>
                        <SelectItem value="user-activity">กิจกรรมผู้ใช้</SelectItem>
                        <SelectItem value="system-health">สถานะระบบ</SelectItem>
                        <SelectItem value="service-usage">การใช้งานบริการ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">รูปแบบไฟล์</Label>
                    <Select defaultValue="excel">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleExportReport} disabled={!selectedReport}>
                    ส่งออก
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">ผู้ใช้งาน</TabsTrigger>
          <TabsTrigger value="services">บริการ</TabsTrigger>
          <TabsTrigger value="system">ระบบ</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getChangeIcon(metric.changeType)}
                      <span className={metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span>จากเมื่อวาน</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ผู้ใช้งานออนไลน์
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{totalActiveUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">ผู้ใช้งานที่เข้าสู่ระบบ</div>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  อัปไทม์โดยเฉลี่ย
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{avgUptime.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">ความเสถียรของระบบ</div>
                <Progress value={avgUptime} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  ปัญหาวิกฤต
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{criticalIssues}</div>
                <div className="text-sm text-muted-foreground">ต้องแก้ไขด่วน</div>
                {criticalIssues > 0 && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <Eye className="h-4 w-4 mr-2" />
                    ดูรายละเอียด
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>กิจกรรมล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '15:30', activity: 'ผู้ใช้ใหม่ 5 คน ลงทะเบียนเข้าระบบ', type: 'info' },
                  { time: '14:45', activity: 'การประชุมออนไลน์ดำเนินการ 23 ห้อง', type: 'success' },
                  { time: '13:20', activity: 'Email Service มีปัญหาการเชื่อมต่อ', type: 'warning' },
                  { time: '12:15', activity: 'อัปเดตระบบ License Management เรียบร้อย', type: 'success' },
                  { time: '11:30', activity: 'Storage Quota เกิน 80% ใน 3 องค์กร', type: 'warning' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{activity.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.activity}</p>
                    </div>
                    <Badge variant={activity.type === 'success' ? 'default' : activity.type === 'warning' ? 'secondary' : 'outline'}>
                      {activity.type === 'success' ? 'สำเร็จ' : activity.type === 'warning' ? 'เตือน' : 'ข้อมูล'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>กิจกรรมผู้ใช้งานรายวัน</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>ผู้ใช้งานออนไลน์</TableHead>
                    <TableHead>ผู้ใช้ใหม่</TableHead>
                    <TableHead>จำนวนล็อกอิน</TableHead>
                    <TableHead>เวลาออนไลน์เฉลี่ย</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUserActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(activity.date).toLocaleDateString('th-TH')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{activity.activeUsers.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">+{activity.newUsers}</Badge>
                      </TableCell>
                      <TableCell>{activity.totalLogins.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {activity.avgSessionTime} นาที
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>การใช้งานบริการ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>บริการ</TableHead>
                    <TableHead>การใช้งานรวม</TableHead>
                    <TableHead>ผู้ใช้งานเฉพาะ</TableHead>
                    <TableHead>เวลาใช้งานเฉลี่ย</TableHead>
                    <TableHead>อัตราเติบโต</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockServiceUsage.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {service.service === 'Email' && <Mail className="h-4 w-4" />}
                          {service.service === 'Chat' && <MessageSquare className="h-4 w-4" />}
                          {service.service === 'Video Conference' && <Video className="h-4 w-4" />}
                          {service.service === 'File Storage' && <HardDrive className="h-4 w-4" />}
                          {service.service === 'Calendar' && <Calendar className="h-4 w-4" />}
                          <span className="font-medium">{service.service}</span>
                        </div>
                      </TableCell>
                      <TableCell>{service.totalUsage.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          {service.uniqueUsers.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {service.avgUsageTime} นาที
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">+{service.growthRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สุขภาพระบบ</CardTitle>
              <p className="text-sm text-muted-foreground">
                ติดตามสถานะและประสิทธิภาพของส่วนประกอบระบบ
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ส่วนประกอบ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>อัปไทม์</TableHead>
                    <TableHead>เวลาตอบสนง</TableHead>
                    <TableHead>ตรวจสอบล่าสุด</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSystemHealth.map((health, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span className="font-medium">{health.component}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {health.status === 'Healthy' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {health.status === 'Warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                          {health.status === 'Critical' && <AlertCircle className="h-4 w-4 text-red-600" />}
                          {getStatusBadge(health.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{health.uptime}%</span>
                          </div>
                          <Progress value={health.uptime} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={health.responseTime > 100 ? "destructive" : "outline"}>
                          {health.responseTime}ms
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(health.lastCheck).toLocaleString('th-TH')}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                การแจ้งเตือนระบบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSystemHealth.filter(h => h.status !== 'Healthy').map((alert, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    alert.status === 'Critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`h-4 w-4 ${
                            alert.status === 'Critical' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                          <span className="font-medium">{alert.component}</span>
                          {getStatusBadge(alert.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          อัปไทม์: {alert.uptime}% | เวลาตอบสนง: {alert.responseTime}ms
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ตรวจสอบล่าสุด: {new Date(alert.lastCheck).toLocaleString('th-TH')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        ตรวจสอบ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}