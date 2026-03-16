/**
 * =============================================================================
 * BITGARD CMS - LOGIN PAGE
 * =============================================================================
 * 
 * The admin login page for the CMS.
 * 
 * Features:
 * - Email and password authentication
 * - Form validation with Zod
 * - Loading states
 * - Error handling
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

// -----------------------------------------------------------------------------
// Login Page Component
// -----------------------------------------------------------------------------

/**
 * LoginPage - Admin authentication page
 */
export default function LoginPage() {
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement actual authentication with Supabase
            // For now, simulate login
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Demo credentials check
            if (email === "admin@bitgard.com" && password === "admin123") {
                toast.success("Login successful!");
                router.push("/dashboard");
            } else {
                toast.error("Invalid credentials");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

            {/* Background pattern */}
            <div
                className="fixed inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232196f3' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="dashboard-card p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-16 h-16 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Bitgard Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Bitgard CMS</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Sign in to manage your website
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-400 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@bitgard.com"
                                    className="w-full pl-12"
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-400 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <FiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
                                />
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3"
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials Note */}
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-xs text-gray-500 text-center">
                            <strong className="text-gray-400">Demo Credentials:</strong>
                            <br />
                            Email: admin@bitgard.com
                            <br />
                            Password: admin123
                        </p>
                    </div>
                </div>

                {/* Back to Website Link */}
                <p className="text-center mt-6 text-gray-500 text-sm">
                    <Link
                        href="/"
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        ← Back to website
                    </Link>
                </p>
            </div>
        </div>
    );
}
