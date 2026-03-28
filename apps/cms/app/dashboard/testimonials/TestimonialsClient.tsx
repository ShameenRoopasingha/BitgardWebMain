"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiStar, FiMessageSquare,
} from "react-icons/fi";
import {
    createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialStatus,
} from "@/lib/actions";

interface TestimonialData {
    id: string;
    clientName: string;
    clientTitle: string;
    company: string;
    content: string;
    image: string | null;
    rating: number;
    isActive: boolean;
    createdAt: string;
}

interface Props { initialTestimonials: TestimonialData[]; }

export default function TestimonialsClient({ initialTestimonials }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<TestimonialData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [clientName, setClientName] = useState("");
    const [clientTitle, setClientTitle] = useState("");
    const [company, setCompany] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [rating, setRating] = useState(5);

    const filtered = initialTestimonials.filter(
        (t) =>
            t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setSelected(null);
        setClientName(""); setClientTitle(""); setCompany(""); setContent(""); setImage(""); setRating(5);
        setError(null); setIsModalOpen(true);
    };

    const openEdit = (t: TestimonialData) => {
        setSelected(t);
        setClientName(t.clientName); setClientTitle(t.clientTitle); setCompany(t.company); setContent(t.content); setImage(t.image || ""); setRating(t.rating);
        setError(null); setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!clientName.trim() || !clientTitle.trim() || !company.trim() || !content.trim()) {
            setError("All fields are required."); return;
        }
        startTransition(async () => {
            try {
                const payload = { clientName: clientName.trim(), clientTitle: clientTitle.trim(), company: company.trim(), content: content.trim(), image: image || undefined, rating };
                if (selected) { await updateTestimonial(selected.id, payload); }
                else { await createTestimonial(payload); }
                setIsModalOpen(false); setSelected(null); router.refresh();
            } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to save."); }
        });
    };

    const confirmDelete = () => {
        if (!selected) return;
        startTransition(async () => {
            try { await deleteTestimonial(selected.id); setIsDeleteModalOpen(false); setSelected(null); router.refresh(); }
            catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to delete."); }
        });
    };

    const handleToggle = (id: string) => {
        startTransition(async () => {
            try { await toggleTestimonialStatus(id); router.refresh(); }
            catch (err) { console.error("Toggle failed", err); }
        });
    };

    const renderStars = (r: number) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-4 h-4 ${i < r ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen">
            <DashboardHeader title="Testimonials" subtitle="Manage client testimonials and reviews" action={{ label: "Add Testimonial", onClick: openCreate }} />

            <div className="p-6 space-y-6">
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" placeholder="Search testimonials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((t) => (
                        <div key={t.id} className="dashboard-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {t.image ? (
                                        <img src={t.image} alt={t.clientName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg font-bold text-white">{t.clientName.split(" ").map((n) => n[0]).join("")}</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{t.clientName}</h3>
                                        <p className="text-sm text-gray-500">{t.clientTitle}, {t.company}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>{t.isActive ? "Active" : "Hidden"}</span>
                            </div>
                            <div className="mb-3">{renderStars(t.rating)}</div>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-3">&quot;{t.content}&quot;</p>
                            <p className="text-xs text-gray-600 mb-4">Added: {new Date(t.createdAt).toLocaleDateString()}</p>
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                                <button onClick={() => openEdit(t)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /> Edit</button>
                                <button onClick={() => handleToggle(t.id)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">{t.isActive ? "Hide" : "Show"}</button>
                                <button onClick={() => { setSelected(t); setIsDeleteModalOpen(true); }} disabled={isPending} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <FiMessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No testimonials found</h3>
                        <p className="text-gray-500 mb-4">{searchQuery ? "Try adjusting your search terms" : "Get started by adding your first testimonial"}</p>
                        <button onClick={openCreate} className="btn btn-primary"><FiPlus className="w-4 h-4" /> Add Testimonial</button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">{selected ? "Edit Testimonial" : "Add New Testimonial"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name *</label>
                                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., John Smith" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                                    <input type="text" value={clientTitle} onChange={(e) => setClientTitle(e.target.value)} placeholder="e.g., CEO" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., Acme Corp" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Testimonial Content *</label>
                                <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="What did the client say?" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Client Photo</label>
                                <ImageUpload value={image} onChange={setImage} disabled={isPending} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full max-w-xs px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    <option value={5}>5 Stars</option>
                                    <option value={4}>4 Stars</option>
                                    <option value={3}>3 Stars</option>
                                    <option value={2}>2 Stars</option>
                                    <option value={1}>1 Star</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsModalOpen(false); setSelected(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary" disabled={isPending}>{isPending ? "Saving..." : selected ? "Save Changes" : "Add Testimonial"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteModalOpen && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Testimonial</h3>
                            <p className="text-gray-400">Are you sure you want to delete this testimonial from <span className="text-white font-medium">{selected.clientName}</span>? This action cannot be undone.</p>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSelected(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={confirmDelete} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>{isPending ? "Deleting..." : "Delete Testimonial"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
