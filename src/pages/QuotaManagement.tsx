import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HardDrive,
  Mail,
  Users,
  Database,
  Edit,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

interface Quota {
  id: string;
  organization_id: string;
  quota_type: string;
  allocated_mb: number;
  used_mb: number;
  warning_threshold_mb?: number;
  last_calculated?: string;
  organization?: { name: string };
}

const QuotaManagement = () => {
  const { isAuthenticated } = useAuth();
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<Quota | null>(null);
  const [formData, setFormData] = useState({
    allocated_mb: 0,
    warning_threshold_mb: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuotas();
    }
  }, [isAuthenticated]);

  const fetchQuotas = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_quotas')
        .select(`
          *,
          organization:organizations(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuotas(data || []);
    } catch (error) {
      console.error('Error fetching quotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = (used: number, allocated: number) => {
    if (allocated === 0) return 0;
    return Math.round((used / allocated) * 100);
  };

  const getUsageStatus = (percentage: number, quota: Quota) => {
    const criticalThreshold = 95;
    const warningThreshold = Math.round((quota.warning_threshold_mb || quota.allocated_mb * 0.8) / quota.allocated_mb * 100);
    
    if (percentage >= criticalThreshold) {
      return { status: "critical", color: "bg-destructive", icon: AlertTriangle };
    } else if (percentage >= warningThreshold) {
      return { status: "warning", color: "bg-warning", icon: AlertTriangle };
    } else {
      return { status: "normal", color: "bg-success", icon: CheckCircle };
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "file_storage":
        return HardDrive;
      case "mailbox":
        return Mail;
      case "backup":
        return Database;
      default:
        return HardDrive;
    }
  };

  const filteredQuotas = quotas.filter(quota => {
    const orgName = quota.organization?.name || '';
    const matchesSearch = orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quota.quota_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== "all") {
      const percentage = getUsagePercentage(quota.used_mb, quota.allocated_mb);
      const status = getUsageStatus(percentage, quota);
      matchesFilter = status.status === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = async () => {
    if (selectedQuota) {
      try {
        const { error } = await supabase
          .from('storage_quotas')
          .update({
            allocated_mb: formData.allocated_mb,
            warning_threshold_mb: formData.warning_threshold_mb,
          })
          .eq('id', selectedQuota.id);
        
        if (error) throw error;
        
        fetchQuotas(); // Refresh data
        setIsEditDialogOpen(false);
        setSelectedQuota(null);
      } catch (error) {
        console.error('Error updating quota:', error);
      }
    }
  };

  const openEditDialog = (quota: Quota) => {
    setSelectedQuota(quota);
    setFormData({
      allocated_mb: quota.allocated_mb,
      warning_threshold_mb: quota.warning_threshold_mb || Math.round(quota.allocated_mb * 0.8),
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการโควต้า</h1>
          <p className="text-muted-foreground mt-1">
            ตรวจสอบและจัดการการใช้งานทรัพยากรระบบ
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ทรัพยากรทั้งหมด</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotas.length}</div>
            <p className="text-xs text-muted-foreground">รายการโควต้า</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะปกติ</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotas.filter(q => {
                const percentage = getUsagePercentage(q.used_mb, q.allocated_mb);
                const warningThreshold = Math.round((q.warning_threshold_mb || q.allocated_mb * 0.8) / q.allocated_mb * 100);
                return percentage < warningThreshold;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">ใช้งานปกติ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เตือน</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotas.filter(q => {
                const percentage = getUsagePercentage(q.used_mb, q.allocated_mb);
                const warningThreshold = Math.round((q.warning_threshold_mb || q.allocated_mb * 0.8) / q.allocated_mb * 100);
                const criticalThreshold = 95;
                return percentage >= warningThreshold && percentage < criticalThreshold;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">ใกล้เต็ม</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">วิกฤต</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotas.filter(q => {
                const percentage = getUsagePercentage(q.used_mb, q.allocated_mb);
                const criticalThreshold = 95;
                return percentage >= criticalThreshold;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">เต็มแล้ว</p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>แดชบอร์ดการใช้งาน</CardTitle>
          <CardDescription>
            ภาพรวมการใช้ทรัพยากรและโควต้าในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredQuotas.map((quota) => {
              const percentage = getUsagePercentage(quota.used_mb, quota.allocated_mb);
              const status = getUsageStatus(percentage, quota);
              const ResourceIcon = getResourceIcon(quota.quota_type);
              const StatusIcon = status.icon;

              return (
                <Card key={quota.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ResourceIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{quota.quota_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {quota.organization?.name || 'Unknown Organization'}
                        </div>
                      </div>
                    </div>
                    <StatusIcon className={`w-4 h-4 ${
                      status.status === 'critical' ? 'text-destructive' :
                      status.status === 'warning' ? 'text-warning' : 'text-success'
                    }`} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>การใช้งาน</span>
                      <span>{quota.used_mb} / {quota.allocated_mb} MB</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage}% ใช้งานแล้ว</span>
                      <span>อัปเดต: {quota.last_calculated ? new Date(quota.last_calculated).toLocaleString('th-TH') : '-'}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quota Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดโควต้า</CardTitle>
          <CardDescription>
            จัดการและแก้ไขโควต้าทรัพยากรของแต่ละองค์กร
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาองค์กร, หน่วยงาน, ทรัพยากร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="normal">ปกติ</SelectItem>
                <SelectItem value="warning">เตือน</SelectItem>
                <SelectItem value="critical">วิกฤต</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ทรัพยากร</TableHead>
                  <TableHead>องค์กร / หน่วยงาน</TableHead>
                  <TableHead>การใช้งาน</TableHead>
                  <TableHead className="text-center">สถานะ</TableHead>
                  <TableHead>อัปเดตล่าสุด</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotas.map((quota) => {
                  const percentage = getUsagePercentage(quota.used_mb, quota.allocated_mb);
                  const status = getUsageStatus(percentage, quota);
                  const ResourceIcon = getResourceIcon(quota.quota_type);

                  return (
                    <TableRow key={quota.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ResourceIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{quota.quota_type}</div>
                            <div className="text-sm text-muted-foreground capitalize">{quota.quota_type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quota.organization?.name || 'Unknown Organization'}</div>
                          <div className="text-sm text-muted-foreground">-</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{quota.used_mb} / {quota.allocated_mb} MB</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge 
                            className={
                              status.status === 'critical' ? 'bg-destructive text-destructive-foreground' :
                              status.status === 'warning' ? 'bg-warning text-warning-foreground' :
                              'bg-success text-success-foreground'
                            }
                          >
                            {status.status === 'critical' ? 'วิกฤต' :
                             status.status === 'warning' ? 'เตือน' : 'ปกติ'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {quota.last_calculated ? new Date(quota.last_calculated).toLocaleString('th-TH') : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(quota)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Quota Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขโควต้า</DialogTitle>
            <DialogDescription>
              แก้ไขการตั้งค่าโควต้า {selectedQuota?.quota_type}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="allocated" className="text-right">
                โควต้า *
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="allocated"
                  type="number"
                  value={formData.allocated_mb}
                  onChange={(e) => setFormData({...formData, allocated_mb: parseInt(e.target.value) || 0})}
                />
                <span className="text-sm text-muted-foreground">MB</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warning" className="text-right">
                เกณฑ์เตือน
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="warning"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.warning_threshold_mb}
                  onChange={(e) => setFormData({...formData, warning_threshold_mb: parseInt(e.target.value) || 0})}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                ข้อมูลปัจจุบัน
              </Label>
              <div className="col-span-3 p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>ใช้งานแล้ว: {selectedQuota?.used_mb} MB</div>
                  <div>เปอร์เซ็นต์การใช้งาน: {selectedQuota ? getUsagePercentage(selectedQuota.used_mb, selectedQuota.allocated_mb) : 0}%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEdit}>
              บันทึกการแก้ไข
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotaManagement;