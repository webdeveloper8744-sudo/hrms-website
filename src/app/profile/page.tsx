'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBuilding,
  FaEnvelope,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaShieldAlt,
  FaBolt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

interface User {
  name: string;
  email: string;
}

interface Subscription {
  planName: string;
  amount: number;
  years: number;
  employees: string;
  subscriptionId?: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const lastPayment = localStorage.getItem("last_payment");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (lastPayment) {
      setSubscription(JSON.parse(lastPayment));
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-28">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSubscribed = subscription && subscription.planName;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Overview
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your HRMS platform, subscription and workforce tools
          </p>
        </div>

        {/* COMPANY CARD */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* COMPANY INFO */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl">
                <FaBuilding />
              </div>
              <div>
                <p className="text-sm text-gray-400">Company</p>
                <h2 className="text-2xl font-bold">
                  {user?.name || "Your Company"}
                </h2>
                <div className="flex items-center gap-2 text-gray-400 mt-1 text-sm">
                  <FaEnvelope />
                  {user?.email || "company@email.com"}
                </div>
              </div>
            </div>

            {/* SUBSCRIPTION SECTION */}
            {isSubscribed ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full md:w-auto">
                <h3 className="text-xl font-semibold mb-4">Active Subscription</h3>

                <div className="space-y-4">
                  {/* PLAN INFO */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">Plan</p>
                      <p className="text-lg font-bold">
                        {subscription.planName}
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-semibold text-sm">
                      Active
                    </span>
                  </div>

                  {/* BILLING INFO */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <p className="text-gray-400 text-sm">Duration</p>
                      <p className="font-bold">
                        {subscription.years} Year{subscription.years > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount Paid</p>
                      <p className="font-bold">
                        ₹{subscription.amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* EMPLOYEES */}
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-gray-400 text-sm">Employees Covered</p>
                    <p className="font-bold">{subscription.employees}</p>
                  </div>

                  {/* SUBSCRIPTION ID */}
                  {subscription.subscriptionId && (
                    <div className="bg-slate-800/40 rounded-lg p-3 mt-4 text-xs border border-slate-700/50">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subscription ID:</span>
                        <span className="text-gray-300 font-mono">{subscription.subscriptionId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // NO SUBSCRIPTION YET
              <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full md:w-auto">
                <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
                <p className="text-gray-400 text-sm">
                  You don't have an active subscription yet.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* PLAN CTA */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-slate-800 rounded-2xl p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h4 className="text-2xl font-bold">
                Activate your HRMS dashboard
              </h4>
              <p className="text-blue-100 mt-2 max-w-xl">
                Select a pricing plan to start managing employees, attendance,
                payroll and performance from one powerful platform.
              </p>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-blue-100">
                <Benefit text="Easy attendance tracking" />
                <Benefit text="Payroll automation" />
                <Benefit text="Leave management" />
                <Benefit text="24/7 support" />
              </div>
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition whitespace-nowrap"
            >
              View Pricing Plans
              <FaArrowRight />
            </Link>
          </div>
        )}

        {/* HRMS FEATURES */}
        <div className="mb-0">
          <h3 className="text-xl font-semibold mb-6">
            What you get with HRSync
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<FaUsers />}
              title="Employee Management"
              desc="Centralized employee records, departments and lifecycle tracking."
            />
            <Feature
              icon={<FaCalendarAlt />}
              title="Attendance & Leave"
              desc="Live attendance, leave policies and shift management."
            />
            <Feature
              icon={<FaMoneyBillWave />}
              title="Payroll Automation"
              desc="Salary processing, payslips and statutory compliance."
            />
            <Feature
              icon={<FaChartLine />}
              title="Performance Insights"
              desc="KPI based reviews, goals and performance tracking."
            />
            <Feature
              icon={<FaShieldAlt />}
              title="Enterprise Security"
              desc="Role-based access, audit logs and secure authentication."
            />
            <Feature
              icon={<FaBolt />}
              title="Automation & Workflows"
              desc="HR workflows to reduce manual work and errors."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* FEATURE CARD */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition">
      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl mb-4">
        {icon}
      </div>
      <h5 className="text-lg font-semibold mb-2">{title}</h5>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* BENEFIT BADGE */
function Benefit({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <FaCheckCircle className="text-green-300" />
      {text}
    </span>
  );
}