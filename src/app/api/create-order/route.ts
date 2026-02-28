import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: 50000, // ₹500 in paise
      currency: "INR",
      receipt: "receipt_001",
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}