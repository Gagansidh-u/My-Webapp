
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
import { LogOut, Gem } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const getPageTitle = (pathname: string) => {
    switch (pathname) {
        case "/admin":
            return "Dashboard";
        case "/admin/orders":
            return "User Orders";
        case "/admin/messages":
            return "Contact Messages";
        default:
            return "Admin";
    }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
    // You can return a loader here
    return null; 
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 p-2">
            <Gem className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Admin Panel</h1>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <AdminNav />
        </SidebarContent>
        <SidebarFooter>
            <Button onClick={handleLogout} variant="ghost" className="justify-start gap-2 w-full">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 mb-6">
             <SidebarTrigger className="md:hidden"/>
             <h1 className="text-2xl font-bold font-headline">{getPageTitle(pathname)}</h1>
        </header>
        <div className="p-4 pt-0 md:p-6 md:pt-0">
            {children}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
