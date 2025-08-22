import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [orgStats, setOrgStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganizationStats();
    }
  }, [isAuthenticated]);

  const fetchOrganizationStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_organization_stats', {
        org_id: await getCurrentUserOrgId()
      });
      
      if (error) throw error;
      setOrgStats(data);
    } catch (error) {
      console.error('Error fetching organization stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserOrgId = async () => {
    const { data } = await supabase.rpc('get_current_user_organization_id');
    return data;
  };

  const stats = [
    {
      title: "ผู้ใช้งานทั้งหมด",
      value: orgStats?.total_users || "0",
      subtitle: "ในองค์กร",
      change: "+12.5%",
      changeText: "เดือนที่ผ่านมา", 
      trend: "up",
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      title: "โดเมนทั้งหมด",
      value: orgStats?.total_domains || "0",
      subtitle: "ในองค์กร", 
      change: "+5%",
      changeText: "เดือนที่ผ่านมา",
      trend: "up",
      icon: Building2,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white"
    },
    {
      title: "ใบอนุญาตใช้งาน",
      value: orgStats?.active_licenses || "0",
      subtitle: "ใช้งานอยู่",
      change: "+10%", 
      changeText: "เดือนที่ผ่านมา",
      trend: "up",
      icon: CheckCircle,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white"
    },
    {
      title: "ผู้ใช้ที่ใช้งาน",
      value: orgStats?.active_users || "0",
      subtitle: "ใช้งานปัจจุบัน",
      change: "+8.2%",
      changeText: "เดือนที่ผ่านมา",
      trend: "up", 
      icon: TrendingUp,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-white"
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
          <h1 className="text-3xl font-bold text-foreground">รายงานและการวิเคราะห์</h1>
          <p className="text-muted-foreground mt-1">
            ติดตามประสิทธิภาพการใช้งานระบบ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 วัน</SelectItem>
              <SelectItem value="30">30 วัน</SelectItem>
              <SelectItem value="90">90 วัน</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="gradient">
            <Download className="w-4 h-4 mr-2" />
            ส่งออกรายงาน
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="executive" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="executive">Executive Overview</TabsTrigger>
            <TabsTrigger value="license">License & Quota</TabsTrigger>
            <TabsTrigger value="service">Service Usage</TabsTrigger>
            <TabsTrigger value="mail">Mail Relay</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Accounts</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="executive" className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={stat.title} className={`${stat.bgColor} ${stat.textColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${stat.textColor} opacity-90`}>
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-6 w-6 ${stat.textColor} opacity-80`} />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${stat.textColor} opacity-75`}>
                    {stat.subtitle}
                  </div>
                  <div className={`text-sm ${stat.textColor} opacity-90 flex items-center gap-1`}>
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-medium">{stat.change}</span>
                    <span className="opacity-75">{stat.changeText}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="license" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License & Quota Usage</CardTitle>
              <CardDescription>การใช้งานใบอนุญาตและโควต้า</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                ข้อมูลการใช้งานใบอนุญาตและโควต้า
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Usage</CardTitle>
              <CardDescription>การใช้งานบริการต่างๆ ในระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                ข้อมูลการใช้งานบริการ
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mail" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mail Relay Statistics</CardTitle>
              <CardDescription>สถิติการส่งอีเมลผ่านระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                ข้อมูลการส่งอีเมล
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Accounts</CardTitle>
              <CardDescription>บัญชีผู้ใช้ที่ไม่ได้ใช้งาน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                ข้อมูลบัญชีที่ไม่ได้ใช้งาน
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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