"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AdminSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [adminExists, setAdminExists] = React.useState(true);

  React.useEffect(() => {
    const checkAdmin = async () => {
        const querySnapshot = await getDocs(collection(db, "admins"));
        setAdminExists(!querySnapshot.empty);
    };
    checkAdmin();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        const querySnapshot = await getDocs(collection(db, "admins"));
        if (!querySnapshot.empty) {
            throw new Error("An admin account already exists. Signup is disabled.");
        }

      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await setDoc(doc(db, "admins", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      toast({ title: "Success", description: "Admin account created successfully. You will be redirected to the admin panel." });
      router.push("/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }

  if (adminExists) {
      return (
        <div className="container mx-auto flex min-h-screen items-center justify-center py-12 bg-background">
             <Card className="w-full max-w-md shadow-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Admin Signup Disabled</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>An admin account has already been created. It is not possible to create another one.</p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/login">Go to Admin Login</Link>
                    </Button>
                </CardContent>
             </Card>
        </div>
      )
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Create Admin Account</CardTitle>
          <CardDescription>This will be the only admin account for the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Admin Account
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
            Already have an admin account?{' '}
            <Link href="/admin/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
