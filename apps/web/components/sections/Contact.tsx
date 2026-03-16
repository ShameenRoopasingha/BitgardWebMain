/**
 * =============================================================================
 * BITGARD WEBSITE - CONTACT SECTION
 * =============================================================================
 * 
 * Contact form section with:
 * - Form fields with validation (Zod)
 * - Contact information sidebar
 * - GSAP scroll-triggered animations
 * - Accessible form controls
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { z } from "zod";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types & Validation Schema
// -----------------------------------------------------------------------------

/**
 * Zod schema for contact form validation
 */
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormErrors {
    [key: string]: string | undefined;
}

// -----------------------------------------------------------------------------
// Contact Information Data
// -----------------------------------------------------------------------------

const CONTACT_INFO = [
    {
        icon: FiMail,
        label: "Email",
        value: "hello@bitgard.com",
        href: "mailto:hello@bitgard.com",
    },
    {
        icon: FiPhone,
        label: "Phone",
        value: "+1 (555) 123-4567",
        href: "tel:+15551234567",
    },
    {
        icon: FiMapPin,
        label: "Location",
        value: "San Francisco, CA",
    },
    {
        icon: FiClock,
        label: "Business Hours",
        value: "Mon-Fri: 9AM - 6PM PST",
    },
] as const;

// -----------------------------------------------------------------------------
// Form Input Component
// -----------------------------------------------------------------------------

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    required?: boolean;
    isTextarea?: boolean;
}

/**
 * FormInput - Reusable form input component with error handling
 */
function FormInput({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    required = false,
    isTextarea = false,
}: FormInputProps) {
    const inputClasses = `
        w-full px-4 py-3 rounded-lg
        bg-input/50 border
        ${error ? "border-destructive" : "border-input focus:border-primary-500"}
        text-foreground placeholder-muted-foreground
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500/20
    `;

    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-muted-foreground">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </label>

            {isTextarea ? (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={5}
                    className={inputClasses}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={inputClasses}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
            )}

            {error && (
                <p id={`${name}-error`} className="text-sm text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

// -----------------------------------------------------------------------------
// Contact Info Card Component
// -----------------------------------------------------------------------------

interface ContactInfoCardProps {
    info: (typeof CONTACT_INFO)[number];
}

/**
 * ContactInfoCard - Individual contact information card
 */
function ContactInfoCard({ info }: ContactInfoCardProps) {
    const IconComponent = info.icon;
    const content = (
        <>
            <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-primary-400" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                <p className="text-foreground font-medium">{info.value}</p>
            </div>
        </>
    );

    if ("href" in info && info.href) {
        return (
            <a
                href={info.href}
                className="contact-info-card flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary-500/50 transition-colors"
            >
                {content}
            </a>
        );
    }

    return (
        <div className="contact-info-card flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
            {content}
        </div>
    );
}

// -----------------------------------------------------------------------------
// Contact Section Component
// -----------------------------------------------------------------------------

/**
 * Contact - Contact form and information section
 */
export function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    // Form state
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Validate form data
        const result = contactSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        // Simulate API call (replace with actual API endpoint)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmitStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                subject: "",
                message: "",
            });
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // GSAP scroll-triggered animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate section heading
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Animate form
            gsap.fromTo(
                formRef.current,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Animate info cards
            const infoCards = infoRef.current?.querySelectorAll(".contact-info-card");
            if (infoCards) {
                gsap.fromTo(
                    infoCards,
                    { opacity: 0, x: 50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: infoRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="section bg-background"
            aria-labelledby="contact-heading"
        >
            <div className="container mx-auto px-6">
                {/* Section Heading */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                        Get In Touch
                    </span>
                    <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Let&apos;s <span className="gradient-text">Build Something Great</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Ready to transform your business? Drop us a message and we&apos;ll get back
                        to you within 24 hours.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="lg:col-span-3 space-y-6 p-8 rounded-2xl bg-card border border-border"
                    >
                        {/* Success Message */}
                        {submitStatus === "success" && (
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                                <FiCheckCircle className="w-5 h-5 text-green-400" />
                                <p className="text-green-400">Message sent successfully! We&apos;ll be in touch soon.</p>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                            />
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                error={errors.phone}
                            />
                            <FormInput
                                label="Company"
                                name="company"
                                placeholder="Your Company"
                                value={formData.company || ""}
                                onChange={handleChange}
                                error={errors.company}
                            />
                        </div>

                        <FormInput
                            label="Subject"
                            name="subject"
                            placeholder="How can we help?"
                            value={formData.subject}
                            onChange={handleChange}
                            error={errors.subject}
                            required
                        />

                        <FormInput
                            label="Message"
                            name="message"
                            placeholder="Tell us more about your project..."
                            value={formData.message}
                            onChange={handleChange}
                            error={errors.message}
                            required
                            isTextarea
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <FiSend className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Contact Information */}
                    <div ref={infoRef} className="lg:col-span-2 space-y-4">
                        {CONTACT_INFO.map((info, index) => (
                            <ContactInfoCard key={index} info={info} />
                        ))}

                        {/* Map placeholder */}
                        <div className="mt-6 h-48 rounded-xl bg-muted/20 border border-border flex items-center justify-center">
                            <div className="text-center">
                                <FiMapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">Interactive map coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
