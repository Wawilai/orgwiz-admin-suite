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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Server,
  Lock,
  Key,
  Database,
  Zap,
  Save,
  Globe,
  Network,
  Timer
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
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    smtp: {
      hostname: "smtp.company.com",
      port: 587,
      username: "relay@company.com",
      password: "********",
      authMethod: "PLAIN",
      enableTLS: true,
      requireTLS: false,
      timeoutConnect: 30,
      timeoutData: 60
    },
    security: {
      enableDKIM: true,
      dkimSelector: "mail",
      dkimPrivateKey: "/path/to/private.key",
      enableSPF: true,
      enableDMARC: true,
      dmarcPolicy: "quarantine",
      tlsVersion: "1.2",
      cipherSuites: "HIGH:!aNULL:!MD5"
    },
    delivery: {
      maxRetries: 5,
      retryInterval: 300,
      maxConcurrentConnections: 50,
      bounceHandling: "return",
      dsnOptions: "FAILURE,DELAY",
      deliveryReportEmail: "admin@company.com"
    },
    logging: {
      logLevel: "INFO",
      logPath: "/var/log/mailrelay/",
      logRotation: "daily",
      maxLogSize: 100,
      enableDebugLogging: false,
      logFormat: "extended"
    },
    performance: {
      maxQueueSize: 10000,
      processingThreads: 4,
      memoryLimit: 512,
      diskCacheEnabled: true,
      diskCachePath: "/tmp/mailrelay/",
      compressionEnabled: true
    },
    backup: {
      enableFailover: true,
      failoverServers: ["backup1.company.com", "backup2.company.com"],
      failoverTimeout: 30,
      autoFailback: true,
      backupRetentionDays: 30
    }
  });

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

  const updateAdvancedSetting = (category: string, field: string, value: any) => {
    setAdvancedSettings(prev => ({
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
          <Button onClick={() => setIsAdvancedSettingsOpen(true)}>
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

      {/* Advanced Settings Dialog */}
      <Dialog open={isAdvancedSettingsOpen} onOpenChange={setIsAdvancedSettingsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              ตั้งค่าขั้นสูง Mail Relay
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="smtp" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="smtp" className="flex items-center gap-1">
                <Server className="w-4 h-4" />
                SMTP
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                ความปลอดภัย
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                การส่ง
              </TabsTrigger>
              <TabsTrigger value="logging" className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                บันทึก
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                ประสิทธิภาพ
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                สำรอง
              </TabsTrigger>
            </TabsList>

            <TabsContent value="smtp" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>การตั้งค่า SMTP Server</CardTitle>
                  <CardDescription>กำหนดค่าเซิร์ฟเวอร์ SMTP สำหรับการส่งอีเมล</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hostname</Label>
                      <Input
                        value={advancedSettings.smtp.hostname}
                        onChange={(e) => updateAdvancedSetting('smtp', 'hostname', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={advancedSettings.smtp.port}
                        onChange={(e) => updateAdvancedSetting('smtp', 'port', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={advancedSettings.smtp.username}
                        onChange={(e) => updateAdvancedSetting('smtp', 'username', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={advancedSettings.smtp.password}
                        onChange={(e) => updateAdvancedSetting('smtp', 'password', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Authentication Method</Label>
                      <Select
                        value={advancedSettings.smtp.authMethod}
                        onValueChange={(value) => updateAdvancedSetting('smtp', 'authMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLAIN">PLAIN</SelectItem>
                          <SelectItem value="LOGIN">LOGIN</SelectItem>
                          <SelectItem value="CRAM-MD5">CRAM-MD5</SelectItem>
                          <SelectItem value="DIGEST-MD5">DIGEST-MD5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Connection Timeout (seconds)</Label>
                      <Input
                        type="number"
                        value={advancedSettings.smtp.timeoutConnect}
                        onChange={(e) => updateAdvancedSetting('smtp', 'timeoutConnect', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-tls">Enable TLS</Label>
                      <Switch
                        id="enable-tls"
                        checked={advancedSettings.smtp.enableTLS}
                        onCheckedChange={(checked) => updateAdvancedSetting('smtp', 'enableTLS', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-tls">Require TLS</Label>
                      <Switch
                        id="require-tls"
                        checked={advancedSettings.smtp.requireTLS}
                        onCheckedChange={(checked) => updateAdvancedSetting('smtp', 'requireTLS', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>DKIM Configuration</CardTitle>
                    <CardDescription>DomainKeys Identified Mail settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-dkim">Enable DKIM</Label>
                      <Switch
                        id="enable-dkim"
                        checked={advancedSettings.security.enableDKIM}
                        onCheckedChange={(checked) => updateAdvancedSetting('security', 'enableDKIM', checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>DKIM Selector</Label>
                      <Input
                        value={advancedSettings.security.dkimSelector}
                        onChange={(e) => updateAdvancedSetting('security', 'dkimSelector', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Private Key Path</Label>
                      <Input
                        value={advancedSettings.security.dkimPrivateKey}
                        onChange={(e) => updateAdvancedSetting('security', 'dkimPrivateKey', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SPF & DMARC</CardTitle>
                    <CardDescription>Email authentication policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-spf">Enable SPF</Label>
                      <Switch
                        id="enable-spf"
                        checked={advancedSettings.security.enableSPF}
                        onCheckedChange={(checked) => updateAdvancedSetting('security', 'enableSPF', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-dmarc">Enable DMARC</Label>
                      <Switch
                        id="enable-dmarc"
                        checked={advancedSettings.security.enableDMARC}
                        onCheckedChange={(checked) => updateAdvancedSetting('security', 'enableDMARC', checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>DMARC Policy</Label>
                      <Select
                        value={advancedSettings.security.dmarcPolicy}
                        onValueChange={(value) => updateAdvancedSetting('security', 'dmarcPolicy', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="quarantine">Quarantine</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>TLS Configuration</CardTitle>
                  <CardDescription>Transport Layer Security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>TLS Version</Label>
                      <Select
                        value={advancedSettings.security.tlsVersion}
                        onValueChange={(value) => updateAdvancedSetting('security', 'tlsVersion', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.0">TLS 1.0</SelectItem>
                          <SelectItem value="1.1">TLS 1.1</SelectItem>
                          <SelectItem value="1.2">TLS 1.2</SelectItem>
                          <SelectItem value="1.3">TLS 1.3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Cipher Suites</Label>
                      <Input
                        value={advancedSettings.security.cipherSuites}
                        onChange={(e) => updateAdvancedSetting('security', 'cipherSuites', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Options</CardTitle>
                  <CardDescription>Configure email delivery behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Retries</Label>
                      <Input
                        type="number"
                        value={advancedSettings.delivery.maxRetries}
                        onChange={(e) => updateAdvancedSetting('delivery', 'maxRetries', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Retry Interval (seconds)</Label>
                      <Input
                        type="number"
                        value={advancedSettings.delivery.retryInterval}
                        onChange={(e) => updateAdvancedSetting('delivery', 'retryInterval', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Concurrent Connections</Label>
                      <Input
                        type="number"
                        value={advancedSettings.delivery.maxConcurrentConnections}
                        onChange={(e) => updateAdvancedSetting('delivery', 'maxConcurrentConnections', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bounce Handling</Label>
                      <Select
                        value={advancedSettings.delivery.bounceHandling}
                        onValueChange={(value) => updateAdvancedSetting('delivery', 'bounceHandling', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="return">Return to Sender</SelectItem>
                          <SelectItem value="discard">Discard</SelectItem>
                          <SelectItem value="quarantine">Quarantine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>DSN Options</Label>
                    <Input
                      value={advancedSettings.delivery.dsnOptions}
                      onChange={(e) => updateAdvancedSetting('delivery', 'dsnOptions', e.target.value)}
                      placeholder="FAILURE,DELAY,SUCCESS"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Delivery Report Email</Label>
                    <Input
                      type="email"
                      value={advancedSettings.delivery.deliveryReportEmail}
                      onChange={(e) => updateAdvancedSetting('delivery', 'deliveryReportEmail', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logging" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Logging Configuration</CardTitle>
                  <CardDescription>Configure logging behavior and storage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Log Level</Label>
                      <Select
                        value={advancedSettings.logging.logLevel}
                        onValueChange={(value) => updateAdvancedSetting('logging', 'logLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DEBUG">DEBUG</SelectItem>
                          <SelectItem value="INFO">INFO</SelectItem>
                          <SelectItem value="WARN">WARN</SelectItem>
                          <SelectItem value="ERROR">ERROR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Log Rotation</Label>
                      <Select
                        value={advancedSettings.logging.logRotation}
                        onValueChange={(value) => updateAdvancedSetting('logging', 'logRotation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Log Path</Label>
                      <Input
                        value={advancedSettings.logging.logPath}
                        onChange={(e) => updateAdvancedSetting('logging', 'logPath', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Log Size (MB)</Label>
                      <Input
                        type="number"
                        value={advancedSettings.logging.maxLogSize}
                        onChange={(e) => updateAdvancedSetting('logging', 'maxLogSize', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="debug-logging">Enable Debug Logging</Label>
                      <Switch
                        id="debug-logging"
                        checked={advancedSettings.logging.enableDebugLogging}
                        onCheckedChange={(checked) => updateAdvancedSetting('logging', 'enableDebugLogging', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Log Format</Label>
                      <Select
                        value={advancedSettings.logging.logFormat}
                        onValueChange={(value) => updateAdvancedSetting('logging', 'logFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="extended">Extended</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Tuning</CardTitle>
                  <CardDescription>Optimize system performance and resource usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Queue Size</Label>
                      <Input
                        type="number"
                        value={advancedSettings.performance.maxQueueSize}
                        onChange={(e) => updateAdvancedSetting('performance', 'maxQueueSize', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Processing Threads</Label>
                      <Input
                        type="number"
                        value={advancedSettings.performance.processingThreads}
                        onChange={(e) => updateAdvancedSetting('performance', 'processingThreads', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Memory Limit (MB)</Label>
                      <Input
                        type="number"
                        value={advancedSettings.performance.memoryLimit}
                        onChange={(e) => updateAdvancedSetting('performance', 'memoryLimit', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Disk Cache Path</Label>
                      <Input
                        value={advancedSettings.performance.diskCachePath}
                        onChange={(e) => updateAdvancedSetting('performance', 'diskCachePath', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="disk-cache">Enable Disk Cache</Label>
                      <Switch
                        id="disk-cache"
                        checked={advancedSettings.performance.diskCacheEnabled}
                        onCheckedChange={(checked) => updateAdvancedSetting('performance', 'diskCacheEnabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compression">Enable Compression</Label>
                      <Switch
                        id="compression"
                        checked={advancedSettings.performance.compressionEnabled}
                        onCheckedChange={(checked) => updateAdvancedSetting('performance', 'compressionEnabled', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Backup & Failover</CardTitle>
                  <CardDescription>Configure backup servers and failover settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-failover">Enable Failover</Label>
                    <Switch
                      id="enable-failover"
                      checked={advancedSettings.backup.enableFailover}
                      onCheckedChange={(checked) => updateAdvancedSetting('backup', 'enableFailover', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Failover Servers (one per line)</Label>
                    <Textarea
                      value={advancedSettings.backup.failoverServers.join('\n')}
                      onChange={(e) => updateAdvancedSetting('backup', 'failoverServers', e.target.value.split('\n').filter(s => s.trim()))}
                      placeholder="backup1.company.com&#10;backup2.company.com"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Failover Timeout (seconds)</Label>
                      <Input
                        type="number"
                        value={advancedSettings.backup.failoverTimeout}
                        onChange={(e) => updateAdvancedSetting('backup', 'failoverTimeout', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Backup Retention (days)</Label>
                      <Input
                        type="number"
                        value={advancedSettings.backup.backupRetentionDays}
                        onChange={(e) => updateAdvancedSetting('backup', 'backupRetentionDays', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-failback">Auto Failback</Label>
                    <Switch
                      id="auto-failback"
                      checked={advancedSettings.backup.autoFailback}
                      onCheckedChange={(checked) => updateAdvancedSetting('backup', 'autoFailback', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAdvancedSettingsOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => {
              // Here you would typically save the settings
              console.log('Saving advanced settings:', advancedSettings);
              setIsAdvancedSettingsOpen(false);
            }}>
              <Save className="w-4 h-4 mr-2" />
              บันทึกการตั้งค่า
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MailRelay;