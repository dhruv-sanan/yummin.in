"use client";

import { useState } from "react";
import { MenuItem, CATEGORIES, Category } from "@/data/menu";
import { MenuItemCard } from "@/components/features/MenuItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface MenuGridProps {
    items: MenuItem[];
}

export function MenuGrid({ items }: MenuGridProps) {
    const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Group items by category
    const groupedItems = CATEGORIES.reduce((acc, category) => {
        const categoryItems = items.filter(item => item.category === category);
        if (categoryItems.length > 0) {
            acc[category] = categoryItems;
        }
        return acc;
    }, {} as Record<Category, MenuItem[]>);

    const scrollToSection = (category: Category | "All") => {
        setActiveCategory(category);
        if (category === "All") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const element = document.getElementById(`section-${category}`);
        if (element) {
            const headerOffset = 180; // Adjust for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <motion.div
            className="space-y-8 relative"
        >

            {/* Desktop Capability: Filters becoming Jump Links */}
            <div className="hidden md:flex flex-col gap-4 sticky top-16 z-40 bg-background/95 backdrop-blur py-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide mask-linear-fade max-w-[70%]">
                        <Button
                            variant={activeCategory === "All" ? "default" : "outline"}
                            onClick={() => scrollToSection("All")}
                            className="rounded-full whitespace-nowrap"
                        >
                            All Items
                        </Button>
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat}
                                variant={activeCategory === cat ? "default" : "outline"}
                                onClick={() => scrollToSection(cat)}
                                className="rounded-full whitespace-nowrap"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-64 shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-secondary/20"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Search - Visible only on mobile */}
            <div className="md:hidden relative w-full mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary/20"
                />
            </div>

            {/* Sections Grid/List */}
            <div className="space-y-12 pb-24">
                {Object.entries(groupedItems).map(([category, catItems]) => {
                    // Filter items if search is active
                    const displayedItems = catItems.filter(item =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (displayedItems.length === 0) return null;

                    return (
                        <motion.div
                            key={category}
                            id={`section-${category}`}
                            className="scroll-mt-24"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-heading font-bold mb-6 text-primary flex items-center gap-2">
                                {category}
                                <span className="h-px flex-1 bg-border ml-4"></span>
                            </h2>
                            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
                                {displayedItems.map((item) => (
                                    <MenuItemCard key={item.id} item={item} />
                                ))}
                            </motion.div>
                        </motion.div>
                    );
                })}

                {/* No results state */}
                {Object.values(groupedItems).flat().filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                        <div className="py-20 text-center text-muted-foreground">
                            <p className="text-lg">No items match your search.</p>
                            <Button variant="link" onClick={() => setSearchQuery("")}>
                                Clear search
                            </Button>
                        </div>
                    )}
            </div>
        </motion.div>
    );
}
