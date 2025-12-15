"use client";

import { useState } from "react";
import { Plus, Minus, X, Star } from "lucide-react";
import { MenuItem } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItemCardProps {
    item: MenuItem;
    className?: string;
}

export function MenuItemCard({ item, className }: MenuItemCardProps) {
    const { items, addItem, removeItem, updateQuantity } = useCart();
    const { toast } = useToast();
    const [showOverlay, setShowOverlay] = useState(false);

    // Check if item is in cart
    const cartItem = items.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(item);
        if (quantity === 0) {
            toast(`${item.name} added to cart!`);
            // Simple fly animation only on first add
            const btn = e.currentTarget as HTMLButtonElement;
            const rect = btn.getBoundingClientRect();
            const clone = document.createElement("div");
            clone.style.position = "fixed";
            clone.style.left = `${rect.left + rect.width / 2 - 10}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = "20px";
            clone.style.height = "20px";
            clone.style.borderRadius = "50%";
            clone.style.backgroundColor = "var(--primary)";
            clone.style.zIndex = "100";
            clone.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            document.body.appendChild(clone);

            requestAnimationFrame(() => {
                clone.style.left = `${window.innerWidth - 40}px`;
                clone.style.top = "20px";
                clone.style.opacity = "0";
                clone.style.transform = "scale(0.5)";
            });

            setTimeout(() => {
                document.body.removeChild(clone);
            }, 800);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Use updateQuantity to decrement by 1 (will auto-remove when reaching 0)
        updateQuantity(item.id, -1);
    };

    return (
        <>
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowOverlay(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-lg w-full bg-background rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setShowOverlay(false)} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                                <X className="h-6 w-6" />
                            </button>
                            <div className="aspect-video w-full bg-secondary flex items-center justify-center">
                                {/* Placeholder or Real Image */}
                                <div className="text-6xl font-heading text-muted-foreground/50">{item.name.charAt(0)}</div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "h-4 w-4 rounded-sm border-2",
                                        item.isVegetarian ? "border-green-600 flex items-center justify-center after:content-[''] after:h-2 after:w-2 after:rounded-full after:bg-green-600" : "border-red-600 flex items-center justify-center after:content-[''] after:h-2 after:w-2 after:rounded-full after:bg-red-600"
                                    )} />
                                </div>
                                <h2 className="text-2xl font-bold font-heading text-foreground mb-1">{item.name}</h2>
                                <span className="text-xl font-bold text-foreground">₹{item.price}</span>
                                <p className="text-base text-muted-foreground mt-4 mb-6 leading-relaxed">{item.description}</p>
                                <Button size="lg" className="w-full text-lg" onClick={(e) => { setShowOverlay(false); handleAdd(e); }}>
                                    Add to Order
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List Item Layout */}
            <div
                className={cn(
                    "flex justify-between items-start gap-4 py-6 border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors cursor-pointer relative",
                    className
                )}
                onClick={() => setShowOverlay(true)}
            >
                {item.isBestseller && (
                    <div className="absolute top-2 left-0 text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary" /> Bestseller
                    </div>
                )}

                {/* Left Content */}
                <div className="flex-1 flex flex-col gap-1 pr-2 pt-2">
                    <span className={cn(
                        "h-4 w-4 rounded-sm border-2 mb-1",
                        item.isVegetarian ? "border-green-600 flex items-center justify-center after:content-[''] after:h-2 after:w-2 after:rounded-full after:bg-green-600" : "border-red-600 flex items-center justify-center after:content-[''] after:h-2 after:w-2 after:rounded-full after:bg-red-600"
                    )} />
                    <h3 className="text-lg font-bold text-foreground leading-tight">{item.name}</h3>
                    <span className="text-base font-medium text-foreground">₹{item.price}</span>
                    <div className="flex items-center gap-1 mt-2 mb-1">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(12)</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">{item.description}</p>
                </div>

                {/* Right Image & Button */}
                <div className="relative shrink-0 w-32 h-32">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-secondary shadow-sm relative">
                        {/* Image would go here */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-4xl font-heading">
                            {item.name.charAt(0)}
                        </div>
                    </div>

                    {/* Floating Add Button / Quantity Selector */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] z-20">
                        {quantity === 0 ? (
                            <Button
                                variant="secondary"
                                onClick={handleAdd}
                                className="w-full shadow-md bg-white hover:bg-gray-50 text-green-600 font-bold uppercase text-sm h-9 border border-input"
                            >
                                ADD <Plus className="ml-1 h-3 w-3" />
                            </Button>
                        ) : (
                            <div className="flex items-center justify-between w-full h-9 bg-primary text-primary-foreground rounded-md shadow-md overflow-hidden">
                                <button
                                    onClick={handleDecrement}
                                    className="h-full px-3 hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                    <Minus className="h-3 w-3 font-bold" />
                                </button>
                                <span className="text-sm font-bold">{quantity}</span>
                                <button
                                    onClick={handleAdd}
                                    className="h-full px-3 hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                    <Plus className="h-3 w-3 font-bold" />
                                </button>
                            </div>
                        )}
                        <div className="text-[10px] text-center text-muted-foreground mt-1">customisable</div>
                    </div>
                </div>
            </div>
        </>
    );
}
