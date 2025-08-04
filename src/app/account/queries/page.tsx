
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { Loader2, MailQuestion, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

type MessageStatus = "Read" | "Unread";
type DisplayStatus = "Opened" | "Not Opened";

type ContactMessage = {
    id: string;
    email: string;
    subject: string;
    message: string;
    status: MessageStatus;
    createdAt: Timestamp;
};

const messageStatusMapping: Record<MessageStatus, DisplayStatus> = {
    "Read": "Opened",
    "Unread": "Not Opened",
};

const messageStatusColors: Record<DisplayStatus, string> = {
    "Opened": "bg-green-500/20 text-green-700 border-green-500/30",
    "Not Opened": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
};

export default function MyQueriesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [queries, setQueries] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user || !user.email) {
            router.replace("/login");
            return;
        }

        const fetchQueries = async () => {
            try {
                const queriesQuery = query(
                    collection(db, "contacts"),
                    where("email", "==", user.email),
                    orderBy("createdAt", "desc")
                );
                const queriesSnapshot = await getDocs(queriesQuery);
                const queriesData = queriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
                setQueries(queriesData);
            } catch (error) {
                console.error("Failed to fetch user queries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQueries();
    }, [user, authLoading, router]);

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
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><MailQuestion /> My Queries</CardTitle>
                    <CardDescription>Here is a list of all your contact messages and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queries.map(query => {
                                const displayStatus = messageStatusMapping[query.status];
                                return (
                                <TableRow key={query.id}>
                                    <TableCell>{query.subject}</TableCell>
                                    <TableCell><Badge variant='outline' className={messageStatusColors[displayStatus] || ''}>{displayStatus}</Badge></TableCell>
                                    <TableCell>{query.createdAt.toDate().toLocaleDateString()}</TableCell>
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
                                                    <DialogTitle>Message Details</DialogTitle>
                                                     <DialogDescription>
                                                        Subject: {query.subject}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div>
                                                        <h4 className="font-semibold">Your Message</h4>
                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{query.message}</p>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    {queries.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="mb-4">You haven't sent any messages yet.</p>
                            <Button asChild>
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )

}
