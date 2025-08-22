import { useState } from "react";
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

// Mock data for mailboxes
const mockMailboxes = [
  {
    id: 1,
    email: "somchai@abc-corp.com",
    displayName: "สมชาย ใจดี",
    owner: "สมชาย ใจดี",
    organization: "บริษัท เอบีซี จำกัด (มหาชน)",
    organizationUnit: "IT Department",
    domain: "abc-corp.com",
    quota: 5, // GB
    used: 3.2, // GB
    status: "active",
    lastLogin: "2024-01-20 10:30",
    createdAt: "2024-01-15",
    messageCount: 1250,
    forwardTo: null
  },
  {
    id: 2,
    email: "somying@abc-corp.com",
    displayName: "สมหญิง รักสะอาด",
    owner: "สมหญิง รักสะอาด",
    organization: "บริษัท เอบีซี จำกัด (มหาชน)",
    organizationUnit: "HR Department",
    domain: "abc-corp.com",
    quota: 5,
    used: 1.8,
    status: "active",
    lastLogin: "2024-01-20 15:45",
    createdAt: "2024-01-15",
    messageCount: 890,
    forwardTo: null
  },
  {
    id: 3,
    email: "admin@xyz-ltd.com",
    displayName: "Admin XYZ",
    owner: null,
    organization: "บริษัท เอ็กซ์วายแซด จำกัด",
    organizationUnit: "Management",
    domain: "xyz-ltd.com",
    quota: 10,
    used: 0.5,
    status: "active",
    lastLogin: "2024-01-19 09:15",
    createdAt: "2024-02-01",
    messageCount: 45,
    forwardTo: "director@xyz-ltd.com"
  },
  {
    id: 4,
    email: "support@def-enterprise.com",
    displayName: "Support Team",
    owner: "ทีมสนับสนุน",
    organization: "บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด",
    organizationUnit: "Support",
    domain: "def-enterprise.com",
    quota: 2,
    used: 2.1,
    status: "suspended",
    lastLogin: "2024-01-18 14:22",
    createdAt: "2024-01-20",
    messageCount: 2890,
    forwardTo: null
  }
];

