
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, ShoppingCart, Mail, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Order = { id: string; };
type ContactMessage = { id: string; status: "Read" | "Unread"; };

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [readMessages, setReadMessages] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders
                const ordersSnapshot = await getDocs(collection(db, "orders"));
                setTotalOrders(ordersSnapshot.size);

                // Fetch contacts
                const contactsSnapshot = await getDocs(collection(db, "contacts"));
                const contactsData = contactsSnapshot.docs.map(doc => doc.data() as ContactMessage);
                setTotalMessages(contactsData.length);
                setReadMessages(contactsData.filter(c => c.status === 'Read').length);
                setUnreadMessages(contactsData.filter(c => c.status === 'Unread').length);

            } catch (error) {
                console.error("Failed to fetch admin data:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch dashboard data.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All-time order count</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMessages}</div>
                        <p className="text-xs text-muted-foreground">From contact form</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadMessages}</div>
                        <p className="text-xs text-muted-foreground">Messages needing attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Read Messages</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readMessages}</div>
                        <p className="text-xs text-muted-foreground">Archived messages</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Welcome to the Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Use the sidebar to navigate between orders and messages.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
