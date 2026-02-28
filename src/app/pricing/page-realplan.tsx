'use client';

import React, { useState } from 'react';
import {
  FiCheck,
  FiChevronDown,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiShield,
  FiFileText,
  FiAlertCircle,
  FiZap,
  FiTrendingUp,
  FiPhone,
  FiMail,
  FiArrowRight
} from 'react-icons/fi';
import type { FC, SVGProps } from 'react';

type BillingCycle = 'monthly' | 'yearly';
type IconType = FC<SVGProps<SVGSVGElement>>;

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

interface Plan {
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  savings?: string;
}

interface FAQ {
  q: string;
  a: string;
}

export default function PricingPage(): React.ReactElement {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const plans: Record<BillingCycle, Plan[]> = {
    monthly: [
      {
        name: 'Starter',
        description: 'Perfect for small teams just getting started',
        price: 999,
        period: 'month',
        features: [
          'Up to 50 Employees',
          'Basic Attendance Tracking',
          'Employee Database',
          'Leave Management (5 types)',
          'Email Support',
          'Monthly Reports',
          'Dashboard Analytics'
        ],
        highlighted: false,
        cta: 'Get Started'
      },
      {
        name: 'Professional',
        description: 'Ideal for growing businesses with advanced needs',
        price: 1899,
        period: 'month',
        features: [
          'Up to 500 Employees',
          'Advanced Biometric Integration',
          'Attendance & Shift Management',
          'Complete Leave Management (20+ types)',
          'Payroll Processing',
          'Priority Email & Phone Support',
          'Real-time Analytics Dashboard',
          'Mobile App Access',
          'Custom Reports',
          'Holiday & Weekoff Management'
        ],
        highlighted: true,
        cta: 'Buy Now'
      },
      {
        name: 'Enterprise',
        description: 'Comprehensive solution for large organizations',
        price: 2999,
        period: 'month',
        features: [
          'Unlimited Employees',
          'Multi-branch Management',
          'Advanced Biometric & GPS Tracking',
          'Full Payroll & Compliance',
          'Complete Leave Management System',
          '24/7 Dedicated Support',
          'Advanced Analytics & Intelligence',
          'Mobile App + Web Portal',
          'Custom Development',
          'Single Sign-On (SSO)',
          'API Integration',
          'Compliance Reports (Govt.)'
        ],
        highlighted: false,
        cta: 'Buy Now'
      }
    ],
    yearly: [
      {
        name: 'Starter',
        description: 'Perfect for small teams just getting started',
        price: 3999,
        period: 'year',
        features: [
          'Up to 50 Employees',
          'Basic Attendance Tracking',
          'Employee Database',
          'Leave Management (5 types)',
          'Email Support',
          'Monthly Reports',
          'Dashboard Analytics'
        ],
        highlighted: false,
        cta: 'Get Started',
        savings: '8%'
      },
      {
        name: 'Professional',
        description: 'Ideal for growing businesses with advanced needs',
        price: 6999,
        period: 'year',
        features: [
          'Up to 500 Employees',
          'Advanced Biometric Integration',
          'Attendance & Shift Management',
          'Complete Leave Management (20+ types)',
          'Payroll Processing',
          'Priority Email & Phone Support',
          'Real-time Analytics Dashboard',
          'Mobile App Access',
          'Custom Reports',
          'Holiday & Weekoff Management'
        ],
        highlighted: true,
        cta: 'Buy Now',
        savings: '9%'
      },
      {
        name: 'Enterprise',
        description: 'Comprehensive solution for large organizations',
        price: 8999,
        period: 'year',
        features: [
          'Unlimited Employees',
          'Multi-branch Management',
          'Advanced Biometric & GPS Tracking',
          'Full Payroll & Compliance',
          'Complete Leave Management System',
          '24/7 Dedicated Support',
          'Advanced Analytics & Intelligence',
          'Mobile App + Web Portal',
          'Custom Development',
          'Single Sign-On (SSO)',
          'API Integration',
          'Compliance Reports (Govt.)'
        ],
        highlighted: false,
        cta: 'Buy Now',
        savings: '9%'
      }
    ]
  };

  const currentPlans = plans[billingCycle];

  const handleBillingCycleChange = (cycle: BillingCycle): void => {
    setBillingCycle(cycle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-10 lg:pt-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Transparent HRMS <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Streamline your HR operations with our comprehensive attendance and payroll management system
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-">
            <div className="inline-flex bg-slate-800/50 backdrop-blur-sm rounded-full p-1.5 border border-slate-700/50">
              <button
                onClick={() => handleBillingCycleChange('monthly')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-gray-300'
                  }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => handleBillingCycleChange('yearly')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-gray-300'
                  }`}
              >
                Yearly Billing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {currentPlans.map((plan: Plan, index: number) => (
              <div
                key={index}
                className={`relative rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 ${plan.highlighted
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ring-2 ring-blue-500/50 md:scale-105 shadow-2xl shadow-blue-500/20 border border-blue-500/30'
                    : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/50 shadow-lg'
                  }`}
              >
                {/* Savings Badge */}
                {plan.savings && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
                      SAVE {plan.savings}
                    </div>
                  </div>
                )}

                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Plan Name */}
                  <div className="mb-8">
                    <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-100'
                      }`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className={`text-2xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-200'
                        }`}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-sm font-medium ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        per {plan.period}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className={`text-xs ${plan.highlighted ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                        ₹{Math.round(plan.price / 12).toLocaleString('en-IN')} per month
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 mb-8 flex items-center justify-center gap-2 group ${plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg'
                      : 'bg-slate-700/50 text-white hover:bg-slate-600 border border-slate-600'
                    }`}>
                    {plan.cta}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Features */}
                  <div className="space-y-4 mb-0">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                      What's Included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <FiCheck className={`flex-shrink-0 mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-blue-400'
                            }`} />
                          <span className={`text-sm ${plan.highlighted ? 'text-blue-50' : 'text-gray-300'
                            }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}