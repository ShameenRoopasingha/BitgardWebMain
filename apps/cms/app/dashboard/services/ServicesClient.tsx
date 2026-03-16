"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiBriefcase,
} from "react-icons/fi";
import {
    createService, updateService, deleteService, toggleServiceStatus,
} from "@/lib/actions";

interface ServiceData {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    features: string[];
    order: number;
    isActive: boolean;
}

interface Props {
    initialServices: ServiceData[];
}

const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ServicesClient({ initialServices }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("FiCode");
    const [features, setFeatures] = useState("");
    const [order, setOrder] = useState(0);

    const filteredServices = initialServices.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setSelectedService(null);
        setName("");
        setDescription("");
        setIcon("FiCode");
        setFeatures("");
        setOrder(initialServices.length + 1);
        setError(null);
        setIsModalOpen(true);
    };

    const openEdit = (service: ServiceData) => {
        setSelectedService(service);
        setName(service.name);
        setDescription(service.description);
        setIcon(service.icon);
        const f = Array.isArray(service.features) ? service.features : [];
        setFeatures(f.join(", "));
        setOrder(service.order);
        setError(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!name.trim() || !description.trim()) {
            setError("Name and description are required.");
            return;
        }
        const featureList = features.split(",").map((f) => f.trim()).filter(Boolean);

        startTransition(async () => {
            try {
                if (selectedService) {
                    await updateService(selectedService.id, {
                        name: name.trim(),
                        slug: slugify(name),
                        description: description.trim(),
                        icon,
                        features: featureList,
                        order,
                    });
                } else {
                    await createService({
                        name: name.trim(),
                        slug: slugify(name),
                        description: description.trim(),
                        icon,
                        features: featureList,
                        order,
                    });
                }
                setIsModalOpen(false);
                setSelectedService(null);
                router.refresh();
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Failed to save service.";
                setError(msg);
            }
        });
    };

    const confirmDelete = () => {
        if (!selectedService) return;
        startTransition(async () => {
            try {
                await deleteService(selectedService.id);
                setIsDeleteModalOpen(false);
                setSelectedService(null);
                router.refresh();
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Failed to delete.";
                setError(msg);
            }
        });
    };

    const handleToggle = (id: string) => {
        startTransition(async () => {
            try {
                await toggleServiceStatus(id);
                router.refresh();
            } catch (err) {
                console.error("Toggle failed", err);
            }
        });
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader
                title="Services"
                subtitle="Manage your service offerings"
                action={{ label: "Add Service", onClick: openCreate }}
            />

            <div className="p-6 space-y-6">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div key={service.id} className="dashboard-card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <FiBriefcase className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                                        <p className="text-sm text-gray-500">Order: {service.order}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${service.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                    {service.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {(Array.isArray(service.features) ? service.features : []).slice(0, 3).map((feature: string, i: number) => (
                                    <span key={i} className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">{feature}</span>
                                ))}
                                {Array.isArray(service.features) && service.features.length > 3 && (
                                    <span className="px-2 py-1 text-xs bg-gray-800 text-gray-500 rounded">+{service.features.length - 3} more</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                                <button onClick={() => openEdit(service)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                    <FiEdit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => handleToggle(service.id)} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                    <FiEye className="w-4 h-4" /> {service.isActive ? "Deactivate" : "Activate"}
                                </button>
                                <button onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }} disabled={isPending} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" aria-label="Delete service">
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <FiBriefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
                        <p className="text-gray-500 mb-4">{searchQuery ? "Try adjusting your search terms" : "Get started by adding your first service"}</p>
                        <button onClick={openCreate} className="btn btn-primary"><FiPlus className="w-4 h-4" /> Add Service</button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">{selectedService ? "Edit Service" : "Add New Service"}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Service Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Custom Development" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your service..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Features (comma-separated)</label>
                                <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g., Full-stack development, API integrations, Legacy modernization" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                                    <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                                        <option value="FiCode">Code</option>
                                        <option value="FiLayout">Layout</option>
                                        <option value="FiDatabase">Database</option>
                                        <option value="FiCloud">Cloud</option>
                                        <option value="FiShield">Security</option>
                                        <option value="FiHeadphones">Support</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                                    <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsModalOpen(false); setSelectedService(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary" disabled={isPending}>
                                {isPending ? "Saving..." : selectedService ? "Save Changes" : "Add Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleteModalOpen && selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Service</h3>
                            <p className="text-gray-400">Are you sure you want to delete <span className="text-white font-medium">{selectedService.name}</span>? This action cannot be undone.</p>
                        </div>
                        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSelectedService(null); }} className="btn btn-secondary" disabled={isPending}>Cancel</button>
                            <button onClick={confirmDelete} className="btn bg-red-600 text-white hover:bg-red-700" disabled={isPending}>
                                {isPending ? "Deleting..." : "Delete Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
