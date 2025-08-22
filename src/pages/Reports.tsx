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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from '@/hooks/use-toast';
import ReportModal from '@/components/ReportModal';
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
  Eye,
  Building,
  Shield,
  UserX,
  Phone,
  FileText,
  PieChart,
  BarChart,
  LineChart,
  ExternalLink
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

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

// Additional interfaces for new requirements
interface LicenseData {
  service: string;
  total: number;
  used: number;
  available: number;
  usage_percentage: number;
}

interface OrganizationData {
  name: string;
  domain: string;
  licenses_used: number;
  total_licenses: number;
}

interface MailRelayData {
  date: string;
  accepted: number;
  rejected: number;
  success_rate: number;
}

interface RelaySystem {
  name: string;
  admin: string;
  email: string;
  phone: string;
  status: 'ปกติ' | 'ต้องติดตาม' | 'ต้องตรวจสอบ';
}

interface InactiveAccount {
  username: string;
  email: string;
  department: string;
  last_login: string;
  days_inactive: number;
}

interface AdminContact {
  organization: string;
  admin_name: string;
  email: string;
  phone: string;
  users_count: number;
}

// Mock data for new features
const mockKPIData = [
  { title: 'Daily Active Users (DAU)', value: '1,247', change: 12.5, icon: Users, color: 'blue' },
  { title: 'Total Services', value: '3', change: 0, icon: Activity, color: 'green' },
  { title: 'License Usage', value: '78%', change: 2.5, icon: Shield, color: 'orange' },
  { title: 'Growth Trend', value: '+15.2%', change: 15.2, icon: TrendingUp, color: 'purple' }
];

const mockServiceUsageChart = [
  { name: 'อีเมล', value: 45, fill: 'hsl(var(--chart-1))' },
  { name: 'แชท', value: 30, fill: 'hsl(var(--chart-2))' },
  { name: 'ประชุม', value: 25, fill: 'hsl(var(--chart-3))' }
];

const mockLicenseData: LicenseData[] = [
  { service: 'อีเมล', total: 2000, used: 1560, available: 440, usage_percentage: 78 },
  { service: 'แชท', total: 1500, used: 1140, available: 360, usage_percentage: 76 },
  { service: 'ประชุม', total: 1000, used: 680, available: 320, usage_percentage: 68 }
];

const mockOrganizationData: OrganizationData[] = [
  { name: 'กรมบัญชีกลาง', domain: 'cgd.go.th', licenses_used: 450, total_licenses: 500 },
  { name: 'กรมสรรพากร', domain: 'rd.go.th', licenses_used: 380, total_licenses: 400 },
  { name: 'กรมศุลกากร', domain: 'customs.go.th', licenses_used: 340, total_licenses: 350 },
  { name: 'กรมพัฒนาที่ดิน', domain: 'dld.go.th', licenses_used: 290, total_licenses: 300 },
  { name: 'กรมป่าไผ่', domain: 'dnp.go.th', licenses_used: 240, total_licenses: 280 }
];

const mockMailRelayData: MailRelayData[] = [
  { date: '21/01', accepted: 15420, rejected: 234, success_rate: 98.5 },
  { date: '22/01', accepted: 16780, rejected: 189, success_rate: 98.9 },
  { date: '23/01', accepted: 14560, rejected: 312, success_rate: 97.9 },
  { date: '24/01', accepted: 17890, rejected: 156, success_rate: 99.1 },
  { date: '25/01', accepted: 16230, rejected: 201, success_rate: 98.8 }
];

const mockRelaySystemsData: RelaySystem[] = [
  { name: 'Mail Relay 01', admin: 'นายสมชาย ใจดี', email: 'somchai@gov.th', phone: '02-123-4567', status: 'ปกติ' },
  { name: 'Mail Relay 02', admin: 'นางสาวสมหญิง รักดี', email: 'somying@gov.th', phone: '02-234-5678', status: 'ปกติ' },
  { name: 'Mail Relay 03', admin: 'นายประชา สุขใจ', email: 'pracha@gov.th', phone: '02-345-6789', status: 'ต้องติดตาม' }
];

