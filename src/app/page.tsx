import HomePageClient from "@/components/home-page-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'High-Speed Web Hosting & Development | Grock Technologies',
};

export default function Home() {
  return <HomePageClient />;
}
