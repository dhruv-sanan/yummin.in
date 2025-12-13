import { MenuGrid } from "@/components/features/MenuGrid";
import { PageHero } from "@/components/layout/PageHero";
import { MENU_ITEMS } from "@/data/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Menu | Crème & Crust Bakery & Café",
    description: "Explore our wide range of freshly baked breads, cakes, savory bites, and refreshing beverages.",
};

export default function MenuPage() {
    return (
        <div className="pb-16">
            <PageHero
                title="Our Menu"
                description="Freshly prepared, served with love."
                className="bg-secondary/30 mb-6 py-10"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <MenuGrid items={MENU_ITEMS} />
            </div>
        </div>
    );
}
