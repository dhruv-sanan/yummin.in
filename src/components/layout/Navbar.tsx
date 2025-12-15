"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const { totalItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if PWA is already installed
        const checkInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            } else if ('standalone' in window.navigator && (window.navigator as any).standalone) {
                setIsInstalled(true);
            } else {
                setIsInstalled(false);
            }
        };

        checkInstalled();
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold font-heading text-primary">
                        yummin
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {/* Install App Button - Only show if not installed */}
                    {!isInstalled && (
                        <Link href="/install-app" className="hidden sm:block">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-primary/20 hover:bg-primary/5 relative"
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden lg:inline">Install App</span>
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                            </Button>
                        </Link>
                    )}

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-2 bg-background">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block px-4 py-2 text-base font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground",
                                pathname === link.href
                                    ? "bg-accent/50 text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Install App in Mobile Menu */}
                    {!isInstalled && (
                        <Link
                            href="/install-app"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-base font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground bg-primary/5 text-primary border border-primary/20"
                        >
                            <div className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                <span>Install App</span>
                                <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    New
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
