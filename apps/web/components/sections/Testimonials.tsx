/**
 * =============================================================================
 * BITGARD WEBSITE - TESTIMONIALS SECTION (SERVER WRAPPER)
 * =============================================================================
 * 
 * Server component that fetches data and passes to client component.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

import { getActiveTestimonials } from "@/lib/db";
import { TestimonialsClient, type TestimonialData } from "./TestimonialsClient";

export async function Testimonials() {
    // Fetch testimonials from database
    const dbTestimonials = await getActiveTestimonials();

    // Transform database records to client-friendly format
    const testimonials: TestimonialData[] = dbTestimonials.map((t) => ({
        id: t.id,
        clientName: t.clientName,
        clientTitle: t.clientTitle,
        company: t.company,
        content: t.content,
        rating: t.rating,
    }));

    return <TestimonialsClient testimonials={testimonials} />;
}

export default Testimonials;
