
"use client";

import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <SignupForm />
      </Card>
    </div>
  );
}
