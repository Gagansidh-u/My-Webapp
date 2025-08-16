
"use client"

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from 'next/dynamic';
import { Suspense, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const FeaturesSection = dynamic(() => import('@/components/features-section'), { 
    loading: () => <Skeleton className="h-[400px] w-full" />,
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
const ECommerceSection = dynamic(() => import('@/components/e-commerce-section'), {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false
});

export default function HomePageClient() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

  return (
    <div ref={targetRef} className="relative">
      <motion.section 
        style={{ opacity, scale }}
        className="w-full bg-background py-20 md:py-32 sticky top-0 h-screen flex items-center"
      >
        <div className="container mx-auto">
          <div className="space-y-6 text-center w-full">
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
          </div>
        </div>
      </motion.section>

      <div className="relative z-10 bg-background">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
            <ECommerceSection />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-none" />}>
          <CallToActionSection />
        </Suspense>
      </div>
    </div>
  );
}
