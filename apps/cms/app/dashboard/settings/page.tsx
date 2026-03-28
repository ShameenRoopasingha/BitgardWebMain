/**
 * =============================================================================
 * BITGARD CMS - SETTINGS PAGE
 * =============================================================================
 * 
 * Page for managing site settings in the CMS.
 * Features:
 * - General settings (site name, tagline)
 * - Contact information
 * - Social media links
 * - SEO settings
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
    FiSave,
    FiGlobe,
    FiMail,
    FiPhone,
    FiMapPin,
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiGithub,
    FiInstagram,
    FiSearch,
    FiImage,
} from "react-icons/fi";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SiteSettings {
    siteName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    socialFacebook: string;
    socialTwitter: string;
    socialLinkedin: string;
    socialGithub: string;
    socialInstagram: string;
    metaTitle: string;
    metaDescription: string;
    favicon: string;
    logo: string;
    logoDark: string;
}

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const INITIAL_SETTINGS: SiteSettings = {
    siteName: "Bitgard",
    tagline: "Dreams Forged in Code",
    email: "info@bitgard.com",
    phone: "+1 (234) 567-890",
    address: "123 Tech Street, Innovation City, TC 12345",
    socialFacebook: "https://facebook.com/bitgard",
    socialTwitter: "https://twitter.com/bitgard",
    socialLinkedin: "https://linkedin.com/company/bitgard",
    socialGithub: "https://github.com/bitgard",
    socialInstagram: "https://instagram.com/bitgard",
    metaTitle: "Bitgard | Dreams Forged in Code",
    metaDescription: "Bitgard is a leading software development company specializing in SaaS products.",
    favicon: "/favicon.ico",
    logo: "/logo.png",
    logoDark: "/logo-dark.png",
};

// -----------------------------------------------------------------------------
// Settings Page Component
// -----------------------------------------------------------------------------

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");

    // Handle input change
    const handleChange = (field: keyof SiteSettings, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
        setSavedMessage("");
    };

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSavedMessage("Settings saved successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSavedMessage(""), 3000);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <DashboardHeader
                title="Settings"
                subtitle="Manage your site configuration"
            />

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Success Message */}
                {savedMessage && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                        {savedMessage}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* General Settings */}
                {/* ----------------------------------------------------------------- */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <FiGlobe className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                General Settings
                            </h2>
                            <p className="text-sm text-gray-500">
                                Basic site information
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange("siteName", e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => handleChange("tagline", e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* Contact Information */}
                {/* ----------------------------------------------------------------- */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <FiMail className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Contact Information
                            </h2>
                            <p className="text-sm text-gray-500">
                                How visitors can reach you
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiMail className="inline w-4 h-4 mr-1" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiPhone className="inline w-4 h-4 mr-1" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiMapPin className="inline w-4 h-4 mr-1" />
                                Address
                            </label>
                            <textarea
                                rows={2}
                                value={settings.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* Social Media */}
                {/* ----------------------------------------------------------------- */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <FiLinkedin className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Social Media
                            </h2>
                            <p className="text-sm text-gray-500">
                                Your social media profiles
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiFacebook className="inline w-4 h-4 mr-1" />
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                value={settings.socialFacebook}
                                onChange={(e) => handleChange("socialFacebook", e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiTwitter className="inline w-4 h-4 mr-1" />
                                Twitter URL
                            </label>
                            <input
                                type="url"
                                value={settings.socialTwitter}
                                onChange={(e) => handleChange("socialTwitter", e.target.value)}
                                placeholder="https://twitter.com/yourhandle"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiLinkedin className="inline w-4 h-4 mr-1" />
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={settings.socialLinkedin}
                                onChange={(e) => handleChange("socialLinkedin", e.target.value)}
                                placeholder="https://linkedin.com/company/yourcompany"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiGithub className="inline w-4 h-4 mr-1" />
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={settings.socialGithub}
                                onChange={(e) => handleChange("socialGithub", e.target.value)}
                                placeholder="https://github.com/yourusername"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiInstagram className="inline w-4 h-4 mr-1" />
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                value={settings.socialInstagram}
                                onChange={(e) => handleChange("socialInstagram", e.target.value)}
                                placeholder="https://instagram.com/yourprofile"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* SEO Settings */}
                {/* ----------------------------------------------------------------- */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <FiSearch className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                SEO Settings
                            </h2>
                            <p className="text-sm text-gray-500">
                                Search engine optimization
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={settings.metaTitle}
                                onChange={(e) => handleChange("metaTitle", e.target.value)}
                                placeholder="Page title for search engines"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended: 50-60 characters
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                rows={3}
                                value={settings.metaDescription}
                                onChange={(e) => handleChange("metaDescription", e.target.value)}
                                placeholder="Brief description for search results"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended: 150-160 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* Branding */}
                {/* ----------------------------------------------------------------- */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <FiImage className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Branding
                            </h2>
                            <p className="text-sm text-gray-500">
                                Site logo and icons
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Logo URL (Light)
                            </label>
                            <ImageUpload
                                value={settings.logo}
                                onChange={(url) => handleChange("logo", url)}
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Logo URL (Dark)
                            </label>
                            <ImageUpload
                                value={settings.logoDark}
                                onChange={(url) => handleChange("logoDark", url)}
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Favicon URL
                            </label>
                            <ImageUpload
                                value={settings.favicon}
                                onChange={(url) => handleChange("favicon", url)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* Save Button */}
                {/* ----------------------------------------------------------------- */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave className="w-4 h-4" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
