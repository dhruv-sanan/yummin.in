"use client";

import { useState, useEffect, useRef } from "react";
import { Utensils, X, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_GROUPS, MENU_ITEMS } from "@/data/menu";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";

export function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const scrollToCategory = (category: string) => {
        setIsOpen(false);
        setExpandedGroup(null); // Close expanded categories when navigating

        if (pathname !== "/menu") {
            // Navigate to menu page with hash
            router.push(`/menu#section-${category}`);
            return;
        }

        const element = document.getElementById(`section-${category}`);
        if (element) {
            const headerOffset = 140;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const toggleGroup = (groupName: string) => {
        if (expandedGroup === groupName) {
            setExpandedGroup(null);
        } else {
            setExpandedGroup(groupName);
        }
    };

    // Helper to get count of items in a category
    const getCount = (catName: string): number => {
        return MENU_ITEMS.filter(item => item.category === catName).length;
    };

    // Helper to get total count for a group
    const getGroupCount = (categories: string[]): number => {
        return categories.reduce((acc, cat) => acc + getCount(cat), 0);
    };

    const { items } = useCart();
    const pathname = usePathname();
    const showStickyBar = items.length > 0 && pathname !== "/cart" && pathname !== "/checkout";

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setExpandedGroup(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Hide menu completely on checkout
    if (pathname === "/checkout") return null;

    return (
        <div
            className={cn(
                "fixed right-6 z-50 transition-all duration-300",
                showStickyBar ? "bottom-28" : "bottom-6"
            )}
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        ref={menuRef}
                        layoutId="menu-container"
                        className="bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden w-[300px] sm:w-[350px] flex flex-col max-h-[80vh]"
                        initial={{ opacity: 0, scale: 0.9, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between sticky top-0 z-10">
                            <h2 className="text-xl font-bold font-heading">Yummin Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-primary-foreground/80 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto p-2 scrollbar-hide">
                            {MENU_GROUPS.map((group) => {
                                const isExpanded = expandedGroup === group.name;
                                const totalCount = getGroupCount(group.categories);

                                // Direct link groups (like Coffee) don't need expand logic if just 1 category
                                // But per request "Add sub categories for...", we treat logic uniformly or check length
                                const isSingleCategory = group.categories.length === 1 && group.categories[0] === group.name;

                                return (
                                    <div key={group.name} className="mb-2 last:mb-0">
                                        <div
                                            className={cn(
                                                "w-full flex items-center justify-between p-1 rounded-lg transition-colors text-left",
                                                isExpanded ? "bg-accent" : "hover:bg-accent/50"
                                            )}
                                        >
                                            <button
                                                onClick={() => {
                                                    if (isSingleCategory) {
                                                        scrollToCategory(group.categories[0]);
                                                    } else {
                                                        // If multiple, clicking name also expands for better UX, or scrolls to first if expanded?
                                                        // Request: "click on milkshake... directly go to milkshake section"
                                                        // "Only when i click on plus icon, it should show sub categories"
                                                        // So clicking name -> scrollToCategory(group.categories[0]) IF it maps to a section.
                                                        // But wait, "Milkshakes" group has "Milkshakes" category.
                                                        // Let's assume the group name matches the first category often, or find the best match.
                                                        // Actually, for "Milkshakes" group, first category is "Milkshakes".
                                                        // For "Amritsari Specials", first is "Amritsari Specials".
                                                        // For "Coolers", first is "Floats".
                                                        scrollToCategory(group.categories[0]);
                                                    }
                                                }}
                                                className="flex-grow p-2 text-left font-semibold text-lg"
                                            >
                                                {group.name}
                                            </button>

                                            <div className="flex items-center gap-2 pr-2">
                                                <span className="text-sm font-medium text-muted-foreground">{totalCount}</span>
                                                {isSingleCategory ? (
                                                    null
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleGroup(group.name);
                                                        }}
                                                        className="p-1 hover:bg-background rounded-full transition-colors"
                                                    >
                                                        {isExpanded ? <Minus className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-muted-foreground" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && !isSingleCategory && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 pr-2 pb-2 space-y-1">
                                                        {group.categories.map((cat) => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => scrollToCategory(cat)}
                                                                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted text-left text-sm"
                                                            >
                                                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
                                                                <span className="text-xs text-muted-foreground/50">{getCount(cat)}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        layoutId="menu-container"
                        onClick={() => setIsOpen(true)}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95"
                        whileHover={{ rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Utensils className="h-7 w-7" />
                        <span className="sr-only">Open Menu</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
