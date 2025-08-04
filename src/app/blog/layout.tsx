"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const popularPosts = [
    { href: '/blog/why-speed-matters', title: 'Why Website Speed is the Most Important Metric You\'re Ignoring' },
    { href: '/blog/how-we-keep-prices-low', title: 'How We Keep Our Hosting Prices Low Without Sacrificing Quality' },
    { href: '/blog/choosing-the-right-hosting', title: 'NVMe vs. SSD: Choosing the Right Hosting for Your Business' },
    { href: '/blog/demystifying-managed-wordpress', title: 'Demystifying Managed WordPress: A Beginner\'s Guide' },
    { href: '/blog/unlimited-hosting-myth', title: 'Is \'Unlimited\' Hosting a Myth? Our Transparent Approach' },
];

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBlogIndex = pathname === '/blog';

    return (
        <div className="container mx-auto py-12 md:py-16">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                <div className="lg:col-span-3">
                    {children}
                </div>
                <aside className="space-y-8 sticky top-20">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl flex items-center gap-2">
                                <Newspaper className="w-5 h-5" />
                                Popular Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {popularPosts.map(post => (
                                     <li key={post.href}>
                                        <Link href={post.href} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                            {post.title}
                                        </Link>
                                    </li>
                                ))}
                                {!isBlogIndex && (
                                     <li>
                                        <Link href="/blog" className="text-primary font-bold hover:underline mt-4 inline-block">
                                            &larr; Back to Blog
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
