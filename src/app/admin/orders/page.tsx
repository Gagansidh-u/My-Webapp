
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, doc, updateDoc } from "firebase/firestore";
import { FileText, Package, User, Calendar as CalendarIcon, Tag, IndianRupee, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";


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
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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
    
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchTerm === "" || 
                              order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;

        const orderDate = order.createdAt.toDate();
        const matchesDate = !dateRange || 
                            (!dateRange.from || orderDate >= dateRange.from) && 
                            (!dateRange.to || orderDate <= dateRange.to);

        return matchesSearch && matchesStatus && matchesDate;
    });


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
                 <div className="flex items-center justify-between pt-4 gap-4 flex-wrap">
                    <div className="flex gap-4 flex-grow flex-wrap">
                        <div className="relative w-full max-w-sm">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input 
                               placeholder="Search by email..." 
                               className="pl-10"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                id="date"
                                variant={"outline"}
                                className="w-[300px] justify-start text-left font-normal"
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                    </>
                                    ) : (
                                    format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={1}
                                captionLayout="dropdown-buttons"
                                fromYear={2023}
                                toYear={new Date().getFullYear() + 1}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "All")}>
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Paid">Paid</TabsTrigger>
                            <TabsTrigger value="In-Progress">In-Progress</TabsTrigger>
                            <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
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
                            {filteredOrders.map(order => (
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
                    {filteredOrders.map(order => (
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
                                    <p className="text-muted-foreground flex items-center gap-2"><CalendarIcon /> Date</p>
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


                 {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No orders found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

    

    
