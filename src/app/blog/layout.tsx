
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const popularPosts = [
    { href: '/blog/web-app-development-process', title: 'From Concept to Launch: Our Web App Development Process' },
    { href: '/blog/why-speed-matters', title: 'Why Website Speed is the Most Important Metric You\'re Ignoring' },
    { href: '/blog/how-we-keep-prices-low', title: 'How We Keep Our Hosting Prices Low Without Sacrificing Quality' },
    { href: '/blog/choosing-the-right-hosting', title: 'NVMe vs. SSD: Choosing the Right Hosting for Your Business' },
    { href: '/blog/demystifying-managed-wordpress', title: 'Demystifying Managed WordPress: A Beginner\'s Guide' },
];

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBlogIndex = pathname === '/blog';

    return (
        <div className="container mx-auto py-12 md:py-16">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-8 items-start">
                <div className="lg:col-span-3">
                    {children}
                </div>
                <aside className="space-y-8 sticky top-24 lg:top-28">
                     <Card className="bg-muted/30 border-dashed">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-primary" />
                                Popular Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {popularPosts.map(post => (
                                     <li key={post.href}>
                                        <Link href={post.href} className="text-muted-foreground hover:text-primary font-medium transition-colors group">
                                           <span className="group-hover:underline">{post.title}</span>
                                        </Link>
                                    </li>
                                ))}
                                {!isBlogIndex && (
                                     <li className="pt-4 border-t border-dashed">
                                        <Link href="/blog" className="text-primary font-bold hover:underline inline-block text-sm">
                                            &larr; Back to All Articles
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
