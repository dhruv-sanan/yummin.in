"use client";

import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const GALLERY_IMAGES = [
    { id: 1, src: "", alt: "Cozy Corner Seating", color: "bg-orange-100" },
    { id: 2, src: "", alt: "Fresh Croissants", color: "bg-orange-50" },
    { id: 3, src: "", alt: "Birthday Cake Display", color: "bg-pink-100" },
    { id: 4, src: "", alt: "Barista Pouring Coffee", color: "bg-brown-100" },
    { id: 5, src: "", alt: "Outdoor Patio", color: "bg-green-50" },
    { id: 6, src: "", alt: "Artisan Breads", color: "bg-yellow-50" },
];

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const activeImage = GALLERY_IMAGES.find((img) => img.id === selectedImage);

    return (
        <div className="pb-16">
            <PageHero
                title="Our Gallery"
                description="A glimpse into our cozy space and mouth-watering creations."
                className="bg-secondary/30 mb-12"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {GALLERY_IMAGES.map((image) => (
                        <div
                            key={image.id}
                            className={cn(
                                "group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-muted transition-all hover:shadow-lg",
                                image.color // Placeholder background color
                            )}
                            onClick={() => setSelectedImage(image.id)}
                        >
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium p-4 text-center group-hover:scale-105 transition-transform duration-500">
                                {image.alt}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="text-white h-8 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {activeImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div
                        className={cn(
                            "relative w-full max-w-4xl aspect-video rounded-lg shadow-2xl flex items-center justify-center text-2xl font-bold",
                            activeImage.color
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Actual Image would go here */}
                        <span className="text-foreground/50">{activeImage.alt}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
