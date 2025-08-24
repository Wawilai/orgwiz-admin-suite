import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Trash2,
  Info,
  Server,
  Shield,
  Calendar,
  HardDrive,
  Lock
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

export function CertificateManagement() {
  const { isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCertificates();
    }
  }, [isAuthenticated]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      // Since we don't have a certificates table yet, we'll use mock data for now
      // In a real implementation, you would fetch from a certificates table
      const mockData: Certificate[] = [
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
      setCertificates(mockData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isCertRenewDialogOpen, setIsCertRenewDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

  const handleDownloadCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDownloadDialogOpen(true);
  };

  const handleRenewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsCertRenewDialogOpen(true);
  };

  const handleRevokeCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsRevokeDialogOpen(true);
  };

  const handleExportCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsExportDialogOpen(true);
  };

  const handleViewCertificateDetail = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDetailDialogOpen(true);
  };

  const handleInstallCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsInstallDialogOpen(true);
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
          {loading ? (
            <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
          ) : (
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
                           <DropdownMenuItem onClick={() => handleDownloadCertificate(cert)}>
                             <Download className="mr-2 h-4 w-4" />
                             ดาวน์โหลดใบรับรอง
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleExportCertificate(cert)}>
                             <Download className="mr-2 h-4 w-4" />
                             ส่งออก PEM
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleInstallCertificate(cert)}>
                             <Settings className="mr-2 h-4 w-4" />
                             ติดตั้งใบรับรอง
                           </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRenewCertificate(cert)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            ต่ออายุ
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleRevokeCertificate(cert)} className="text-red-600">
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
          )}
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

      {/* Certificate Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              รายละเอียดใบรับรอง
            </DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>โดเมน</Label>
                  <p className="font-medium">{selectedCertificate.domain}</p>
                </div>
                <div>
                  <Label>ผู้ออกใบรับรอง</Label>
                  <p>{selectedCertificate.issuer}</p>
                </div>
                <div>
                  <Label>ประเภทใบรับรอง</Label>
                  <p>{selectedCertificate.type}</p>
                </div>
                <div>
                  <Label>สถานะ</Label>
                  {getStatusBadge(selectedCertificate.status)}
                </div>
                <div>
                  <Label>วันที่มีผล</Label>
                  <p>{selectedCertificate.validFrom}</p>
                </div>
                <div>
                  <Label>วันหมดอายุ</Label>
                  <p>{selectedCertificate.validTo}</p>
                </div>
                <div>
                  <Label>อัลกอริทึม</Label>
                  <p>{selectedCertificate.algorithm}</p>
                </div>
                <div>
                  <Label>ขนาดคีย์</Label>
                  <p>{selectedCertificate.keySize} bits</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2">
                <Label>รายละเอียดเพิ่มเติม</Label>
                <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                  <div>Subject: CN={selectedCertificate.domain}</div>
                  <div>Issuer: CN={selectedCertificate.issuer}</div>
                  <div>Serial Number: A1:B2:C3:D4:E5:F6</div>
                  <div>Signature Algorithm: sha256WithRSAEncryption</div>
                  <div>Public Key Algorithm: {selectedCertificate.algorithm}</div>
                  <div>Public Key Size: {selectedCertificate.keySize} bits</div>
                </div>
              </div>

              {/* Extensions */}
              <div className="space-y-2">
                <Label>Extensions</Label>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <div>• Subject Alternative Names: {selectedCertificate.domain}, www.{selectedCertificate.domain}</div>
                  <div>• Key Usage: Digital Signature, Key Encipherment</div>
                  <div>• Extended Key Usage: Server Authentication</div>
                  <div>• Certificate Policies: Domain Validated</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Download Certificate Dialog */}
      <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              ดาวน์โหลดใบรับรอง
            </DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Key className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedCertificate.domain}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCertificate.type} • {selectedCertificate.issuer}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>รูปแบบไฟล์</Label>
                <Select defaultValue="pem">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pem">PEM Format (.pem)</SelectItem>
                    <SelectItem value="crt">Certificate (.crt)</SelectItem>
                    <SelectItem value="cer">Certificate (.cer)</SelectItem>
                    <SelectItem value="p12">PKCS#12 (.p12)</SelectItem>
                    <SelectItem value="pfx">PFX (.pfx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ตัวเลือกการดาวน์โหลด</Label>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    ใบรับรองหลัก
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    ใบรับรองกลาง (Intermediate)
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Private Key
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    Certificate Chain
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDownloadDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "ดาวน์โหลดสำเร็จ",
                    description: "ดาวน์โหลดไฟล์ใบรับรองแล้ว",
                  });
                  setIsDownloadDialogOpen(false);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export PEM Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ส่งออกใบรับรองรูปแบบ PEM</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileText className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedCertificate.domain}</div>
                  <div className="text-sm text-muted-foreground">
                    ส่งออกในรูปแบบ PEM
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>ประเภทการส่งออก</Label>
                <Select defaultValue="cert-only">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cert-only">Certificate Only</SelectItem>
                    <SelectItem value="cert-chain">Certificate + Chain</SelectItem>
                    <SelectItem value="full-chain">Full Chain</SelectItem>
                    <SelectItem value="cert-key">Certificate + Private Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>การเข้ารหัส</Label>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input type="radio" name="encryption" value="none" defaultChecked />
                    ไม่เข้ารหัส
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="radio" name="encryption" value="password" />
                    ป้องกันด้วยรหัสผ่าน
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>รหัสผ่าน (หากต้องการ)</Label>
                <Input type="password" placeholder="ใส่รหัสผ่านสำหรับป้องกันไฟล์" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "ส่งออกสำเร็จ",
                    description: "ส่งออกใบรับรองรูปแบบ PEM แล้ว",
                  });
                  setIsExportDialogOpen(false);
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  ส่งออก PEM
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Install Certificate Dialog */}
      <Dialog open={isInstallDialogOpen} onOpenChange={setIsInstallDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              ติดตั้งใบรับรอง
            </DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Shield className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedCertificate.domain}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCertificate.type} Certificate
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>เซิร์ฟเวอร์เป้าหมาย</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเซิร์ฟเวอร์" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEB-SRV-01">WEB-SRV-01 (Apache)</SelectItem>
                    <SelectItem value="WEB-SRV-02">WEB-SRV-02 (Nginx)</SelectItem>
                    <SelectItem value="MAIL-SRV-01">MAIL-SRV-01 (Postfix)</SelectItem>
                    <SelectItem value="LB-SRV-01">LB-SRV-01 (HAProxy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>บริการที่ใช้งาน</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apache">Apache Web Server</SelectItem>
                    <SelectItem value="nginx">Nginx</SelectItem>
                    <SelectItem value="iis">IIS</SelectItem>
                    <SelectItem value="postfix">Postfix Mail Server</SelectItem>
                    <SelectItem value="dovecot">Dovecot IMAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>การตั้งค่าการติดตั้ง</Label>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    สำรองใบรับรองเดิมก่อนติดตั้ง
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    รีสตาร์ทบริการหลังติดตั้ง
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    ตั้งค่า Auto-renewal
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    ทดสอบการเชื่อมต่อหลังติดตั้ง
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>เส้นทางการติดตั้ง</Label>
                <Input defaultValue="/etc/ssl/certs/" />
              </div>

              <div className="space-y-2">
                <Label>หมายเหตุ</Label>
                <Textarea placeholder="บันทึกเพิ่มเติมเกี่ยวกับการติดตั้ง..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInstallDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "ติดตั้งสำเร็จ",
                    description: "ติดตั้งใบรับรองลงในเซิร์ฟเวอร์แล้ว",
                  });
                  setIsInstallDialogOpen(false);
                }}>
                  <Settings className="h-4 w-4 mr-2" />
                  ติดตั้งใบรับรอง
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Certificate Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              เพิกถอนใบรับรอง
            </DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">คำเตือน</span>
                </div>
                <p className="text-red-700 mt-1">
                  การเพิกถอนใบรับรองจะทำให้ใบรับรองนี้ไม่สามารถใช้งานได้อีก และไม่สามารถยกเลิกการเพิกถอนได้
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Lock className="h-5 w-5" />
                <div>
                  <div className="font-medium">{selectedCertificate.domain}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCertificate.issuer} • หมดอายุ: {selectedCertificate.validTo}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>เหตุผลในการเพิกถอน</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเหตุผล" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="key-compromise">Private Key ถูกบุกรุก</SelectItem>
                    <SelectItem value="ca-compromise">CA ถูกบุกรุก</SelectItem>
                    <SelectItem value="affiliation-changed">เปลี่ยนแปลงการใช้งาน</SelectItem>
                    <SelectItem value="superseded">ถูกแทนที่ด้วยใบรับรองใหม่</SelectItem>
                    <SelectItem value="cessation-of-operation">หยุดการใช้งาน</SelectItem>
                    <SelectItem value="certificate-hold">พักการใช้งานชั่วคราว</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>รายละเอียดเพิ่มเติม</Label>
                <Textarea placeholder="อธิบายเหตุผลและรายละเอียดการเพิกถอน..." />
              </div>

              <div className="space-y-2">
                <Label>วันที่มีผลการเพิกถอน</Label>
                <Input type="datetime-local" />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  แจ้งเตือนผู้ดูแลระบบ
                </Label>
                <Label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  อัปเดต CRL (Certificate Revocation List)
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsRevokeDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button variant="destructive" onClick={() => {
                  toast({
                    title: "เพิกถอนใบรับรองสำเร็จ",
                    description: "ดำเนินการเพิกถอนใบรับรองแล้ว",
                  });
                  setIsRevokeDialogOpen(false);
                }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  เพิกถอนใบรับรอง
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}