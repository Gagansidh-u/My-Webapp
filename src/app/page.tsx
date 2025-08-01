import { Button } from "@/components/ui/button";
import { Cloud, Database, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Blazing Fast Speed",
        description: "Experience unparalleled website performance with our NVMe storage and LiteSpeed web servers."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Top-Tier Security",
        description: "Protect your website with unlimited SSL, automatic backups, and advanced security features."
    },
    {
        icon: <Cloud className="w-8 h-8 text-primary" />,
        title: "99.9% Uptime Guarantee",
        description: "Rely on our robust infrastructure to keep your website online and available for your visitors."
    },
    {
        icon: <Database className="w-8 h-8 text-primary" />,
        title: "Managed WordPress",
        description: "Automated updates, vulnerability scanning, and expert support for your WordPress sites."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-background">
        <div className="container mx-auto flex items-center py-20 md:py-32">
          <div className="space-y-6 text-center w-full">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Build Your Digital Presence with <span className="text-primary">Grock</span>
            </h1>
            <p className="text-lg text-muted-foreground md:w-4/5 mx-auto">
              Launch your professional website in minutes. We provide fast, secure, and reliable hosting solutions with competitive pricing, tailored for your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-bold">
                <Link href="/pricing">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-card">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Why Choose Grock Technologies?</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">We provide the best tools and infrastructure to help you succeed online, whether you're a beginner or a pro.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="p-6 rounded-lg text-left space-y-3 bg-background/50 hover:bg-background transition-colors shadow-sm hover:shadow-md">
                        {feature.icon}
                        <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
