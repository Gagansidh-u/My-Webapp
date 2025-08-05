
"use client"

import { Button } from "@/components/ui/button";
import { Cloud, Database, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturesSection = dynamic(() => import('@/components/features-section'), { 
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false 
});
const PricingPreviewSection = dynamic(() => import('@/components/pricing-preview-section'), {
    loading: () => <Skeleton className="h-[500px] w-full" />,
    ssr: false
});
const TestimonialsSection = dynamic(() => import('@/components/testimonials-section'), {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false 
});
const CallToActionSection = dynamic(() => import('@/components/cta-section'), {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false 
});


export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-background py-20 md:py-32">
        <div className="container mx-auto flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center w-full"
          >
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Build Your High-Speed Digital Presence with <span className="text-primary">Grock</span>
            </h1>
            <p className="text-lg text-muted-foreground md:w-4/5 mx-auto">
              Launch your professional website in minutes. We provide fast, secure, and reliable hosting solutions with competitive pricing, tailored for your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-bold">
                <Link href="/pricing">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-none" />}>
        <PricingPreviewSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<Skeleton className="h-80 w-full rounded-none" />}>
        <CallToActionSection />
      </Suspense>

    </div>
  );
}
