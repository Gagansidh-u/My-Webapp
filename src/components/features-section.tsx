
"use client"

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Zap, ShieldCheck, Cloud, Database } from "lucide-react";

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function FeaturesSection() {
    return (
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
    )
}
