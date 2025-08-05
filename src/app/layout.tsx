
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.grock.fun'),
  title: {
    default: 'Grock: Fast NVMe Hosting & Web Services',
    template: `%s | Grock Technologies`,
  },
  description: 'Elevate your online presence with Grock Technologies. We provide blazing-fast, secure, and reliable web hosting with NVMe storage. Get started today!',
  keywords: ['Grock Technologies', 'grock.fun', 'web hosting', 'website development', 'fast hosting', 'secure hosting', 'WordPress hosting', 'small business website', 'professional website', 'online presence', 'NVMe hosting', 'LiteSpeed server', 'managed WordPress', 'e-commerce hosting', '99.9% uptime', 'free SSL', 'affordable web hosting', 'business hosting', 'developer hosting'],
  authors: [{ name: 'Grock Technologies', url: 'https://www.grock.fun' }],
  creator: 'Grock Technologies',
  publisher: 'Grock Technologies',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Grock Technologies: Fast, Secure & Reliable Web Solutions',
    description: 'Launch your professional website in minutes with our high-performance NVMe hosting and 99.9% uptime guarantee. Get started with Grock today.',
    url: 'https://www.grock.fun',
    siteName: 'Grock Technologies',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Grock Technologies - High Performance Web Hosting',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grock Technologies: Premium Web Services & Hosting',
    description: 'Launch your professional website in minutes with Grock. We provide fast, secure, and reliable hosting solutions powered by NVMe and LiteSpeed.',
    images: ['https://placehold.co/1200x630.png'], 
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
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F0FE" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0A0B" />
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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-1QNEL9F4Z9"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-1QNEL9F4Z9');
          `}
        </Script>
      </body>
    </html>
  );
}
