import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
  );
}
