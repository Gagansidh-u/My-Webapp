
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, doc, updateDoc } from "firebase/firestore";
import { FileText, Package, User, Calendar, Tag, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch orders:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        const orderRef = doc(db, "orders", orderId);
        try {
            await updateDoc(orderRef, { status: newStatus });
            toast({ title: "Success", description: "Order status updated." });
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({ title: "Error", description: "Could not update order status.", variant: "destructive" });
        }
    };
    
    const getDurationText = (duration: number) => {
        if (!duration) return 'N/A';
        if (duration < 12) return `${duration} Months`;
        const years = duration / 12;
        return `${years} Year${years > 1 ? 's' : ''}`;
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader size={64} />
            </div>
        );
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><Package /> Manage Orders</CardTitle>
                <CardDescription>View and manage all customer orders.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Desktop View */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.userEmail}</TableCell>
                                    <TableCell>{order.plan}</TableCell>
                                    <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}>
                                            <SelectTrigger className="w-[140px] text-xs h-8">
                                                <SelectValue>
                                                    <Badge variant="outline" className={`${orderStatusColors[order.status]} hover:bg-transparent`}>{order.status}</Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(["Paid", "In-Progress", "Delivered"] as OrderStatus[]).map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{order.createdAt.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Website Details</DialogTitle>
                                                    <DialogDescription>Plan: {order.plan} ({getDurationText(order.duration)})</DialogDescription>
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
                </div>
                
                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {orders.map(order => (
                         <Card key={order.id} className="bg-muted/30">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold flex items-center gap-2"><User className="text-muted-foreground" /> {order.userEmail}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Tag className="text-muted-foreground" /> {order.plan}</p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Website Details</DialogTitle>
                                                <DialogDescription>Plan: {order.plan} ({getDurationText(order.duration)})</DialogDescription>
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
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground flex items-center gap-2"><IndianRupee /> Price</p>
                                    <p className="font-medium">₹{order.price.toFixed(2)}</p>
                                </div>
                                 <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground flex items-center gap-2"><Calendar /> Date</p>
                                    <p className="font-medium">{order.createdAt.toDate().toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground">Status</p>
                                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}>
                                        <SelectTrigger className="w-[140px] text-xs h-8">
                                             <SelectValue>
                                                <Badge variant="outline" className={`${orderStatusColors[order.status]} hover:bg-transparent`}>{order.status}</Badge>
                                             </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(["Paid", "In-Progress", "Delivered"] as OrderStatus[]).map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>


                 {orders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No orders found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
