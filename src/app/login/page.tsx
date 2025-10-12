
"use client";

import { Card } from "@/components/ui/card";
import { AuthForm } from "@/app/auth-form";

export default function LoginPage() {

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
