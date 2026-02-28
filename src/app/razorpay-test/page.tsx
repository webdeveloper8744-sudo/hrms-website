"use client";

import { useState } from "react";

export default function RazorpayTest() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const res = await fetch("/api/create-order", {
      method: "POST",
    });

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Test Company",
      description: "Test Transaction",
      order_id: data.id,
      handler: function (response: any) {
        alert("Payment Successful!");
        console.log(response);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const Razorpay = (window as any).Razorpay;
    const rzp = new Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Razorpay Test Payment</h1>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay ₹500"}
      </button>
    </div>
  );
}
