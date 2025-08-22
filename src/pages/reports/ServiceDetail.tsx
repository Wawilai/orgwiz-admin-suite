import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowLeft, Mail, MessageSquare, Video, HardDrive, Calendar, Download, Users, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

// Mock data สำหรับ Service Detail
const mockEmailUsage = [
  { date: '01/03', sent: 12500, received: 18200, users: 1150 },
  { date: '02/03', sent: 13200, received: 19100, users: 1180 },
  { date: '03/03', sent: 11800, received: 17900, users: 1165 },
  { date: '04/03', sent: 14500, received: 20500, users: 1200 },
  { date: '05/03', sent: 13900, received: 19800, users: 1190 },
  { date: '06/03', sent: 15200, received: 21300, users: 1220 },
  { date: '07/03', sent: 14800, received: 20900, users: 1247 }
];

const mockChatUsage = [
  { date: '01/03', messages: 45200, channels: 890, active_users: 934 },
  { date: '02/03', messages: 48900, channels: 920, active_users: 967 },
  { date: '03/03', messages: 52100, channels: 945, active_users: 989 },
  { date: '04/03', messages: 49800, channels: 935, active_users: 978 },
  { date: '05/03', messages: 51500, channels: 958, active_users: 995 },
  { date: '06/03', messages: 53700, channels: 972, active_users: 1012 },
  { date: '07/03', messages: 55200, channels: 985, active_users: 1028 }
];

const mockMeetingUsage = [
  { date: '01/03', meetings: 234, participants: 1890, duration: 12400 },
  { date: '02/03', meetings: 267, participants: 2150, duration: 14200 },
  { date: '03/03', meetings: 245, participants: 1980, duration: 13100 },
  { date: '04/03', meetings: 289, participants: 2340, duration: 15800 },
  { date: '05/03', meetings: 298, participants: 2420, duration: 16200 },
  { date: '06/03', meetings: 312, participants: 2580, duration: 17100 },
  { date: '07/03', meetings: 325, participants: 2650, duration: 17800 }
];

const mockServiceComparison = [
  { service: 'อีเมล', active_users: 1247, total_actions: 36100, avg_session: 25, growth: 12.5 },
  { service: 'แชท', active_users: 1028, total_actions: 55200, avg_session: 85, growth: 28.3 },
  { service: 'ประชุมออนไลน์', active_users: 456, total_actions: 325, avg_session: 55, growth: 45.2 },
  { service: 'จัดเก็บไฟล์', active_users: 892, total_actions: 8940, avg_session: 15, growth: 8.7 },
  { service: 'ปฏิทิน', active_users: 789, total_actions: 2340, avg_session: 12, growth: 15.6 }
];

const mockDepartmentUsage = [
  { department: 'กรมบัญชีกลาง', email: 8500, chat: 12000, meeting: 145, storage: 2.8, satisfaction: 4.2 },
  { department: 'กรมสรรพากร', email: 7200, chat: 9800, meeting: 125, storage: 2.3, satisfaction: 4.0 },
  { department: 'กรมศุลกากร', email: 6800, chat: 8500, meeting: 98, storage: 2.1, satisfaction: 3.9 },
  { department: 'กรมพัฒนาที่ดิน', email: 5900, chat: 7200, meeting: 87, storage: 1.9, satisfaction: 4.1 },
  { department: 'กรมป่าไผ่', email: 5200, chat: 6800, meeting: 76, storage: 1.7, satisfaction: 3.8 }
];

