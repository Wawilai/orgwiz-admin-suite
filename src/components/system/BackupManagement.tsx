import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Calendar,
  MoreHorizontal,
  Edit2,
  Trash2,
  Play,
  Square,
  Activity,
  FileText,
  Download
} from 'lucide-react';

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

export function BackupManagement() {
  const [backups, setBackups] = useState<BackupSchedule[]>(mockBackups);
  const [isAddBackupDialogOpen, setIsAddBackupDialogOpen] = useState(false);
  const [isBackupLogDialogOpen, setIsBackupLogDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupSchedule | null>(null);

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

  const handleEditBackup = (backup: BackupSchedule) => {
    setSelectedBackup(backup);
    toast({
      title: "แก้ไขกำหนดการ",
      description: "เปิดหน้าต่างแก้ไขกำหนดการสำรองข้อมูล",
    });
  };

  const handleViewBackupLog = (backup: BackupSchedule) => {
    setSelectedBackup(backup);
    setIsBackupLogDialogOpen(true);
  };

  const handleDeleteBackup = (backupId: string) => {
    setBackups(backups.filter(b => b.id !== backupId));
    toast({
      title: "ลบกำหนดการสำเร็จ",
      description: "ลบกำหนดการสำรองข้อมูลแล้ว",
    });
  };

  const handleRestoreBackup = (backupId: string) => {
    toast({
      title: "เริ่มการคืนข้อมูล",
      description: "กำลังดำเนินการคืนข้อมูลจากการสำรอง",
    });
  };

  const handleCloneBackup = (backup: BackupSchedule) => {
    const clonedBackup = {
      ...backup,
      id: Date.now().toString(),
      name: `${backup.name} (สำเนา)`,
      status: 'Paused' as const
    };
    setBackups([...backups, clonedBackup]);
    toast({
      title: "ทำสำเนาสำเร็จ",
      description: "ทำสำเนากำหนดการสำรองข้อมูลแล้ว",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Active: "default",
      Paused: "secondary",
      Failed: "destructive"
    };
    
    const statusText: Record<string, string> = {
      Active: "ใช้งาน",
      Paused: "หยุดชั่วคราว",
      Failed: "ล้มเหลว"
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {statusText[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
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
                  <Button>เพิ่มกำหนดการ</Button>
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
                <TableHead>การสำรองล่าสุด</TableHead>
                <TableHead>ขนาด</TableHead>
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
                      <div className="text-sm text-muted-foreground">{backup.destination}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{backup.type}</Badge>
                  </TableCell>
                  <TableCell>{backup.frequency}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {backup.targetServers.map((server, index) => (
                        <div key={index}>{server}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(backup.lastBackup).toLocaleString('th-TH')}</div>
                      <div className="text-muted-foreground">
                        Next: {new Date(backup.nextBackup).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{backup.size}</TableCell>
                  <TableCell>{getStatusBadge(backup.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditBackup(backup)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          แก้ไขกำหนดการ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewBackupLog(backup)}>
                          <Activity className="mr-2 h-4 w-4" />
                          ดูล็อกการสำรอง
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRestoreBackup(backup.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          คืนข้อมูล
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCloneBackup(backup)}>
                          <FileText className="mr-2 h-4 w-4" />
                          ทำสำเนา
                        </DropdownMenuItem>
                        {backup.status === 'Active' ? (
                          <DropdownMenuItem onClick={() => handlePauseBackup(backup.id)}>
                            <Square className="mr-2 h-4 w-4" />
                            หยุดชั่วคราว
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleRunBackup(backup.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            เริ่มสำรอง
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteBackup(backup.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบกำหนดการ
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

      {/* Backup Log Dialog */}
      <Dialog open={isBackupLogDialogOpen} onOpenChange={setIsBackupLogDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>บันทึกการสำรอง</DialogTitle>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4">
              <div>
                <Label>กำหนดการ: {selectedBackup.name}</Label>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
                  <div>2024-01-25 02:00:00 - เริ่มการสำรองข้อมูล</div>
                  <div>2024-01-25 02:00:15 - ตรวจสอบเซิร์ฟเวอร์เป้าหมาย</div>
                  <div>2024-01-25 02:00:30 - เริ่มการสำรองฐานข้อมูล</div>
                  <div>2024-01-25 02:15:45 - การสำรองเสร็จสิ้น</div>
                  <div>2024-01-25 02:16:00 - ตรวจสอบความสมบูรณ์</div>
                  <div>2024-01-25 02:16:15 - สำรองข้อมูลสำเร็จ</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}