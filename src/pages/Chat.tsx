import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  Search, 
  Plus, 
  Users, 
  Phone, 
  Video,
  MoreVertical,
  Settings,
  UserPlus,
  Archive,
  Trash2
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileName?: string;
  fileSize?: string;
}

interface Chat {
  id: string;
  type: 'individual' | 'group';
  name: string;
  participants: string[];
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
  messages: Message[];
}

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(chats[0]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchChats();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, avatar_url')
        .neq('user_id', user?.id);
      
      if (error) throw error;
      
      const formattedUsers = data?.map(profile => ({
        id: profile.user_id,
        name: `${profile.first_name} ${profile.last_name}`,
        avatar: profile.avatar_url || '',
        isOnline: Math.random() > 0.5 // Mock online status
      })) || [];
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchChats = async () => {
    try {
      // For now, we'll use mock data structure but you can extend to real database
      // This would typically involve creating a groups table with chat functionality
      setChats([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      senderName: 'ฉัน',
      content: message,
      timestamp: new Date().toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'text'
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: message,
      lastMessageTime: newMessage.timestamp
    };

    setChats(chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ));
    setActiveChat(updatedChat);
    setMessage('');
  };

  const handleCreateIndividualChat = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    if (!selectedUser) return;

    const existingChat = chats.find(chat => 
      chat.type === 'individual' && 
      chat.participants.includes(userId)
    );

    if (existingChat) {
      setActiveChat(existingChat);
      setIsNewChatDialogOpen(false);
      return;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      type: 'individual',
      name: selectedUser.name,
      participants: [userId, user?.id || ''],
      unreadCount: 0,
      isOnline: selectedUser.isOnline,
      messages: []
    };

    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setIsNewChatDialogOpen(false);
    toast({
      title: "สร้างแชทสำเร็จ",
      description: `เริ่มต้นแชทกับ ${selectedUser.name} แล้ว`,
    });
  };

  const handleCreateGroupChat = () => {
    if (!newGroupName.trim() || selectedUsers.length === 0) return;

    const newChat: Chat = {
      id: Date.now().toString(),
      type: 'group',
      name: newGroupName,
      participants: [...selectedUsers, user?.id || ''],
      unreadCount: 0,
      messages: []
    };

    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setIsGroupDialogOpen(false);
    setNewGroupName('');
    setSelectedUsers([]);
    toast({
      title: "สร้างกลุ่มสำเร็จ",
      description: `สร้างกลุ่ม "${newGroupName}" เรียบร้อยแล้ว`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-8rem)]">
      <div className="flex gap-6 h-full">
        {/* Chat List Sidebar */}
        <Card className="w-80 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                แชท
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsNewChatDialogOpen(true)}>
                    แชทใหม่
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsGroupDialogOpen(true)}>
                    สร้างกลุ่ม
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาแชท..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeChat?.id === chat.id
                        ? 'bg-primary/10 border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>
                            {chat.type === 'group' ? (
                              <Users className="h-4 w-4" />
                            ) : (
                              chat.name.charAt(0)
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {chat.type === 'individual' && chat.isOnline && (
                          <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate">{chat.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {chat.lastMessageTime}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage || 'ยังไม่มีข้อความ'}
                          </div>
                          {chat.unreadCount > 0 && (
                            <Badge className="text-xs px-2 py-0">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={activeChat.avatar} />
                      <AvatarFallback>
                        {activeChat.type === 'group' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          activeChat.name.charAt(0)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{activeChat.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {activeChat.type === 'group'
                          ? `${activeChat.participants.length} สมาชิก`
                          : activeChat.isOnline
                          ? 'ออนไลน์'
                          : 'ออฟไลน์'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Settings className="mr-2 h-4 w-4" />
                              ตั้งค่าแชท
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ตั้งค่าแชท</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>การแจ้งเตือน</Label>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="sound-notification" defaultChecked className="rounded" />
                                    <Label htmlFor="sound-notification">เสียงแจ้งเตือน</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="desktop-notification" defaultChecked className="rounded" />
                                    <Label htmlFor="desktop-notification">การแจ้งเตือนบนเดสก์ท็อป</Label>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="auto-archive">การเก็บข้อความอัตโนมัติ</Label>
                                <Select defaultValue="30days">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="7days">7 วัน</SelectItem>
                                    <SelectItem value="30days">30 วัน</SelectItem>
                                    <SelectItem value="90days">90 วัน</SelectItem>
                                    <SelectItem value="never">ไม่เก็บ</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button>บันทึก</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {activeChat.type === 'group' && (
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            เพิ่มสมาชิก
                          </DropdownMenuItem>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Archive className="mr-2 h-4 w-4" />
                              เก็บแชท
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>แชทที่เก็บไว้</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              <div className="space-y-2">
                                <div className="p-3 border rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">แชทกับ วิชัย เก่งกาจ</div>
                                      <div className="text-sm text-muted-foreground">เก็บเมื่อ: 15 มกราคม 2024</div>
                                      <div className="text-sm text-muted-foreground">ข้อความสุดท้าย: ขอบคุณครับ</div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">กู้คืน</Button>
                                      <Button size="sm" variant="destructive">ลบ</Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3 border rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">กลุ่ม โครงการเก่า</div>
                                      <div className="text-sm text-muted-foreground">เก็บเมื่อ: 10 มกราคม 2024</div>
                                      <div className="text-sm text-muted-foreground">สมาชิก: 5 คน</div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">กู้คืน</Button>
                                      <Button size="sm" variant="destructive">ลบ</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline">ปิด</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบแชท
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    {activeChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.senderId === 'current-user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {activeChat.type === 'group' && msg.senderId !== 'current-user' && (
                            <div className="text-xs font-medium mb-1 opacity-70">
                              {msg.senderName}
                            </div>
                          )}
                          <div>{msg.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              msg.senderId === 'current-user'
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="พิมพ์ข้อความ..."
                      className="resize-none"
                      rows={1}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">เลือกแชทเพื่อเริ่มการสนทนา</h3>
                <p className="text-muted-foreground">เลือกแชทจากรายการด้านซ้าย หรือสร้างแชทใหม่</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แชทใหม่</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
              <div className="space-y-2 p-4">
                {users.map((chatUser) => (
                  <div
                    key={chatUser.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                    onClick={() => handleCreateIndividualChat(chatUser.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={chatUser.avatar} />
                        <AvatarFallback>{chatUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {chatUser.isOnline && (
                        <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{chatUser.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {chatUser.isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Group Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างกลุ่มใหม่</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">ชื่อกลุ่ม</Label>
              <Input
                id="groupName"
                placeholder="กรอกชื่อกลุ่ม"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>เลือกสมาชิก</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users.map((chatUser) => (
                  <div
                    key={chatUser.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                      selectedUsers.includes(chatUser.id)
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleUserSelection(chatUser.id)}
                  >
                    <Avatar>
                      <AvatarImage src={chatUser.avatar} />
                      <AvatarFallback>{chatUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{chatUser.name}</div>
                    </div>
                    {selectedUsers.includes(chatUser.id) && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleCreateGroupChat}
              disabled={!newGroupName.trim() || selectedUsers.length === 0}
            >
              สร้างกลุ่ม
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}