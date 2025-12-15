"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem } from "@/data/menu";

export interface CartItem extends MenuItem {
    quantity: number;
}

interface Coupon {
    code: string;
    type: 'percentage' | 'flat';
    value: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
    { code: 'WELCOME10', type: 'percentage', value: 10 },
    { code: 'FLAT50', type: 'flat', value: 50 }
];

interface CartContextType {
    items: CartItem[];
    addItem: (item: MenuItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    couponCode: string;
    discountAmount: number;
    finalPrice: number;
    applyCoupon: (code: string) => { success: boolean; message: string };
    removeCoupon: () => void;
    availableCoupons: Coupon[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [couponCode, setCouponCode] = useState<string>("");

    // Load from local storage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("creme-cart");
            if (savedCart) {
                try {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setItems(JSON.parse(savedCart));
                } catch (e) {
                    console.error("Failed to parse cart from local storage", e);
                }
            }

            const savedCoupon = localStorage.getItem("creme-coupon");
            if (savedCoupon) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCouponCode(savedCoupon);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("creme-cart", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem("creme-coupon", couponCode);
    }, [couponCode]);

    const addItem = (item: MenuItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev
                .map((i) => {
                    if (i.id === id) {
                        const newQty = i.quantity + delta;
                        // Only update if new quantity would be positive
                        if (newQty > 0) {
                            return { ...i, quantity: newQty };
                        }
                        // Return null to remove item when quantity reaches 0
                        return null;
                    }
                    return i;
                })
                .filter((i): i is CartItem => i !== null)
        );
    };

    const clearCart = () => {
        setItems([]);
        setCouponCode("");
    };

    const applyCoupon = (code: string): { success: boolean; message: string } => {
        const upperCode = code.trim().toUpperCase();
        const coupon = AVAILABLE_COUPONS.find(c => c.code === upperCode);

        if (!coupon) {
            return { success: false, message: "Invalid coupon code" };
        }

        if (totalPrice === 0) {
            return { success: false, message: "Cart is empty" };
        }

        setCouponCode(coupon.code);
        return { success: true, message: `Coupon ${coupon.code} applied!` };
    };

    const removeCoupon = () => {
        setCouponCode("");
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Calculate discount
    let discountAmount = 0;
    if (couponCode) {
        const coupon = AVAILABLE_COUPONS.find(c => c.code === couponCode);
        if (coupon) {
            if (coupon.type === 'percentage') {
                discountAmount = Math.round((totalPrice * coupon.value) / 100);
            } else {
                discountAmount = Math.min(coupon.value, totalPrice);
            }
        }
    }

    const finalPrice = totalPrice - discountAmount;

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                couponCode,
                discountAmount,
                finalPrice,
                applyCoupon,
                removeCoupon,
                availableCoupons: AVAILABLE_COUPONS,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
