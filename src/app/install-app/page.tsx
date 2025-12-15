"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share, Download, Chrome, Smartphone, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppPage() {
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIOS) {
            setPlatform('ios');
        } else if (isAndroid) {
            setPlatform('android');
        } else {
            setPlatform('desktop');
        }

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        } else if ('standalone' in window.navigator && (window.navigator as any).standalone) {
            setIsInstalled(true);
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            toast('App installed successfully! 🎉', 'success');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [toast]);

    const handleInstallClick = async () => {
        if (isInstalled) {
            toast('App is already installed!', 'info');
            return;
        }

        // For browsers with native prompt support
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                toast('Installing app...', 'success');
            } else {
                toast('Follow the instructions below to install manually', 'info');
            }

            setDeferredPrompt(null);
        } else if (platform === 'ios') {
            // iOS - scroll to instructions
            toast('Follow the instructions below to install on iOS', 'info');
            const instructionsElement = document.getElementById('install-instructions');
            if (instructionsElement) {
                instructionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Fallback - show instructions
            toast('Follow the instructions below for your device', 'info');
            const instructionsElement = document.getElementById('install-instructions');
            if (instructionsElement) {
                instructionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Header */}
            <div className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/menu" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Menu
                    </Link>
                    <h1 className="text-3xl font-bold font-heading">How to Install Yummin App</h1>
                    <p className="text-primary-foreground/90 mt-2">Get faster ordering with our mobile app!</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Quick Install Button */}
                {!isInstalled && (
                    <Card className="p-6 mb-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-shrink-0 p-4 bg-white/10 rounded-2xl">
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl font-bold mb-2">Quick Install</h2>
                                <p className="text-primary-foreground/90 text-sm">
                                    {deferredPrompt
                                        ? "Click below to install instantly!"
                                        : platform === 'ios'
                                            ? "Tap below for step-by-step Safari instructions"
                                            : "Get the app on your device now"}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Button
                                    onClick={handleInstallClick}
                                    size="lg"
                                    className="bg-white text-primary hover:bg-white/90 font-bold gap-2 shadow-lg"
                                >
                                    <Download className="h-5 w-5" />
                                    {deferredPrompt ? 'Install Now' : 'Show Instructions'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Already Installed Message */}
                {isInstalled && (
                    <Card className="p-6 mb-8 bg-green-50 border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <span className="text-3xl">✅</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-green-900">App Already Installed!</h2>
                                <p className="text-green-700">You can open Yummin from your home screen</p>
                            </div>
                        </div>
                    </Card>
                )}

                <div id="install-instructions">
                    {/* iOS Instructions */}
                    {platform === 'ios' && (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Smartphone className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Install on iOS (Safari)</h2>
                                    <p className="text-muted-foreground">Follow these simple steps</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Tap the Share Button</h3>
                                        <p className="text-muted-foreground mb-3">
                                            Look for the <Share className="inline h-4 w-4 mx-1" /> share icon at the bottom of Safari (or top on iPad)
                                        </p>
                                        <div className="bg-secondary/50 p-4 rounded-lg">
                                            <p className="text-sm">💡 <strong>Tip:</strong> The share button looks like a square with an arrow pointing up</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Find "Add to Home Screen"</h3>
                                        <p className="text-muted-foreground mb-3">
                                            Scroll down in the share menu and tap <strong>"Add to Home Screen"</strong>
                                        </p>
                                        <div className="bg-secondary/50 p-4 rounded-lg">
                                            <p className="text-sm">💡 <strong>Tip:</strong> You may need to scroll down in the menu to find this option</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Tap "Add"</h3>
                                        <p className="text-muted-foreground mb-3">
                                            Confirm by tapping the <strong>"Add"</strong> button in the top right
                                        </p>
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                            <p className="text-sm text-green-800">✅ <strong>Done!</strong> You'll see the Yummin icon on your home screen</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Note:</strong> This feature only works in Safari browser on iOS. If you're using Chrome or another browser, please open this page in Safari.
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Android Instructions */}
                    {platform === 'android' && (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Chrome className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Install on Android (Chrome)</h2>
                                    <p className="text-muted-foreground">Quick and easy setup</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Open the Menu</h3>
                                        <p className="text-muted-foreground mb-3">
                                            Tap the three dots (⋮) in the top right corner of Chrome
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Select "Add to Home screen"</h3>
                                        <p className="text-muted-foreground mb-3">
                                            You'll see an option that says <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>
                                        </p>
                                        <div className="bg-secondary/50 p-4 rounded-lg">
                                            <p className="text-sm">💡 <strong>Alternative:</strong> You may also see a popup banner at the bottom asking to install the app</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Confirm Installation</h3>
                                        <p className="text-muted-foreground mb-3">
                                            Tap <strong>"Install"</strong> or <strong>"Add"</strong> to confirm
                                        </p>
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                            <p className="text-sm text-green-800">✅ <strong>Done!</strong> The app will be added to your home screen and app drawer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Tip:</strong> Once installed, you can open Yummin directly from your home screen - no browser needed!
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Desktop Instructions */}
                    {platform === 'desktop' && (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Download className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Install on Desktop</h2>
                                    <p className="text-muted-foreground">Available on Chrome & Edge</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Look for the Install Icon</h3>
                                        <p className="text-muted-foreground mb-3">
                                            You'll see a <Download className="inline h-4 w-4 mx-1" /> install icon in the address bar (Chrome) or a popup notification
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">Click Install</h3>
                                        <p className="text-muted-foreground mb-3">
                                            Click the install button and confirm when prompted
                                        </p>
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                            <p className="text-sm text-green-800">✅ <strong>Done!</strong> Yummin will open in its own window</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Note:</strong> Desktop installation works best in Chrome or Edge browsers.
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Benefits Section */}
                    <Card className="p-6 mt-6 bg-gradient-to-r from-primary/5 to-primary/10">
                        <h3 className="font-bold text-xl mb-4">Why Install?</h3>
                        <div className="grid gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Faster Access</h4>
                                    <p className="text-sm text-muted-foreground">One tap from your home screen - no browser needed</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold">App-Like Experience</h4>
                                    <p className="text-sm text-muted-foreground">Full screen mode without browser UI</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <span className="text-2xl">🔔</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Order Updates</h4>
                                    <p className="text-sm text-muted-foreground">Get notified about your orders (coming soon)</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link href="/menu">
                        <Button size="lg" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Menu
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
