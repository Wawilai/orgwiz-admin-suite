import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  MapPin,
  Edit2,
  Trash2,
  MoreHorizontal,
  Video,
  Mail,
  MessageSquare
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  attendees: string[];
  type: 'Meeting' | 'Task' | 'Reminder' | 'Holiday';
  priority: 'Low' | 'Medium' | 'High';
  isAllDay: boolean;
  isRecurring: boolean;
  recurringType?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  reminders: number[];
  status: 'Confirmed' | 'Tentative' | 'Cancelled';
  createdBy: string;
  createdAt: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'ประชุมทีม IT ประจำสัปดาห์',
    description: 'ประชุมรายงานความคืบหน้าโครงการและปรับแผนงาน',
    startDate: '2024-01-25',
    startTime: '09:00',
    endDate: '2024-01-25',
    endTime: '10:30',
    location: 'ห้องประชุม A',
    attendees: ['สมชาย ใจดี', 'นภา สว่างใส', 'วิชัย เก่งกาจ'],
    type: 'Meeting',
    priority: 'High',
    isAllDay: false,
    isRecurring: true,
    recurringType: 'Weekly',
    reminders: [15, 60],
    status: 'Confirmed',
    createdBy: 'สมชาย ใจดี',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Demo โครงการใหม่',
    description: 'นำเสนอระบบใหม่ให้ลูกค้า',
    startDate: '2024-01-26',
    startTime: '14:00',
    endDate: '2024-01-26',
    endTime: '16:00',
    location: 'Online - Zoom',
    attendees: ['นภา สว่างใส', 'ลูกค้า A', 'ลูกค้า B'],
    type: 'Meeting',
    priority: 'High',
    isAllDay: false,
    isRecurring: false,
    reminders: [30],
    status: 'Confirmed',
    createdBy: 'นภา สว่างใส',
    createdAt: '2024-01-22'
  },
  {
    id: '3',
    title: 'ส่งรายงานประจำเดือน',
    description: 'รายงานสรุปผลงานประจำเดือน',
    startDate: '2024-01-31',
    startTime: '17:00',
    endDate: '2024-01-31',
    endTime: '17:00',
    location: '-',
    attendees: [],
    type: 'Task',
    priority: 'Medium',
    isAllDay: false,
    isRecurring: true,
    recurringType: 'Monthly',
    reminders: [1440, 120],
    status: 'Confirmed',
    createdBy: 'วิชัย เก่งกาจ',
    createdAt: '2024-01-15'
  }
];

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    attendees: [],
    type: 'Meeting',
    priority: 'Medium',
    isAllDay: false,
    isRecurring: false,
    status: 'Confirmed'
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData as Event,
      startDate: startDate?.toISOString().split('T')[0] || '',
      endDate: endDate?.toISOString().split('T')[0] || '',
      reminders: [15],
      createdBy: 'ผู้ใช้ปัจจุบัน',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEvents([...events, newEvent]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "เพิ่มกิจกรรมสำเร็จ",
      description: "เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว",
    });
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;
    setEvents(events.map(event => 
      event.id === editingEvent.id ? { ...editingEvent, ...formData } : event
    ));
    setEditingEvent(null);
    resetForm();
    toast({
      title: "แก้ไขสำเร็จ",
      description: "แก้ไขกิจกรรมเรียบร้อยแล้ว",
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "ลบสำเร็จ",
      description: "ลบกิจกรรมเรียบร้อยแล้ว",
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      attendees: [],
      type: 'Meeting',
      priority: 'Medium',
      isAllDay: false,
      isRecurring: false,
      status: 'Confirmed'
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData(event);
    setStartDate(event.startDate ? new Date(event.startDate) : undefined);
    setEndDate(event.endDate ? new Date(event.endDate) : undefined);
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Meeting: "default",
      Task: "secondary",
      Reminder: "outline",
      Holiday: "destructive"
    };
    return <Badge variant={variants[type] || "default"}>{type}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Low: "secondary",
      Medium: "default",
      High: "destructive"
    };
    const colors = {
      Low: "text-green-700",
      Medium: "text-yellow-700",
      High: "text-red-700"
    };
    return <Badge variant={variants[priority] || "default"} className={colors[priority as keyof typeof colors]}>{priority}</Badge>;
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const todayEvents = events.filter(event => 
    event.startDate === new Date().toISOString().split('T')[0]
  );

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return eventDate >= tomorrow;
  }).slice(0, 5);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ปฏิทิน</h1>
          <p className="text-muted-foreground">จัดการกิจกรรม นัดหมาย และเตือนความจำ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            ส่งเชิญ
          </Button>
          <Button variant="outline">
            <Video className="h-4 w-4 mr-2" />
            Meeting
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มกิจกรรม
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>เพิ่มกิจกรรมใหม่</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title">หัวข้อ *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="กรอกหัวข้อกิจกรรม"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">ประเภท</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meeting">ประชุม</SelectItem>
                        <SelectItem value="Task">งาน</SelectItem>
                        <SelectItem value="Reminder">เตือนความจำ</SelectItem>
                        <SelectItem value="Holiday">วันหยุด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">ความสำคัญ</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">ต่ำ</SelectItem>
                        <SelectItem value="Medium">ปานกลาง</SelectItem>
                        <SelectItem value="High">สูง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">วันที่เริ่ม</Label>
                    <DatePicker
                      date={startDate}
                      onSelect={setStartDate}
                      placeholder="เลือกวันที่เริ่ม"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">เวลาเริ่ม</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      disabled={formData.isAllDay}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">วันที่สิ้นสุด</Label>
                    <DatePicker
                      date={endDate}
                      onSelect={setEndDate}
                      placeholder="เลือกวันที่สิ้นสุด"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">เวลาสิ้นสุด</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      disabled={formData.isAllDay}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="location">สถานที่</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="กรอกสถานที่"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">รายละเอียด</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="กรอกรายละเอียด"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAllDay"
                        checked={formData.isAllDay}
                        onCheckedChange={(checked) => setFormData({ ...formData, isAllDay: checked })}
                      />
                      <Label htmlFor="isAllDay">ทั้งวัน</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
                      />
                      <Label htmlFor="isRecurring">ทำซ้ำ</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAddEvent}>
                  เพิ่มกิจกรรม
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Navigation */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {formatMonth(currentDate)}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    วันนี้
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  เดือน
                </Button>
                <Button 
                  variant={viewMode === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  สัปดาห์
                </Button>
                <Button 
                  variant={viewMode === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  วัน
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          {getTypeBadge(event.type)}
                          {getPriorityBadge(event.priority)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {event.startDate} {!event.isAllDay && `${event.startTime} - ${event.endTime}`}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          {event.attendees.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {event.attendees.length} คน
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(event)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            สร้าง Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Video className="mr-2 h-4 w-4" />
                            สร้าง Meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">กิจกรรมวันนี้</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">ไม่มีกิจกรรมวันนี้</p>
              ) : (
                <div className="space-y-2">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">
                        {!event.isAllDay && `${event.startTime} - ${event.endTime}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">กิจกรรมที่จะมาถึง</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">ไม่มีกิจกรรมที่จะมาถึง</p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">
                        {event.startDate}
                        {!event.isAllDay && ` ${event.startTime}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingEvent !== null} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขกิจกรรม</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-title">หัวข้อ *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="กรอกหัวข้อกิจกรรม"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">ประเภท</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">ประชุม</SelectItem>
                    <SelectItem value="Task">งาน</SelectItem>
                    <SelectItem value="Reminder">เตือนความจำ</SelectItem>
                    <SelectItem value="Holiday">วันหยุด</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">ความสำคัญ</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">ต่ำ</SelectItem>
                    <SelectItem value="Medium">ปานกลาง</SelectItem>
                    <SelectItem value="High">สูง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">วันที่เริ่ม</Label>
                <DatePicker
                  date={startDate}
                  onSelect={setStartDate}
                  placeholder="เลือกวันที่เริ่ม"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">เวลาเริ่ม</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  disabled={formData.isAllDay}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">วันที่สิ้นสุด</Label>
                <DatePicker
                  date={endDate}
                  onSelect={setEndDate}
                  placeholder="เลือกวันที่สิ้นสุด"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endTime">เวลาสิ้นสุด</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  disabled={formData.isAllDay}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-location">สถานที่</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="กรอกสถานที่"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-description">รายละเอียด</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="กรอกรายละเอียด"
                  rows={3}
                />
              </div>
              <div className="col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isAllDay"
                    checked={formData.isAllDay}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAllDay: checked })}
                  />
                  <Label htmlFor="edit-isAllDay">ทั้งวัน</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
                  />
                  <Label htmlFor="edit-isRecurring">ทำซ้ำ</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditEvent}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}