
"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart, Mail } from "lucide-react";
import Link from "next/link";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart /> },
    { href: "/admin/messages", label: "Messages", icon: <Mail /> },
]

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                    >
                        <Link href={item.href}>
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
