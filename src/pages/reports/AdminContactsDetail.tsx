import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building, Users, Phone, Mail, MessageSquare, Download, Search, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data สำหรับ Admin Contacts Detail
const mockAdminContacts = [
  {
    org_name: 'กรมบัญชีกลาง',
    domain: 'cgd.go.th',
    primary_admin: {
      name: 'นายสมชาย ใจดี',
      email: 'somchai.jaidee@cgd.go.th',
      phone: '02-123-4567',
      mobile: '081-234-5678',
      position: 'ผู้อำนวยการกอง IT'
    },
    secondary_admin: {
      name: 'นางสาวมาลี รักงาน',
      email: 'malee.rakngarn@cgd.go.th',
      phone: '02-123-4568',
      mobile: '081-234-5679',
      position: 'หัวหน้าแผนก Network'
    },
    total_users: 450,
    active_users: 423,
    coverage: '100%',
    last_contact: '2024-03-15'
  },
  {
    org_name: 'กรมสรรพากร',
    domain: 'rd.go.th',
    primary_admin: {
      name: 'นายวิทยา เก่งมาก',
      email: 'witthaya.kengmak@rd.go.th',
      phone: '02-234-5678',
      mobile: '082-345-6789',
      position: 'ผู้อำนวยการสำนัก IT'
    },
    secondary_admin: {
      name: 'นางประไพ ขยันดี',
      email: 'prapai.khayanee@rd.go.th',
      phone: '02-234-5679',
      mobile: '082-345-6790',
      position: 'รองหัวหน้าแผนกระบบ'
    },
    total_users: 380,
    active_users: 361,
    coverage: '100%',
    last_contact: '2024-03-12'
  },
  {
    org_name: 'กรมศุลกากร',
    domain: 'customs.go.th',
    primary_admin: {
      name: 'นายประยุทธ ทำดี',
      email: 'prayut.thamdee@customs.go.th',
      phone: '02-345-6789',
      mobile: '083-456-7890',
      position: 'หัวหน้ากลุ่มเทคโนโลยี'
    },
    secondary_admin: null,
    total_users: 340,
    active_users: 322,
    coverage: '50%',
    last_contact: '2024-03-08'
  },
  {
    org_name: 'กรมพัฒนาที่ดิน',
    domain: 'dld.go.th',
    primary_admin: {
      name: 'นางสุดา รับผิดชอบ',
      email: 'suda.rabphitchob@dld.go.th',
      phone: '02-456-7890',
      mobile: '084-567-8901',
      position: 'หัวหน้าส่วนเทคโนโลยี'
    },
    secondary_admin: {
      name: 'นายอภิชาติ ช่วยงาน',
      email: 'apichat.chuayngarn@dld.go.th',
      phone: '02-456-7891',
      mobile: '084-567-8902',
      position: 'นักวิชาการคอมพิวเตอร์'
    },
    total_users: 290,
    active_users: 275,
    coverage: '100%',
    last_contact: '2024-03-14'
  },
  {
    org_name: 'กรมป่าไผ่',
    domain: 'dnp.go.th',
    primary_admin: {
      name: 'นายธีรพงษ์ รักษาป่า',
      email: 'teeraphong.raksapa@dnp.go.th',
      phone: '02-567-8901',
      mobile: '085-678-9012',
      position: 'ผู้อำนวยการกอง IT'
    },
    secondary_admin: null,
    total_users: 280,
    active_users: 256,
    coverage: '50%',
    last_contact: '2024-02-28'
  }
];

const mockContactStatistics = {
  total_orgs: mockAdminContacts.length,
  total_admins: mockAdminContacts.reduce((sum, org) => sum + (org.secondary_admin ? 2 : 1), 0),
  avg_admins_per_org: mockAdminContacts.reduce((sum, org) => sum + (org.secondary_admin ? 2 : 1), 0) / mockAdminContacts.length,
  full_coverage: mockAdminContacts.filter(org => org.coverage === '100%').length,
  coverage_percentage: (mockAdminContacts.filter(org => org.coverage === '100%').length / mockAdminContacts.length) * 100
};

