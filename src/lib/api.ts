import { MENU_ITEMS } from "@/data/menu";

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
}

export interface Order {
    orderId: string;
    timestamp: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    couponCode: string;
    finalPrice: number;
    paymentMethod: string;
    instructions: string;
}

const STORAGE_KEY = "yummin_orders";

export function saveOrder(orderData: Order): void {
    try {
        const orders = getOrders();
        orders.push(orderData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
        console.error("Failed to save order:", error);
    }
}

export function getOrders(): Order[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to get orders:", error);
        return [];
    }
}

export function getOrdersByDateRange(startDate: Date, endDate: Date): Order[] {
    const orders = getOrders();
    const start = startDate.getTime();
    const end = endDate.getTime();
    return orders.filter(order => order.timestamp >= start && order.timestamp <= end);
}

export function clearOrders(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// Seed dummy data for testing
export function seedDummyData(): void {
    const customers = [
        { name: "Rajesh Kumar", phone: "9876543210" },
        { name: "Priya Sharma", phone: "9876543211" },
        { name: "Amit Singh", phone: "9876543212" },
        { name: "Neha Patel", phone: "9876543213" },
        { name: "Rohan Verma", phone: "9876543214" },
        { name: "Sneha Gupta", phone: "9876543215" },
        { name: "Vikram Malhotra", phone: "9876543216" },
        { name: "Anjali Reddy", phone: "9876543217" },
        { name: "Karan Mehta", phone: "9876543218" },
        { name: "Pooja Iyer", phone: "9876543219" },
        { name: "Arjun Nair", phone: "9876543220" },
        { name: "Divya Kapoor", phone: "9876543221" },
        { name: "Rahul Joshi", phone: "9876543222" },
        { name: "Kavya Rao", phone: "9876543223" },
        { name: "Siddharth Agarwal", phone: "9876543224" }
    ];

    const addresses = [
        "123 Mall Road, Amritsar",
        "456 Court Road, Amritsar",
        "789 Lawrence Road, Amritsar",
        "321 Queens Road, Amritsar",
        "654 GT Road, Amritsar",
        "987 Circular Road, Amritsar",
        "147 Hall Bazaar, Amritsar",
        "258 Katra Jaimal Singh, Amritsar",
        "369 Ranjit Avenue, Amritsar",
        "741 Model Town, Amritsar"
    ];

    const coupons = ["", "", "", "WELCOME10", "FLAT50"]; // 60% no coupon, 40% with coupon
    const paymentMethods = ["UPI", "COD", "CARD"];
    const instructions = ["", "", "Please ring the bell", "Don't ring the bell", "Extra napkins please", "Less ice"];

    // Create popular items for bestsellers (will appear more frequently)
    const popularItems = MENU_ITEMS.filter(item => item.isBestseller).map(item => item.id);

    const orders: Order[] = [];
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Generate 30 orders over the last 7 days
    for (let i = 0; i < 30; i++) {
        // More orders in recent days
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 12) + 12; // Between 12-23 hours (noon to 11pm)
        const timestamp = now - (daysAgo * oneDay) - (hoursAgo * 60 * 60 * 1000);

        // Some customers are VIPs (order multiple times)
        const customerIndex = i < 10
            ? Math.floor(Math.random() * 5) // First 10 orders from first 5 customers (for VIP status)
            : Math.floor(Math.random() * customers.length);

        const customer = customers[customerIndex];
        const address = addresses[Math.floor(Math.random() * addresses.length)];

        // Generate 1-4 items per order
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const orderItems: OrderItem[] = [];

        for (let j = 0; j < itemCount; j++) {
            // 70% chance of popular item, 30% chance of any item
            let menuItem;
            if (Math.random() < 0.7 && popularItems.length > 0) {
                const popularId = popularItems[Math.floor(Math.random() * popularItems.length)];
                menuItem = MENU_ITEMS.find(item => item.id === popularId)!;
            } else {
                menuItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
            }

            const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity

            orderItems.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: quantity,
                category: menuItem.category
            });
        }

        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const couponCode = coupons[Math.floor(Math.random() * coupons.length)];

        let discount = 0;
        if (couponCode === "WELCOME10") {
            discount = Math.round(subtotal * 0.1);
        } else if (couponCode === "FLAT50") {
            discount = Math.min(50, subtotal);
        }

        const finalPrice = subtotal - discount;

        orders.push({
            orderId: `YUM-${1000 + i}`,
            timestamp,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerAddress: address,
            items: orderItems,
            subtotal,
            discount,
            couponCode,
            finalPrice,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            instructions: instructions[Math.floor(Math.random() * instructions.length)]
        });
    }

    // Sort by timestamp (oldest first)
    orders.sort((a, b) => a.timestamp - b.timestamp);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    console.log(`✅ Seeded ${orders.length} dummy orders`);
}
