
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Understand the terms and conditions for refunds on our hosting and web development services. Learn about eligibility, the process, and non-refundable fees.',
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto py-16 md:py-24">
                <Card className="max-w-4xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl md:text-4xl font-headline text-center">Refund Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        
                        <h2 className="font-headline text-foreground">1. Overview</h2>
                        <p>At Grock Technologies, we strive to provide excellent service. However, we understand that sometimes our services may not meet your expectations. This Refund Policy outlines the terms and conditions under which refunds will be provided.</p>

                        <h2 className="font-headline text-foreground">2. Eligibility for a Refund</h2>
                        <p>To be eligible for a refund on our hosting services, you must submit a request within **seven (7) calendar days** of your initial order date. Refund requests submitted after this 7-day period will not be considered.</p>

                        <h2 className="font-headline text-foreground">3. Non-Refundable Fees</h2>
                        <p>Please note that certain fees are strictly non-refundable. The **One-Time Website Building Fee**, as stated on our <Link href="/pricing">pricing plans</Link>, is non-refundable once work has commenced on your project. This fee covers the initial resources and labor allocated to designing and developing your website.</p>
                        <p>Additionally, any costs associated with domain name registration are non-refundable.</p>

                        <h2 className="font-headline text-foreground">4. Refund Amount & Processing</h2>
                        <p>Eligible refunds are subject to a deduction to cover taxes and service processing charges. You will receive **90% of the refundable amount** from your original purchase. The remaining 10% is retained to cover non-recoupable administrative and transaction costs.</p>
                        <p>Once your refund request is received and approved, we will process the refund to your original method of payment within **fourteen (14) working days**. Please note that it may take additional time for your financial institution to reflect the transaction in your account.</p>

                        <h2 className="font-headline text-foreground">5. How to Request a Refund</h2>
                        <p>To request a refund, please contact our support team through our <Link href="/contact">Contact Page</Link>. You must include your order number and a clear reason for the refund request. Our team will review your request based on the terms outlined in this policy.</p>

                        <h2 className="font-headline text-foreground">6. Changes to This Policy</h2>
                        <p>Grock Technologies reserves the right to modify this Refund Policy at any time. Any changes will be effective immediately upon posting the updated policy on our website. It is your responsibility to review this policy periodically.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
