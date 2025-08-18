import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation & FAQ',
  description: 'Find answers to frequently asked questions about our hosting plans, payment methods, and getting started with your website.',
};

const faqs = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and net banking through our secure Razorpay payment gateway."
    },
    {
        question: "Can I upgrade my plan later?",
        answer: "Yes, you can upgrade your plan at any time from your account dashboard. The new plan will be prorated based on your current subscription."
    },
    {
        question: "Do you offer a money-back guarantee?",
        answer: "We offer a 30-day money-back guarantee on all our hosting plans. If you are not satisfied with our service, you can request a full refund within the first 30 days."
    },
    {
        question: "How do I get started with a website?",
        answer: "Simply choose a plan that fits your needs, complete the payment process, and you'll receive an email with all the details to access your hosting control panel and start building your website immediately."
    },
    {
        question: "Is a free domain included in all plans?",
        answer: "Yes, a free domain for the first year is included with our Web Starter and Business Website plans when you sign up for an annual subscription."
    }
]

export default function DocumentationPage() {
    return (
        <div className="container mx-auto py-16 md:py-24 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Documentation</h1>
                <p className="text-lg text-muted-foreground mt-2">Find answers to frequently asked questions.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
