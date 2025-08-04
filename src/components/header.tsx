
"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from './auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Gem, Menu, Moon, Sun, User, LogOut, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import React from 'react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const Header = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  const navLinks = [
      { href: '/pricing', label: 'Pricing' },
      { href: '/status', label: 'Status' },
      { href: '/documentation', label: 'Documentation' },
      { href: '/contact', label: 'Contact' },
  ]
  
  const userNavLinks = [
      { href: '/account/orders', label: 'My Orders', icon: <ShoppingCart className="mr-2 h-4 w-4" /> },
  ]

  const getUserInitials = (email: string | null | undefined) => {
      if (!email) return 'U';
      return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gem className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Grock Technologies
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
             {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                    {link.label}
                </Link>
             ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
           <div className="hidden md:flex items-center space-x-2">
            {loading ? (
                <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="relative h-8 w-8 rounded-full">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{getUserInitials(user.email)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {userNavLinks.map(link => (
                             <DropdownMenuItem key={link.href} asChild>
                                 <Link href={link.href}>
                                     {link.icon}
                                     {link.label}
                                </Link>
                             </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild className="btn">
                <Link href="/login">Login</Link>
                </Button>
            )}
           </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu/></Button>
            </SheetTrigger>
            <SheetContent side="left">
                 <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4">
                    <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                        <Gem className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">Grock Technologies</span>
                    </Link>
                    <nav className="flex flex-col space-y-2">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60 p-2 rounded-md hover:bg-accent" onClick={() => setIsOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                         {user && userNavLinks.map(link => (
                            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60 p-2 rounded-md hover:bg-accent flex items-center" onClick={() => setIsOpen(false)}>
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="pt-4 border-t">
                        {loading ? (
                            <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
                        ) : user ? (
                            <Button onClick={() => {handleLogout(); setIsOpen(false);}} variant="secondary" className="w-full btn">Logout</Button>
                        ) : (
                            <Button asChild className="w-full btn">
                            <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
