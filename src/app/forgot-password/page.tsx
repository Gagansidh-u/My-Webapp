
"use client";

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
import React from "react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

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
      setEmailSent(true);
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
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Forgot Password</CardTitle>
                <CardDescription>
                    {emailSent 
                        ? "A reset link has been sent to your email." 
                        : "Enter your email to receive a password reset link."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {emailSent ? (
                     <div className="text-center">
                        <p className="text-muted-foreground mb-4">If you don't receive an email within a few minutes, please check your spam folder or try again.</p>
                        <Button asChild>
                            <Link href="/login">Back to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
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
                )}
            </CardContent>
        </Card>
    </div>
  );
}
