
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Mail, Trash2, User, Calendar as CalendarIcon, MessageCircle, BadgeCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";


type InquiryStatus = 'Read' | 'Unread' | 'Resolved';

type Inquiry = {
    id: string;
    userId: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: InquiryStatus;
    createdAt: Timestamp;
};

const statusColors: Record<InquiryStatus, string> = {
    "Read": "bg-blue-500/20 text-blue-700 border-blue-500/30",
    "Unread": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    "Resolved": "bg-green-500/20 text-green-700 border-green-500/30",
}


export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | "All">("All");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
        const inquiriesQuery = query(collection(db, `contacts`), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(inquiriesQuery, (snapshot) => {
            const inquiriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
            setInquiries(inquiriesData);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch inquiries:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (id: string, status: InquiryStatus) => {
        const inquiryRef = doc(db, `contacts`, id);
        try {
            await updateDoc(inquiryRef, { status: status });
        } catch (error) {
            toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const inquiryRef = doc(db, `contacts`, id);
        try {
            await deleteDoc(inquiryRef);
            toast({ title: "Success", description: "Inquiry has been deleted." });
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
            toast({ title: "Error", description: "Could not delete the inquiry.", variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };
    
     const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = searchTerm === "" ||
                              inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
        
        const inquiryDate = inquiry.createdAt.toDate();
        const matchesDate = !dateRange || 
                            (!dateRange.from || inquiryDate >= dateRange.from) && 
                            (!dateRange.to || inquiryDate <= dateRange.to);

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
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><Mail /> Manage Inquiries</CardTitle>
                <CardDescription>View and manage all user messages.</CardDescription>
                 <div className="flex items-center justify-between pt-4 gap-4 flex-wrap">
                    <div className="flex gap-4 flex-grow flex-wrap">
                        <div className="relative w-full max-w-sm">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input 
                               placeholder="Search by name or email..." 
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
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as InquiryStatus | "All")}>
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Unread">Unread</TabsTrigger>
                            <TabsTrigger value="Read">Read</TabsTrigger>
                             <TabsTrigger value="Resolved">Resolved</TabsTrigger>
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
                                <TableHead>From</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInquiries.map(inquiry => (
                                <TableRow key={inquiry.id}>
                                    <TableCell className="font-medium">{inquiry.name} <br/><span className="text-xs text-muted-foreground">{inquiry.email}</span></TableCell>
                                    <TableCell>{inquiry.subject}</TableCell>
                                    <TableCell>
                                        <Select value={inquiry.status} onValueChange={(value) => handleStatusChange(inquiry.id, value as InquiryStatus)}>
                                            <SelectTrigger className="w-[120px] text-xs h-8">
                                                <SelectValue>
                                                    <Badge variant="outline" className={`${statusColors[inquiry.status]} hover:bg-transparent`}>{inquiry.status}</Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(["Unread", "Read", "Resolved"] as InquiryStatus[]).map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{inquiry.createdAt.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog onOpenChange={(open) => { if(open && inquiry.status === 'Unread') handleStatusChange(inquiry.id, 'Read')}}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">View Message</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{inquiry.subject}</DialogTitle>
                                                    <DialogDescription>From: {inquiry.name} ({inquiry.email})</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <p className="text-sm text-foreground">{inquiry.message}</p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" disabled={deletingId === inquiry.id}>
                                                    {deletingId === inquiry.id ? <Loader size={16} /> : <Trash2 className="h-4 w-4" />}
                                                    <span className="sr-only">Delete Inquiry</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete this message.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(inquiry.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {filteredInquiries.map(inquiry => (
                         <Card key={inquiry.id} className="bg-muted/30">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold flex items-center gap-2"><User className="text-muted-foreground" /> {inquiry.name}</p>
                                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{inquiry.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Dialog onOpenChange={(open) => { if(open && inquiry.status === 'Unread') handleStatusChange(inquiry.id, 'Read')}}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{inquiry.subject}</DialogTitle>
                                                    <DialogDescription>From: {inquiry.name} ({inquiry.email})</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <p className="text-sm text-foreground">{inquiry.message}</p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" disabled={deletingId === inquiry.id}>
                                                    {deletingId === inquiry.id ? <Loader size={16} /> : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete this message.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(inquiry.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground flex items-center gap-2"><MessageCircle /> Subject</p>
                                    <p className="font-medium truncate max-w-[150px]">{inquiry.subject}</p>
                                </div>
                                 <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground flex items-center gap-2"><CalendarIcon /> Date</p>
                                    <p className="font-medium">{inquiry.createdAt.toDate().toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground flex items-center gap-2"><BadgeCheck /> Status</p>
                                     <Select value={inquiry.status} onValueChange={(value) => handleStatusChange(inquiry.id, value as InquiryStatus)}>
                                        <SelectTrigger className="w-[120px] text-xs h-8">
                                            <SelectValue>
                                                <Badge variant="outline" className={`${statusColors[inquiry.status]} hover:bg-transparent`}>{inquiry.status}</Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(["Unread", "Read", "Resolved"] as InquiryStatus[]).map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                         </Card>
                    ))}
                </div>


                 {filteredInquiries.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No inquiries found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

    

    