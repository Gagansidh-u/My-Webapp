
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MessageSquare, Users, IndianRupee } from "lucide-react";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

type Order = {
    price: number;
    createdAt: Timestamp;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ 
        orders: 0, 
        inquiries: 0, 
        users: 0,
        currentMonthRevenue: 0,
        previousMonthRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribes: (() => void)[] = [];
        let loadedStats = 0;
        const requiredLoads = 3;

        const handleLoad = () => {
            loadedStats++;
            if (loadedStats === requiredLoads) {
                setLoading(false);
            }
        };

        const ordersQuery = query(collection(db, "orders"));
        const ordersUnsub = onSnapshot(ordersQuery, (snapshot) => {
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            let currentMonthRevenue = 0;
            let previousMonthRevenue = 0;

            snapshot.docs.forEach(doc => {
                const order = doc.data() as Order;
                if (order.createdAt && order.createdAt.toDate) {
                    const createdAtDate = order.createdAt.toDate();
                    if (createdAtDate >= startOfCurrentMonth) {
                        currentMonthRevenue += order.price;
                    } else if (createdAtDate >= startOfPreviousMonth && createdAtDate <= endOfPreviousMonth) {
                        previousMonthRevenue += order.price;
                    }
                }
            });

            setStats(prev => ({ 
                ...prev, 
                orders: snapshot.size,
                currentMonthRevenue,
                previousMonthRevenue
            }));
            if(loading && loadedStats < requiredLoads) handleLoad();
        }, (error) => {
            console.error("Error fetching orders:", error);
            if(loading) handleLoad();
        });
        unsubscribes.push(ordersUnsub);

        const inquiriesQuery = query(collection(db, "contacts"));
        const inquiriesUnsub = onSnapshot(inquiriesQuery, (snapshot) => {
            setStats(prev => ({ ...prev, inquiries: snapshot.size }));
            if(loading && loadedStats < requiredLoads) handleLoad();
        }, (error) => {
            console.error("Error fetching inquiries:", error);
            if(loading) handleLoad();
        });
        unsubscribes.push(inquiriesUnsub);

        const usersQuery = query(collection(db, "users"));
        const usersUnsub = onSnapshot(usersQuery, (snapshot) => {
            setStats(prev => ({ ...prev, users: snapshot.size }));
            if(loading && loadedStats < requiredLoads) handleLoad();
        }, (error) => {
            console.error("Error fetching users:", error);
            if(loading) handleLoad();
        });
        unsubscribes.push(usersUnsub);

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month's Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.currentMonthRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Month's Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.previousMonthRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
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
