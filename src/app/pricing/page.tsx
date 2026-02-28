'use client';

import React, { useEffect, useState } from 'react';
import { FiCheck, FiArrowRight, FiX } from 'react-icons/fi';
import { useRouter } from "next/navigation";

/* =============== TYPES =============== */

interface Plan {
  id: number;
  name: string;
  monthlyPrice: number;
  minEmployees: number;
  maxEmployees: number;
  features: string[];
  yearlyDiscount: Record<string, number>;
}

/* =============== FALLBACK PLANS =============== */

const FALLBACK_PLANS: Plan[] = [
  {
    id: 1,
    name: "Starter",
    monthlyPrice: 499,
    minEmployees: 1,
    maxEmployees: 10,
    features: [
      "Attendance",
      "Leave Management",
      "Employee Records"
    ],
    yearlyDiscount: { "1": 5, "2": 8, "3": 10, "4": 12, "5": 15 }
  },
  {
    id: 2,
    name: "Growth",
    monthlyPrice: 999,
    minEmployees: 20,
    maxEmployees: 50,
    features: [
      "Attendance",
      "Payroll",
      "Leave",
      "Reports"
    ],
    yearlyDiscount: { "1": 6, "2": 10, "3": 12, "4": 15, "5": 18 }
  },
  {
    id: 3,
    name: "Pro",
    monthlyPrice: 1899,
    minEmployees: 50,
    maxEmployees: 100,
    features: [
      "Attendance",
      "Payroll",
      "Compliance",
      "Analytics",
      "API Access"
    ],
    yearlyDiscount: { "1": 8, "2": 12, "3": 15, "4": 18, "5": 20 }
  }
];



/* =============== RAZORPAY LOADER =============== */

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* =============== MAIN COMPONENT =============== */

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FETCH PLANS FROM API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiBase) {
          console.warn("API_BASE_URL not set, using fallback");
          setPlans(FALLBACK_PLANS);
          setLoadingPlans(false);
          return;
        }

        const res = await fetch(`${apiBase}/api/billing/plans`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch plans");
        }

        const data = await res.json();
        setPlans(data && Array.isArray(data) && data.length > 0 ? data : FALLBACK_PLANS);
      } catch (err) {
        console.warn("Using fallback plans:", err);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // ✅ HANDLE PROCEED TO PAY
  const handleProceedToPay = async ({
    plan,
    years,
    finalAmount,
    coupon
  }: {
    plan: Plan;
    years: number;
    finalAmount: number;
    coupon?: string;
  }) => {
    const token = localStorage.getItem("auth_token");
    const userRaw = localStorage.getItem("auth_user");

    if (!token || !userRaw) {
      router.push("/login?redirect=pricing");
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      setProcessing(true);
      setError(null);

      // ✅ LOAD RAZORPAY
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        setError("Failed to load Razorpay. Please refresh and try again.");
        setProcessing(false);
        return;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBase) {
        setError("API configuration missing");
        setProcessing(false);
        return;
      }

      // 1️⃣ CREATE ORDER
      const orderRes = await fetch(
        `${apiBase}/api/billing/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            planId: plan.id,
            years: Number(years),
            coupon: coupon || null,
            userId: user.id
          })
        }
      );

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.message || "Failed to create order");
      }

      const orderData = await orderRes.json();

      // 2️⃣ INITIALIZE RAZORPAY
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, // Already in paise from backend
        currency: "INR",
        name: "HRSync",
        description: `${plan.name} Plan - ${years} Year${years > 1 ? "s" : ""}`,
        order_id: orderData.orderId,

        handler: async (response: any) => {
          try {
            // 3️⃣ VERIFY PAYMENT
            const verifyRes = await fetch(
              `${apiBase}/api/billing/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  subscriptionId: orderData.subscriptionId,
                  userId: user.id,
                  coupon: coupon || null
                })
              }
            );

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.message || "Payment verification failed");
            }

            const verifyData = await verifyRes.json();

            // 4️⃣ SAVE SUCCESS INFO
            localStorage.setItem(
              "last_payment",
              JSON.stringify({
                planName: plan.name,
                amount: finalAmount,
                years,
                employees: `${plan.minEmployees}-${plan.maxEmployees}`,
                subscriptionId: verifyData.subscriptionId
              })
            );

            setProcessing(false);
            router.push("/payment-success");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verification failed");
            setProcessing(false);
          }
        },

        prefill: {
          name: user.name || "User",
          email: user.email || ""
        },

        theme: { color: "#2563eb" },

        modal: {
          ondismiss: () => {
            setProcessing(false);
          }
        }
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProcessing(false);
    }
  };

  // ✅ HANDLE BUY NOW
  const handleBuyNow = (plan: Plan) => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");

    if (!token || !user) {
      router.push("/login?redirect=pricing");
      return;
    }

    setSelectedPlan(plan);
  };

  // ✅ LOADING STATE
  if (loadingPlans) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ MAIN UI
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-20">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the perfect plan for your HR needs
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="hover:text-red-100">
              <FiX />
            </button>
          </div>
        )}

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors"
            >
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 mb-6">
                {plan.minEmployees}–{plan.maxEmployees} Employees
              </p>

              <p className="text-3xl font-bold mb-6">
                ₹{plan.monthlyPrice}
                <span className="text-sm text-gray-400"> / month</span>
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm items-start">
                    <FiCheck className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyNow(plan)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg flex justify-center gap-2 font-semibold transition-colors"
              >
                Buy Now <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedPlan && (
        <PricingModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onPay={({ years, finalAmount, coupon }) =>
            handleProceedToPay({
              plan: selectedPlan,
              years,
              finalAmount,
              coupon
            })
          }
        />
      )}

      {/* PROCESSING OVERLAY */}
      {processing && <PaymentProcessingOverlay />}
    </div>
  );
}

