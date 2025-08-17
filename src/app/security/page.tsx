
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, DatabaseZap, Lock, Server } from "lucide-react";

const securityFeatures = [
    {
        icon: <Server className="w-8 h-8 text-primary" />,
        title: "Infrastructure Security",
        description: "Our services are hosted on a world-class infrastructure with DDoS protection, web application firewalls, and malware scanning to ensure your website is always safe and online."
    },
    {
        icon: <Lock className="w-8 h-8 text-primary" />,
        title: "Data Encryption",
        description: "We provide free, unlimited SSL certificates for all websites hosted with us. All data transmitted between your website and its visitors is encrypted using industry-standard protocols."
    },
    {
        icon: <DatabaseZap className="w-8 h-8 text-primary" />,
        title: "Regular Backups",
        description: "We perform automatic daily or weekly backups of your website data, depending on your plan. You can restore your website to a previous state with a single click."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Payment Security",
        description: "All payments are processed through Razorpay, a PCI DSS Level 1 compliant payment gateway. We do not store any of your sensitive credit card information on our servers."
    }
]

export default function SecurityPage() {
    return (
        <div className="container mx-auto py-16 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Security</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">We take security seriously. Learn about the measures we have in place to protect your data and your website.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {securityFeatures.map((feature, index) => (
                    <Card key={index} className="shadow-lg">
                        <CardHeader className="flex flex-row items-center gap-4">
                            {feature.icon}
                            <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Card className="mt-12 text-center bg-accent/50 border-primary/20">
              <CardContent className="p-8">
                <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Have a security concern?</h3>
                <p className="text-muted-foreground mb-4">If you've discovered a security vulnerability, please report it to us immediately so we can take action.</p>
                <a href="mailto:helpdesk.grock@outlook.com" className="text-primary font-bold hover:underline">Report a Vulnerability</a>
              </CardContent>
            </Card>
        </div>
    );
}
