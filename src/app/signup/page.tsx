
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
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required."}),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits."}),
});

const googleFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required."}),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits."}),
});


const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const [showDetailsPopup, setShowDetailsPopup] = React.useState(false);
  const [googleUser, setGoogleUser] = React.useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
    },
  });

  const googleForm = useForm<z.infer<typeof googleFormSchema>>({
      resolver: zodResolver(googleFormSchema),
      defaultValues: { name: "", mobile: "" },
  });

  const createUserDocument = async (user: User, name?: string, mobile?: string) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: name || user.displayName,
            mobile: mobile,
            createdAt: new Date(),
        });
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: values.name });
      await user.reload(); 
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        await createUserDocument(updatedUser, updatedUser.displayName, values.mobile);
      }
      
      toast({ title: "Success", description: "Account created successfully." });
      router.push("/");
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
         toast({ title: "Success", description: "Logged in successfully with Google." });
         router.push("/");
      } else {
        setGoogleUser(user);
        googleForm.setValue("name", user.displayName || "");
        setShowDetailsPopup(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  async function onGoogleDetailsSubmit(values: z.infer<typeof googleFormSchema>) {
      if (!googleUser) return;
      setLoading(true);
      try {
          if (googleUser.displayName !== values.name) {
              await updateProfile(googleUser, { displayName: values.name });
          }
          await createUserDocument(googleUser, values.name, values.mobile);
          toast({ title: "Success", description: "Account created successfully." });
          setShowDetailsPopup(false);
          router.push("/");
      } catch (error: any) {
          toast({ title: "Error", description: "Failed to save details.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  }

  return (
    <>
        <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
            <CardDescription>Get started with our services</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                        <Input type="tel" placeholder="9876543210" {...field} />
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
                <Button type="submit" className="w-full font-bold" disabled={loading || googleLoading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                </Button>
                </form>
            </Form>

            <div className="relative my-6">
                <Separator />
                <div className="absolute inset-0 flex items-center">
                <span className="bg-card px-2 text-xs text-muted-foreground mx-auto">OR CONTINUE WITH</span>
                </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
                {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Sign up with Google
            </Button>

            <div className="mt-6 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                Log in
                </Link>
            </div>
            </CardContent>
        </Card>
        </div>

        <Dialog open={showDetailsPopup} onOpenChange={setShowDetailsPopup}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Just one more step. Please confirm your name and provide your mobile number.
                    </DialogDescription>
                </DialogHeader>
                <Form {...googleForm}>
                    <form onSubmit={googleForm.handleSubmit(onGoogleDetailsSubmit)} className="space-y-4">
                        <FormField
                            control={googleForm.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={googleForm.control}
                            name="mobile"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                <Input type="tel" placeholder="9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <Button type="submit" className="w-full font-bold" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save & Continue
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </>
  );
}
