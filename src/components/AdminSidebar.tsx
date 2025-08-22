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
import { Badge } from "@/components/ui/badge";
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
    badge: null
  },
  {
    title: "การจัดการระบบ",
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
    items: [
      { title: "จัดการแพ็กเกจ", url: "/packages", icon: Package },
      { title: "การเรียกเก็บเงิน", url: "/billing", icon: CreditCard },
      { title: "จัดการไลเซ้นส์", url: "/licenses", icon: FileKey }
    ]
  },
  {
    title: "รายงานและวิเคราะห์",
    items: [
      { title: "รายงาน", url: "/reports", icon: BarChart3 }
    ]
  },
  {
    title: "ระบบ",
    items: [
      { title: "ตั้งค่าระบบ", url: "/system-settings", icon: Settings },
      { title: "ตั้งค่าบัญชี", url: "/account-settings", icon: User }
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    // Auto-expand group containing current route
    const activeGroup = menuItems.find(group => 
      group.items?.some(item => item.url === currentPath)
    );
    return activeGroup ? [activeGroup.title] : [];
  });

  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const getNavClassName = (path: string) => {
    return cn(
      "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out relative overflow-hidden",
      "hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:shadow-sm hover:scale-[1.02]",
      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:scale-[1.02]",
      "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-700",
      isActive(path)
        ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary border border-primary/20 shadow-md shadow-primary/10 font-semibold"
        : "text-sidebar-foreground hover:text-primary"
    );
  };

  const getGroupButtonClassName = (groupTitle: string) => {
    const isExpanded = expandedGroups.includes(groupTitle);
    const hasActiveItem = menuItems.find(group => group.title === groupTitle)?.items?.some(item => isActive(item.url));
    
    return cn(
      "group flex items-center justify-between w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ease-out",
      "hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/5 hover:shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      hasActiveItem || isExpanded
        ? "bg-gradient-to-r from-accent/15 to-primary/8 text-primary shadow-sm"
        : "text-sidebar-foreground/80 hover:text-primary"
    );
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border bg-gradient-to-b from-sidebar-background to-sidebar-background/90 backdrop-blur-sm",
        "shadow-lg transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72"
      )}
      collapsible="icon"
    >
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border/50 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm",
        collapsed ? "justify-center p-2" : "justify-between p-4"
      )}>
        {!collapsed && (
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">Enterprise</h1>
              <p className="text-xs text-sidebar-foreground/60">Management Suite</p>
            </div>
          </div>
        )}
        <SidebarTrigger className="hover:bg-sidebar-accent/50 hover:scale-110 transition-all duration-200 rounded-lg p-2" />
      </div>

      <SidebarContent className="px-3 py-4 space-y-2">
        {/* Dashboard - Single Item */}
        <div className="mb-4">
          <NavLink
            to={menuItems[0].url}
            className={getNavClassName(menuItems[0].url)}
          >
            {(() => {
              const IconComponent = menuItems[0].icon;
              return (
                <IconComponent className={cn(
                  "transition-all duration-300 flex-shrink-0",
                  collapsed ? "h-6 w-6 mx-auto" : "h-5 w-5 mr-3",
                  isActive(menuItems[0].url) ? "text-primary drop-shadow-sm" : ""
                )} />
              );
            })()}
            {!collapsed && (
              <span className="animate-fade-in">{menuItems[0].title}</span>
            )}
            {!collapsed && menuItems[0].badge && (
              <Badge className="ml-auto animate-fade-in bg-primary/20 text-primary">
                {menuItems[0].badge}
              </Badge>
            )}
          </NavLink>
        </div>

        {/* Grouped Items */}
        {menuItems.slice(1).map((group) => {
          const isExpanded = expandedGroups.includes(group.title);
          const hasActiveItem = group.items?.some(item => isActive(item.url));
          
          return (
            <SidebarGroup key={group.title} className="space-y-1">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={getGroupButtonClassName(group.title)}
                >
                  <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest">
                    {group.title}
                  </SidebarGroupLabel>
                  <div className={cn(
                    "transition-transform duration-300 ease-out",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
              )}

              <SidebarGroupContent className={cn(
                "transition-all duration-500 ease-out overflow-hidden ml-2",
                !collapsed && isExpanded 
                  ? "max-h-96 opacity-100 mt-2 animate-accordion-down" 
                  : "max-h-0 opacity-0",
                collapsed ? "max-h-96 opacity-100 mt-2" : ""
              )}>
                <SidebarMenu className="space-y-1">
                  {group.items?.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={getNavClassName(item.url)}
                          title={collapsed ? item.title : undefined}
                        >
                          {(() => {
                            const IconComponent = item.icon;
                            return (
                              <IconComponent className={cn(
                                "transition-all duration-300 flex-shrink-0",
                                collapsed ? "h-6 w-6 mx-auto" : "h-4 w-4 mr-3",
                                isActive(item.url) ? "text-primary drop-shadow-sm scale-110" : ""
                              )} />
                            );
                          })()}
                          {!collapsed && (
                            <span className="animate-fade-in truncate">
                              {item.title}
                            </span>
                          )}
                          {isActive(item.url) && (
                            <div className="ml-auto flex items-center space-x-2">
                              {!collapsed && (
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              )}
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-l-full" />
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Sidebar Footer */}
      <div className={cn(
        "border-t border-sidebar-border/50 bg-gradient-to-r from-primary/5 to-accent/5 p-3 mt-auto",
        collapsed ? "px-2" : "px-4"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sidebar-background/50 to-transparent backdrop-blur-sm border border-sidebar-border/30",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-sm">
            <User className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 animate-fade-in">
              <p className="text-sm font-semibold text-sidebar-foreground">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60">admin@system.com</p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}