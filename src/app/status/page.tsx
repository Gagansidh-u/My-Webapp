import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Server, Globe, Mail } from "lucide-react";

const services = [
    { name: "Websites & Hosting", status: "Operational", icon: <Globe className="w-5 h-5" /> },
    { name: "Control Panel API", status: "Operational", icon: <Server className="w-5 h-5" /> },
    { name: "Email Services", status: "Operational", icon: <Mail className="w-5 h-5" /> },
    { name: "Payment Gateway", status: "Operational", icon: <CheckCircle2 className="w-5 h-5" /> },
]

export default function StatusPage() {
    const allOperational = services.every(s => s.status === "Operational");

    return (
        <div className="container mx-auto py-16 md:py-24 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">System Status</h1>
                <p className="text-lg text-muted-foreground mt-2">Real-time status of our services.</p>
            </div>
            
            <Card className="mb-8 shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                    {allOperational ? (
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                            <h2 className="text-2xl font-semibold text-green-600">All Systems Operational</h2>
                        </div>
                    ) : (
                        <h2 className="text-2xl font-semibold text-yellow-600">Some Systems Experiencing Issues</h2>
                    )}
                    <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Service Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3 font-medium">
                                    {service.icon}
                                    <span>{service.name}</span>
                                </div>
                                <Badge variant={service.status === 'Operational' ? 'default' : 'destructive'} className={`${service.status === 'Operational' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}`}>
                                    {service.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
