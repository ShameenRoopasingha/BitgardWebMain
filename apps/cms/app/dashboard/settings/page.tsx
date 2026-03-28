/**
 * =============================================================================
 * BITGARD CMS - SETTINGS PAGE (SERVER COMPONENT)
 * =============================================================================
 * 
 * Loads site settings from the database and passes them to the client form.
 */

import { getSiteSettings } from "@/lib/actions";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const settings = await getSiteSettings();

    const initialSettings = {
        siteName: settings.siteName || "",
        tagline: settings.tagline || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        socialFacebook: settings.socialFacebook || "",
        socialTwitter: settings.socialTwitter || "",
        socialLinkedin: settings.socialLinkedin || "",
        socialGithub: settings.socialGithub || "",
        socialInstagram: settings.socialInstagram || "",
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        favicon: settings.favicon || "",
        logo: settings.logo || "",
        logoDark: settings.logoDark || "",
    };

    return <SettingsClient initialSettings={initialSettings} />;
}
