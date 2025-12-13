"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem } from "@/data/menu";

export interface CartItem extends MenuItem {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: MenuItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

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
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("creme-cart", JSON.stringify(items));
    }, [items]);

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
            prev.map((i) => {
                if (i.id === id) {
                    const newQty = Math.max(0, i.quantity + delta);
                    return { ...i, quantity: newQty };
                }
                return i;
            }).filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
