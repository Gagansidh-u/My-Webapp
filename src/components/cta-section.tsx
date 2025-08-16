
"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CallToActionSection() {
    return (
        <motion.section 
          className="w-full py-20 md:py-32 bg-card"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
            <div className="container mx-auto text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-headline font-bold"
                variants={itemVariants}
              >
                Ready to Launch Your Dream Website?
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground my-4 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Join thousands of satisfied customers and build your online presence on a hosting platform designed for speed, security, and growth.
              </motion.p>
              <motion.div variants={itemVariants}>
                  <Button asChild size="lg" className="font-bold mt-4">
                    <Link href="/pricing">View Plans & Get Started</Link>
                  </Button>
              </motion.div>
            </div>
      </motion.section>
    )
}
