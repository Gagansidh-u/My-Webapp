
"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import AdminNav from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const isAdminAuthenticated = sessionStorage.getItem("isAdminAuthenticated") === "true";
    if (!isAdminAuthenticated) {
      router.replace("/admin/login");
    }
  }, [router]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    router.push('/admin/login');
  };

  if (!isClient) {
    return null; 
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <h1 className="text-xl font-bold font-headline px-2">Admin Panel</h1>
        </SidebarHeader>
        <SidebarContent>
          <AdminNav />
        </SidebarContent>
        <SidebarFooter>
            <Button onClick={handleLogout} variant="ghost" className="justify-start gap-2 w-full">
                <LogOut />
                <span>Logout</span>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
                <SidebarTrigger className="md:hidden"/>
                <h1 className="text-2xl font-bold font-headline md:hidden">Admin</h1>
            </div>
            {children}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
