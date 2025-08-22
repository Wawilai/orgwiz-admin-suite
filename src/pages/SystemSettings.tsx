import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Server, 
  Plus, 
  Download, 
  Upload,
  Settings,
  Shield,
  Database,
  Network,
  HardDrive,
  Cpu,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Key,
  Wifi,
  MoreHorizontal,
  Edit2,
  Trash2,
  Play,
  Square,
  Activity
} from 'lucide-react';

interface ServerInfo {
  id: string;
  name: string;
  type: 'Web Server' | 'Database' | 'Mail Server' | 'File Server' | 'Load Balancer';
  ipAddress: string;
  status: 'Online' | 'Offline' | 'Maintenance' | 'Warning';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  lastReboot: string;
  version: string;
  location: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'Full' | 'Incremental' | 'Differential';
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  targetServers: string[];
  destination: string;
  retention: number;
  status: 'Active' | 'Paused' | 'Failed';
  lastBackup: string;
  nextBackup: string;
  size: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'Firewall' | 'SSL/TLS' | 'Authentication' | 'Access Control';
  description: string;
  status: 'Enabled' | 'Disabled';
  lastModified: string;
  appliedTo: string[];
}

interface Certificate {
  id: string;
  domain: string;
  issuer: string;
  type: 'SSL/TLS' | 'Code Signing' | 'Email';
  validFrom: string;
  validTo: string;
  status: 'Valid' | 'Expired' | 'Expiring Soon' | 'Revoked';
  algorithm: string;
  keySize: number;
}

const mockServers: ServerInfo[] = [
  {
    id: '1',
    name: 'WEB-SRV-01',
    type: 'Web Server',
    ipAddress: '192.168.1.10',
    status: 'Online',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    uptime: 99.9,
    lastReboot: '2024-01-01T08:00:00',
    version: 'Apache 2.4.54',
    location: 'Data Center A'
  },
  {
    id: '2', 
    name: 'DB-SRV-01',
    type: 'Database',
    ipAddress: '192.168.1.20',
    status: 'Online',
    cpuUsage: 68,
    memoryUsage: 84,
    diskUsage: 65,
    uptime: 99.8,
    lastReboot: '2024-01-05T02:00:00',
    version: 'MySQL 8.0.35',
    location: 'Data Center A'
  },
  {
    id: '3',
    name: 'MAIL-SRV-01', 
    type: 'Mail Server',
    ipAddress: '192.168.1.30',
    status: 'Warning',
    cpuUsage: 85,
    memoryUsage: 91,
    diskUsage: 45,
    uptime: 98.5,
    lastReboot: '2024-01-10T06:00:00',
    version: 'Postfix 3.7.2',
    location: 'Data Center B'
  }
];

const mockBackups: BackupSchedule[] = [
  {
    id: '1',
    name: 'Daily Database Backup',
    type: 'Full',
    frequency: 'Daily',
    targetServers: ['DB-SRV-01'],
    destination: '/backup/database/',
    retention: 30,
    status: 'Active',
    lastBackup: '2024-01-25T02:00:00',
    nextBackup: '2024-01-26T02:00:00',
    size: '2.3 GB'
  },
  {
    id: '2',
    name: 'Weekly System Backup',
    type: 'Incremental', 
    frequency: 'Weekly',
    targetServers: ['WEB-SRV-01', 'MAIL-SRV-01'],
    destination: '/backup/system/',
    retention: 12,
    status: 'Active',
    lastBackup: '2024-01-21T01:00:00',
    nextBackup: '2024-01-28T01:00:00',
    size: '850 MB'
  }
];

