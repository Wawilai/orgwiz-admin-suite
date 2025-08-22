import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
import {
  LayoutDashboard,
  Users,
  Building2,
  Globe,
  UserCheck,
  Shield,
  Database,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  Video,
  HardDrive,
  Package,
  CreditCard,
  FileKey,
  BarChart3,
  Settings,
  User,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "แดชบอร์ด", url: "/", icon: LayoutDashboard },
  { title: "จัดการผู้ใช้งาน", url: "/users", icon: Users },
  { title: "จัดการองค์กร", url: "/organizations", icon: Building2 },
  { title: "หน่วยงาน", url: "/organization-units", icon: Building2 },
  { title: "จัดการโดเมน", url: "/domains", icon: Globe },
  { title: "จัดการสิทธิ์", url: "/roles", icon: UserCheck },
  { title: "จัดการ Quota", url: "/quotas", icon: Database },
  { title: "บริการอีเมล", url: "/mail-service", icon: Mail },
  { title: "Mail Relay", url: "/mail-relay", icon: Zap },
  { title: "สมุดที่อยู่", url: "/address-book", icon: Users },
  { title: "ปฏิทิน", url: "/calendar", icon: Calendar },
  { title: "แชท", url: "/chat", icon: MessageSquare },
  { title: "ประชุมออนไลน์", url: "/meetings", icon: Video },
  { title: "พื้นที่จัดเก็บ", url: "/storage", icon: HardDrive },
  { title: "จัดการแพ็กเกจ", url: "/packages", icon: Package },
  { title: "การเรียกเก็บเงิน", url: "/billing", icon: CreditCard },
  { title: "จัดการไลเซ้นส์", url: "/licenses", icon: FileKey },
  { title: "รายงาน", url: "/reports", icon: BarChart3 },
  { title: "ตั้งค่าระบบ", url: "/system-settings", icon: Settings },
  { title: "ตั้งค่าบัญชี", url: "/account-settings", icon: User },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center transition-colors";
    if (collapsed) {
      return cn(
        baseClass,
        "justify-center py-3",
        isActive(path) 
          ? "bg-sidebar-accent text-sidebar-primary" 
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
      );
    } else {
      return cn(
        baseClass,
        "px-3 py-2",
        isActive(path)
          ? "bg-sidebar-accent text-sidebar-primary font-medium"
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
      );
    }
  };

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-60"}
      collapsible="icon"
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">Enterprise</span>
          </div>
        )}
        <SidebarTrigger className="hover:bg-sidebar-accent/50" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Enterprise Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClass(item.url)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "h-4 w-4",
                        collapsed ? "mx-auto" : "mr-2"
                      )} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}