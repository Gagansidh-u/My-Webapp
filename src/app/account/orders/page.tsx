
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { FileText, ShoppingCart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "Paid" | "Pending" | "In-Progress" | "Delivered" | "Refund Requested" | "Refunded";

type Order = {
    id: string;
    userId: string;
    userEmail: string;
    plan: string;
    price: number;
    duration: number;
    status: OrderStatus;
    createdAt: { seconds: number; nanoseconds: number; };
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
    "Delivered": "bg-green-500/20 text-green-700 border-green-500/30",
    "Refund Requested": "bg-purple-500/20 text-purple-700 border-purple-500/30",
    "Refunded": "bg-gray-500/20 text-gray-700 border-gray-500/30"
}


export default function MyOrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login");
            return;
        }
        
        const ordersColRef = collection(db, 'orders');
        const q = query(ordersColRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userOrders: Order[] = [];
            snapshot.forEach(doc => {
                userOrders.push({ id: doc.id, ...doc.data() } as Order);
            });
            setOrders(userOrders);
            setLoading(false);
        }, (error) => {
             console.error("Failed to fetch user orders:", error);
             setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, router]);

    const handleRefundRequest = async (orderId: string) => {
        setUpdatingId(orderId);
        const orderRef = doc(db, "orders", orderId);
        try {
            await updateDoc(orderRef, { status: "Refund Requested" });
            toast({
                title: "Refund Requested",
                description: "Your refund request has been submitted.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not submit your refund request. Please contact support.",
                variant: "destructive"
            });
            console.error("Error requesting refund:", error);
        } finally {
            setUpdatingId(null);
        }
    }

    const toJSDate = (timestamp: { seconds: number; nanoseconds: number; }) => {
        if (!timestamp) return new Date();
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    }
    
    const isRefundable = (order: Order) => {
        if (order.status !== 'Paid') return false;
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        return (Date.now() - toJSDate(order.createdAt).getTime()) < sevenDaysInMs;
    };


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
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.plan}</TableCell>
                                        <TableCell>{getDurationText(order.duration)}</TableCell>
                                        <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                        <TableCell><Badge variant='outline' className={orderStatusColors[order.status] || ''}>{order.status}</Badge></TableCell>
                                        <TableCell>{toJSDate(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
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
                                            {isRefundable(order) && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon" disabled={updatingId === order.id}>
                                                            {updatingId === order.id ? <Loader size={16} /> : <RotateCcw className="h-4 w-4" />}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Request a Refund?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will submit a refund request for this order. This action cannot be undone. Are you sure?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRefundRequest(order.id)}>
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
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
