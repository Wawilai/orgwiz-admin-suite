import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowLeft, UserX, Building, Calendar, Download, Search, AlertTriangle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data สำหรับ Inactive Accounts Detail
const mockInactiveStats = [
  { period: 'Inactive > 15 วัน', count: 234, percentage: 18.8 },
  { period: 'Inactive > 30 วัน', count: 156, percentage: 12.5 },
  { period: 'Inactive > 90 วัน', count: 89, percentage: 7.1 },
  { period: 'Never Login', count: 45, percentage: 3.6 }
];

const mockOrganizationRanking = [
  { org: 'กรมบัญชีกลาง', domain: 'cgd.go.th', total_users: 450, inactive_15: 78, inactive_30: 45, inactive_90: 23, inactive_rate: 17.3 },
  { org: 'กรมสรรพากร', domain: 'rd.go.th', total_users: 380, inactive_15: 65, inactive_30: 38, inactive_90: 19, inactive_rate: 17.1 },
  { org: 'กรมศุลกากร', domain: 'customs.go.th', total_users: 340, inactive_15: 52, inactive_30: 34, inactive_90: 18, inactive_rate: 15.3 },
  { org: 'กรมพัฒนาที่ดิน', domain: 'dld.go.th', total_users: 290, inactive_15: 48, inactive_30: 28, inactive_90: 15, inactive_rate: 16.6 },
  { org: 'กรมป่าไผ่', domain: 'dnp.go.th', total_users: 280, inactive_15: 58, inactive_30: 35, inactive_90: 20, inactive_rate: 20.7 },
  { org: 'กรมทางหลวง', domain: 'doh.go.th', total_users: 250, inactive_15: 45, inactive_30: 25, inactive_90: 12, inactive_rate: 18.0 }
];

const mockInactiveAccountsList = [
  { 
    username: 'john.doe@cgd.go.th',
    display_name: 'จอห์น โด',
    department: 'กรมบัญชีกลาง',
    last_login: '2024-02-15',
    days_inactive: 32,
    license_type: 'Standard',
    created_date: '2023-08-15'
  },
  { 
    username: 'mary.smith@rd.go.th',
    display_name: 'แมรี่ สมิธ',
    department: 'กรมสรรพากร',
    last_login: '2024-01-28',
    days_inactive: 50,
    license_type: 'Premium',
    created_date: '2023-06-20'
  },
  { 
    username: 'peter.wilson@customs.go.th',
    display_name: 'ปีเตอร์ วิลสัน',
    department: 'กรมศุลกากร',
    last_login: '2023-12-10',
    days_inactive: 98,
    license_type: 'Standard',
    created_date: '2023-04-12'
  },
  { 
    username: 'lisa.brown@dld.go.th',
    display_name: 'ลิซ่า บราวน์',
    department: 'กรมพัฒนาที่ดิน',
    last_login: '2024-02-08',
    days_inactive: 39,
    license_type: 'Basic',
    created_date: '2023-09-03'
  },
  { 
    username: 'david.jones@dnp.go.th',
    display_name: 'เดวิด โจนส์',
    department: 'กรมป่าไผ่',
    last_login: 'Never',
    days_inactive: 365,
    license_type: 'Standard',
    created_date: '2023-03-18'
  }
];

