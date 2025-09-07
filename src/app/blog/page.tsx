import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from 'next';
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: 'Blog | Grock Technologies',
  description: 'Explore insights on web hosting, performance, and digital strategy from the experts at Grock Technologies. Learn tips and tutorials to help your business grow.',
  keywords: ['Grock Technologies blog', 'grock.fun blog', 'web hosting blog', 'Grock Tech', 'website speed', 'NVMe hosting', 'LiteSpeed server', 'website security', 'managed WordPress', 'digital strategy', 'small business online'],
};


const blogPosts = [
  {
    slug: 'grock-website-building-service',
    title: 'Introducing the Grock Website Building Service: Your Vision, Our Expertise',
    description: 'Learn about our all-in-one service to design and develop a professional, high-performance website for you. We handle the tech, so you can focus on your business. Your vision, our expertise.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'website blueprint construction',
    author: 'Grock Technologies',
    date: 'November 12, 2023',
  },
  {
    slug: 'why-speed-matters',
    title: 'Why Website Speed is the Most Important Metric You\'re Ignoring',
    description: 'In today\'s digital landscape, a slow website is a silent business killer. Discover why site speed isn\'t just a technical detail but a critical factor for user experience, conversion rates, and SEO ranking. We break down how our NVMe storage and LiteSpeed servers give you the competitive edge.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'rocket launching',
    author: 'Grock Technologies',
    date: 'October 26, 2023',
  },
  {
    slug: 'choosing-the-right-hosting',
    title: 'NVMe vs. SSD: Choosing the Right Hosting for Your Business',
    description: 'Not all storage is created equal. This post dives deep into the technical differences between traditional SSDs and cutting-edge NVMe storage. Understand why this technology is a game-changer for high-traffic sites, e-commerce stores, and data-intensive applications.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'futuristic technology',
    author: 'Grock Technologies',
    date: 'October 24, 2023',
  },
  {
    slug: 'demystifying-managed-wordpress',
    title: 'Demystifying Managed WordPress: A Beginner\'s Guide',
    description: 'Heard of "Managed WordPress Hosting" but not sure what it means? This guide explains everything from automated updates and security hardening to performance optimization. Learn how Grock takes the hassle out of WordPress management so you can focus on creating great content.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'WordPress logo gears',
    author: 'Grock Technologies',
    date: 'October 22, 2023',
  },
  {
    slug: 'securing-your-digital-presence',
    title: '5 Essential Steps to Securing Your Digital Presence in 2023',
    description: 'Your website is a valuable asset. Are you protecting it properly? We cover five non-negotiable security measures, from the importance of free unlimited SSL to the power of daily backups and proactive threat detection. See how our security features keep your site safe.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'digital security shield',
    author: 'Grock Technologies',
    date: 'October 20, 2023',
  },
   {
    slug: 'how-we-keep-prices-low',
    title: 'How We Keep Our Hosting Prices Low Without Sacrificing Quality',
    description: 'Discover the business strategies and technical efficiencies that allow Grock Technologies to offer premium hosting services at budget-friendly prices. We believe high performance shouldn\'t come with a high price tag.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'technology savings',
    author: 'Grock Technologies',
    date: 'November 2, 2023',
  },
  {
    slug: 'smart-tech-stack-savings',
    title: 'The Smart Tech Stack: How Our Choices Lead to Your Savings',
    description: 'Learn how our commitment to modern technologies like NVMe storage and LiteSpeed servers doesn\'t just boost your website\'s speed—it directly translates into more affordable and reliable hosting plans for you.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'tech stack gears',
    author: 'Grock Technologies',
    date: 'November 4, 2023',
  },
   {
    slug: 'true-value-managed-hosting',
    title: 'Beyond the Price Tag: The True Value of Managed Hosting',
    description: 'Low prices are just the beginning. Explore the incredible value packed into our managed hosting plans, from automated maintenance that saves you time to expert support that gives you peace of mind.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'value scale',
    author: 'Grock Technologies',
    date: 'November 6, 2023',
  },
  {
    slug: 'scaling-on-a-budget',
    title: 'Scaling Your Business on a Budget: Our Hosting Tiers Explained',
    description: 'Your hosting should grow with you. This guide breaks down our affordable hosting tiers, explaining how you can start small and scale up seamlessly without breaking the bank. Plan for the future with confidence.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'plant growing',
    author: 'Grock Technologies',
    date: 'November 8, 2023',
  },
  {
    slug: 'unlimited-hosting-myth',
    title: 'Is \'Unlimited\' Hosting a Myth? Our Transparent Approach to Resources',
    description: 'Many hosts offer "unlimited" plans with hidden catches. We believe in transparency. Learn about our clear, generous resource allocations and why our honest approach is better for your business in the long run.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'unlimited fine print',
    author: 'Grock Technologies',
    date: 'November 10, 2023',
  },
  {
    slug: 'small-business-big-impact',
    title: 'From Local to Global: How a Professional Website Gives Your Small Business a Big Impact',
    description: 'A professional website is your 24/7 salesperson. Learn how a fast, reliable, and secure online presence built on Grock Technologies can help you reach new customers, build credibility, and compete with larger players in your industry. It\'s time to grow your business online.',
    image: 'https://placehold.co/1200x630.png',
    imageHint: 'local global growth',
    author: 'Grock Technologies',
    date: 'October 18, 2023',
  },
];

export default function BlogIndexPage() {
    const sortedPosts = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <div className="text-left mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Grock Insights</h1>
                <p className="text-lg text-muted-foreground mt-2">Your source for web hosting news, tips, and tutorials.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {sortedPosts.map((post) => (
                    <article key={post.slug} className="group flex flex-col">
                        <div className="overflow-hidden rounded-lg mb-4">
                           <Link href={`/blog/${post.slug}`}>
                                <Image 
                                    src={post.image}
                                    alt={post.title}
                                    data-ai-hint={post.imageHint}
                                    width={1200}
                                    height={630}
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col flex-grow">
                             <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                            <h2 className="font-headline text-2xl font-semibold group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                   {post.title}
                                </Link>
                            </h2>
                            <p className="text-muted-foreground mt-2 flex-grow">{post.description}</p>
                            <Button asChild variant="link" className="p-0 font-bold mt-4 self-start">
                                <Link href={`/blog/${post.slug}`}>
                                    Read More <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
