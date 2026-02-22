import {
  LayoutDashboard,
  Users,
  Upload,
  MessageSquare,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: Users },
  { title: "Counseling", url: "/counseling", icon: MessageSquare },
];

const adminItems = [
  { title: "CSV Upload", url: "/upload", icon: Upload },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r-0">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar-foreground">EduPredict</span>
          <span className="text-xs text-sidebar-foreground/60">Dropout Prevention</span>
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-wider font-semibold px-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-wider font-semibold px-3">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-xs font-medium text-sidebar-foreground">{user?.username || "User"}</span>
            <span className="text-[10px] text-sidebar-foreground/50 capitalize">{user?.role || "viewer"}</span>
          </div>
          <button onClick={logout} className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
