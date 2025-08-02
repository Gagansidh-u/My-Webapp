
"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToActionSection() {
    return (
        <section className="w-full py-20 md:py-32 bg-card">
            <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
                Ready to Launch Your Dream Website?
            </h2>
            <p className="text-lg text-muted-foreground my-4 max-w-2xl mx-auto">
                Join thousands of satisfied customers and build your online presence on a hosting platform designed for speed, security, and growth.
            </p>
            <div>
                <Button asChild size="lg" className="font-bold mt-4">
                <Link href="/pricing">View Plans & Get Started</Link>
                </Button>
            </div>
            </div>
      </section>
    )
}
