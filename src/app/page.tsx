"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Database, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

const testimonials = [
  {
    name: "Jane Doe",
    title: "CEO, Startup Inc.",
    avatar: "https://placehold.co/100x100.png",
    text: "Grock Technologies made it incredibly simple to get our website up and running. The speed and support are second to none. Highly recommended!"
  },
  {
    name: "John Smith",
    title: "Freelance Developer",
    avatar: "https://placehold.co/100x100.png",
    text: "As a developer, I appreciate the power and flexibility Grock provides. Their infrastructure is solid, and the developer tools are a huge plus."
  },
    {
    name: "Emily White",
    title: "E-commerce Store Owner",
    avatar: "https://placehold.co/100x100.png",
    text: "Our online store has never been faster or more secure. The peace of mind we get from their managed hosting is invaluable for our business."
  }
]

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <motion.section 
        className="w-full bg-background"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="container mx-auto flex items-center py-20 md:py-32">
          <div className="space-y-6 text-center w-full">
            <motion.h1 
              className="text-4xl md:text-6xl font-headline font-bold tracking-tighter"
              variants={fadeIn}
            >
              Build Your Digital Presence with <span className="text-primary">Grock</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground md:w-4/5 mx-auto"
              variants={fadeIn}
            >
              Launch your professional website in minutes. We provide fast, secure, and reliable hosting solutions with competitive pricing, tailored for your success.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeIn}
            >
              <Button asChild size="lg" className="font-bold btn">
                <Link href="/pricing">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn">
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="w-full py-16 md:py-24 bg-card"
        initial="initial"
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="container mx-auto text-center">
            <motion.h2 className="text-3xl md:text-4xl font-headline font-bold mb-4" variants={fadeIn}>Why Choose Grock Technologies?</motion.h2>
            <motion.p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto" variants={fadeIn}>We provide the best tools and infrastructure to help you succeed online, whether you're a beginner or a pro.</motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="p-6 rounded-lg text-left space-y-3 bg-background/50 hover:bg-background transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2"
                        custom={index}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        transition={{ delay: index * 0.1 }}
                    >
                        {feature.icon}
                        <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </motion.section>

       <motion.section
        className="w-full py-16 md:py-24 bg-background"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.3 }}
      >
        <div className="container mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12" variants={fadeIn}>
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full flex flex-col justify-between p-6 bg-card shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-0">
                    <p className="text-muted-foreground italic mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint="people avatar" />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
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
      </motion.section>

      <motion.section
        className="w-full py-20 md:py-32 bg-card"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <motion.h2 className="text-3xl md:text-4xl font-headline font-bold" variants={fadeIn}>
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p className="text-lg text-muted-foreground my-4 max-w-2xl mx-auto" variants={fadeIn}>
            Join thousands of satisfied customers and launch your dream website today.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button asChild size="lg" className="font-bold btn mt-4">
              <Link href="/pricing">View Plans & Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
