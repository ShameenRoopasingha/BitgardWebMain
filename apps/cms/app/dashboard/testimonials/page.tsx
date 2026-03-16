import { getTestimonials } from "@/lib/actions";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();
    return <TestimonialsClient initialTestimonials={JSON.parse(JSON.stringify(testimonials))} />;
}
