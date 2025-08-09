
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Gem } from 'lucide-react';

interface OrderDetails {
    orderId: string;
    plan: string;
    price: number;
    duration: number;
    userEmail: string | null;
    userName: string | null;
    buildingCharge: number;
    monthlyPrice: number;
}

interface InvoiceProps {
  details: OrderDetails;
}

const getDurationText = (duration: number) => {
    if (!duration) return 'N/A';
    if (duration < 12) return `${duration} Month${duration > 1 ? 's' : ''}`;
    const years = duration / 12;
    return `${years} Year${years > 1 ? 's' : ''}`;
}

export const Invoice: React.FC<InvoiceProps> = ({ details }) => {
    const durationText = getDurationText(details.duration);
    const hostingPrice = details.price - details.buildingCharge;

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-primary" />
                        <div>
                            <CardTitle className="font-headline text-2xl text-primary">Invoice</CardTitle>
                            <CardDescription>Order ID: {details.orderId}</CardDescription>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className="font-bold text-lg">Grock Technologies</p>
                        <p className="text-sm text-muted-foreground">helpdesk.grock@outlook.com</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <h4 className="font-semibold mb-2">Billed To:</h4>
                        <p className="text-muted-foreground">{details.userName || 'Valued Customer'}</p>
                        <p className="text-muted-foreground">{details.userEmail}</p>
                    </div>
                    <div className="text-right">
                        <h4 className="font-semibold mb-1">Invoice Date:</h4>
                        <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <Separator className="my-4" />

                <div>
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">{details.plan} Plan Hosting ({durationText})</p>
                            <p className="font-medium">₹{hostingPrice.toFixed(2)}</p>
                        </div>
                        {details.buildingCharge > 0 && (
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">One-Time Building Fee</p>
                                <p className="font-medium">₹{details.buildingCharge.toFixed(2)}</p>
                            </div>
                        )}
                         <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Taxes</p>
                            <p className="font-medium">Included</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />
                
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold">Total Amount</p>
                    <p className="text-2xl font-bold font-headline text-primary">₹{details.price.toFixed(2)}</p>
                </div>
                
                 <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">Thank you for your business!</p>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 text-center text-xs text-muted-foreground rounded-b-lg">
                <p>If you have any questions, please contact our support team.</p>
            </CardFooter>
        </Card>
    );
};
