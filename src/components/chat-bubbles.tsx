
"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';

interface Message {
    id: string;
    text: string | null;
    imageUrl: string | null;
    senderId: string;
    createdAt: any;
}

interface ChatBubblesProps {
    messages: Message[];
    currentUserId: string;
}

const ChatBubbles: React.FC<ChatBubblesProps> = ({ messages, currentUserId }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getUserInitials = (id: string) => {
        if (id === 'admin') return 'AD';
        return 'U';
    }

    return (
        <div className="space-y-4">
            {messages.map(message => {
                const isCurrentUser = message.senderId === currentUserId;
                return (
                    <div key={message.id} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                        {!isCurrentUser && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{getUserInitials(message.senderId)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                            {message.imageUrl && (
                                <div className="mt-2">
                                     <Image
                                        src={message.imageUrl}
                                        alt="Chat image"
                                        width={300}
                                        height={300}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            )}
                            <p className={cn(
                                "text-xs mt-1",
                                isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                                {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                         {isCurrentUser && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{getUserInitials(currentUserId)}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                );
            })}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default ChatBubbles;
