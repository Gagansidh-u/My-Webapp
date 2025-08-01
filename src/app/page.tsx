import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Cloud, Database, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: 'Single Website',
    price: '149.00',
    description: 'Ideal for beginners',
    features: [
      '1 Website',
      '50 GB NVMe Storage',
      'Weekly Backups',
      'Unlimited Free SSL',
      'Unlimited Bandwidth',
      'Free Email',
      'Free Domain (₹799.00 value)'
    ],
    planId: 'single'
  },
  {
    title: 'Web Starter',
    price: '249.00',
    description: 'Perfect for personal websites',
    features: [
      '100 Websites',
      '100 GB NVMe Storage',
      'Daily Backups (₹1,548.00 value)',
      'Unlimited Free SSL',
      'Unlimited Bandwidth',
      'Free Email',
      'Free Domain (₹799.00 value)'
    ],
    popular: true,
    planId: 'starter'
  },
  {
    title: 'Business Website',
    price: '399.00',
    description: 'Optimized for small businesses',
    features: [
      '100 Websites',
      '200 GB NVMe Storage',
      'Daily Backups (₹1,548.00 value)',
      'Unlimited Free SSL',
      'Unlimited Bandwidth',
      'Free Email',
      'Free Domain (₹799.00 value)',
      'Free CDN'
    ],
    planId: 'business'
  }
];

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
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20 md:py-32">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Build Your Digital Presence with <span className="text-primary">Grock</span>
            </h1>
            <p className="text-lg text-muted-foreground md:w-4/5">
              Launch your professional website in minutes. We provide fast, secure, and reliable hosting solutions with competitive pricing, tailored for your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="font-bold">
                <Link href="#services">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
          <div>
            <Image 
              src="https://placehold.co/600x400.png"
              alt="Web development illustration"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
              data-ai-hint="website development"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Why Choose Grock Technologies?</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">We provide the best tools and infrastructure to help you succeed online, whether you're a beginner or a pro.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="p-6 rounded-lg text-left space-y-3">
                        {feature.icon}
                        <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>


      <section id="services" className="w-full py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Pricing Plans</h2>
            <p className="text-lg text-muted-foreground mt-2">Choose the perfect plan for your needs. Simple, transparent, and powerful.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {services.map((service, index) => (
              <Card key={index} className={`flex flex-col h-full ${service.popular ? 'border-primary border-2 shadow-primary/20 shadow-lg relative' : 'shadow-lg'}`}>
                {service.popular && <div className="absolute top-0 right-4 -mt-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-headline">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold font-headline">₹{service.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-3">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-bold" size="lg" variant={service.popular ? 'default' : 'secondary'}>
                    <Link href={`/checkout?plan=${service.planId}&price=${service.price}`}>Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
