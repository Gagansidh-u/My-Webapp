
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { createOrder } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Download, Info } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { ref, set, serverTimestamp, get } from "firebase/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice } from "@/components/invoice";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AuthForm } from "@/components/auth-form";
import { sendEmail } from "@/app/actions/email";
import { NewOrderEmail } from "@/components/email/new-order-email";


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
    userMobile: string | null;
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
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState<OrderDetailsForInvoice | null>(null);
    const [downloadFormat, setDownloadFormat] = useState("pdf");
    const [hasPreviousOrders, setHasPreviousOrders] = useState(false);
    const [userMobile, setUserMobile] = useState<string | null>(null);


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

        const fetchUserData = async () => {
            if (user) {
                const userRef = ref(db, `users/${user.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setUserMobile(snapshot.val().mobile || null);
                }
            }
        };
        fetchUserData();

        const checkForPreviousOrders = async () => {
            // This check can be simplified or removed if we rely on the buildingCharge state
            // But can be kept for UI logic if needed
        };

        checkForPreviousOrders();
    }, [user, authLoading, initialBuildingCharge]);

    useEffect(() => {
         if (hasPreviousOrders) {
             setBuildingCharge(0);
         } else {
             setBuildingCharge(initialBuildingCharge);
         }
    }, [hasPreviousOrders, initialBuildingCharge])


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
        let hostingPrice = monthlyPrice * durationValue;

        // Doubling logic for 1-month plan
        if (durationValue === 1) {
             hostingPrice = monthlyPrice * 2;
        }
        
        if (planId === 'trying') {
            return 0;
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

    const handleCheckoutAction = () => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        handlePayment();
    }

    const handleSuccessfulOrder = async (orderDetails: any) => {
        // Send email notification
        await sendEmail({
            to: 'helpdesk.grock@outlook.com',
            subject: `New Order Received: ${orderDetails.orderId}`,
            react: <NewOrderEmail {...orderDetails} />,
        });

        // Set invoice details for the dialog
        setInvoiceDetails({
            orderId: orderDetails.orderId,
            plan: orderDetails.plan,
            price: orderDetails.price,
            duration: orderDetails.duration,
            userEmail: user?.email || null,
            userName: user?.displayName || null,
            userMobile: userMobile,
            buildingCharge: buildingCharge,
            monthlyPrice: monthlyPrice,
        });

        // Show the success dialog
        setShowSuccessDialog(true);
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

        if (!websiteDetails.description.trim() || !websiteDetails.colors.trim() || !websiteDetails.style.trim()) {
            toast({
                title: "Website Details Required",
                description: "Please fill out all the fields about your website requirements.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        const totalPrice = getTotalPrice();
        const orderKey = `order_${new Date().getTime()}`;

        const commonOrderDetails = {
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            userMobile: userMobile,
            plan: plan,
            duration: parseInt(selectedDuration.value),
            websiteDetails: websiteDetails,
            status: "Paid",
            createdAt: serverTimestamp(),
            price: totalPrice,
            orderId: orderKey,
        };

        if (totalPrice === 0) {
            try {
                await set(ref(db, 'orders/' + orderKey), commonOrderDetails);
                await handleSuccessfulOrder(commonOrderDetails);
            } catch (error) {
                 console.error("Error writing document: ", error);
                 toast({
                     title: "Order Error",
                     description: "We failed to save your order details. Please contact support.",
                     variant: "destructive",
                 });
            } finally {
                setLoading(false);
            }
            return;
        }

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
        const razorpayOrderId = order.id;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Grock Technologies",
            description: `Payment for ${plan} Plan (${selectedDuration.label})`,
            order_id: razorpayOrderId,
            handler: async function (response: any) {
                try {
                     const finalOrderDetails = {
                       ...commonOrderDetails,
                        razorpayPaymentId: response.razorpay_payment_id,
                        orderId: razorpayOrderId,
                    };
                    await set(ref(db, 'orders/' + razorpayOrderId), finalOrderDetails);
                    await handleSuccessfulOrder(finalOrderDetails);

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
                contact: userMobile,
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
        return <div className="container mx-auto py-12 text-center"><Loader /></div>;
    }

    const totalPrice = getTotalPrice();

    return (
        <>
            <div className="container mx-auto py-12">
                <div className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-headline font-bold">Checkout</h1>
                     <p className="text-lg text-muted-foreground mt-2">Finalize your order and tell us about your project.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Tell Us About Your Website</CardTitle>
                                <CardDescription>This information will help us get started on your project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-28">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Plan:</span>
                                    <span className="font-semibold text-lg">{plan}</span>
                                </div>
                                {planId !== 'trying' && (
                                     <div className="flex justify-between items-center">
                                        <Label htmlFor="duration-select" className="text-muted-foreground">Billing Cycle:</Label>
                                        <Select value={selectedDuration.value} onValueChange={handleDurationChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {durationOptions.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <Separator />
                                <div className="space-y-2">
                                    {planId !== 'trying' && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Hosting ({selectedDuration.label})</span>
                                            <span>₹{(monthlyPrice * (parseInt(selectedDuration.value) === 1 ? 2 : parseInt(selectedDuration.value))).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {buildingCharge > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                Building Fee
                                                <Popover>
                                                    <PopoverTrigger><Info className="w-4 h-4" /></PopoverTrigger>
                                                    <PopoverContent className="text-sm">This is a one-time fee for new customers.</PopoverContent>
                                                </Popover>
                                            </span>
                                            <span>₹{buildingCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                 {planId !== 'trying' && <p className="text-xs text-muted-foreground text-center">
                                    + Taxes
                                </p>}
                                {!user && !authLoading && (
                                     <Alert variant="destructive">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Login Required</AlertTitle>
                                        <AlertDescription>
                                            You must be logged in to complete your purchase.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full font-bold" size="lg" onClick={handleCheckoutAction} disabled={loading || authLoading}>
                                    {loading && <Loader size={20} className="mr-2" />}
                                    {user ? (planId === 'trying' ? 'Submit Request' : 'Proceed to Payment') : 'Login to Continue'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none">
                    <Card className="w-full shadow-2xl bg-transparent border-none">
                        <AuthForm onAuthSuccess={() => setIsAuthOpen(false)} />
                    </Card>
                </DialogContent>
            </Dialog>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="max-w-4xl p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Order Successful!</DialogTitle>
                        <DialogDescription>
                            Your order has been placed successfully. Here is your invoice.
                        </DialogDescription>
                    </DialogHeader>
                     <div ref={invoiceRef} className="bg-background px-6">
                         {invoiceDetails && <Invoice details={invoiceDetails} />}
                     </div>
                     <DialogFooter className="p-6 bg-muted/50 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
                        <div className="flex items-center gap-2">
                           <RadioGroup defaultValue="pdf" value={downloadFormat} onValueChange={setDownloadFormat} className="flex">
                                <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pdf" id="r-pdf" />
                                <Label htmlFor="r-pdf">PDF</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                <RadioGroupItem value="jpg" id="r-jpg" />
                                <Label htmlFor="r-jpg">JPG</Label>
                                </div>
                            </RadioGroup>
                            <Button onClick={handleDownloadInvoice}>
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                        </div>
                        <Button asChild onClick={() => setShowSuccessDialog(false)}>
                            <Link href="/account/orders">View My Orders</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function CheckoutPageSuspense() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader size={64}/></div>}>
            <CheckoutPage />
        </Suspense>
    )
}
