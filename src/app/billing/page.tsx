"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BillingPage() {
  const startPayment = async () => {
    // 1️⃣ CREATE ORDER (backend)
    const orderRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/billing/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 499 }),
      }
    );

    const order = await orderRes.json();

    // 2️⃣ RAZORPAY CHECKOUT
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "HRMS SaaS",
      description: "Pro Subscription",
      order_id: order.id,

      handler: async function (response: any) {
        console.log("Razorpay Success:", response);

        // 3️⃣ VERIFY PAYMENT (MOST CRITICAL)
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/billing/verify-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: 1,
              userId: 1,
            }),
          }
        );

        const result = await verifyRes.json();
        alert(result.message);
      },

      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={startPayment}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Pay ₹499
      </button>
    </div>
  );
}
