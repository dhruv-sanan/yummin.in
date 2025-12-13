"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function StickyCartBar() {
    const { items, totalPrice } = useCart();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Hide on cart page or if empty or checkout
        if (items.length > 0 && pathname !== "/cart" && pathname !== "/checkout") {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [items.length, pathname]);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent pointer-events-none"
                >
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <Link href="/cart">
                            <div className="bg-primary text-primary-foreground rounded-xl shadow-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg uppercase flex items-center gap-2">
                                        {totalItems} {totalItems === 1 ? 'Job' : 'Items'} Added
                                    </span>
                                    <span className="text-sm opacity-90 font-medium">₹{totalPrice} total</span>
                                </div>
                                <div className="flex items-center font-bold uppercase tracking-wide text-sm">
                                    View Cart <ChevronRight className="ml-1 h-5 w-5" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
