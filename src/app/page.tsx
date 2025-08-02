"use client"

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Database, ShieldCheck, Zap, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";


const features = [
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Blazing Fast Speed",
        description: "Experience unparalleled website performance with our enterprise-grade NVMe storage and LiteSpeed web servers, delivering content to your users at lightning speed."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Top-Tier Security",
        description: "Protect your website and visitor data with our robust security suite, including unlimited free SSL, automatic backups, and proactive threat detection."
    },
    {
        icon: <Cloud className="w-8 h-8 text-primary" />,
        title: "99.9% Uptime Guarantee",
        description: "Rely on our resilient and redundant infrastructure to keep your website online and consistently available for your visitors, backed by our uptime promise."
    },
    {
        icon: <Database className="w-8 h-8 text-primary" />,
        title: "Managed WordPress",
        description: "Focus on your content while we handle the technical details. Enjoy automated updates, performance optimization, and expert support for your WordPress sites."
    }
]

const testimonials = [
  {
    name: "Jane Doe",
    title: "CEO, Startup Inc.",
    text: "Grock Technologies made it incredibly simple to get our website up and running. The speed and support are second to none. Our site loads instantly, and we've seen a noticeable boost in user engagement. Highly recommended!"
  },
  {
    name: "John Smith",
    title: "Freelance Developer",
    text: "As a developer, I appreciate the power and flexibility Grock provides. Their infrastructure is solid, the developer tools are a huge plus, and their managed WordPress hosting saves me hours of work every month."
  },
    {
    name: "Emily White",
    title: "E-commerce Store Owner",
    text: "Our online store has never been faster or more secure since moving to Grock. The peace of mind we get from their managed hosting and daily backups is invaluable for our business. Sales have even increased!"
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-background py-20 md:py-32">
        <div className="container mx-auto flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center w-full"
          >
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Build Your High-Speed Digital Presence with <span className="text-primary">Grock</span>
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
          </motion.div>
        </div>
      </section>

      <section id="features" className="w-full py-16 md:py-24 bg-card">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Why Choose Grock Technologies?</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">We provide the best tools and infrastructure to help you succeed online, whether you're a beginner launching your first site or a pro managing multiple projects.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="p-6 rounded-lg text-left space-y-3 bg-background/50 hover:bg-background transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2"
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

       <section id="testimonials" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Trusted by Businesses and Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col justify-between p-6 bg-card shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-0">
                    <p className="text-muted-foreground italic mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                         <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold font-headline">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Ready to Launch Your Dream Website?
          </h2>
          <p className="text-lg text-muted-foreground my-4 max-w-2xl mx-auto">
            Join thousands of satisfied customers and build your online presence on a hosting platform designed for speed, security, and growth.
          </p>
          <div>
            <Button asChild size="lg" className="font-bold mt-4">
              <Link href="/pricing">View Plans & Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
