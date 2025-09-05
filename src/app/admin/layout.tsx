
"use client";

import { useAuth } from "@/components/auth-provider";
import { Loader } from "@/components/ui/loader";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Home, LogOut, Package, MessageSquare, Landmark } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const adminEmail = "helpdesk.grock@outlook.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={64} />
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
  }
  
  const navItems = [
      { href: '/admin', label: 'Dashboard', icon: <Home /> },
      { href: '/admin/orders', label: 'Orders', icon: <Package /> },
      { href: '/admin/inquiries', label: 'Inquiries', icon: <MessageSquare /> },
  ]
  
  const legalItems = [
    { href: '/terms-and-conditions', label: 'Terms' },
    { href: '/privacy-policy', label: 'Privacy' },
    { href: '/refund-policy', label: 'Refunds' },
    { href: '/security', label: 'Security' },
  ]

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center justify-between">
                     <h2 className="text-lg font-semibold font-headline">Admin Panel</h2>
                     <SidebarTrigger />
                 </div>
            </SidebarHeader>
            <SidebarContent className="flex-grow">
                 <SidebarMenu>
                    {navItems.map(item => (
                         <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton asChild isActive={pathname === item.href}>
                                 <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                    ))}
                    <Collapsible asChild open={isLegalOpen} onOpenChange={setIsLegalOpen}>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <Landmark />
                                    <span>Legal</span>
                                    <ChevronRight className={cn("ml-auto h-5 w-5 transition-transform", isLegalOpen && "rotate-90")} />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                               <SidebarMenu className="ml-8">
                                    {legalItems.map(item => (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton asChild isActive={pathname === item.href} variant="ghost" size="sm">
                                                <Link href={item.href} target="_blank">
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                               </SidebarMenu>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                 </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2">
                    <LogOut />
                    <span>Logout</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
        <main className="flex-1 bg-muted/40 p-4 md:p-8">
            {children}
        </main>
    </SidebarProvider>
  );
}
