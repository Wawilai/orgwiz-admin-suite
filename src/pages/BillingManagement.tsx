import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Download, 
  TrendingUp,
  Calendar,
  Building,
  Banknote
} from 'lucide-react';

interface BillingAccount {
  id: string;
  organization_id: string;
  account_name: string;
  billing_email: string;
  billing_address?: string;
  payment_method?: string;
  currency: string;
  status: string;
  payment_terms?: number;
  tax_rate?: number;
  organizations?: { name: string };
}

const BillingManagement = () => {
  const { isAuthenticated } = useAuth();
  const [billingAccounts, setBillingAccounts] = useState<BillingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('accounts');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBillingAccounts();
    }
  }, [isAuthenticated]);

  const fetchBillingAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('billing_accounts')
        .select(`
          *,
          organizations!billing_accounts_organization_id_fkey (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBillingAccounts(data || []);
    } catch (error) {
      console.error('Error fetching billing accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = billingAccounts.filter(account => 
    account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.billing_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.organizations?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive'
    } as const;
    
    const labels = {
      active: 'ใช้งาน',
      inactive: 'ไม่ใช้งาน', 
      suspended: 'ระงับการใช้งาน'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method?: string) => {
    if (!method) return <Banknote className="h-4 w-4" />;
    
    switch (method.toLowerCase()) {
      case 'credit_card':
      case 'creditcard':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building className="h-4 w-4" />;
      default:
        return <Banknote className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">จัดการการเงินและบัญชี</h1>
            <p className="text-muted-foreground">ติดตามบัญชีการเงินและการตั้งค่าการเก็บเงิน</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มบัญชี
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มบัญชีการเงินใหม่</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    เพิ่มบัญชีการเงินใหม่สำหรับองค์กร
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">ยกเลิก</Button>
                  <Button>เพิ่มบัญชี</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="accounts">บัญชีการเงิน</TabsTrigger>
          <TabsTrigger value="settings">ตั้งค่าการเก็บเงิน</TabsTrigger>
          <TabsTrigger value="reports">รายงาน</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">บัญชีทั้งหมด</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{billingAccounts.length}</div>
                <p className="text-xs text-muted-foreground">บัญชีการเงิน</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">บัญชีใช้งาน</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {billingAccounts.filter(acc => acc.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">บัญชีที่ใช้งานอยู่</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">สกุลเงิน</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">THB</div>
                <p className="text-xs text-muted-foreground">สกุลเงินหลัก</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">อัตราภาษี</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7%</div>
                <p className="text-xs text-muted-foreground">ภาษีมูลค่าเพิ่ม</p>
              </CardContent>
            </Card>
          </div>

          {/* Billing Accounts Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายการบัญชีการเงิน</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาชื่อบัญชี อีเมล หรือองค์กร..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อบัญชี</TableHead>
                    <TableHead>องค์กร</TableHead>
                    <TableHead>อีเมลใบแจ้งหนี้</TableHead>
                    <TableHead>วิธีการชำระ</TableHead>
                    <TableHead>สกุลเงิน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>เงื่อนไขการชำระ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.account_name}
                      </TableCell>
                      <TableCell>
                        {account.organizations?.name || 'ไม่ระบุ'}
                      </TableCell>
                      <TableCell>
                        {account.billing_email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(account.payment_method)}
                          <span>{account.payment_method || 'ไม่ระบุ'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{account.currency}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(account.status)}
                      </TableCell>
                      <TableCell>
                        {account.payment_terms ? `${account.payment_terms} วัน` : 'ไม่ระบุ'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAccounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีบัญชีการเงินในระบบ'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าการเก็บเงิน</CardTitle>
              <p className="text-sm text-muted-foreground">
                จัดการการตั้งค่าการเก็บเงินและอัตราภาษี
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>อัตราภาษีมูลค่าเพิ่ม</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value="7" readOnly />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div>
                  <Label>สกุลเงินหลัก</Label>
                  <Select defaultValue="THB">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="THB">บาทไทย (THB)</SelectItem>
                      <SelectItem value="USD">ดอลลาร์สหรัฐ (USD)</SelectItem>
                      <SelectItem value="EUR">ยูโร (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>เงื่อนไขการชำระเงิน (วัน)</Label>
                  <Input className="mt-1" defaultValue="30" type="number" />
                </div>
                <div>
                  <Label>รอบการเรียกเก็บเงิน</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">รายเดือน</SelectItem>
                      <SelectItem value="quarterly">รายไตรมาส</SelectItem>
                      <SelectItem value="yearly">รายปี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button>บันทึกการตั้งค่า</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>รายงานการเงิน</CardTitle>
              <p className="text-sm text-muted-foreground">
                ดูรายงานการเงินและการชำระเงินต่างๆ
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">รายงานรายได้</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    รายงานรายได้รายเดือนและรายปี
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    ดาวน์โหลด
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">รายงานลูกค้า</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    รายงานการชำระเงินของลูกค้า
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    ดาวน์โหลด
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Banknote className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">รายงานภาษี</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    รายงานภาษีมูลค่าเพิ่ม
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    ดาวน์โหลด
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingManagement;