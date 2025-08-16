
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog"

type InquiryStatus = 'Read' | 'Unread';

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
    "Read": "bg-green-500/20 text-green-700 border-green-500/30",
    "Unread": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
}


export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);


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

    const handleMarkAsRead = async (id: string) => {
        const inquiryRef = doc(db, `contacts`, id);
        try {
            await updateDoc(inquiryRef, { status: "Read" });
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
            </CardHeader>
            <CardContent>
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
                        {inquiries.map(inquiry => (
                            <TableRow key={inquiry.id}>
                                <TableCell className="font-medium">{inquiry.name} <br/><span className="text-xs text-muted-foreground">{inquiry.email}</span></TableCell>
                                <TableCell>{inquiry.subject}</TableCell>
                                <TableCell><Badge variant='outline' className={statusColors[inquiry.status] || ''}>{inquiry.status}</Badge></TableCell>
                                <TableCell>{inquiry.createdAt.toDate().toLocaleDateString()}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" onClick={() => handleMarkAsRead(inquiry.id)}>View Message</Button>
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
                 {inquiries.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No inquiries found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
