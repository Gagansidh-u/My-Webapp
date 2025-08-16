
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { FileText, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";

type OrderStatus = "Paid" | "Pending" | "In-Progress" | "Delivered";

type Order = {
    id: string;
    userId: string;
    userEmail: string;
    plan: string;
    price: number;
    duration: number;
    status: OrderStatus;
    createdAt: Timestamp;
    websiteDetails: {
        description: string;
        colors: string;
        style: string;
    };
};

const orderStatusColors: Record<OrderStatus, string> = {
    "Paid": "bg-blue-500/20 text-blue-700 border-blue-500/30",
    "Pending": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    "In-Progress": "bg-orange-500/20 text-orange-700 border-orange-500/30",
    "Delivered": "bg-green-500/20 text-green-700 border-green-500/30"
}


export default function MyOrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        const ordersQuery = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        
        const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
            const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(userOrders);
            setLoading(false);
        }, (error) => {
             console.error("Failed to fetch user orders:", error);
             setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, router]);

    const getDurationText = (duration: number) => {
        if (!duration) return 'N/A';
        if (duration < 12) return `${duration} Months`;
        const years = duration / 12;
        return `${years} Year${years > 1 ? 's' : ''}`;
    }

    if (loading || authLoading) {
        return (
            <div className="flex h-[calc(100vh-12rem)] items-center justify-center bg-background">
                <Loader />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><ShoppingCart /> My Orders</CardTitle>
                    <CardDescription>Here is a list of all your recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Plan</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.plan}</TableCell>
                                    <TableCell>{getDurationText(order.duration)}</TableCell>
                                    <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                    <TableCell><Badge variant='outline' className={orderStatusColors[order.status] || ''}>{order.status}</Badge></TableCell>
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
                                                    <DialogTitle>Website Details for Order</DialogTitle>
                                                    <DialogDescription>
                                                        Plan: {order.plan} ({getDurationText(order.duration)})
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
                            <p className="mb-4">You haven't placed any orders yet.</p>
                            <Button asChild>
                                <Link href="/pricing">Explore Plans</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )

}

    
