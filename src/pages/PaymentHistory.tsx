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
import { toast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Search, 
  Download, 
  Calendar, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  FileText,
  Filter,
  ArrowLeft,
  Banknote,
  TrendingUp
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'CreditCard' | 'BankTransfer' | 'PayPal';
  status: 'Success' | 'Failed' | 'Pending' | 'Refunded';
  transactionId: string;
  description: string;
  cardLast4?: string;
  bankAccount?: string;
  refundAmount?: number;
  refundDate?: string;
}

const mockPaymentHistory: PaymentRecord[] = [
  {
    id: '1',
    organizationId: 'org-001',
    organizationName: 'บริษัท เทคโนโลยี จำกัด',
    invoiceNumber: 'INV-2024-001',
    paymentDate: '2024-01-15',
    amount: 799,
    tax: 55.93,
    totalAmount: 854.93,
    paymentMethod: 'CreditCard',
    status: 'Success',
    transactionId: 'txn_1234567890',
    description: 'Standard Plan - Monthly Subscription',
    cardLast4: '1234'
  },
  {
    id: '2',
    organizationId: 'org-002',
    organizationName: 'บริษัท การตลาด จำกัด',
    invoiceNumber: 'INV-2024-002',
    paymentDate: '2024-01-20',
    amount: 299,
    tax: 20.93,
    totalAmount: 319.93,
    paymentMethod: 'BankTransfer',
    status: 'Success',
    transactionId: 'txn_0987654321',
    description: 'Basic Plan - Monthly Subscription',
    bankAccount: 'SCB-1234567890'
  },
  {
    id: '3',
    organizationId: 'org-003',
    organizationName: 'บริษัท ดิจิทัล จำกัด',
    invoiceNumber: 'INV-2024-003',
    paymentDate: '2024-01-18',
    amount: 1499,
    tax: 104.93,
    totalAmount: 1603.93,
    paymentMethod: 'CreditCard',
    status: 'Failed',
    transactionId: 'txn_1122334455',
    description: 'Premium Plan - Monthly Subscription',
    cardLast4: '5678'
  },
  {
    id: '4',
    organizationId: 'org-001',
    organizationName: 'บริษัท เทคโนโลยี จำกัด',
    invoiceNumber: 'INV-2024-004',
    paymentDate: '2024-01-22',
    amount: 799,
    tax: 55.93,
    totalAmount: 854.93,
    paymentMethod: 'CreditCard',
    status: 'Refunded',
    transactionId: 'txn_9988776655',
    description: 'Standard Plan - Monthly Subscription',
    cardLast4: '1234',
    refundAmount: 854.93,
    refundDate: '2024-01-23'
  }
];

interface PaymentHistoryProps {
  organizationId?: string;
  organizationName?: string;
  onBack?: () => void;
}

