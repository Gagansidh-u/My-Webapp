
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, query, where, getDocs, orderBy } from "firebase/firestore";
import { uploadImage } from "@/ai/flows/upload-image-flow";

const sendMessageSchema = z.object({
    chatId: z.string(),
    text: z.string().optional(),
    imageUrl: z.string().optional(),
    senderId: z.string(),
});

export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
    const validation = sendMessageSchema.safeParse(data);
    if (!validation.success) {
        return { error: "Invalid message data." };
    }

    const { chatId, text, imageUrl, senderId } = validation.data;

    if (!text && !imageUrl) {
        return { error: "Message must contain text or an image." };
    }

    try {
        const messagesColRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesColRef, {
            text: text || null,
            imageUrl: imageUrl || null,
            senderId,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Failed to send message." };
    }
}

const uploadImageSchema = z.object({
  photoDataUri: z.string(),
});

export async function handleImageUpload(data: z.infer<typeof uploadImageSchema>) {
    const validation = uploadImageSchema.safeParse(data);
    if (!validation.success) {
        return { error: "Invalid image data." };
    }
    
    try {
        const result = await uploadImage({ photoDataUri: validation.data.photoDataUri });
        if (result.imageUrl) {
            return { imageUrl: result.imageUrl };
        }
        throw new Error("Image upload failed to return a URL.");
    } catch (error) {
        console.error("Error handling image upload:", error);
        return { error: "Failed to upload image." };
    }
}
