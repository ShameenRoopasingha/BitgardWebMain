"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { upsertSiteSettings } from "@/lib/actions";
import toast from "react-hot-toast";

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

interface Props {
    initialSettings: SiteSettings;
}

export default function SettingsClient({ initialSettings }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState<SiteSettings>(initialSettings);

    const handleChange = (field: keyof SiteSettings, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                await upsertSiteSettings({
                    siteName: settings.siteName || undefined,
                    tagline: settings.tagline || undefined,
                    email: settings.email || null,
                    phone: settings.phone || null,
                    address: settings.address || null,
                    socialFacebook: settings.socialFacebook || null,
                    socialTwitter: settings.socialTwitter || null,
                    socialLinkedin: settings.socialLinkedin || null,
                    socialGithub: settings.socialGithub || null,
                    socialInstagram: settings.socialInstagram || null,
                    metaTitle: settings.metaTitle || null,
                    metaDescription: settings.metaDescription || null,
                    favicon: settings.favicon || null,
                    logo: settings.logo || null,
                    logoDark: settings.logoDark || null,
                });
                toast.success("Settings saved successfully!");
                router.refresh();
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Failed to save settings.");
            }
        });
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader
                title="Settings"
                subtitle="Manage your site configuration"
            />

            <div className="p-6 space-y-6">
                {/* General Settings */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <FiGlobe className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">General Settings</h2>
                            <p className="text-sm text-gray-500">Basic site information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                            <input type="text" value={settings.siteName} onChange={(e) => handleChange("siteName", e.target.value)} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                            <input type="text" value={settings.tagline} onChange={(e) => handleChange("tagline", e.target.value)} className="w-full" />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <FiMail className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Contact Information</h2>
                            <p className="text-sm text-gray-500">How visitors can reach you</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiMail className="inline w-4 h-4 mr-1" /> Email Address
                            </label>
                            <input type="email" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiPhone className="inline w-4 h-4 mr-1" /> Phone Number
                            </label>
                            <input type="tel" value={settings.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FiMapPin className="inline w-4 h-4 mr-1" /> Address
                            </label>
                            <textarea rows={2} value={settings.address} onChange={(e) => handleChange("address", e.target.value)} className="w-full" />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <FiLinkedin className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Social Media</h2>
                            <p className="text-sm text-gray-500">Your social media profiles</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2"><FiFacebook className="inline w-4 h-4 mr-1" /> Facebook URL</label>
                            <input type="url" value={settings.socialFacebook} onChange={(e) => handleChange("socialFacebook", e.target.value)} placeholder="https://facebook.com/yourpage" className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2"><FiTwitter className="inline w-4 h-4 mr-1" /> Twitter URL</label>
                            <input type="url" value={settings.socialTwitter} onChange={(e) => handleChange("socialTwitter", e.target.value)} placeholder="https://twitter.com/yourhandle" className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2"><FiLinkedin className="inline w-4 h-4 mr-1" /> LinkedIn URL</label>
                            <input type="url" value={settings.socialLinkedin} onChange={(e) => handleChange("socialLinkedin", e.target.value)} placeholder="https://linkedin.com/company/yourcompany" className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2"><FiGithub className="inline w-4 h-4 mr-1" /> GitHub URL</label>
                            <input type="url" value={settings.socialGithub} onChange={(e) => handleChange("socialGithub", e.target.value)} placeholder="https://github.com/yourusername" className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2"><FiInstagram className="inline w-4 h-4 mr-1" /> Instagram URL</label>
                            <input type="url" value={settings.socialInstagram} onChange={(e) => handleChange("socialInstagram", e.target.value)} placeholder="https://instagram.com/yourprofile" className="w-full" />
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <FiSearch className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
                            <p className="text-sm text-gray-500">Search engine optimization</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                            <input type="text" value={settings.metaTitle} onChange={(e) => handleChange("metaTitle", e.target.value)} placeholder="Page title for search engines" className="w-full" />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                            <textarea rows={3} value={settings.metaDescription} onChange={(e) => handleChange("metaDescription", e.target.value)} placeholder="Brief description for search results" className="w-full" />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                        </div>
                    </div>
                </div>

                {/* Branding */}
                <div className="dashboard-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <FiImage className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Branding</h2>
                            <p className="text-sm text-gray-500">Site logo and icons</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Logo (Light)</label>
                            <ImageUpload value={settings.logo} onChange={(url) => handleChange("logo", url)} disabled={isPending} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Logo (Dark)</label>
                            <ImageUpload value={settings.logoDark} onChange={(url) => handleChange("logoDark", url)} disabled={isPending} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Favicon</label>
                            <ImageUpload value={settings.favicon} onChange={(url) => handleChange("favicon", url)} disabled={isPending} />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={isPending} className="btn btn-primary">
                        {isPending ? (
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
