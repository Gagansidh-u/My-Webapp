
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, MessageSquare, Users, BarChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

const chartData = [
  { month: "January", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "February", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "March", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "April", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "June", total: Math.floor(Math.random() * 5000) + 1000 },
]

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ orders: 0, inquiries: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const ordersSnap = await getCountFromServer(collection(db, "orders"));
                const inquiriesSnap = await getCountFromServer(collection(db, "contacts"));
                const usersSnap = await getCountFromServer(collection(db, "users"));
                setStats({
                    orders: ordersSnap.data().count,
                    inquiries: inquiriesSnap.data().count,
                    users: usersSnap.data().count,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
          <div className="flex h-full items-center justify-center">
            <Loader size={64} />
          </div>
        );
    }
    
    return (
        <div className="space-y-8">
             <div className="text-left">
                <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orders}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inquiries}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                    </CardContent>
                </Card>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart /> Revenue Overview</CardTitle>
                    <CardDescription>A summary of revenue over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <RechartsBarChart accessibilityLayer data={chartData}>
                        <XAxis
                          dataKey="month"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₹${value / 1000}K`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                      </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
