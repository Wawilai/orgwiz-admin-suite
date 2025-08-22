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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Shield,
  Search,
  Filter,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Activity,
  Download,
  FileText,
  Route,
} from "lucide-react";

// Mock data for mail relay policies and logs
const mockPolicies = {
  antiSpam: {
    enabled: true,
    level: "medium",
    whiteList: ["trusted-domain.com", "partner.org"],
    blackList: ["spam-domain.com", "malicious.net"],
    quarantineAction: "quarantine"
  },
  antiVirus: {
    enabled: true,
    action: "reject",
    scanAttachments: true,
    maxFileSize: 25 // MB
  },
  routing: {
    enabled: true,
    inboundServer: "mail-in.company.com",
    outboundServer: "mail-out.company.com",
    backupServer: "mail-backup.company.com",
    retryAttempts: 3,
    retryInterval: 15 // minutes
  },
  rateLimit: {
    enabled: true,
    messagesPerHour: 1000,
    messagesPerDay: 10000,
    connectionsPerIP: 10
  }
};

const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-20 14:30:15",
    from: "sender@external.com",
    to: "user@abc-corp.com",
    subject: "Monthly Report",
    status: "delivered",
    action: "accepted",
    size: 2.5, // MB
    scanResult: "clean",
    processingTime: 250, // ms
    server: "mail-in-01"
  },
  {
    id: 2,
    timestamp: "2024-01-20 14:28:42",
    from: "spam@malicious.net",
    to: "user@abc-corp.com",
    subject: "Urgent: Verify Your Account",
    status: "blocked",
    action: "rejected",
    size: 0.1,
    scanResult: "spam",
    processingTime: 50,
    server: "mail-in-02"
  },
  {
    id: 3,
    timestamp: "2024-01-20 14:25:33",
    from: "admin@abc-corp.com",
    to: "external@partner.com",
    subject: "Contract Documents",
    status: "delivered",
    action: "accepted",
    size: 15.8,
    scanResult: "clean",
    processingTime: 1200,
    server: "mail-out-01"
  },
  {
    id: 4,
    timestamp: "2024-01-20 14:22:18",
    from: "marketing@company.com",
    to: "user@abc-corp.com",
    subject: "Newsletter - January 2024",
    status: "quarantined",
    action: "quarantine",
    size: 3.2,
    scanResult: "suspicious",
    processingTime: 800,
    server: "mail-in-01"
  }
];

