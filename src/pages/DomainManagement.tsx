import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Switch } from "@/components/ui/switch";
import { LoadingButton } from "@/components/ui/loading-button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Globe,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react";

interface Domain {
  id: string;
  name: string;
  organization_id: string;
  status: 'active' | 'pending' | 'suspended';
  spf_enabled: boolean;
  dkim_enabled: boolean;
  routing_enabled: boolean;
  dmarc_enabled: boolean;
  max_mailboxes: number;
  max_aliases: number;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  spf_record?: string;
  dkim_selector?: string;
  dmarc_policy?: string;
  mx_records?: any[];
  organizations?: { name: string };
}

// Real database functions
const fetchDomains = async () => {
  const { data, error } = await supabase
    .from('domains')
    .select(`
      *,
      organizations!domains_organization_id_fkey (name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching domains:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลโดเมนได้",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

const createDomain = async (domainData: any) => {
  const { data, error } = await supabase
    .from('domains')
    .insert([domainData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating domain:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถเพิ่มโดเมนได้",
      variant: "destructive",
    });
    return null;
  }
  
  return data;
};

const updateDomain = async (id: string, domainData: any) => {
  const { error } = await supabase
    .from('domains')
    .update(domainData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating domain:', error);
    toast({
      title: "เกิดข้อผิดพลาด", 
      description: "ไม่สามารถอัปเดตโดเมนได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const deleteDomain = async (id: string) => {
  const { error } = await supabase
    .from('domains')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting domain:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถลบโดเมนได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const DomainManagement = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    max_mailboxes: number;
    max_aliases: number;
    status: 'active' | 'pending' | 'suspended';
  }>({
    name: "",
    max_mailboxes: 1000,
    max_aliases: 500,
    status: "active"
  });

  // Load domains on component mount
  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    setLoading(true);
    const data = await fetchDomains();
    // Transform data to ensure proper typing
    const transformedData = data.map((domain: any) => ({
      ...domain,
      status: domain.status as 'active' | 'pending' | 'suspended'
    }));
    setDomains(transformedData);
    setLoading(false);
  };

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (domain.organizations?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || domain.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddDomain = async () => {
    if (!user) return;
    
    setSubmitting(true);
    const domainData = {
      ...formData,
      organization_id: '8a6c4c9d-69f2-4582-b7d4-b72238637b2b', // Current organization
      spf_enabled: false,
      dkim_enabled: false,
      routing_enabled: false,
      dmarc_enabled: false,
      mx_records: []
    };
    
    const newDomain = await createDomain(domainData);
    if (newDomain) {
      await loadDomains();
      setIsAddDomainOpen(false);
      resetForm();
      toast({
        title: "เพิ่มโดเมนสำเร็จ",
        description: "เพิ่มโดเมนใหม่เรียบร้อยแล้ว",
      });
    }
    setSubmitting(false);
  };

  const handleEditDomain = async () => {
    if (!editingDomain) return;
    
    setSubmitting(true);
    const success = await updateDomain(editingDomain.id, formData);
    if (success) {
      await loadDomains();
      setEditingDomain(null);
      resetForm();
      toast({
        title: "แก้ไขสำเร็จ",
        description: "แก้ไขข้อมูลโดเมนเรียบร้อยแล้ว",
      });
    }
    setSubmitting(false);
  };

  const handleDeleteDomain = async (id: string) => {
    const success = await deleteDomain(id);
    if (success) {
      await loadDomains();
      toast({
        title: "ลบสำเร็จ",
        description: "ลบโดเมนเรียบร้อยแล้ว",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      max_mailboxes: 1000,
      max_aliases: 500,
      status: "active"
    });
  };

  const openEditDialog = (domain: Domain) => {
    setEditingDomain(domain);
    setFormData({
      name: domain.name,
      max_mailboxes: domain.max_mailboxes,
      max_aliases: domain.max_aliases,
      status: domain.status
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            ใช้งาน
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            รอการยืนยัน
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            ระงับ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPolicyStatus = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <XCircle className="w-4 h-4 text-muted-foreground" />
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการโดเมน</h1>
          <p className="text-muted-foreground mt-1">
            จัดการโดเมนและนโยบายการรับส่งอีเมล
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ส่งออก
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            นำเข้า
          </Button>
          <Dialog open={isAddDomainOpen} onOpenChange={setIsAddDomainOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มโดเมน
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card">
              <DialogHeader>
                <DialogTitle>เพิ่มโดเมนใหม่</DialogTitle>
                <DialogDescription>
                  เพิ่มโดเมนใหม่และกำหนดนโยบายการใช้งาน
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain-name">ชื่อโดเมน *</Label>
                  <Input
                    id="domain-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-mailboxes">กล่องจดหมายสูงสุด</Label>
                    <Input
                      id="max-mailboxes"
                      type="number"
                      value={formData.max_mailboxes}
                      onChange={(e) => setFormData({...formData, max_mailboxes: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-aliases">Aliases สูงสุด</Label>
                    <Input
                      id="max-aliases"
                      type="number"
                      value={formData.max_aliases}
                      onChange={(e) => setFormData({...formData, max_aliases: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">สถานะ</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'pending' | 'suspended') => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="pending">รอการยืนยัน</SelectItem>
                      <SelectItem value="suspended">ระงับ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDomainOpen(false)}>
                  ยกเลิก
                </Button>
                <LoadingButton loading={submitting} onClick={handleAddDomain}>
                  บันทึก
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โดเมนทั้งหมด</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">ทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โดเมนที่ใช้งาน</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.filter(d => d.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">พร้อมใช้งาน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กล่องจดหมายรวม</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, d) => sum + d.max_mailboxes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">ความจุรวม</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอการยืนยัน</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">ต้องตรวจสอบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Domain Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการโดเมน</CardTitle>
          <CardDescription>
            จัดการโดเมนและนโยบายการรับส่งอีเมลในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาโดเมน, องค์กร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="pending">รอการยืนยัน</SelectItem>
                <SelectItem value="suspended">ระงับ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>โดเมน</TableHead>
                  <TableHead>องค์กร</TableHead>
                  <TableHead className="text-center">นโยบาย</TableHead>
                  <TableHead className="text-center">กล่องจดหมาย</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{domain.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {domain.verified_at ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{domain.organizations?.name || 'ไม่ระบุ'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <div className="flex flex-col items-center">
                          {getPolicyStatus(domain.spf_enabled)}
                          <span className="text-xs text-muted-foreground">SPF</span>
                        </div>
                        <div className="flex flex-col items-center">
                          {getPolicyStatus(domain.dkim_enabled)}
                          <span className="text-xs text-muted-foreground">DKIM</span>
                        </div>
                        <div className="flex flex-col items-center">
                          {getPolicyStatus(domain.routing_enabled)}
                          <span className="text-xs text-muted-foreground">Route</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{domain.max_mailboxes}</div>
                        <div className="text-xs text-muted-foreground">สูงสุด</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(domain.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(domain.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(domain)}>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteDomain(domain.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingDomain} onOpenChange={(open) => !open && setEditingDomain(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขโดเมน</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลโดเมน {editingDomain?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-domain-name">ชื่อโดเมน *</Label>
              <Input
                id="edit-domain-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-max-mailboxes">กล่องจดหมายสูงสุด</Label>
                <Input
                  id="edit-max-mailboxes"
                  type="number"
                  value={formData.max_mailboxes}
                  onChange={(e) => setFormData({...formData, max_mailboxes: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max-aliases">Aliases สูงสุด</Label>
                <Input
                  id="edit-max-aliases"
                  type="number"
                  value={formData.max_aliases}
                  onChange={(e) => setFormData({...formData, max_aliases: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">สถานะ</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'pending' | 'suspended') => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="pending">รอการยืนยัน</SelectItem>
                  <SelectItem value="suspended">ระงับ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingDomain(null)}>
              ยกเลิก
            </Button>
            <LoadingButton loading={submitting} onClick={handleEditDomain}>
              บันทึกการแก้ไข
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainManagement;