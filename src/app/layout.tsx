import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { WhatsAppButton } from "@/components/features/WhatsAppButton";
import { NRIConciergeBot } from "@/components/features/NRIConciergeBot";
import { FloatingMenu } from "@/components/features/FloatingMenu";
import { StickyCartBar } from "@/components/features/StickyCartBar";
import { JSON_LD } from "@/data/schema";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yummin - Taste the Difference",
  description: "Amritsar's favorite spot for Shakes, Juices, Beverages, and Desserts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          outfit.variable,
          "antialiased bg-background text-foreground flex flex-col min-h-screen"
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <ConditionalFooter />
            <WhatsAppButton />
            <NRIConciergeBot />
            <FloatingMenu />
            <StickyCartBar />
          </ToastProvider>
        </CartProvider>
      </body>
    </html >
  );
}
