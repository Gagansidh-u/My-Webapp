"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Wrench, Store } from "lucide-react";

const ECommerceSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-card">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
          Complete E-commerce & Website Building Services
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          From a simple landing page to a complex online store, we provide end-to-end solutions to build, manage, and grow your online business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Card className="shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Wrench className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">Custom Website Building</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We design and develop beautiful, responsive, and SEO-friendly websites tailored to your brand. Let our Grock Website Building service create the perfect online presence for you.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">WooCommerce & Shopify</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We specialize in setting up and customizing powerful e-commerce platforms. Whether you prefer the flexibility of WooCommerce or the simplicity of Shopify, we've got you covered.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Store className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">Full Store Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Focus on your products and customers while we handle the technical side. Our store management services include updates, security, and performance optimization.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ECommerceSection;
