import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string;
  host: string;
  participants: Participant[];
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
    participants: [
      {
        id: '1',
        name: 'สมชาย ใจดี',
        email: 'somchai@company.com',
        role: 'Host',
        status: 'Joined',
        joinTime: '09:00',
        isMuted: false,
        isVideoOn: true
      },
      {
        id: '2',
        name: 'นภา สว่างใส',
        email: 'napa@company.com',
        role: 'Participant',
        status: 'Joined',
        joinTime: '09:02',
        isMuted: true,
        isVideoOn: true
      }
    ],
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
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Demo โครงการใหม่',
    description: 'นำเสนอระบบใหม่ให้ลูกค้า',
    host: 'นภา สว่างใส',
    participants: [
      {
        id: '2',
        name: 'นภา สว่างใส',
        email: 'napa@company.com',
        role: 'Host',
        status: 'Invited',
        isMuted: false,
        isVideoOn: false
      }
    ],
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
    createdAt: '2024-01-22'
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
  const [currentTab, setCurrentTab] = useState('meetings');
  const [formData, setFormData] = useState<Partial<Meeting>>({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    password: '',
    waitingRoom: true,
    maxParticipants: 50
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
      maxParticipants: 50
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>สร้างห้องประชุมใหม่</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title">หัวข้อการประชุม *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="กรอกหัวข้อการประชุม"
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
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">รายละเอียด</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="กรอกรายละเอียดการประชุม"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2 space-y-4">
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleCreateMeeting}>
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
                              <DropdownMenuItem>
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
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          แชร์หน้าจอ
                        </Button>
                        <Dialog open={isPollDialogOpen} onOpenChange={setIsPollDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Vote className="h-4 w-4 mr-2" />
                              Poll
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>สร้าง Poll</DialogTitle>
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
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsPollDialogOpen(false)}>
                                ยกเลิก
                              </Button>
                              <Button onClick={handleCreatePoll}>
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
                    <div className="flex justify-center gap-4 mt-4">
                      <Button variant="outline">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive">
                        ออกจากห้อง
                      </Button>
                    </div>
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
                          <div>
                            <div className="text-sm font-medium">{participant.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {participant.role}
                              {participant.joinTime && ` • ${participant.joinTime}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            participant.isMuted ? 'bg-red-500' : 'bg-green-500'
                          }`} />
                          <div className={`w-2 h-2 rounded-full ${
                            participant.isVideoOn ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      เชิญผู้เข้าร่วม
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      รายงานการเข้าร่วม
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