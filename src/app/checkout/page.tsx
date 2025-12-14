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
import { ArrowLeft, ChevronUp, CreditCard, Banknote, Wallet, Plus, Tag, X, ChevronDown, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { saveOrder } from "@/lib/api";

type PaymentMethod = "UPI" | "COD" | "CARD";

export default function CheckoutPage() {
    const { items, totalPrice, finalPrice, discountAmount, couponCode, clearCart, addItem, applyCoupon, removeCoupon, availableCoupons } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [showCouponDropdown, setShowCouponDropdown] = useState(false);
    const couponInputRef = useRef<HTMLInputElement>(null);
    const { isOpen, message: storeMessage } = useStoreStatus();

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        instructions: ""
    });

    // Smart Upselling Logic: Analyze cart composition
    const analyzeCart = () => {
        const sweetCategories = ["Milkshakes", "Exotic Milkshakes", "Smoothies", "Classic Shakes", "Fruit Shakes", "Floats"];
        const sweetItems = items.filter(item => sweetCategories.includes(item.category));
        const sweetPercentage = items.length > 0 ? (sweetItems.length / items.length) * 100 : 0;

        // If >70% sweet items, suggest savory. Otherwise, show bestsellers not in cart
        if (sweetPercentage > 70) {
            return MENU_ITEMS.filter(
                item => item.category === "Savory" && !items.find(i => i.id === item.id)
            ).slice(0, 5);
        } else {
            return MENU_ITEMS.filter(
                item => item.isBestseller && !items.find(i => i.id === item.id)
            ).slice(0, 5);
        }
    };

    const recommendations = analyzeCart();

    // Generate unique order ID
    const generateOrderId = (): string => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `YUM-${randomNum}`;
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            toast("Please fill in all required details");
            return;
        }

        setIsLoading(true);

        // Generate Order ID
        const orderId = generateOrderId();

        // Construct WhatsApp URL BEFORE async operations (critical for iOS)
        let message = `*🎉 New Order #${orderId}*\n\n`;
        message += `*Customer:* ${formData.name}\n`;
        message += `*Phone:* ${formData.phone}\n`;
        message += `*Address:* ${formData.address}\n\n`;
        message += `*Order Details:*\n${items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\n\n`;
        message += `*Subtotal:* ₹${totalPrice}\n`;

        if (discountAmount > 0) {
            message += `*Discount (${couponCode}):* -₹${discountAmount}\n`;
            message += `*Final Price:* ₹${finalPrice}\n`;
        } else {
            message += `*Final Price:* ₹${totalPrice}\n`;
        }

        message += `*Payment:* ${paymentMethod}\n\n`;
        message += `*Instructions:* ${formData.instructions || 'None'}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/918877116603?text=${encodedMessage}`;

        // Save order to localStorage for dashboard
        saveOrder({
            orderId,
            timestamp: Date.now(),
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                category: item.category
            })),
            subtotal: totalPrice,
            discount: discountAmount,
            couponCode: couponCode || "",
            finalPrice: finalPrice,
            paymentMethod: paymentMethod,
            instructions: formData.instructions
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // iOS fix: Use location.href instead of window.open for better compatibility
        window.location.href = whatsappUrl;

        // These will execute after user returns from WhatsApp
        setTimeout(() => {
            clearCart();
            toast("Order placed successfully!");
            router.push('/');
            setIsLoading(false);
        }, 1000);
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
            {/* Store Closed Banner */}
            {!isOpen && (
                <div className="sticky top-0 z-20 bg-orange-500 text-white px-4 py-3 flex items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{storeMessage}</p>
                </div>
            )}

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

                    {/* Coupon Section */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold font-heading flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Apply Coupon
                        </h2>
                        <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                            {!couponCode ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            ref={couponInputRef}
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => {
                                                setCouponInput(e.target.value.toUpperCase());
                                                setShowCouponDropdown(true);
                                            }}
                                            onFocus={() => setShowCouponDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowCouponDropdown(false), 200)}
                                            placeholder="Enter or select coupon code"
                                            className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

                                        {/* Dropdown */}
                                        {showCouponDropdown && availableCoupons.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-card border rounded-lg shadow-lg overflow-hidden">
                                                {availableCoupons.map((coupon) => (
                                                    <button
                                                        key={coupon.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setCouponInput(coupon.code);
                                                            setShowCouponDropdown(false);
                                                        }}
                                                        className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b last:border-b-0"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-sm">{coupon.code}</span>
                                                            <span className="text-xs text-green-600 font-medium">
                                                                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            const result = applyCoupon(couponInput);
                                            if (result.success) {
                                                toast(result.message);
                                                setCouponInput("");
                                            } else {
                                                toast(result.message);
                                            }
                                        }}
                                        className="w-full"
                                    >
                                        Apply Coupon
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-semibold text-green-700">{couponCode}</p>
                                            <p className="text-xs text-green-600">Saved ₹{discountAmount}!</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            removeCoupon();
                                            toast("Coupon removed");
                                        }}
                                        className="text-green-700 hover:text-green-900"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
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
                        <h2 className="text-lg font-bold font-heading">Bill Details</h2>
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
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-medium">
                                        <span>Discount ({couponCode})</span>
                                        <span>-₹{discountAmount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                    <span>Total Amount</span>
                                    <span>₹{finalPrice}</span>
                                </div>
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
                        disabled={isLoading || !isOpen}
                    >
                        <div className="flex flex-col items-start leading-none gap-0.5">
                            <span className="text-[10px] font-medium opacity-80 tracking-wide">TOTAL</span>
                            <span className="text-xl">₹{finalPrice}</span>
                        </div>
                        <span className="flex items-center gap-1 text-base ml-4">
                            {!isOpen ? 'Store Closed' : 'Place Order'}
                            {isLoading || !isOpen ? null : <ChevronUp className="h-4 w-4 rotate-90" />}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
