
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp, doc, updateDoc } from "firebase/firestore";
import { Loader2, FileText, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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


export default function AdminOrdersPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
                const ordersSnapshot = await getDocs(ordersQuery);
                const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(ordersData);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast({ title: "Error", description: "Failed to fetch orders.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [toast]);
    
    const getDurationText = (duration: number) => {
        if (!duration) return 'N/A';
        if (duration < 12) return `${duration} Months`;
        const years = duration / 12;
        return `${years} Year${years > 1 ? 's' : ''}`;
    }

    const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            toast({
                title: "Success",
                description: `Order status updated to ${newStatus}.`
            });
        } catch (error) {
            console.error("Failed to update order status:", error);
            toast({
                title: "Error",
                description: "Failed to update order status.",
                variant: "destructive",
            });
        }
    };
    
    if (loading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
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
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Actions</TableHead>
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
                                <TableCell>{getDurationText(order.duration)}</TableCell>
                                <TableCell><Badge variant='outline' className={orderStatusColors[order.status] || ''}>{order.status}</Badge></TableCell>
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
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'Paid')}>Paid</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'Pending')}>Pending</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'In-Progress')}>In-Progress</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, 'Delivered')}>Delivered</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
    );
}

