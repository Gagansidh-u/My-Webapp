
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ChatBubbles from "@/components/chat-bubbles";
import ChatInput from "@/components/chat-input";
import { sendMessage } from "@/app/chat/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

    useEffect(() => {
        const q = query(collection(db, "chats"), orderBy("lastMessage.createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsData: Chat[] = [];
            querySnapshot.forEach((doc) => {
                chatsData.push({ id: doc.id, ...doc.data() } as Chat);
            });
            setChats(chatsData);
            if (chatsData.length > 0 && !selectedChat) {
                setSelectedChat(chatsData[0]);
            }
            setLoadingChats(false);
        }, (error) => {
            console.error("Failed to fetch chats:", error);
            toast({ title: "Error", description: "Failed to load chat sessions.", variant: "destructive" });
            setLoadingChats(false);
        });

        return () => unsubscribe();
    }, [toast, selectedChat]);

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
    
    if (loadingChats) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
            <Card className="lg:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-2">
                    <div className="space-y-2">
                        {chats.map(chat => (
                            <div
                                key={chat.id}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedChat?.id === chat.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <Avatar>
                                    <AvatarFallback>{getUserInitials(chat.userEmail)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow overflow-hidden">
                                    <p className="font-semibold truncate">{chat.userEmail}</p>
                                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage?.text || 'Image sent'}</p>
                                </div>
                                {chat.lastMessage?.createdAt && (
                                    <p className="text-xs text-muted-foreground self-start">{new Date(chat.lastMessage.createdAt.seconds * 1000).toLocaleDateString()}</p>
                                )}
                            </div>
                        ))}
                         {chats.length === 0 && !loadingChats && (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageSquare className="mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No conversations found.</h3>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 flex flex-col">
                {selectedChat ? (
                    <>
                        <CardHeader className="border-b">
                            <CardTitle>Chat with {selectedChat.userEmail}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-y-auto p-4">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : (
                                <ChatBubbles messages={messages} currentUserId="admin" />
                            )}
                        </CardContent>
                        <div className="border-t p-4 bg-background">
                            <ChatInput onSendMessage={handleSendMessage} />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Send className="w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-semibold">Select a chat to begin</h2>
                        <p>Choose a conversation from the left to view messages and reply.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
