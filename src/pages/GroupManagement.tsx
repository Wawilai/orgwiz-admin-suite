import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";
import { useDeleteConfirmation } from "@/components/ui/confirmation-dialog";
import { useFormValidation, createEmailRule } from "@/hooks/use-form-validation";
import { toastSuccess, toastError, toastWithUndo } from "@/components/ui/enhanced-toast";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  Building,
  Download,
  Upload,
  Plus,
  X,
} from "lucide-react";

interface Group {
  id: string;
  group_name: string;
  group_email: string;
  description?: string;
  memberCount?: number;
  created_by?: string;
  created_at: string;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id?: string;
  external_email?: string;
  added_by: string;
  added_at: string;
}

const GroupManagement = () => {
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberType, setNewMemberType] = useState<"internal" | "external">("internal");

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
      fetchMembers();
    }
  }, [isAuthenticated]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const groupsWithCounts = await Promise.all(
        (data || []).map(async (group) => {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);
          
          return {
            ...group,
            memberCount: count || 0
          };
        })
      );
      
      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('*');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Confirmation dialogs
  const { showDeleteConfirmation, DeleteConfirmationDialog } = useDeleteConfirmation();

  // Form validation for adding groups
  const addGroupValidation = useFormValidation({
    name: "",
    email: "",
    description: "",
  }, {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: createEmailRule(),
    description: { maxLength: 500 },
  });

  // Form validation for editing groups
  const editGroupValidation = useFormValidation({
    name: "",
    email: "",
    description: "",
  }, {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: createEmailRule(),
    description: { maxLength: 500 },
  });

  const openEditDialog = (group: Group) => {
    setEditingGroup(group);
    editGroupValidation.setValues({
      name: group.group_name,
      email: group.group_email,
      description: group.description || "",
    });
    setIsEditGroupOpen(true);
  };

  const openMembersDialog = (group: Group) => {
    setSelectedGroup(group);
    setIsMembersDialogOpen(true);
  };

  const handleAddGroup = async () => {
    await addGroupValidation.handleSubmit(async (values) => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .insert([{
            group_name: values.name,
            group_email: values.email,
            description: values.description,
            organization_id: 'temp-org-id', // Will be replaced with actual org ID
            created_by: 'temp-user-id', // Will be replaced with actual user ID
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        const newGroup = { ...data, memberCount: 0 };
        setGroups([...groups, newGroup]);
        setIsAddGroupOpen(false);
        addGroupValidation.reset();
        
        toastSuccess("เพิ่มกลุ่มสำเร็จ", `เพิ่มกลุ่ม "${values.name}" เรียบร้อยแล้ว`);
      } catch (error) {
        console.error('Error adding group:', error);
        toastError("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มกลุ่มได้");
      }
    });
  };

  const handleEditGroup = async () => {
    await editGroupValidation.handleSubmit(async (values) => {
      if (!editingGroup) return;
      
      try {
        const { error } = await supabase
          .from('groups')
          .update({
            group_name: values.name,
            group_email: values.email,
            description: values.description,
          })
          .eq('id', editingGroup.id);
        
        if (error) throw error;
        
        setGroups(groups.map(group => 
          group.id === editingGroup.id 
            ? { ...group, group_name: values.name, group_email: values.email, description: values.description }
            : group
        ));
        
        setIsEditGroupOpen(false);
        setEditingGroup(null);
        editGroupValidation.reset();
        
        toastSuccess("แก้ไขกลุ่มสำเร็จ", `แก้ไขข้อมูลกลุ่ม "${values.name}" เรียบร้อยแล้ว`);
      } catch (error) {
        console.error('Error updating group:', error);
        toastError("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขกลุ่มได้");
      }
    });
  };

  const handleDeleteGroup = async (group: Group) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', group.id);
      
      if (error) throw error;
      
      setGroups(groups.filter(g => g.id !== group.id));
      toastSuccess("ลบกลุ่มสำเร็จ", `ลบกลุ่ม "${group.group_name}" แล้ว`);
    } catch (error) {
      console.error('Error deleting group:', error);
      toastError("เกิดข้อผิดพลาด", "ไม่สามารถลบกลุ่มได้");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail || !selectedGroup) return;

    try {
      const { data, error } = await supabase
        .from('group_members')
        .insert([{
          group_id: selectedGroup.id,
          external_email: newMemberType === "external" ? newMemberEmail : null,
          user_id: newMemberType === "internal" ? 'temp-user-id' : null,
          added_by: 'temp-user-id',
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setMembers([...members, data]);
      
      // Update member count
      setGroups(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, memberCount: (group.memberCount || 0) + 1 }
          : group
      ));

      setNewMemberEmail("");
      setIsAddMemberDialogOpen(false);
      toastSuccess("เพิ่มสมาชิกสำเร็จ", "เพิ่มสมาชิกเข้ากลุ่มเรียบร้อยแล้ว");
    } catch (error) {
      console.error('Error adding member:', error);
      toastError("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มสมาชิกได้");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== memberId));
      
      // Update member count
      setGroups(groups.map(group => 
        group.id === member.group_id 
          ? { ...group, memberCount: Math.max(0, (group.memberCount || 0) - 1) }
          : group
      ));

      toastSuccess("ลบสมาชิกสำเร็จ", "ลบสมาชิกออกจากกลุ่มเรียบร้อยแล้ว");
    } catch (error) {
      console.error('Error removing member:', error);
      toastError("เกิดข้อผิดพลาด", "ไม่สามารถลบสมาชิกได้");
    }
  };

  const getGroupMembers = (groupId: string) => {
    return members.filter(member => member.group_id === groupId);
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.group_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการกลุ่ม</h1>
          <p className="text-muted-foreground mt-1">
            จัดการกลุ่มอีเมลและรายการแจกจ่าย
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มกลุ่มใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>เพิ่มกลุ่มใหม่</DialogTitle>
                <DialogDescription>
                  สร้างกลุ่มอีเมลใหม่สำหรับการแจกจ่ายข้อมูล
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormFieldWrapper
                  label="ชื่อกลุ่ม"
                  required
                  error={addGroupValidation.errors.name}
                >
                  <Input
                    placeholder="กรอกชื่อกลุ่ม"
                    value={addGroupValidation.values.name}
                    onChange={(e) => addGroupValidation.setValue('name', e.target.value)}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="อีเมลกลุ่ม"
                  required
                  error={addGroupValidation.errors.email}
                >
                  <Input
                    type="email"
                    placeholder="group@company.com"
                    value={addGroupValidation.values.email}
                    onChange={(e) => addGroupValidation.setValue('email', e.target.value)}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="รายละเอียด"
                  error={addGroupValidation.errors.description}
                >
                  <Textarea
                    placeholder="อธิบายวัตถุประสงค์ของกลุ่ม"
                    value={addGroupValidation.values.description}
                    onChange={(e) => addGroupValidation.setValue('description', e.target.value)}
                    rows={3}
                  />
                </FormFieldWrapper>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddGroupOpen(false)}>
                  ยกเลิก
                </Button>
                <LoadingButton onClick={handleAddGroup}>
                  เพิ่มกลุ่ม
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กลุ่มทั้งหมด</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groups.reduce((sum, group) => sum + (group.memberCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกภายนอก</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter(m => m.external_email).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการกลุ่ม</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อกลุ่มหรืออีเมล..."
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
                <TableHead>ชื่อกลุ่ม</TableHead>
                <TableHead>อีเมลกลุ่ม</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>สมาชิก</TableHead>
                <TableHead>ผู้สร้าง</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.group_name}</TableCell>
                  <TableCell>{group.group_email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {group.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {group.memberCount || 0} คน
                    </Badge>
                  </TableCell>
                  <TableCell>{group.created_by || "-"}</TableCell>
                  <TableCell>{new Date(group.created_at).toLocaleDateString('th-TH')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openMembersDialog(group)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          จัดการสมาชิก
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(group)}>
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => showDeleteConfirmation(
                            group.group_name,
                            () => handleDeleteGroup(group)
                          )}
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

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>แก้ไขกลุ่ม</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลกลุ่มที่เลือก
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormFieldWrapper
              label="ชื่อกลุ่ม"
              required
              error={editGroupValidation.errors.name}
            >
              <Input
                placeholder="กรอกชื่อกลุ่ม"
                value={editGroupValidation.values.name}
                onChange={(e) => editGroupValidation.setValue('name', e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              label="อีเมลกลุ่ม"
              required
              error={editGroupValidation.errors.email}
            >
              <Input
                type="email"
                placeholder="group@company.com"
                value={editGroupValidation.values.email}
                onChange={(e) => editGroupValidation.setValue('email', e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              label="รายละเอียด"
              error={editGroupValidation.errors.description}
            >
              <Textarea
                placeholder="อธิบายวัตถุประสงค์ของกลุ่ม"
                value={editGroupValidation.values.description}
                onChange={(e) => editGroupValidation.setValue('description', e.target.value)}
                rows={3}
              />
            </FormFieldWrapper>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditGroupOpen(false)}>
              ยกเลิก
            </Button>
            <LoadingButton onClick={handleEditGroup}>
              บันทึก
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Management Dialog */}
      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="bg-card max-w-4xl">
          <DialogHeader>
            <DialogTitle>จัดการสมาชิก - {selectedGroup?.group_name}</DialogTitle>
            <DialogDescription>
              เพิ่ม แก้ไข หรือลบสมาชิกในกลุ่ม
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">รายชื่อสมาชิก ({getGroupMembers(selectedGroup?.id || "").length} คน)</h4>
              <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    เพิ่มสมาชิก
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>เพิ่มสมาชิกใหม่</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <FormFieldWrapper label="ประเภทสมาชิก">
                      <Select
                        value={newMemberType}
                        onValueChange={(value: "internal" | "external") => setNewMemberType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="internal">สมาชิกภายใน</SelectItem>
                          <SelectItem value="external">สมาชิกภายนอก</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>
                    <FormFieldWrapper label="อีเมล" required>
                      <Input
                        type="email"
                        placeholder="กรอกอีเมลสมาชิก"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                      />
                    </FormFieldWrapper>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                      ยกเลิก
                    </Button>
                    <Button onClick={handleAddMember}>
                      เพิ่มสมาชิก
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getGroupMembers(selectedGroup?.id || "").map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.user_id ? "ผู้ใช้ภายใน" : "-"}
                      </TableCell>
                      <TableCell>{member.external_email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={member.user_id ? 'default' : 'secondary'}>
                          {member.user_id ? 'ภายใน' : 'ภายนอก'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getGroupMembers(selectedGroup?.id || "").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        ไม่มีสมาชิกในกลุ่มนี้
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsMembersDialogOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog />
    </div>
  );
};

export default GroupManagement;