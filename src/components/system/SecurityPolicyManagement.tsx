import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
  Activity
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

  const handleEditPolicy = (policy: SecurityPolicy) => {
    toast({
      title: "แก้ไขนโยบาย",
      description: "เปิดหน้าต่างแก้ไขนโยบายความปลอดภัย",
    });
  };

  const handleTogglePolicy = (policyId: string) => {
    toast({
      title: "เปลี่ยนสถานะนโยบาย",
      description: "เปลี่ยนสถานะการใช้งานนโยบายความปลอดภัย",
    });
  };

  const handleDeletePolicy = (policyId: string) => {
    toast({
      title: "ลบนโยบายสำเร็จ",
      description: "ลบนโยบายความปลอดภัยแล้ว",
    });
  };

  const handleClonePolicy = (policy: SecurityPolicy) => {
    toast({
      title: "ทำสำเนานโยบาย",
      description: "ทำสำเนานโยบายความปลอดภัยแล้ว",
    });
  };

  const handleExportPolicy = (policyId: string) => {
    toast({
      title: "ส่งออกนโยบาย",
      description: "ส่งออกการตั้งค่านโยบายความปลอดภัยแล้ว",
    });
  };

  const handleViewPolicyLog = (policyId: string) => {
    toast({
      title: "ดูบันทึกนโยบาย",
      description: "เปิดหน้าต่างบันทึกการใช้งานนโยบาย",
    });
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
                        <DropdownMenuItem onClick={() => handleTogglePolicy(policy.id)}>
                          <Settings className="mr-2 h-4 w-4" />
                          เปิด/ปิดการใช้งาน
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClonePolicy(policy)}>
                          <FileText className="mr-2 h-4 w-4" />
                          ทำสำเนานโยบาย
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportPolicy(policy.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          ส่งออกการตั้งค่า
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewPolicyLog(policy.id)}>
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
    </div>
  );
}