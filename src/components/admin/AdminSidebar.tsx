import { NavLink, useLocation } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  Users,
  BookOpen,
  ScrollText,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "نظرة عامة", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "المستخدمون", url: "/admin/users", icon: Users },
  { title: "الكورسات", url: "/admin/courses", icon: BookOpen },
  { title: "سجل التدقيق", url: "/admin/audit", icon: ScrollText },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Shield className="h-5 w-5 text-gold shrink-0" />
          {!collapsed && <span className="font-bold">لوحة الأدمن</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.end)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
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
