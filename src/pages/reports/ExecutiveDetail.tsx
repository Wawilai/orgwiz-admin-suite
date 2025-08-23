import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowLeft, Users, Activity, Shield, TrendingUp, Calendar, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
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
  Cell
} from 'recharts';

export default function ExecutiveDetail() {
  console.log('ExecutiveDetail component loaded');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartmentData();
    }
  }, [isAuthenticated]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      
      // Get organization ID
      const { data: orgId, error: orgError } = await supabase.rpc('get_current_user_organization_id');
      
      if (orgError) {
        console.error('Error getting organization ID:', orgError);
        return;
      }
      
      if (!orgId) {
        console.log('No organization ID found for user');
        return;
      }

      // Get organization unit statistics
      const { data: unitStats, error: unitError } = await supabase.rpc('get_organization_unit_stats', {
        org_id: orgId
      });

      if (unitError) {
        console.error('Error getting unit stats:', unitError);
      } else {
        const formattedData = Array.isArray(unitStats) ? unitStats.map((unit: any) => ({
          department: unit.unit_name,
          users: unit.total_users,
          license_usage: Math.round(unit.license_usage || 0),
          active_rate: Math.round(unit.active_rate || 0)
        })) : [];
        setDepartmentData(formattedData);
      }
      
    } catch (error) {
      console.error('Error fetching department data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (keeping existing chart data for now)
  const mockDAUTrend = [
    { date: '01/01', dau: 1180, growth: 5.2 },
    { date: '02/01', dau: 1205, growth: 2.1 },
    { date: '03/01', dau: 1189, growth: -1.3 },
    { date: '04/01', dau: 1234, growth: 3.8 },
    { date: '05/01', dau: 1247, growth: 1.1 },
    { date: '06/01', dau: 1289, growth: 3.4 },
    { date: '07/01', dau: 1312, growth: 1.8 }
  ];

  const mockServiceGrowth = [
    { service: 'อีเมล', jan: 1200, feb: 1350, mar: 1450, growth: 20.8 },
    { service: 'แชท', jan: 800, feb: 950, mar: 1200, growth: 50.0 },
    { service: 'ประชุม', jan: 400, feb: 520, mar: 680, growth: 70.0 }
  ];
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Executive Overview - รายละเอียด</h1>
            <p className="text-muted-foreground">ข้อมูลเชิงลึกสำหรับผู้บริหาร</p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ส่งออกรายงาน Executive
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% จาก 90 วันที่ผ่านมา
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">License Utilization</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs text-orange-600">
              3,380/4,500 ใบอนุญาต
            </div>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Service Adoption</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="text-xs text-blue-600">
              ผู้ใช้งานอย่างน้อย 1 บริการ
            </div>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.2%</div>
            <div className="text-xs text-green-600">
              อัปไทม์เฉลี่ยทุกระบบ
            </div>
            <Progress value={99.2} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* DAU Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>แนวโน้ม Daily Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              dau: { label: "DAU", color: "hsl(var(--chart-1))" },
              growth: { label: "Growth %", color: "hsl(var(--chart-2))" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={mockDAUTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="dau"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Service Growth Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>การเติบโตของบริการแยกตามเดือน</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              jan: { label: "มกราคม", color: "hsl(var(--chart-1))" },
              feb: { label: "กุมภาพันธ์", color: "hsl(var(--chart-2))" },
              mar: { label: "มีนาคม", color: "hsl(var(--chart-3))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={mockServiceGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jan" fill="hsl(var(--chart-1))" />
                <Bar dataKey="feb" fill="hsl(var(--chart-2))" />
                <Bar dataKey="mar" fill="hsl(var(--chart-3))" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>ประสิทธิภาพการใช้งานแยกตามหน่วยงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>จำนวนผู้ใช้</TableHead>
                <TableHead>การใช้ License</TableHead>
                <TableHead>อัตราผู้ใช้งานจริง</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentData.length > 0 ? departmentData.map((dept, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {dept.users} คน
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={dept.license_usage} className="w-16" />
                      <span className="text-sm">{dept.license_usage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={dept.active_rate} className="w-16" />
                      <span className="text-sm">{dept.active_rate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      dept.active_rate >= 90 ? 'default' : 
                      dept.active_rate >= 80 ? 'secondary' : 'destructive'
                    }>
                      {dept.active_rate >= 90 ? 'ดีมาก' : 
                       dept.active_rate >= 80 ? 'ปานกลาง' : 'ต้องปรับปรุง'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    ไม่มีข้อมูลหน่วยงาน
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อเสนอแนะสำหรับผู้บริหาร</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">การเติบโตที่ดี</h4>
                  <p className="text-sm text-green-700 mt-1">
                    จำนวน Daily Active Users เพิ่มขึ้น 12.5% ในช่วง 90 วันที่ผ่านมา แสดงให้เห็นถึงการยอมรับระบบที่ดี
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">การใช้งาน License</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    อัตราการใช้งาน License อยู่ที่ 78% แนะนำให้วางแผนการจัดซื้อเพิ่มเติมสำหรับการขยายตัวในอนาคต
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">การใช้งานบริการ</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    บริการประชุมออนไลน์มีอัตราการเติบโตสูงสุด 70% แสดงให้เห็นถึงความต้องการ Work from Home
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