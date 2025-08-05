
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { ImageIcon, Loader2 } from 'lucide-react';
import { generateBlogImage } from '@/ai/flows/generate-blog-image-flow';
import { useToast } from '@/hooks/use-toast';

interface BlogImageGeneratorProps {
  initialImage: string;
  altText: string;
  title: string;
}

export default function BlogImageGenerator({ initialImage, altText, title }: BlogImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await generateBlogImage({ prompt: title });
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        setImageGenerated(true);
        toast({
          title: "Success!",
          description: "New blog image has been generated for this session.",
        });
      } else {
        throw new Error("Image generation returned no URL.");
      }
    } catch (error: any) {
      console.error("Image generation failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image. Please try again.",
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
            priority={true}
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
