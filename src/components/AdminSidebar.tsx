import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
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
    title: "nav.dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    standalone: true
  },
  {
    title: "sidebar.userManagement",
    icon: Building2,
    items: [
      { title: "nav.users", url: "/users", icon: Users },
      { title: "nav.organizations", url: "/organizations", icon: Building2 },
      { title: "nav.organizationUnits", url: "/organization-units", icon: Building2 },
      { title: "nav.domains", url: "/domains", icon: Globe },
      { title: "nav.roles", url: "/roles", icon: UserCheck },
      { title: "nav.quotas", url: "/quotas", icon: Database }
    ]
  },
  {
    title: "sidebar.services",
    icon: Mail,
    items: [
      { title: "nav.mailService", url: "/mail-service", icon: Mail },
      { title: "nav.mailRelay", url: "/mail-relay", icon: Zap },
      { title: "nav.addressBook", url: "/address-book", icon: Users },
      { title: "nav.calendar", url: "/calendar", icon: Calendar },
      { title: "nav.chat", url: "/chat", icon: MessageSquare },
      { title: "nav.meetings", url: "/meetings", icon: Video },
      { title: "nav.storage", url: "/storage", icon: HardDrive }
    ]
  },
  {
    title: "sidebar.collaboration",
    icon: CreditCard,
    items: [
      { title: "nav.packages", url: "/packages", icon: Package },
      { title: "nav.billing", url: "/billing", icon: CreditCard },
      { title: "nav.licenses", url: "/licenses", icon: FileKey }
    ]
  },
  {
    title: "sidebar.businessManagement",
    icon: BarChart3,
    items: [
      { title: "nav.reports", url: "/reports", icon: BarChart3 }
    ]
  },
  {
    title: "sidebar.systemManagement",
    icon: Settings,
    items: [
      { title: "nav.settings", url: "/system-settings", icon: Settings },
      { title: "account.title", url: "/account-settings", icon: User }
    ]
  }
];

export function AdminSidebar() {
  const { t } = useLanguage();
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
        {menuItems.map((group) => {
          // Handle standalone items (like Dashboard)
          if (group.standalone) {
            return (
              <div key={group.title} className="mb-0">
                <SidebarMenuButton asChild>
                  <NavLink
                    to={group.url!}
                    className={getNavClass(group.url!)}
                    title={collapsed ? t(group.title) : undefined}
                  >
                    <group.icon className={cn(
                      "h-5 w-5",
                      collapsed ? "mx-auto" : "mr-3"
                    )} />
                    {!collapsed && <span className="text-base">{t(group.title)}</span>}
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
                      {t(group.title)}
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
                          title={collapsed ? t(item.title) : undefined}
                        >
                          <item.icon className={cn(
                            "h-4 w-4",
                            collapsed ? "mx-auto" : "mr-3"
                          )} />
                          {!collapsed && <span className="text-base">{t(item.title)}</span>}
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
                        title={t(item.title)}
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