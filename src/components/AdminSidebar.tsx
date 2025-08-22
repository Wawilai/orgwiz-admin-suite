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
  {
    title: "แดชบอร์ด",
    url: "/",
    icon: LayoutDashboard,
    standalone: true
  },
  {
    title: "การจัดการระบบ",
    icon: Building2,
    items: [
      { title: "จัดการผู้ใช้งาน", url: "/users", icon: Users },
      { title: "จัดการองค์กร", url: "/organizations", icon: Building2 },
      { title: "หน่วยงาน", url: "/organization-units", icon: Building2 },
      { title: "จัดการโดเมน", url: "/domains", icon: Globe },
      { title: "จัดการสิทธิ์", url: "/roles", icon: UserCheck },
      { title: "จัดการ Quota", url: "/quotas", icon: Database }
    ]
  },
  {
    title: "บริการหลัก",
    icon: Mail,
    items: [
      { title: "บริการอีเมล", url: "/mail-service", icon: Mail },
      { title: "Mail Relay", url: "/mail-relay", icon: Zap },
      { title: "สมุดที่อยู่", url: "/address-book", icon: Users },
      { title: "ปฏิทิน", url: "/calendar", icon: Calendar },
      { title: "แชท", url: "/chat", icon: MessageSquare },
      { title: "ประชุมออนไลน์", url: "/meetings", icon: Video },
      { title: "พื้นที่จัดเก็บ", url: "/storage", icon: HardDrive }
    ]
  },
  {
    title: "ธุรกิจและบัญชี",
    icon: CreditCard,
    items: [
      { title: "จัดการแพ็กเกจ", url: "/packages", icon: Package },
      { title: "การเรียกเก็บเงิน", url: "/billing", icon: CreditCard },
      { title: "จัดการไลเซ้นส์", url: "/licenses", icon: FileKey }
    ]
  },
  {
    title: "รายงานและวิเคราะห์",
    icon: BarChart3,
    items: [
      { title: "รายงาน", url: "/reports", icon: BarChart3 }
    ]
  },
  {
    title: "ตั้งค่าระบบ",
    icon: Settings,
    items: [
      { title: "ตั้งค่าระบบ", url: "/system-settings", icon: Settings },
      { title: "ตั้งค่าบัญชี", url: "/account-settings", icon: User }
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    // Auto-expand group containing current route
    const activeGroup = menuItems.find(group => 
      group.items?.some(item => item.url === location.pathname)
    );
    return activeGroup ? [activeGroup.title] : [];
  });

  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const getNavClass = (path: string) => {
    return cn(
      "flex items-center transition-colors rounded-md",
      collapsed ? "justify-center py-3 px-2" : "px-3 py-2",
      isActive(path)
        ? "bg-sidebar-accent text-sidebar-primary font-medium"
        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
    );
  };

  const getGroupHeaderClass = (groupTitle: string, hasActiveItem: boolean) => {
    return cn(
      "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors rounded-md",
      "hover:bg-sidebar-accent/30",
      hasActiveItem 
        ? "text-sidebar-primary bg-sidebar-accent/20" 
        : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
    );
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

      <SidebarContent className="px-2 py-4">
        {menuItems.map((group) => {
          // Handle standalone items (like Dashboard)
          if (group.standalone) {
            return (
              <div key={group.title} className="mb-2">
                <SidebarMenuButton asChild>
                  <NavLink
                    to={group.url!}
                    className={getNavClass(group.url!)}
                    title={collapsed ? group.title : undefined}
                  >
                    <group.icon className={cn(
                      "h-5 w-5",
                      collapsed ? "mx-auto" : "mr-3"
                    )} />
                    {!collapsed && <span>{group.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </div>
            );
          }

          // Handle grouped items
          const isExpanded = expandedGroups.includes(group.title);
          const hasActiveItem = group.items?.some(item => isActive(item.url));

          return (
            <SidebarGroup key={group.title} className="mb-4">
              {/* Group Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={getGroupHeaderClass(group.title, hasActiveItem)}
                >
                  <div className="flex items-center">
                    <group.icon className="h-4 w-4 mr-2" />
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
                      {group.title}
                    </SidebarGroupLabel>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                  )}
                </button>
              )}

              {/* Group Items */}
              <SidebarGroupContent className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                !collapsed && isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0",
                collapsed ? "max-h-96 opacity-100 mt-1" : ""
              )}>
                <SidebarMenu className="space-y-1">
                  {group.items?.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={getNavClass(item.url)}
                          title={collapsed ? item.title : undefined}
                        >
                          <item.icon className={cn(
                            "h-4 w-4",
                            collapsed ? "mx-auto" : "mr-3"
                          )} />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>

              {/* Show icons only when collapsed */}
              {collapsed && group.items && (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarMenuButton key={item.title} asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClass(item.url)}
                        title={item.title}
                      >
                        <item.icon className="h-5 w-5 mx-auto" />
                      </NavLink>
                    </SidebarMenuButton>
                  ))}
                </div>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}