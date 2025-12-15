"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isSafari, setIsSafari] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Only show on cart page for higher conversion
        if (pathname !== "/cart") {
            setShowPrompt(false);
            return;
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iOS = /iphone|ipad|ipod/.test(userAgent);
        const safari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

        setIsIOS(iOS);
        setIsSafari(safari);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check iOS standalone
        if ('standalone' in window.navigator && (window.navigator as any).standalone) {
            setIsInstalled(true);
            return;
        }

        // Check if user previously dismissed
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

            // Show again after 7 days
            if (daysSinceDismissed < 7) {
                console.log(`PWA prompt dismissed ${daysSinceDismissed.toFixed(1)} days ago.Will show again in ${(7 - daysSinceDismissed).toFixed(1)} days.`);
                return;
            }
        }

        // For browsers that support beforeinstallprompt (Chrome, Edge, Samsung Internet)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if app was installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        // Show prompt after delay - only on cart page
        const timer = setTimeout(() => {
            setShowPrompt(true);
        }, 3000); // Show after 3 seconds on cart page

        return () => {
            clearTimeout(timer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [pathname]);

    const handleInstallClick = async () => {
        // For Chrome/Edge with native prompt
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }

            setDeferredPrompt(null);
            setShowPrompt(false);
        }
        // For iOS/Safari - instructions are shown, just dismiss
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    };

    // Debug logging
    console.log('PWA State:', { isInstalled, showPrompt, isIOS, isSafari, hasDeferredPrompt: !!deferredPrompt });

    if (isInstalled || !showPrompt) {
        return null;
    }

    // iOS Safari - Show manual instructions
    if (isIOS || isSafari) {
        return (
            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
                    >
                        <div className="bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-white rounded-2xl shadow-2xl p-5 border-2 border-white/20">
                            <button
                                onClick={handleDismiss}
                                className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="pr-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Smartphone className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg">
                                        Install Yummin App
                                    </h3>
                                </div>

                                <p className="text-sm text-white/90 mb-3">
                                    Get faster ordering and offline access! Add to your Home Screen:
                                </p>

                                <ol className="list-decimal list-inside space-y-2 text-sm text-white/90 mb-4 pl-2">
                                    <li className="flex items-start gap-2">
                                        <span className="shrink-0 font-semibold">1.</span>
                                        <span>Tap the <strong>Share</strong> button <Share className="inline h-4 w-4 mx-1" /> (at the bottom or top)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="shrink-0 font-semibold">2.</span>
                                        <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="shrink-0 font-semibold">3.</span>
                                        <span>Tap <strong>"Add"</strong> to confirm</span>
                                    </li>
                                </ol>

                                <Button
                                    onClick={handleDismiss}
                                    size="sm"
                                    className="w-full bg-white text-[#3E2723] hover:bg-white/90 font-semibold"
                                >
                                    Got it!
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Android Chrome/Edge - Native prompt or fallback
    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
                >
                    <div className="bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-white rounded-2xl shadow-2xl p-4 border-2 border-white/20">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <Smartphone className="h-8 w-8" />
                            </div>

                            <div className="flex-1 pr-6">
                                <h3 className="font-bold text-lg mb-1">
                                    Install Yummin App
                                </h3>
                                <p className="text-white/90 text-sm mb-3">
                                    {deferredPrompt
                                        ? "Get faster ordering, offline access, and instant updates!"
                                        : "Add to your home screen from your browser's menu for the best experience!"}
                                </p>

                                <div className="flex gap-2">
                                    {deferredPrompt ? (
                                        <>
                                            <Button
                                                onClick={handleInstallClick}
                                                size="sm"
                                                className="bg-white text-[#3E2723] hover:bg-white/90 font-semibold gap-2"
                                            >
                                                <Download className="h-4 w-4" />
                                                Install Now
                                            </Button>
                                            <Button
                                                onClick={handleDismiss}
                                                size="sm"
                                                variant="ghost"
                                                className="text-white hover:bg-white/10"
                                            >
                                                Not Now
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleDismiss}
                                            size="sm"
                                            className="bg-white text-[#3E2723] hover:bg-white/90 font-semibold"
                                        >
                                            Got it!
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