export default function AdminContactsDetail() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(mockAdminContacts);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockAdminContacts.filter(
      contact => 
        contact.org_name.toLowerCase().includes(value.toLowerCase()) ||
        contact.domain.toLowerCase().includes(value.toLowerCase()) ||
        contact.primary_admin.name.toLowerCase().includes(value.toLowerCase()) ||
        (contact.secondary_admin?.name && contact.secondary_admin.name.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredContacts(filtered);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Organization', 'Domain', 'Primary Admin Name', 'Primary Admin Email', 'Primary Admin Phone', 'Secondary Admin Name', 'Secondary Admin Email', 'Total Users', 'Coverage', 'Last Contact'],
      ...mockAdminContacts.map(contact => [
        contact.org_name,
        contact.domain,
        contact.primary_admin.name,
        contact.primary_admin.email,
        contact.primary_admin.phone,
        contact.secondary_admin?.name || 'N/A',
        contact.secondary_admin?.email || 'N/A',
        contact.total_users.toString(),
        contact.coverage,
        contact.last_contact
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin-contacts-report.csv';
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
            <h1 className="text-3xl font-bold">Admin Contacts - รายละเอียด</h1>
            <p className="text-muted-foreground">ข้อมูลติดต่อผู้ดูแลระบบทุกองค์กร</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            ส่งออก CSV
          </Button>
        </div>
      </div>

      {/* Contact Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-800">องค์กรทั้งหมด</CardTitle>
            <Building className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{mockContactStatistics.total_orgs}</div>
            <p className="text-xs text-blue-600 mt-1">หน่วยงานในระบบ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-green-800">ผู้ดูแลทั้งหมด</CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{mockContactStatistics.total_admins}</div>
            <p className="text-xs text-green-600 mt-1">Admin ทั้งหมด</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-800">ค่าเฉลี่ย</CardTitle>
            <User className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{mockContactStatistics.avg_admins_per_org.toFixed(1)}</div>
            <p className="text-xs text-purple-600 mt-1">Admin ต่อองค์กร</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-orange-800">ความครอบคลุม</CardTitle>
            <CheckCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{mockContactStatistics.coverage_percentage.toFixed(0)}%</div>
            <p className="text-xs text-orange-600 mt-1">องค์กรที่มี Admin ครบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              ภาพรวมผู้ดูแลแต่ละองค์กร
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาองค์กรหรือผู้ดูแล..."
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
                <TableHead>องค์กร</TableHead>
                <TableHead>ผู้ดูแลหลัก</TableHead>
                <TableHead>ผู้ดูแลรอง</TableHead>
                <TableHead>ผู้ใช้งาน</TableHead>
                <TableHead>ความครอบคลุม</TableHead>
                <TableHead>ติดต่อล่าสุด</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{contact.org_name}</div>
                      <div className="text-xs text-muted-foreground">{contact.domain}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{contact.primary_admin.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.primary_admin.position}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-blue-600" />
                        <span className="text-xs">{contact.primary_admin.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-green-600" />
                        <span className="text-xs">{contact.primary_admin.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.secondary_admin ? (
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{contact.secondary_admin.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.secondary_admin.position}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3 text-blue-600" />
                          <span className="text-xs">{contact.secondary_admin.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{contact.secondary_admin.phone}</span>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="secondary">ไม่มี</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{contact.total_users}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active: {contact.active_users}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      contact.coverage === '100%' ? 'default' : 'destructive'
                    }>
                      {contact.coverage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{contact.last_contact}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContacts.map((contact, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {contact.org_name}
                </div>
                <Badge variant={contact.coverage === '100%' ? 'default' : 'destructive'}>
                  {contact.coverage} Coverage
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Admin */}
              <div className="p-3 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-primary mb-2">ผู้ดูแลหลัก</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{contact.primary_admin.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{contact.primary_admin.position}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a href={`mailto:${contact.primary_admin.email}`} className="text-blue-600 hover:underline">
                      {contact.primary_admin.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <a href={`tel:${contact.primary_admin.phone}`} className="text-green-600 hover:underline">
                      {contact.primary_admin.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <a href={`tel:${contact.primary_admin.mobile}`} className="text-purple-600 hover:underline">
                      {contact.primary_admin.mobile}
                    </a>
                  </div>
                </div>
              </div>

              {/* Secondary Admin */}
              {contact.secondary_admin && (
                <div className="p-3 bg-secondary/5 rounded-lg">
                  <h4 className="font-medium text-secondary-foreground mb-2">ผู้ดูแลรอง</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{contact.secondary_admin.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{contact.secondary_admin.position}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <a href={`mailto:${contact.secondary_admin.email}`} className="text-blue-600 hover:underline">
                        {contact.secondary_admin.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-600" />
                      <a href={`tel:${contact.secondary_admin.phone}`} className="text-green-600 hover:underline">
                        {contact.secondary_admin.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>ผู้ใช้งาน: {contact.active_users}/{contact.total_users}</span>
                </div>
                <div className="text-muted-foreground">
                  ติดต่อล่าสุด: {contact.last_contact}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Options & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อเสนอแนะและการจัดการ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">องค์กรที่ขาด Admin รอง</h4>
                  <p className="text-sm text-red-700 mt-1">
                    {mockAdminContacts.filter(org => !org.secondary_admin).map(org => org.org_name).join(', ')} 
                    ควรจัดหาผู้ดูแลรองเพื่อสำรองในกรณีฉุกเฉิน
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">ความครอบคลุมดี</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {mockContactStatistics.coverage_percentage.toFixed(0)}% ของorganizationมีผู้ดูแลครบถ้วน 
                    แสดงให้เห็นการเตรียมความพร้อมที่ดี
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">การติดต่อสื่อสาร</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    ข้อมูลติดต่อครบถ้วน มีทั้งอีเมล โทรศัพท์ และมือถือ เพื่อการติดต่อในกรณีต่างๆ
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