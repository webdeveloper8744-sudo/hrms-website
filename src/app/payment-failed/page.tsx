// ============================================
// FILE 2: D:\HRMS\website\src\app\payment-failed\page.tsx
// CREATE THIS NEW FILE
// ============================================

'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTimesCircle,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

interface PaymentInfo {
  planName: string;
  amount: number;
  years: number;
  employees: string;
  subscriptionId?: number;
}

export default function PaymentFailedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("auth_user");
    const p = localStorage.getItem("last_payment");

    if (u) setUser(JSON.parse(u));
    
    if (p) {
      setPayment(JSON.parse(p));
    } else {
      // If no payment data, redirect to pricing
      router.push("/pricing");
    }

    setLoading(false);
  }, [router]);

  const handleRetryPayment = () => {
    router.push("/pricing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formattedAmount = payment?.amount ? (
    typeof payment.amount === 'number' 
      ? `₹${payment.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
      : `₹${payment.amount}`
  ) : "₹0.00";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* FAILURE ICON */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-4xl mb-6">
            <FaTimesCircle />
          </div>
          <h1 className="text-4xl font-bold mb-2">Payment Failed</h1>
          <p className="text-gray-400 text-lg">
            Something went wrong with your payment. Please try again.
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-gradient-to-br from-red-900/20 to-slate-950 border border-red-800/50 rounded-2xl p-8 mb-8">
          {/* HEADER WITH BADGE */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <span className="px-4 py-2 rounded-full font-semibold text-sm bg-red-500/20 text-red-300">
              ✗ Failed
            </span>
          </div>

          {/* PAYMENT INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Info icon={<FaUser />} label="Account" value={user?.name || "—"} />
            <Info icon={<FaEnvelope />} label="Email" value={user?.email || "—"} />

            <Info
              icon={<FaBoxOpen />}
              label="Plan"
              value={payment?.planName || "—"}
            />

            <Info
              icon={<FaMoneyBillWave />}
              label="Attempted Amount"
              value={formattedAmount}
            />

            <Info
              icon={<FaCalendarAlt />}
              label="Duration"
              value={`${payment?.years || 0} Year${(payment?.years || 0) > 1 ? "s" : ""}`}
            />

            <Info
              icon={<FaCalendarAlt />}
              label="Employees"
              value={payment?.employees || "—"}
            />
          </div>
        </div>

        {/* ERROR MESSAGE */}
        <div className="bg-yellow-500/10 border border-yellow-600/50 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <FaExclamationTriangle className="text-yellow-400 text-2xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-200 mb-2">
              Payment Could Not Be Processed
            </h3>
            <p className="text-yellow-100 text-sm mb-3">
              Your payment was unsuccessful. You have not been charged.
            </p>
            <p className="text-yellow-100 text-sm mb-3">
              Common reasons for payment failures:
            </p>
            <ul className="text-yellow-100 text-sm space-y-2 ml-4">
              <li>• Insufficient funds in your account</li>
              <li>• Invalid card details or expired card</li>
              <li>• Transaction declined by your bank</li>
              <li>• Network connectivity issues</li>
            </ul>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetryPayment}
            className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition text-white"
          >
            Retry Payment
            <FaArrowRight />
          </button>

          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-3 border border-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-900 transition text-white"
          >
            Back to Profile
          </Link>
        </div>

        {/* SUPPORT INFO */}
        <div className="mt-12 p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 text-center">
          <p className="text-gray-300 mb-2">Still having issues?</p>
          <p className="text-gray-400 text-sm">
            Contact our support team at{" "}
            <a
              href="mailto:support@hrsync.io"
              className="text-blue-400 hover:text-blue-300"
            >
              support@hrsync.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* INFO BLOCK */
function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-gray-100 mt-1">{value || "—"}</p>
      </div>
    </div>
  );
}