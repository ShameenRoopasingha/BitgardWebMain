import { getServices } from "@/lib/actions";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
    const services = await getServices();
    return <ServicesClient initialServices={JSON.parse(JSON.stringify(services))} />;
}
