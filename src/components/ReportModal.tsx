import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer } from '@/components/ui/chart';
import { 
  Eye, 
  Download, 
  ExternalLink,
  Users,
  Mail,
  MessageSquare,
  Video,
  Shield,
  UserX,
  Building,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  title: string;
}

// Quick preview data
const previewData = {
  executive: {
    kpis: [
      { label: 'DAU', value: '1,247', change: '+12.5%', icon: Users },
      { label: 'Services', value: '3', change: '0%', icon: Activity },
      { label: 'License', value: '78%', change: '+2.5%', icon: Shield },
      { label: 'Growth', value: '+15.2%', change: '+15.2%', icon: TrendingUp }
    ],
    chart: [
      { name: 'อีเมล', value: 45 },
      { name: 'แชท', value: 30 },
      { name: 'ประชุม', value: 25 }
    ]
  },
  license: {
    overview: { total: 4500, used: 3380, available: 1120, utilization: 75.1 },
    topOrgs: [
      { name: 'กรมบัญชีกลาง', usage: 90 },
      { name: 'กรมสรรพากร', usage: 95 },
      { name: 'กรมศุลกากร', usage: 97 }
    ]
  },
  services: {
    metrics: [
      { service: 'อีเมล', users: 1247, actions: 45230 },
      { service: 'แชท', users: 1028, actions: 89450 },
      { service: 'ประชุม', users: 456, actions: 12340 }
    ]
  },
  'mail-relay': {
    stats: { accepted: 16230, rejected: 201, successRate: 98.8 },
    systems: 3
  },
  inactive: {
    counts: { days15: 28, days30: 15, days90: 8, total: 51 },
    recommendations: 2
  },
  contacts: {
    overview: { orgs: 45, admins: 52, coverage: 100, avgPerOrg: 1.16 }
  }
};

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function ReportModal({ isOpen, onClose, reportType, title }: ReportModalProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    onClose();
    navigate(`/reports/${reportType}-detail`);
  };

  const renderExecutivePreview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {previewData.executive.kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <div className="text-xs text-muted-foreground">{kpi.label}</div>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-xs text-green-600 mt-2">{kpi.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardContent className="p-4">
          <ChartContainer
            config={{
              value: { label: "Usage", color: "hsl(var(--chart-1))" },
            }}
            className="h-48"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={previewData.executive.chart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                >
                  {previewData.executive.chart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderLicensePreview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{previewData.license.overview.total.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">โควตารวม</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{previewData.license.overview.utilization}%</div>
            <div className="text-xs text-muted-foreground">อัตราการใช้งาน</div>
            <Progress value={previewData.license.overview.utilization} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">องค์กรที่ใช้งานสูงสุด</h4>
        {previewData.license.topOrgs.map((org, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">{org.name}</span>
            <Badge variant={org.usage >= 95 ? 'destructive' : 'secondary'}>
              {org.usage}%
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServicesPreview = () => (
    <div className="space-y-4">
      {previewData.services.metrics.map((service, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded">
          <div className="flex items-center gap-2">
            {service.service === 'อีเมล' && <Mail className="h-4 w-4" />}
            {service.service === 'แชท' && <MessageSquare className="h-4 w-4" />}
            {service.service === 'ประชุม' && <Video className="h-4 w-4" />}
            <span className="font-medium">{service.service}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{service.users.toLocaleString()} ผู้ใช้</div>
            <div className="text-xs text-muted-foreground">{service.actions.toLocaleString()} การใช้งาน</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMailRelayPreview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{previewData['mail-relay'].stats.accepted.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{previewData['mail-relay'].stats.successRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
            <Progress value={previewData['mail-relay'].stats.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      <div className="p-3 border rounded bg-green-50">
        <div className="text-sm font-medium">ระบบ Mail Relay</div>
        <div className="text-xs text-muted-foreground">{previewData['mail-relay'].systems} ระบบทำงานปกติ</div>
      </div>
    </div>
  );

  const renderInactivePreview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: '> 30 วัน', value: previewData.inactive.counts.days30, color: 'text-orange-600' },
          { label: '> 90 วัน', value: previewData.inactive.counts.days90, color: 'text-red-600' }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground">Inactive {item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="p-3 border rounded bg-yellow-50">
        <div className="text-sm font-medium">คำแนะนำ</div>
        <div className="text-xs text-muted-foreground">{previewData.inactive.recommendations} ข้อเสนอแนะที่ต้องดำเนินการ</div>
      </div>
    </div>
  );

  const renderContactsPreview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{previewData.contacts.overview.orgs}</div>
            <div className="text-xs text-muted-foreground">องค์กร</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{previewData.contacts.overview.coverage}%</div>
            <div className="text-xs text-muted-foreground">ความครอบคลุม</div>
          </CardContent>
        </Card>
      </div>
      <div className="p-3 border rounded bg-blue-50">
        <div className="text-sm font-medium">ผู้ดูแลระบบ</div>
        <div className="text-xs text-muted-foreground">{previewData.contacts.overview.admins} คน (เฉลี่ย {previewData.contacts.overview.avgPerOrg} คน/องค์กร)</div>
      </div>
    </div>
  );

  const renderPreviewContent = () => {
    switch (reportType) {
      case 'executive': return renderExecutivePreview();
      case 'license': return renderLicensePreview();
      case 'services': return renderServicesPreview();
      case 'mail-relay': return renderMailRelayPreview();
      case 'inactive': return renderInactivePreview();
      case 'contacts': return renderContactsPreview();
      default: return <div>ไม่พบข้อมูลตัวอย่าง</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {title} - ตัวอย่าง
          </DialogTitle>
          <DialogDescription>
            ดูตัวอย่างรายงานและส่งออกข้อมูล
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderPreviewContent()}

          <div className="flex justify-between gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              ปิด
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                ส่งออก
              </Button>
              <Button onClick={handleViewDetails}>
                <ExternalLink className="h-4 w-4 mr-2" />
                ดูรายละเอียดเต็ม
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}