import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  Video, 
  Plus, 
  Users, 
  Clock, 
  Calendar, 
  Shield, 
  Share2, 
  Mic, 
  Camera, 
  Monitor,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Download,
  Play,
  Pause,
  Square,
  Settings,
  UserPlus,
  UserMinus,
  Vote,
  FileText,
  MessageSquare,
  Hand,
  MicOff,
  CameraOff,
  PhoneOff,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string;
  host: string;
  hostId: string;
  participants: Participant[];
  invitedEmails: string[];
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  meetingRoom: string;
  password?: string;
  isRecording: boolean;
  isLocked: boolean;
  waitingRoom: boolean;
  status: 'Scheduled' | 'Live' | 'Ended' | 'Cancelled';
  maxParticipants: number;
  createdAt: string;
  recordingUrl?: string;
  meetingLink: string;
  chatMessages: ChatMessage[];
  polls: Poll[];
  sharedScreen?: {
    userId: string;
    userName: string;
    isActive: boolean;
  };
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'Host' | 'Co-Host' | 'Participant';
  status: 'Joined' | 'Waiting' | 'Left' | 'Invited';
  joinTime?: string;
  leaveTime?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  connectionQuality: 'Good' | 'Fair' | 'Poor';
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isPrivate?: boolean;
  recipientId?: string;
}

interface Poll {
  id: string;
  meetingId: string;
  question: string;
  options: string[];
  votes: { [key: string]: string };
  isActive: boolean;
  createdAt: string;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'ประชุมทีม IT ประจำสัปดาห์',
    description: 'ประชุมรายงานความคืบหน้าและวางแผนงาน',
    host: 'สมชาย ใจดี',
    hostId: 'host1',
    participants: [
      {
        id: '1',
        name: 'สมชาย ใจดี',
        email: 'somchai@company.com',
        role: 'Host',
        status: 'Joined',
        joinTime: '09:00',
        isMuted: false,
        isVideoOn: true,
        isHandRaised: false,
        connectionQuality: 'Good'
      },
      {
        id: '2',
        name: 'นภา สว่างใส',
        email: 'napa@company.com',
        role: 'Participant',
        status: 'Joined',
        joinTime: '09:02',
        isMuted: true,
        isVideoOn: true,
        isHandRaised: true,
        connectionQuality: 'Good'
      }
    ],
    invitedEmails: ['somchai@company.com', 'napa@company.com', 'admin@company.com'],
    scheduledDate: '2024-01-25',
    scheduledTime: '09:00',
    duration: 60,
    meetingRoom: 'room-001',
    password: '123456',
    isRecording: false,
    isLocked: false,
    waitingRoom: true,
    status: 'Live',
    maxParticipants: 50,
    createdAt: '2024-01-20',
    meetingLink: 'https://meet.company.com/room-001',
    chatMessages: [
      {
        id: '1',
        userId: '1',
        userName: 'สมชาย ใจดี',
        message: 'สวัสดีครับทุกคน',
        timestamp: '09:05'
      },
      {
        id: '2',
        userId: '2',
        userName: 'นภา สว่างใส',
        message: 'สวัสดีค่ะ',
        timestamp: '09:06'
      }
    ],
    polls: []
  },
  {
    id: '2',
    title: 'Demo โครงการใหม่',
    description: 'นำเสนอระบบใหม่ให้ลูกค้า',
    host: 'นภา สว่างใส',
    hostId: 'host2',
    participants: [
      {
        id: '2',
        name: 'นภา สว่างใส',
        email: 'napa@company.com',
        role: 'Host',
        status: 'Invited',
        isMuted: false,
        isVideoOn: false,
        isHandRaised: false,
        connectionQuality: 'Good'
      }
    ],
    invitedEmails: ['napa@company.com', 'client@customer.com'],
    scheduledDate: '2024-01-26',
    scheduledTime: '14:00',
    duration: 120,
    meetingRoom: 'room-002',
    password: 'demo2024',
    isRecording: false,
    isLocked: false,
    waitingRoom: false,
    status: 'Scheduled',
    maxParticipants: 20,
    createdAt: '2024-01-22',
    meetingLink: 'https://meet.company.com/room-002',
    chatMessages: [],
    polls: []
  }
];

