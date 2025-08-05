import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from 'next';
import BlogImageGenerator from "@/components/blog-image-generator";

export const metadata: Metadata = {
  title: 'Blog | Grock Technologies',
  description: 'Explore insights on web hosting, performance, and digital strategy from the experts at Grock Technologies. Learn tips and tutorials to help your business grow.',
  keywords: ['Grock Technologies blog', 'grock.fun blog', 'web hosting blog', 'Grock Tech', 'website speed', 'NVMe hosting', 'LiteSpeed server', 'website security', 'managed WordPress', 'digital strategy', 'small business online'],
};


const blogPosts = [
  {
    slug: 'why-speed-matters',
    title: 'Why Website Speed is the Most Important Metric You\'re Ignoring',
    description: 'In today\'s digital landscape, a slow website is a silent business killer. Discover why site speed isn\'t just a technical detail but a critical factor for user experience, conversion rates, and SEO ranking. We break down how our NVMe storage and LiteSpeed servers give you the competitive edge.',
    image: 'https://placehold.co/1200x630/f0db4f/000000.png?text=Website+Speed',
    aiPrompt: 'A rocket launching, symbolizing extreme speed and performance for a website.',
    author: 'Grock Technologies',
    date: 'October 26, 2023',
  },
  {
    slug: 'choosing-the-right-hosting',
    title: 'NVMe vs. SSD: Choosing the Right Hosting for Your Business',
    description: 'Not all storage is created equal. This post dives deep into the technical differences between traditional SSDs and cutting-edge NVMe storage. Understand why this technology is a game-changer for high-traffic sites, e-commerce stores, and data-intensive applications.',
    image: 'https://placehold.co/1200x630/673ab7/ffffff.png?text=NVMe+vs+SSD',
    aiPrompt: 'A futuristic image comparing NVMe and SSD technologies, showing data streams.',
    author: 'Grock Technologies',
    date: 'October 24, 2023',
  },
  {
    slug: 'demystifying-managed-wordpress',
    title: 'Demystifying Managed WordPress: A Beginner\'s Guide',
    description: 'Heard of "Managed WordPress Hosting" but not sure what it means? This guide explains everything from automated updates and security hardening to performance optimization. Learn how Grock takes the hassle out of WordPress management so you can focus on creating great content.',
    image: 'https://placehold.co/1200x630/21759b/ffffff.png?text=Managed+WordPress',
    aiPrompt: 'An illustration showing the WordPress logo surrounded by gears and shields, representing management and security.',
    author: 'Grock Technologies',
    date: 'October 22, 2023',
  },
  {
    slug: 'securing-your-digital-presence',
    title: '5 Essential Steps to Securing Your Digital Presence in 2023',
    description: 'Your website is a valuable asset. Are you protecting it properly? We cover five non-negotiable security measures, from the importance of free unlimited SSL to the power of daily backups and proactive threat detection. See how our security features keep your site safe.',
    image: 'https://placehold.co/1200x630/32cd32/ffffff.png?text=Website+Security',
    aiPrompt: 'A glowing digital shield protecting a website from cyber threats.',
    author: 'Grock Technologies',
    date: 'October 20, 2023',
  },
   {
    slug: 'how-we-keep-prices-low',
    title: 'How We Keep Our Hosting Prices Low Without Sacrificing Quality',
    description: 'Discover the business strategies and technical efficiencies that allow Grock Technologies to offer premium hosting services at budget-friendly prices. We believe high performance shouldn\'t come with a high price tag.',
    image: 'https://placehold.co/1200x630/4caf50/ffffff.png?text=Affordable+Hosting',
    aiPrompt: 'An abstract image representing technology and savings, with circuitry and coins.',
    author: 'Grock Technologies',
    date: 'November 2, 2023',
  },
  {
    slug: 'smart-tech-stack-savings',
    title: 'The Smart Tech Stack: How Our Choices Lead to Your Savings',
    description: 'Learn how our commitment to modern technologies like NVMe storage and LiteSpeed servers doesn\'t just boost your website\'s speed—it directly translates into more affordable and reliable hosting plans for you.',
    image: 'https://placehold.co/1200x630/ffc107/000000.png?text=Tech+Savings',
    aiPrompt: 'An abstract visualization of a tech stack with gears and code, leading to savings.',
    author: 'Grock Technologies',
    date: 'November 4, 2023',
  },
   {
    slug: 'true-value-managed-hosting',
    title: 'Beyond the Price Tag: The True Value of Managed Hosting',
    description: 'Low prices are just the beginning. Explore the incredible value packed into our managed hosting plans, from automated maintenance that saves you time to expert support that gives you peace of mind.',
    image: 'https://placehold.co/1200x630/9c27b0/ffffff.png?text=Value+Hosting',
    aiPrompt: 'An image showing a price tag being outweighed by features like "time" and "security" on a scale.',
    author: 'Grock Technologies',
    date: 'November 6, 2023',
  },
  {
    slug: 'scaling-on-a-budget',
    title: 'Scaling Your Business on a Budget: Our Hosting Tiers Explained',
    description: 'Your hosting should grow with you. This guide breaks down our affordable hosting tiers, explaining how you can start small and scale up seamlessly without breaking the bank. Plan for the future with confidence.',
    image: 'https://placehold.co/1200x630/03a9f4/ffffff.png?text=Scaling+Business',
    aiPrompt: 'An illustration of a small plant growing into a large tree, symbolizing business growth.',
    author: 'Grock Technologies',
    date: 'November 8, 2023',
  },
  {
    slug: 'unlimited-hosting-myth',
    title: 'Is \'Unlimited\' Hosting a Myth? Our Transparent Approach to Resources',
    description: 'Many hosts offer "unlimited" plans with hidden catches. We believe in transparency. Learn about our clear, generous resource allocations and why our honest approach is better for your business in the long run.',
    image: 'https://placehold.co/1200x630/f44336/ffffff.png?text=Unlimited+Myth',
    aiPrompt: 'An image showing the word "Unlimited" with an asterisk, with fine print being revealed by a magnifying glass.',
    author: 'Grock Technologies',
    date: 'November 10, 2023',
  },
  {
    slug: 'small-business-big-impact',
    title: 'From Local to Global: How a Professional Website Gives Your Small Business a Big Impact',
    description: 'A professional website is your 24/7 salesperson. Learn how a fast, reliable, and secure online presence built on Grock Technologies can help you reach new customers, build credibility, and compete with larger players in your industry. It\'s time to grow your business online.',
    image: 'https://placehold.co/1200x630/ff6347/ffffff.png?text=Business+Impact',
    aiPrompt: 'A small local shop transforming into a global online store, showing growth.',
    author: 'Grock Technologies',
    date: 'October 18, 2023',
  },
];

export default function BlogIndexPage() {
    // Sort posts by date in descending order
    const sortedPosts = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <div className="text-left mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Grock Insights</h1>
                <p className="text-lg text-muted-foreground mt-2">Your source for web hosting news, tips, and tutorials.</p>
            </div>
            <div className="space-y-12">
                {sortedPosts.map((post) => (
                    <Card key={post.slug} className="shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <BlogImageGenerator 
                            blogSlug={post.slug}
                            initialImage={post.image}
                            altText={post.title}
                            prompt={post.aiPrompt}
                        />
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                   {post.title}
                                </Link>
                            </CardTitle>
                            <CardDescription>
                                By {post.author} on {post.date}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{post.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="link" className="p-0 font-bold">
                                <Link href={`/blog/${post.slug}`}>Read More &rarr;</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
