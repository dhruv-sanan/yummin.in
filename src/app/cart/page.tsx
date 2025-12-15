"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft, Tag, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, couponCode, discountAmount, finalPrice, applyCoupon, removeCoupon, availableCoupons } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [couponInput, setCouponInput] = useState("");
    const [showCouponDropdown, setShowCouponDropdown] = useState(false);
    const couponInputRef = useRef<HTMLInputElement>(null);

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto"
                >
                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link href="/menu">
                        <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                            Browse Menu
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        // Mobile: Fixed height container to manage scroll vs sticky
        // Desktop: Normal auto height
        <div className="h-[calc(100vh-64px)] md:h-auto flex flex-col md:block bg-background">

            {/* Header (Mobile Only visible via standard nav, but added here for context if needed or purely relying on Navbar) */}
            {/* Desktop Header */}
            <div className="hidden md:block container mx-auto px-4 pt-8 pb-4">
                <h1 className="text-4xl font-heading font-bold mb-8">Your Cart</h1>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-hidden md:overflow-visible flex flex-col md:flex-row md:container md:mx-auto md:px-4 md:gap-12">

                {/* Scrollable Items Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 md:p-0">
                    <Link href="/menu" className="md:hidden flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-5 w-5" /> <span>Back to Menu</span>
                    </Link>

                    <div className="space-y-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-4 p-4 bg-card rounded-xl border shadow-sm"
                            >
                                <div className="relative w-24 h-24 shrink-0 bg-secondary rounded-lg overflow-hidden">
                                    {/* Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-2xl font-heading">
                                        {item.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-heading font-bold text-lg line-clamp-1">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">₹{item.price} per item</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md bg-background shadow-sm hover:bg-white transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md bg-background shadow-sm hover:bg-white transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="font-bold text-lg">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Fixed Bottom Summary (Mobile) / Sticky Sidebar (Desktop) */}
                <div className="shrink-0 z-10 md:w-96 md:sticky md:top-24 h-auto bg-background border-t md:border-t-0 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] md:shadow-none p-6 md:p-0">
                    <div className="md:bg-card md:border md:rounded-2xl md:p-6 md:shadow-sm">
                        <h2 className="text-xl font-heading font-bold mb-6 hidden md:block">Order Summary</h2>

                        {/* Coupon Section */}
                        <div className="mb-6">
                            {!couponCode ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Have a coupon?
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={couponInputRef}
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => {
                                                setCouponInput(e.target.value.toUpperCase());
                                                setShowCouponDropdown(true);
                                            }}
                                            onFocus={() => setShowCouponDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowCouponDropdown(false), 200)}
                                            placeholder="Enter coupon code"
                                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

                                        {/* Dropdown with available coupons */}
                                        {showCouponDropdown && availableCoupons.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-card border rounded-lg shadow-lg overflow-hidden">
                                                {availableCoupons.map((coupon) => (
                                                    <button
                                                        key={coupon.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setCouponInput(coupon.code);
                                                            setShowCouponDropdown(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b last:border-b-0"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-sm">{coupon.code}</span>
                                                            <span className="text-xs text-green-600">
                                                                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            const result = applyCoupon(couponInput);
                                            if (result.success) {
                                                toast(result.message);
                                                setCouponInput("");
                                            } else {
                                                toast(result.message);
                                            }
                                        }}
                                        className="w-full"
                                    >
                                        Apply Coupon
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-semibold text-green-700">{couponCode}</p>
                                            <p className="text-xs text-green-600">Coupon applied!</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            removeCoupon();
                                            toast("Coupon removed");
                                        }}
                                        className="text-green-700 hover:text-green-900"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Taxes & Charges (5%)</span>
                                <span>₹{Math.round(totalPrice * 0.05)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Discount ({couponCode})</span>
                                    <span>-₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
                                <span>Total to Pay</span>
                                <span>₹{finalPrice + Math.round(totalPrice * 0.05)}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="block">
                            <Button size="lg" className="w-full text-lg font-bold h-14 md:h-12 shadow-primary/25 shadow-lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
