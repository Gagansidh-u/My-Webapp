
"use server";

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Retrieves the stored image URL for a given blog slug from Firestore.
 * @param slug - The unique identifier for the blog post.
 * @returns The image URL if it exists, otherwise null.
 */
export async function getBlogImageUrl(slug: string): Promise<string | null> {
    try {
        const docRef = doc(db, "blog_images", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().imageUrl;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}

/**
 * Saves a new generated image URL to Firestore.
 * @param slug - The unique identifier for the blog post.
 * @param imageUrl - The data URI of the generated image to save.
 * @returns An object indicating success or failure.
 */
export async function saveBlogImageUrl(slug: string, imageUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, "blog_images", slug);
        await setDoc(docRef, { imageUrl });
        return { success: true };
    } catch (error) {
        console.error("Error setting document:", error);
        return { success: false, error: "Failed to save image URL." };
    }
}
