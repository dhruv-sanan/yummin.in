import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Crème & Crust Bakery & Café",
    description: "The story behind our artisanal bakery and why we are loved by the community.",
};

export default function AboutPage() {
    return (
        <div className="pb-16">
            <PageHero
                title="Our Story"
                description="From a small home kitchen to your favorite neighborhood café."
                className="bg-secondary/30 mb-12"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

                {/* Story Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold font-heading text-primary">Sweet cravings? Sorted.</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Yummin started with a mission to bring the finest shakes and desserts to Amritsar.
                            We believe in quality ingredients, rich flavors, and presentation that makes you smile.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Located on Majitha Road, we are your go-to spot for a quick refresh or a sweet indulgence.
                            From our signature &quot;It&apos;s So Chocolatey&quot; shake to traditional Amritsari Kulfi, we serve happiness in every bite.
                        </p>
                    </div>
                    <div className="relative h-[400px] bg-muted rounded-2xl overflow-hidden flex items-center justify-center text-muted-foreground bg-[url('/placeholder-bakery.jpg')] bg-cover bg-center">
                        {/* Placeholder for About Image */}
                        <span className="bg-background/80 p-4 rounded-xl">Interior / Baker Image</span>
                    </div>
                </section>

                {/* Features for Owners (The "Sell") */}
                <section className="bg-primary/5 p-8 md:p-12 rounded-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-heading text-primary">Why Bakery Owners Love This Website</h2>
                        <p className="mt-4 text-muted-foreground">This demo showcases features designed to grow your business.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Direct WhatsApp Ordering", desc: "Frictionless ordering that customers love." },
                            { title: "AI Concierge", desc: "Handle inquiries 24/7 without extra staff." },
                            { title: "Visual Heavy Menu", desc: "Mouth-watering presentation drives sales." },
                            { title: "Mobile First Design", desc: "Optimized for how 80% of customers order." },
                        ].map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center space-y-6">
                    <h2 className="text-3xl font-bold font-heading">Ready to taste the difference?</h2>
                    <Link href="/menu">
                        <Button size="lg" className="rounded-full px-8">Order Now</Button>
                    </Link>
                </section>
            </div>
        </div>
    );
}
