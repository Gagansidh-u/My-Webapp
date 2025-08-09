
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, where, doc, deleteDoc } from "firebase/firestore";
import { Loader2, Mail, Trash2 } from "lucide-react";
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

type Inquiry = {
    id: string;
    subject: string;
    status: 'Read' | 'Unread';
    createdAt: Timestamp;
};

const statusColors: Record<Inquiry['status'], string> = {
    "Read": "bg-green-500/20 text-green-700 border-green-500/30",
    "Unread": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
}


export default function MyInquiriesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        const inquiriesQuery = query(
            collection(db, `users/${user.uid}/contacts`), 
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
        const inquiryRef = doc(db, `users/${user.uid}/contacts`, id);
        try {
            await deleteDoc(inquiryRef);
            toast({ title: "Success", description: "Your inquiry has been deleted." });
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
            toast({ title: "Error", description: "Could not delete the inquiry.", variant: "destructive" });
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex h-[calc(100vh-12rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
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
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete Inquiry</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your message.
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
