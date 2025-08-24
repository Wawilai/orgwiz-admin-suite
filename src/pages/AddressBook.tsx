import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useMasterData } from '@/contexts/MasterDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoadingButton } from '@/components/ui/loading-button';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Download, 
  Upload,
  User,
  Building2,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  department?: string;
  position?: string;
  tags: string[];
  notes?: string;
  contact_type: 'business' | 'personal';
  address?: string;
  is_vip: boolean;
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
  created_by: string;
}

// Real database functions
const fetchContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contacts:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลรายชื่อติดต่อได้",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

const createContact = async (contactData: any) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating contact:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถเพิ่มรายชื่อติดต่อได้",
      variant: "destructive",
    });
    return null;
  }
  
  return data;
};

const updateContact = async (id: string, contactData: Partial<Contact>) => {
  const { error } = await supabase
    .from('contacts')
    .update(contactData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating contact:', error);
    toast({
      title: "เกิดข้อผิดพลาด", 
      description: "ไม่สามารถอัปเดตรายชื่อติดต่อได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

const deleteContact = async (id: string) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting contact:', error);
    toast({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถลบรายชื่อติดต่อได้",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

export default function AddressBook() {
  const { user } = useAuth();
  const masterData = useMasterData();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Partial<Contact>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    department: '',
    position: '',
    tags: [],
    notes: '',
    contact_type: 'business'
  });

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    const data = await fetchContacts();
    // Transform the data to match our interface
    const transformedData = data.map((contact: any) => ({
      ...contact,
      tags: Array.isArray(contact.tags) ? contact.tags : []
    }));
    setContacts(transformedData);
    setLoading(false);
  };

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.first_name} ${contact.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || contact.contact_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddContact = async () => {
    if (!user) return;
    
    setSubmitting(true);
    const contactData = {
      ...formData,
      organization_id: '8a6c4c9d-69f2-4582-b7d4-b72238637b2b', // Use current organization ID
      created_by: user.id,
      tags: formData.tags || [],
      is_vip: false
    };
    
    const newContact = await createContact(contactData);
    if (newContact) {
      await loadContacts();
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "เพิ่มรายชื่อสำเร็จ",
        description: "เพิ่มรายชื่อใหม่เรียบร้อยแล้ว",
      });
    }
    setSubmitting(false);
  };

  const handleEditContact = async () => {
    if (!editingContact) return;
    
    setSubmitting(true);
    const success = await updateContact(editingContact.id, formData);
    if (success) {
      await loadContacts();
      setEditingContact(null);
      resetForm();
      toast({
        title: "แก้ไขสำเร็จ",
        description: "แก้ไขข้อมูลรายชื่อเรียบร้อยแล้ว",
      });
    }
    setSubmitting(false);
  };

  const handleDeleteContact = async (id: string) => {
    const success = await deleteContact(id);
    if (success) {
      await loadContacts();
      toast({
        title: "ลบสำเร็จ",
        description: "ลบรายชื่อเรียบร้อยแล้ว",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      department: '',
      position: '',
      tags: [],
      notes: '',
      contact_type: 'business'
    });
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company || '',
      department: contact.department || '',
      position: contact.position || '',
      tags: contact.tags || [],
      notes: contact.notes || '',
      contact_type: contact.contact_type
    });
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      'personal': "secondary",
      'business': "default",
    };
    const labels: Record<string, string> = {
      'personal': "ส่วนตัว",
      'business': "ธุรกิจ",
    };
    return <Badge variant={variants[type] || "default"}>{labels[type] || type}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">สมุดรายชื่อ</h1>
          <p className="text-muted-foreground">จัดการรายชื่อติดต่อและข้อมูลผู้ใช้งาน</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            ส่งออก
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            นำเข้า
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มรายชื่อ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มรายชื่อใหม่</DialogTitle>
                <DialogDescription>
                  เพิ่มรายชื่อบุคคลหรือองค์กรใหม่เข้าสู่สมุดรายชื่อ
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">ชื่อ *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="กรอกชื่อ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">นามสกุล *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="กรอกนามสกุล"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="กรอกอีเมล"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_type">ประเภท</Label>
                  <Select
                    value={formData.contact_type}
                    onValueChange={(value: 'business' | 'personal') => setFormData({ ...formData, contact_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ธุรกิจ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">ส่วนตัว</SelectItem>
                      <SelectItem value="business">ธุรกิจ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">บริษัท</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="กรอกชื่อบริษัท"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">แผนก</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกแผนก" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.getActiveItems('departments').map((dept) => (
                        <SelectItem key={dept.code} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกตำแหน่ง" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.getActiveItems('positions').map((pos) => (
                        <SelectItem key={pos.code} value={pos.name}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="กรอกหมายเหตุ"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <LoadingButton
                  loading={submitting}
                  onClick={handleAddContact}
                >
                  เพิ่มรายชื่อ
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายชื่อทั้งหมด</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ธุรกิจ</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.contact_type === 'business').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ส่วนตัว</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.contact_type === 'personal').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.is_vip).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อติดต่อ</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหารายชื่อ อีเมล หรือบริษัท..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="personal">ส่วนตัว</SelectItem>
                <SelectItem value="business">ธุรกิจ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>โทรศัพท์</TableHead>
                <TableHead>บริษัท</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>แท็ก</TableHead>
                <TableHead>ติดต่อล่าสุด</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{`${contact.first_name} ${contact.last_name}`}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{getTypeBadge(contact.contact_type)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {contact.tags?.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags && contact.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.last_contact_date 
                      ? new Date(contact.last_contact_date).toLocaleDateString('th-TH')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(contact)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบ
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

      {/* Edit Dialog */}
      <Dialog open={editingContact !== null} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขรายชื่อ</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลรายชื่อที่เลือก
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-first_name">ชื่อ *</Label>
              <Input
                id="edit-first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="กรอกชื่อ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last_name">นามสกุล *</Label>
              <Input
                id="edit-last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="กรอกนามสกุล"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">อีเมล *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="กรอกอีเมล"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">เบอร์โทรศัพท์</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="กรอกเบอร์โทรศัพท์"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact_type">ประเภท</Label>
              <Select
                value={formData.contact_type}
                onValueChange={(value: 'business' | 'personal') => setFormData({ ...formData, contact_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">ส่วนตัว</SelectItem>
                  <SelectItem value="business">ธุรกิจ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">บริษัท</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="กรอกชื่อบริษัท"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">แผนก</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแผนก" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.getActiveItems('departments').map((dept) => (
                    <SelectItem key={dept.code} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position">ตำแหน่ง</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกตำแหน่ง" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.getActiveItems('positions').map((pos) => (
                    <SelectItem key={pos.code} value={pos.name}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-notes">หมายเหตุ</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="กรอกหมายเหตุ"
                rows={3}
              />
            </div>
          </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingContact(null)}>
                  ยกเลิก
                </Button>
                <LoadingButton
                  loading={submitting}
                  onClick={handleEditContact}
                >
                  บันทึก
                </LoadingButton>
              </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}