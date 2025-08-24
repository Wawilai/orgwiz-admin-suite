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
import { Switch } from "@/components/ui/switch";
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

// Mock data for domains
const mockDomains = [
  {
    id: 1,
    name: "abc-corp.com",
    organization: "บริษัท เอบีซี จำกัด (มหาชน)",
    organizationUnit: "IT Department",
    status: "active",
    spfEnabled: true,
    dkimEnabled: true,
    routingEnabled: true,
    mailboxCount: 45,
    createdAt: "2024-01-15",
    verifiedAt: "2024-01-15",
    expiresAt: "2025-01-15"
  },
  {
    id: 2,
    name: "xyz-ltd.com",
    organization: "บริษัท เอ็กซ์วายแซด จำกัด",
    organizationUnit: "HR Department", 
    status: "active",
    spfEnabled: true,
    dkimEnabled: false,
    routingEnabled: true,
    mailboxCount: 23,
    createdAt: "2024-02-01",
    verifiedAt: "2024-02-01",
    expiresAt: "2025-02-01"
  },
  {
    id: 3,
    name: "def-enterprise.com",
    organization: "บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด",
    organizationUnit: "Finance Department",
    status: "pending",
    spfEnabled: false,
    dkimEnabled: false,
    routingEnabled: false,
    mailboxCount: 0,
    createdAt: "2024-01-20",
    verifiedAt: null,
    expiresAt: "2025-01-20"
  },
];

