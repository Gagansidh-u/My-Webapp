
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { ImageIcon, Loader2 } from 'lucide-react';
import { generateBlogImage } from '@/ai/flows/generate-blog-image-flow';
import { useToast } from '@/hooks/use-toast';
import { getBlogImageUrl, saveBlogImageUrl } from '@/app/blog/actions';

interface BlogImageGeneratorProps {
  blogSlug: string;
  initialImage: string;
  altText: string;
  title: string;
}

export default function BlogImageGenerator({ blogSlug, initialImage, altText, title }: BlogImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);
  const [imageIsPermanent, setImageIsPermanent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAndLoadPermanentImage = async () => {
      setCheckingStorage(true);
      const permanentUrl = await getBlogImageUrl(blogSlug);
      if (permanentUrl) {
        setImageUrl(permanentUrl);
        setImageIsPermanent(true);
      }
      setCheckingStorage(false);
    };
    
    checkAndLoadPermanentImage();
  }, [blogSlug]);

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await generateBlogImage({ prompt: title });
      if (result.imageUrl) {
        const saveResult = await saveBlogImageUrl(blogSlug, result.imageUrl);
        if (saveResult.success) {
            setImageUrl(result.imageUrl);
            setImageIsPermanent(true); 
            toast({
              title: "Success!",
              description: "New blog image has been generated and saved.",
            });
        } else {
             throw new Error(saveResult.error || 'Failed to save the image.');
        }
      } else {
        throw new Error("Image generation returned no URL.");
      }
    } catch (error: any) {
      console.error("Image generation or saving failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate or save image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-full aspect-video">
      {checkingStorage ? (
        <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin"/>
        </div>
      ) : (
        <>
            <Image
                src={imageUrl}
                alt={altText}
                width={1200}
                height={630}
                className="w-full h-full object-cover transition-all duration-300"
                priority={true} // Prioritize loading the main blog image
            />
            {!imageIsPermanent && (
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
        </>
      )}
    </div>
  );
}
