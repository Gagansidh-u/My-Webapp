"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto py-16 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Contact Us</h1>
                <p className="text-lg text-muted-foreground mt-2">We'd love to hear from you. Here's how you can reach us.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Get in Touch</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail className="w-6 h-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <a href="mailto:support@grock.dev" className="text-muted-foreground hover:text-primary">support@grock.dev</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-6 h-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <MapPin className="w-6 h-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Office</h3>
                                    <p className="text-muted-foreground">123 Tech Avenue, Silicon Valley, CA 94043</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Your Email" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="Message Subject" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." rows={6} />
                            </div>
                            <Button type="submit" className="w-full font-bold" size="lg">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
