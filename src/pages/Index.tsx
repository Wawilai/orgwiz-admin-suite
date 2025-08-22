import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Shield, BarChart3, RefreshCw } from "lucide-react";
import OrganizationManagement from "./OrganizationManagement";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for auth callback in hash
    const hash = location.hash;
    if (hash.includes('access_token') || hash.includes('error')) {
      // Redirect to auth page to handle the callback
      navigate('/auth', { replace: true });
      return;
    }

    // Auto redirect authenticated users to dashboard
    if (isAuthenticated && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location.hash]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Show authenticated app
  if (isAuthenticated) {
    return (
      <Layout>
        <OrganizationManagement />
      </Layout>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Enterprise Admin</span>
          </div>
          <Button onClick={() => navigate("/auth")}>
            เข้าสู่ระบบ
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ระบบจัดการองค์กร
              <span className="text-primary block">แบบครบวงจร</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              จัดการผู้ใช้งาน องค์กร บทบาท และระบบความปลอดภัยทั้งหมดในที่เดียว
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")}>
                เริ่มใช้งาน
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
                เรียนรู้เพิ่มเติม
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">ฟีเจอร์หลัก</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ระบบครบครันสำหรับการจัดการองค์กรในยุคดิจิทัล
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>จัดการผู้ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  จัดการบัญชีผู้ใช้ บทบาท และสิทธิ์การเข้าถึงอย่างละเอียด
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Building2 className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>จัดการองค์กร</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ควบคุมโครงสร้างองค์กร แผนก และหน่วยงานต่างๆ
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>ความปลอดภัย</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ระบบรักษาความปลอดภัยขั้นสูงพร้อม MFA
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>รายงานและวิเคราะห์</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  รายงานการใช้งานและการวิเคราะห์แบบเรียลไทม์
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold">Enterprise Admin</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Enterprise Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
