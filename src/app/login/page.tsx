'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import {
  FaGoogle,
  FaFacebook,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserTie,
  FaChartLine,
  FaUsers
} from 'react-icons/fa';
import type { FC, SVGProps } from 'react';
import { registerUser } from "@/lib/api";

import { loginUser } from "@/lib/login";
import { saveAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

type IconType = FC<SVGProps<SVGSVGElement>>;

interface Feature {
  title: string;
  description: string;
  icon: IconType;
}

interface FormErrors {
  [key: string]: string;
}

interface FormData {
  companyName: string;
  email: string;
  password: string;
  phone: string;
  rememberMe: boolean;
}

const AuthPage: FC = (): ReactNode => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    password: '',
    phone: '',
    rememberMe: false
  });
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const features: Feature[] = [
    {
      title: "Streamline HR Operations",
      description: "Manage your entire workforce with powerful tools for recruitment, onboarding, and performance tracking.",
      icon: FaUserTie
    },
    {
      title: "Data-Driven Insights",
      description: "Make informed decisions with comprehensive analytics and real-time reporting on team performance.",
      icon: FaChartLine
    },
    {
      title: "Build Better Teams",
      description: "Foster collaboration and engagement with integrated communication tools and development programs.",
      icon: FaUsers
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [features.length]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    let finalValue: string | boolean = newValue;
    if (name === 'phone' && typeof newValue === 'string') {
      finalValue = newValue.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isSignIn) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      } else if (formData.companyName.trim().length < 2) {
        newErrors.companyName = 'Company name must be at least 2 characters';
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Enter a valid 10-digit Indian phone number';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isSignIn && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //handle register or login 

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      // 🔹 REGISTER
      if (!isSignIn) {
        const payload = {
          name: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        };

        await registerUser(payload);

        alert("✅ Registration successful. Please login.");
        setIsSignIn(true);
        return;
      }

      // 🔹 LOGIN
      const loginPayload = {
        email: formData.email,
        password: formData.password
      };

      const response = await loginUser(loginPayload);

      // Save token + user
      saveAuth(response.token, response.user);
      
      // successful login
      window.dispatchEvent(new Event("auth-changed"));


      alert("✅ Login successful");

      console.log("LOGIN RESPONSE:", response);

      // Redirect (example dashboard)
      router.push("/");

    } catch (error: any) {
      setErrors({
        email: error.message
      });
    }
  };



  const toggleMode = (): void => {
    setIsSignIn(!isSignIn);
    setFormData({ companyName: '', email: '', password: '', phone: '', rememberMe: false });
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 rounded-5">
      <div className="h-full flex flex-col lg:flex-row pt-15  overflow-hidden max-w-full mx-auto gap-0 rounded-5">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 overflow-y-auto px-4 sm:px-6 lg:px-0 rounded-5">
          <div className="min-h-full flex flex-col justify-center py-8">
            <div className="max-w-md mx-auto w-full">

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-2">
                {isSignIn ? 'Welcome back' : 'Get started'}
              </h1>

              <p className="text-gray-400 mb-8 text-sm">
                {isSignIn ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={toggleMode}
                      className="text-blue-400 hover:text-blue-300 transition font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={toggleMode}
                      className="text-blue-400 hover:text-blue-300 transition font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>

              {/* Form Fields */}
              <div className="space-y-4">
                {!isSignIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border ${errors.companyName ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm text-white placeholder-gray-500`}
                      />
                    </div>
                    {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@company.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm text-white placeholder-gray-500`}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {!isSignIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                        +91
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full pl-20 pr-4 py-2.5 bg-slate-800/50 border ${errors.phone ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm text-white placeholder-gray-500`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    {!errors.phone && formData.phone && (
                      <p className="text-gray-500 text-xs mt-1">
                        {formData.phone.length}/10 digits
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-2.5 bg-slate-800/50 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm text-white placeholder-gray-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  {!isSignIn && !errors.password && (
                    <p className="text-gray-500 text-xs mt-1">
                      Min. 8 characters
                    </p>
                  )}
                </div>

                {isSignIn && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 bg-slate-800 border-slate-700 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-400">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                      Forgot Password?
                    </a>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg text-base"
                >
                  {isSignIn ? 'Sign in' : 'Create Account'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-gradient-to-br from-slate-900 to-slate-950 text-gray-500">OR CONTINUE WITH</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition"
                  >
                    <FaGoogle className="text-red-400" size={18} />
                    <span className="text-gray-300 font-medium text-sm">Google</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition"
                  >
                    <FaFacebook className="text-blue-400" size={18} />
                    <span className="text-gray-300 font-medium text-sm">Facebook</span>
                  </button>
                </div>

                {!isSignIn && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By signing up, you agree to our{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition">Privacy Policy</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative overflow-hidden"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 w-full h-full">

            {/* Feature Card */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-2xl border border-slate-700/50 transform transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-lg flex-shrink-0">
                  {React.createElement(features[currentSlide].icon, {
                    className: "text-blue-400",
                    width: 28,
                    height: 28
                  })}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {features[currentSlide].title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {features[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="relative rounded-lg overflow-hidden h-44">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80"
                  alt="HR Platform"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">10,000+</p>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm font-medium">
                  Learn more
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="text-white mt-5">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Transform Your Workplace
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Empower your HR team with cutting-edge tools for talent management, employee engagement, and data-driven decision making.
              </p>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {features.map((_: Feature, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${currentSlide === index ? 'w-8 bg-blue-400' : 'w-2 bg-white/30'
                      }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;