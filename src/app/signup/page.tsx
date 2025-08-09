
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignupForm } from "@/components/signup-form";
import { useAuth } from "@/components/auth-provider";

export default function SignupPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect them away
    if (!loading && user) {
      router.replace('/');
      return;
    }
    // Otherwise, open the dialog
    if (!loading && !user) {
        setIsSignupOpen(true);
    }
  }, [user, loading, router]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If the dialog is closed, navigate back to the homepage
      router.push('/');
    }
    setIsSignupOpen(open);
  }

  const handleSuccess = () => {
    setIsSignupOpen(false);
    router.push('/');
  }

  return (
    <Dialog open={isSignupOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-headline">Create an Account</DialogTitle>
          <DialogDescription>Get started with our services</DialogDescription>
        </DialogHeader>
        <SignupForm onSignup={handleSuccess} onSwitchToLogin={() => router.push('/login')} />
      </DialogContent>
    </Dialog>
  );
}
