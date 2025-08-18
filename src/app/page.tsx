import HomePageClient from "@/components/home-page-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'High-Speed Web Hosting & Development | Grock Technologies',
  description: 'Launch your professional website in minutes with Grock. We provide fast, secure, and reliable hosting solutions powered by NVMe and LiteSpeed with a 99.9% uptime guarantee.',
};

export default function Home() {
  return <HomePageClient />;
}
