"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { SplineHero } from "@/components/features/SplineHero";
import { MenuItemCard } from "@/components/features/MenuItemCard";
import { Button } from "@/components/ui/button";
import { MENU_ITEMS } from "@/data/menu";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const bestsellers = MENU_ITEMS.filter((item) => item.isBestseller).slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#FDFBF7] pt-8 md:pt-12">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center md:text-left z-10">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              Taste the <br />
              <span className="text-[#8D6E63]">Difference.</span>
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground md:mx-0">
              Premium shakes, handcrafted juices, and delightful desserts.
              The sweetest spot in Amritsar.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Link href="/menu">
                <Button size="lg" className="rounded-full px-8 text-md bg-primary hover:bg-primary/90">
                  Order Now
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-md">
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] w-full md:h-[500px]">
            <SplineHero />
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">Our Bestsellers</h2>
          <p className="mt-2 text-muted-foreground">Loved by everyone, crafted for you.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/menu">
            <Button variant="link" className="text-primary text-lg group">
              View All Items <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why People Love Us */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">Why People Love Us</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Fresh Ingredients",
                desc: "We use only the finest, locally sourced ingredients for our bakes.",
                icon: "🌿",
              },
              {
                title: "Cozy Ambiance",
                desc: "A warm, inviting space perfect for conversations and coffee.",
                icon: "☕",
              },
              {
                title: "Custom Cakes",
                desc: "Celebrate your special moments with our handcrafted custom cakes.",
                icon: "🎂",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="border-none bg-background/50 shadow-md text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8 flex flex-col items-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">Sweet Words</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Aditi S.", text: "The best cheesecake I've ever had! The ambiance is just lovely.", rating: 5 },
            { name: "Rahul M.", text: "Perfect place for a weekend brunch. The coffee is amazing.", rating: 5 },
            { name: "Priya K.", text: "Ordered a birthday cake and it was stunning and delicious.", rating: 4 },
          ].map((t, idx) => (
            <Card key={idx} className="bg-[#FAF9F6]">
              <CardContent className="pt-6">
                <div className="flex mb-4 text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4 fill-current", i < t.rating ? "text-[#FFB400]" : "text-gray-300")} />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">&quot;{t.text}&quot;</p>
                <p className="font-bold text-primary">- {t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="font-heading text-3xl font-bold md:text-5xl">
              Plan your next celebration with us
            </h2>
            <p className="mx-auto max-w-2xl text-lg opacity-90">
              Whether it&apos;s a birthday, anniversary, or just a Tuesday, make it special with Crème & Crust.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary font-bold">
                Order on WhatsApp
              </Button>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        </div>
      </section>

      {/* Location Map */}
      <section className="w-full h-[400px] mt-8 bg-muted">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Opposite%20Gurudwara%20Har%20Rai%20Sahib,%20Majitha%20Road,%20Amritsar,%20Punjab%20143001+(Yummin)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
        ></iframe>
      </section>
    </div>
  );
}
