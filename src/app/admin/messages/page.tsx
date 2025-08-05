
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Loader2, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type MessageStatus = "Read" | "Unread";

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Timestamp;
    status: MessageStatus;
}

const messageStatusColors: Record<MessageStatus, string> = {
    "Read": "bg-gray-500/20 text-gray-700 border-gray-500/30",
    "Unread": "bg-green-500/20 text-green-700 border-green-500/30"
}

export default function AdminMessagesPage() {
    const { toast } = useToast();
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = React.useCallback(async () => {
        try {
            setLoading(true);
            const contactsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
            const contactsSnapshot = await getDocs(contactsQuery);
            const contactsData = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
            setContacts(contactsData);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            toast({ title: "Error", description: "Failed to fetch messages.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);


    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleMessageStatusChange = async (messageId: string, newStatus: MessageStatus) => {
        try {
            const messageRef = doc(db, "contacts", messageId);
            await updateDoc(messageRef, { status: newStatus });
            await fetchContacts(); // Refetch to update the list
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
            await deleteDoc(doc(db, "contacts", messageId));
            await fetchContacts(); // Refetch to update the list
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
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-500/10" onClick={() => handleMessageDelete(contact.id)}>
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
    );
}

