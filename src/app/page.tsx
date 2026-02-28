'use client';

import React, { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaChartBar,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaLock,
  FaBolt,
  FaGlobe,
  FaArrowRight,
  FaCheck,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaMobile,
  FaHeadset,
  FaCheckCircle,
} from 'react-icons/fa';
import type { FC, SVGProps, ReactNode } from 'react';

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
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  color: string;
  initials: string;
}

export default function HRMSLanding(): ReactNode {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const testimonials: Testimonial[] = [
    {
      quote: 'HRSync has completely transformed how we manage our HR operations. The interface is intuitive and the support team is fantastic.',
      author: 'Rajesh Kumar',
      role: 'HR Manager, Tech Corp',
      color: 'bg-blue-200',
      initials: 'RK'
    },
    {
      quote: 'The attendance tracking feature alone has saved us countless hours. Automation at its finest. Highly recommended!',
      author: 'Priya Sharma',
      role: 'Director, Finance Solutions',
      color: 'bg-green-200',
      initials: 'PS'
    },
    {
      quote: 'Best HR software we\'ve used. The analytics dashboard gives us insights we never had before. Exceptional product!',
      author: 'Amit Patel',
      role: 'CEO, Global Industries',
      color: 'bg-purple-200',
      initials: 'AP'
    }
  ];

  const plans: Plan[] = [
    {
      name: 'Starter',
      description: 'For small teams',
      price: 4999,
      period: 'month',
      features: ['Upto 50 employees', 'Attendance tracking', 'Leave management', 'Basic reports'],
      highlighted: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      description: 'For growing teams',
      price: 12999,
      period: 'month',
      features: ['Upto 500 employees', 'All Starter features', 'Payroll management', 'Performance reviews', 'Advanced analytics'],
      highlighted: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: 0,
      period: 'custom',
      features: ['Unlimited employees', 'All features included', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
      highlighted: false,
      cta: 'Contact Sales'
    }
  ];

  const features: Feature[] = [
    {
      icon: FaClock,
      title: 'Attendance Tracking',
      description: 'Real-time attendance monitoring with biometric and mobile check-in'
    },
    {
      icon: FaChartBar,
      title: 'HR Analytics',
      description: 'Data-driven insights to optimize your HR operations'
    },
    {
      icon: FaUsers,
      title: 'Employee Management',
      description: 'Centralized employee database with complete history tracking'
    },
    {
      icon: FaCalendarAlt,
      title: 'Leave Management',
      description: 'Streamline leave requests, approvals, and compliance tracking'
    },
    {
      icon: FaBolt,
      title: 'Payroll Integration',
      description: 'Automated payroll processing with tax compliance'
    },
    {
      icon: FaArrowUp,
      title: 'Performance Reviews',
      description: 'Structured performance management with goal tracking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                <span>Manage Your Workforce Efficiently</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-5xl font-bold text-white leading-tight">
                Control your HR operations effortlessly
              </h1>

              <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl">
                Streamline your HR operations with attendance tracking, payroll, employee engagement, and performance management. All in one powerful platform designed for modern businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition font-semibold flex items-center justify-center gap-2 w-full sm:w-auto">
                  Open Account
                  <FaArrowRight className="w-4 h-4" />
                </button>
                <button className="border-2 border-slate-700 text-white px-8 py-3.5 rounded-full hover:border-slate-600 hover:bg-slate-800/50 transition font-semibold w-full sm:w-auto">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-950 flex items-center justify-center text-white text-sm font-bold">
                      {String(i)}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">50,000+</span> companies trust us
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:block relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-1 shadow-2xl">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6">
                  <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">9:41</span>
                      <FaMobile className="text-gray-400 text-3xl" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">Hello, Alex</p>
                      <div>
                        <p className="text-gray-500 text-xs">Total Employees</p>
                        <p className="text-white text-3xl font-bold">542</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 pt-4">
                      {['Attendance', 'Leave', 'Payroll', 'Reports'].map((item) => (
                        <div key={item} className="bg-slate-800 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-xs">{item}</p>
                          <p className="text-white font-bold text-lg mt-1">{Math.floor(Math.random() * 100)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 space-y-2 border-t border-slate-700">
                      <p className="text-gray-300 text-sm font-semibold">Recent Activity</p>
                      {['Raj Patel - Checked In', 'Leave Approved', 'Payroll Processed'].map((activity) => (
                        <p key={activity} className="text-gray-400 text-xs">{activity}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-4 w-56">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                    <FaArrowUp className="text-green-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs">Productivity Rate</p>
                    <p className="text-white text-xl font-bold">94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Powerful Features for Modern HR
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your workforce efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="text-blue-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Companies Worldwide
            </h2>
            <p className="text-lg text-gray-400">
              See what HR professionals say about HRSync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center font-bold text-slate-900`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-400">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl p-8 transition-all duration-300 ${plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border-2 border-blue-500/50 shadow-xl shadow-blue-500/20 md:scale-105'
                  : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/50'
                  }`}
              >
                {plan.highlighted && (
                  <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className={`${plan.highlighted ? 'text-blue-200' : 'text-gray-400'} mb-6`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price === 0 ? 'Custom' : `₹${plan.price.toLocaleString('en-IN')}`}
                  </span>
                  {plan.price !== 0 && (
                    <span className={`${plan.highlighted ? 'text-blue-200' : 'text-gray-400'} ml-2`}>
                      /month
                    </span>
                  )}
                </div>
                <button className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${plan.highlighted
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-slate-700/50 text-white hover:bg-slate-600 border border-slate-600'
                  }`}>
                  {plan.cta}
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FaCheck className={plan.highlighted ? 'text-blue-300' : 'text-green-400'} />
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of companies using HRSync to streamline their HR processes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition font-semibold">
              Start Your 14-Day Free Trial
            </button>
            <button className="border-2 border-slate-600 text-white px-8 py-3.5 rounded-full hover:border-slate-500 hover:bg-slate-800/50 transition font-semibold">
              Schedule Demo
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            No credit card required • Full access to all features • 24/7 support
          </p>
        </div>
      </section>
    </div>
  );
}