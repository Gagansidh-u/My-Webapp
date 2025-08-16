
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader } from "@/components/ui/loader";

const plans = [
  {
    title: 'Trying',
    monthlyPrice: 0.00,
    buildingCharge: 0.00,
    description: 'Get a taste of our platform',
    features: [
      '1 Website',
      '1 GB NVMe Storage',
      'Limited Bandwidth',
      'Free Email Account',
      'Unlimited Free SSL',
    ],
    planId: 'trying',
    discount: 'Free'
  },
  {
    title: 'Single Website',
    monthlyPrice: 149.00,
    buildingCharge: 999.00,
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
    planId: 'single',
    discount: '25% off'
  },
  {
    title: 'Web Starter',
    monthlyPrice: 249.00,
    buildingCharge: 999.00,
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
    planId: 'starter',
    discount: '40% off'
  },
  {
    title: 'Business Website',
    monthlyPrice: 399.00,
    buildingCharge: 999.00,
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
    planId: 'business',
    discount: '55% off'
  }
];

type Order = {
    id: string;
    userId: string;
    plan: string;
    duration: number; // in months
    createdAt: Timestamp;
};

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth();
  const [activePlans, setActivePlans] = useState<string[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
        setLoadingPlans(false);
        return;
    }

    const fetchUserOrders = async () => {
        try {
            const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(ordersQuery);
            const userOrders = querySnapshot.docs.map(doc => doc.data() as Order);
            
            const currentlyActivePlans = userOrders.filter(order => {
                const expirationDate = new Date(order.createdAt.seconds * 1000);
                expirationDate.setMonth(expirationDate.getMonth() + order.duration);
                return expirationDate > new Date();
            }).map(order => order.plan);
            
            setActivePlans(currentlyActivePlans);

        } catch (error) {
            console.error("Failed to fetch user orders:", error);
        } finally {
            setLoadingPlans(false);
        }
    };

    fetchUserOrders();
  }, [user, authLoading]);


  return (
    <div 
      className="container mx-auto py-16 md:py-24"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Pricing Plans</h1>
        <p className="text-lg text-muted-foreground mt-2">Choose the perfect plan for your needs. Simple, transparent, and powerful.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start md:grid-cols-2">
        {plans.map((plan, index) => {
          const isPlanActive = activePlans.includes(plan.title);
          
          return (
            <div key={index}>
              <Card className={`flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${plan.popular ? 'border-primary border-2 shadow-primary/20 shadow-lg' : 'shadow-lg'} relative`}>
                {plan.popular && <Badge variant="default" className="absolute top-0 right-4 -mt-3 px-4 py-1 text-sm font-bold">Most Popular</Badge>}
                 {plan.discount && (
                    <Badge 
                      variant={plan.planId === 'trying' ? 'default' : 'destructive'}
                      className="absolute top-4 left-4 -rotate-12 text-base font-bold"
                    >
                      {plan.discount}
                    </Badge>
                  )}
                <CardHeader className="text-center pt-16">
                  <CardTitle className="text-2xl font-headline">{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold font-headline">₹{plan.monthlyPrice.toFixed(2)}</span>
                        {plan.planId !== 'trying' && <span className="text-muted-foreground">/mo</span>}
                    </div>
                     {plan.buildingCharge > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                            + ₹{plan.buildingCharge.toFixed(2)} One-Time Building Fee
                        </p>
                     )}
                     <p className="text-xs text-muted-foreground">
                        + Taxes
                     </p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                    {loadingPlans ? (
                        <Button className="w-full font-bold" size="lg" disabled>
                            <Loader size={20} className="mr-2" /> Loading...
                        </Button>
                    ) : isPlanActive ? (
                         <Button className="w-full font-bold" size="lg" disabled>
                            Active Plan
                        </Button>
                    ) : (
                        <Button asChild className="w-full font-bold" size="lg" variant={plan.popular ? 'default' : 'secondary'}>
                            <Link href={`/checkout?plan=${plan.planId}&price=${plan.monthlyPrice}&buildingCharge=${plan.buildingCharge}`}>Get Started</Link>
                        </Button>
                    )}
                </CardFooter>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  );
}