const mockInactiveAccounts: InactiveAccount[] = [
  { username: 'user001', email: 'user001@gov.th', department: 'กรมบัญชีกลาง', last_login: '2024-12-10', days_inactive: 42 },
  { username: 'user002', email: 'user002@gov.th', department: 'กรมสรรพากr', last_login: '2024-12-15', days_inactive: 37 },
  { username: 'user003', email: 'user003@gov.th', department: 'กรมศุลกากร', last_login: '2024-11-20', days_inactive: 62 },
  { username: 'user004', email: 'user004@gov.th', department: 'กรมพัฒนาที่ดิน', last_login: '2024-10-30', days_inactive: 83 },
  { username: 'user005', email: 'user005@gov.th', department: 'กรมป่าไผ่', last_login: '2024-09-15', days_inactive: 128 }
];

const mockAdminContacts: AdminContact[] = [
  { organization: 'กรมบัญชีกลาง', admin_name: 'นายสมชาย จันทร์ดี', email: 'admin1@cgd.go.th', phone: '02-123-4567', users_count: 450 },
  { organization: 'กรมสรรพากร', admin_name: 'นางสาวสมหญิง แสงดี', email: 'admin2@rd.go.th', phone: '02-234-5678', users_count: 380 },
  { organization: 'กรมศุลกากร', admin_name: 'นายประชา สุขใจ', email: 'admin3@customs.go.th', phone: '02-345-6789', users_count: 340 },
  { organization: 'กรมพัฒนาที่ดิน', admin_name: 'นางวิไล ใสใจ', email: 'admin4@dld.go.th', phone: '02-456-7890', users_count: 290 }
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

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
  const [currentTab, setCurrentTab] = useState('executive');
  const [dateRange, setDateRange] = useState('7days');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    reportType: string;
    title: string;
  }>({
    isOpen: false,
    reportType: '',
    title: ''
  });

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

  const handleCardClick = (reportType: string, title: string) => {
    setModalData({ 
      isOpen: true, 
      reportType, 
      title 
    });
  };

  const closeModal = () => {
    setModalData({ 
      isOpen: false, 
      reportType: '', 
      title: '' 
    });
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
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">รายงานและการวิเคราะห์</h1>
            <p className="text-sm md:text-base text-muted-foreground">ติดตามประสิทธิภาพและการใช้งานระบบ</p>
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

        {/* Scrollable Tab Navigation for Mobile */}
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground min-w-max">
            <TabsTrigger value="executive" className="text-xs md:text-sm px-2 md:px-3">Executive Overview</TabsTrigger>
            <TabsTrigger value="license" className="text-xs md:text-sm px-2 md:px-3">License & Quota</TabsTrigger>
            <TabsTrigger value="services" className="text-xs md:text-sm px-2 md:px-3">Service Usage</TabsTrigger>
            <TabsTrigger value="mail-relay" className="text-xs md:text-sm px-2 md:px-3">Mail Relay</TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs md:text-sm px-2 md:px-3">Inactive Accounts</TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs md:text-sm px-2 md:px-3">Admin Contacts</TabsTrigger>
          </TabsList>
        </div>

        {/* Executive Overview Tab */}
        <TabsContent value="executive" className="space-y-4 md:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {mockKPIData.map((kpi, index) => {
          const Icon = kpi.icon;
          const gradients = [
            'bg-gradient-to-br from-blue-500 to-blue-600',
            'bg-gradient-to-br from-green-500 to-emerald-600', 
            'bg-gradient-to-br from-purple-500 to-violet-600',
            'bg-gradient-to-br from-orange-500 to-amber-600'
          ];
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('executive', 'Executive Overview')}>
              <div className={`${gradients[index]} p-4 text-white relative`}>
                <div className="absolute top-2 right-2 opacity-20">
                  <Icon className="h-12 w-12" />
                </div>
                <CardTitle className="text-xs md:text-sm font-medium text-white/90">{kpi.title}</CardTitle>
                <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs text-white/80 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{kpi.change}%</span>
                  <span>จาก 90 วันที่ผ่านมา</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Service Usage Donut Chart */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('executive', 'Service Usage Breakdown')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  การใช้งานแยกตามบริการ
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-lg -z-10"></div>
                <ChartContainer
                  config={{
                    email: { label: "อีเมล", color: "hsl(var(--chart-1))" },
                    chat: { label: "แชท", color: "hsl(var(--chart-2))" },
                    meeting: { label: "ประชุม", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <defs>
                        <linearGradient id="colorEmail" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(214 84% 56%)" />
                          <stop offset="100%" stopColor="hsl(214 84% 46%)" />
                        </linearGradient>
                        <linearGradient id="colorChat" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(142 76% 36%)" />
                          <stop offset="100%" stopColor="hsl(142 76% 26%)" />
                        </linearGradient>
                        <linearGradient id="colorMeeting" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                          <stop offset="100%" stopColor="hsl(262 83% 48%)" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={mockServiceUsageChart}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={130}
                        paddingAngle={3}
                        strokeWidth={2}
                        stroke="#ffffff"
                      >
                        {mockServiceUsageChart.map((entry, index) => {
                          const gradientIds = ['url(#colorEmail)', 'url(#colorChat)', 'url(#colorMeeting)'];
                          return (
                            <Cell key={`cell-${index}`} fill={gradientIds[index % gradientIds.length]} />
                          );
                        })}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                        }} 
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Growth Trend Chart */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('executive', 'Growth Trends')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-600" />
                  แนวโน้มการใช้งาน 90 วัน
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-lg -z-10"></div>
                <ChartContainer
                  config={{
                    users: { label: "ผู้ใช้งาน", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockUserActivity}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(214 84% 56%)" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="hsl(214 84% 56%)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activeUsers" 
                        stroke="hsl(214 84% 56%)"
                        strokeWidth={3}
                        fill="url(#areaGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* License & Quota Tab */}
        <TabsContent value="license" className="space-y-4 md:space-y-6">
          {/* License Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('license', 'License Overview')}>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
                <CardTitle className="text-sm text-white/90">โควตารวม</CardTitle>
                <div className="text-2xl font-bold mt-2">4,500</div>
                <p className="text-xs text-white/80">ใบอนุญาต</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('license', 'License Usage')}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                <CardTitle className="text-sm text-white/90">โควตาที่ใช้</CardTitle>
                <div className="text-2xl font-bold mt-2">3,380</div>
                <p className="text-xs text-white/80">ใบอนุญาต</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('license', 'Utilization Rate')}>
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-4 text-white">
                <CardTitle className="text-sm text-white/90">อัตราการใช้งาน</CardTitle>
                <div className="text-2xl font-bold mt-2">75.1%</div>
                <Progress value={75.1} className="mt-2 bg-white/20" />
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('license', 'Organizations')}>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white">
                <CardTitle className="text-sm text-white/90">จำนวนองค์กร</CardTitle>
                <div className="text-2xl font-bold mt-2">45</div>
                <p className="text-xs text-white/80">องค์กร</p>
              </div>
            </Card>
          </div>

          {/* License Allocation Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-600" />
                  การจัดสรรใบอนุญาตตามบริการ
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-lg -z-10"></div>
                <ChartContainer
                  config={{
                    used: { label: "ใช้งาน", color: "hsl(var(--chart-1))" },
                    available: { label: "เหลือ", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockLicenseData}>
                      <defs>
                        <linearGradient id="usedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(214 84% 56%)" />
                          <stop offset="100%" stopColor="hsl(214 84% 46%)" />
                        </linearGradient>
                        <linearGradient id="availableGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(142 76% 36%)" />
                          <stop offset="100%" stopColor="hsl(142 76% 26%)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="service" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="used" fill="url(#usedGradient)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="available" fill="url(#availableGradient)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Organizations Table */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>องค์กรที่ใช้โควตาสูงสุด 5 อันดับ</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-lg -z-10"></div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>องค์กร</TableHead>
                      <TableHead>ใช้งาน</TableHead>
                      <TableHead>อัตรา</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrganizationData.slice(0, 5).map((org, index) => (
                      <TableRow key={index} className="hover:bg-white/50 transition-colors">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{org.name}</div>
                            <div className="text-xs text-muted-foreground">{org.domain}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {org.licenses_used}/{org.total_licenses}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(org.licenses_used / org.total_licenses) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{Math.round((org.licenses_used / org.total_licenses) * 100)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Service Usage Tab */}
        <TabsContent value="services" className="space-y-4 md:space-y-6">
          {/* Service Usage Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('services', 'Email Usage')}>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Mail className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">อีเมลส่ง</CardTitle>
                <div className="text-2xl font-bold mt-2">45,230</div>
                <p className="text-xs text-white/80">ฉบับ</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('services', 'Email Received')}>
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Mail className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">อีเมลรับ</CardTitle>
                <div className="text-2xl font-bold mt-2">52,890</div>
                <p className="text-xs text-white/80">ฉบับ</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('services', 'Chat Messages')}>
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">ข้อความแชท</CardTitle>
                <div className="text-2xl font-bold mt-2">89,450</div>
                <p className="text-xs text-white/80">ข้อความ</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('services', 'Meeting Minutes')}>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Video className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">นาทีประชุม</CardTitle>
                <div className="text-2xl font-bold mt-2">12,340</div>
                <p className="text-xs text-white/80">นาที</p>
              </div>
            </Card>
          </div>

          {/* Email Usage Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                แนวโน้มการใช้งานอีเมล
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sent: { label: "ส่ง", color: "hsl(var(--chart-1))" },
                  received: { label: "รับ", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMailRelayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="accepted" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="rejected" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Service Usage by Account Table */}
          <Card>
            <CardHeader>
              <CardTitle>การใช้งานรายบัญชี</CardTitle>
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

        {/* Mail Relay Tab */}
        <TabsContent value="mail-relay" className="space-y-4 md:space-y-6">
          {/* Mail Relay Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('mail-relay', 'Accepted Emails')}>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Accepted</CardTitle>
                <div className="text-2xl font-bold mt-2">16,230</div>
                <p className="text-xs text-white/80">อีเมล</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('mail-relay', 'Rejected Emails')}>
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Rejected</CardTitle>
                <div className="text-2xl font-bold mt-2">201</div>
                <p className="text-xs text-white/80">อีเมล</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('mail-relay', 'Success Rate')}>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Success Rate</CardTitle>
                <div className="text-2xl font-bold mt-2">98.8%</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: '98.8%' }}></div>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('mail-relay', 'Relay Systems')}>
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Activity className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Relay Systems</CardTitle>
                <div className="text-2xl font-bold mt-2">3</div>
                <p className="text-xs text-white/80">ระบบ</p>
              </div>
            </Card>
          </div>

          {/* Mail Relay Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accepted/Rejected Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  แนวโน้ม Accepted/Rejected รายวัน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accepted: { label: "Accepted", color: "hsl(var(--chart-1))" },
                    rejected: { label: "Rejected", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMailRelayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="accepted" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="rejected" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Success Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  อัตราความสำเร็จรายวัน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    success_rate: { label: "Success Rate", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={mockMailRelayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="success_rate" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Relay Systems Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                ระบบ Relay และผู้ดูแล
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ระบบ</TableHead>
                    <TableHead>ผู้ดูแล</TableHead>
                    <TableHead>ติดต่อ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRelaySystemsData.map((system, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{system.name}</div>
                      </TableCell>
                      <TableCell>{system.admin}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{system.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{system.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          system.status === 'ปกติ' ? 'default' : 
                          system.status === 'ต้องติดตาม' ? 'secondary' : 'destructive'
                        }>
                          {system.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inactive Accounts Tab */}
        <TabsContent value="inactive" className="space-y-4 md:space-y-6">
          {/* Inactive Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('inactive', 'Inactive 15 Days')}>
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <UserX className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Inactive {'>'} 15 วัน</CardTitle>
                <div className="text-2xl font-bold mt-2">28</div>
                <p className="text-xs text-white/80">บัญชี</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('inactive', 'Inactive 30 Days')}>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <UserX className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Inactive {'>'} 30 วัน</CardTitle>
                <div className="text-2xl font-bold mt-2">15</div>
                <p className="text-xs text-white/80">บัญชี</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('inactive', 'Inactive 90 Days')}>
              <div className="bg-gradient-to-br from-red-600 to-rose-700 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <UserX className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">Inactive {'>'} 90 วัน</CardTitle>
                <div className="text-2xl font-bold mt-2">8</div>
                <p className="text-xs text-white/80">บัญชี</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('inactive', 'Total Inactive')}>
              <div className="bg-gradient-to-br from-gray-600 to-slate-700 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">รวมทั้งหมด</CardTitle>
                <div className="text-2xl font-bold mt-2">51</div>
                <p className="text-xs text-white/80">บัญชี</p>
              </div>
            </Card>
          </div>

          {/* Action Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                คำแนะนำการดำเนินการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">บัญชีไม่ได้ใช้งาน {'>'} 30 วัน</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        แนะนำให้ติดต่อผู้ใช้งานเพื่อยืนยันการใช้งานต่อ หรือพิจารณาระงับบัญชี
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">บัญชีไม่ได้ใช้งาน {'>'} 90 วัน</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        ควรพิจารณาปิดบัญชีและเรียกคืนใบอนุญาตเพื่อจัดสรรให้ผู้ใช้งานใหม่
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inactive Accounts Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5" />
                  รายชื่อบัญชีไม่ได้ใช้งาน
                </CardTitle>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออก CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อผู้ใช้</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>หน่วยงาน</TableHead>
                    <TableHead>ล็อกอินล่าสุด</TableHead>
                    <TableHead>วันที่ไม่ได้ใช้</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInactiveAccounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{account.username}</div>
                      </TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.department}</TableCell>
                      <TableCell>{new Date(account.last_login).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {account.days_inactive} วัน
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          account.days_inactive > 90 ? 'destructive' : 
                          account.days_inactive > 30 ? 'secondary' : 'outline'
                        }>
                          {account.days_inactive > 90 ? 'ต้องปิดบัญชี' : 
                           account.days_inactive > 30 ? 'ต้องติดตาม' : 'เตือน'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4 md:space-y-6">
          {/* Admin Contact Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('contacts', 'Total Organizations')}>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Building className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">องค์กรทั้งหมด</CardTitle>
                <div className="text-2xl font-bold mt-2">45</div>
                <p className="text-xs text-white/80">องค์กร</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('contacts', 'Total Admins')}>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">ผู้ดูแลทั้งหมด</CardTitle>
                <div className="text-2xl font-bold mt-2">52</div>
                <p className="text-xs text-white/80">คน</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('contacts', 'Average Admins')}>
              <div className="bg-gradient-to-br from-teal-500 to-green-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">ค่าเฉลี่ย</CardTitle>
                <div className="text-2xl font-bold mt-2">1.16</div>
                <p className="text-xs text-white/80">ผู้ดูแลต่อองค์กร</p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleCardClick('contacts', 'Coverage')}>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white relative">
                <div className="absolute top-2 right-2 opacity-20">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-sm text-white/90">ความครอบคลุม</CardTitle>
                <div className="text-2xl font-bold mt-2">100%</div>
                <p className="text-xs text-white/80">องค์กรมีผู้ดูแล</p>
              </div>
            </Card>
          </div>

          {/* Admin Contacts Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  ข้อมูลติดต่อผู้ดูแลองค์กร
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    ส่งออก CSV
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    รายงานตามองค์กร
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>องค์กร</TableHead>
                    <TableHead>ผู้ดูแล</TableHead>
                    <TableHead>ข้อมูลติดต่อ</TableHead>
                    <TableHead>ผู้ใช้งาน</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdminContacts.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{contact.organization}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {contact.admin_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{contact.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contact.users_count} คน
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" title="ส่งอีเมล">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" title="โทรศัพท์">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" title="ส่งข้อความ">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Modal */}
      <ReportModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        reportType={modalData.reportType}
        title={modalData.title}
      />
    </div>
  );
}