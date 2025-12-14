"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
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
                return;
            }
        }

        // Capture the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after a short delay for better UX
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if app was installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        // Clear the deferred prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    };

    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }

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
                                    Get faster ordering, offline access, and instant updates!
                                </p>

                                <div className="flex gap-2">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
