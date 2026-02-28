'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
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
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaChevronDown,
} from 'react-icons/fa';
import { usePathname } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export default function Header(): ReactNode {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Mock user data - replace with actual user data from your auth system
    const [user, setUser] = useState<User | null>(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const syncAuth = () => {
            const token = localStorage.getItem("auth_token");
            const storedUser = localStorage.getItem("auth_user");

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        };

        // 1️⃣ Initial run
        syncAuth();

        // 2️⃣ Listen to custom auth event
        window.addEventListener("auth-changed", syncAuth);

        return () => {
            window.removeEventListener("auth-changed", syncAuth);
        };
    }, [pathname]); // 🔥 THIS IS THE FIX




    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (): void => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");

        window.dispatchEvent(new Event("auth-changed"));

        setDropdownOpen(false);
        window.location.href = "/login";
    };



    const getInitials = (name: string): string => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(n => n.charAt(0))
            .join('')
            .toUpperCase();
    };


    const getAvatarColor = (id: string): string => {
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500'];
        if (!id) return colors[0];
        const index = id.toString().charCodeAt(0) % colors.length;
        return colors[index];
    };


    return (
        <>
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition"
                        >
                            HRSync
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                href="/#home"
                                className="text-gray-300 hover:text-white transition font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/#features"
                                className="text-gray-300 hover:text-white transition font-medium"
                            >
                                Services
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-gray-300 hover:text-white transition font-medium"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/#testimonials"
                                className="text-gray-300 hover:text-white transition font-medium"
                            >
                                Features
                            </Link>
                        </div>

                        {/* Right Side - Desktop */}
                        <div className="hidden md:flex items-center gap-4">
                            {!isLoggedIn ? (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-300 hover:text-white transition font-medium"
                                    >
                                        Login
                                    </Link>
                                    <button className="bg-green-500 text-slate-950 px-6 py-2 rounded-full font-semibold hover:bg-green-400 transition shadow-lg hover:shadow-green-500/20">
                                        Open Account
                                    </button>
                                    <button className="bg-slate-700 text-white p-2 rounded-full hover:bg-slate-600 transition">
                                        <FaArrowRight />
                                    </button>
                                </>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    {/* User Avatar with Dropdown Trigger */}
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-800/50 transition"
                                    >
                                        <div className={`w-8 h-8 ${getAvatarColor(user?.id || '')} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                            {getInitials(user?.name || 'User')}
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 hidden sm:inline">
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                        <FaChevronDown className={`text-xs text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 py-2 animate-in fade-in zoom-in-95">
                                            {/* User Info Header */}
                                            <div className="px-4 py-3 border-b border-slate-700/50">
                                                <p className="font-semibold text-white">{user?.name}</p>
                                                <p className="text-sm text-gray-400">{user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 transition"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <FaUser className="w-4 h-4 text-blue-400" />
                                                <span>My Profile</span>
                                            </Link>

                                            <Link
                                                href="/settings"
                                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 transition"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <FaCog className="w-4 h-4 text-blue-400" />
                                                <span>Settings</span>
                                            </Link>

                                            <Link
                                                href="/help"
                                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 transition"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <FaHeadset className="w-4 h-4 text-blue-400" />
                                                <span>Help & Support</span>
                                            </Link>

                                            {/* Divider */}
                                            <div className="border-t border-slate-700/50 my-2"></div>

                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition"
                                            >
                                                <FaSignOutAlt className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-300 text-xl hover:text-white transition"
                        >
                            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/#home"
                                className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/#features"
                                className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                href="/pricing"
                                className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/#testimonials"
                                className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Features
                            </Link>

                            {/* Mobile Auth Section */}
                            <div className="border-t border-slate-700/50 pt-4 mt-4">
                                {!isLoggedIn ? (
                                    <>
                                        <Link
                                            href="/login"
                                            className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <button className="w-full mt-2 bg-green-500 text-slate-950 px-6 py-2 rounded-full font-semibold hover:bg-green-400 transition shadow-lg hover:shadow-green-500/20">
                                            Open Account
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 border-b border-slate-700/50 mb-2">
                                            <p className="font-semibold text-white">{user?.name}</p>
                                            <p className="text-sm text-gray-400">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Settings
                                        </Link>
                                        <Link
                                            href="/help"
                                            className="block px-4 py-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Help & Support
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                        >
                                            <FaSignOutAlt className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}