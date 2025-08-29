import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  ShieldX,
  QrCode,
  Smartphone,
  Key,
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Factor } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";

interface MFAComponentProps {
  onMFAChange?: (enabled: boolean) => void;
}

export const MFAComponent = ({ onMFAChange }: MFAComponentProps) => {
  const { user, isAuthenticated } = useAuth();
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([]);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFactorId, setSelectedFactorId] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMFAFactors();
    }
  }, [isAuthenticated, user]);

  const loadMFAFactors = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error('Error loading MFA factors:', error);
        if (error.message !== 'Auth session missing!') {
          toast.error('ไม่สามารถโหลดข้อมูล MFA ได้');
        }
        return;
      }

      const factors = data?.totp || [];
      setMfaFactors(factors);
      
      // Notify parent component about MFA status
      const hasMFA = factors.some(factor => factor.status === 'verified');
      onMFAChange?.(hasMFA);
    } catch (error) {
      console.error('Error:', error);
      if (isAuthenticated) {
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    }
  };

  const setupMFA = async () => {
    if (!isAuthenticated || !user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนใช้งาน MFA');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Enterprise Admin',
        friendlyName: 'Authenticator App'
      });

      if (error) {
        toast.error('ไม่สามารถตั้งค่า MFA ได้: ' + error.message);
        return;
      }

      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setCurrentStep('verify');
      
    } catch (error) {
      console.error('Setup MFA error:', error);
      toast.error('เกิดข้อผิดพลาดในการตั้งค่า MFA');
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('กรุณาใส่รหัส 6 หลักที่ถูกต้อง');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: factorId,
        challengeId: factorId,
        code: verificationCode
      });

      if (error) {
        toast.error('รหัสยืนยันไม่ถูกต้อง');
        return;
      }

      generateBackupCodes();
      setCurrentStep('complete');
      toast.success('ตั้งค่า MFA สำเร็จแล้ว!');
      
    } catch (error) {
      console.error('Verify MFA error:', error);
      toast.error('เกิดข้อผิดพลาดในการยืนยัน MFA');
    } finally {
      setLoading(false);
    }
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Array.from({ length: 8 }, () => 
        Math.floor(Math.random() * 36).toString(36).toUpperCase()
      ).join('');
      codes.push(code);
    }
    setBackupCodes(codes);
  };

  const disableMFA = async (factorId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: factorId
      });

      if (error) {
        toast.error('ไม่สามารถปิดใช้งาน MFA ได้: ' + error.message);
        return;
      }

      toast.success('ปิดใช้งาน MFA สำเร็จแล้ว');
      setIsDisableDialogOpen(false);
      await loadMFAFactors();
      
    } catch (error) {
      console.error('Disable MFA error:', error);
      toast.error('เกิดข้อผิดพลาดในการปิดใช้งาน MFA');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('คัดลอกแล้ว');
  };

  const resetSetup = () => {
    setCurrentStep('setup');
    setQrCode('');
    setSecret('');
    setFactorId('');
    setVerificationCode('');
    setBackupCodes([]);
  };

  const handleSetupComplete = async () => {
    setIsSetupDialogOpen(false);
    resetSetup();
    await loadMFAFactors();
  };

  const hasMFA = mfaFactors.some(factor => factor.status === 'verified');

  return (
    <div className="space-y-4">
      {/* MFA Status Display */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          {hasMFA ? (
            <ShieldCheck className="h-5 w-5 text-success" />
          ) : (
            <ShieldX className="h-5 w-5 text-destructive" />
          )}
          <div>
            <div className="font-medium">การยืนยันตัวตนหลายขั้นตอน (MFA)</div>
            <div className="text-sm text-muted-foreground">
              {hasMFA 
                ? `เปิดใช้งานแล้ว - ${mfaFactors.filter(f => f.status === 'verified').length} อุปกรณ์`
                : 'ยังไม่ได้เปิดใช้งาน'
              }
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={hasMFA ? "default" : "destructive"}>
            {hasMFA ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งาน'}
          </Badge>
          
          {!hasMFA ? (
            <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetSetup}>
                  <Shield className="h-4 w-4 mr-2" />
                  เปิดใช้งาน
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    ตั้งค่า MFA
                  </DialogTitle>
                  <DialogDescription>
                    {currentStep === 'setup' && 'เริ่มต้นการตั้งค่าการยืนยันตัวตนสองขั้นตอน'}
                    {currentStep === 'verify' && 'สแกน QR Code และยืนยันรหัส'}
                    {currentStep === 'complete' && 'ตั้งค่า MFA เสร็จสมบูรณ์'}
                  </DialogDescription>
                </DialogHeader>

                {/* Setup Step */}
                {currentStep === 'setup' && (
                  <div className="space-y-4">
                    <Alert>
                      <Smartphone className="h-4 w-4" />
                      <AlertTitle>เตรียมแอปยืนยันตัวตน</AlertTitle>
                      <AlertDescription>
                        คุณจะต้องใช้แอปเช่น Google Authenticator, Authy หรือ Microsoft Authenticator
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsSetupDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={setupMFA} disabled={loading}>
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            กำลังตั้งค่า...
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4 mr-2" />
                            เริ่มตั้งค่า
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Verify Step */}
                {currentStep === 'verify' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        สแกน QR Code ด้วยแอปยืนยันตัวตน
                      </p>
                      
                      <div className="bg-muted p-3 rounded-md">
                        <Label className="text-xs">หรือใส่รหัสด้วยตนเอง:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm font-mono">{secret}</code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(secret)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>รหัสยืนยัน 6 หลัก</Label>
                      <Input
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetSetup}>
                        ย้อนกลับ
                      </Button>
                      <Button onClick={verifyMFA} disabled={loading || verificationCode.length !== 6}>
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            กำลังยืนยัน...
                          </>
                        ) : (
                          'ยืนยัน'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Complete Step */}
                {currentStep === 'complete' && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>ตั้งค่า MFA สำเร็จ!</AlertTitle>
                      <AlertDescription>
                        บัญชีของคุณได้รับการปกป้องด้วย MFA แล้ว
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        <Label className="font-medium">รหัสสำรอง (Backup Codes)</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        เก็บรหัสเหล่านี้ไว้ในที่ปลอดภัย ใช้ในกรณีที่เข้าถึงแอปยืนยันตัวตนไม่ได้
                      </p>
                      <div className="bg-muted p-3 rounded-md space-y-1">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <code className="text-sm font-mono">{code}</code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSetupComplete}>
                        เสร็จสิ้น
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <ShieldX className="h-4 w-4 mr-2" />
                  ปิดใช้งาน
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    ปิดใช้งาน MFA
                  </DialogTitle>
                  <DialogDescription>
                    คุณแน่ใจหรือไม่ที่จะปิดใช้งาน MFA? การดำเนินการนี้จะลดความปลอดภัยของบัญชี
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>คำเตือน</AlertTitle>
                    <AlertDescription>
                      การปิดใช้งาน MFA จะทำให้บัญชีของคุณมีความเสี่ยงสูงขึ้น
                    </AlertDescription>
                  </Alert>
                  
                  {mfaFactors.filter(f => f.status === 'verified').map((factor) => (
                    <div key={factor.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{factor.friendly_name}</div>
                          <div className="text-sm text-muted-foreground">
                            สร้างเมื่อ: {new Date(factor.created_at).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => disableMFA(factor.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            'ลบ'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDisableDialogOpen(false)}>
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};