const mockPolicies: SecurityPolicy[] = [
  {
    id: '1',
    name: 'Web Server Firewall',
    type: 'Firewall',
    description: 'กำหนดกฎไฟร์วอลล์สำหรับเว็บเซิร์ฟเวอร์',
    status: 'Enabled',
    lastModified: '2024-01-20T10:30:00',
    appliedTo: ['WEB-SRV-01']
  },
  {
    id: '2',
    name: 'Strong Password Policy',
    type: 'Authentication',
    description: 'กำหนดนโยบายรหัสผ่านที่เข้มงวด',
    status: 'Enabled', 
    lastModified: '2024-01-15T14:00:00',
    appliedTo: ['All Servers']
  }
];

const mockCertificates: Certificate[] = [
  {
    id: '1',
    domain: 'example.com',
    issuer: 'Let\'s Encrypt',
    type: 'SSL/TLS',
    validFrom: '2024-01-01',
    validTo: '2024-04-01',
    status: 'Valid',
    algorithm: 'RSA',
    keySize: 2048
  },
  {
    id: '2',
    domain: 'mail.example.com',
    issuer: 'DigiCert',
    type: 'SSL/TLS', 
    validFrom: '2023-12-15',
    validTo: '2024-02-15',
    status: 'Expiring Soon',
    algorithm: 'ECDSA',
    keySize: 256
  }
];

