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
  console.log('🚀 Dashboard component initializing...');
  const { isAuthenticated } = useAuth();
  console.log('🔐 Authentication status:', isAuthenticated);
  const [orgStats, setOrgStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any[]>([]);
  const [growthStats, setGrowthStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
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
        setOrgStats({
          total_users: 0,
          active_users: 0,
          total_domains: 0,
          active_domains: 0,
          total_licenses: 0,
          active_licenses: 0
        });
        setRecentActivities([]);
        setSystemStatus([]);
        return;
      }
      
      // Fetch all dashboard data in parallel
      const [statsResult, activitiesResult, growthResult, servicesResult] = await Promise.all([
        supabase.rpc('get_organization_stats', { org_id: orgId }),
        supabase
          .from('activity_logs')
          .select('*')
          .eq('organization_id', orgId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.rpc('get_organization_growth_stats', { org_id: orgId }),
        supabase
          .from('system_services')
          .select('*')
          .order('service_name')
      ]);
      
      // Set organization stats
      if (statsResult.error) {
        console.error('Error getting organization stats:', statsResult.error);
      } else {
        setOrgStats(statsResult.data || {
          total_users: 0,
          active_users: 0,
          total_domains: 0,
          active_domains: 0,
          total_licenses: 0,
          active_licenses: 0
        });
      }
      
      // Set recent activities
      if (activitiesResult.error) {
        console.error('Error getting activities:', activitiesResult.error);
        setRecentActivities([]);
      } else {
        const formattedActivities = (activitiesResult.data || []).map((activity: any) => ({
          id: activity.id,
          type: activity.action,
          message: getActivityMessage(activity),
          time: formatTimeAgo(activity.created_at),
          status: getActivityStatus(activity.action)
        }));
        setRecentActivities(formattedActivities);
      }
      
      // Set growth statistics
      if (growthResult.error) {
        console.error('Error getting growth stats:', growthResult.error);
        setGrowthStats({
          users_growth: 0,
          active_users_growth: 0,
          domains_growth: 0,
          licenses_growth: 0
        });
      } else {
        setGrowthStats(growthResult.data || {
          users_growth: 0,
          active_users_growth: 0,
          domains_growth: 0,
          licenses_growth: 0
        });
      }
      
      // Set system status
      if (servicesResult.error) {
        console.error('Error getting services:', servicesResult.error);
        setSystemStatus([]);
      } else {
        const formattedServices = (servicesResult.data || []).map((service: any) => ({
          service: service.service_name,
          status: service.status,
          uptime: `${service.uptime_percentage}%`
        }));
        setSystemStatus(formattedServices);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setOrgStats({
        total_users: 0,
        active_users: 0,
        total_domains: 0,
        active_domains: 0,
        total_licenses: 0,
        active_licenses: 0
      });
      setRecentActivities([]);
      setGrowthStats({
        users_growth: 0,
        active_users_growth: 0,
        domains_growth: 0,
        licenses_growth: 0
      });
      setSystemStatus([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.action) {
      case 'user_created':
        return `ผู้ใช้ใหม่ ${activity.new_values?.email || 'ไม่ระบุ'} ถูกสร้างขึ้น`;
      case 'organization_created':
        return `องค์กร ${activity.new_values?.name || 'ไม่ระบุ'} ถูกสร้างขึ้น`;
      case 'domain_added':
        return `โดเมน ${activity.new_values?.name || 'ไม่ระบุ'} ถูกเพิ่ม`;
      case 'license_assigned':
        return `ใบอนุญาตถูกกำหนดให้ผู้ใช้`;
      default:
        return `${activity.action} - ${activity.entity_type}`;
    }
  };

  const getActivityStatus = (action: string) => {
    if (action.includes('created') || action.includes('assigned') || action.includes('completed')) {
      return 'success';
    }
    if (action.includes('warning') || action.includes('quota')) {
      return 'warning';
    }
    return 'info';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'เมื่อสักครู่';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} วันที่แล้ว`;
  };

  const formatGrowthPercentage = (growth: number) => {
    if (growth === 0) return "0%";
    const sign = growth > 0 ? "+" : "";
    return `${sign}${growth}%`;
  };

  const stats = [
    {
      title: "ผู้ใช้งานทั้งหมด",
      value: orgStats?.total_users || "0",
      subtitle: "ในองค์กร",
      change: formatGrowthPercentage(growthStats?.users_growth || 0),
      changeText: "เดือนที่ผ่านมา", 
      trend: (growthStats?.users_growth || 0) >= 0 ? "up" : "down",
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      title: "โดเมนทั้งหมด",
      value: orgStats?.total_domains || "0",
      subtitle: "ในองค์กร", 
      change: formatGrowthPercentage(growthStats?.domains_growth || 0),
      changeText: "เดือนที่ผ่านมา",
      trend: (growthStats?.domains_growth || 0) >= 0 ? "up" : "down",
      icon: Building2,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white"
    },
    {
      title: "ใบอนุญาตใช้งาน",
      value: orgStats?.active_licenses || "0",
      subtitle: "ใช้งานอยู่",
      change: formatGrowthPercentage(growthStats?.licenses_growth || 0), 
      changeText: "เดือนที่ผ่านมา",
      trend: (growthStats?.licenses_growth || 0) >= 0 ? "up" : "down",
      icon: CheckCircle,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white"
    },
    {
      title: "ผู้ใช้ที่ใช้งาน",
      value: orgStats?.active_users || "0",
      subtitle: "ใช้งานปัจจุบัน",
      change: formatGrowthPercentage(growthStats?.active_users_growth || 0),
      changeText: "เดือนที่ผ่านมา",
      trend: (growthStats?.active_users_growth || 0) >= 0 ? "up" : "down", 
      icon: TrendingUp,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-white"
    },
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

  if (loading) {
    console.log('🔄 Dashboard is loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  console.log('✅ Dashboard rendering with data:', { orgStats, recentActivities, systemStatus, growthStats });

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
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3 rotate-180" />
                    )}
                    <span className="font-medium">{stat.change}</span>
                    <span className="opacity-75">{stat.changeText}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="license" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* License Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">การใช้งานใบอนุญาต</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {orgStats?.active_licenses || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  จาก {orgStats?.total_licenses || 0} ใบอนุญาตทั้งหมด
                </p>
              </CardContent>
            </Card>

            {/* Storage Quota */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">โควต้าพื้นที่จัดเก็บ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {orgStats?.storage_usage?.mailbox || 0} MB
                </div>
                <p className="text-xs text-muted-foreground">
                  พื้นที่อีเมลที่ใช้งาน
                </p>
              </CardContent>
            </Card>

            {/* User Quota */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">โควต้าผู้ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {orgStats?.active_users || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  ผู้ใช้งานที่ใช้งานอยู่
                </p>
              </CardContent>
            </Card>
          </div>

          {/* License Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดใบอนุญาต</CardTitle>
              <CardDescription>ใบอนุญาตที่ใช้งานในองค์กร</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {orgStats?.total_licenses > 0 ? 
                  `มีใบอนุญาต ${orgStats.total_licenses} ชิ้น (ใช้งาน ${orgStats.active_licenses} ชิ้น)` :
                  'ไม่มีข้อมูลใบอนุญาต'
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {systemStatus.map((service, index) => (
              <Card key={service.service}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{service.service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-lg font-bold ${
                        service.status === 'online' ? 'text-success' : 
                        service.status === 'maintenance' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {service.status === 'online' ? 'ออนไลน์' : 
                         service.status === 'maintenance' ? 'บำรุงรักษา' : 'ออฟไลน์'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        อัปไทม์: {service.uptime}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'online' ? 'bg-success' : 
                      service.status === 'maintenance' ? 'bg-warning' : 'bg-destructive'
                    }`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>การใช้งานบริการ</CardTitle>
              <CardDescription>สถิติการใช้งานบริการต่างๆ ในระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                ข้อมูลการใช้งานบริการจะแสดงเมื่อมีการใช้งาน
                <br />
                ปัจจุบันมี {systemStatus.length} บริการในระบบ
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mail" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {/* Total Domains */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">โดเมนทั้งหมด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {orgStats?.total_domains || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  โดเมนในองค์กร
                </p>
              </CardContent>
            </Card>

            {/* Active Domains */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">โดเมนที่ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {orgStats?.active_domains || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  โดเมนที่ทำงาน
                </p>
              </CardContent>
            </Card>

            {/* Mail Service Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">สถานะ Mail Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  systemStatus.find(s => s.service === 'Mail Service')?.status === 'online' ? 'text-success' : 'text-warning'
                }`}>
                  {systemStatus.find(s => s.service === 'Mail Service')?.status === 'online' ? 'ออนไลน์' : 'บำรุงรักษา'}
                </div>
                <p className="text-xs text-muted-foreground">
                  อัปไทม์: {systemStatus.find(s => s.service === 'Mail Service')?.uptime || 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mail Relay Details */}
          <Card>
            <CardHeader>
              <CardTitle>สถิติการส่งอีเมล</CardTitle>
              <CardDescription>ข้อมูลการส่งและรับอีเมลผ่านระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                ข้อมูลการส่งอีเมลจะแสดงเมื่อมีการใช้งาน Mail Relay
                <br />
                ปัจจุบันมี {orgStats?.active_domains || 0} โดเมนที่ใช้งาน
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {/* Total Users */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ผู้ใช้งานทั้งหมด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {orgStats?.total_users || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  ผู้ใช้ทั้งหมดในระบบ
                </p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ผู้ใช้งานที่ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {orgStats?.active_users || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  ผู้ใช้ที่ใช้งานอยู่
                </p>
              </CardContent>
            </Card>

            {/* Inactive Users (Calculated) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ผู้ใช้งานที่ไม่ได้ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {(orgStats?.total_users || 0) - (orgStats?.active_users || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  ผู้ใช้ที่ไม่ได้ใช้งาน
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Inactive Accounts Details */}
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดบัญชีที่ไม่ใช้งาน</CardTitle>
              <CardDescription>บัญชีผู้ใช้ที่ไม่ได้เข้าสู่ระบบเป็นเวลานาน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {orgStats?.total_users > 0 ? 
                  `มีผู้ใช้ทั้งหมด ${orgStats.total_users} คน (ใช้งาน ${orgStats.active_users} คน)` :
                  'ไม่มีข้อมูลผู้ใช้งาน'
                }
                <br />
                อัตราการใช้งาน: {orgStats?.total_users > 0 ? 
                  Math.round((orgStats.active_users / orgStats.total_users) * 100) : 0}%
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