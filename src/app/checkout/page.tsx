"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { createOrder } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutPage() {
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [plan, setPlan] = useState("");
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const planId = searchParams.get('plan');
        const priceStr = searchParams.get('price');
        if (planId) {
            setPlan(planId.charAt(0).toUpperCase() + planId.slice(1));
        }
        if (priceStr) {
            setPrice(parseFloat(priceStr));
        }
    }, [searchParams]);

    const handlePayment = async () => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to proceed with the payment.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        const result = await createOrder({ amount: price });

        if (result.error || !result.order) {
            toast({
                title: "Payment Error",
                description: result.error || "Could not initialize payment.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        const order = result.order;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Grock Technologies",
            description: `Payment for ${plan} Plan`,
            order_id: order.id,
            handler: function (response: any) {
                toast({
                    title: "Payment Successful",
                    description: `Payment ID: ${response.razorpay_payment_id}`,
                });
                // Here you would typically verify the payment signature on your server
            },
            prefill: {
                name: user.displayName || "Customer",
                email: user.email || "",
                contact: "",
            },
            notes: {
                plan: plan,
                userId: user.uid,
            },
            theme: {
                color: "#673AB7",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
            toast({
                title: "Payment Failed",
                description: response.error.description,
                variant: "destructive",
            });
        });

        rzp.open();
        setLoading(false);
    };

    if (authLoading) {
        return <div className="container mx-auto py-12 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
    }

    return (
        <div className="container mx-auto py-12 flex justify-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Checkout Summary</CardTitle>
                    <CardDescription>Review your order and proceed to payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Plan:</span>
                            <span className="font-semibold">{plan}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold">₹{price.toFixed(2)}/mo</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-4 mt-4">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-xl font-bold font-headline text-primary">₹{price.toFixed(2)}</span>
                        </div>
                    </div>
                     {!user && (
                        <div className="text-center text-red-500 p-3 bg-red-500/10 rounded-md">
                           Please <Link href="/login" className="font-bold underline">log in</Link> to complete your purchase.
                        </div>
                    )}
                    <Button onClick={handlePayment} className="w-full font-bold" size="lg" disabled={!user || loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        {loading ? 'Processing...' : `Pay ₹${price.toFixed(2)}`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CheckoutSuspenseWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
      <CheckoutPage />
    </Suspense>
  )
}
