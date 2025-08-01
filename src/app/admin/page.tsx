"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Loader2, LogOut, FileText, ShoppingCart, Mail, MoreHorizontal, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "Paid" | "Pending" | "In-Progress" | "Delivered";
type MessageStatus = "Read" | "Unread";

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

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Timestamp;
    status: MessageStatus;
}

const orderStatusColors: Record<OrderStatus, string> = {
    "Paid": "bg-blue-500/20 text-blue-700 border-blue-500/30",
    "Pending": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    "In-Progress": "bg-orange-500/20 text-orange-700 border-orange-500/30",
    "Delivered": "bg-green-500/20 text-green-700 border-green-500/30"
}

const messageStatusColors: Record<MessageStatus, string> = {
    "Read": "bg-gray-500/20 text-gray-700 border-gray-500/30",
    "Unread": "bg-green-500/20 text-green-700 border-green-500/30"
}

export default function AdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [readMessages, setReadMessages] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        const isAdminAuthenticated = sessionStorage.getItem("isAdminAuthenticated") === "true";
        if (!isAdminAuthenticated) {
            router.replace("/admin/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch orders
                const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
                const ordersSnapshot = await getDocs(ordersQuery);
                const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(ordersData);
                setTotalOrders(ordersData.length);

                // Fetch contacts
                const contactsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
                const contactsSnapshot = await getDocs(contactsQuery);
                const contactsData = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
                setContacts(contactsData);
                setTotalMessages(contactsData.length);
                setReadMessages(contactsData.filter(c => c.status === 'Read').length);
                setUnreadMessages(contactsData.filter(c => c.status === 'Unread').length);

            } catch (error) {
                console.error("Failed to fetch admin data:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch data.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, toast]);
    
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
    
    const handleMessageStatusChange = async (messageId: string, newStatus: MessageStatus) => {
        try {
            const messageRef = doc(db, "contacts", messageId);
            await updateDoc(messageRef, { status: newStatus });
            const updatedContacts = contacts.map(contact =>
                contact.id === messageId ? { ...contact, status: newStatus } : contact
            );
            setContacts(updatedContacts);
            setReadMessages(updatedContacts.filter(c => c.status === 'Read').length);
            setUnreadMessages(updatedContacts.filter(c => c.status === 'Unread').length);
            toast({
                title: "Success",
                description: `Message marked as ${newStatus}.`
            });
        } catch (error) {
            console.error("Failed to update message status:", error);
            toast({
                title: "Error",
                description: "Failed to update message status.",
                variant: "destructive",
            });
        }
    };

    const handleMessageDelete = async (messageId: string) => {
        try {
            const messageRef = doc(db, "contacts", messageId);
            await deleteDoc(messageRef);
            const updatedContacts = contacts.filter(contact => contact.id !== messageId);
            setContacts(updatedContacts);
            setTotalMessages(updatedContacts.length);
            setReadMessages(updatedContacts.filter(c => c.status === 'Read').length);
            setUnreadMessages(updatedContacts.filter(c => c.status === 'Unread').length);
            toast({
                title: "Success",
                description: "Message deleted successfully."
            });
        } catch (error) {
            console.error("Failed to delete message:", error);
            toast({
                title: "Error",
                description: "Failed to delete message.",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isAdminAuthenticated");
        router.push('/admin/login');
    };

    if (loading) {
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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

                    <Tabs defaultValue="orders" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders">
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
                        </TabsContent>
                        <TabsContent value="messages">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Messages</CardTitle>
                                    <CardDescription>Messages submitted through the contact form.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>From</TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Message</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contacts.map(contact => (
                                                <TableRow key={contact.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{contact.name}</div>
                                                        <div className="text-xs text-muted-foreground">{contact.email}</div>
                                                    </TableCell>
                                                    <TableCell>{contact.subject}</TableCell>
                                                    <TableCell><Badge variant='outline' className={messageStatusColors[contact.status] || ''}>{contact.status}</Badge></TableCell>
                                                    <TableCell>{contact.createdAt.toDate().toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                         <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="icon">
                                                                    <FileText className="h-4 w-4" />
                                                                    <span className="sr-only">View Message</span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Message from {contact.name}</DialogTitle>
                                                                    <DialogDescription>
                                                                        Subject: {contact.subject}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="py-4">
                                                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
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
                                                                <DropdownMenuItem onClick={() => handleMessageStatusChange(contact.id, 'Read')}>Mark as Read</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleMessageStatusChange(contact.id, 'Unread')}>Mark as Unread</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600" onClick={() => handleMessageDelete(contact.id)}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {contacts.length === 0 && (
                                        <div className="text-center py-12 text-muted-foreground">
                                            No messages found.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
