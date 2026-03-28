"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiBox,
} from "react-icons/fi";
import {
    createProduct, updateProduct, deleteProduct, toggleProductStatus,
} from "@/lib/actions";

interface ProductData {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    icon: string;
    features: string[];
    image: string | null;
    demoUrl: string | null;
    order: number;
    isActive: boolean;
}

interface Props {
    initialProducts: ProductData[];
}

const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ProductsClient({ initialProducts }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("FiMonitor");
    const [features, setFeatures] = useState("");
    const [image, setImage] = useState("");
    const [order, setOrder] = useState(0);

    const filteredProducts = initialProducts.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setSelectedProduct(null);
        setName(""); setTagline(""); setDescription(""); setIcon("FiMonitor"); setFeatures(""); setImage(""); setOrder(initialProducts.length + 1);
        setError(null); setIsModalOpen(true);
    };

    const openEdit = (product: ProductData) => {
        setSelectedProduct(product);
        setName(product.name);
        setTagline(product.tagline);
        setDescription(product.description);
        setIcon(product.icon);
        setImage(product.image || "");
        const f = Array.isArray(product.features) ? product.features : [];
        setFeatures(f.join(", "));
        setOrder(product.order);
        setError(null); setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!name.trim() || !tagline.trim() || !description.trim()) {
            setError("Name, tagline, and description are required.");
            return;
        }
        const featureList = features.split(",").map((f) => f.trim()).filter(Boolean);

        startTransition(async () => {
            try {
                const payload = {
                    name: name.trim(),
                    slug: slugify(name),
                    tagline: tagline.trim(),
                    description: description.trim(),
                    icon,
                    image: image || undefined,
                    features: featureList,
                    order,
                };
                if (selectedProduct) {
                    await updateProduct(selectedProduct.id, payload);
                } else {
                    await createProduct(payload);
                }
                setIsModalOpen(false); setSelectedProduct(null);
                router.refresh();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to save product.");
            }
        });
    };

    const confirmDelete = () => {
        if (!selectedProduct) return;
        startTransition(async () => {
            try {
                await deleteProduct(selectedProduct.id);
                setIsDeleteModalOpen(false); setSelectedProduct(null);
                router.refresh();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to delete.");
            }
        });
    };

    const handleToggle = (id: string) => {
        startTransition(async () => {
            try { await toggleProductStatus(id); router.refresh(); }
            catch (err) { console.error("Toggle failed", err); }
        });
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader
                title="Products"
                subtitle="Manage your SaaS products and services"
                action={{ label: "Add Product", onClick: openCreate }}
            />

            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="dashboard-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                        <FiBox className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.tagline}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                    {product.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(Array.isArray(product.features) ? product.features : []).slice(0, 3).map((f: string, i: number) => (
                                    <span key={i} className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">{f}</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                                <button onClick={() => openEdit(product)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /> Edit</button>
                                <button onClick={() => handleToggle(product.id)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><FiEye className="w-4 h-4" /> {product.isActive ? "Deactivate" : "Activate"}</button>
                                <button onClick={() => { setSelectedProduct(product); setIsDeleteModalOpen(true); }} disabled={isPending} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <FiBox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
                        <p className="text-gray-500 mb-4">{searchQuery ? "Try adjusting your search terms" : "Get started by adding your first product"}</p>
                        <button onClick={openCreate} className="btn btn-primary"><FiPlus className="w-4 h-4" /> Add Product</button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">{selectedProduct ? "Edit Product" : "Add New Product"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Smart POS" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tagline *</label>
                                <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., Point of Sale Reimagined" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Features (comma-separated)</label>
                                <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g., Real-time Analytics, Multi-location, Offline Mode" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Image (Optional)</label>
                                <ImageUpload value={image} onChange={setImage} disabled={isPending} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                                    <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                                        <option value="FiMonitor">Monitor</option>
                                        <option value="FiPackage">Package</option>
                                        <option value="FiFileText">File</option>
                                        <option value="FiGlobe">Globe</option>
                                        <option value="FiSmartphone">Smartphone</option>
                                        <option value="FiBox">Box</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                                    <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsModalOpen(false); setSelectedProduct(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary" disabled={isPending}>{isPending ? "Saving..." : selectedProduct ? "Save Changes" : "Add Product"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Product</h3>
                            <p className="text-gray-400">Are you sure you want to delete <span className="text-white font-medium">{selectedProduct.name}</span>? This action cannot be undone.</p>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSelectedProduct(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={confirmDelete} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>{isPending ? "Deleting..." : "Delete Product"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