/* =============== PRICING MODAL =============== */

function PricingModal({
  plan,
  onClose,
  onPay
}: {
  plan: Plan;
  onClose: () => void;
  onPay: (data: {
    years: number;
    finalAmount: number;
    coupon?: string;
  }) => void;
}) {
  const [years, setYears] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // ✅ PRICE CALCULATION LOGIC
  const baseAmount = plan.monthlyPrice * 12 * years;

  // Get yearly discount from the plan (key as string)
  const yearlyDiscountPercent = plan.yearlyDiscount?.[String(years)] || 0;
  const yearlyDiscountAmount = (baseAmount * yearlyDiscountPercent) / 100;

  const couponDiscountAmount =
    coupon === "HRSYNC" && couponApplied
      ? (baseAmount - yearlyDiscountAmount) * 0.1
      : 0;

  const finalAmount = baseAmount - yearlyDiscountAmount - couponDiscountAmount;

  const handleApplyCoupon = () => {
    if (coupon === "HRSYNC") {
      setCouponApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 w-full max-w-xl border border-slate-700 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          <FiX />
        </button>

        {/* HEADER */}
        <h2 className="text-3xl font-bold mb-1">{plan.name} Plan</h2>
        <p className="text-sm text-gray-400 mb-6">
          {plan.minEmployees} – {plan.maxEmployees} Employees
        </p>

        {/* PLAN INFO */}
        <div className="bg-slate-800/60 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Monthly Price</span>
            <span className="font-semibold">₹{plan.monthlyPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Billing Type</span>
            <span className="font-semibold">Prepaid (Annual)</span>
          </div>
        </div>

        {/* YEAR SELECTION */}
        <label className="block text-sm font-semibold mb-2">
          Select Subscription Duration
        </label>
        <select
          value={years}
          onChange={(e) => {
            setYears(Number(e.target.value));
            setCouponApplied(false); // Reset coupon on year change
          }}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg mb-6 text-white focus:outline-none focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5].map((y) => (
            <option key={y} value={y} className="bg-slate-900">
              {y} Year{y > 1 ? "s" : ""}
              {plan.yearlyDiscount?.[String(y)]
                ? ` – ${plan.yearlyDiscount[String(y)]}% OFF`
                : ""}
            </option>
          ))}
        </select>

        {/* COUPON INPUT */}
        <div className="flex gap-2 mb-6">
          <input
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value.toUpperCase());
              setCouponApplied(false);
            }}
            placeholder="Enter coupon code"
            className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={coupon !== "HRSYNC"}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Apply
          </button>
        </div>

        {coupon === "HRSYNC" && !couponApplied && (
          <p className="text-sm text-yellow-400 mb-4">
            ✓ Coupon valid! Click Apply to get 10% additional discount
          </p>
        )}

        {couponApplied && coupon === "HRSYNC" && (
          <p className="text-sm text-green-400 mb-4">
            ✓ Coupon applied! 10% discount added
          </p>
        )}

        {/* PRICE BREAKDOWN */}
        <div className="space-y-2 text-sm text-gray-300 mb-6">
          <div className="flex justify-between">
            <span>Base Amount ({years} year{years > 1 ? "s" : ""})</span>
            <span>₹{baseAmount.toFixed(2)}</span>
          </div>

          {yearlyDiscountAmount > 0 && (
            <div className="flex justify-between">
              <span>Plan Discount ({yearlyDiscountPercent}%)</span>
              <span className="text-green-400">
                − ₹{yearlyDiscountAmount.toFixed(2)}
              </span>
            </div>
          )}

          {couponDiscountAmount > 0 && (
            <div className="flex justify-between">
              <span>Coupon Discount (10%)</span>
              <span className="text-green-400">
                − ₹{couponDiscountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="border-t border-slate-700 pt-3 flex justify-between text-lg font-bold text-white">
            <span>Total Payable</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={() =>
            onPay({
              years,
              finalAmount: Math.round(finalAmount * 100) / 100,
              coupon: couponApplied ? coupon : undefined
            })
          }
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold text-lg"
        >
          Proceed to Pay ₹{finalAmount.toFixed(2)}
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}

/* =============== PAYMENT PROCESSING OVERLAY =============== */

function PaymentProcessingOverlay() {
  return (
    <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white font-semibold">Processing payment...</p>
      </div>
    </div>
  );
}