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
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userPermissions?: any;
}

const menuItems = [
  {
    title: "แดชบอร์ด",
    url: "/dashboard",
    icon: LayoutDashboard,
    standalone: true
  },
  {
    title: "การจัดการระบบ",
    icon: Building2,
    permission: "users", // Combined permission for system management
    items: [
      { title: "จัดการผู้ใช้งาน", url: "/users", icon: Users, permission: "users" },
      { title: "มอบหมายบทบาท", url: "/user-roles", icon: ShieldCheck, permission: "roles" },
      { title: "จัดการกลุ่ม", url: "/groups", icon: Users, permission: "users" },
      { title: "จัดการองค์กร", url: "/organizations", icon: Building2, permission: "organizations" },
      { title: "หน่วยงาน", url: "/organization-units", icon: Building2, permission: "organizations" },
      { title: "จัดการโดเมน", url: "/domains", icon: Globe, permission: "domains" },
      { title: "จัดการสิทธิ์", url: "/roles", icon: UserCheck, permission: "roles" },
      { title: "จัดการ Quota", url: "/quotas", icon: Database, permission: "storage" }
    ]
  },
  {
    title: "บริการหลัก",
    icon: Mail,
    items: [
      { title: "บริการอีเมล", url: "/mail-service", icon: Mail, permission: "domains" },
      { title: "Mail Relay", url: "/mail-relay", icon: Zap, permission: "domains" },
      { title: "สมุดที่อยู่", url: "/address-book", icon: Users },
      { title: "ปฏิทิน", url: "/calendar", icon: Calendar },
      { title: "แชท", url: "/chat", icon: MessageSquare },
      { title: "ประชุมออนไลน์", url: "/meetings", icon: Video },
      { title: "พื้นที่จัดเก็บ", url: "/storage", icon: HardDrive, permission: "storage" }
    ]
  },
  {
    title: "ธุรกิจและบัญชี",
    icon: CreditCard,
    permission: "billing",
    items: [
      { title: "จัดการแพ็กเกจ", url: "/packages", icon: Package, permission: "billing" },
      { title: "การเรียกเก็บเงิน", url: "/billing", icon: CreditCard, permission: "billing" },
      { title: "จัดการไลเซ้นส์", url: "/licenses", icon: FileKey, permission: "system" }
    ]
  },
  {
    title: "รายงานและวิเคราะห์",
    icon: BarChart3,
    permission: "reports",
    items: [
      { title: "รายงาน", url: "/reports", icon: BarChart3, permission: "reports" }
    ]
  },
  {
    title: "ตั้งค่าระบบ",
    icon: Settings,
    permission: "system",
    items: [
      { title: "จัดการข้อมูลหลัก", url: "/master-data", icon: Database, permission: "system" },
      { title: "จัดการเซิร์ฟเวอร์", url: "/system-settings", icon: Settings, permission: "system" },
      { title: "ความปลอดภัย MFA", url: "/mfa-settings", icon: ShieldCheck },
      { title: "ตั้งค่าบัญชี", url: "/account-settings", icon: User }
    ]
  }
];

export function AdminSidebar({ userPermissions }: AdminSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const { canAccessModule } = usePermissions();
  
  const filteredMenuItems = menuItems.filter(item => {
    if (item.standalone) return true; // Dashboard is always visible
    if (!item.permission) return true; // Items without permission are visible to all
    return canAccessModule(item.permission);
  });

  const filteredItems = filteredMenuItems.map(item => {
    if (!item.items) return item;
    
    const filteredSubItems = item.items.filter((subItem: any) => {
      if (!subItem.permission) return true; // Items without permission are visible to all
      return canAccessModule(subItem.permission);
    });
    
    return {
      ...item,
      items: filteredSubItems
    };
  }).filter(item => item.standalone || (item.items && item.items.length > 0));
  
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    // Auto-expand group containing current route
    const activeGroup = filteredItems.find(group => 
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
      "flex items-center transition-colors rounded-md w-full",
      collapsed ? "justify-center py-2 px-1" : "px-2 md:px-3 py-1.5 md:py-2",
      isActive(path)
        ? "bg-sidebar-accent text-sidebar-primary font-medium"
        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
    );
  };

  const getGroupHeaderClass = (groupTitle: string, hasActiveItem: boolean) => {
    return cn(
      "flex items-center justify-between w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-medium transition-colors rounded-md",
      "hover:bg-sidebar-accent/30",
      hasActiveItem 
        ? "text-sidebar-primary bg-sidebar-accent/20" 
        : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
    );
  };

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
      side="left"
    >
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-sidebar-primary" />
            <span className="font-semibold text-sm md:text-base text-sidebar-foreground">Enterprise</span>
          </div>
        )}
        {collapsed && (
          <Building2 className="w-5 h-5 text-sidebar-primary mx-auto" />
        )}
      </div>

      <SidebarContent className={cn(
        "overflow-y-auto",
        collapsed ? "px-1 py-2" : "px-2 md:px-3 py-2"
      )}>
        {filteredItems.map((group) => {
          // Handle standalone items (like Dashboard)
          if (group.standalone) {
            return (
              <div key={group.title} className="mb-0">
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
                    {!collapsed && <span className="text-sm">{group.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </div>
            );
          }

          // Handle grouped items
          const isExpanded = expandedGroups.includes(group.title);
          const hasActiveItem = group.items?.some(item => isActive(item.url));

          return (
            <SidebarGroup key={group.title} className={collapsed ? "mb-0" : "mb-0.5"}>
              {/* Group Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={getGroupHeaderClass(group.title, hasActiveItem)}
                >
                  <div className="flex items-center">
                    <group.icon className="h-4 w-4 mr-2" />
                    <SidebarGroupLabel className="text-sm font-semibold uppercase tracking-wide">
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
                !collapsed && isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                collapsed ? "max-h-96 opacity-100" : ""
              )}>
                <SidebarMenu className="space-y-px">
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
                          {!collapsed && <span className="text-sm">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>

              {/* Show icons only when collapsed */}
              {collapsed && group.items && (
                <div className="space-y-px">
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