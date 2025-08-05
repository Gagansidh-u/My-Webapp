
"use client" // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center py-12">
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0, 0.71, 0.2, 1.01]
            }}
        >
            <AlertTriangle className="w-24 h-24 text-destructive" />
        </motion.div>
        
        <motion.h1 
            className="text-3xl md:text-4xl font-bold font-headline mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            Oops! Something went wrong.
        </motion.h1>

        <motion.p 
            className="text-lg text-muted-foreground mt-2 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            We've encountered an unexpected error. Please try again.
        </motion.p>
        
         {process.env.NODE_ENV === 'development' && (
             <Card className="mt-6 w-full max-w-2xl text-left bg-destructive/10 border-destructive/50">
                 <CardHeader>
                     <CardTitle className="text-destructive">Error Details (Development Only)</CardTitle>
                     <CardDescription className="text-destructive/80">This panel is only visible in development mode.</CardDescription>
                 </CardHeader>
                <CardContent className="text-destructive text-sm">
                  <pre className="whitespace-pre-wrap break-all">
                    <code>
                      {error.message}
                    </code>
                  </pre>
                </CardContent>
            </Card>
        )}

        <motion.div
             className="flex gap-4 mt-8"
             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <Button onClick={() => reset()} size="lg" className="font-bold">
                Try Again
            </Button>
            <Button asChild size="lg" className="font-bold" variant="outline">
                <Link href="/">Go Back Home</Link>
            </Button>
        </motion.div>
    </div>
  )
}
