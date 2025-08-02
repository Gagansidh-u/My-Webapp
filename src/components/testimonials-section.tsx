
"use client"

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

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

export default function TestimonialsSection() {
    return (
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
    )
}
