import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  Key,
  AlertTriangle,
  MoreHorizontal,
  FileText,
  Download,
  Settings,
  RefreshCw,
  Trash2
} from 'lucide-react';

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

export function CertificateManagement() {
  const [certificates] = useState<Certificate[]>(mockCertificates);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isCertRenewDialogOpen, setIsCertRenewDialogOpen] = useState(false);

  const handleDownloadCertificate = (certId: string) => {
    toast({
      title: "ดาวน์โหลดใบรับรอง",
      description: "ดาวน์โหลดไฟล์ใบรับรองแล้ว",
    });
  };

  const handleRenewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsCertRenewDialogOpen(true);
  };

  const handleRevokeCertificate = (certId: string) => {
    toast({
      title: "เพิกถอนใบรับรอง",
      description: "ดำเนินการเพิกถอนใบรับรองแล้ว",
    });
  };

  const handleExportCertificate = (certId: string) => {
    toast({
      title: "ส่งออกใบรับรอง",
      description: "ส่งออกใบรับรองในรูปแบบ PEM แล้ว",
    });
  };

  const handleViewCertificateDetail = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    toast({
      title: "รายละเอียดใบรับรอง",
      description: "เปิดหน้าต่างแสดงรายละเอียดใบรับรอง",
    });
  };

  const handleInstallCertificate = (certId: string) => {
    toast({
      title: "ติดตั้งใบรับรอง",
      description: "ติดตั้งใบรับรองลงในเซิร์ฟเวอร์แล้ว",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Valid: "default",
      Expired: "destructive",
      'Expiring Soon': "secondary",
      Revoked: "destructive"
    };
    
    const statusText: Record<string, string> = {
      Valid: "ใช้งานได้",
      Expired: "หมดอายุ",
      'Expiring Soon': "ใกล้หมดอายุ",
      Revoked: "ถูกเพิกถอน"
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {statusText[status] || status}
      </Badge>
    );
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
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
                          <DropdownMenuItem onClick={() => handleViewCertificateDetail(cert)}>
                            <FileText className="mr-2 h-4 w-4" />
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadCertificate(cert.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            ดาวน์โหลดใบรับรอง
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportCertificate(cert.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            ส่งออก PEM
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleInstallCertificate(cert.id)}>
                            <Settings className="mr-2 h-4 w-4" />
                            ติดตั้งใบรับรอง
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRenewCertificate(cert)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            ต่ออายุ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRevokeCertificate(cert.id)} className="text-red-600">
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

      {/* Certificate Renewal Dialog */}
      <Dialog open={isCertRenewDialogOpen} onOpenChange={setIsCertRenewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ต่ออายุใบรับรอง</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div>
                <Label>โดเมน</Label>
                <p className="font-medium">{selectedCertificate.domain}</p>
              </div>
              <div>
                <Label>วันหมดอายุปัจจุบัน</Label>
                <p>{selectedCertificate.validTo}</p>
              </div>
              <div className="space-y-2">
                <Label>ระยะเวลาต่ออายุ</Label>
                <Select defaultValue="1year">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">3 เดือน</SelectItem>
                    <SelectItem value="6months">6 เดือน</SelectItem>
                    <SelectItem value="1year">1 ปี</SelectItem>
                    <SelectItem value="2years">2 ปี</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCertRenewDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  setIsCertRenewDialogOpen(false);
                  toast({
                    title: "ส่งคำขอต่ออายุ",
                    description: "ส่งคำขอต่ออายุใบรับรองแล้ว",
                  });
                }}>
                  ต่ออายุ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}