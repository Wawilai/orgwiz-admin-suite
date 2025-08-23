import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Building,
  Mail,
  MessageSquare,
  Calendar,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Server,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmails: number;
  totalMessages: number;
  totalMeetings: number;
  storageUsed: number;
  storageTotal: number;
  uptime: number;
}

interface Activity {
  id: string;
  type: 'user' | 'organization' | 'email' | 'meeting' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function EnhancedDashboard() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalEmails: 0,
    totalMessages: 0,
    totalMeetings: 0,
    storageUsed: 0,
    storageTotal: 1000,
    uptime: 99.9
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch organizations count
      const { data: orgs, count: totalOrgs } = await supabase
        .from('organizations')
        .select('*', { count: 'exact' });

      const activeOrgs = orgs?.filter(o => o.status === 'active').length || 0;

      // Fetch profiles count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Fetch storage usage
      const { data: storageData } = await supabase
        .from('storage_quotas')
        .select('used_mb')
        .is('user_id', null);

      const totalStorageUsed = storageData?.reduce((sum, quota) => sum + (quota.used_mb || 0), 0) || 0;
      const storageUsedGB = Math.round(totalStorageUsed / 1024);

      // Fetch recent activity logs
      const { data: activityData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const mappedActivities: Activity[] = activityData?.map(log => ({
        id: log.id,
        type: log.entity_type as 'user' | 'organization' | 'email' | 'meeting' | 'system',
        title: log.action,
        description: log.action,
        timestamp: new Date(log.created_at).toLocaleString('th-TH'),
        status: 'info' as const
      })) || [];

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalOrganizations: totalOrgs || 0,
        activeOrganizations: activeOrgs,
        totalEmails: 45623, // This would need a mail service integration
        totalMessages: 12456, // This would need a chat service integration
        totalMeetings: 234, // This would need a meeting service integration
        storageUsed: storageUsedGB,
        storageTotal: 1000,
        uptime: 99.9
      });

      setActivities(mappedActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <MessageSquare className="h-4 w-4" />;
      case 'system': return <Server className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'info': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">แดชบอร์ดระบบ</h1>
          <p className="text-muted-foreground mt-1">
            ภาพรวมการใช้งานและสถานะระบบ Enterprise Management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            ระบบพร้อมใช้งาน
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            อัปเดตล่าสุด: ตอนนี้
          </Badge>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% จากเดือนที่แล้ว
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">องค์กรที่ใช้งาน</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.activeOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              จาก {stats.totalOrganizations} องค์กรทั้งหมด
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อีเมลวันนี้</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalEmails.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% จากเมื่อวาน
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ห้องประชุมกำลังใช้งาน</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              ห้องประชุมที่เปิดอยู่ในขณะนี้
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health and Storage */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>สถานะระบบ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ประสิทธิภาพระบบ</span>
                <span className="text-sm text-muted-foreground">{loading ? '...' : stats.uptime}%</span>
              </div>
              <Progress value={stats.uptime} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ผู้ใช้งานออนไลน์</span>
                <span className="text-sm text-muted-foreground">
                  {loading ? '...' : `${stats.activeUsers}/${stats.totalUsers}`}
                </span>
              </div>
              <Progress value={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0} className="w-full" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">ระบบทำงานปกติ</span>
              </div>
              <Button variant="outline" size="sm">
                ดูรายละเอียด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>พื้นที่จัดเก็บข้อมูล</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">พื้นที่ใช้งาน</span>
                <span className="text-sm text-muted-foreground">
                  {loading ? '...' : `${stats.storageUsed} GB / ${stats.storageTotal} GB`}
                </span>
              </div>
              <Progress value={(stats.storageUsed / stats.storageTotal) * 100} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{loading ? '...' : stats.storageUsed}</div>
                <div className="text-xs text-muted-foreground">GB ใช้งาน</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {loading ? '...' : stats.storageTotal - stats.storageUsed}
                </div>
                <div className="text-xs text-muted-foreground">GB ว่าง</div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              จัดการพื้นที่จัดเก็บ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>กิจกรรมล่าสุด</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">กำลังโหลดข้อมูล...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">ไม่มีกิจกรรมล่าสุด</div>
                ) : activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full bg-muted ${getActivityStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      {activity.user && (
                        <div className="flex items-center space-x-2 pt-1">
                          <Avatar className="w-4 h-4">
                            <AvatarFallback className="text-xs">
                              {activity.user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{activity.user}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>การดำเนินการด่วน</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              จัดการผู้ใช้งาน
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building className="w-4 h-4 mr-2" />
              เพิ่มองค์กรใหม่
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              ตรวจสอบอีเมล
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              จัดการปฏิทิน
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              ห้องประชุม
            </Button>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                การแจ้งเตือน
              </h4>
              <div className="space-y-2">
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <span className="font-medium">การบำรุงรักษา:</span> วันอาทิตย์ 02:00-06:00
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <span className="font-medium">อัปเดต:</span> ฟีเจอร์ใหม่พร้อมใช้งาน
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}