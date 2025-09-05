
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, where, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Mail, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";

type InquiryMessage = {
    text: string;
    senderId: string;
    senderName: string;
    createdAt: Timestamp;
}

type Inquiry = {
    id: string;
    subject: string;
    status: 'Unread' | 'Read' | 'Resolved' | 'User Reply' | 'Admin Replied';
    messages: InquiryMessage[];
    createdAt: Timestamp;
};

const statusColors: Record<Inquiry['status'], string> = {
    "Read": "bg-blue-500/20 text-blue-700 border-blue-500/30",
    "Unread": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    "Resolved": "bg-green-500/20 text-green-700 border-green-500/30",
    "User Reply": "bg-orange-500/20 text-orange-700 border-orange-500/30",
    "Admin Replied": "bg-purple-500/20 text-purple-700 border-purple-500/30",
}


export default function MyInquiriesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        const inquiriesQuery = query(
            collection(db, `contacts`), 
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        
        const unsubscribe = onSnapshot(inquiriesQuery, (querySnapshot) => {
            const inquiriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
            setInquiries(inquiriesData);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch inquiries:", error);
            toast({ title: "Error", description: "Could not load your inquiries.", variant: "destructive"})
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, router, toast]);

    const handleDelete = async (id: string) => {
        if (!user) return;
        setDeletingId(id);
        const inquiryRef = doc(db, `contacts`, id);
        try {
            await deleteDoc(inquiryRef);
            toast({ title: "Success", description: "Your inquiry has been deleted." });
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
            toast({ title: "Error", description: "Could not delete the inquiry.", variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };
    
    const handleReplySubmit = async (inquiryId: string) => {
        if (!user || !replyMessage.trim()) return;

        setReplyingTo(inquiryId);
        const inquiryRef = doc(db, `contacts`, inquiryId);
        
        const newMessage: InquiryMessage = {
            text: replyMessage,
            senderId: user.uid,
            senderName: user.displayName || "You",
            createdAt: Timestamp.now()
        };

        try {
            await updateDoc(inquiryRef, {
                messages: arrayUnion(newMessage),
                status: "User Reply"
            });
            setReplyMessage("");
        } catch (error) {
            toast({ title: "Error", description: "Failed to send reply.", variant: "destructive" });
        } finally {
            setReplyingTo(null);
        }
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
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Mail /> My Inquiries</CardTitle>
                    <CardDescription>Here is a list of all your submitted messages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.map(inquiry => (
                                <TableRow key={inquiry.id}>
                                    <TableCell className="font-medium">{inquiry.subject}</TableCell>
                                    <TableCell><Badge variant='outline' className={statusColors[inquiry.status] || ''}>{inquiry.status}</Badge></TableCell>
                                    <TableCell>{inquiry.createdAt.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">View</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>{inquiry.subject}</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                    {inquiry.messages?.map((msg, index) => (
                                                        <div key={index} className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                                                            <div className={`rounded-lg p-3 max-w-[80%] ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                                <p className="text-sm font-bold">{msg.senderName}</p>
                                                                <p className="text-sm">{msg.text}</p>
                                                                <p className="text-xs opacity-70 mt-1">{msg.createdAt.toDate().toLocaleString()}</p>
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
                                                    This action cannot be undone. This will permanently delete your message thread.
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
                    {inquiries.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="mb-4">You haven't sent any inquiries yet.</p>
                            <Button asChild>
                                <a href="/contact">Contact Us</a>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )

}
