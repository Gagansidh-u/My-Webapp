
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, collectionGroup } from "firebase/firestore";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ChatBubbles from "@/components/chat-bubbles";
import ChatInput from "@/components/chat-input";
import { sendMessage } from "@/app/chat/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    
    const getUserInitials = (email: string | null | undefined) => {
      if (!email) return 'U';
      return email.substring(0, 2).toUpperCase();
    }
    
    const handleChatSelect = (chat: Chat) => {
        setSelectedChat(chat);
        setIsDialogOpen(true);
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
                <CardTitle>User Messages</CardTitle>
                <CardDescription>A list of all conversations from users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Last Message</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {chats.map(chat => (
                            <TableRow key={chat.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{getUserInitials(chat.userEmail)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{chat.userEmail}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="truncate max-w-sm">{chat.lastMessage?.text || 'Image'}</TableCell>
                                <TableCell>
                                    {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                                </TableCell>
                                <TableCell>
                                     <Button variant="outline" size="sm" onClick={() => handleChatSelect(chat)}>
                                         <MessageSquare className="h-4 w-4 mr-2" />
                                         View Chat
                                     </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {chats.length === 0 && !loadingChats && (
                    <div className="text-center py-12 text-muted-foreground">
                        No conversations found.
                    </div>
                )}
            </CardContent>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
                    {selectedChat ? (
                        <>
                            <DialogHeader className="p-6 border-b">
                                <DialogTitle>Chat with {selectedChat.userEmail}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-grow overflow-y-auto p-6">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    </div>
                                ) : (
                                    <ChatBubbles messages={messages} currentUserId="admin" />
                                )}
                            </div>
                            <div className="border-t p-6 bg-background">
                                <ChatInput onSendMessage={handleSendMessage} />
                            </div>
                        </>
                    ) : (
                         <div className="flex items-center justify-center h-full">
                            <p>No chat selected.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
