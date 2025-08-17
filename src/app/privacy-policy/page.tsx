
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto py-16 md:py-24">
                <Card className="max-w-4xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl md:text-4xl font-headline text-center">Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        
                        <h2 className="font-headline text-foreground">1. Introduction</h2>
                        <p>Welcome to Grock Technologies. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

                        <h2 className="font-headline text-foreground">2. Information We Collect</h2>
                        <p>We may collect personal information such as your name, email address, postal address, phone number, and payment information when you register for an account, purchase our services, or contact us for support.</p>

                        <h2 className="font-headline text-foreground">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:
                            <ul>
                                <li>Provide, operate, and maintain our services</li>
                                <li>Process your transactions and manage your orders</li>
                                <li>Improve, personalize, and expand our services</li>
                                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                                <li>Send you emails</li>
                                <li>Find and prevent fraud</li>
                            </ul>
                        </p>

                        <h2 className="font-headline text-foreground">4. Sharing Your Information</h2>
                        <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>

                        <h2 className="font-headline text-foreground">5. Data Security</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>

                        <h2 className="font-headline text-foreground">6. Your Data Protection Rights</h2>
                        <p>Depending on your location, you may have the following rights regarding your personal information: the right to access, the right to rectification, the right to erasure, the right to restrict processing, the right to object to processing, and the right to data portability.</p>

                        <h2 className="font-headline text-foreground">7. Changes to This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

                        <h2 className="font-headline text-foreground">8. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us via the information on our contact page.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
