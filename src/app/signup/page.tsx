
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui/card";

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
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
        <Card className="w-full shadow-2xl bg-transparent border-none">
             <AuthForm onAuthSuccess={handleSuccess} initialForm="signup" />
        </Card>
      </DialogContent>
    </Dialog>
  );
}
