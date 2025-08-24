import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const { signIn, signUp, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Handle authentication callback from URL hash
  useEffect(() => {
    const hash = location.hash;
    if (hash.includes('access_token')) {
      console.log('Auth callback detected in URL hash');
      setAuthSuccess(true);
      toast.success("ยืนยันอีเมลสำเร็จ! กำลังเข้าสู่ระบบ...");
      
      // Clear the hash and redirect after a brief delay
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        if (isAuthenticated) {
          navigate("/dashboard", { replace: true });
        }
      }, 2000);
    } else if (hash.includes('error')) {
      const errorParam = new URLSearchParams(hash.substring(1)).get('error_description');
      setError(errorParam || 'เกิดข้อผิดพลาดในการยืนยันอีเมล');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.hash, isAuthenticated, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !location.hash.includes('access_token')) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, location.hash]);

  // Add helpful instructions
  const renderInstructions = () => (
    <Alert className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <strong>การใช้งาน 2FA (MFA):</strong>
        <ol className="mt-2 text-sm space-y-1">
          <li>1. เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน</li>
          <li>2. ไปที่เมนู "ตั้งค่าระบบ" → "ความปลอดภัย MFA"</li>
          <li>3. คลิก "เปิดใช้งาน MFA" และทำตามขั้นตอน</li>
        </ol>
      </AlertDescription>
    </Alert>
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error.message === "Invalid login credentials" 
          ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" 
          : error.message);
      } else {
        toast.success("เข้าสู่ระบบสำเร็จ");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password);
      if (error) {
        if (error.message.includes("already registered")) {
          setError("อีเมลนี้ถูกใช้งานแล้ว");
        } else {
          setError(error.message);
        }
      } else {
        toast.success("สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี");
        setActiveTab("signin");
        setFormData({ email: formData.email, password: "", confirmPassword: "" });
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  // Show success state while processing auth callback
  if (authSuccess) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="p-3 bg-success/10 rounded-full w-fit mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success">ยืนยันสำเร็จ!</h3>
                <p className="text-muted-foreground mt-2">
                  กำลังเข้าสู่ระบบ...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-lg">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Enterprise Admin</h1>
          <p className="text-muted-foreground mt-2">
            ระบบจัดการองค์กรแบบครบวงจร
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">เข้าสู่ระบบ</CardTitle>
            <CardDescription className="text-center">
              เข้าใช้งานระบบจัดการองค์กร
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="signup">สมัครสมาชิก</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderInstructions()}

              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">อีเมล</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">รหัสผ่าน</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || loading}
                  >
                    {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">อีเมล</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">รหัสผ่าน</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">ยืนยันรหัสผ่าน</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="ยืนยันรหัสผ่าน"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || loading}
                  >
                    {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>© 2024 Enterprise Admin System</p>
          <p>ระบบจัดการองค์กรแบบครบวงจร</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;