const COLORS = ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function InactiveAccountsDetail() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(mockInactiveAccountsList);

  const totalInactiveAccounts = mockInactiveStats.reduce((sum, stat) => sum + stat.count, 0);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockInactiveAccountsList.filter(
      account => 
        account.username.toLowerCase().includes(value.toLowerCase()) ||
        account.display_name.toLowerCase().includes(value.toLowerCase()) ||
        account.department.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAccounts(filtered);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Username', 'Display Name', 'Department', 'Last Login', 'Days Inactive', 'License Type', 'Created Date'],
      ...mockInactiveAccountsList.map(account => [
        account.username,
        account.display_name,
        account.department,
        account.last_login,
        account.days_inactive.toString(),
        account.license_type,
        account.created_date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inactive-accounts-report.csv';
    a.click();
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
            <h1 className="text-3xl font-bold">Inactive Accounts - รายละเอียด</h1>
            <p className="text-muted-foreground">การจัดการบัญชีที่ไม่ได้ใช้งาน</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            ส่งออก CSV
          </Button>
        </div>
      </div>

      {/* Inactive Accounts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-red-800">Inactive {'>'}  15 วัน</CardTitle>
            <UserX className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{mockInactiveStats[0].count}</div>
            <p className="text-xs text-red-600 mt-1">{mockInactiveStats[0].percentage}% ของทั้งหมด</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-orange-800">Inactive {'>'}  30 วัน</CardTitle>
            <Calendar className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{mockInactiveStats[1].count}</div>
            <p className="text-xs text-orange-600 mt-1">{mockInactiveStats[1].percentage}% ของทั้งหมด</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-yellow-800">Inactive {'>'}  90 วัน</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{mockInactiveStats[2].count}</div>
            <p className="text-xs text-yellow-600 mt-1">{mockInactiveStats[2].percentage}% ของทั้งหมด</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-800">รวมทั้งหมด</CardTitle>
            <Users className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{totalInactiveAccounts}</div>
            <p className="text-xs text-gray-600 mt-1">บัญชีที่ไม่ได้ใช้งาน</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inactive Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              การกระจายบัญชีที่ไม่ได้ใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "จำนวน", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockInactiveStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ period, percentage }) => `${period}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mockInactiveStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Organization Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              องค์กรที่มีบัญชี Inactive มากสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                inactive_rate: { label: "อัตรา Inactive", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockOrganizationRanking} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="org" type="category" width={100} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="inactive_rate" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Organization Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            รายละเอียดบัญชี Inactive แยกตามองค์กร
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>องค์กร</TableHead>
                <TableHead>ผู้ใช้ทั้งหมด</TableHead>
                <TableHead>Inactive {'>'}  15 วัน</TableHead>
                <TableHead>Inactive {'>'}  30 วัน</TableHead>
                <TableHead>Inactive {'>'}  90 วัน</TableHead>
                <TableHead>อัตรา Inactive</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrganizationRanking.map((org, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{org.org}</div>
                      <div className="text-xs text-muted-foreground">{org.domain}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      {org.total_users}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{org.inactive_15}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{org.inactive_30}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{org.inactive_90}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${org.inactive_rate > 18 ? 'text-red-600' : org.inactive_rate > 15 ? 'text-orange-600' : 'text-green-600'}`}>
                      {org.inactive_rate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      org.inactive_rate > 18 ? 'destructive' : 
                      org.inactive_rate > 15 ? 'secondary' : 'default'
                    }>
                      {org.inactive_rate > 18 ? 'ต้องทบทวน' : 
                       org.inactive_rate > 15 ? 'ต้องติดตาม' : 'ปกติ'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Account List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              รายชื่อบัญชีที่ไม่ได้ใช้งาน
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาผู้ใช้งาน..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้งาน</TableHead>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>เข้าใช้งานล่าสุด</TableHead>
                <TableHead>ไม่ได้ใช้งาน (วัน)</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead>วันที่สร้างบัญชี</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{account.display_name}</div>
                      <div className="text-xs text-muted-foreground">{account.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {account.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {account.last_login}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      account.days_inactive > 90 ? 'destructive' : 
                      account.days_inactive > 30 ? 'secondary' : 'outline'
                    }>
                      {account.days_inactive === 365 ? 'Never' : `${account.days_inactive} วัน`}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.license_type}</TableCell>
                  <TableCell>{account.created_date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      account.days_inactive > 90 ? 'destructive' : 
                      account.days_inactive > 30 ? 'secondary' : 'outline'
                    }>
                      {account.days_inactive > 90 ? 'ควรระงับ' : 
                       account.days_inactive > 30 ? 'ควรติดตาม' : 'ปกติ'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อเสนะแนะการดำเนินการ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">บัญชีที่ควรระงับ</h4>
                  <p className="text-sm text-red-700 mt-1">
                    มีบัญชีที่ไม่ได้ใช้งานเกิน 90 วัน จำนวน {mockInactiveStats[2].count} บัญชี ควรพิจารณาระงับเพื่อประหยัด License
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">องค์กรที่ต้องติดตาม</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    กรมป่าไผ่มีอัตรา Inactive สูงสุด 20.7% ควรติดต่อเพื่อสอบถามสาเหตุและให้การสนับสนุน
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">การดำเนินการแนะนำ</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    1. ส่งอีเมลเตือนผู้ใช้งานที่ไม่ได้เข้าใช้งานเกิน 15 วัน<br />
                    2. จัดอบรมการใช้งานระบบให้กับหน่วยงานที่มีอัตรา Inactive สูง<br />
                    3. ทบทวน License ที่ไม่จำเป็นเพื่อลดต้นทุน
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