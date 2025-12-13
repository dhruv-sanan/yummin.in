"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ArrowLeft, ChevronUp, CreditCard, Banknote, Wallet, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type PaymentMethod = "UPI" | "COD" | "CARD";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart, addItem } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        instructions: ""
    });

    // Filter recommended items (e.g., drinks or low price items not in cart)
    const recommendations = MENU_ITEMS.filter(
        item => (item.category === "Floats" || item.category === "Milk Bottle") &&
            !items.find(i => i.id === item.id)
    ).slice(0, 5);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            toast("Please fill in all required details");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const message = `*New Order!* \n\n*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}\n\n*Order Details:*\n${items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\n\n*Total:* ₹${totalPrice}\n*Payment:* ${paymentMethod}\n\n*Instructions:* ${formData.instructions}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/918877116603?text=${encodedMessage}`, '_blank');

        clearCart();
        toast("Order placed successfully!");
        router.push('/');
        setIsLoading(false);
    };

    const getPaymentIcon = (method: PaymentMethod) => {
        switch (method) {
            case "UPI": return <Wallet className="h-5 w-5" />;
            case "COD": return <Banknote className="h-5 w-5" />;
            case "CARD": return <CreditCard className="h-5 w-5" />;
        }
    };

    const getPaymentLabel = (method: PaymentMethod) => {
        switch (method) {
            case "UPI": return "Pay via UPI";
            case "COD": return "Cash on Delivery";
            case "CARD": return "Pay via Card";
        }
    };

    useEffect(() => {
        if (items.length === 0) {
            router.push('/menu');
        }
    }, [items.length, router]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background pb-32 md:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/cart">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-xl font-bold font-heading">Checkout</h1>
            </div>

            <div className="container mx-auto px-4 py-6 md:grid md:grid-cols-2 md:gap-12">
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">

                    {/* Address Section */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold font-heading flex items-center gap-2">
                            Delivery Details
                        </h2>
                        <div className="grid gap-4 bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Delivery Address</Label>
                                <Input
                                    id="address"
                                    placeholder="House no, Street area"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instructions">Cooking/Delivery Instructions (Optional)</Label>
                                <Input
                                    id="instructions"
                                    placeholder="e.g., less spicy, don't ring bell"
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>
                    {/* Recommendations Carousel */}
                <section className="mt-8 md:mt-0 space-y-4 overflow-hidden">
                    <h2 className="text-lg font-bold font-heading">Complete your meal with</h2>
                    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {recommendations.map((item) => (
                            <div key={item.id} className="flex-shrink-0 w-36 bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col">
                                <div className="h-24 bg-secondary/30 relative flex items-center justify-center">
                                    <div className="text-3xl font-heading text-muted-foreground/40">{item.name.charAt(0)}</div>
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h3 className="font-semibold text-xs leading-tight line-clamp-2 mb-1 h-8">{item.name}</h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-sm font-bold">₹{item.price}</span>
                                        <button
                                            onClick={() => {
                                                addItem(item);
                                                toast(`${item.name} added!`);
                                            }}
                                            className="p-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                    {/* Order Items Review */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold font-heading">Item Total</h2>
                        <div className="bg-card rounded-xl border shadow-sm divide-y">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "mt-1 h-4 w-4 rounded-sm border-2 flex items-center justify-center after:content-[''] after:h-2 after:w-2 after:rounded-full",
                                            item.isVegetarian ? "border-green-600 after:bg-green-600" : "border-red-600 after:bg-red-600"
                                        )} />
                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">₹{item.price} x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-sm">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                            <div className="p-4 flex justify-between font-bold border-t bg-secondary/5">
                                <span>Total Bill</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>
                    </section>
                </form>

                
            </div>

            {/* Custom Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-4 pb-6 md:pb-4">
                <div className="container mx-auto flex gap-4 items-center justify-between">
                    {/* Payment Selector (Left) */}
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="flex flex-col items-start gap-1 p-1 rounded-lg hover:bg-secondary/10 transition-colors">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">PAY USING</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold text-foreground truncate max-w-[120px] sm:max-w-none text-left">
                                        {getPaymentLabel(paymentMethod)}
                                    </span>
                                    <ChevronUp className="h-4 w-4 text-foreground/70" />
                                </div>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md gap-4">
                            <DialogHeader>
                                <DialogTitle>Select Payment Method</DialogTitle>
                            </DialogHeader>
                            <RadioGroup value={paymentMethod} onValueChange={(v: string) => {
                                setPaymentMethod(v as PaymentMethod);
                                setIsPaymentDialogOpen(false);
                            }}>
                                <div className="grid gap-2">
                                    <Label htmlFor="upi" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-secondary/10 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                        <RadioGroupItem value="UPI" id="upi" />
                                        <Wallet className="h-5 w-5" />
                                        <div className="flex-1">
                                            <div className="font-semibold">UPI</div>
                                            <div className="text-xs text-muted-foreground">GooglePay, PhonePe, Paytm</div>
                                        </div>
                                    </Label>
                                    <Label htmlFor="card" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-secondary/10 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                        <RadioGroupItem value="CARD" id="card" />
                                        <CreditCard className="h-5 w-5" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Credit/Debit Card</div>
                                            <div className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</div>
                                        </div>
                                    </Label>
                                    <Label htmlFor="cod" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-secondary/10 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                        <RadioGroupItem value="COD" id="cod" />
                                        <Banknote className="h-5 w-5" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Cash on Delivery</div>
                                            <div className="text-xs text-muted-foreground">Pay cash at your doorstep</div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </DialogContent>
                    </Dialog>

                    {/* Place Order Button (Right) */}
                    <Button
                        size="lg"
                        onClick={handlePlaceOrder}
                        className="h-14 bg-[#3E2723] hover:bg-[#3E2723]/90 text-white font-bold text-lg rounded-xl shadow-lg flex justify-between items-center px-6 min-w-[200px] sm:min-w-[240px]"
                        disabled={isLoading}
                    >
                        <div className="flex flex-col items-start leading-none gap-0.5">
                            <span className="text-[10px] font-medium opacity-80 tracking-wide">TOTAL</span>
                            <span className="text-xl">₹{totalPrice}</span>
                        </div>
                        <span className="flex items-center gap-1 text-base ml-4">
                            Place Order
                            {isLoading ? null : <ChevronUp className="h-4 w-4 rotate-90" />}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
