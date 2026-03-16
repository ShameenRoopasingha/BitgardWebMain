/**
 * =============================================================================
 * BITGARD WEBSITE - SERVICES SECTION (SERVER WRAPPER)
 * =============================================================================
 * 
 * Server component that fetches data and passes to client component.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

import { getActiveServices } from "@/lib/db";
import { ServicesClient, type ServiceData } from "./ServicesClient";

export async function Services() {
    // Fetch services from database
    const dbServices = await getActiveServices();

    // Transform database records to client-friendly format
    const services: ServiceData[] = dbServices.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        icon: service.icon,
        features: (service.features as string[]) || [],
    }));

    return <ServicesClient services={services} />;
}

export default Services;