const DomainManagement = () => {
  const [domains, setDomains] = useState(mockDomains);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    organizationUnit: "",
    spfEnabled: false,
    dkimEnabled: false,
    routingEnabled: false,
  });
  const [policyData, setPolicyData] = useState({
    spfStrict: false,
    spfRecords: "",
    dkimEnabled: false,
    dkimSelector: "",
    dkimKeySize: "2048",
    dmarcPolicy: "none",
    dmarcRua: "",
    maxMailboxes: "",
    maxAliases: "",
    externalForwarding: false,
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
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            รอการยืนยัน
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            หมดอายุ
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

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         domain.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || domain.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = () => {
    if (formData.name && formData.organization) {
      const newDomain = {
        id: domains.length + 1,
        ...formData,
        status: "pending",
        mailboxCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        verifiedAt: null,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setDomains([...domains, newDomain]);
      setFormData({
        name: "",
        organization: "",
        organizationUnit: "",
        spfEnabled: false,
        dkimEnabled: false,
        routingEnabled: false,
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedDomain && formData.name && formData.organization) {
      setDomains(domains.map(domain => 
        domain.id === selectedDomain.id ? { ...domain, ...formData } : domain
      ));
      setIsEditDialogOpen(false);
      setSelectedDomain(null);
    }
  };

  const handleDelete = (id: number) => {
    setDomains(domains.filter(domain => domain.id !== id));
  };

  const openEditDialog = (domain: any) => {
    setSelectedDomain(domain);
    setFormData({
      name: domain.name,
      organization: domain.organization,
      organizationUnit: domain.organizationUnit,
      spfEnabled: domain.spfEnabled,
      dkimEnabled: domain.dkimEnabled,
      routingEnabled: domain.routingEnabled,
    });
    setIsEditDialogOpen(true);
  };

  const openPolicyDialog = (domain: any) => {
    setSelectedDomain(domain);
    setPolicyData({
      spfStrict: domain.spfEnabled,
      spfRecords: `v=spf1 include:_spf.${domain.name} ~all`,
      dkimEnabled: domain.dkimEnabled,
      dkimSelector: "default",
      dkimKeySize: "2048",
      dmarcPolicy: domain.spfEnabled && domain.dkimEnabled ? "quarantine" : "none",
      dmarcRua: `mailto:dmarc@${domain.name}`,
      maxMailboxes: "1000",
      maxAliases: "500",
      externalForwarding: false,
    });
    setIsPolicyDialogOpen(true);
  };

  const handlePolicyUpdate = () => {
    if (selectedDomain) {
      setDomains(domains.map(domain => 
        domain.id === selectedDomain.id 
          ? { 
              ...domain, 
              spfEnabled: policyData.spfStrict,
              dkimEnabled: policyData.dkimEnabled,
              routingEnabled: domain.routingEnabled 
            } 
          : domain
      ));
      setIsPolicyDialogOpen(false);
      setSelectedDomain(null);
    }
  };

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain-name" className="text-right">
                    ชื่อโดเมน *
                  </Label>
                  <Input
                    id="domain-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="example.com"
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4">
                  <Label className="text-sm font-medium mb-3 block">นโยบายอีเมล</Label>
                  <div className="space-y-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="spf" className="text-sm font-medium">SPF Policy</Label>
                        <p className="text-xs text-muted-foreground">ป้องกันการปลอมแปลงผู้ส่ง</p>
                      </div>
                      <Switch
                        id="spf"
                        checked={formData.spfEnabled}
                        onCheckedChange={(checked) => setFormData({...formData, spfEnabled: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dkim" className="text-sm font-medium">DKIM Policy</Label>
                        <p className="text-xs text-muted-foreground">ลายเซ็นดิจิทัลสำหรับอีเมล</p>
                      </div>
                      <Switch
                        id="dkim"
                        checked={formData.dkimEnabled}
                        onCheckedChange={(checked) => setFormData({...formData, dkimEnabled: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="routing" className="text-sm font-medium">Mail Routing</Label>
                        <p className="text-xs text-muted-foreground">เส้นทางการส่งอีเมล</p>
                      </div>
                      <Switch
                        id="routing"
                        checked={formData.routingEnabled}
                        onCheckedChange={(checked) => setFormData({...formData, routingEnabled: checked})}
                      />
                    </div>
                  </div>
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
            <CardTitle className="text-sm font-medium">โดเมนทั้งหมด</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">+1 โดเมนเดือนนี้</p>
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
              {domains.reduce((sum, d) => sum + d.mailboxCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">ทุกโดเมน</p>
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
                <SelectItem value="expired">หมดอายุ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>โดเมน</TableHead>
                  <TableHead>องค์กร / หน่วยงาน</TableHead>
                  <TableHead className="text-center">นโยบาย</TableHead>
                  <TableHead className="text-center">กล่องจดหมาย</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันหมดอายุ</TableHead>
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
                            เพิ่มเมื่อ {domain.createdAt}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{domain.organization}</div>
                        <div className="text-sm text-muted-foreground">{domain.organizationUnit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <div className="flex flex-col items-center">
                          {getPolicyStatus(domain.spfEnabled)}
                          <span className="text-xs text-muted-foreground">SPF</span>
                        </div>
                        <div className="flex flex-col items-center">
                          {getPolicyStatus(domain.dkimEnabled)}
                          <span className="text-xs text-muted-foreground">DKIM</span>
                        </div>
                        <div className="flex flex-col items-center">
                          {getPolicyStatus(domain.routingEnabled)}
                          <span className="text-xs text-muted-foreground">Route</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{domain.mailboxCount}</div>
                        <div className="text-xs text-muted-foreground">กล่อง</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(domain.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {domain.expiresAt}
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
                          <DropdownMenuItem onClick={() => openPolicyDialog(domain)}>
                            <Shield className="mr-2 h-4 w-4" />
                            ตั้งค่านโยบาย
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(domain.id)}
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

      {/* Policy Settings Dialog */}
      <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
        <DialogContent className="max-w-4xl bg-card">
          <DialogHeader>
            <DialogTitle>ตั้งค่านโยบายโดเมน: {selectedDomain?.name}</DialogTitle>
            <DialogDescription>
              กำหนดนโยบายความปลอดภัยและการใช้งานสำหรับโดเมน {selectedDomain?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">นโยบาย SPF (Sender Policy Framework)</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="spf-strict" 
                    checked={policyData.spfStrict}
                    onCheckedChange={(checked) => setPolicyData({...policyData, spfStrict: checked})}
                  />
                  <Label htmlFor="spf-strict">ใช้งาน SPF แบบเข้มงวด</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spf-records">SPF Records</Label>
                  <Input 
                    id="spf-records" 
                    value={policyData.spfRecords}
                    onChange={(e) => setPolicyData({...policyData, spfRecords: e.target.value})}
                    placeholder="v=spf1 include:_spf.example.com ~all"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">นโยบาย DKIM (DomainKeys Identified Mail)</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="dkim-enable"
                    checked={policyData.dkimEnabled}
                    onCheckedChange={(checked) => setPolicyData({...policyData, dkimEnabled: checked})}
                  />
                  <Label htmlFor="dkim-enable">เปิดใช้งาน DKIM</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dkim-selector">Selector</Label>
                    <Input 
                      id="dkim-selector"
                      value={policyData.dkimSelector}
                      onChange={(e) => setPolicyData({...policyData, dkimSelector: e.target.value})}
                      placeholder="default"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dkim-key-size">Key Size</Label>
                    <Select 
                      value={policyData.dkimKeySize}
                      onValueChange={(value) => setPolicyData({...policyData, dkimKeySize: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกขนาด Key" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="1024">1024 bits</SelectItem>
                        <SelectItem value="2048">2048 bits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">นโยบาย DMARC</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="dmarc-policy">DMARC Policy</Label>
                  <Select
                    value={policyData.dmarcPolicy}
                    onValueChange={(value) => setPolicyData({...policyData, dmarcPolicy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือก Policy" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="quarantine">Quarantine</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dmarc-rua">Report URI (RUA)</Label>
                  <Input 
                    id="dmarc-rua"
                    value={policyData.dmarcRua}
                    onChange={(e) => setPolicyData({...policyData, dmarcRua: e.target.value})}
                    placeholder="mailto:dmarc@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">การจำกัดการใช้งาน</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-mailboxes">จำนวนกล่องจดหมายสูงสุด</Label>
                    <Input 
                      id="max-mailboxes" 
                      type="number"
                      value={policyData.maxMailboxes}
                      onChange={(e) => setPolicyData({...policyData, maxMailboxes: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-aliases">จำนวน Aliases สูงสุด</Label>
                    <Input 
                      id="max-aliases" 
                      type="number"
                      value={policyData.maxAliases}
                      onChange={(e) => setPolicyData({...policyData, maxAliases: e.target.value})}
                      placeholder="500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="external-forwarding"
                    checked={policyData.externalForwarding}
                    onCheckedChange={(checked) => setPolicyData({...policyData, externalForwarding: checked})}
                  />
                  <Label htmlFor="external-forwarding">อนุญาตการส่งต่อไปยังโดเมนภายนอก</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPolicyDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handlePolicyUpdate}>
              บันทึกการตั้งค่า
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขโดเมน</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลโดเมน {selectedDomain?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-domain-name" className="text-right">
                ชื่อโดเมน *
              </Label>
              <Input
                id="edit-domain-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-organization" className="text-right">
                องค์กร *
              </Label>
              <Select value={formData.organization} onValueChange={(value) => setFormData({...formData, organization: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="บริษัท เอบีซี จำกัด (มหาชน)">บริษัท เอบีซี จำกัด (มหาชน)</SelectItem>
                  <SelectItem value="บริษัท เอ็กซ์วายแซด จำกัด">บริษัท เอ็กซ์วายแซด จำกัด</SelectItem>
                  <SelectItem value="บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด">บริษัท ดีอีเอฟ เอ็นเตอร์ไพรซ์ จำกัด</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ou" className="text-right">
                หน่วยงาน
              </Label>
              <Select value={formData.organizationUnit} onValueChange={(value) => setFormData({...formData, organizationUnit: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="IT Department">IT Department</SelectItem>
                  <SelectItem value="HR Department">HR Department</SelectItem>
                  <SelectItem value="Finance Department">Finance Department</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-4">
              <Label className="text-sm font-medium mb-3 block">นโยบายอีเมล</Label>
              <div className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="edit-spf" className="text-sm font-medium">SPF Policy</Label>
                    <p className="text-xs text-muted-foreground">ป้องกันการปลอมแปลงผู้ส่ง</p>
                  </div>
                  <Switch
                    id="edit-spf"
                    checked={formData.spfEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, spfEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="edit-dkim" className="text-sm font-medium">DKIM Policy</Label>
                    <p className="text-xs text-muted-foreground">ลายเซ็นดิจิทัลสำหรับอีเมล</p>
                  </div>
                  <Switch
                    id="edit-dkim"
                    checked={formData.dkimEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, dkimEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="edit-routing" className="text-sm font-medium">Mail Routing</Label>
                    <p className="text-xs text-muted-foreground">เส้นทางการส่งอีเมล</p>
                  </div>
                  <Switch
                    id="edit-routing"
                    checked={formData.routingEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, routingEnabled: checked})}
                  />
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

export default DomainManagement;