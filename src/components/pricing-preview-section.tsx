
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const plans = [
  {
    title: 'Single Website',
    monthlyPrice: 149.00,
    buildingCharge: 999.00,
    description: 'Ideal for getting started with your first website.',
    features: [
      '1 Website',
      '50 GB NVMe Storage',
      'Perfect for Beginners'
    ],
    planId: 'single'
  },
  {
    title: 'Web Starter',
    monthlyPrice: 249.00,
    buildingCharge: 999.00,
    description: 'Great for growing sites or multiple personal projects.',
    features: [
      'Up to 100 Websites',
      '100 GB NVMe Storage',
      'Includes Daily Backups'
    ],
    popular: true,
    planId: 'starter'
  },
  {
    title: 'Business Website',
    monthlyPrice: 399.00,
    buildingCharge: 999.00,
    description: 'The best choice for small businesses and e-commerce.',
    features: [
      'Up to 100 Websites',
      '200 GB NVMe Storage',
      'Free CDN Included'
    ],
    planId: 'business'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PricingPreviewSection() {
  return (
    <section 
      id="pricing-preview"
      className="w-full py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Choose the plan that's right for you. All plans come with our top-tier performance and support.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch md:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <Card className={`flex flex-col w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${plan.popular ? 'border-primary border-2 shadow-primary/20 shadow-lg' : 'shadow-lg'} relative`}>
                {plan.popular && <Badge variant="default" className="absolute top-0 right-4 -mt-3 px-4 py-1 text-sm font-bold">Most Popular</Badge>}
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <div className="flex items-baseline">
                        <span className="text-4xl font-bold font-headline">₹{plan.monthlyPrice.toFixed(2)}</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                     <p className="text-sm text-muted-foreground mt-1">
                        + One-Time Fee
                     </p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-bold" size="lg" variant={plan.popular ? 'default' : 'secondary'}>
                    <Link href={`/checkout?plan=${plan.planId}&price=${plan.monthlyPrice}&buildingCharge=${plan.buildingCharge}`}>Get Plan</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/pricing">View All Plans & Features</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
