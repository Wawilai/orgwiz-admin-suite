import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  Shield,
  MoreHorizontal,
  Edit2,
  Trash2,
  Settings,
  FileText,
  Download,
  Activity,
  Save,
  Copy,
  Power,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'Firewall' | 'SSL/TLS' | 'Authentication' | 'Access Control';
  description: string;
  status: 'Enabled' | 'Disabled';
  lastModified: string;
  appliedTo: string[];
}

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

export function SecurityPolicyManagement() {
  const [policies] = useState<SecurityPolicy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<SecurityPolicy | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  const handleEditPolicy = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsEditDialogOpen(true);
  };

  const handleTogglePolicy = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsToggleDialogOpen(true);
  };

  const handleDeletePolicy = (policyId: string) => {
    toast({
      title: "ลบนโยบายสำเร็จ",
      description: "ลบนโยบายความปลอดภัยแล้ว",
    });
  };

  const handleClonePolicy = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsCloneDialogOpen(true);
  };

  const handleExportPolicy = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsExportDialogOpen(true);
  };

  const handleViewPolicyLog = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsLogDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Enabled: "default",
      Disabled: "secondary"
    };
    
    const statusText: Record<string, string> = {
      Enabled: "เปิดใช้งาน",
      Disabled: "ปิดใช้งาน"
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {statusText[status] || status}
      </Badge>
    );
  };

  const getPolicyTypeBadge = (type: string) => {
    const typeColors = {
      'Firewall': 'bg-red-100 text-red-800',
      'SSL/TLS': 'bg-green-100 text-green-800',
      'Authentication': 'bg-blue-100 text-blue-800',
      'Access Control': 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge variant="secondary" className={typeColors[type as keyof typeof typeColors]}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
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
                <TableHead>คำอธิบาย</TableHead>
                <TableHead>ใช้กับ</TableHead>
                <TableHead>แก้ไขล่าสุด</TableHead>
                <TableHead>สถ���นะ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div className="font-medium">{policy.name}</div>
                  </TableCell>
                  <TableCell>
                    {getPolicyTypeBadge(policy.type)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm">
                      {policy.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {policy.appliedTo.slice(0, 2).map((server, index) => (
                        <div key={index}>{server}</div>
                      ))}
                      {policy.appliedTo.length > 2 && (
                        <div className="text-muted-foreground">
                          +{policy.appliedTo.length - 2} อื่นๆ
                        </div>
                      )}
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
                        <DropdownMenuItem onClick={() => handleEditPolicy(policy)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          แก้ไขนโยบาย
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleTogglePolicy(policy)}>
                           <Settings className="mr-2 h-4 w-4" />
                           เปิด/ปิดการใช้งาน
                         </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClonePolicy(policy)}>
                          <FileText className="mr-2 h-4 w-4" />
                          ทำสำเนานโยบาย
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleExportPolicy(policy)}>
                           <Download className="mr-2 h-4 w-4" />
                           ส่งออกการตั้งค่า
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleViewPolicyLog(policy)}>
                           <Activity className="mr-2 h-4 w-4" />
                           ดูบันทึกการใช้งาน
                         </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePolicy(policy.id)} className="text-red-600">
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

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขนโยบายความปลอดภัย</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อนโยบาย</Label>
                <Input defaultValue={selectedPolicy.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ประเภทนโยบาย</Label>
                  <Select defaultValue={selectedPolicy.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Firewall">Firewall</SelectItem>
                      <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                      <SelectItem value="Authentication">Authentication</SelectItem>
                      <SelectItem value="Access Control">Access Control</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select defaultValue={selectedPolicy.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enabled">เปิดใช้งาน</SelectItem>
                      <SelectItem value="Disabled">ปิดใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>คำอธิบาย</Label>
                <Textarea defaultValue={selectedPolicy.description} />
              </div>
              <div className="space-y-2">
                <Label>ใช้กับเซิร์ฟเวอร์</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเซิร์ฟเวอร์" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Servers</SelectItem>
                    <SelectItem value="WEB-SRV-01">WEB-SRV-01</SelectItem>
                    <SelectItem value="DB-SRV-01">DB-SRV-01</SelectItem>
                    <SelectItem value="MAIL-SRV-01">MAIL-SRV-01</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>การตั้งค่านโยบาย</Label>
                <Textarea placeholder="กำหนดรายละเอียดการตั้งค่านโยบายความปลอดภัย..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "บันทึกการตั้งค่าสำเร็จ",
                    description: "แก้ไขนโยบายความปลอดภัยเรียบร้อยแล้ว",
                  });
                  setIsEditDialogOpen(false);
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกการตั้งค่า
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle Policy Dialog */}
      <Dialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เปลี่ยนสถานะนโยบาย</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Power className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedPolicy.name}</div>
                  <div className="text-sm text-muted-foreground">
                    สถานะปัจจุบัน: {selectedPolicy.status === 'Enabled' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>เปลี่ยนเป็นสถานะ</Label>
                <Select defaultValue={selectedPolicy.status === 'Enabled' ? 'Disabled' : 'Enabled'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enabled">เปิดใช้งาน</SelectItem>
                    <SelectItem value="Disabled">ปิดใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>เหตุผลในการเปลี่ยนแปลง</Label>
                <Textarea placeholder="อธิบายเหตุผลในการเปลี่ยนสถานะนโยบาย..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsToggleDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "เปลี่ยนสถานะสำเร็จ",
                    description: "เปลี่ยนสถานะนโยบายความปลอดภัยแล้ว",
                  });
                  setIsToggleDialogOpen(false);
                }}>
                  <Settings className="h-4 w-4 mr-2" />
                  เปลี่ยนสถานะ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clone Policy Dialog */}
      <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ทำสำเนานโยบายความปลอดภัย</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อนโยบายใหม่</Label>
                <Input defaultValue={`${selectedPolicy.name} (สำเนา)`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ประเภทนโยบาย</Label>
                  <Select defaultValue={selectedPolicy.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Firewall">Firewall</SelectItem>
                      <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                      <SelectItem value="Authentication">Authentication</SelectItem>
                      <SelectItem value="Access Control">Access Control</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>สถานะเริ่มต้น</Label>
                  <Select defaultValue="Disabled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enabled">เปิดใช้งานทันที</SelectItem>
                      <SelectItem value="Disabled">ปิดใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>คำอธิบาย</Label>
                <Textarea defaultValue={selectedPolicy.description} />
              </div>
              <div className="space-y-2">
                <Label>ใช้กับเซิร์ฟเวอร์</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเซิร์ฟเวอร์ใหม่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Servers</SelectItem>
                    <SelectItem value="WEB-SRV-01">WEB-SRV-01</SelectItem>
                    <SelectItem value="DB-SRV-01">DB-SRV-01</SelectItem>
                    <SelectItem value="MAIL-SRV-01">MAIL-SRV-01</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCloneDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "ทำสำเนาสำเร็จ",
                    description: "ทำสำเนานโยบายความปลอดภัยแล้ว",
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

      {/* Export Policy Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ส่งออกการตั้งค่านโยบาย</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileText className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedPolicy.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPolicy.type} • {selectedPolicy.status === 'Enabled' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>รูปแบบการส่งออก</Label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON Format</SelectItem>
                    <SelectItem value="xml">XML Format</SelectItem>
                    <SelectItem value="yaml">YAML Format</SelectItem>
                    <SelectItem value="txt">Text Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ตัวเลือกการส่งออก</Label>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    รวมการตั้งค่านโยบาย
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    รวมข้อมูลเซิร์ฟเวอร์ที่ใช้งาน
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    รวมบันทึกการใช้งาน
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    รวมข้อมูลการแก้ไข
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "ส่งออกสำเร็จ",
                    description: "ส่งออกการตั้งค่านโยบายความปลอดภัยแล้ว",
                  });
                  setIsExportDialogOpen(false);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออกไฟล์
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Policy Log Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>บันทึกการใช้งานนโยบาย</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Activity className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedPolicy.name}</div>
                  <div className="text-sm text-muted-foreground">
                    แก้ไขล่าสุด: {new Date(selectedPolicy.lastModified).toLocaleString('th-TH')}
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="space-y-2">
                <Label>บันทึกกิจกรรม</Label>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">นโยบายถูกเปิดใช้งาน</div>
                      <div className="text-muted-foreground">2024-01-20 10:30:00 • โดย Admin</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">ตรวจพบการละเมิดนโยบาย</div>
                      <div className="text-muted-foreground">2024-01-19 15:45:00 • IP: 192.168.1.100</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">แก้ไขการตั้งค่านโยบาย</div>
                      <div className="text-muted-foreground">2024-01-18 09:15:00 • โดย Security Team</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">นโยบายถูกสร้างขึ้น</div>
                      <div className="text-muted-foreground">2024-01-15 14:00:00 • โดย Admin</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">145</div>
                  <div className="text-sm text-green-700">การป้องกันสำเร็จ</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-yellow-700">การแจ้งเตือน</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-red-700">การละเมิด</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}