export default function ServiceDetail() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('email');

  const getCurrentServiceData = () => {
    switch (selectedService) {
      case 'email': return mockEmailUsage;
      case 'chat': return mockChatUsage;
      case 'meeting': return mockMeetingUsage;
      default: return mockEmailUsage;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Service Usage Analysis - รายละเอียด</h1>
            <p className="text-muted-foreground">การวิเคราะห์การใช้งานบริการอย่างละเอียด</p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ส่งออกรายงาน Service Usage
        </Button>
      </div>

      {/* Service Selector */}
      <div className="flex gap-2">
        {[
          { key: 'email', label: 'อีเมล', icon: Mail },
          { key: 'chat', label: 'แชท', icon: MessageSquare },
          { key: 'meeting', label: 'ประชุม', icon: Video },
        ].map((service) => {
          const Icon = service.icon;
          return (
            <Button
              key={service.key}
              variant={selectedService === service.key ? 'default' : 'outline'}
              onClick={() => setSelectedService(service.key)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {service.label}
            </Button>
          );
        })}
      </div>

      {/* Service Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">อีเมลส่ง</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,230</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% จากสัปดาห์ที่แล้ว
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">ข้อความแชท</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,450</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +28.3% จากสัปดาห์ที่แล้ว
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">นาทีประชุม</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,340</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +45.2% จากสัปดาห์ที่แล้ว
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">ผู้ใช้งานรวม</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-xs text-blue-600">
              Active Users ทุกบริการ
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Usage Trend */}
      <Card>
        <CardHeader>
          <CardTitle>แนวโน้มการใช้งาน - {selectedService === 'email' ? 'อีเมล' : selectedService === 'chat' ? 'แชท' : 'ประชุม'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              primary: { label: "หลัก", color: "hsl(var(--chart-1))" },
              secondary: { label: "รอง", color: "hsl(var(--chart-2))" },
              users: { label: "ผู้ใช้", color: "hsl(var(--chart-3))" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getCurrentServiceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedService === 'email' && (
                  <>
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="received" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  </>
                )}
                {selectedService === 'chat' && (
                  <>
                    <Area type="monotone" dataKey="messages" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="channels" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  </>
                )}
                {selectedService === 'meeting' && (
                  <>
                    <Area type="monotone" dataKey="meetings" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="duration" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Service Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>เปรียบเทียบการใช้งานระหว่างบริการ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>บริการ</TableHead>
                <TableHead>ผู้ใช้งานออนไลน์</TableHead>
                <TableHead>การใช้งานรวม</TableHead>
                <TableHead>เวลาใช้งานเฉลี่ย</TableHead>
                <TableHead>อัตราเติบโต</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockServiceComparison.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {service.service === 'อีเมล' && <Mail className="h-4 w-4" />}
                      {service.service === 'แชท' && <MessageSquare className="h-4 w-4" />}
                      {service.service === 'ประชุมออนไลน์' && <Video className="h-4 w-4" />}
                      {service.service === 'จัดเก็บไฟล์' && <HardDrive className="h-4 w-4" />}
                      {service.service === 'ปฏิทิน' && <Calendar className="h-4 w-4" />}
                      <span className="font-medium">{service.service}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      {service.active_users.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{service.total_actions.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {service.avg_session} นาที
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">+{service.growth}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      service.growth > 30 ? 'default' : 
                      service.growth > 15 ? 'secondary' : 'outline'
                    }>
                      {service.growth > 30 ? 'เติบโตสูง' : 
                       service.growth > 15 ? 'เติบโตปานกลาง' : 'เติบโตช้า'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Department Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>การใช้งานแยกตามหน่วยงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>แชท</TableHead>
                <TableHead>ประชุม</TableHead>
                <TableHead>จัดเก็บข้อมูล (GB)</TableHead>
                <TableHead>ความพึงพอใจ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDepartmentUsage.map((dept, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      {dept.email.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      {dept.chat.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-purple-600" />
                      {dept.meeting}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-orange-600" />
                      {dept.storage} GB
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      dept.satisfaction >= 4.0 ? 'default' : 
                      dept.satisfaction >= 3.5 ? 'secondary' : 'destructive'
                    }>
                      {dept.satisfaction}/5.0
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Usage Insights */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลเชิงลึกและข้อเสนอแนะ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">การเติบโตที่โดดเด่น</h4>
                  <p className="text-sm text-green-700 mt-1">
                    บริการประชุมออนไลน์มีอัตราการเติบโต 45.2% สูงที่สุด แสดงให้เห็นการยอมรับ Work from Home
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">การใช้งานอีเมล</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    อีเมลยังคงเป็นบริการหลักที่มีผู้ใช้งานมากที่สุด 1,247 คน ด้วยอัตราการเติบโต 12.5%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">แชทที่ได้รับความนิยม</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    ข้อความแชทมีปริมาณการใช้งานสูงสุดด้วย 89,450 ข้อความ และเวลาใช้งานเฉลี่ย 85 นาทีต่อคน
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