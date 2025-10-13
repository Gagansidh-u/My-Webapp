
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Quote } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "framer-motion";
import React, { useRef } from "react";

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
  },
  {
    name: "Michael Brown",
    title: "Blogger & Content Creator",
    text: "The performance on Grock is just fantastic. My blog has never been faster, and the automatic updates for WordPress mean I can focus on writing instead of worrying about maintenance. It's a game-changer."
  },
  {
    name: "Sarah Lee",
    title: "Digital Marketing Manager",
    text: "Grock's hosting is incredibly reliable. The 99.9% uptime is real, and the speed has directly improved our campaign landing page conversions. Their support team is also very responsive and knowledgeable."
  },
  {
    name: "David Chen",
    title: "Small Business Owner",
    text: "I needed a professional website but didn't know where to start. Grock handled everything from design to launch. Their all-in-one package saved me time and money, and the site looks fantastic."
  },
  {
    name: "Maria Garcia",
    title: "Photographer",
    text: "My portfolio site is image-heavy, and I was worried about load times. With Grock's NVMe storage, my photos load instantly. It's made a huge difference in showcasing my work professionally."
  },
  {
    name: "Tom Johnson",
    title: "SaaS Founder",
    text: "We moved our application's marketing site to Grock, and the performance improvement was immediate. The combination of LiteSpeed and NVMe is a powerhouse. It's enterprise-grade hosting at a startup-friendly price."
  },
  {
    name: "Amanda Wilson",
    title: "Agency Owner",
    text: "Managing multiple client sites is easy with Grock. The 'Web Starter' plan gives us the resources we need, and the performance keeps our clients happy. It's a reliable partner for our agency's growth."
  }
];

interface MarqueeProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function Marquee({ children, baseVelocity = 100 }: MarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div className="flex flex-nowrap" style={{ x }}>
        <span className="flex">{children}</span>
        <span className="flex">{children}</span>
        <span className="flex">{children}</span>
        <span className="flex">{children}</span>
      </motion.div>
    </div>
  );
}

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
                    Trusted by Businesses and Developers
                </h2>
                <Marquee baseVelocity={-1}>
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="px-4 w-[350px] max-w-[90vw]">
                        <Card className="h-full flex flex-col justify-between bg-card shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-primary/20 bg-accent/20 rounded-xl overflow-hidden">
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                                <p className="text-muted-foreground italic mb-6 flex-grow">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
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
                      </div>
                    ))}
                </Marquee>
            </div>
      </section>
    )
}
