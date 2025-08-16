
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MessageSquare, Users } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ orders: 0, inquiries: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribes: (() => void)[] = [];
        let loadedStats = 0;

        const handleLoad = () => {
            loadedStats++;
            if (loadedStats === 3) {
                setLoading(false);
            }
        };

        try {
            const ordersUnsub = onSnapshot(collection(db, "orders"), (snapshot) => {
                setStats(prev => ({ ...prev, orders: snapshot.size }));
                if(loading) handleLoad();
            });
            unsubscribes.push(ordersUnsub);

            const inquiriesUnsub = onSnapshot(collection(db, "contacts"), (snapshot) => {
                setStats(prev => ({ ...prev, inquiries: snapshot.size }));
                 if(loading) handleLoad();
            });
            unsubscribes.push(inquiriesUnsub);

            const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
                setStats(prev => ({ ...prev, users: snapshot.size }));
                 if(loading) handleLoad();
            });
            unsubscribes.push(usersUnsub);

        } catch (error) {
            console.error("Failed to fetch real-time stats:", error);
            setLoading(false);
        }

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [loading]);

    if (loading) {
        return (
          <div className="flex h-full items-center justify-center">
            <Loader size={64} />
          </div>
        );
    }
    
    return (
        <div className="space-y-8">
             <div className="text-left">
                <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orders}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inquiries}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
