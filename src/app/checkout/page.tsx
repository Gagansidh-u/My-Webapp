
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { createOrder } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, query, getDocs, limit, arrayUnion } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice } from "@/components/invoice";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const durationOptions = [
    { value: "1", label: "1 Month" },
    { value: "6", label: "6 Months" },
    { value: "12", label: "1 Year" },
    { value: "24", label: "2 Years" },
    { value: "36", label: "3 Years" },
]

type OrderDetailsForInvoice = {
    orderId: string;
    plan: string;
    price: number;
    duration: number;
    userEmail: string | null;
    userName: string | null;
    buildingCharge: number;
    monthlyPrice: number;
};

function CheckoutPage() {
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [plan, setPlan] = useState("");
    const [planId, setPlanId] = useState("");
    const [monthlyPrice, setMonthlyPrice] = useState(0);
    const [buildingCharge, setBuildingCharge] = useState(0);
    const [initialBuildingCharge, setInitialBuildingCharge] = useState(0);
    const [selectedDuration, setSelectedDuration] = useState(durationOptions[2]); // Default to 1 Year
    
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState<OrderDetailsForInvoice | null>(null);
    const [downloadFormat, setDownloadFormat] = useState("pdf");

    const invoiceRef = useRef<HTMLDivElement>(null);

    const [websiteDetails, setWebsiteDetails] = useState({
        description: "",
        colors: "",
        style: ""
    });

    useEffect(() => {
        const currentPlanId = searchParams.get('plan');
        const priceStr = searchParams.get('price');
        const buildingChargeStr = searchParams.get('buildingCharge');
        
        if (currentPlanId) {
            setPlanId(currentPlanId);
            setPlan(currentPlanId.charAt(0).toUpperCase() + currentPlanId.slice(1));
            if (currentPlanId === 'trying') {
                setSelectedDuration(durationOptions[0]); // Set duration to 1 month for trying plan
            }
        }
        if (priceStr) {
            setMonthlyPrice(parseFloat(priceStr));
        }
        if(buildingChargeStr) {
            const charge = parseFloat(buildingChargeStr);
            setBuildingCharge(charge);
            setInitialBuildingCharge(charge);
        }
    }, [searchParams]);

    useEffect(() => {
        if (authLoading || !user) return;

        const checkForPreviousOrders = async () => {
            const userDocRef = doc(db, `users/${user.uid}`);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data()?.orders?.length > 0) {
                setBuildingCharge(0);
            } else {
                setBuildingCharge(initialBuildingCharge);
            }
        };

        checkForPreviousOrders();
    }, [user, authLoading, initialBuildingCharge]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setWebsiteDetails(prev => ({ ...prev, [id]: value }));
    }

    const handleDurationChange = (value: string) => {
        const newDuration = durationOptions.find(d => d.value === value);
        if (newDuration) {
            setSelectedDuration(newDuration);
        }
    }
    
    const getTotalPrice = () => {
        const durationValue = parseInt(selectedDuration.value);
        let hostingPrice;
        if (durationValue === 1 && planId !== 'trying') {
            hostingPrice = monthlyPrice * 2;
        } else {
            hostingPrice = monthlyPrice * durationValue;
        }
        return hostingPrice + buildingCharge;
    }

    const handleDownloadInvoice = async () => {
        if (!invoiceRef.current) return;

        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        if (downloadFormat === 'pdf') {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoiceDetails?.orderId}.pdf`);
        } else {
             const link = document.createElement('a');
             link.href = imgData;
             link.download = `invoice-${invoiceDetails?.orderId}.jpg`;
             link.click();
        }
    };

    const handlePayment = async () => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to proceed with the payment.",
                variant: "destructive",
            });
            return;
        }

        if (planId !== 'trying' && (!websiteDetails.description.trim() || !websiteDetails.colors.trim() || !websiteDetails.style.trim())) {
            toast({
                title: "Website Details Required",
                description: "Please fill out all the fields about your website requirements.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        const totalPrice = getTotalPrice();
        const result = await createOrder({ amount: totalPrice });

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
            description: `Payment for ${plan} Plan (${selectedDuration.label})`,
            order_id: order.id,
            handler: async function (response: any) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    
                    const finalWebsiteDetails = planId === 'trying' 
                        ? { description: "", colors: "", style: "" }
                        : websiteDetails;

                    const newOrder = {
                        id: order.id,
                        userId: user.uid,
                        userEmail: user.email,
                        plan: plan,
                        price: totalPrice,
                        duration: parseInt(selectedDuration.value),
                        websiteDetails: finalWebsiteDetails,
                        razorpayPaymentId: response.razorpay_payment_id,
                        orderId: order.id,
                        status: "Paid",
                        createdAt: serverTimestamp()
                    };
                    
                    await setDoc(userDocRef, { 
                        orders: arrayUnion(newOrder),
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                     }, { merge: true });


                    setInvoiceDetails({
                        orderId: order.id,
                        plan: plan,
                        price: totalPrice,
                        duration: parseInt(selectedDuration.value),
                        userEmail: user.email,
                        userName: user.displayName,
                        buildingCharge: buildingCharge,
                        monthlyPrice: monthlyPrice
                    });

                    setShowSuccessDialog(true);
                } catch (error) {
                    console.error("Error writing document: ", error);
                    toast({
                        title: "Order Error",
                        description: "Your payment was successful, but we failed to save your order details. Please contact support.",
                        variant: "destructive",
                    });
                }
            },
            prefill: {
                name: user.displayName || "Customer",
                email: user.email || "",
                contact: "",
            },
            notes: {
                plan: plan,
                userId: user.uid,
                duration: `${selectedDuration.value} months`,
                description: websiteDetails.description.substring(0, 50),
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

    const totalPrice = getTotalPrice();

    const isTryingPlan = planId === 'trying';

    return (
        <>
            <div className="container mx-auto py-12 flex justify-center">
                <Card className="w-full max-w-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Checkout</CardTitle>
                        <CardDescription>Review your order and provide details for your new website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 border rounded-md">
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Plan:</span>
                                    <span className="font-semibold text-lg">{plan}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="duration-select" className="text-muted-foreground">Billing Cycle:</Label>
                                    <Select value={selectedDuration.value} onValueChange={handleDurationChange} disabled={isTryingPlan}>
                                        <SelectTrigger className="w-[180px]" id="duration-select">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {durationOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Building Charges (One-Time):</span>
                                    <span className="font-semibold">₹{buildingCharge.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-4 mt-4">
                                    <span className="text-lg font-bold">Total:</span>
                                    <span className="text-xl font-bold font-headline text-primary">₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {!isTryingPlan && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Website Requirements</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Brief description of your website</Label>
                                    <Textarea id="description" placeholder="e.g., A portfolio website to showcase my photography." rows={4} value={websiteDetails.description} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="colors">Preferred Colors</Label>
                                    <Input id="colors" placeholder="e.g., Blue, white, and a touch of gold" value={websiteDetails.colors} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="style">Style/Vibe</Label>
                                    <Input id="style" placeholder="e.g., Modern, minimalist, professional" value={websiteDetails.style} onChange={handleInputChange} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col items-stretch gap-4">
                        {!user && (
                            <div className="text-center text-red-500 p-3 bg-red-500/10 rounded-md">
                            Please <Link href="/login" className="font-bold underline">log in</Link> to complete your purchase.
                            </div>
                        )}
                        <Button onClick={handlePayment} className="w-full font-bold" size="lg" disabled={!user || loading || !totalPrice}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            {loading ? 'Processing...' : `Pay ₹${totalPrice > 0 ? totalPrice.toFixed(2) : '0.00'}`}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold font-headline text-center">Order Successful!</DialogTitle>
                        <DialogDescription className="text-center">
                           Thank you for your purchase. Here is your invoice.
                        </DialogDescription>
                    </DialogHeader>
                    <div ref={invoiceRef}>
                        {invoiceDetails && <Invoice details={invoiceDetails} />}
                    </div>
                    <DialogFooter className="mt-4 sm:justify-between items-center gap-4">
                         <div className="flex items-center gap-4">
                           <Label>Format:</Label>
                            <RadioGroup defaultValue="pdf" onValueChange={setDownloadFormat} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pdf" id="r-pdf" />
                                    <Label htmlFor="r-pdf">PDF</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="jpg" id="r-jpg" />
                                    <Label htmlFor="r-jpg">JPG</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Button onClick={handleDownloadInvoice}>
                            <Download className="mr-2 h-4 w-4"/>
                            Download Invoice
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function CheckoutSuspenseWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
      <CheckoutPage />
    </Suspense>
  )
}
