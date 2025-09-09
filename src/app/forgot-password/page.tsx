
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

function ForgotPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox (and spam folder) for the reset link.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not send reset email. Please check if the email address is correct.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-white/90">Email</FormLabel>
                <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="w-full font-bold" disabled={loading}>
            {loading && <Loader size={20} className="mr-2" />}
            Send Reset Link
            </Button>
        </form>
    </Form>
  )
}


export default function ForgotPasswordPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
    setIsDialogOpen(open);
  }

  const handleSuccess = () => {
    setEmailSent(true);
  }
  
  const handleBackToLogin = () => {
      setIsDialogOpen(false);
      // Let the onOpenChange handler navigate back
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
         <DialogTitle className="sr-only">Forgot Password</DialogTitle>
         <Card className="w-full shadow-2xl bg-transparent border-none">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline text-white">Forgot Password</CardTitle>
                <CardDescription className="text-white/90">
                    {emailSent 
                        ? "A reset link has been sent to your email." 
                        : "Enter your email to receive a password reset link."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {emailSent ? (
                     <div className="text-center">
                        <p className="text-muted-foreground mb-4 text-white/80">If you don't receive an email within a few minutes, please check your spam folder or try again.</p>
                        <Button onClick={handleBackToLogin}>Back to Login</Button>
                    </div>
                ) : (
                    <ForgotPasswordForm onSuccess={handleSuccess} />
                )}
            </CardContent>
         </Card>
      </DialogContent>
    </Dialog>
  );
}
