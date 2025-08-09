
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Gem } from 'lucide-react';

interface OrderDetails {
    orderId: string;
    plan: string;
    price: number;
    duration: number;
    userEmail: string | null;
    userName: string | null;
    userMobile: string | null;
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
    const invoiceDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg border-primary/20 bg-background overflow-hidden">
            <header className="p-4 sm:p-6 bg-muted/30">
                 <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold font-headline text-primary">Grock Technologies</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">helpdesk.grock@outlook.com</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">INVOICE</h2>
                        <p className="text-muted-foreground text-sm truncate"># {details.orderId}</p>
                    </div>
                </div>
            </header>
            <CardContent className="p-4 sm:p-6 space-y-8">
                <div className="grid sm:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-muted-foreground">BILLED TO</h4>
                        <p className="font-medium">{details.userName || 'Valued Customer'}</p>
                        <p className="text-muted-foreground truncate">{details.userEmail}</p>
                        {details.userMobile && <p className="text-muted-foreground">{details.userMobile}</p>}
                    </div>
                    <div className="space-y-1 sm:text-center">
                        <h4 className="font-semibold text-muted-foreground">INVOICE DATE</h4>
                        <p className="font-medium">{invoiceDate}</p>
                    </div>
                    <div className="space-y-1 flex flex-col items-start sm:items-end">
                        <h4 className="font-semibold text-muted-foreground">STATUS</h4>
                        <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">Paid</Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left font-semibold p-2">DESCRIPTION</th>
                                <th className="text-right font-semibold p-2">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2">
                                    <p className="font-medium">{details.plan} Plan Hosting</p>
                                    <p className="text-xs text-muted-foreground">({durationText})</p>
                                </td>
                                <td className="text-right p-2">₹{hostingPrice.toFixed(2)}</td>
                            </tr>
                             {details.buildingCharge > 0 && (
                                <tr className="border-b">
                                    <td className="p-2">One-Time Building Fee</td>
                                    <td className="text-right p-2">₹{details.buildingCharge.toFixed(2)}</td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="grid w-full max-w-sm gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{details.price.toFixed(2)}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>Included</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between font-bold text-lg bg-primary/10 p-3 rounded-lg">
                            <span className="text-primary">Total</span>
                            <span className="text-primary">₹{details.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 text-center text-xs text-muted-foreground">
                <p>Thank you for your business! If you have any questions, please contact support.</p>
            </CardFooter>
        </Card>
    );
};
