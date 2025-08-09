
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
            <CardDescription>Get started with our services</CardDescription>
        </CardHeader>
        <SignupForm />
      </Card>
    </div>
  );
}
