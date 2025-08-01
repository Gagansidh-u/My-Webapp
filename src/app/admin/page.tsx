"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { Loader2, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { signOut } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


type Order = {
    id: string;
    userId: string;
    userEmail: string;
    plan: string;
    price: number;
    status: string;
    createdAt: Timestamp;
    websiteDetails: {
        description: string;
        colors: string;
        style: string;
    };
};

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.replace("/admin/login");
                return;
            }

            const checkAdminAndFetch = async () => {
                const adminDoc = await getDoc(doc(db, "admins", user.uid));
                if (!adminDoc.exists()) {
                    await auth.signOut();
                    router.replace("/admin/login");
                    return;
                }

                const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(ordersData);
                setLoading(false);
            };

            checkAdminAndFetch();
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="flex flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                     <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
                     <div className="ml-auto">
                        <Button onClick={handleLogout} variant="outline" size="icon">
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">Logout</span>
                        </Button>
                     </div>
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Orders</CardTitle>
                            <CardDescription>A list of all the orders placed by users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div className="font-medium">{order.userEmail}</div>
                                                <div className="text-xs text-muted-foreground">{order.userId}</div>
                                            </TableCell>
                                            <TableCell>{order.plan}</TableCell>
                                            <TableCell><Badge variant={order.status === 'Paid' ? 'default' : 'secondary'} className={`${order.status === 'Paid' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}`}>{order.status}</Badge></TableCell>
                                            <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                            <TableCell>{order.createdAt.toDate().toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="icon">
                                                            <FileText className="h-4 w-4" />
                                                            <span className="sr-only">View Details</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Website Details for {order.userEmail}</DialogTitle>
                                                            <DialogDescription>
                                                                Plan: {order.plan}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div>
                                                                <h4 className="font-semibold">Description</h4>
                                                                <p className="text-sm text-muted-foreground">{order.websiteDetails.description}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">Colors</h4>
                                                                <p className="text-sm text-muted-foreground">{order.websiteDetails.colors}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">Style/Vibe</h4>
                                                                <p className="text-sm text-muted-foreground">{order.websiteDetails.style}</p>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             {orders.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No orders found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
