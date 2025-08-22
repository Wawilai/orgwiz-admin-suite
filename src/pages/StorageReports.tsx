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
import { DatePicker } from '@/components/ui/date-picker';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from '@/hooks/use-toast';
import { 
  HardDrive, 
  Download, 
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  AlertTriangle,
  BarChart3,
  FileText,
  ArrowLeft
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface StorageReport {
  date: string;
  totalUsage: number;
  userUsage: number;
  departmentUsage: number;
  organizationUsage: number;
  growth: number;
}

interface UsageByEntity {
  name: string;
  usage: number;
  quota: number;
  utilizationRate: number;
  type: 'User' | 'Department' | 'Organization';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

const mockStorageReports: StorageReport[] = [
  { date: '2024-01-01', totalUsage: 1500, userUsage: 800, departmentUsage: 400, organizationUsage: 300, growth: 2.5 },
  { date: '2024-01-02', totalUsage: 1520, userUsage: 815, departmentUsage: 405, organizationUsage: 300, growth: 1.3 },
  { date: '2024-01-03', totalUsage: 1545, userUsage: 830, departmentUsage: 410, organizationUsage: 305, growth: 1.6 },
  { date: '2024-01-04', totalUsage: 1580, userUsage: 850, departmentUsage: 420, organizationUsage: 310, growth: 2.3 },
  { date: '2024-01-05', totalUsage: 1610, userUsage: 870, departmentUsage: 430, organizationUsage: 310, growth: 1.9 },
  { date: '2024-01-06', totalUsage: 1640, userUsage: 890, departmentUsage: 440, organizationUsage: 310, growth: 1.9 },
  { date: '2024-01-07', totalUsage: 1670, userUsage: 910, departmentUsage: 450, organizationUsage: 310, growth: 1.8 }
];

const mockUsageByEntity: UsageByEntity[] = [
  {
    name: 'สมชาย ใจดี',
    usage: 45.2,
    quota: 50,
    utilizationRate: 90.4,
    type: 'User',
    trend: 'up',
    trendValue: 2.3
  },
  {
    name: 'นภา สว่างใส',
    usage: 38.7,
    quota: 50,
    utilizationRate: 77.4,
    type: 'User',
    trend: 'up',
    trendValue: 1.8
  },
  {
    name: 'ฝ่ายไอที',
    usage: 320.5,
    quota: 500,
    utilizationRate: 64.1,
    type: 'Department',
    trend: 'stable',
    trendValue: 0.2
  },
  {
    name: 'ฝ่ายขาย',
    usage: 280.3,
    quota: 400,
    utilizationRate: 70.1,
    type: 'Department',
    trend: 'up',
    trendValue: 3.2
  },
  {
    name: 'บริษัท เทคโนโลยี จำกัด',
    usage: 1450.8,
    quota: 2000,
    utilizationRate: 72.5,
    type: 'Organization',
    trend: 'up',
    trendValue: 2.1
  }
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

interface StorageReportsProps {
  onBack: () => void;
}

export default function StorageReports({ onBack }: StorageReportsProps) {
  const [reports] = useState<StorageReport[]>(mockStorageReports);
  const [usageByEntity] = useState<UsageByEntity[]>(mockUsageByEntity);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedEntityType, setSelectedEntityType] = useState('all');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleExportReport = () => {
    const csvData = [
      'วันที่,การใช้งานรวม (GB),ผู้ใช้ (GB),แผนก (GB),องค์กร (GB),การเติบโต (%)',
      ...reports.map(r => 
        `${r.date},${r.totalUsage},${r.userUsage},${r.departmentUsage},${r.organizationUsage},${r.growth}`
      )
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `storage-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    setIsExportDialogOpen(false);
    toast({
      title: "ส่งออกรายงานสำเร็จ",
      description: "ดาวน์โหลดรายงาน Storage เรียบร้อยแล้ว",
    });
  };

  const filteredUsage = usageByEntity.filter(entity => 
    selectedEntityType === 'all' || entity.type === selectedEntityType
  );

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const pieData = [
    { name: 'ผู้ใช้', value: reports[reports.length - 1]?.userUsage || 0 },
    { name: 'แผนก', value: reports[reports.length - 1]?.departmentUsage || 0 },
    { name: 'องค์กร', value: reports[reports.length - 1]?.organizationUsage || 0 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold">รายงาน Storage</h1>
            <p className="text-muted-foreground">รายงานการใช้งานพื้นที่จัดเก็บข้อมูล</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 วัน</SelectItem>
              <SelectItem value="30days">30 วัน</SelectItem>
              <SelectItem value="90days">90 วัน</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                ส่งออกรายงาน
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ส่งออกรายงาน Storage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>รูปแบบไฟล์</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ช่วงเวลา</Label>
                  <DatePicker placeholder="เลือกวันที่เริ่มต้น" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleExportReport}>
                  ดาวน์โหลด
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การใช้งานรวม</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports[reports.length - 1]?.totalUsage || 0} GB
            </div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{reports[reports.length - 1]?.growth || 0}% จากเมื่อวาน</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้เฉลี่ย</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((reports[reports.length - 1]?.userUsage || 0) / 20).toFixed(1)} GB
            </div>
            <p className="text-xs text-muted-foreground">ต่อผู้ใช้</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อัตราการใช้งาน</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72.5%</div>
            <Progress value={72.5} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เตือนเกินขีด</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredUsage.filter(u => u.utilizationRate > 90).length}
            </div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>แนวโน้มการใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalUsage: { label: "การใช้งานรวม", color: "hsl(var(--chart-1))" },
                userUsage: { label: "ผู้ใช้", color: "hsl(var(--chart-2))" },
                departmentUsage: { label: "แผนก", color: "hsl(var(--chart-3))" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="totalUsage"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="userUsage"
                    stackId="2"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>การกระจายการใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                usage: { label: "การใช้งาน", color: "hsl(var(--chart-1))" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="hsl(var(--chart-1))"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Usage Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>รายละเอียดการใช้งาน</CardTitle>
            <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="User">ผู้ใช้</SelectItem>
                <SelectItem value="Department">แผนก</SelectItem>
                <SelectItem value="Organization">องค์กร</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>การใช้งาน</TableHead>
                <TableHead>โควต้า</TableHead>
                <TableHead>อัตราการใช้งาน</TableHead>
                <TableHead>แนวโน้ม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsage.map((entity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {entity.type === 'User' ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                      <span>{entity.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {entity.type === 'User' ? 'ผู้ใช้' : 
                       entity.type === 'Department' ? 'แผนก' : 'องค์กร'}
                    </Badge>
                  </TableCell>
                  <TableCell>{entity.usage.toFixed(1)} GB</TableCell>
                  <TableCell>{entity.quota} GB</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className={`font-medium ${getUtilizationColor(entity.utilizationRate)}`}>
                        {entity.utilizationRate.toFixed(1)}%
                      </span>
                      <Progress value={entity.utilizationRate} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(entity.trend, entity.trendValue)}
                      <span className="text-sm">
                        {entity.trendValue > 0 ? '+' : ''}{entity.trendValue}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}