import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  Download,
  Save,
  Copy,
  RefreshCw
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

export function BackupManagement() {
  const { isAuthenticated } = useAuth();
  const [backups, setBackups] = useState<BackupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddBackupDialogOpen, setIsAddBackupDialogOpen] = useState(false);
  const [isEditBackupDialogOpen, setIsEditBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [isBackupLogDialogOpen, setIsBackupLogDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupSchedule | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackups();
    }
  }, [isAuthenticated]);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      // Since we don't have a backup_schedules table yet, we'll use mock data for now
      // In a real implementation, you would fetch from a backup_schedules table
      const mockData: BackupSchedule[] = [
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
      setBackups(mockData);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setIsEditBackupDialogOpen(true);
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

  const handleRestoreBackup = (backup: BackupSchedule) => {
    setSelectedBackup(backup);
    setIsRestoreDialogOpen(true);
  };

  const handleCloneBackup = (backup: BackupSchedule) => {
    setSelectedBackup(backup);
    setIsCloneDialogOpen(true);
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
          {loading ? (
            <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
          ) : (
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
                         <DropdownMenuItem onClick={() => handleRestoreBackup(backup)}>
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
          )}
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

      {/* Edit Backup Dialog */}
      <Dialog open={isEditBackupDialogOpen} onOpenChange={setIsEditBackupDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขกำหนดการสำรองข้อมูล</DialogTitle>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อกำหนดการ</Label>
                <Input defaultValue={selectedBackup.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ประเภท Backup</Label>
                  <Select defaultValue={selectedBackup.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full Backup</SelectItem>
                      <SelectItem value="Incremental">Incremental Backup</SelectItem>
                      <SelectItem value="Differential">Differential Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ความถี่</Label>
                  <Select defaultValue={selectedBackup.frequency}>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>เซิร์ฟเวอร์เป้าหมาย</Label>
                  <Select defaultValue={selectedBackup.targetServers[0]}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEB-SRV-01">WEB-SRV-01</SelectItem>
                      <SelectItem value="DB-SRV-01">DB-SRV-01</SelectItem>
                      <SelectItem value="MAIL-SRV-01">MAIL-SRV-01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select defaultValue={selectedBackup.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">ใช้งาน</SelectItem>
                      <SelectItem value="Paused">หยุดชั่วคราว</SelectItem>
                      <SelectItem value="Failed">ล้มเหลว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ปลายทางการจัดเก็บ</Label>
                  <Input defaultValue={selectedBackup.destination} />
                </div>
                <div className="space-y-2">
                  <Label>เก็บไว้ (วัน)</Label>
                  <Input type="number" defaultValue={selectedBackup.retention} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>เวลาที่ทำการสำรอง</Label>
                <Input type="time" defaultValue="02:00" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditBackupDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "บันทึกการตั้งค่าสำเร็จ",
                    description: "แก้ไขกำหนดการสำรองข้อมูลเรียบร้อยแล้ว",
                  });
                  setIsEditBackupDialogOpen(false);
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกการตั้งค่า
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore Backup Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>คืนข้อมูลจากการสำรอง</DialogTitle>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">คำเตือน</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  การคืนข้อมูลจะเขียนทับข้อมูลปัจจุบัน กรุณาตรวจสอบข้อมูลให้แน่ใจ
                </p>
              </div>

              <div className="space-y-2">
                <Label>ข้อมูลการสำรอง</Label>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ชื่อกำหนดการ:</span>
                      <p>{selectedBackup.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">ประเภท:</span>
                      <p>{selectedBackup.type}</p>
                    </div>
                    <div>
                      <span className="font-medium">การสำรองล่าสุด:</span>
                      <p>{new Date(selectedBackup.lastBackup).toLocaleString('th-TH')}</p>
                    </div>
                    <div>
                      <span className="font-medium">ขนาดไฟล์:</span>
                      <p>{selectedBackup.size}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>เลือกจุดคืนข้อมูล</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกจุดคืนข้อมูล" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">การสำรองล่าสุด - {new Date(selectedBackup.lastBackup).toLocaleString('th-TH')}</SelectItem>
                    <SelectItem value="previous">การสำรองก่อนหน้า - 2024-01-24 02:00:00</SelectItem>
                    <SelectItem value="week">การสำรองสัปดาห์ที่แล้ว - 2024-01-21 02:00:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ตัวเลือกการคืนข้อมูล</Label>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    คืนข้อมูลไฟล์ระบบ
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    คืนข้อมูลฐานข้อมูล
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    คืนข้อมูลการตั้งค่า
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    สร้างสำเนาสำรองก่อนคืนข้อมูล
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "เริ่มการคืนข้อมูลสำเร็จ",
                    description: "กำลังดำเนินการคืนข้อมูลจากการสำรอง",
                  });
                  setIsRestoreDialogOpen(false);
                }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  เริ่มคืนข้อมูล
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clone Backup Dialog */}
      <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ทำสำเนากำหนดการสำรองข้อมูล</DialogTitle>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อกำหนดการใหม่</Label>
                <Input defaultValue={`${selectedBackup.name} (สำเนา)`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ประเภท Backup</Label>
                  <Select defaultValue={selectedBackup.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full Backup</SelectItem>
                      <SelectItem value="Incremental">Incremental Backup</SelectItem>
                      <SelectItem value="Differential">Differential Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ความถี่</Label>
                  <Select defaultValue={selectedBackup.frequency}>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>เซิร์ฟเวอร์เป้าหมาย</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกเซิร์ฟเวอร์ใหม่" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEB-SRV-01">WEB-SRV-01</SelectItem>
                      <SelectItem value="DB-SRV-01">DB-SRV-01</SelectItem>
                      <SelectItem value="MAIL-SRV-01">MAIL-SRV-01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>สถานะเริ่มต้น</Label>
                  <Select defaultValue="Paused">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">ใช้งานทันที</SelectItem>
                      <SelectItem value="Paused">หยุดชั่วคราว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ปลายทางการจัดเก็บ</Label>
                  <Input defaultValue={selectedBackup.destination.replace('/', '/clone/')} />
                </div>
                <div className="space-y-2">
                  <Label>เก็บไว้ (วัน)</Label>
                  <Input type="number" defaultValue={selectedBackup.retention} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>เวลาที่ทำการสำรอง</Label>
                <Input type="time" defaultValue="03:00" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCloneDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  const clonedBackup = {
                    ...selectedBackup,
                    id: Date.now().toString(),
                    name: `${selectedBackup.name} (สำเนา)`,
                    status: 'Paused' as const
                  };
                  setBackups([...backups, clonedBackup]);
                  toast({
                    title: "ทำสำเนาสำเร็จ",
                    description: "ทำสำเนากำหนดการสำรองข้อมูลแล้ว",
                  });
                  setIsCloneDialogOpen(false);
                }}>
                  <Copy className="h-4 w-4 mr-2" />
                  ทำสำเนา
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}