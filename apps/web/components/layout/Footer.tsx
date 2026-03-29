import { getSiteSettings } from "@/lib/db";
import { FooterClient } from "./FooterClient";

export async function Footer() {
    // Fetch site settings from database to provide dynamic footer info
    const settings = await getSiteSettings();
    
    return <FooterClient settings={settings} />;
}

export default Footer;
