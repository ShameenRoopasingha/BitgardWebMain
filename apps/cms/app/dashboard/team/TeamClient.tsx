"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers, FiLinkedin, FiTwitter, FiGithub,
} from "react-icons/fi";
import {
    createTeamMember, updateTeamMember, deleteTeamMember, toggleTeamMemberStatus,
} from "@/lib/actions";

interface MemberData {
    id: string;
    name: string;
    position: string;
    bio: string | null;
    image: string | null;
    linkedin: string | null;
    twitter: string | null;
    github: string | null;
    order: number;
    isActive: boolean;
}

interface Props { initialTeam: MemberData[]; }

export default function TeamClient({ initialTeam }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [twitter, setTwitter] = useState("");
    const [github, setGithub] = useState("");
    const [order, setOrder] = useState(0);

    const filteredTeam = initialTeam.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setSelectedMember(null);
        setName(""); setPosition(""); setBio(""); setImage(""); setLinkedin(""); setTwitter(""); setGithub(""); setOrder(initialTeam.length + 1);
        setError(null); setIsModalOpen(true);
    };

    const openEdit = (member: MemberData) => {
        setSelectedMember(member);
        setName(member.name); setPosition(member.position); setBio(member.bio || ""); setImage(member.image || "");
        setLinkedin(member.linkedin || ""); setTwitter(member.twitter || ""); setGithub(member.github || ""); setOrder(member.order);
        setError(null); setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!name.trim() || !position.trim()) { setError("Name and position are required."); return; }
        startTransition(async () => {
            try {
                const payload = {
                    name: name.trim(), position: position.trim(), bio: bio.trim() || undefined,
                    image: image || undefined,
                    linkedin: linkedin.trim() || undefined, twitter: twitter.trim() || undefined, github: github.trim() || undefined, order,
                };
                if (selectedMember) { await updateTeamMember(selectedMember.id, payload); }
                else { await createTeamMember(payload); }
                setIsModalOpen(false); setSelectedMember(null); router.refresh();
            } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to save."); }
        });
    };

    const confirmDelete = () => {
        if (!selectedMember) return;
        startTransition(async () => {
            try { await deleteTeamMember(selectedMember.id); setIsDeleteModalOpen(false); setSelectedMember(null); router.refresh(); }
            catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to delete."); }
        });
    };

    const handleToggle = (id: string) => {
        startTransition(async () => {
            try { await toggleTeamMemberStatus(id); router.refresh(); }
            catch (err) { console.error("Toggle failed", err); }
        });
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader title="Team" subtitle="Manage your team members" action={{ label: "Add Member", onClick: openCreate }} />

            <div className="p-6 space-y-6">
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" placeholder="Search team members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeam.map((member) => (
                        <div key={member.id} className="dashboard-card group">
                            <div className="flex items-start gap-4 mb-4">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl font-bold text-white">{member.name.split(" ").map((n) => n[0]).join("")}</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-white truncate">{member.name}</h3>
                                    <p className="text-sm text-primary-400 font-medium">{member.position}</p>
                                    <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${member.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                        {member.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            {member.bio && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{member.bio}</p>}
                            <div className="flex gap-2 mb-4">
                                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-colors"><FiLinkedin className="w-4 h-4" /></a>}
                                {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-colors"><FiTwitter className="w-4 h-4" /></a>}
                                {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"><FiGithub className="w-4 h-4" /></a>}
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                                <button onClick={() => openEdit(member)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /> Edit</button>
                                <button onClick={() => handleToggle(member.id)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">{member.isActive ? "Hide" : "Show"}</button>
                                <button onClick={() => { setSelectedMember(member); setIsDeleteModalOpen(true); }} disabled={isPending} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTeam.length === 0 && (
                    <div className="text-center py-12">
                        <FiUsers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No team members found</h3>
                        <p className="text-gray-500 mb-4">{searchQuery ? "Try adjusting your search terms" : "Get started by adding your first team member"}</p>
                        <button onClick={openCreate} className="btn btn-primary"><FiPlus className="w-4 h-4" /> Add Member</button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">{selectedMember ? "Edit Team Member" : "Add New Team Member"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Smith" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                                    <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g., CEO & Founder" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                                <ImageUpload value={image} onChange={setImage} disabled={isPending} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief biography..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                                    <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Twitter URL</label>
                                    <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                                    <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                                <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full max-w-xs px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsModalOpen(false); setSelectedMember(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary" disabled={isPending}>{isPending ? "Saving..." : selectedMember ? "Save Changes" : "Add Member"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Team Member</h3>
                            <p className="text-gray-400">Are you sure you want to delete <span className="text-white font-medium">{selectedMember.name}</span>? This action cannot be undone.</p>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSelectedMember(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={confirmDelete} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>{isPending ? "Deleting..." : "Delete Member"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