export default function SystemSettings() {
  const [servers] = useState<ServerInfo[]>(mockServers);
  const [backups, setBackups] = useState<BackupSchedule[]>(mockBackups);
  const [policies] = useState<SecurityPolicy[]>(mockPolicies);
  const [certificates] = useState<Certificate[]>(mockCertificates);
  const [currentTab, setCurrentTab] = useState('servers');
  const [isAddServerDialogOpen, setIsAddServerDialogOpen] = useState(false);
  const [isAddBackupDialogOpen, setIsAddBackupDialogOpen] = useState(false);

  const handleRunBackup = (backupId: string) => {
    setBackups(backups.map(backup => 
      backup.id === backupId 
        ? { ...backup, lastBackup: new Date().toISOString(), status: 'Active' as const }
        : backup
    ));
    toast({
      title: "เริ่ม Backup สำเร็จ",
      description: "กำลังดำเนินการสำรองข้อมูล",
    });
  };

  const handlePauseBackup = (backupId: string) => {
    setBackups(backups.map(backup => 
      backup.id === backupId 
        ? { ...backup, status: 'Paused' as const }
        : backup
    ));
    toast({
      title: "หยุด Backup สำเร็จ",
      description: "หยุดกำหนดการสำรองข้อมูลชั่วคราว",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Online: "default",
      Offline: "destructive",
      Maintenance: "secondary",
      Warning: "destructive",
      Active: "default",
      Paused: "secondary",
      Failed: "destructive",
      Enabled: "default",
      Disabled: "secondary",
      Valid: "default",
      Expired: "destructive", 
      'Expiring Soon': "secondary",
      Revoked: "destructive"
    };
    
    const colors = {
      Online: "text-green-700",
      Offline: "text-red-700",
      Maintenance: "text-yellow-700",
      Warning: "text-red-700",
      Active: "text-green-700",
      Paused: "text-yellow-700",
      Failed: "text-red-700",
      Enabled: "text-green-700",
      Disabled: "text-gray-700",
      Valid: "text-green-700",
      Expired: "text-red-700",
      'Expiring Soon': "text-yellow-700",
      Revoked: "text-red-700"
    };

    const statusText: Record<string, string> = {
      Online: "ออนไลน์",
      Offline: "ออฟไลน์", 
      Maintenance: "ซ่อมบำรุง",
      Warning: "เตือน",
      Active: "ใช้งาน",
      Paused: "หยุดชั่วคราว",
      Failed: "ล้มเหลว",
      Enabled: "เปิดใช้งาน",
      Disabled: "ปิดใช้งาน",
      Valid: "ใช้งานได้",
      Expired: "หมดอายุ",
      'Expiring Soon': "ใกล้หมดอายุ",
      Revoked: "ถูกเพิกถอน"
    };

    return (
      <Badge variant={variants[status] || "default"} className={colors[status as keyof typeof colors]}>
        {statusText[status] || status}
      </Badge>
    );
  };

  const getServerIcon = (type: string) => {
    const icons = {
      'Web Server': Server,
      'Database': Database,
      'Mail Server': Server,
      'File Server': HardDrive,
      'Load Balancer': Network
    };
    const Icon = icons[type as keyof typeof icons] || Server;
    return <Icon className="h-4 w-4" />;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ตั้งค่าระบบและเซิร์ฟเวอร์</h1>
            <p className="text-muted-foreground">จัดการเซิร์ฟเวอร์ การสำรองข้อมูล และความปลอดภัย</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกการตั้งค่า
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              นำเข้าการตั้งค่า
            </Button>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="servers">เซิร์ฟเวอร์</TabsTrigger>
          <TabsTrigger value="backup">สำรองข้อมูล</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
          <TabsTrigger value="certificates">ใบรับรอง</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-6">
          {/* Server Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">เซิร์ฟเวอร์ทั้งหมด</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{servers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ออนไลน์</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {servers.filter(s => s.status === 'Online').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">เตือน</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {servers.filter(s => s.status === 'Warning').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU เฉลี่ย</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(servers.reduce((sum, s) => sum + s.cpuUsage, 0) / servers.length)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Servers Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>รายการเซิร์ฟเวอร์</CardTitle>
                <Dialog open={isAddServerDialogOpen} onOpenChange={setIsAddServerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มเซิร์ฟเวอร์
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เพิ่มเซิร์ฟเวอร์ใหม่</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ชื่อเซิร์ฟเวอร์</Label>
                          <Input placeholder="เช่น WEB-SRV-02" />
                        </div>
                        <div className="space-y-2">
                          <Label>ประเภท</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกประเภท" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Web Server">Web Server</SelectItem>
                              <SelectItem value="Database">Database</SelectItem>
                              <SelectItem value="Mail Server">Mail Server</SelectItem>
                              <SelectItem value="File Server">File Server</SelectItem>
                              <SelectItem value="Load Balancer">Load Balancer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>IP Address</Label>
                          <Input placeholder="192.168.1.x" />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input placeholder="Data Center A" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>หมายเหตุ</Label>
                        <Textarea placeholder="รายละเอียดเพิ่มเติม" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddServerDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button>เพิ่มเซิร์ฟเวอร์</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เซิร์ฟเวอร์</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>การใช้งานทรัพยากร</TableHead>
                    <TableHead>อัปไทม์</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{server.name}</div>
                          <div className="text-sm text-muted-foreground">{server.version}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getServerIcon(server.type)}
                          {server.type}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{server.ipAddress}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>CPU:</span>
                            <span>{server.cpuUsage}%</span>
                          </div>
                          <Progress value={server.cpuUsage} className="h-1" />
                          <div className="flex justify-between text-xs">
                            <span>RAM:</span>
                            <span>{server.memoryUsage}%</span>
                          </div>
                          <Progress value={server.memoryUsage} className="h-1" />
                          <div className="flex justify-between text-xs">
                            <span>Disk:</span>
                            <span>{server.diskUsage}%</span>
                          </div>
                          <Progress value={server.diskUsage} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{server.uptime}%</div>
                          <div className="text-xs text-muted-foreground">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {new Date(server.lastReboot).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(server.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" />
                              แก้ไขการตั้งค่า
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              รีบูต
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบเซิร์ฟเวอร์
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          {/* Backup Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">กำหนดการทั้งหมด</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backups.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ใช้งานอยู่</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {backups.filter(b => b.status === 'Active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ล้มเหลว</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {backups.filter(b => b.status === 'Failed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ขนาดรวม</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.15 GB</div>
              </CardContent>
            </Card>
          </div>

          {/* Backup Schedules Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>กำหนดการสำรองข้อมูล</CardTitle>
                <Dialog open={isAddBackupDialogOpen} onOpenChange={setIsAddBackupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มกำหนดการ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เพิ่มกำหนดการสำรองข้อมูล</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>ชื่อกำหนดการ</Label>
                        <Input placeholder="เช่น Daily Web Server Backup" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ประเภท Backup</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full">Full</SelectItem>
                              <SelectItem value="Incremental">Incremental</SelectItem>
                              <SelectItem value="Differential">Differential</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>ความถี่</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily">รายวัน</SelectItem>
                              <SelectItem value="Weekly">รายสัปดาห์</SelectItem>
                              <SelectItem value="Monthly">รายเดือน</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>เซิร์ฟเวอร์เป้าหมาย</Label>
                        <Input placeholder="เลือกเซิร์ฟเวอร์" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ปลายทางการจัดเก็บ</Label>
                          <Input placeholder="/backup/path/" />
                        </div>
                        <div className="space-y-2">
                          <Label>เก็บไว้ (วัน)</Label>
                          <Input type="number" placeholder="30" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddBackupDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button>สร้างกำหนดการ</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อกำหนดการ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>ความถี่</TableHead>
                    <TableHead>เซิร์ฟเวอร์เป้าหมาย</TableHead>
                    <TableHead>สำรองล่าสุด</TableHead>
                    <TableHead>สำรองครั้งต่อไป</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{backup.name}</div>
                          <div className="text-sm text-muted-foreground">
                            เก็บไว้ {backup.retention} วัน | ขนาด {backup.size}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{backup.type}</Badge>
                      </TableCell>
                      <TableCell>{backup.frequency === 'Daily' ? 'รายวัน' : backup.frequency === 'Weekly' ? 'รายสัปดาห์' : 'รายเดือน'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {backup.targetServers.slice(0, 2).join(', ')}
                          {backup.targetServers.length > 2 && ` +${backup.targetServers.length - 2}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(backup.lastBackup).toLocaleDateString('th-TH')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(backup.nextBackup).toLocaleDateString('th-TH')}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {backup.status === 'Active' && (
                            <Button size="sm" variant="outline" onClick={() => handleRunBackup(backup.id)}>
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          {backup.status === 'Active' && (
                            <Button size="sm" variant="outline" onClick={() => handlePauseBackup(backup.id)}>
                              <Square className="h-3 w-3" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                ดูล็อก
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                นโยบายความปลอดภัย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อนโยบาย</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead>ใช้กับ</TableHead>
                    <TableHead>แก้ไขล่าสุด</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {policy.type === 'Firewall' && <Shield className="h-3 w-3 mr-1" />}
                          {policy.type === 'Authentication' && <Key className="h-3 w-3 mr-1" />}
                          {policy.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{policy.description}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {policy.appliedTo.slice(0, 2).join(', ')}
                          {policy.appliedTo.length > 2 && ` +${policy.appliedTo.length - 2}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(policy.lastModified).toLocaleDateString('th-TH')}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(policy.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" />
                              แก้ไขนโยบาย
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              ตั้งค่าขั้นสูง
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบนโยบาย
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                ใบรับรองดิจิทัล
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>โดเมน</TableHead>
                    <TableHead>ผู้ออกใบรับรอง</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>วันที่มีผล</TableHead>
                    <TableHead>วันหมดอายุ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => {
                    const daysUntilExpiry = getDaysUntilExpiry(cert.validTo);
                    return (
                      <TableRow key={cert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cert.domain}</div>
                            <div className="text-sm text-muted-foreground">
                              {cert.algorithm} {cert.keySize}-bit
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{cert.issuer}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{cert.type}</Badge>
                        </TableCell>
                        <TableCell>{cert.validFrom}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{cert.validTo}</div>
                            {cert.status === 'Expiring Soon' && (
                              <Badge variant="secondary" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {daysUntilExpiry} วัน
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cert.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                ดาวน์โหลดใบรับรอง
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                ต่ออายุ
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                เพิกถอน
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}