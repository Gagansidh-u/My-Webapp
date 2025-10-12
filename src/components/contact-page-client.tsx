
"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import { sendEmail } from "@/app/actions/email";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function ContactPageClient() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

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
            setIsAuthOpen(true);
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
            const inquiryData = {
                userId: user.uid,
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                status: 'Unread',
                createdAt: serverTimestamp(),
            };

            const contactsCollectionRef = collection(db, "contacts");
            addDoc(contactsCollectionRef, inquiryData)
                .then(async (docRef) => {
                    const messagesCollectionRef = collection(db, "contacts", docRef.id, "messages");
                    await addDoc(messagesCollectionRef, {
                        text: formData.message,
                        senderId: user.uid,
                        senderName: formData.name,
                        createdAt: serverTimestamp()
                    });

                    await sendEmail({
                        to: 'helpdesk.grock@outlook.com',
                        subject: `New Inquiry: ${formData.subject}`,
                        html: `
                            <h1>New Inquiry</h1>
                            <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
                            <p><strong>User ID:</strong> ${user.uid}</p>
                            <p><strong>Subject:</strong> ${formData.subject}</p>
                            <hr />
                            <p>${formData.message}</p>
                        `
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
                })
                .catch(async (serverError) => {
                    const permissionError = new FirestorePermissionError({
                      path: contactsCollectionRef.path,
                      operation: 'create',
                      requestResourceData: inquiryData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
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

    const handleAuthSuccess = () => {
        setIsAuthOpen(false);
    }

    return (
        <>
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
                                        <a href="https://maps.app.goo.gl/NmjvcNGMUqTgEAyDA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                            517,uppli,barnala,punjab,india 148105
                                        </a>
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
                                        Please log in or sign up to send a message.
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
                                        <Input id="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} disabled={!user || !!user?.email} />
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
                                <Button type="submit" className="w-full font-bold" size="lg" disabled={loading}>
                                    {loading && <Loader size={20} className="mr-2" />}
                                    {loading ? "Sending..." : user ? "Send Message" : "Login to Send"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none">
                    <DialogTitle className="sr-only">Authentication</DialogTitle>
                    <Card className="w-full shadow-2xl bg-transparent border-none">
                        <AuthForm onAuthSuccess={handleAuthSuccess} />
                    </Card>
                </DialogContent>
            </Dialog>
        </>
    );
}
