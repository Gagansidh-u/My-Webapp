
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, onSnapshot, orderBy, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import ChatBubbles from "@/components/chat-bubbles";
import ChatInput from "@/components/chat-input";
import { sendMessage } from "@/app/chat/actions";

interface Message {
    id: string;
    text: string | null;
    imageUrl: string | null;
    senderId: string;
    createdAt: any;
}

export default function UserChatPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace("/login");
            return;
        }

        const getOrCreateChat = async () => {
            const chatQuery = query(collection(db, "chats"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(chatQuery);

            let existingChatId: string | null = null;
            if (querySnapshot.empty) {
                // Create a new chat document if one doesn't exist
                const newChatRef = doc(collection(db, "chats"));
                 await setDoc(newChatRef, {
                    userId: user.uid,
                    userEmail: user.email,
                    createdAt: serverTimestamp(),
                    lastMessage: {
                        text: "Conversation started.",
                        createdAt: serverTimestamp()
                    }
                });
                existingChatId = newChatRef.id;
            } else {
                existingChatId = querySnapshot.docs[0].id;
            }
            setChatId(existingChatId);
        };

        getOrCreateChat();
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!chatId) return;

        const messagesQuery = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(messagesData);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch messages:", error);
            toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId, toast]);

    const handleSendMessage = async (content: { text?: string; imageUrl?: string }) => {
        if (!chatId || !user || (!content.text && !content.imageUrl)) return;

        const result = await sendMessage({
            chatId,
            senderId: user.uid,
            ...content,
        });

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
             // Also update the lastMessage on the chat document
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, { 
                lastMessage: {
                    text: content.text || "Image sent",
                    createdAt: serverTimestamp()
                }
            });
        }
    };
    
    if (authLoading || loading) {
        return (
            <div className="flex h-[calc(100vh-12rem)] items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 flex justify-center">
            <Card className="w-full max-w-3xl h-[calc(100vh-12rem)] flex flex-col">
                <CardHeader>
                    <CardTitle>Support Chat</CardTitle>
                    <CardDescription>Chat directly with our support team.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4">
                    <ChatBubbles messages={messages} currentUserId={user?.uid || ""} />
                </CardContent>
                <div className="border-t p-4 bg-background">
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </Card>
        </div>
    );
}
