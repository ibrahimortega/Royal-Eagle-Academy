import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "@/components/Header";
import { useUserRole } from "@/hooks/useUserRole";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useUserRole();

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) {
      toast.error("هذه الصفحة للمشرفين فقط");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />
      <SidebarProvider defaultOpen>
        <div className="flex w-full flex-1">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-12 border-b border-border flex items-center px-3 gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground">لوحة تحكم الأدمن</span>
            </div>
            <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
