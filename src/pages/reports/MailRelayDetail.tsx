import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowLeft, Mail, CheckCircle, XCircle, AlertTriangle, Download, Activity, Server, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Mock data สำหรับ Mail Relay Detail
const mockMailRelayTrend = [
  { date: '01/03', accepted: 15847, rejected: 1203, success_rate: 92.5 },
  { date: '02/03', accepted: 16234, rejected: 1156, success_rate: 93.3 },
  { date: '03/03', accepted: 15998, rejected: 1089, success_rate: 93.6 },
  { date: '04/03', accepted: 16789, rejected: 1234, success_rate: 93.1 },
  { date: '05/03', accepted: 17234, rejected: 1178, success_rate: 93.6 },
  { date: '06/03', accepted: 16998, rejected: 1098, success_rate: 93.9 },
  { date: '07/03', accepted: 17456, rejected: 1145, success_rate: 93.8 }
];

const mockRelaySystemsStatus = [
  { 
    system: 'Primary Mail Gateway',
    server: 'mail-gw-01.cgd.go.th',
    status: 'ปกติ',
    accepted: 8945,
    rejected: 234,
    success_rate: 97.4,
    load: 78,
    response_time: 156
  },
  { 
    system: 'Secondary Mail Gateway',
    server: 'mail-gw-02.cgd.go.th',
    status: 'ปกติ',
    accepted: 6234,
    rejected: 189,
    success_rate: 97.1,
    load: 65,
    response_time: 142
  },
  { 
    system: 'Backup Mail Relay',
    server: 'mail-backup.cgd.go.th',
    status: 'ต้องตรวจสอบ',
    accepted: 2123,
    rejected: 456,
    success_rate: 82.3,
    load: 45,
    response_time: 298
  },
  { 
    system: 'External Relay Service',
    server: 'ext-relay.provider.com',
    status: 'ปกติ',
    accepted: 4567,
    rejected: 324,
    success_rate: 93.4,
    load: 89,
    response_time: 189
  }
];

const mockDomainStatistics = [
  { domain: 'cgd.go.th', accepted: 5234, rejected: 156, success_rate: 97.1, volume_trend: 12.3 },
  { domain: 'rd.go.th', accepted: 4567, rejected: 234, success_rate: 95.1, volume_trend: 8.7 },
  { domain: 'customs.go.th', accepted: 3456, rejected: 189, success_rate: 94.8, volume_trend: 15.2 },
  { domain: 'dld.go.th', accepted: 2789, rejected: 145, success_rate: 95.1, volume_trend: 5.4 },
  { domain: 'dnp.go.th', accepted: 2134, rejected: 298, success_rate: 87.7, volume_trend: -2.1 },
  { domain: 'doh.go.th', accepted: 1789, rejected: 234, success_rate: 88.4, volume_trend: 3.8 }
];

export default function MailRelayDetail() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7days');

  const totalAccepted = mockMailRelayTrend[mockMailRelayTrend.length - 1].accepted;
  const totalRejected = mockMailRelayTrend[mockMailRelayTrend.length - 1].rejected;
  const overallSuccessRate = mockMailRelayTrend[mockMailRelayTrend.length - 1].success_rate;
  const totalRelayedEmails = totalAccepted + totalRejected;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Mail Relay Status - รายละเอียด</h1>
            <p className="text-muted-foreground">การติดตามสถานะ Mail Relay และประสิทธิภาพระบบ</p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ส่งออกรายงาน Mail Relay
        </Button>
      </div>

      {/* Mail Relay Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-green-800">Success Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{overallSuccessRate}%</div>
            <p className="text-xs text-green-600 mt-1">อัตราความสำเร็จ</p>
            <Progress value={overallSuccessRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-800">Accepted</CardTitle>
            <Mail className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{totalAccepted.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">อีเมลที่ส่งสำเร็จ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-red-800">Rejected</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{totalRejected.toLocaleString()}</div>
            <p className="text-xs text-red-600 mt-1">อีเมลที่ถูกปฏิเสธ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-800">ระบบทั้งหมด</CardTitle>
            <Server className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{mockRelaySystemsStatus.length}</div>
            <p className="text-xs text-purple-600 mt-1">Relay Systems</p>
          </CardContent>
        </Card>
      </div>

      {/* Mail Relay Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            แนวโน้มการส่งอีเมลผ่าน Mail Relay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              accepted: { label: "ส่งสำเร็จ", color: "hsl(var(--chart-1))" },
              rejected: { label: "ถูกปฏิเสธ", color: "hsl(var(--chart-2))" },
              success_rate: { label: "อัตราสำเร็จ", color: "hsl(var(--chart-3))" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMailRelayTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="accepted" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                <Area yAxisId="left" type="monotone" dataKey="rejected" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="success_rate" stroke="hsl(var(--chart-3))" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Relay Systems Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            สถานะระบบ Mail Relay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ระบบ</TableHead>
                <TableHead>เซิร์ฟเวอร์</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ส่งสำเร็จ</TableHead>
                <TableHead>ถูกปฏิเสธ</TableHead>
                <TableHead>อัตราสำเร็จ</TableHead>
                <TableHead>Load</TableHead>
                <TableHead>Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRelaySystemsStatus.map((system, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{system.system}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{system.server}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      system.status === 'ปกติ' ? 'default' : 
                      system.status === 'ต้องตรวจสอบ' ? 'destructive' : 'secondary'
                    }>
                      {system.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {system.accepted.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      {system.rejected.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={system.success_rate} className="w-16" />
                      <span className="text-sm">{system.success_rate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={system.load} className="w-16" />
                      <span className="text-sm">{system.load}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {system.response_time}ms
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Domain Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            สถิติการส่งอีเมลแยกตามโดเมน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>โดเมน</TableHead>
                <TableHead>ส่งสำเร็จ</TableHead>
                <TableHead>ถูกปฏิเสธ</TableHead>
                <TableHead>อัตราสำเร็จ</TableHead>
                <TableHead>แนวโน้มปริมาณ</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDomainStatistics.map((domain, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{domain.domain}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {domain.accepted.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      {domain.rejected.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={domain.success_rate} className="w-16" />
                      <span className="text-sm">{domain.success_rate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${domain.volume_trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <Activity className="h-4 w-4" />
                      <span className="text-sm">
                        {domain.volume_trend > 0 ? '+' : ''}{domain.volume_trend}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      domain.success_rate >= 95 ? 'default' : 
                      domain.success_rate >= 90 ? 'secondary' : 'destructive'
                    }>
                      {domain.success_rate >= 95 ? 'ดีเยี่ยม' : 
                       domain.success_rate >= 90 ? 'ดี' : 'ต้องปรับปรุง'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Health Summary & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>สรุปสถานะและข้อเสนอแนะ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">ระบบทำงานปกติ</h4>
                  <p className="text-sm text-green-700 mt-1">
                    อัตราความสำเร็จ Mail Relay อยู่ที่ {overallSuccessRate}% ซึ่งอยู่ในเกณฑ์ดี
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">ต้องติดตาม Backup System</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Backup Mail Relay มีอัตราความสำเร็จ 82.3% และ Response Time สูง แนะนำให้ตรวจสอบและปรับแต่ง
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">การกระจายโหลด</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Primary Gateway รับภาระงานสูงที่สุด 78% แนะนำให้กระจายโหลดไปยัง Secondary Gateway
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