const MailService = () => {
  const [mailboxes, setMailboxes] = useState(mockMailboxes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMailbox, setSelectedMailbox] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    owner: "",
    organization: "",
    organizationUnit: "",
    domain: "",
    quota: 5,
    forwardTo: ""
  });

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
    return Math.round((used / quota) * 100);
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
    const matchesSearch = mailbox.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mailbox.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mailbox.owner && mailbox.owner.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || mailbox.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = () => {
    if (formData.email && formData.displayName) {
      const newMailbox = {
        id: mailboxes.length + 1,
        ...formData,
        status: "active",
        used: 0,
        lastLogin: null,
        createdAt: new Date().toISOString().split('T')[0],
        messageCount: 0
      };
      setMailboxes([...mailboxes, newMailbox]);
      setFormData({
        email: "",
        displayName: "",
        owner: "",
        organization: "",
        organizationUnit: "",
        domain: "",
        quota: 5,
        forwardTo: ""
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedMailbox && formData.email && formData.displayName) {
      setMailboxes(mailboxes.map(mailbox => 
        mailbox.id === selectedMailbox.id ? { ...mailbox, ...formData } : mailbox
      ));
      setIsEditDialogOpen(false);
      setSelectedMailbox(null);
    }
  };

  const handleDelete = (id: number) => {
    setMailboxes(mailboxes.filter(mailbox => mailbox.id !== id));
  };

  const openEditDialog = (mailbox: any) => {
    setSelectedMailbox(mailbox);
    setFormData({
      email: mailbox.email,
      displayName: mailbox.displayName,
      owner: mailbox.owner || "",
      organization: mailbox.organization,
      organizationUnit: mailbox.organizationUnit,
      domain: mailbox.domain,
      quota: mailbox.quota,
      forwardTo: mailbox.forwardTo || ""
    });
    setIsEditDialogOpen(true);
  };

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
                  <Label htmlFor="email" className="text-right">
                    อีเมล *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@domain.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right">
                    ชื่อแสดง *
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="ชื่อ-นามสกุล"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="owner" className="text-right">
                    เจ้าของ
                  </Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                    placeholder="เจ้าของกล่องจดหมาย"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="organization" className="text-right">
                    องค์กร *
                  </Label>
                  <Select value={formData.organization} onValueChange={(value) => setFormData({...formData, organization: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="เลือกองค์กร" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="บริษัท เอบีซี จำกัด (มหาชน)">บริษัท เอบีซี จำกัด (มหาชน)</SelectItem>
                      <SelectItem value="บริษัท เอ็กซ์วายแซด จำกัด">บริษัท เอ็กซ์วายแซด จำกัด</SelectItem>
                      <SelectItem value="บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด">บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ou" className="text-right">
                    หน่วยงาน
                  </Label>
                  <Select value={formData.organizationUnit} onValueChange={(value) => setFormData({...formData, organizationUnit: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="เลือกหน่วยงาน" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="IT Department">IT Department</SelectItem>
                      <SelectItem value="HR Department">HR Department</SelectItem>
                      <SelectItem value="Finance Department">Finance Department</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    โดเมน *
                  </Label>
                  <Select value={formData.domain} onValueChange={(value) => setFormData({...formData, domain: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="เลือกโดเมน" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="abc-corp.com">abc-corp.com</SelectItem>
                      <SelectItem value="xyz-ltd.com">xyz-ltd.com</SelectItem>
                      <SelectItem value="def-enterprise.com">def-enterprise.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quota" className="text-right">
                    โควต้า
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Input
                      id="quota"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.quota}
                      onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value) || 5})}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">GB</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="forwardTo" className="text-right">
                    ส่งต่อไปยง
                  </Label>
                  <Input
                    id="forwardTo"
                    type="email"
                    value={formData.forwardTo}
                    onChange={(e) => setFormData({...formData, forwardTo: e.target.value})}
                    placeholder="forward@domain.com"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAdd}>
                  บันทึก
                </Button>
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
            <p className="text-xs text-muted-foreground">+3 บัญชีเดือนนี้</p>
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
            <CardTitle className="text-sm font-medium">ข้อความรวม</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mailboxes.reduce((sum, m) => sum + m.messageCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">ข้อความทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พื้นที่ใช้งาน</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mailboxes.reduce((sum, m) => sum + m.used, 0).toFixed(1)} GB
            </div>
            <p className="text-xs text-muted-foreground">
              จาก {mailboxes.reduce((sum, m) => sum + m.quota, 0)} GB
            </p>
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
                placeholder="ค้นหาอีเมล, ชื่อ, เจ้าของ..."
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
                  <TableHead>เจ้าของ / องค์กร</TableHead>
                  <TableHead>การใช้งาน</TableHead>
                  <TableHead className="text-center">ข้อความ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>เข้าใช้ล่าสุด</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMailboxes.map((mailbox) => (
                  <TableRow key={mailbox.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{mailbox.email}</div>
                          <div className="text-sm text-muted-foreground">{mailbox.displayName}</div>
                          {mailbox.forwardTo && (
                            <div className="text-xs text-muted-foreground">
                              → {mailbox.forwardTo}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{mailbox.owner || "ไม่ระบุ"}</div>
                        <div className="text-sm text-muted-foreground">{mailbox.organization}</div>
                        <div className="text-xs text-muted-foreground">{mailbox.organizationUnit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{mailbox.used} / {mailbox.quota} GB</span>
                          {getUsageBadge(mailbox.used, mailbox.quota)}
                        </div>
                        <div className="w-20 bg-muted rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-primary"
                            style={{ width: `${Math.min(getUsagePercentage(mailbox.used, mailbox.quota), 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{mailbox.messageCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">ข้อความ</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(mailbox.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {mailbox.lastLogin || "ยังไม่เข้าใช้"}
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
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            รีเซ็ตรหัสผ่าน
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCheck className="mr-2 h-4 w-4" />
                            กำหนดเจ้าของ
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
                ))}
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
              แก้ไขข้อมูลกล่องจดหมาย {selectedMailbox?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                อีเมล *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-displayName" className="text-right">
                ชื่อแสดง *
              </Label>
              <Input
                id="edit-displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-owner" className="text-right">
                เจ้าของ
              </Label>
              <Input
                id="edit-owner"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-quota" className="text-right">
                โควต้า
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="edit-quota"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.quota}
                  onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value) || 5})}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">GB</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-forwardTo" className="text-right">
                ส่งต่อไปยง
              </Label>
              <Input
                id="edit-forwardTo"
                type="email"
                value={formData.forwardTo}
                onChange={(e) => setFormData({...formData, forwardTo: e.target.value})}
                className="col-span-3"
              />
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

export default MailService;