"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { ImageIcon, Loader2 } from 'lucide-react';
import { generateBlogImage } from '@/ai/flows/generate-blog-image-flow';
import { useToast } from '@/hooks/use-toast';

interface BlogImageGeneratorProps {
  blogSlug: string;
  initialImage: string;
  altText: string;
  prompt: string;
}

export default function BlogImageGenerator({ blogSlug, initialImage, altText, prompt }: BlogImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);
  const { toast } = useToast();
  const localStorageKey = `blog-image-${blogSlug}`;

  useEffect(() => {
    // On component mount, check if an image URL is already saved in local storage
    const savedImageUrl = localStorage.getItem(localStorageKey);
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
      setImageGenerated(true);
    }
  }, [localStorageKey]);

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await generateBlogImage({ prompt });
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        setImageGenerated(true);
        // Save the new image URL to local storage
        localStorage.setItem(localStorageKey, result.imageUrl);
        toast({
          title: "Success!",
          description: "New blog image has been generated.",
        });
      } else {
        throw new Error("Image generation returned no URL.");
      }
    } catch (error) {
      console.error("Image generation failed:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-full aspect-video">
      <Image
        src={imageUrl}
        alt={altText}
        width={1200}
        height={630}
        className="w-full h-full object-cover transition-all duration-300"
      />
      {!imageGenerated && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button onClick={handleGenerateImage} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>
      )}
    </div>
  );
}
