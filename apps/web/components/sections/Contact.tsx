import { getSiteSettings } from "@/lib/db";
import { ContactClient } from "./ContactClient";

export async function Contact() {
    // Fetch site settings from database to provide dynamic contact info
    const settings = await getSiteSettings();
    
    return <ContactClient settings={settings} />;
}

export default Contact;
