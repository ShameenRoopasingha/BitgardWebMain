"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiFileText, FiTag, FiCalendar,
} from "react-icons/fi";
import {
    createBlogPost, updateBlogPost, deleteBlogPost, toggleBlogPostPublish,
} from "@/lib/actions";

interface PostData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    author: string;
    tags: string[];
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
}

interface Props { initialPosts: PostData[]; }

const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function BlogClient({ initialPosts }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
    const [selected, setSelected] = useState<PostData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [tags, setTags] = useState("");

    const filtered = initialPosts.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || (filter === "published" && p.isPublished) || (filter === "draft" && !p.isPublished);
        return matchesSearch && matchesFilter;
    });

    const publishedCount = initialPosts.filter((p) => p.isPublished).length;
    const draftCount = initialPosts.length - publishedCount;

    const openCreate = () => {
        setSelected(null);
        setTitle(""); setExcerpt(""); setContent(""); setAuthor(""); setCoverImage(""); setTags("");
        setError(null); setIsModalOpen(true);
    };

    const openEdit = (post: PostData) => {
        setSelected(post);
        setTitle(post.title); setExcerpt(post.excerpt); setContent(post.content);
        setAuthor(post.author); setCoverImage(post.coverImage || ""); setTags(post.tags.join(", "));
        setError(null); setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!title.trim() || !excerpt.trim() || !content.trim() || !author.trim()) {
            setError("Title, excerpt, content, and author are required."); return;
        }
        const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

        startTransition(async () => {
            try {
                const payload = {
                    title: title.trim(), slug: slugify(title), excerpt: excerpt.trim(),
                    content: content.trim(), author: author.trim(), coverImage: coverImage || undefined, tags: tagList,
                };
                if (selected) { await updateBlogPost(selected.id, payload); }
                else { await createBlogPost(payload); }
                setIsModalOpen(false); setSelected(null); router.refresh();
            } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to save."); }
        });
    };

    const confirmDelete = () => {
        if (!selected) return;
        startTransition(async () => {
            try { await deleteBlogPost(selected.id); setIsDeleteModalOpen(false); setSelected(null); router.refresh(); }
            catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to delete."); }
        });
    };

    const handleTogglePublish = (id: string) => {
        startTransition(async () => {
            try { await toggleBlogPostPublish(id); router.refresh(); }
            catch (err) { console.error("Toggle failed", err); }
        });
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader title="Blog" subtitle={`${initialPosts.length} posts · ${publishedCount} published · ${draftCount} drafts`} action={{ label: "New Post", onClick: openCreate }} />

            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "published", "draft"] as const).map((f) => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "bg-gray-800 text-gray-400 border border-gray-700 hover:text-white"}`}>
                                {f === "all" ? `All (${initialPosts.length})` : f === "published" ? `Published (${publishedCount})` : `Drafts (${draftCount})`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filtered.map((post) => (
                        <div key={post.id} className="dashboard-card group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${post.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                            {post.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString()}</span>
                                        <span>By {post.author}</span>
                                        {post.tags.length > 0 && (
                                            <span className="flex items-center gap-1"><FiTag className="w-3 h-3" />{post.tags.slice(0, 3).join(", ")}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => openEdit(post)} disabled={isPending} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleTogglePublish(post.id)} disabled={isPending} className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"><FiEye className="w-4 h-4" /></button>
                                    <button onClick={() => { setSelected(post); setIsDeleteModalOpen(true); }} disabled={isPending} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <FiFileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
                        <p className="text-gray-500 mb-4">{searchQuery || filter !== "all" ? "Try adjusting your search or filter" : "Get started by writing your first blog post"}</p>
                        <button onClick={openCreate} className="btn btn-primary"><FiPlus className="w-4 h-4" /> New Post</button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">{selected ? "Edit Post" : "New Blog Post"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., How to Build a Modern CMS" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt *</label>
                                <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary for previews..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                                <ImageUpload value={coverImage} onChange={setCoverImage} disabled={isPending} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
                                <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your blog post content here..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Author *</label>
                                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., Bitgard Team" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Next.js, CMS, Tutorial" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsModalOpen(false); setSelected(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary" disabled={isPending}>{isPending ? "Saving..." : selected ? "Save Changes" : "Create Post"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteModalOpen && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Post</h3>
                            <p className="text-gray-400">Are you sure you want to delete &quot;<span className="text-white font-medium">{selected.title}</span>&quot;? This action cannot be undone.</p>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSelected(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={confirmDelete} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>{isPending ? "Deleting..." : "Delete Post"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
