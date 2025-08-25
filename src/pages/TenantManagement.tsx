import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/usePermissions";
import { Building2, Plus, Edit, Trash2, Settings } from "lucide-react";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active"
  });

  const { toast } = useToast();
  const { permissions } = usePermissions();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูล Tenant ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!formData.name || !formData.slug) {
        toast({
          title: "ข้อผิดพลาด",
          description: "กรุณากรอกชื่อ Tenant และ Slug",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('tenants')
        .insert([{
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          status: formData.status,
          settings: {}
        }]);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "เพิ่ม Tenant ใหม่เรียบร้อยแล้ว",
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchTenants();
    } catch (error: any) {
      console.error('Error adding tenant:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: error.message || "ไม่สามารถเพิ่ม Tenant ได้",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTenant = async () => {
    if (!editingTenant) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('tenants')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          status: formData.status,
        })
        .eq('id', editingTenant.id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "อัปเดต Tenant เรียบร้อยแล้ว",
      });

      setIsEditDialogOpen(false);
      setEditingTenant(null);
      resetForm();
      fetchTenants();
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัปเดต Tenant ได้",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    if (!confirm(`คุณต้องการลบ Tenant "${tenant.name}" หรือไม่?`)) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบ Tenant เรียบร้อยแล้ว",
      });

      fetchTenants();
    } catch (error: any) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: error.message || "ไม่สามารถลบ Tenant ได้",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      slug: tenant.slug,
      description: tenant.description || "",
      status: tenant.status
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      status: "active"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive"
    } as const;

    const labels = {
      active: "ใช้งาน",
      inactive: "ไม่ใช้งาน",
      suspended: "ระงับ"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (!permissions.isSuperAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>คุณไม่มีสิทธิ์เข้าถึงการจัดการ Tenant</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการ Tenant</h1>
          <p className="text-muted-foreground">จัดการระบบ Tenant ของแพลตฟอร์ม</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่ม Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่ม Tenant ใหม่</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <FormFieldWrapper label="ชื่อ Tenant" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="กรุณากรอกชื่อ Tenant"
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="Slug" required hint="ใช้สำหรับ URL และการอ้างอิง">
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="tenant-slug"
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="คำอธิบาย">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="คำอธิบายเกี่ยวกับ Tenant นี้"
                  rows={3}
                />
              </FormFieldWrapper>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                />
                <Label>เปิดใช้งาน</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <LoadingButton loading={submitting} onClick={handleAddTenant}>
                  เพิ่ม Tenant
                </LoadingButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            รายการ Tenant ({tenants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">กำลังโหลดข้อมูล...</p>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>ไม่มี Tenant ในระบบ</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ Tenant</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>คำอธิบาย</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm">{tenant.slug}</code>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{tenant.description || '-'}</TableCell>
                    <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                    <TableCell>{new Date(tenant.created_at).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(tenant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTenant(tenant)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไข Tenant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormFieldWrapper label="ชื่อ Tenant" required>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรุณากรอกชื่อ Tenant"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Slug" required hint="ใช้สำหรับ URL และการอ้างอิง">
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="tenant-slug"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="คำอธิบาย">
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="คำอธิบายเกี่ยวกับ Tenant นี้"
                rows={3}
              />
            </FormFieldWrapper>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
              />
              <Label>เปิดใช้งาน</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                ยกเลิก
              </Button>
              <LoadingButton loading={submitting} onClick={handleEditTenant}>
                บันทึกการแก้ไข
              </LoadingButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}