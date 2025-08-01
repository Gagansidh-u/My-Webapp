import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto py-16 md:py-24">
                <Card className="max-w-4xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl md:text-4xl font-headline text-center">Terms and Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        
                        <h2 className="font-headline text-foreground">1. Agreement to Terms</h2>
                        <p>By using our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>

                        <h2 className="font-headline text-foreground">2. Services</h2>
                        <p>Grock Technologies provides website development and hosting services. We reserve the right to modify or discontinue our services at any time without notice.</p>

                        <h2 className="font-headline text-foreground">3. User Accounts</h2>
                        <p>To access some of our services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>

                        <h2 className="font-headline text-foreground">4. Acceptable Use</h2>
                        <p>You agree not to use our services for any unlawful purpose or in any way that could harm our services or reputation. This includes, but is not limited to, transmitting any material that is abusive, harassing, or defamatory.</p>

                        <h2 className="font-headline text-foreground">5. Payments and Refunds</h2>
                        <p>All payments for services are due in advance. We offer a 30-day money-back guarantee for new hosting service purchases. Please refer to our refund policy for more details.</p>

                        <h2 className="font-headline text-foreground">6. Limitation of Liability</h2>
                        <p>In no event shall Grock Technologies be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

                        <h2 className="font-headline text-foreground">7. Governing Law</h2>
                        <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is based, without regard to its conflict of law provisions.</p>
                        
                        <h2 className="font-headline text-foreground">8. Changes to Terms</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
