import { useState } from "react";
import { Button } from "@/components/ui/button";
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

// Sample group data
const mockGroups = [
  {
    id: 1,
    name: "ฝ่ายไอที",
    email: "it@company.com",
    description: "กลุ่มพนักงานฝ่ายเทคโนโลยีสารสนเทศ",
    memberCount: 5,
    createdBy: "สมชาย ใจดี",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "ฝ่ายการตลาด",
    email: "marketing@company.com", 
    description: "กลุ่มพนักงานฝ่ายการตลาดและประชาสัมพันธ์",
    memberCount: 8,
    createdBy: "นภา สว่างใส",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "ผู้บริหาร",
    email: "executives@company.com",
    description: "กลุ่มผู้บริหารระดับสูง",
    memberCount: 3,
    createdBy: "วิชาญ เก่งเก็บ",
    createdAt: "2024-01-05",
  }
];

const mockMembers = [
  { id: 1, groupId: 1, type: "internal", name: "สมชาย ใจดี", email: "somchai@company.com" },
  { id: 2, groupId: 1, type: "internal", name: "สมหญิง รักสะอาด", email: "somying@company.com" },
  { id: 3, groupId: 1, type: "external", name: "", email: "external@partner.com" },
  { id: 4, groupId: 2, type: "internal", name: "นภา สว่างใส", email: "napa@company.com" },
  { id: 5, groupId: 2, type: "external", name: "", email: "client@customer.com" },
];

const GroupManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groupsData, setGroupsData] = useState(mockGroups);
  const [membersData, setMembersData] = useState(mockMembers);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberType, setNewMemberType] = useState<"internal" | "external">("internal");

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

  const openEditDialog = (group: any) => {
    setEditingGroup(group);
    editGroupValidation.setValues({
      name: group.name,
      email: group.email,
      description: group.description || "",
    });
    setIsEditGroupOpen(true);
  };

  const openMembersDialog = (group: any) => {
    setSelectedGroup(group);
    setIsMembersDialogOpen(true);
  };

  const handleAddGroup = async () => {
    await addGroupValidation.handleSubmit(async (values) => {
      const newGroup = {
        id: Math.max(...groupsData.map(g => g.id), 0) + 1,
        name: values.name,
        email: values.email,
        description: values.description,
        memberCount: 0,
        createdBy: "ผู้ใช้ปัจจุบัน",
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setGroupsData([...groupsData, newGroup]);
      setIsAddGroupOpen(false);
      addGroupValidation.reset();
      
      toastSuccess("เพิ่มกลุ่มสำเร็จ", `เพิ่มกลุ่ม "${values.name}" เรียบร้อยแล้ว`);
    });
  };

  const handleEditGroup = async () => {
    await editGroupValidation.handleSubmit(async (values) => {
      setGroupsData(groupsData.map(group => 
        group.id === editingGroup.id 
          ? { ...group, ...values }
          : group
      ));
      
      setIsEditGroupOpen(false);
      setEditingGroup(null);
      editGroupValidation.reset();
      
      toastSuccess("แก้ไขกลุ่มสำเร็จ", `แก้ไขข้อมูลกลุ่ม "${values.name}" เรียบร้อยแล้ว`);
    });
  };

  const handleDeleteGroup = async (group: any) => {
    const originalGroups = [...groupsData];
    setGroupsData(groupsData.filter(g => g.id !== group.id));
    
    toastWithUndo(
      "ลบกลุ่มสำเร็จ",
      `ลบกลุ่ม "${group.name}" แล้ว`,
      () => {
        setGroupsData(originalGroups);
        toastSuccess("เลิกทำการลบ", "กู้คืนกลุ่มเรียบร้อยแล้ว");
      }
    );
  };

  const handleAddMember = () => {
    if (!newMemberEmail) return;

    const newMember = {
      id: Math.max(...membersData.map(m => m.id), 0) + 1,
      groupId: selectedGroup.id,
      type: newMemberType,
      name: newMemberType === "external" ? "" : "ผู้ใช้ภายใน",
      email: newMemberEmail
    };

    setMembersData([...membersData, newMember]);
    
    // Update member count
    setGroupsData(groupsData.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, memberCount: group.memberCount + 1 }
        : group
    ));

    setNewMemberEmail("");
    setIsAddMemberDialogOpen(false);
    toastSuccess("เพิ่มสมาชิกสำเร็จ", "เพิ่มสมาชิกเข้ากลุ่มเรียบร้อยแล้ว");
  };

  const handleRemoveMember = (memberId: number) => {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    setMembersData(membersData.filter(m => m.id !== memberId));
    
    // Update member count
    setGroupsData(groupsData.map(group => 
      group.id === member.groupId 
        ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
        : group
    ));

    toastSuccess("ลบสมาชิกสำเร็จ", "ลบสมาชิกออกจากกลุ่มเรียบร้อยแล้ว");
  };

  const getGroupMembers = (groupId: number) => {
    return membersData.filter(member => member.groupId === groupId);
  };

  const filteredGroups = groupsData.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.email.toLowerCase().includes(searchTerm.toLowerCase());
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
            <div className="text-2xl font-bold">{groupsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupsData.reduce((sum, group) => sum + group.memberCount, 0)}
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
              {membersData.filter(m => m.type === 'external').length}
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
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {group.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {group.memberCount} คน
                    </Badge>
                  </TableCell>
                  <TableCell>{group.createdBy}</TableCell>
                  <TableCell>{new Date(group.createdAt).toLocaleDateString('th-TH')}</TableCell>
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
                            group.name,
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
            <DialogTitle>จัดการสมาชิก - {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              เพิ่ม แก้ไข หรือลบสมาชิกในกลุ่ม
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">รายชื่อสมาชิก ({getGroupMembers(selectedGroup?.id || 0).length} คน)</h4>
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
                  {getGroupMembers(selectedGroup?.id || 0).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.name || "-"}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.type === 'internal' ? 'default' : 'secondary'}>
                          {member.type === 'internal' ? 'ภายใน' : 'ภายนอก'}
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
                  {getGroupMembers(selectedGroup?.id || 0).length === 0 && (
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