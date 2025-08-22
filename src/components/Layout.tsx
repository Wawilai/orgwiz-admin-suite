import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const { permissions, loading: permLoading } = usePermissions();

  // Handle authentication redirect with useEffect to prevent race conditions
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("ออกจากระบบสำเร็จ");
      navigate("/");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  // Don't render anything if not authenticated (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider 
      defaultOpen={true}
    >
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-10">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <SidebarTrigger className="flex-shrink-0" />
              <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
                Enterprise Management System
              </h1>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ค้นหา..."
                  className="pl-10 w-48 xl:w-64"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 bg-destructive rounded-full"></span>
              </Button>
              
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-7 w-7 md:h-8 md:w-8 rounded-full flex-shrink-0">
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                      <AvatarFallback className="text-xs md:text-sm">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover border shadow-lg z-50" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.full_name || "Admin User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "admin@company.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate('/account-settings')}
                    className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>โปรไฟล์</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="focus:bg-accent focus:text-accent-foreground cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/10 p-3 md:p-6">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}