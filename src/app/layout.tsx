import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://grock.dev'), // Replace with your actual domain
  title: {
    default: 'Grock Technologies: Web Services',
    template: `%s | Grock Technologies`,
  },
  description: 'Grock Technologies offers blazing-fast, secure, and reliable web hosting and development services. Get your professional website online in minutes with our competitive pricing and expert support.',
  keywords: ['web hosting', 'website development', 'fast hosting', 'secure hosting', 'WordPress hosting', 'Grock Technologies', 'small business website', 'professional website', 'online presence', 'NVMe hosting', 'LiteSpeed server'],
  authors: [{ name: 'Grock Technologies', url: 'https://grock.dev' }],
  creator: 'Grock Technologies',
  publisher: 'Grock Technologies',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Grock Technologies: Professional Web Services',
    description: 'Fast, secure, and reliable web solutions to build your digital presence.',
    url: 'https://grock.dev',
    siteName: 'Grock Technologies',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // Replace with your OG image URL
        width: 1200,
        height: 630,
        alt: 'Grock Technologies Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grock Technologies: Professional Web Services',
    description: 'Launch your professional website in minutes with Grock Technologies. Fast, secure, and reliable hosting solutions.',
    images: ['https://placehold.co/1200x630.png'], // Replace with your Twitter image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
