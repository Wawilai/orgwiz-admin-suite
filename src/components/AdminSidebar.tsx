import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  Users,
  Shield,
  Settings,
  BarChart3,
  Mail,
  MessageSquare,
  Calendar,
  Video,
  HardDrive,
  CreditCard,
  Key,
  FileText,
  Server,
  User,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "การจัดการระบบองค์กร",
    icon: Building2,
    children: [
      { title: "องค์กร", url: "/organizations", icon: Building2 },
      { title: "หน่วยงาน (OU)", url: "/organization-units", icon: Users },
      { title: "จัดการโดเมน", url: "/domains", icon: Server },
    ],
  },
  {
    title: "บัญชีผู้ใช้และสิทธิ์",
    icon: Users,
    children: [
      { title: "จัดการผู้ใช้", url: "/users", icon: Users },
      { title: "บทบาทและสิทธิ์", url: "/roles", icon: Shield },
      { title: "จัดการโควต้า", url: "/quotas", icon: BarChart3 },
    ],
  },
  {
    title: "บริการองค์กร",
    icon: Mail,
    children: [
      { title: "บริการอีเมล", url: "/mail-service", icon: Mail },
      { title: "Mail Relay", url: "/mail-relay", icon: Mail },
      { title: "สมุดที่อยู่", url: "/address-book", icon: User },
      { title: "ปฏิทิน", url: "/calendar", icon: Calendar },
      { title: "แชท", url: "/chat", icon: MessageSquare },
      { title: "ประชุมออนไลน์", url: "/meetings", icon: Video },
      { title: "พื้นที่จัดเก็บ", url: "/storage", icon: HardDrive },
    ],
  },
  {
    title: "การเงินและแพ็กเกจ",
    icon: CreditCard,
    children: [
      { title: "จัดการแพ็กเกจ", url: "/packages", icon: CreditCard },
      { title: "การเรียกเก็บเงิน", url: "/billing", icon: FileText },
      { title: "จัดการใบอนุญาต", url: "/licenses", icon: Key },
    ],
  },
  {
    title: "รายงานและวิเคราะห์",
    icon: BarChart3,
    children: [
      { title: "รายงานและวิเคราะห์", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "ระบบและเซิร์ฟเวอร์",
    icon: Server,
    children: [
      { title: "ตั้งค่าระบบ", url: "/system-settings", icon: Server },
      { title: "ตั้งค่าบัญชี", url: "/account-settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  const collapsed = state === "collapsed";

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((title) => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupExpanded = (groupTitle: string) => expandedGroups.includes(groupTitle);

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
          </div>
        )}
        <SidebarTrigger className="hover:bg-sidebar-accent/50" />
      </div>

      <SidebarContent className="p-2">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <div
              className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-sidebar-accent/30 rounded-md"
              onClick={() => !collapsed && toggleGroup(group.title)}
            >
              <div className="flex items-center space-x-2">
                <group.icon className={`w-4 h-4 text-sidebar-foreground ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && (
                  <SidebarGroupLabel className="text-sidebar-foreground text-sm font-medium">
                    {group.title}
                  </SidebarGroupLabel>
                )}
              </div>
              {!collapsed && group.children && (
                <div>
                  {isGroupExpanded(group.title) ? (
                    <ChevronDown className="w-4 h-4 text-sidebar-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
                  )}
                </div>
              )}
            </div>

            {(!collapsed && isGroupExpanded(group.title) && group.children) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.children.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url || "#"} className={getNavClass}>
                          <item.icon className="w-4 h-4 mr-2" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}