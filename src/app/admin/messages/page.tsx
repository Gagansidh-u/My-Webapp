
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, collectionGroup, getDocs, doc } from "firebase/firestore";
import { Loader2, MessageSquare, Send, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ChatBubbles from "@/components/chat-bubbles";
import ChatInput from "@/components/chat-input";
import { sendMessage } from "@/app/chat/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Chat {
    id: string;
    lastMessage?: {
        text?: string | null;
        createdAt: Timestamp;
    };
    userEmail: string;
    userId: string;
}

interface Message {
    id: string;
    text: string | null;
    imageUrl: string | null;
    senderId: string;
    createdAt: Timestamp;
}

export default function AdminMessagesPage() {
    const { toast } = useToast();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "chats"), orderBy("lastMessage.createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsData: Chat[] = [];
            querySnapshot.forEach((doc) => {
                chatsData.push({ id: doc.id, ...doc.data() } as Chat);
            });
            setChats(chatsData);
            setLoadingChats(false);
        }, (error) => {
            console.error("Failed to fetch chats:", error);
            toast({ title: "Error", description: "Failed to load chat sessions.", variant: "destructive" });
            setLoadingChats(false);
        });

        return () => unsubscribe();
    }, [toast]);

    useEffect(() => {
        if (!selectedChat) return;

        setLoadingMessages(true);
        const messagesQuery = query(
            collection(db, "chats", selectedChat.id, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(messagesData);
            setLoadingMessages(false);
        }, (error) => {
            console.error("Failed to fetch messages:", error);
            setLoadingMessages(false);
        });

        return () => unsubscribe();
    }, [selectedChat]);

    const handleSendMessage = async (content: { text?: string; imageUrl?: string }) => {
        if (!selectedChat || (!content.text && !content.imageUrl)) return;

        const result = await sendMessage({
            chatId: selectedChat.id,
            senderId: "admin",
            ...content,
        });

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const openChatDialog = (chat: Chat) => {
        setSelectedChat(chat);
        setIsChatOpen(true);
    }
    
    const getUserInitials = (email: string | null | undefined) => {
      if (!email) return 'U';
      return email.substring(0, 2).toUpperCase();
    }
    
    if (loadingChats) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Mail className="h-6 w-6"/>
                    <CardTitle className="text-2xl font-headline">User Messages</CardTitle>
                </div>
                <CardDescription>A list of all conversations initiated by users.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Customer</TableHead>
                                <TableHead>Last Message</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chats.map(chat => (
                                <TableRow key={chat.id} className="hover:bg-accent/50 cursor-pointer" onClick={() => openChatDialog(chat)}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{getUserInitials(chat.userEmail)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{chat.userEmail}</div>
                                                <div className="text-xs text-muted-foreground">
                                                     {chat.lastMessage?.createdAt?.toDate().toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium truncate max-w-sm">{chat.lastMessage?.text || 'Image Sent'}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">
                                            View Chat
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {chats.length === 0 && !loadingChats && (
                    <div className="text-center py-20 text-muted-foreground">
                        <MessageSquare className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No conversations found.</h3>
                        <p className="mt-1 text-sm">When users start a chat, it will appear here.</p>
                    </div>
                )}
                 <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                    <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
                         {selectedChat && (
                            <>
                                <DialogHeader className="p-4 border-b">
                                    <DialogTitle>Chat with {selectedChat.userEmail}</DialogTitle>
                                </DialogHeader>
                                <div className="flex-grow overflow-y-auto p-4">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="animate-spin text-primary" size={32} />
                                        </div>
                                    ) : (
                                        <ChatBubbles messages={messages} currentUserId="admin" />
                                    )}
                                </div>
                                <div className="border-t p-4 bg-background">
                                    <ChatInput onSendMessage={handleSendMessage} />
                                </div>
                            </>
                         )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
