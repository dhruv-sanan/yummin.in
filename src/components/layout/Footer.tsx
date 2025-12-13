import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary/30 border-t">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-heading text-primary">
                            yummin
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Taste the difference. Premium shakes, juices, and desserts in the heart of Amritsar.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Visit Us</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Opposite Gurudwara Har Rai Sahib</li>
                            <li>Majitha Road, Amritsar</li>
                            <li>Punjab 143001</li>
                            <li>+91 88771 16603</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Follow Us</h4>
                        <div className="flex space-x-4">
                            <Link href="https://www.instagram.com/yummin.in/" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Yummin. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
