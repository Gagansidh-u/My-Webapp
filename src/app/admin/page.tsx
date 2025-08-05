
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { Loader2, ShoppingCart, Mail, ArrowRight, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Order = { 
    id: string; 
    userEmail: string;
    plan: string;
    price: number;
    createdAt: Timestamp;
};

type ContactMessage = { 
    id: string; 
    name: string;
    subject: string;
    status: "Read" | "Unread"; 
};

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalMessages: 0,
        unreadMessages: 0,
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

    useEffect(() => {
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const contactsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

        const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
            setStats(prev => ({...prev, totalOrders: snapshot.size}));
            const recent = snapshot.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setRecentOrders(recent);
        }, (error) => {
            console.error("Failed to fetch orders:", error);
            toast({ title: "Error", description: "Failed to fetch order data.", variant: "destructive" });
        });

        const unsubContacts = onSnapshot(contactsQuery, (snapshot) => {
            const contactsData = snapshot.docs.map(doc => doc.data() as ContactMessage);
            setStats(prev => ({
                ...prev,
                totalMessages: contactsData.length,
                unreadMessages: contactsData.filter(c => c.status === 'Unread').length,
            }));
             const recent = snapshot.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
            setRecentMessages(recent);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch contacts:", error);
            toast({ title: "Error", description: "Failed to fetch message data.", variant: "destructive" });
            setLoading(false);
        });

        return () => {
            unsubOrders();
            unsubContacts();
        };
    }, [toast]);
    
     const getUserInitials = (name: string | null | undefined) => {
      if (!name) return 'U';
      return name.substring(0, 2).toUpperCase();
    }

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All-time order count</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMessages}</div>
                        <p className="text-xs text-muted-foreground">From contact form</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                        <Link href="/admin/messages" className="text-xs text-muted-foreground hover:underline">
                            Messages needing attention
                        </Link>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>The latest 5 orders placed by users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${order.userEmail}`} alt={order.userEmail} />
                                        <AvatarFallback>{getUserInitials(order.userEmail)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{order.userEmail}</p>
                                        <p className="text-sm text-muted-foreground">{order.plan}</p>
                                    </div>
                                    <div className="ml-auto font-medium">₹{order.price.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>The latest 5 messages received.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                            {recentMessages.map(msg => (
                                <div key={msg.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                         <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.name}`} alt={msg.name} />
                                        <AvatarFallback>{getUserInitials(msg.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{msg.name}</p>
                                        <p className="text-sm text-muted-foreground truncate max-w-[150px]">{msg.subject}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Badge variant={msg.status === "Unread" ? "destructive" : "secondary"}>{msg.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
