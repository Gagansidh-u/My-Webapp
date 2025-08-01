"use server";

import Razorpay from "razorpay";
import { z } from "zod";

const schema = z.object({
    amount: z.number().positive(),
});

export async function createOrder(data: { amount: number }) {
    try {
        const validation = schema.safeParse(data);
        if (!validation.success) {
            return { error: "Invalid amount" };
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: validation.data.amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };
        
        const order = await razorpay.orders.create(options);
        
        if (!order) {
            return { error: "Failed to create order" };
        }

        return { order };

    } catch (err) {
        console.error(err);
        return { error: "An unexpected error occurred." };
    }
}
