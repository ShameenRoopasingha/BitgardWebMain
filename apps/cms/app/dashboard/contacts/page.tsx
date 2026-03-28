import { getContactSubmissions } from "@/lib/actions";
import ContactsClient from "./ContactsClient";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
    const contacts = await getContactSubmissions();
    return <ContactsClient initialContacts={JSON.parse(JSON.stringify(contacts))} />;
}
