"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    title: 'Single Website',
    price: '149.00',
    description: 'Ideal for beginners',
    features: [
      '1 Website',
      '50 GB NVMe Storage',
      'Weekly Backups',
      'Unlimited Free SSL',
      'Unlimited Bandwidth',
      'Free Email',
      'Free Domain (₹799.00 value)'
    ],
    planId: 'single'
  },
  {
    title: 'Web Starter',
    price: '249.00',
    description: 'Perfect for personal websites',
    features: [
      '100 Websites',
      '100 GB NVMe Storage',
      'Daily Backups (₹1,548.00 value)',
      'Unlimited Free SSL',
      'Unlimited Bandwidth',
      'Free Email',
      'Free Domain (₹799.00 value)'
    ],
    popular: true,
    planId: 'starter'
  },
  {
    title: 'Business Website',
    price: '399.00',
    description: 'Optimized for small businesses',
    features: [
      '100 Websites',
      '200 GB NVMe Storage',
      'Daily Backups (₹1,548.00 value)',
      'Unlimited Free SSL',
      'Unlimited Bandwidth',
      'Free Email',
      'Free Domain (₹799.00 value)',
      'Free CDN'
    ],
    planId: 'business'
  }
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function PricingPage() {
  return (
    <motion.div 
      className="container mx-auto py-16 md:py-24"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.2 }}
    >
      <div className="text-center mb-12">
        <motion.h1 className="text-4xl md:text-5xl font-headline font-bold" variants={fadeIn}>Our Pricing Plans</motion.h1>
        <motion.p className="text-lg text-muted-foreground mt-2" variants={fadeIn}>Choose the perfect plan for your needs. Simple, transparent, and powerful.</motion.p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {services.map((service, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${service.popular ? 'border-primary border-2 shadow-primary/20 shadow-lg relative' : 'shadow-lg'}`}>
              {service.popular && <div className="absolute top-0 right-4 -mt-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold font-headline">₹{service.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full font-bold" size="lg" variant={service.popular ? 'default' : 'secondary'}>
                  <Link href={`/checkout?plan=${service.planId}&price=${service.price}`}>Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
