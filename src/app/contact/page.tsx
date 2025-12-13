import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Crème & Crust Bakery & Café",
    description: "Get in touch with us for bookings, orders, or feedback.",
};

export default function ContactPage() {
    return (
        <div className="pb-16">
            <PageHero
                title="Contact Us"
                description="We'd love to hear from you. Find us, call us, or write to us."
                className="bg-secondary/30 mb-12"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold font-heading text-primary">Get in Touch</h2>
                            <p className="text-muted-foreground">
                                Have a question or want to book a table? Reach out to us directly or fill the form.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold">Visit Us</h3>
                                        <p className="text-muted-foreground">Opposite Gurudwara Har Rai Sahib,<br />Majitha Road, Amritsar, Punjab 143001</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold">Call Us</h3>
                                        <p className="text-muted-foreground">+91 88771 16603</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold">Email Us</h3>
                                        <p className="text-muted-foreground">hello@yummin.in</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold">Opening Hours</h3>
                                        <p className="text-muted-foreground">Mon-Wed, Fri, Sun: 12 PM - 11:45 PM</p>
                                        <p className="text-muted-foreground">Thu, Sat: 12 PM - 12 AM</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form & Map */}
                    <div className="space-y-8">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-xl">Send a Message</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input placeholder="Your Phone" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="Your Email" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <Button className="w-full">Send Message</Button>
                            </CardContent>
                        </Card>

                        {/* Dummy Map */}
                        <div className="h-[250px] w-full bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                            <p>Google Maps Embed Placeholder</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
