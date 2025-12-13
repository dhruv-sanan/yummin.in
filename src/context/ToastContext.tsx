"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            layout
                            className={cn(
                                "flex items-center gap-3 min-w-[300px] p-4 rounded-lg shadow-lg border backdrop-blur-md",
                                t.type === "success" && "bg-background/90 border-green-500/50 text-foreground",
                                t.type === "error" && "bg-destructive/90 border-destructive text-destructive-foreground",
                                t.type === "info" && "bg-blue-500/10 border-blue-500/50 text-blue-500",
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-full",
                                t.type === "success" && "bg-green-100 text-green-600",
                                t.type === "error" && "bg-red-100 text-red-600",
                            )}>
                                {t.type === "success" && <Check className="h-4 w-4" />}
                                {t.type === "error" && <AlertTriangle className="h-4 w-4" />}
                                {t.type === "info" && <Info className="h-4 w-4" />}
                            </div>
                            <p className="text-sm font-medium flex-1">{t.message}</p>
                            <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
