"use client";

import { useState, useEffect } from "react";
import { getOrders, seedDummyData, clearOrders, type Order } from "@/lib/api";
import { MENU_ITEMS } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Users,
    Star,
    Package,
    AlertTriangle,
    RefreshCw,
    Database,
    Trash2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Link from "next/link";

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = () => {
        setLoading(true);
        const allOrders = getOrders();
        setOrders(allOrders);
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Calculate Today's metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.timestamp);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.finalPrice, 0);
    const totalOrders = orders.length;
    const avgTicketSize = totalOrders > 0 ? Math.round(orders.reduce((sum, order) => sum + order.finalPrice, 0) / totalOrders) : 0;

    // Menu Engineering - Bestsellers by Quantity
    const itemQuantities: { [key: string]: { name: string; qty: number; category: string } } = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!itemQuantities[item.id]) {
                itemQuantities[item.id] = { name: item.name, qty: 0, category: item.category };
            }
            itemQuantities[item.id].qty += item.quantity;
        });
    });

    const bestsellers = Object.entries(itemQuantities)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 3);

    // Menu Engineering - Revenue Drivers
    const itemRevenue: { [key: string]: { name: string; revenue: number; category: string } } = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!itemRevenue[item.id]) {
                itemRevenue[item.id] = { name: item.name, revenue: 0, category: item.category };
            }
            itemRevenue[item.id].revenue += item.price * item.quantity;
        });
    });

    const revenueDrivers = Object.entries(itemRevenue)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

    // Zero Movers - Items with no sales in last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(order => order.timestamp >= sevenDaysAgo);
    const soldItemIds = new Set<string>();
    recentOrders.forEach(order => {
        order.items.forEach(item => soldItemIds.add(item.id));
    });

    const zeroMovers = MENU_ITEMS.filter(item => !soldItemIds.has(item.id));

    // Peak Hour Analysis
    const hourlyData: { [hour: number]: number } = {};
    for (let i = 0; i < 24; i++) {
        hourlyData[i] = 0;
    }

    orders.forEach(order => {
        const hour = new Date(order.timestamp).getHours();
        hourlyData[hour]++;
    });

    const peakHourChartData = Object.entries(hourlyData).map(([hour, count]) => ({
        hour: `${hour}:00`,
        orders: count,
        hourNum: parseInt(hour)
    }));

    const maxOrders = Math.max(...Object.values(hourlyData));
    const peakHours = Object.entries(hourlyData)
        .filter(([_, count]) => count > maxOrders * 0.7)
        .map(([hour, _]) => `${hour}:00`)
        .join(", ");

    // Customer Intelligence - VIP Detection
    const customerOrders: { [phone: string]: { name: string; count: number; totalSpent: number; lastOrder: number } } = {};
    orders.forEach(order => {
        if (!customerOrders[order.customerPhone]) {
            customerOrders[order.customerPhone] = {
                name: order.customerName,
                count: 0,
                totalSpent: 0,
                lastOrder: 0
            };
        }
        customerOrders[order.customerPhone].count++;
        customerOrders[order.customerPhone].totalSpent += order.finalPrice;
        customerOrders[order.customerPhone].lastOrder = Math.max(
            customerOrders[order.customerPhone].lastOrder,
            order.timestamp
        );
    });

    const recentOrdersWithBadges = [...orders]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 15)
        .map(order => {
            const customerData = customerOrders[order.customerPhone];
            let badge = "";
            let badgeColor = "";

            if (customerData.count >= 5) {
                badge = "VIP 🌟";
                badgeColor = "bg-amber-100 text-amber-700 border-amber-300";
            } else if (customerData.count >= 2) {
                badge = "Returning";
                badgeColor = "bg-blue-100 text-blue-700 border-blue-300";
            }

            return { ...order, badge, badgeColor };
        });

    const handleSeedData = () => {
        seedDummyData();
        loadOrders();
    };

    const handleClearData = () => {
        if (confirm("Are you sure you want to clear all orders? This cannot be undone.")) {
            clearOrders();
            loadOrders();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-heading mb-2">Owner Dashboard</h1>
                            <p className="text-white/80">Strategic insights & analytics</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSeedData}
                                variant="secondary"
                                size="sm"
                                className="gap-2"
                            >
                                <Database className="h-4 w-4" />
                                Seed Data
                            </Button>
                            <Button
                                onClick={handleClearData}
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear
                            </Button>
                            <Button
                                onClick={loadOrders}
                                variant="secondary"
                                size="sm"
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Pulse Cards */}
                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4">The Pulse</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-green-700 font-medium mb-1">Today's Revenue</p>
                                    <h3 className="text-3xl font-bold text-green-900">₹{todayRevenue.toLocaleString()}</h3>
                                    <p className="text-xs text-green-600 mt-2">{todayOrders.length} orders today</p>
                                </div>
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 font-medium mb-1 flex items-center gap-1">
                                        Average Ticket Size
                                        <span className="text-xs text-blue-500 cursor-help" title="If this drops, encourage staff to upsell">ⓘ</span>
                                    </p>
                                    <h3 className="text-3xl font-bold text-blue-900">₹{avgTicketSize}</h3>
                                    <p className="text-xs text-blue-600 mt-2">Across {totalOrders} orders</p>
                                </div>
                                <div className="p-3 bg-blue-200 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-blue-700" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-purple-700 font-medium mb-1">Total Orders</p>
                                    <h3 className="text-3xl font-bold text-purple-900">{totalOrders}</h3>
                                    <p className="text-xs text-purple-600 mt-2">All time</p>
                                </div>
                                <div className="p-3 bg-purple-200 rounded-lg">
                                    <ShoppingCart className="h-6 w-6 text-purple-700" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Menu Engineering */}
                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4">Menu Engineering</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Bestsellers */}
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Top 3 Bestsellers
                            </h3>
                            <div className="space-y-3">
                                {bestsellers.map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">{item.qty}</p>
                                            <p className="text-xs text-muted-foreground">sold</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Revenue Drivers */}
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Top 3 Revenue Drivers
                            </h3>
                            <div className="space-y-3">
                                {revenueDrivers.map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">₹{item.revenue}</p>
                                            <p className="text-xs text-muted-foreground">revenue</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Zero Movers */}
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                Zero Movers (7d)
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {zeroMovers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        🎉 All items selling well!
                                    </p>
                                ) : (
                                    zeroMovers.slice(0, 10).map((item) => (
                                        <div key={item.id} className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                            <p className="font-semibold text-sm">{item.name}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-muted-foreground">₹{item.price}</p>
                                                <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-700 rounded">
                                                    No Sales
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Peak Hour Heatmap */}
                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4">Peak Hour Analysis</h2>
                    <Card className="p-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            Busiest hours: <span className="font-semibold text-foreground">{peakHours || "No data yet"}</span>
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={peakHourChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="orders" radius={[8, 8, 0, 0]}>
                                    {peakHourChartData.map((entry, index) => {
                                        const intensity = maxOrders > 0 ? entry.orders / maxOrders : 0;
                                        const color = intensity > 0.7 ? "#dc2626" : intensity > 0.4 ? "#f59e0b" : "#3b82f6";
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </section>

                {/* Customer Intelligence */}
                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4">Recent Orders & Customer Intelligence</h2>
                    <Card className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-2 font-semibold text-sm">Order ID</th>
                                        <th className="text-left py-3 px-2 font-semibold text-sm">Customer</th>
                                        <th className="text-left py-3 px-2 font-semibold text-sm">Phone</th>
                                        <th className="text-left py-3 px-2 font-semibold text-sm">Total</th>
                                        <th className="text-left py-3 px-2 font-semibold text-sm">Time</th>
                                        <th className="text-left py-3 px-2 font-semibold text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrdersWithBadges.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No orders yet. Seed some dummy data to get started!
                                            </td>
                                        </tr>
                                    ) : (
                                        recentOrdersWithBadges.map((order) => (
                                            <tr key={order.orderId} className="border-b hover:bg-secondary/30">
                                                <td className="py-3 px-2">
                                                    <span className="font-mono text-sm font-semibold">{order.orderId}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{order.customerName}</span>
                                                        {order.badge && (
                                                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${order.badgeColor}`}>
                                                                {order.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-sm text-muted-foreground">{order.customerPhone}</td>
                                                <td className="py-3 px-2 font-semibold text-sm">₹{order.finalPrice}</td>
                                                <td className="py-3 px-2 text-sm text-muted-foreground">
                                                    {new Date(order.timestamp).toLocaleString('en-IN', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                                        {order.paymentMethod}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>

                {/* Back to Home */}
                <div className="flex justify-center pt-4">
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