export default function PaymentHistory({ organizationId, organizationName, onBack }: PaymentHistoryProps) {
  const [payments] = useState<PaymentRecord[]>(
    organizationId 
      ? mockPaymentHistory.filter(p => p.organizationId === organizationId)
      : mockPaymentHistory
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Success: "default",
      Failed: "destructive",
      Pending: "outline",
      Refunded: "secondary"
    };
    const colors = {
      Success: "text-green-700",
      Failed: "text-red-700",
      Pending: "text-yellow-700",
      Refunded: "text-gray-700"
    };
    const statusText = {
      Success: "สำเร็จ",
      Failed: "ไม่สำเร็จ",
      Pending: "รอดำเนินการ",
      Refunded: "คืนเงิน"
    };
    const icons = {
      Success: CheckCircle,
      Failed: XCircle,
      Pending: Clock,
      Refunded: AlertCircle
    };
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge variant={variants[status] || "outline"} className={colors[status as keyof typeof colors]}>
        <Icon className="h-3 w-3 mr-1" />
        {statusText[status as keyof typeof statusText] || status}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string, cardLast4?: string, bankAccount?: string) => {
    const methodText = {
      CreditCard: "บัตรเครดิต",
      BankTransfer: "โอนผ่านธนาคาร",
      PayPal: "PayPal"
    };
    
    let displayText = methodText[method as keyof typeof methodText] || method;
    if (method === 'CreditCard' && cardLast4) {
      displayText += ` **** ${cardLast4}`;
    } else if (method === 'BankTransfer' && bankAccount) {
      displayText += ` ${bankAccount}`;
    }
    
    return <Badge variant="outline">{displayText}</Badge>;
  };

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    // Simulate receipt download
    const element = document.createElement('a');
    const receiptData = `
      ใบเสร็จรับเงิน
      เลขที่: ${payment.invoiceNumber}
      วันที่: ${payment.paymentDate}
      องค์กร: ${payment.organizationName}
      จำนวนเงิน: ฿${payment.totalAmount.toLocaleString()}
      วิธีการชำระ: ${payment.paymentMethod}
      Transaction ID: ${payment.transactionId}
    `;
    const file = new Blob([receiptData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt_${payment.invoiceNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "ดาวน์โหลดสำเร็จ",
      description: `ดาวน์โหลดใบเสร็จ ${payment.invoiceNumber} เรียบร้อยแล้ว`,
    });
  };

  const handleRefundPayment = (paymentId: string) => {
    toast({
      title: "คำขอคืนเงิน",
      description: "ส่งคำขอคืนเงินไปยังทีมการเงินแล้ว",
    });
  };

  const handleResendReceipt = (payment: PaymentRecord) => {
    toast({
      title: "ส่งใบเสร็จอีเมลแล้ว",
      description: `ส่งใบเสร็จ ${payment.invoiceNumber} ทางอีเมลเรียบร้อยแล้ว`,
    });
  };

  const totalSuccessAmount = payments.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.totalAmount, 0);
  const totalRefundAmount = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0);
  const successfulPayments = payments.filter(p => p.status === 'Success').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">ประวัติการชำระเงิน</h1>
            <p className="text-muted-foreground">
              {organizationName 
                ? `ประวัติการชำระเงินของ ${organizationName}`
                : "ประวัติการชำระเงินทั้งหมด"
              }
            </p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ส่งออกประวัติ
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดชำระสำเร็จ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">฿{totalSuccessAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดคืนเงิน</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">฿{totalRefundAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การชำระสำเร็จ</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การชำระไม่สำเร็จ</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการชำระเงิน</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาเลขใบแจ้งหนี้, องค์กร หรือ Transaction ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="Success">สำเร็จ</SelectItem>
                <SelectItem value="Failed">ไม่สำเร็จ</SelectItem>
                <SelectItem value="Pending">รอดำเนินการ</SelectItem>
                <SelectItem value="Refunded">คืนเงิน</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="วิธีการชำระ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="CreditCard">บัตรเครดิต</SelectItem>
                <SelectItem value="BankTransfer">โอนธนาคาร</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <TableHead>Transaction ID</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {payment.paymentDate}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                  <TableCell>{payment.organizationName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">฿{payment.totalAmount.toLocaleString()}</div>
                      {payment.refundAmount && (
                        <div className="text-xs text-red-600">คืนเงิน: ฿{payment.refundAmount.toLocaleString()}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(payment.paymentMethod, payment.cardLast4, payment.bankAccount)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {payment.transactionId}
                    </code>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                          <FileText className="mr-2 h-4 w-4" />
                          ดูรายละเอียด
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                          <Download className="mr-2 h-4 w-4" />
                          ดาวน์โหลดใบเสร็จ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResendReceipt(payment)}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          ส่งใบเสร็จทางอีเมล
                        </DropdownMenuItem>
                        {payment.status === 'Success' && (
                          <DropdownMenuItem onClick={() => handleRefundPayment(payment.id)}>
                            <Banknote className="mr-2 h-4 w-4" />
                            ขอคืนเงิน
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

      {/* Payment Detail Dialog */}
      <Dialog open={selectedPayment !== null} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดการชำระเงิน</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">เลขใบแจ้งหนี้</Label>
                  <p className="text-lg font-mono">{selectedPayment.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">สถานะ</Label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">องค์กร</Label>
                  <p>{selectedPayment.organizationName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">วันที่ชำระ</Label>
                  <p>{selectedPayment.paymentDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">วิธีการชำระ</Label>
                  <div className="mt-1">
                    {getPaymentMethodBadge(selectedPayment.paymentMethod, selectedPayment.cardLast4, selectedPayment.bankAccount)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">
                    {selectedPayment.transactionId}
                  </code>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">รายการ</Label>
                <p className="mt-1">{selectedPayment.description}</p>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>ยอดเงิน:</span>
                    <span>฿{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ภาษีมูลค่าเพิ่ม:</span>
                    <span>฿{selectedPayment.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>ยอดรวมทั้งสิ้น:</span>
                    <span>฿{selectedPayment.totalAmount.toLocaleString()}</span>
                  </div>
                  {selectedPayment.refundAmount && (
                    <div className="flex justify-between text-red-600">
                      <span>ยอดคืนเงิน:</span>
                      <span>฿{selectedPayment.refundAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleDownloadReceipt(selectedPayment)}>
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลดใบเสร็จ
                </Button>
                <Button onClick={() => setSelectedPayment(null)}>
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