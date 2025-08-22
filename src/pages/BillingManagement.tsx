import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Calculator,
  Banknote,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  organizationName: string;
  packageName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentMethod?: string;
  paidDate?: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PaymentSetting {
  id: string;
  organizationId: string;
  organizationName: string;
  paymentMethod: 'CreditCard' | 'BankTransfer' | 'PayPal';
  autoPayment: boolean;
  billingEmail: string;
  billingAddress: string;
  taxId?: string;
  creditCardLast4?: string;
  bankAccount?: string;
  createdAt: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    organizationId: 'org-001',
    organizationName: 'บริษัท เทคโนโลยี จำกัด',
    packageName: 'Standard Plan',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 799,
    tax: 55.93,
    totalAmount: 854.93,
    status: 'Paid',
    paymentMethod: 'CreditCard',
    paidDate: '2024-01-15',
    items: [
      {
        id: '1',
        description: 'Standard Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 799,
        totalPrice: 799
      }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    organizationId: 'org-002',
    organizationName: 'บริษัท การตลาด จำกัด',
    packageName: 'Basic Plan',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    amount: 299,
    tax: 20.93,
    totalAmount: 319.93,
    status: 'Pending',
    items: [
      {
        id: '1',
        description: 'Basic Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 299,
        totalPrice: 299
      }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    organizationId: 'org-003',
    organizationName: 'บริษัท ดิจิทัล จำกัด',
    packageName: 'Premium Plan',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    amount: 1499,
    tax: 104.93,
    totalAmount: 1603.93,
    status: 'Overdue',
    items: [
      {
        id: '1',
        description: 'Premium Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 1499,
        totalPrice: 1499
      }
    ]
  }
];

const mockPaymentSettings: PaymentSetting[] = [
  {
    id: '1',
    organizationId: 'org-001',
    organizationName: 'บริษัท เทคโนโลยี จำกัด',
    paymentMethod: 'CreditCard',
    autoPayment: true,
    billingEmail: 'billing@techcompany.com',
    billingAddress: '123 ถนนเทคโนโลยี กรุงเทพฯ 10110',
    taxId: '0105558001234',
    creditCardLast4: '1234',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    organizationId: 'org-002',
    organizationName: 'บริษัท การตลาด จำกัด',
    paymentMethod: 'BankTransfer',
    autoPayment: false,
    billingEmail: 'finance@marketing.com',
    billingAddress: '456 ถนนการตลาด กรุงเทพฯ 10220',
    taxId: '0105558005678',
    bankAccount: 'SCB-1234567890',
    createdAt: '2024-01-15'
  }
];

export default function BillingManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>(mockPaymentSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGenerateInvoiceDialogOpen, setIsGenerateInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [currentTab, setCurrentTab] = useState('invoices');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateInvoice = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      organizationId: 'org-new',
      organizationName: 'องค์กรใหม่',
      packageName: 'Standard Plan',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 799,
      tax: 55.93,
      totalAmount: 854.93,
      status: 'Pending',
      items: [
        {
          id: '1',
          description: 'Standard Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 799,
          totalPrice: 799
        }
      ]
    };
    setInvoices([newInvoice, ...invoices]);
    setIsGenerateInvoiceDialogOpen(false);
    toast({
      title: "สร้างใบแจ้งหนี้สำเร็จ",
      description: `สร้างใบแจ้งหนี้ ${newInvoice.invoiceNumber} เรียบร้อยแล้ว`,
    });
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === invoiceId
        ? { 
            ...invoice, 
            status: 'Paid' as const, 
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'CreditCard'
          }
        : invoice
    ));
    toast({
      title: "อัปเดตสถานะสำเร็จ",
      description: "ทำเครื่องหมายเป็นชำระแล้ว",
    });
  };

  const handleCancelInvoice = (invoiceId: string) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === invoiceId ? { ...invoice, status: 'Cancelled' as const } : invoice
    ));
    toast({
      title: "ยกเลิกใบแจ้งหนี้สำเร็จ",
      description: "ยกเลิกใบแจ้งหนี้เรียบร้อยแล้ว",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Pending: "outline",
      Paid: "default",
      Overdue: "destructive",
      Cancelled: "secondary"
    };
    const colors = {
      Pending: "text-yellow-700",
      Paid: "text-green-700",
      Overdue: "text-red-700",
      Cancelled: "text-gray-700"
    };
    const statusText = {
      Pending: "รอชำระ",
      Paid: "ชำระแล้ว",
      Overdue: "เกินกำหนด",
      Cancelled: "ยกเลิก"
    };
    return <Badge variant={variants[status] || "default"} className={colors[status as keyof typeof colors]}>
      {statusText[status as keyof typeof statusText]}
    </Badge>;
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodText = {
      CreditCard: "บัตรเครดิต",
      BankTransfer: "โอนผ่านธนาคาร",
      PayPal: "PayPal"
    };
    return <Badge variant="outline">{methodText[method as keyof typeof methodText]}</Badge>;
  };

  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">จัดการการเงินและบัญชี</h1>
            <p className="text-muted-foreground">ติดตามใบแจ้งหนี้ การชำระเงิน และตั้งค่าการเก็บเงิน</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </Button>
            <Dialog open={isGenerateInvoiceDialogOpen} onOpenChange={setIsGenerateInvoiceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  สร้างใบแจ้งหนี้
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>สร้างใบแจ้งหนี้ใหม่</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ระบบจะสร้างใบแจ้งหนี้อัตโนมัติตามแพ็กเกจและการสมัครสมาชิก
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsGenerateInvoiceDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleGenerateInvoice}>
                    สร้างใบแจ้งหนี้
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="invoices">ใบแจ้งหนี้</TabsTrigger>
          <TabsTrigger value="payments">การชำระเงิน</TabsTrigger>
          <TabsTrigger value="settings">ตั้งค่าการเก็บเงิน</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">฿{totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">รอชำระ</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">฿{pendingAmount.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">เกินกำหนด</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">฿{overdueAmount.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ใบแจ้งหนี้ทั้งหมด</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายการใบแจ้งหนี้</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาเลขใบแจ้งหนี้ หรือชื่อองค์กร..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="Pending">รอชำระ</SelectItem>
                    <SelectItem value="Paid">ชำระแล้ว</SelectItem>
                    <SelectItem value="Overdue">เกินกำหนด</SelectItem>
                    <SelectItem value="Cancelled">ยกเลิก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขใบแจ้งหนี้</TableHead>
                    <TableHead>องค์กร</TableHead>
                    <TableHead>แพ็กเกจ</TableHead>
                    <TableHead>วันที่ออก</TableHead>
                    <TableHead>กำหนดชำระ</TableHead>
                    <TableHead>จำนวนเงิน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.organizationName}</div>
                          <div className="text-sm text-muted-foreground">{invoice.organizationId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.packageName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {invoice.issueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {invoice.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">฿{invoice.totalAmount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            + ภาษี ฿{invoice.tax.toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(invoice.status)}
                          {invoice.paymentMethod && (
                            <div>{getPaymentMethodBadge(invoice.paymentMethod)}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="mr-2 h-4 w-4" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              ดาวน์โหลด PDF
                            </DropdownMenuItem>
                            {invoice.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                ทำเครื่องหมายว่าชำระแล้ว
                              </DropdownMenuItem>
                            )}
                            {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                              <DropdownMenuItem 
                                onClick={() => handleCancelInvoice(invoice.id)}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                ยกเลิก
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่ชำระ</TableHead>
                    <TableHead>เลขใบแจ้งหนี้</TableHead>
                    <TableHead>องค์กร</TableHead>
                    <TableHead>จำนวนเงิน</TableHead>
                    <TableHead>วิธีการชำระ</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.filter(inv => inv.status === 'Paid').map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {invoice.paidDate}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.organizationName}</TableCell>
                      <TableCell>฿{invoice.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        {invoice.paymentMethod && getPaymentMethodBadge(invoice.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          สำเร็จ
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าการชำระเงิน</CardTitle>
              <p className="text-sm text-muted-foreground">
                จัดการวิธีการชำระเงินและข้อมูลการเรียกเก็บเงินขององค์กร
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>องค์กร</TableHead>
                    <TableHead>วิธีการชำระ</TableHead>
                    <TableHead>อีเมลใบแจ้งหนี้</TableHead>
                    <TableHead>ที่อยู่เรียกเก็บเงิน</TableHead>
                    <TableHead>เลขประจำตัวผู้เสียภาษี</TableHead>
                    <TableHead>ชำระอัตโนมัติ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>
                        <div className="font-medium">{setting.organizationName}</div>
                        <div className="text-sm text-muted-foreground">{setting.organizationId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getPaymentMethodBadge(setting.paymentMethod)}
                          {setting.creditCardLast4 && (
                            <div className="text-xs text-muted-foreground">**** {setting.creditCardLast4}</div>
                          )}
                          {setting.bankAccount && (
                            <div className="text-xs text-muted-foreground">{setting.bankAccount}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{setting.billingEmail}</TableCell>
                      <TableCell className="max-w-xs truncate">{setting.billingAddress}</TableCell>
                      <TableCell>{setting.taxId}</TableCell>
                      <TableCell>
                        {setting.autoPayment ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            เปิดใช้งาน
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <XCircle className="h-3 w-3 mr-1" />
                            ปิดใช้งาน
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              แก้ไขการชำระเงิน
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              แก้ไขข้อมูลเรียกเก็บ
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
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <Dialog open={selectedInvoice !== null} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดใบแจ้งหนี้</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">เลขใบแจ้งหนี้</Label>
                  <p className="text-lg font-mono">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">สถานะ</Label>
                  <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">องค์กร</Label>
                  <p>{selectedInvoice.organizationName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">แพ็กเกจ</Label>
                  <p>{selectedInvoice.packageName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">วันที่ออก</Label>
                  <p>{selectedInvoice.issueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">กำหนดชำระ</Label>
                  <p>{selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">รายการ</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รายการ</TableHead>
                      <TableHead>จำนวน</TableHead>
                      <TableHead>ราคาต่อหน่วย</TableHead>
                      <TableHead>รวม</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>฿{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell>฿{item.totalPrice.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>ยอดรวม:</span>
                    <span>฿{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ภาษีมูลค่าเพิ่ม (7%):</span>
                    <span>฿{selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>ยอดรวมทั้งสิ้น:</span>
                    <span>฿{selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด PDF
                </Button>
                <Button onClick={() => setSelectedInvoice(null)}>
                  ปิด
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}