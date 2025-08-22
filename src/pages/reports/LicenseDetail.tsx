import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowLeft, Shield, Building, Users, TrendingUp, Download, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Mock data สำหรับ License Detail
const mockLicenseAllocation = [
  { service: 'อีเมล', total: 2000, used: 1560, pending: 120, available: 320 },
  { service: 'แชท', total: 1500, used: 1140, pending: 80, available: 280 },
  { service: 'ประชุม', total: 1000, used: 680, pending: 60, available: 260 },
  { service: 'จัดเก็บไฟล์', total: 1800, used: 1200, pending: 100, available: 500 }
];

const mockLicenseHistory = [
  { month: 'ต.ค.', allocated: 3200, used: 2800, utilization: 87.5 },
  { month: 'พ.ย.', allocated: 3500, used: 3100, utilization: 88.6 },
  { month: 'ธ.ค.', allocated: 4000, used: 3400, utilization: 85.0 },
  { month: 'ม.ค.', allocated: 4200, used: 3600, utilization: 85.7 },
  { month: 'ก.พ.', allocated: 4500, used: 3800, utilization: 84.4 },
  { month: 'มี.ค.', allocated: 4500, used: 3900, utilization: 86.7 }
];

const mockOrganizationLicenses = [
  { name: 'กรมบัญชีกลาง', domain: 'cgd.go.th', allocated: 500, used: 450, pending: 25, utilization: 90, trend: 5.2 },
  { name: 'กรมสรรพากร', domain: 'rd.go.th', allocated: 400, used: 380, pending: 15, utilization: 95, trend: 8.1 },
  { name: 'กรมศุลกากร', domain: 'customs.go.th', allocated: 350, used: 340, pending: 8, utilization: 97, trend: 12.3 },
  { name: 'กรมพัฒนาที่ดิน', domain: 'dld.go.th', allocated: 300, used: 290, pending: 5, utilization: 97, trend: 15.4 },
  { name: 'กรมป่าไผ่', domain: 'dnp.go.th', allocated: 280, used: 240, pending: 20, utilization: 86, trend: -2.1 },
  { name: 'กรมทางหลวง', domain: 'doh.go.th', allocated: 250, used: 220, pending: 12, utilization: 88, trend: 3.7 }
];

const mockLicenseForecasting = [
  { month: 'เม.ย.', projected: 4600, confidence: 95 },
  { month: 'พ.ค.', projected: 4750, confidence: 92 },
  { month: 'มิ.ย.', projected: 4900, confidence: 89 },
  { month: 'ก.ค.', projected: 5100, confidence: 85 },
  { month: 'ส.ค.', projected: 5250, confidence: 82 },
  { month: 'ก.ย.', projected: 5400, confidence: 78 }
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function LicenseDetail() {
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const totalAllocated = mockLicenseAllocation.reduce((sum, item) => sum + item.total, 0);
  const totalUsed = mockLicenseAllocation.reduce((sum, item) => sum + item.used, 0);
  const overallUtilization = (totalUsed / totalAllocated) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">License & Quota Management - รายละเอียด</h1>
            <p className="text-muted-foreground">การจัดการใบอนุญาตและโควตาอย่างละเอียด</p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ส่งออกรายงาน License
        </Button>
      </div>

      {/* License Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">โควตารวม</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">ใบอนุญาตทั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">กำลังใช้งาน</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUsed.toLocaleString()}</div>
            <p className="text-xs text-blue-600">ใบอนุญาตที่ใช้งาน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">อัตราการใช้งาน</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overallUtilization.toFixed(1)}%</div>
            <Progress value={overallUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">เหลือใช้งานได้</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(totalAllocated - totalUsed).toLocaleString()}</div>
            <p className="text-xs text-green-600">ใบอนุญาตว่าง</p>
          </CardContent>
        </Card>
      </div>

      {/* License Allocation by Service */}
      <Card>
        <CardHeader>
          <CardTitle>การจัดสรรใบอนุญาตแยกตามบริการ</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              used: { label: "ใช้งาน", color: "hsl(var(--chart-1))" },
              pending: { label: "รอดำเนินการ", color: "hsl(var(--chart-2))" },
              available: { label: "เหลือ", color: "hsl(var(--chart-3))" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={mockLicenseAllocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="pending" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="available" stackId="a" fill="hsl(var(--chart-3))" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* License Utilization History */}
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการใช้งานใบอนุญาต</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              allocated: { label: "จัดสรร", color: "hsl(var(--chart-2))" },
              used: { label: "ใช้งาน", color: "hsl(var(--chart-1))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLicenseHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="allocated" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="used" stackId="2" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Organization License Details */}
      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดใบอนุญาตแยกตามองค์กร</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>องค์กร</TableHead>
                <TableHead>จัดสรร</TableHead>
                <TableHead>ใช้งาน</TableHead>
                <TableHead>รอดำเนินการ</TableHead>
                <TableHead>อัตราการใช้งาน</TableHead>
                <TableHead>แนวโน้ม</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrganizationLicenses.map((org, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{org.name}</div>
                      <div className="text-xs text-muted-foreground">{org.domain}</div>
                    </div>
                  </TableCell>
                  <TableCell>{org.allocated}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      {org.used}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{org.pending}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={org.utilization} className="w-16" />
                      <span className="text-sm">{org.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-4 w-4 ${org.trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-sm ${org.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {org.trend > 0 ? '+' : ''}{org.trend}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      org.utilization >= 95 ? 'destructive' : 
                      org.utilization >= 85 ? 'secondary' : 'default'
                    }>
                      {org.utilization >= 95 ? 'เกือบเต็ม' : 
                       org.utilization >= 85 ? 'ใกล้เต็ม' : 'ปกติ'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* License Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle>การคาดการณ์ความต้องการใบอนุญาต</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              projected: { label: "คาดการณ์", color: "hsl(var(--chart-1))" },
              confidence: { label: "ความมั่นใจ %", color: "hsl(var(--chart-2))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLicenseForecasting}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="projected" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                <Area yAxisId="right" type="monotone" dataKey="confidence" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Alerts & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>การแจ้งเตือนและข้อเสนอแนะ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">องค์กรใกล้เต็มโควตา</h4>
                  <p className="text-sm text-red-700 mt-1">
                    กรมศุลกากร และ กรมพัฒนาที่ดิน ใช้งานใบอนุญาตเกิน 95% แนะนำให้เพิ่มโควตาหรือทบทวนการใช้งาน
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">การคาดการณ์ในอนาคต</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    คาดการณ์ว่าจะต้องใช้ใบอนุญาต 5,400 ใบในเดือนกันยายน แนะนำให้เตรียมจัดซื้อเพิ่มเติม
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">การจัดสรรที่เหมาะสม</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    อัตราการใช้งานโดยรวมอยู่ที่ {overallUtilization.toFixed(1)}% ซึ่งอยู่ในระดับที่เหมาะสม
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}