const MailRelay = () => {
  const [policies, setPolicies] = useState(mockPolicies);
  const [logs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            ส่งแล้ว
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            ถูกบล็อก
          </Badge>
        );
      case "quarantined":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            กักกัน
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            กำลังประมวลผล
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScanResultBadge = (result: string) => {
    switch (result) {
      case "clean":
        return <Badge className="bg-success text-success-foreground">สะอาด</Badge>;
      case "spam":
        return <Badge variant="destructive">สแปม</Badge>;
      case "virus":
        return <Badge variant="destructive">ไวรัส</Badge>;
      case "suspicious":
        return <Badge className="bg-warning text-warning-foreground">น่าสงสัย</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || log.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const updatePolicy = (category: string, field: string, value: any) => {
    setPolicies(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mail Relay</h1>
          <p className="text-muted-foreground mt-1">
            จัดการนโยบายการส่งต่ออีเมลและตรวจสอบล็อก
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ส่งออกล็อก
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            ตั้งค่าขั้นสูง
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อีเมลวันนี้</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% จากเมื่อวาน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ส่งสำเร็จ</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,189</div>
            <p className="text-xs text-muted-foreground">95.3% อัตราสำเร็จ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ถูกบล็อก</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">3.6% จากทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กักกัน</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">ตรวจสอบเพิ่มเติม</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>นโยบาย</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>ล็อกการทำงาน</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Anti-Spam Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>ป้องกันสแปม</span>
                </CardTitle>
                <CardDescription>
                  กำหนดนโยบายการตรวจจับและจัดการสแปม
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="anti-spam">เปิดใช้งาน</Label>
                  <Switch
                    id="anti-spam"
                    checked={policies.antiSpam.enabled}
                    onCheckedChange={(checked) => updatePolicy('antiSpam', 'enabled', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spam-level">ระดับการตรวจจับ</Label>
                  <Select
                    value={policies.antiSpam.level}
                    onValueChange={(value) => updatePolicy('antiSpam', 'level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="low">ต่ำ</SelectItem>
                      <SelectItem value="medium">ปานกลาง</SelectItem>
                      <SelectItem value="high">สูง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="white-list">White List (คั่นด้วยเครื่องหมายจุลภาค)</Label>
                  <Textarea
                    id="white-list"
                    value={policies.antiSpam.whiteList.join(', ')}
                    onChange={(e) => updatePolicy('antiSpam', 'whiteList', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="trusted-domain.com, partner.org"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="black-list">Black List</Label>
                  <Textarea
                    id="black-list"
                    value={policies.antiSpam.blackList.join(', ')}
                    onChange={(e) => updatePolicy('antiSpam', 'blackList', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="spam-domain.com, malicious.net"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Anti-Virus Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>ป้องกันไวรัส</span>
                </CardTitle>
                <CardDescription>
                  กำหนดนโยบายการตรวจสอบไวรัส
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="anti-virus">เปิดใช้งาน</Label>
                  <Switch
                    id="anti-virus"
                    checked={policies.antiVirus.enabled}
                    onCheckedChange={(checked) => updatePolicy('antiVirus', 'enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virus-action">การดำเนินการเมื่อพบไวรัส</Label>
                  <Select
                    value={policies.antiVirus.action}
                    onValueChange={(value) => updatePolicy('antiVirus', 'action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="reject">ปฏิเสธ</SelectItem>
                      <SelectItem value="quarantine">กักกัน</SelectItem>
                      <SelectItem value="clean">ล้างไวรัส</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="scan-attachments">สแกนไฟล์แนบ</Label>
                  <Switch
                    id="scan-attachments"
                    checked={policies.antiVirus.scanAttachments}
                    onCheckedChange={(checked) => updatePolicy('antiVirus', 'scanAttachments', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-file-size">ขนาดไฟล์สูงสุด (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    value={policies.antiVirus.maxFileSize}
                    onChange={(e) => updatePolicy('antiVirus', 'maxFileSize', parseInt(e.target.value) || 25)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Routing Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Route className="w-5 h-5" />
                  <span>การส่งต่อ</span>
                </CardTitle>
                <CardDescription>
                  กำหนดเส้นทางการส่งอีเมล
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="routing">เปิดใช้งาน</Label>
                  <Switch
                    id="routing"
                    checked={policies.routing.enabled}
                    onCheckedChange={(checked) => updatePolicy('routing', 'enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inbound-server">เซิร์ฟเวอร์รับ</Label>
                  <Input
                    id="inbound-server"
                    value={policies.routing.inboundServer}
                    onChange={(e) => updatePolicy('routing', 'inboundServer', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outbound-server">เซิร์ฟเวอร์ส่ง</Label>
                  <Input
                    id="outbound-server"
                    value={policies.routing.outboundServer}
                    onChange={(e) => updatePolicy('routing', 'outboundServer', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-server">เซิร์ฟเวอร์สำรอง</Label>
                  <Input
                    id="backup-server"
                    value={policies.routing.backupServer}
                    onChange={(e) => updatePolicy('routing', 'backupServer', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rate Limiting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>จำกัดอัตราการส่ง</span>
                </CardTitle>
                <CardDescription>
                  กำหนดขีดจำกัดการส่งอีเมล
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate-limit">เปิดใช้งาน</Label>
                  <Switch
                    id="rate-limit"
                    checked={policies.rateLimit.enabled}
                    onCheckedChange={(checked) => updatePolicy('rateLimit', 'enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messages-hour">ข้อความต่อชั่วโมง</Label>
                  <Input
                    id="messages-hour"
                    type="number"
                    value={policies.rateLimit.messagesPerHour}
                    onChange={(e) => updatePolicy('rateLimit', 'messagesPerHour', parseInt(e.target.value) || 1000)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messages-day">ข้อความต่อวัน</Label>
                  <Input
                    id="messages-day"
                    type="number"
                    value={policies.rateLimit.messagesPerDay}
                    onChange={(e) => updatePolicy('rateLimit', 'messagesPerDay', parseInt(e.target.value) || 10000)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connections-ip">การเชื่อมต่อต่อ IP</Label>
                  <Input
                    id="connections-ip"
                    type="number"
                    value={policies.rateLimit.connectionsPerIP}
                    onChange={(e) => updatePolicy('rateLimit', 'connectionsPerIP', parseInt(e.target.value) || 10)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              บันทึกการตั้งค่า
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ล็อกการทำงาน Mail Relay</CardTitle>
              <CardDescription>
                ตรวจสอบการทำงานและประวัติการส่งอีเมล
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาจาก, ถึง, หัวข้อ..."
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
                    <SelectItem value="delivered">ส่งแล้ว</SelectItem>
                    <SelectItem value="blocked">ถูกบล็อก</SelectItem>
                    <SelectItem value="quarantined">กักกัน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เวลา</TableHead>
                      <TableHead>จาก / ถึง</TableHead>
                      <TableHead>หัวข้อ</TableHead>
                      <TableHead>ขนาด</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>ผลการสแกน</TableHead>
                      <TableHead>เซิร์ฟเวอร์</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">
                            {log.timestamp}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">จาก: {log.from}</div>
                            <div className="text-sm text-muted-foreground">ถึง: {log.to}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm">
                            {log.subject}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.size.toFixed(1)} MB
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(log.status)}
                        </TableCell>
                        <TableCell>
                          {getScanResultBadge(log.scanResult)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.server}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MailRelay;