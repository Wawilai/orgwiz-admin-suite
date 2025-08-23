import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
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
import {
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  UserCheck,
  Inbox,
  Send,
  Archive,
  Download,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Mailbox {
  id: string;
  local_part: string;
  domain_id: string;
  display_name?: string;
  quota_mb?: number;
  used_quota_mb?: number;
  status: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  domain_name?: string;
  password_hash?: string;
  domains?: { name: string };
}

const fetchMailboxes = async () => {
  const { data, error } = await supabase
    .from('mailboxes')
    .select(`
      *,
      domains!mailboxes_domain_id_fkey (name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching mailboxes:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลกล่องจดหมายได้",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

const createMailbox = async (mailboxData: any) => {
  const { data, error } = await supabase
    .from('mailboxes')
    .insert([mailboxData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating mailbox:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถเพิ่มกล่องจดหมายได้",
      variant: "destructive",
    });
    return null;
  }
  
  return data;
};

const updateMailbox = async (id: string, mailboxData: any) => {
  const { error } = await supabase
    .from('mailboxes')
    .update(mailboxData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating mailbox:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถแก้ไขกล่องจดหมายได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const deleteMailbox = async (id: string) => {
  const { error } = await supabase
    .from('mailboxes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting mailbox:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถลบกล่องจดหมายได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const MailService = () => {
  const { user } = useAuth();
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMailbox, setEditingMailbox] = useState<Mailbox | null>(null);
  const [formData, setFormData] = useState({
    local_part: "",
    display_name: "",
    domain_id: "",
    quota_mb: 5120, // 5GB in MB
    status: "active"
  });

  useEffect(() => {
    loadMailboxes();
  }, []);

  const loadMailboxes = async () => {
    setLoading(true);
    const data = await fetchMailboxes();
    setMailboxes(data);
    setLoading(false);
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
      case "suspended":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            ระงับ
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">ไม่ใช้งาน</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUsagePercentage = (used: number, quota: number) => {
    return quota > 0 ? Math.round((used / quota) * 100) : 0;
  };

  const getUsageBadge = (used: number, quota: number) => {
    const percentage = getUsagePercentage(used, quota);
    if (percentage >= 95) {
      return <Badge variant="destructive">{percentage}%</Badge>;
    } else if (percentage >= 80) {
      return <Badge className="bg-warning text-warning-foreground">{percentage}%</Badge>;
    } else {
      return <Badge variant="outline">{percentage}%</Badge>;
    }
  };

  const filteredMailboxes = mailboxes.filter(mailbox => {
    const email = `${mailbox.local_part}@${mailbox.domains?.name || 'unknown'}`;
    const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mailbox.display_name && mailbox.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || mailbox.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = async () => {
    if (!user || !formData.local_part || !formData.domain_id) return;
    
    setSubmitting(true);
    const mailboxData = {
      ...formData,
      used_quota_mb: 0
    };
    
    const newMailbox = await createMailbox(mailboxData);
    if (newMailbox) {
      await loadMailboxes();
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "เพิ่มกล่องจดหมายสำเร็จ",
        description: "เพิ่มกล่องจดหมายใหม่เรียบร้อยแล้ว",
      });
    }
    setSubmitting(false);
  };

  const handleEdit = async () => {
    if (!editingMailbox) return;
    
    setSubmitting(true);
    const success = await updateMailbox(editingMailbox.id, formData);
    if (success) {
      await loadMailboxes();
      setEditingMailbox(null);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "แก้ไขสำเร็จ",
        description: "แก้ไขข้อมูลกล่องจดหมายเรียบร้อยแล้ว",
      });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteMailbox(id);
    if (success) {
      await loadMailboxes();
      toast({
        title: "ลบสำเร็จ",
        description: "ลบกล่องจดหมายเรียบร้อยแล้ว",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      local_part: "",
      display_name: "",
      domain_id: "",
      quota_mb: 5120,
      status: "active"
    });
  };

  const openEditDialog = (mailbox: Mailbox) => {
    setEditingMailbox(mailbox);
    setFormData({
      local_part: mailbox.local_part,
      display_name: mailbox.display_name || "",
      domain_id: mailbox.domain_id,
      quota_mb: mailbox.quota_mb || 5120,
      status: mailbox.status
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">บริการจดหมายอิเล็กทรอนิกส์</h1>
          <p className="text-muted-foreground mt-1">
            จัดการกล่องจดหมายและบัญชีอีเมลในระบบ
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มกล่องจดหมาย
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card">
              <DialogHeader>
                <DialogTitle>เพิ่มกล่องจดหมายใหม่</DialogTitle>
                <DialogDescription>
                  สร้างบัญชีอีเมลใหม่ในระบบ
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="local_part" className="text-right">
                    ชื่อผู้ใช้ *
                  </Label>
                  <Input
                    id="local_part"
                    value={formData.local_part}
                    onChange={(e) => setFormData({...formData, local_part: e.target.value})}
                    placeholder="username"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="display_name" className="text-right">
                    ชื่อแสดง *
                  </Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    placeholder="ชื่อ-นามสกุล"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quota_mb" className="text-right">
                    โควต้า (MB) *
                  </Label>
                  <Input
                    id="quota_mb"
                    type="number"
                    value={formData.quota_mb}
                    onChange={(e) => setFormData({...formData, quota_mb: parseInt(e.target.value)})}
                    placeholder="5120"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <LoadingButton loading={submitting} onClick={handleAdd}>
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
            <CardTitle className="text-sm font-medium">กล่องจดหมายทั้งหมด</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mailboxes.length}</div>
            <p className="text-xs text-muted-foreground">บัญชีในระบบ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใช้งานปกติ</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mailboxes.filter(m => m.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">พร้อมใช้งาน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พื้นที่ใช้งาน</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mailboxes.reduce((sum, m) => sum + (m.used_quota_mb || 0), 0)} MB
            </div>
            <p className="text-xs text-muted-foreground">
              จาก {mailboxes.reduce((sum, m) => sum + (m.quota_mb || 0), 0)} MB
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ระงับ</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mailboxes.filter(m => m.status === 'suspended').length}
            </div>
            <p className="text-xs text-muted-foreground">ต้องตรวจสอบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Mailbox Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการกล่องจดหมาย</CardTitle>
          <CardDescription>
            จัดการบัญชีอีเมลและกล่องจดหมายในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาอีเมล, ชื่อแสดง..."
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
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="suspended">ระงับ</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>กล่องจดหมาย</TableHead>
                  <TableHead>การใช้งาน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>เข้าใช้ล่าสุด</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMailboxes.map((mailbox) => {
                  const email = `${mailbox.local_part}@${mailbox.domains?.name || 'unknown'}`;
                  const used = mailbox.used_quota_mb || 0;
                  const quota = mailbox.quota_mb || 5120;
                  
                  return (
                    <TableRow key={mailbox.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{email}</div>
                            <div className="text-sm text-muted-foreground">{mailbox.display_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{used} / {quota} MB</span>
                            {getUsageBadge(used, quota)}
                          </div>
                          <div className="w-20 bg-muted rounded-full h-1">
                            <div 
                              className="h-1 rounded-full bg-primary"
                              style={{ width: `${Math.min(getUsagePercentage(used, quota), 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(mailbox.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {mailbox.last_login ? new Date(mailbox.last_login).toLocaleDateString('th-TH') : "ยังไม่เข้าใช้"}
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
                            <DropdownMenuItem onClick={() => openEditDialog(mailbox)}>
                              <Edit className="mr-2 h-4 w-4" />
                              แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(mailbox.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredMailboxes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedFilter !== 'all' 
                        ? 'ไม่พบข้อมูลที่ค้นหา' 
                        : 'ยังไม่มีกล่องจดหมายในระบบ'
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขกล่องจดหมาย</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลกล่องจดหมาย {editingMailbox ? `${editingMailbox.local_part}@${editingMailbox.domains?.name}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-local_part" className="text-right">
                ชื่อผู้ใช้ *
              </Label>
              <Input
                id="edit-local_part"
                value={formData.local_part}
                onChange={(e) => setFormData({...formData, local_part: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-display_name" className="text-right">
                ชื่อแสดง *
              </Label>
              <Input
                id="edit-display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quota_mb" className="text-right">
                โควต้า (MB)
              </Label>
              <Input
                id="edit-quota_mb"
                type="number"
                value={formData.quota_mb}
                onChange={(e) => setFormData({...formData, quota_mb: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <LoadingButton loading={submitting} onClick={handleEdit}>
              บันทึกการแก้ไข
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MailService;