
"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ContactPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                name: user.displayName || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
             toast({
                title: "Login Required",
                description: "You must be logged in to send a message.",
                variant: "destructive"
            });
            return;
        }

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast({
                title: "Error",
                description: "Please fill out all required fields.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, `contacts`), {
                userId: user.uid,
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                status: 'Unread',
                createdAt: serverTimestamp(),
            });
            toast({
                title: "Success",
                description: "Your message has been sent successfully."
            });
            // Reset form but keep user details
            setFormData({ 
                name: user?.displayName || '', 
                email: user?.email || '', 
                subject: '', 
                message: '' 
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to send message. Please try again later.",
                variant: "destructive"
            });
            console.error("Error adding document: ", error);
        } finally {
            setLoading(false);
        }
    }

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
                                    <a href="mailto:helpdesk.grock@outlook.com" className="text-muted-foreground hover:text-primary">helpdesk.grock@outlook.com</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-6 h-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">+917719457081</p>
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
                         {!user && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>
                                    Please log in to send a message through the contact form.
                                </AlertDescription>
                            </Alert>
                         )}
                        <form onSubmit={handleSubmit} className={`space-y-4 ${!user ? 'mt-4' : ''}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} disabled={!user || !!user?.displayName} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} disabled={!user} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="Message Subject" value={formData.subject} onChange={handleInputChange} disabled={!user} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." rows={6} value={formData.message} onChange={handleInputChange} disabled={!user} />
                            </div>
                            <Button type="submit" className="w-full font-bold" size="lg" disabled={loading || !user}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    