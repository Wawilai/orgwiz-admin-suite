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
  User
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Factor } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const MFASettings = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
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
    loadMFAFactors();
  }, []);

  const loadMFAFactors = async () => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, skipping MFA factors loading');
      return;
    }

    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error('Error loading MFA factors:', error);
        if (error.message !== 'Auth session missing!') {
          toast.error('ไม่สามารถโหลดข้อมูล MFA ได้');
        }
        return;
      }

      setMfaFactors(data?.totp || []);
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

      // Generate backup codes
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
    // Generate 8 backup codes (8 characters each)
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

  const hasMFA = mfaFactors.some(factor => factor.status === 'verified');

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">การรักษาความปลอดภัยสองขั้นตอน</h1>
          <p className="text-muted-foreground mt-1">
            เพิ่มความปลอดภัยให้กับบัญชีของคุณด้วยการยืนยันตัวตนสองขั้นตอน
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="p-3 bg-muted rounded-full w-fit mx-auto">
                <ShieldX className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">จำเป็นต้องเข้าสู่ระบบ</h3>
                <p className="text-muted-foreground mt-2">
                  กรุณาเข้าสู่ระบบก่อนจึงจะสามารถใช้งานฟีเจอร์ MFA ได้
                </p>
              </div>
              <Link to="/auth">
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">การรักษาความปลอดภัยสองขั้นตอน</h1>
        <p className="text-muted-foreground mt-1">
          เพิ่มความปลอดภัยให้กับบัญชีของคุณด้วยการยืนยันตัวตนสองขั้นตอน
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasMFA ? (
              <>
                <ShieldCheck className="h-5 w-5 text-success" />
                สถานะ MFA
              </>
            ) : (
              <>
                <ShieldX className="h-5 w-5 text-destructive" />
                สถานะ MFA
              </>
            )}
          </CardTitle>
          <CardDescription>
            {hasMFA 
              ? 'บัญชีของคุณได้รับการปกป้องด้วย MFA แล้ว'
              : 'บัญชีของคุณยังไม่ได้เปิดใช้งาน MFA'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge 
                variant={hasMFA ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {hasMFA ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    เปิดใช้งานแล้ว
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    ปิดใช้งาน
                  </>
                )}
              </Badge>
              {hasMFA && (
                <span className="text-sm text-muted-foreground">
                  จำนวนอุปกรณ์: {mfaFactors.filter(f => f.status === 'verified').length}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!hasMFA ? (
                <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetSetup}>
                      <Shield className="h-4 w-4 mr-2" />
                      เปิดใช้งาน MFA
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(backupCodes.join('\n'))}
                            className="w-full"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            คัดลอกรหัสทั้งหมด
                          </Button>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={() => {
                            setIsSetupDialogOpen(false);
                            loadMFAFactors();
                            resetSetup();
                          }}>
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
                    <Button variant="destructive">
                      <ShieldX className="h-4 w-4 mr-2" />
                      ปิดใช้งาน MFA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        ปิดใช้งาน MFA
                      </DialogTitle>
                      <DialogDescription>
                        การปิดใช้งาน MFA จะลดความปลอดภัยของบัญชีคุณ คุณแน่ใจหรือไม่?
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>คำเตือน</AlertTitle>
                      <AlertDescription>
                        หลังจากปิดใช้งาน MFA แล้ว คุณจะสามารถเข้าสู่ระบบได้ด้วยรหัสผ่านเพียงอย่างเดียว
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDisableDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          const verifiedFactor = mfaFactors.find(f => f.status === 'verified');
                          if (verifiedFactor) {
                            disableMFA(verifiedFactor.id);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            กำลังปิดใช้งาน...
                          </>
                        ) : (
                          'ปิดใช้งาน MFA'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MFA Devices */}
      {hasMFA && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              อุปกรณ์ที่ได้รับการยืนยัน
            </CardTitle>
            <CardDescription>
              รายการอุปกรณ์ที่ใช้สำหรับการยืนยันตัวตน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mfaFactors.filter(factor => factor.status === 'verified').map((factor) => (
                <div key={factor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Smartphone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">
                        เพิ่มเมื่อ {new Date(factor.created_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    ยืนยันแล้ว
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            คำแนะนำด้านความปลอดภัย
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">เก็บรหัสสำรองไว้ในที่ปลอดภัยและแยกจากอุปกรณ์หลัก</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">อย่าแชร์รหัสยืนยันหรือรหัสสำรองกับผู้อื่น</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">ตรวจสอบให้แน่ใจว่าแอปยืนยันตัวตนของคุณได้รับการสำรองข้อมูลแล้ว</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">หากสูญเสียการเข้าถึงแอปยืนยันตัวตน ให้ใช้รหัสสำรองในการเข้าสู่ระบบ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFASettings;