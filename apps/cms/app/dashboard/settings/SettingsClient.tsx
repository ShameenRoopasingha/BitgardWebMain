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
    FiShield,
    FiKey,
    FiRefreshCw,
    FiLock,
    FiEye,
    FiEyeOff,
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
    initialMfa: {
        enabled: boolean;
        backupCodesRemaining: number;
    };
}

export default function SettingsClient({ initialSettings, initialMfa }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState<SiteSettings>(initialSettings);

    const [mfaEnabled, setMfaEnabled] = useState(initialMfa.enabled);
    const [backupRemaining, setBackupRemaining] = useState(initialMfa.backupCodesRemaining);
    const [mfaStep, setMfaStep] = useState<"idle" | "qr">("idle");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [manualSecret, setManualSecret] = useState("");
    const [mfaVerifyCode, setMfaVerifyCode] = useState("");
    const [plainBackupCodes, setPlainBackupCodes] = useState<string[]>([]);
    const [mfaActionMode, setMfaActionMode] = useState<"none" | "disable" | "regenerate">("none");
    const [mfaPassword, setMfaPassword] = useState("");
    const [mfaConfirmCode, setMfaConfirmCode] = useState("");
    const [mfaBusy, setMfaBusy] = useState(false);

    const [pwdCurrent, setPwdCurrent] = useState("");
    const [pwdNew, setPwdNew] = useState("");
    const [pwdConfirm, setPwdConfirm] = useState("");
    const [pwdMfaCode, setPwdMfaCode] = useState("");
    const [showPwdFields, setShowPwdFields] = useState(false);
    const [pwdBusy, setPwdBusy] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwdNew !== pwdConfirm) {
            toast.error("New passwords do not match");
            return;
        }
        if (pwdNew.length < 10) {
            toast.error("New password must be at least 10 characters");
            return;
        }
        setPwdBusy(true);
        try {
            const res = await fetch("/api/auth/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: pwdCurrent,
                    newPassword: pwdNew,
                    ...(mfaEnabled && pwdMfaCode.trim() ? { mfaCode: pwdMfaCode.trim() } : {}),
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                toast.error(data.error || "Failed to update password");
                return;
            }
            toast.success("Password updated & other sessions revoked!");
            setPwdCurrent("");
            setPwdNew("");
            setPwdConfirm("");
            setPwdMfaCode("");
            router.refresh();
        } catch {
            toast.error("Unable to update password");
        } finally {
            setPwdBusy(false);
        }
    };

    const startMfaSetup = async () => {
        setMfaBusy(true);
        try {
            const res = await fetch("/api/auth/mfa/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "begin" }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                toast.error(data.error || "Failed to start 2FA setup");
                return;
            }
            setQrDataUrl(data.qrDataUrl);
            setManualSecret(data.manualSecret);
            setMfaVerifyCode("");
            setPlainBackupCodes([]);
            setMfaStep("qr");
        } catch {
            toast.error("Unable to initialize authenticator setup");
        } finally {
            setMfaBusy(false);
        }
    };

    const confirmEnableMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        setMfaBusy(true);
        try {
            const res = await fetch("/api/auth/mfa/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "enable", code: mfaVerifyCode.trim() }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                toast.error(data.error || "Invalid 6-digit authenticator code");
                return;
            }
            setMfaEnabled(true);
            setMfaStep("idle");
            setMfaVerifyCode("");
            setPlainBackupCodes(data.backupCodes || []);
            setBackupRemaining((data.backupCodes || []).length);
            toast.success("Admin 2FA enabled successfully!");
        } catch {
            toast.error("Failed to verify authenticator code");
        } finally {
            setMfaBusy(false);
        }
    };

    const handleMfaManage = async (e: React.FormEvent) => {
        e.preventDefault();
        setMfaBusy(true);
        try {
            const isDisable = mfaActionMode === "disable";
            const res = await fetch("/api/auth/mfa/setup", {
                method: isDisable ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    isDisable
                        ? { currentPassword: mfaPassword, code: mfaConfirmCode.trim() }
                        : { action: "regenerate", currentPassword: mfaPassword, code: mfaConfirmCode.trim() }
                ),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                toast.error(data.error || "Verification failed");
                return;
            }
            if (isDisable) {
                setMfaEnabled(false);
                setPlainBackupCodes([]);
                setBackupRemaining(0);
                toast.success("Admin 2FA disabled.");
            } else {
                setPlainBackupCodes(data.backupCodes || []);
                setBackupRemaining((data.backupCodes || []).length);
                toast.success("Fresh backup codes generated.");
            }
            setMfaActionMode("none");
            setMfaPassword("");
            setMfaConfirmCode("");
        } catch {
            toast.error("Unable to update MFA settings");
        } finally {
            setMfaBusy(false);
        }
    };

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

                {/* Admin Password Update */}
                <div className="dashboard-card space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <FiLock className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Change Admin Password</h2>
                                <p className="text-sm text-gray-500">
                                    Update your CMS administrator password (automatically revokes older sessions)
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPwdFields((prev) => !prev)}
                            className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5"
                        >
                            {showPwdFields ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            {showPwdFields ? "Hide Passwords" : "Show Passwords"}
                        </button>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type={showPwdFields ? "text" : "password"}
                                    value={pwdCurrent}
                                    onChange={(e) => setPwdCurrent(e.target.value)}
                                    placeholder="Current password"
                                    className="w-full"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type={showPwdFields ? "text" : "password"}
                                    value={pwdNew}
                                    onChange={(e) => setPwdNew(e.target.value)}
                                    placeholder="10+ chars, Aa1"
                                    className="w-full"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type={showPwdFields ? "text" : "password"}
                                    value={pwdConfirm}
                                    onChange={(e) => setPwdConfirm(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="w-full"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        {mfaEnabled && (
                            <div className="max-w-xs">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    2FA Authenticator Code
                                </label>
                                <input
                                    type="text"
                                    value={pwdMfaCode}
                                    onChange={(e) => setPwdMfaCode(e.target.value)}
                                    placeholder="123456"
                                    className="w-full font-mono tracking-widest"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-3 pt-1">
                            <p className="text-xs text-gray-500">
                                Use at least 10 characters with uppercase, lowercase, and a number.
                            </p>
                            <button type="submit" disabled={pwdBusy} className="btn btn-primary">
                                <FiLock className="w-4 h-4" />
                                {pwdBusy ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Admin Account Two-Factor Authentication */}
                <div className="dashboard-card space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <FiShield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Admin Security &amp; Two-Factor Authentication (2FA)
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Require a 6-digit TOTP authenticator code when signing in to Bitgard CMS
                                </p>
                            </div>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                                mfaEnabled
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                        >
                            {mfaEnabled ? "2FA ENABLED" : "2FA DISABLED"}
                        </span>
                    </div>

                    {plainBackupCodes.length > 0 && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                            <p className="text-sm font-semibold text-amber-300">
                                Save your one-time recovery codes (shown only once):
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-white">
                                {plainBackupCodes.map((code) => (
                                    <div key={code} className="bg-gray-900/90 border border-gray-700 rounded px-2.5 py-1.5 text-center">
                                        {code}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!mfaEnabled && mfaStep === "idle" && (
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                            <p className="text-sm text-gray-400">
                                Protect Super Admin licensing and CMS access using Google Authenticator or Authy.
                            </p>
                            <button
                                type="button"
                                onClick={startMfaSetup}
                                disabled={mfaBusy}
                                className="btn btn-primary"
                            >
                                <FiKey className="w-4 h-4" />
                                {mfaBusy ? "Starting..." : "Set Up 2FA"}
                            </button>
                        </div>
                    )}

                    {!mfaEnabled && mfaStep === "qr" && (
                        <form onSubmit={confirmEnableMfa} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                                {qrDataUrl && (
                                    <div className="p-2 bg-white rounded-xl shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={qrDataUrl} alt="Bitgard CMS 2FA QR" width={170} height={170} />
                                    </div>
                                )}
                                <div className="space-y-3 flex-1">
                                    <p className="text-sm text-gray-300">
                                        Scan this QR code with your authenticator app, or enter this secret manually:
                                    </p>
                                    <div className="font-mono text-xs bg-gray-950 border border-gray-800 rounded px-3 py-2 text-emerald-300 break-all">
                                        {manualSecret}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <input
                                            type="text"
                                            value={mfaVerifyCode}
                                            onChange={(e) => setMfaVerifyCode(e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            className="max-w-[200px] font-mono tracking-widest"
                                            required
                                        />
                                        <button type="submit" disabled={mfaBusy} className="btn btn-primary">
                                            {mfaBusy ? "Verifying..." : "Verify & Enable"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMfaStep("idle")}
                                            className="btn bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {mfaEnabled && (
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                                <div className="text-sm text-gray-300">
                                    Two-factor authentication is active. Unused backup codes:{" "}
                                    <strong className="text-white">{backupRemaining}</strong>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMfaActionMode(mfaActionMode === "regenerate" ? "none" : "regenerate")}
                                        className="btn bg-gray-800 text-gray-200 hover:bg-gray-700"
                                    >
                                        <FiRefreshCw className="w-4 h-4" />
                                        Regenerate Backup Codes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMfaActionMode(mfaActionMode === "disable" ? "none" : "disable")}
                                        className="btn bg-red-600/20 text-red-300 border border-red-500/40 hover:bg-red-600/30"
                                    >
                                        Disable 2FA
                                    </button>
                                </div>
                            </div>

                            {mfaActionMode !== "none" && (
                                <form onSubmit={handleMfaManage} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
                                    <p className="text-sm font-medium text-white">
                                        {mfaActionMode === "disable"
                                            ? "Enter current password and 2FA code to disable MFA"
                                            : "Enter current password and 6-digit authenticator code to regenerate backup codes"}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="password"
                                            value={mfaPassword}
                                            onChange={(e) => setMfaPassword(e.target.value)}
                                            placeholder="Current Password"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={mfaConfirmCode}
                                            onChange={(e) => setMfaConfirmCode(e.target.value)}
                                            placeholder="Authenticator or Backup Code"
                                            className="font-mono tracking-wider"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={mfaBusy} className="btn btn-primary">
                                            {mfaBusy ? "Processing..." : mfaActionMode === "disable" ? "Confirm Disable" : "Generate Codes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMfaActionMode("none")}
                                            className="btn bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
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