const mockPolls: Poll[] = [
  {
    id: '1',
    meetingId: '1',
    question: 'คุณคิดว่าโครงการควรเริ่มเมื่อไหร่?',
    options: ['สัปดาหน์หน้า', 'เดือนหน้า', 'ไตรมาสหน้า'],
    votes: { '1': 'เดือนหน้า', '2': 'เดือนหน้า' },
    isActive: true,
    createdAt: '2024-01-25T09:15:00'
  }
];

export default function Meeting() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentTab, setCurrentTab] = useState('meetings');
  const [chatMessage, setChatMessage] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [currentUser] = useState({ id: 'current', name: 'ผู้ใช้ปัจจุบัน', isMuted: false, isVideoOn: true });
  const [formData, setFormData] = useState<Partial<Meeting>>({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    password: '',
    waitingRoom: true,
    maxParticipants: 50,
    invitedEmails: []
  });
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', '']
  });

  const handleCreateMeeting = () => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...formData as Meeting,
      host: 'ผู้ใช้ปัจจุบัน',
      participants: [],
      meetingRoom: `room-${Date.now()}`,
      isRecording: false,
      isLocked: false,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };
    setMeetings([...meetings, newMeeting]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "สร้างห้องประชุมสำเร็จ",
      description: "สร้างห้องประชุมใหม่เรียบร้อยแล้ว",
    });
  };

  const handleStartMeeting = (meetingId: string) => {
    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId ? { ...meeting, status: 'Live' as const } : meeting
    ));
    toast({
      title: "เริ่มประชุม",
      description: "เริ่มการประชุมแล้ว",
    });
  };

  const handleEndMeeting = (meetingId: string) => {
    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId ? { ...meeting, status: 'Ended' as const } : meeting
    ));
    toast({
      title: "สิ้นสุดการประชุม",
      description: "การประชุมได้สิ้นสุดลงแล้ว",
    });
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    setActiveMeeting(meeting);
    toast({
      title: "เข้าร่วมประชุม",
      description: `เข้าร่วมประชุม "${meeting.title}" แล้ว`,
    });
  };

  const handleCreatePoll = () => {
    if (!activeMeeting) return;
    
    const newPoll: Poll = {
      id: Date.now().toString(),
      meetingId: activeMeeting.id,
      question: pollData.question,
      options: pollData.options.filter(option => option.trim() !== ''),
      votes: {},
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    setPolls([...polls, newPoll]);
    setIsPollDialogOpen(false);
    setPollData({ question: '', options: ['', ''] });
    toast({
      title: "สร้าง Poll สำเร็จ",
      description: "สร้างการโหวตใหม่เรียบร้อยแล้ว",
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      password: '',
      waitingRoom: true,
      maxParticipants: 50,
      invitedEmails: []
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      Scheduled: "outline",
      Live: "destructive",
      Ended: "secondary",
      Cancelled: "secondary"
    };
    const colors = {
      Scheduled: "text-blue-700",
      Live: "text-green-700",
      Ended: "text-gray-700",
      Cancelled: "text-red-700"
    };
    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status === 'Live' ? 'กำลังประชุม' : 
         status === 'Scheduled' ? 'กำหนดการ' :
         status === 'Ended' ? 'สิ้นสุด' : 'ยกเลิก'}
      </Badge>
    );
  };

  const addPollOption = () => {
    setPollData({
      ...pollData,
      options: [...pollData.options, '']
    });
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData({ ...pollData, options: newOptions });
  };

  const removePollOption = (index: number) => {
    if (pollData.options.length > 2) {
      const newOptions = pollData.options.filter((_, i) => i !== index);
      setPollData({ ...pollData, options: newOptions });
    }
  };

  // เพิ่ม functions ใหม่สำหรับฟีเจอร์ขั้นสูง
  const handleSendChatMessage = () => {
    if (!chatMessage.trim() || !activeMeeting) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    const updatedMeeting = {
      ...activeMeeting,
      chatMessages: [...activeMeeting.chatMessages, newMessage]
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
    setChatMessage('');
    
    toast({
      title: "ข้อความถูกส่งแล้ว",
      description: "ข้อความของคุณถูกส่งไปยังผู้เข้าร่วมทั้งหมด",
    });
  };

  const handleToggleRecording = () => {
    if (!activeMeeting) return;
    
    const updatedMeeting = {
      ...activeMeeting,
      isRecording: !activeMeeting.isRecording
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
    setIsRecording(!isRecording);
    
    toast({
      title: isRecording ? "หยุดบันทึก" : "เริ่มบันทึก",
      description: isRecording ? "การบันทึกถูกหยุดแล้ว" : "เริ่มบันทึกการประชุมแล้ว",
    });
  };

  const handleToggleScreenShare = () => {
    if (!activeMeeting) return;
    
    setIsScreenSharing(!isScreenSharing);
    
    const updatedMeeting = {
      ...activeMeeting,
      sharedScreen: !isScreenSharing ? {
        userId: currentUser.id,
        userName: currentUser.name,
        isActive: true
      } : undefined
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
    
    toast({
      title: isScreenSharing ? "หยุดแชร์หน้าจอ" : "เริ่มแชร์หน้าจอ",
      description: isScreenSharing ? "หยุดแชร์หน้าจอแล้ว" : "เริ่มแชร์หน้าจอแล้ว",
    });
  };

  const handleInviteParticipants = () => {
    if (!inviteEmails.trim() || !activeMeeting) return;
    
    const emailList = inviteEmails.split(',').map(email => email.trim()).filter(email => email);
    
    const updatedMeeting = {
      ...activeMeeting,
      invitedEmails: [...new Set([...activeMeeting.invitedEmails, ...emailList])]
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
    setIsInviteDialogOpen(false);
    setInviteEmails('');
    
    toast({
      title: "ส่งคำเชิญแล้ว",
      description: `ส่งคำเชิญไปยัง ${emailList.length} อีเมลแล้ว`,
    });
  };

  const handleCopyMeetingLink = (meetingLink: string) => {
    navigator.clipboard.writeText(meetingLink);
    toast({
      title: "คัดลอกลิงก์แล้ว",
      description: "ลิงก์การประชุมถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
  };

  const handleToggleMic = () => {
    if (!activeMeeting) return;
    
    const updatedParticipants = activeMeeting.participants.map(p => 
      p.id === currentUser.id ? { ...p, isMuted: !p.isMuted } : p
    );
    
    const updatedMeeting = {
      ...activeMeeting,
      participants: updatedParticipants
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
  };

  const handleToggleVideo = () => {
    if (!activeMeeting) return;
    
    const updatedParticipants = activeMeeting.participants.map(p => 
      p.id === currentUser.id ? { ...p, isVideoOn: !p.isVideoOn } : p
    );
    
    const updatedMeeting = {
      ...activeMeeting,
      participants: updatedParticipants
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
  };

  const handleRaiseHand = () => {
    if (!activeMeeting) return;
    
    const updatedParticipants = activeMeeting.participants.map(p => 
      p.id === currentUser.id ? { ...p, isHandRaised: !p.isHandRaised } : p
    );
    
    const updatedMeeting = {
      ...activeMeeting,
      participants: updatedParticipants
    };
    
    setActiveMeeting(updatedMeeting);
    setMeetings(meetings.map(m => m.id === activeMeeting.id ? updatedMeeting : m));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ห้องประชุมออนไลน์</h1>
            <p className="text-muted-foreground">จัดการการประชุม วิดีโอคอล และการนำเสนอ</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  สร้างห้องประชุม
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>สร้างห้องประชุมใหม่</DialogTitle>
                  <DialogDescription>
                    กรอกข้อมูลสำหรับสร้างห้องประชุมออนไลน์ใหม่
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="title">หัวข้อการประชุม *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="กรอกหัวข้อการประชุม"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">วันที่</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">เวลา</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">ระยะเวลา (นาที)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      min="15"
                      max="480"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">จำนวนผู้เข้าร่วมสูงสุด</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      min="2"
                      max="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">รหัสผ่าน (ไม่บังคับ)</Label>
                    <Input
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="กรอกรหัสผ่าน"
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="description">รายละเอียด</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="กรอกรายละเอียดการประชุม"
                      rows={3}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="col-span-full space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="waitingRoom"
                        checked={formData.waitingRoom}
                        onCheckedChange={(checked) => setFormData({ ...formData, waitingRoom: checked })}
                      />
                      <Label htmlFor="waitingRoom">เปิดห้องรอ</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button 
                    onClick={handleCreateMeeting}
                    disabled={!formData.title?.trim()}
                  >
                    สร้างห้องประชุม
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="meetings">ห้องประชุม</TabsTrigger>
          <TabsTrigger value="live" disabled={!activeMeeting}>
            ห้องประชุมปัจจุบัน
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ห้องประชุมทั้งหมด</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{meetings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">กำลังประชุม</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {meetings.filter(m => m.status === 'Live').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">กำหนดการ</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {meetings.filter(m => m.status === 'Scheduled').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">สิ้นสุดแล้ว</CardTitle>
                <Square className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {meetings.filter(m => m.status === 'Ended').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meetings Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายการห้องประชุม</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>หัวข้อ</TableHead>
                    <TableHead>ผู้จัด</TableHead>
                    <TableHead>วันที่-เวลา</TableHead>
                    <TableHead>ผู้เข้าร่วม</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-muted-foreground">{meeting.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{meeting.host}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {meeting.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {meeting.scheduledTime} ({meeting.duration} น.)
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {meeting.participants.filter(p => p.status === 'Joined').length} / {meeting.maxParticipants}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {meeting.status === 'Scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartMeeting(meeting.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              เริ่ม
                            </Button>
                          )}
                          {meeting.status === 'Live' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleJoinMeeting(meeting)}
                              >
                                เข้าร่วม
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleEndMeeting(meeting.id)}
                              >
                                <Square className="h-3 w-3 mr-1" />
                                จบ
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleCopyMeetingLink(meeting.meetingLink)}>
                                <Copy className="mr-2 h-4 w-4" />
                                คัดลอกลิงก์
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                แก้ไข
                              </DropdownMenuItem>
                              {meeting.recordingUrl && (
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  ดาวน์โหลดบันทึก
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          {activeMeeting && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Video Area */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        {activeMeeting.title}
                        {activeMeeting.isRecording && (
                          <Badge variant="destructive">
                            <div className="w-2 h-2 bg-white rounded-full mr-2" />
                            บันทึก
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleToggleScreenShare}
                          className={isScreenSharing ? 'bg-green-100' : ''}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          {isScreenSharing ? 'หยุดแชร์' : 'แชร์หน้าจอ'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleToggleRecording}
                          className={isRecording ? 'bg-red-100' : ''}
                        >
                          {isRecording ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          {isRecording ? 'หยุดบันทึก' : 'บันทึก'}
                        </Button>
                        
                        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-2" />
                              เชิญ
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>เชิญผู้เข้าร่วมประชุม</DialogTitle>
                              <DialogDescription>
                                ใส่อีเมลของผู้ที่ต้องการเชิญเข้าร่วมประชุม
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="inviteEmails">อีเมล (คั่นด้วยเครื่องหมายจุลภาค)</Label>
                                <Textarea
                                  id="inviteEmails"
                                  value={inviteEmails}
                                  onChange={(e) => setInviteEmails(e.target.value)}
                                  placeholder="user1@example.com, user2@example.com"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>ลิงก์การประชุม</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    value={activeMeeting.meetingLink} 
                                    readOnly 
                                    className="flex-1"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleCopyMeetingLink(activeMeeting.meetingLink)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                                ยกเลิก
                              </Button>
                              <Button onClick={handleInviteParticipants}>
                                ส่งคำเชิญ
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isPollDialogOpen} onOpenChange={setIsPollDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Vote className="h-4 w-4 mr-2" />
                              Poll
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>สร้าง Poll</DialogTitle>
                              <DialogDescription>
                                สร้างการโหวตสำหรับผู้เข้าร่วมประชุม
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="question">คำถาม</Label>
                                <Input
                                  id="question"
                                  value={pollData.question}
                                  onChange={(e) => setPollData({ ...pollData, question: e.target.value })}
                                  placeholder="กรอกคำถาม"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>ตัวเลือก</Label>
                                {pollData.options.map((option, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => updatePollOption(index, e.target.value)}
                                      placeholder={`ตัวเลือก ${index + 1}`}
                                    />
                                    {pollData.options.length > 2 && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removePollOption(index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button variant="outline" onClick={addPollOption}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  เพิ่มตัวเลือก
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                              <Button variant="outline" onClick={() => setIsPollDialogOpen(false)}>
                                ยกเลิก
                              </Button>
                              <Button 
                                onClick={handleCreatePoll}
                                disabled={!pollData.question.trim() || pollData.options.filter(o => o.trim()).length < 2}
                              >
                                สร้าง Poll
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Video Grid Simulation */}
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg">หน้าจอการประชุม</p>
                        <p className="text-sm opacity-70">จำลองพื้นที่แสดงวิดีโอของผู้เข้าร่วม</p>
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex justify-center gap-2 mt-4 flex-wrap">
                      <Button 
                        variant={currentUser.isMuted ? "destructive" : "outline"}
                        onClick={handleToggleMic}
                        size="sm"
                      >
                        {currentUser.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      
                      <Button 
                        variant={currentUser.isVideoOn ? "outline" : "destructive"}
                        onClick={handleToggleVideo}
                        size="sm"
                      >
                        {currentUser.isVideoOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                      </Button>
                      
                      <Button variant="outline" onClick={handleRaiseHand} size="sm">
                        <Hand className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="destructive" size="sm">
                        <PhoneOff className="h-4 w-4" />
                        ออกจากห้อง
                      </Button>
                    </div>
                    
                    {/* Chat Section */}
                    {isChatOpen && (
                      <div className="mt-4 border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">แชท</h4>
                          <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <ScrollArea className="h-48 mb-3">
                          <div className="space-y-2">
                            {activeMeeting.chatMessages.map((msg) => (
                              <div key={msg.id} className="text-sm">
                                <div className="flex justify-between items-start">
                                  <span className="font-medium text-primary">{msg.userName}</span>
                                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                                </div>
                                <div className="text-foreground mt-1">{msg.message}</div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="flex gap-2">
                          <Input
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="พิมพ์ข้อความ..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendChatMessage();
                              }
                            }}
                          />
                          <Button onClick={handleSendChatMessage} size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Polls */}
                {polls.filter(poll => poll.meetingId === activeMeeting.id && poll.isActive).map((poll) => (
                  <Card key={poll.id} className="mt-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Vote className="h-5 w-5" />
                        Poll: {poll.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {poll.options.map((option, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded">
                            <span>{option}</span>
                            <Badge variant="outline">
                              {Object.values(poll.votes).filter(vote => vote === option).length} votes
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Participants Sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    ผู้เข้าร่วม ({activeMeeting.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeMeeting.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{participant.name}</div>
                              {participant.isHandRaised && (
                                <Hand className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {participant.role}
                              {participant.joinTime && ` • ${participant.joinTime}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            participant.isMuted ? 'bg-red-500' : 'bg-green-500'
                          }`} title={participant.isMuted ? 'ปิดเสียง' : 'เปิดเสียง'} />
                          <div className={`w-2 h-2 rounded-full ${
                            participant.isVideoOn ? 'bg-green-500' : 'bg-gray-500'
                          }`} title={participant.isVideoOn ? 'เปิดวิดีโอ' : 'ปิดวิดีโอ'} />
                          <div className={`w-2 h-2 rounded-full ${
                            participant.connectionQuality === 'Good' ? 'bg-green-500' :
                            participant.connectionQuality === 'Fair' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} title={`สัญญาณ: ${participant.connectionQuality}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          เชิญผู้เข้าร่วม
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>เชิญผู้เข้าร่วมประชุม</DialogTitle>
                          <DialogDescription>
                            ใส่อีเมลของผู้ที่ต้องการเชิญเข้าร่วมประชุม
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="inviteEmails">อีเมล (คั่นด้วยเครื่องหมายจุลภาค)</Label>
                            <Textarea
                              id="inviteEmails"
                              value={inviteEmails}
                              onChange={(e) => setInviteEmails(e.target.value)}
                              placeholder="user1@example.com, user2@example.com"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                            ยกเลิก
                          </Button>
                          <Button onClick={handleInviteParticipants}>
                            ส่งคำเชิญ
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCopyMeetingLink(activeMeeting.meetingLink)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      คัดลอกลิงก์
                    </Button>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      รายงานการเข้าร่วม
                    </Button>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      ดาวน์โหลดบันทึก
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}