"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import {
    FiSearch, FiTrash2, FiMail, FiCheck, FiInbox, FiClock,
} from "react-icons/fi";
import { markContactAsRead, deleteContactSubmission } from "@/lib/actions";

interface ContactData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface Props { initialContacts: ContactData[]; }

export default function ContactsClient({ initialContacts }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
    const [selected, setSelected] = useState<ContactData | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filtered = initialContacts.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || (filter === "unread" && !c.isRead) || (filter === "read" && c.isRead);
        return matchesSearch && matchesFilter;
    });

    const unreadCount = initialContacts.filter((c) => !c.isRead).length;

    const handleMarkRead = (id: string) => {
        startTransition(async () => {
            try { await markContactAsRead(id); router.refresh(); }
            catch (err) { console.error("Mark read failed", err); }
        });
    };

    const confirmDelete = () => {
        if (!selected) return;
        startTransition(async () => {
            try { await deleteContactSubmission(selected.id); setIsDeleteModalOpen(false); setIsViewOpen(false); setSelected(null); router.refresh(); }
            catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to delete."); }
        });
    };

    const viewContact = (contact: ContactData) => {
        setSelected(contact);
        setIsViewOpen(true);
        setError(null);
        if (!contact.isRead) handleMarkRead(contact.id);
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader title="Contact Submissions" subtitle={`${initialContacts.length} total submissions · ${unreadCount} unread`} />

            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="Search contacts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "unread", "read"] as const).map((f) => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "bg-gray-800 text-gray-400 border border-gray-700 hover:text-white"}`}>
                                {f === "all" ? `All (${initialContacts.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${initialContacts.length - unreadCount})`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filtered.map((contact) => (
                        <div key={contact.id} onClick={() => viewContact(contact)} className={`dashboard-card cursor-pointer hover:border-gray-600 transition-colors ${!contact.isRead ? "border-l-4 border-l-primary-500" : ""}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!contact.isRead ? "bg-primary-500/20" : "bg-gray-800"}`}>
                                        {!contact.isRead ? <FiMail className="w-5 h-5 text-primary-400" /> : <FiCheck className="w-5 h-5 text-gray-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-semibold truncate ${!contact.isRead ? "text-white" : "text-gray-300"}`}>{contact.name}</h3>
                                            {!contact.isRead && <span className="px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">New</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium mb-1">{contact.subject}</p>
                                        <p className="text-sm text-gray-500 truncate">{contact.message}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <FiClock className="w-3 h-3" />{new Date(contact.createdAt).toLocaleDateString()}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setSelected(contact); setIsDeleteModalOpen(true); }} disabled={isPending} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <FiInbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No submissions found</h3>
                        <p className="text-gray-500">{searchQuery || filter !== "all" ? "Try adjusting your search or filter" : "No contact submissions yet"}</p>
                    </div>
                )}
            </div>

            {/* View Contact Modal */}
            {isViewOpen && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">{selected.subject}</h2>
                            <p className="text-sm text-gray-500 mt-1">From {selected.name} · {new Date(selected.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-gray-500 mb-1">Email</label><p className="text-sm text-white">{selected.email}</p></div>
                                {selected.phone && <div><label className="block text-xs text-gray-500 mb-1">Phone</label><p className="text-sm text-white">{selected.phone}</p></div>}
                                {selected.company && <div><label className="block text-xs text-gray-500 mb-1">Company</label><p className="text-sm text-white">{selected.company}</p></div>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">Message</label>
                                <div className="p-4 bg-gray-800 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">{selected.message}</div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-between">
                            <button onClick={() => { setSelected(selected); setIsDeleteModalOpen(true); }} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>Delete</button>
                            <button onClick={() => { setIsViewOpen(false); setSelected(null); }} className="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteModalOpen && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Submission</h3>
                            <p className="text-gray-400">Delete the contact submission from <span className="text-white font-medium">{selected.name}</span>? This action cannot be undone.</p>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSelected(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={confirmDelete} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>{isPending ? "Deleting..." : "Delete"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
