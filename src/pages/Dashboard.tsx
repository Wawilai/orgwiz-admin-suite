import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Mail,
  HardDrive,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "องค์กรทั้งหมด",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: Building2,
      color: "text-primary"
    },
    {
      title: "ผู้ใช้งานทั้งหมด",
      value: "2,847",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "อีเมลที่ส่งวันนี้",
      value: "15,842",
      change: "-2.1%",
      trend: "down",
      icon: Mail,
      color: "text-warning"
    },
    {
      title: "พื้นที่จัดเก็บใช้งาน",
      value: "847 GB",
      change: "+18.3%",
      trend: "up",
      icon: HardDrive,
      color: "text-success"
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_created",
      message: "ผู้ใช้ใหม่ john.doe@company.com ถูกสร้างขึ้น",
      time: "5 นาทีที่แล้ว",
      status: "success"
    },
    {
      id: 2,
      type: "quota_warning", 
      message: "องค์กร ABC Corp ใกล้เต็มโควต้าอีเมล (95%)",
      time: "15 นาทีที่แล้ว",
      status: "warning"
    },
    {
      id: 3,
      type: "system_update",
      message: "ระบบอัปเดตเสร็จสิ้น - เวอร์ชัน 2.1.4",
      time: "1 ชั่วโมงที่แล้ว",
      status: "info"
    },
    {
      id: 4,
      type: "backup_completed",
      message: "การสำรองข้อมูลรายวันเสร็จสิ้น",
      time: "2 ชั่วโมงที่แล้ว",
      status: "success"
    },
  ];

  const systemStatus = [
    { service: "Mail Service", status: "online", uptime: "99.9%" },
    { service: "Chat Service", status: "online", uptime: "99.8%" },
    { service: "Storage Service", status: "maintenance", uptime: "98.5%" },
    { service: "Meeting Service", status: "online", uptime: "99.7%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-success";
      case "maintenance": return "text-warning";
      case "offline": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "info": return <Activity className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">แดชบอร์ด</h1>
          <p className="text-muted-foreground mt-1">
            ภาพรวมของระบบจัดการองค์กร
          </p>
        </div>
        <Button variant="gradient">
          <TrendingUp className="w-4 h-4 mr-2" />
          ดูรายงานแบบเต็ม
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>{' '}
                จากเดือนที่แล้ว
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">กิจกรรมล่าสุด</CardTitle>
            <CardDescription>
              เหตุการณ์และกิจกรรมที่เกิดขึ้นในระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              ดูกิจกรรมทั้งหมด
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">สถานะระบบ</CardTitle>
            <CardDescription>
              สถานะการทำงานของบริการต่างๆ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{service.service}</p>
                    <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                  </div>
                  <Badge 
                    variant={service.status === 'online' ? 'default' : 'secondary'}
                    className={getStatusColor(service.status)}
                  >
                    {service.status === 'online' ? 'ออนไลน์' : 
                     service.status === 'maintenance' ? 'บำรุงรักษา' : 'ออฟไลน์'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              ดูสถานะระบบแบบเต็ม
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">การดำเนินการด่วน</CardTitle>
          <CardDescription>
            ฟังก์ชันที่ใช้บ่อยสำหรับการจัดการระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">เพิ่มผู้ใช้</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Building2 className="w-5 h-5" />
              <span className="text-sm">สร้างองค์กร</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Mail className="w-5 h-5" />
              <span className="text-sm">ตั้งค่าอีเมล</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">ดูรายงาน</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;