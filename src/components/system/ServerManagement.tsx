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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  Server, 
  Plus, 
  CheckCircle,
  AlertTriangle,
  Cpu,
  Clock,
  RefreshCw,
  Activity,
  MoreHorizontal,
  Edit2,
  Trash2,
  Settings,
  Database,
  HardDrive,
  Network,
  BarChart3,
  Calendar,
  Save,
  Monitor,
  TrendingUp,
  Wrench
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

export function ServerManagement() {
  const [servers] = useState<ServerInfo[]>(mockServers);
  const [isAddServerDialogOpen, setIsAddServerDialogOpen] = useState(false);
  const [isServerDetailDialogOpen, setIsServerDetailDialogOpen] = useState(false);
  const [isEditServerDialogOpen, setIsEditServerDialogOpen] = useState(false);
  const [isMonitorDialogOpen, setIsMonitorDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(null);

  const handleViewServerDetail = (server: ServerInfo) => {
    setSelectedServer(server);
    setIsServerDetailDialogOpen(true);
  };

  const handleEditServer = (server: ServerInfo) => {
    setSelectedServer(server);
    setIsEditServerDialogOpen(true);
  };

  const handleRebootServer = (serverId: string) => {
    toast({
      title: "รีบูตเซิร์ฟเวอร์",
      description: "กำลังดำเนินการรีบูตเซิร์ฟเวอร์",
    });
  };

  const handleDeleteServer = (serverId: string) => {
    toast({
      title: "ลบเซิร์ฟเวอร์สำเร็จ",
      description: "ลบเซิร์ฟเวอร์ออกจากระบบแล้ว",
    });
  };

  const handleStartMaintenance = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    setSelectedServer(server || null);
    setIsMaintenanceDialogOpen(true);
  };

  const handleMonitorServer = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    setSelectedServer(server || null);
    setIsMonitorDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Online: "default",
      Offline: "destructive",
      Maintenance: "secondary",
      Warning: "destructive"
    };
    
    const statusText: Record<string, string> = {
      Online: "ออนไลน์",
      Offline: "ออฟไลน์", 
      Maintenance: "ซ่อมบำรุง",
      Warning: "เตือน"
    };

    return (
      <Badge variant={variants[status] || "default"}>
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

  return (
    <div className="space-y-6">
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
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานที่" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Data Center A">Data Center A</SelectItem>
                          <SelectItem value="Data Center B">Data Center B</SelectItem>
                          <SelectItem value="Data Center C">Data Center C</SelectItem>
                          <SelectItem value="Cloud Region 1">Cloud Region 1</SelectItem>
                          <SelectItem value="Cloud Region 2">Cloud Region 2</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <DropdownMenuItem onClick={() => handleViewServerDetail(server)}>
                          <Activity className="mr-2 h-4 w-4" />
                          ดูรายละเอียด
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditServer(server)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          แก้ไขการตั้งค่า
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMonitorServer(server.id)}>
                          <Activity className="mr-2 h-4 w-4" />
                          ติดตามแบบเรียลไทม์
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStartMaintenance(server.id)}>
                          <Settings className="mr-2 h-4 w-4" />
                          โหมดซ่อมบำรุง
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRebootServer(server.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          รีบูต
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteServer(server.id)} className="text-red-600">
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

      {/* Server Detail Dialog */}
      <Dialog open={isServerDetailDialogOpen} onOpenChange={setIsServerDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดเซิร์ฟเวอร์</DialogTitle>
          </DialogHeader>
          {selectedServer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อเซิร์ฟเวอร์</Label>
                  <p className="font-medium">{selectedServer.name}</p>
                </div>
                <div>
                  <Label>ประเภท</Label>
                  <p>{selectedServer.type}</p>
                </div>
                <div>
                  <Label>IP Address</Label>
                  <p className="font-mono">{selectedServer.ipAddress}</p>
                </div>
                <div>
                  <Label>สถานที่</Label>
                  <p>{selectedServer.location}</p>
                </div>
                <div>
                  <Label>เวอร์ชัน</Label>
                  <p>{selectedServer.version}</p>
                </div>
                <div>
                  <Label>อัปไทม์</Label>
                  <p>{selectedServer.uptime}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>การใช้งานทรัพยากร</Label>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU</span>
                      <span>{selectedServer.cpuUsage}%</span>
                    </div>
                    <Progress value={selectedServer.cpuUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>RAM</span>
                      <span>{selectedServer.memoryUsage}%</span>
                    </div>
                    <Progress value={selectedServer.memoryUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Disk</span>
                      <span>{selectedServer.diskUsage}%</span>
                    </div>
                    <Progress value={selectedServer.diskUsage} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Server Dialog */}
      <Dialog open={isEditServerDialogOpen} onOpenChange={setIsEditServerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขการตั้งค่าเซิร์ฟเวอร์</DialogTitle>
          </DialogHeader>
          {selectedServer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ชื่อเซิร์ฟเวอร์</Label>
                  <Input defaultValue={selectedServer.name} />
                </div>
                <div className="space-y-2">
                  <Label>ประเภท</Label>
                  <Select defaultValue={selectedServer.type}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Input defaultValue={selectedServer.ipAddress} />
                </div>
                <div className="space-y-2">
                  <Label>สถานที่</Label>
                  <Select defaultValue={selectedServer.location}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Data Center A">Data Center A</SelectItem>
                      <SelectItem value="Data Center B">Data Center B</SelectItem>
                      <SelectItem value="Data Center C">Data Center C</SelectItem>
                      <SelectItem value="Cloud Region 1">Cloud Region 1</SelectItem>
                      <SelectItem value="Cloud Region 2">Cloud Region 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>เวอร์ชัน</Label>
                  <Input defaultValue={selectedServer.version} />
                </div>
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select defaultValue={selectedServer.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>หมายเหตุ</Label>
                <Textarea placeholder="รายละเอียดเพิ่มเติมหรือการตั้งค่าพิเศษ" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditServerDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "บันทึกการตั้งค่าสำเร็จ",
                    description: "บันทึกการตั้งค่าเซิร์ฟเวอร์เรียบร้อยแล้ว",
                  });
                  setIsEditServerDialogOpen(false);
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกการตั้งค่า
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Real-time Monitoring Dialog */}
      <Dialog open={isMonitorDialogOpen} onOpenChange={setIsMonitorDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              การติดตามแบบเรียลไทม์ - {selectedServer?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedServer && (
            <div className="space-y-6">
              {/* Real-time Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">CPU Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedServer.cpuUsage}%</div>
                    <Progress value={selectedServer.cpuUsage} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">RAM Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedServer.memoryUsage}%</div>
                    <Progress value={selectedServer.memoryUsage} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Disk Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedServer.diskUsage}%</div>
                    <Progress value={selectedServer.diskUsage} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>
              
              {/* Mock Real-time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    ประสิทธิภาพระบบ (24 ชั่วโมงที่ผ่านมา)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>กราฟการใช้งานแบบเรียลไทม์</p>
                      <p className="text-sm">CPU, RAM, Disk และ Network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ข้อมูลระบบ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span>{selectedServer.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Reboot:</span>
                      <span>{new Date(selectedServer.lastReboot).toLocaleDateString('th-TH')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span>{selectedServer.version}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Network</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Incoming:</span>
                      <span>125.4 MB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outgoing:</span>
                      <span>89.2 MB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connections:</span>
                      <span>1,234</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Maintenance Mode Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              โหมดซ่อมบำรุง - {selectedServer?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedServer && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">คำเตือน</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  การเข้าสู่โหมดซ่อมบำรุงจะทำให้เซิร์ฟเวอร์หยุดให้บริการชั่วคราว
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>วันที่เริ่มต้น</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>วันที่สิ้นสุด</Label>
                  <Input type="datetime-local" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>เหตุผลในการซ่อมบำรุง</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเหตุผล" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">การบำรุงรักษาตามกำหนด</SelectItem>
                    <SelectItem value="security">อัปเดตด้านความปลอดภัย</SelectItem>
                    <SelectItem value="hardware">ซ่อมแซมฮาร์ดแวร์</SelectItem>
                    <SelectItem value="software">อัปเดตซอฟต์แวร์</SelectItem>
                    <SelectItem value="emergency">เหตุฉุกเฉิน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>รายละเอียดการซ่อมบำรุง</Label>
                <Textarea placeholder="อธิบายรายละเอียดการซ่อมบำรุงที่จะดำเนินการ..." />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  แจ้งเตือนผู้ใช้งานล่วงหน้า
                </Label>
                <Label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  สำรองข้อมูลก่อนเข้าสู่โหมดซ่อมบำรุง
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "เข้าสู่โหมดซ่อมบำรุงสำเร็จ",
                    description: "เซิร์ฟเวอร์ได้เข้าสู่โหมดซ่อมบำรุงแล้ว",
                  });
                  setIsMaintenanceDialogOpen(false);
                }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  กำหนดการซ่อมบำรุง
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}