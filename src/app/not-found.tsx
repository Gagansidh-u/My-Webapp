
"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center py-12">
            <motion.div
                className="relative flex justify-center items-center mb-8"
                style={{ perspective: '1000px' }}
            >
                <motion.div
                    className="text-8xl md:text-9xl font-headline font-bold text-primary relative"
                    style={{ textShadow: "4px 4px 0px hsl(var(--foreground) / 0.1)" , transformStyle: 'preserve-3d' }}
                    animate={{ 
                        translateY: ["-10px", "10px", "-10px"],
                        
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    4
                </motion.div>
                 <motion.div
                    className="text-8xl md:text-9xl font-headline font-bold text-primary relative mx-4"
                    style={{ textShadow: "4px 4px 0px hsl(var(--foreground) / 0.1)" , transformStyle: 'preserve-3d' }}
                    animate={{ 
                        translateY: ["10px", "-10px", "10px"],
                        
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                    }}
                >
                    0
                </motion.div>
                 <motion.div
                    className="text-8xl md:text-9xl font-headline font-bold text-primary relative"
                    style={{ textShadow: "4px 4px 0px hsl(var(--foreground) / 0.1)" , transformStyle: 'preserve-3d' }}
                    animate={{ 
                        translateY: ["-10px", "10px", "-10px"],
                        
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4
                    }}
                >
                    4
                </motion.div>
            </motion.div>
            
            <motion.h1 
                className="text-3xl md:text-4xl font-bold font-headline mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                Oops! Page Not Found
            </motion.h1>
            <motion.p 
                className="text-lg text-muted-foreground mt-2 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
                The page you're looking for doesn't exist. It might have been moved or deleted.
            </motion.p>
            <motion.div
                 initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
                <Button asChild size="lg" className="mt-8 font-bold">
                    <Link href="/">Go Back Home</Link>
                </Button>
            </motion.div>
        </div>
    );
}
