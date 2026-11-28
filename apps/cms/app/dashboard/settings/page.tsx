/**
 * =============================================================================
 * BITGARD CMS - SETTINGS PAGE (SERVER COMPONENT)
 * =============================================================================
 * 
 * Loads site settings from the database and passes them to the client form.
 */

import { getSiteSettings } from "@/lib/actions";
import { getCmsSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const [settings, adminSession] = await Promise.all([
        getSiteSettings(),
        getCmsSession(),
    ]);

    const adminSecurity = adminSession
        ? await prisma.admin.findUnique({
              where: { id: adminSession.id },
              select: { mfaEnabled: true, mfaBackupCodes: true },
          })
        : null;

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

    return (
        <SettingsClient
            initialSettings={initialSettings}
            initialMfa={{
                enabled: Boolean(adminSecurity?.mfaEnabled),
                backupCodesRemaining: adminSecurity?.mfaBackupCodes?.length ?? 0,
            }}
        />
    );
}
