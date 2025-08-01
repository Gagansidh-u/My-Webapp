import Link from 'next/link';
import { Gem } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <Gem className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Grock Technologies
            </span>
          </Link>
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} Grock Technologies. All Rights Reserved.
        </p>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/terms-and-conditions" className="transition-colors hover:text-foreground">Terms</Link>
          <Link href="/privacy-policy" className="transition-colors hover:text-foreground">Privacy</Link>
          <Link href="/security" className="transition-colors hover:text-foreground">Security</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
