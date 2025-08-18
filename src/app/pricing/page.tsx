
import PricingPageClient from "@/components/pricing-page-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affordable Hosting Plans',
  description: 'Explore our simple, transparent, and powerful hosting plans. Find the perfect fit for your website, from single-page sites to large business platforms.',
};

export default function PricingPage() {
    return <PricingPageClient />;
}
