
"use client";

import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleImageUpload } from '@/app/chat/actions';

interface ChatInputProps {
    onSendMessage: (content: { text?: string, imageUrl?: string }) => Promise<void>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleSend = async () => {
        if (!text.trim()) return;
        await onSendMessage({ text });
        setText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) { // 4MB size limit
            toast({
                title: "Error",
                description: "Image file size should not exceed 4MB.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            const result = await handleImageUpload({ photoDataUri: base64String });
            
            if (result.error || !result.imageUrl) {
                 toast({
                    title: "Upload Failed",
                    description: result.error || "Could not upload the image.",
                    variant: "destructive",
                });
            } else {
                await onSendMessage({ imageUrl: result.imageUrl });
            }
            setIsUploading(false);
        };
        reader.onerror = () => {
            setIsUploading(false);
             toast({
                title: "Error",
                description: "Failed to read file.",
                variant: "destructive",
            });
        };
    };

    return (
        <div className="flex items-center gap-2">
            <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-grow"
            />
             <Button type="button" size="icon" variant="ghost" onClick={handleFileSelect} disabled={isUploading}>
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                <span className="sr-only">Attach file</span>
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />
            <Button type="button" size="icon" onClick={handleSend} disabled={!text.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
            </Button>
        </div>
    );
};

export default ChatInput;
