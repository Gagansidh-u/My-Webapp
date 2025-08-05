
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, doc, updateDoc, deleteDoc, writeBatch, where, getDocs } from "firebase/firestore";
import { Loader2, Mail, CheckCircle, XCircle, Trash2, Eye, CircleSlash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'Read' | 'Unread';
    createdAt: Timestamp;
};

const statusColors: Record<ContactMessage['status'], string> = {
    "Read": "bg-green-500/20 text-green-700 border-green-500/30",
    "Unread": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
}

export default function AdminMessagesPage() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData: ContactMessage[] = [];
            querySnapshot.forEach((doc) => {
                messagesData.push({ id: doc.id, ...doc.data() } as ContactMessage);
            });
            setMessages(messagesData);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch contacts:", error);
            toast({ title: "Error", description: "Failed to load messages. Check Firestore rules and indexes.", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleMarkAsRead = async (id: string, currentStatus: ContactMessage['status']) => {
        if (currentStatus === 'Read') return; // No need to update if already read
        const contactRef = doc(db, "contacts", id);
        try {
            await updateDoc(contactRef, { status: 'Read' });
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };
    
    const handleDeleteAllRead = async () => {
        const readMessagesQuery = query(collection(db, "contacts"), where("status", "==", "Read"));
        try {
            const querySnapshot = await getDocs(readMessagesQuery);
            if (querySnapshot.empty) {
                toast({ title: "No read messages to delete.", description: "All messages are marked as unread." });
                return;
            }
            
            const batch = writeBatch(db);
            querySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            toast({ title: "Success", description: "All read messages have been deleted." });
        } catch (error) {
            console.error("Failed to delete read messages:", error);
            toast({ title: "Error", description: "Failed to delete read messages.", variant: "destructive" });
        }
    };
    
    const handleBulkStatusUpdate = async (newStatus: 'Read' | 'Unread') => {
        const batch = writeBatch(db);
        messages.forEach(message => {
            if (message.status !== newStatus) {
                const contactRef = doc(db, "contacts", message.id);
                batch.update(contactRef, { status: newStatus });
            }
        });
        
        try {
            await batch.commit();
            toast({ title: "Success", description: `All messages marked as ${newStatus}.` });
        } catch (error) {
            console.error("Failed to bulk update status:", error);
            toast({ title: "Error", description: "Failed to update messages.", variant: "destructive" });
        }
    }

    const allMessagesRead = useMemo(() => messages.every(m => m.status === 'Read'), [messages]);

    const getUserInitials = (name: string | null | undefined) => {
      if (!name) return 'U';
      return name.substring(0, 2).toUpperCase();
    }
    
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
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Mail className="h-6 w-6"/>
                        <CardTitle className="text-2xl font-headline">Contact Messages</CardTitle>
                    </div>
                     <div className="flex items-center gap-2">
                        {allMessagesRead ? (
                            <Button variant="outline" onClick={() => handleBulkStatusUpdate('Unread')} disabled={messages.length === 0}>
                                <XCircle className="mr-2 h-4 w-4"/>
                                Mark all as Unread
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => handleBulkStatusUpdate('Read')} disabled={messages.length === 0}>
                                <CheckCircle className="mr-2 h-4 w-4"/>
                                Mark all as Read
                            </Button>
                        )}
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={messages.filter(m => m.status === 'Read').length === 0}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Delete all Read
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all messages marked as 'Read'.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAllRead}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                 </div>
                <CardDescription>Messages submitted through the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block border rounded-lg">
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
                            {messages.map(message => (
                                <TableRow key={message.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                 <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${message.name}`} alt={message.name} />
                                                <AvatarFallback>{getUserInitials(message.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{message.name}</div>
                                                <div className="text-xs text-muted-foreground">{message.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{message.subject}</TableCell>
                                    <TableCell><Badge variant="outline" className={statusColors[message.status]}>{message.status}</Badge></TableCell>
                                    <TableCell>{message.createdAt.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog onOpenChange={(open) => open && handleMarkAsRead(message.id, message.status)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4"/>View</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{message.subject}</DialogTitle>
                                                     <DialogDescription>
                                                        From: {message.name} ({message.email})
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 bg-muted/50 p-4 rounded-md mt-4">
                                                    <p className="text-sm">{message.message}</p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                 <div className="md:hidden space-y-4">
                    {messages.map(message => (
                        <Card key={message.id} className="shadow-md">
                             <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${message.name}`} alt={message.name} />
                                            <AvatarFallback>{getUserInitials(message.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{message.name}</CardTitle>
                                            <CardDescription>{message.email}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={statusColors[message.status]}>{message.status}</Badge>
                                </div>
                                <p className="font-semibold text-sm pt-4">{message.subject}</p>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-2">
                                <Dialog onOpenChange={(open) => open && handleMarkAsRead(message.id, message.status)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full"><Eye className="mr-2 h-4 w-4"/>View Message</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{message.subject}</DialogTitle>
                                                <DialogDescription>
                                                From: {message.name} ({message.email})
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 bg-muted/50 p-4 rounded-md mt-4">
                                            <p className="text-sm">{message.message}</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ))}
                 </div>

                {messages.length === 0 && !loading && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Mail className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No messages yet.</h3>
                        <p className="mt-1 text-sm">When users send a message, it will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
