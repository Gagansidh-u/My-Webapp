
"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Mail, Trash2, User, Calendar as CalendarIcon, MessageCircle, BadgeCheck, Search, Send } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type InquiryStatus = 'Unread' | 'Read' | 'Resolved' | 'User Reply' | 'Admin Replied';

type InquiryMessage = {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: { seconds: number; nanoseconds: number; };
}

type Inquiry = {
    id: string;
    userId: string;
    name: string;
    email: string;
    subject: string;
    messages: InquiryMessage[];
    status: InquiryStatus;
    createdAt: { seconds: number; nanoseconds: number; };
};

const statusColors: Record<InquiryStatus, string> = {
    "Read": "bg-blue-500/20 text-blue-700 border-blue-500/30",
    "Unread": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    "Resolved": "bg-green-500/20 text-green-700 border-green-500/30",
    "User Reply": "bg-orange-500/20 text-orange-700 border-orange-500/30",
    "Admin Replied": "bg-purple-500/20 text-purple-700 border-purple-500/30",
}

const statusOptions: InquiryStatus[] = ['Unread', 'Read', 'User Reply', 'Admin Replied', 'Resolved'];


export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | "All">("All");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    useEffect(() => {
        const inquiriesColRef = collection(db, 'contacts');
        const q = query(inquiriesColRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const inquiriesData: Omit<Inquiry, "messages">[] = [];
            snapshot.forEach(doc => {
                inquiriesData.push({ id: doc.id, ...doc.data() } as Omit<Inquiry, "messages">);
            });

            const inquiriesWithMessages = await Promise.all(inquiriesData.map(async (inquiry) => {
                 const messagesColRef = collection(db, 'contacts', inquiry.id, 'messages');
                 const messagesQuery = query(messagesColRef, orderBy('createdAt', 'asc'));
                 const messagesSnapshot = await getDocs(messagesQuery);
                 const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InquiryMessage));
                 return { ...inquiry, messages };
            }));

            setInquiries(inquiriesWithMessages);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch inquiries:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (id: string, status: InquiryStatus) => {
        const inquiryRef = doc(db, "contacts", id);
        const statusUpdate = { status };
        updateDoc(inquiryRef, statusUpdate)
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: inquiryRef.path,
                  operation: 'update',
                  requestResourceData: statusUpdate,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
            });
    };
    
    const handleViewMessage = (inquiry: Inquiry) => {
        if (inquiry.status === 'Unread' || inquiry.status === 'User Reply') {
            handleStatusChange(inquiry.id, 'Read');
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const inquiryRef = doc(db, "contacts", id);
        deleteDoc(inquiryRef)
            .then(() => {
                toast({ title: "Success", description: "Inquiry has been deleted." });
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: inquiryRef.path,
                  operation: 'delete',
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ title: "Error", description: "Could not delete the inquiry.", variant: "destructive" });
            })
            .finally(() => {
                setDeletingId(null);
            });
    };
    
     const handleReplySubmit = async (inquiryId: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser || !replyMessage.trim()) return;

        setReplyingTo(inquiryId);
        const inquiryRef = doc(db, "contacts", inquiryId);
        const messagesRef = collection(db, "contacts", inquiryId, "messages");

        const newMessage = {
            text: replyMessage,
            senderId: currentUser.uid,
            senderName: "Admin",
            createdAt: serverTimestamp(),
        };

        const statusUpdate = { status: "Admin Replied" };

        addDoc(messagesRef, newMessage)
            .then(() => {
                return updateDoc(inquiryRef, statusUpdate);
            })
            .then(() => {
                setReplyMessage(""); // Clear the textarea after sending
                toast({title: "Success", description: "Reply sent."})
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: messagesRef.path,
                  operation: 'create',
                  requestResourceData: newMessage,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ title: "Error", description: "Failed to send reply.", variant: "destructive" });
            })
            .finally(() => {
                setReplyingTo(null);
            });
    };

    const toJSDate = (timestamp: { seconds: number; nanoseconds: number; }) => {
        if (!timestamp) return new Date();
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    }

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = searchTerm === "" ||
                              inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
        
        const inquiryDate = toJSDate(inquiry.createdAt);
        const matchesDate = !dateRange || 
                            (!dateRange.from || inquiryDate >= dateRange.from) && 
                            (!dateRange.to || inquiryDate <= dateRange.to);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getSortedMessages = (messages: InquiryMessage[] | undefined) => {
        if (!messages) return [];
        return messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    }


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
                                captionLayout="dropdown-buttons"
                                fromYear={2023}
                                toYear={new Date().getFullYear() + 1}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as InquiryStatus | "All")}>
                        <TabsList className="h-auto flex-wrap justify-start">
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Unread">Unread</TabsTrigger>
                             <TabsTrigger value="User Reply">User Reply</TabsTrigger>
                             <TabsTrigger value="Read">Read</TabsTrigger>
                             <TabsTrigger value="Admin Replied">Admin Replied</TabsTrigger>
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
                                            <SelectTrigger className="w-auto min-w-[140px] text-xs h-8">
                                                <SelectValue>
                                                    <Badge variant="outline" className={`${statusColors[inquiry.status]} hover:bg-transparent`}>{inquiry.status}</Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{toJSDate(inquiry.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog onOpenChange={(open) => { if(open) handleViewMessage(inquiry)}}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">View Thread</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>{inquiry.subject}</DialogTitle>
                                                    <DialogDescription>From: {inquiry.name} ({inquiry.email})</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                     {getSortedMessages(inquiry.messages).map((msg, index) => (
                                                        <div key={index} className={`flex flex-col ${msg.senderId === auth.currentUser?.uid ? 'items-end' : 'items-start'}`}>
                                                            <div className={`rounded-lg p-3 max-w-[80%] ${msg.senderId === auth.currentUser?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                                <p className="text-sm font-bold">{msg.senderName}</p>
                                                                <p className="text-sm">{msg.text}</p>
                                                                <p className="text-xs opacity-70 mt-1">{toJSDate(msg.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {inquiry.status !== 'Resolved' && (
                                                    <div className="flex gap-2 pt-4 border-t">
                                                        <Textarea 
                                                            placeholder="Type your reply..."
                                                            value={replyMessage}
                                                            onChange={(e) => setReplyMessage(e.target.value)}
                                                        />
                                                        <Button onClick={() => handleReplySubmit(inquiry.id)} disabled={replyingTo === inquiry.id}>
                                                            {replyingTo === inquiry.id ? <Loader size={16} /> : <Send className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                )}
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
                                                    This action cannot be undone. This will permanently delete this message thread.
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
                                        <Dialog onOpenChange={(open) => { if(open) handleViewMessage(inquiry)}}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>{inquiry.subject}</DialogTitle>
                                                    <DialogDescription>From: {inquiry.name} ({inquiry.email})</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                     {getSortedMessages(inquiry.messages).map((msg, index) => (
                                                        <div key={index} className={`flex flex-col ${msg.senderId === auth.currentUser?.uid ? 'items-end' : 'items-start'}`}>
                                                            <div className={`rounded-lg p-3 max-w-[80%] ${msg.senderId === auth.currentUser?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                                <p className="text-sm font-bold">{msg.senderName}</p>
                                                                <p className="text-sm">{msg.text}</p>
                                                                <p className="text-xs opacity-70 mt-1">{toJSDate(msg.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {inquiry.status !== 'Resolved' && (
                                                    <div className="flex gap-2 pt-4 border-t">
                                                        <Textarea 
                                                            placeholder="Type your reply..."
                                                            value={replyMessage}
                                                            onChange={(e) => setReplyMessage(e.target.value)}
                                                        />
                                                        <Button onClick={() => handleReplySubmit(inquiry.id)} disabled={replyingTo === inquiry.id}>
                                                            {replyingTo === inquiry.id ? <Loader size={16} /> : <Send className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                )}
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
                                    <p className="font-medium">{toJSDate(inquiry.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground flex items-center gap-2"><BadgeCheck /> Status</p>
                                     <Select value={inquiry.status} onValueChange={(value) => handleStatusChange(inquiry.id, value as InquiryStatus)}>
                                        <SelectTrigger className="w-auto min-w-[140px] text-xs h-8">
                                            <SelectValue>
                                                <Badge variant="outline" className={`${statusColors[inquiry.status]} hover:bg-transparent`}>{inquiry.status}</Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(status => (
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
