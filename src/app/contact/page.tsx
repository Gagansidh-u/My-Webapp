
import ContactPageClient from "@/components/contact-page-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Grock Technologies. We are here to help with any questions about our web hosting and development services.',
};

export default function ContactPage() {
    return <ContactPageClient />;
}
