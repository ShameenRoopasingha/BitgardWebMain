"use client";

import React, { useState, useRef } from "react";
import { FiUploadCloud, FiTrash2, FiImage } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }

            setIsUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("bitgard-images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
                .from("bitgard-images")
                .getPublicUrl(filePath);

            onChange(publicUrlData.publicUrl);
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to upload image.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="w-full">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleUpload}
                style={{ display: "none" }}
                disabled={disabled || isUploading}
            />

            {value ? (
                <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-white/5 w-full flex items-center justify-center min-h-[160px]">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="object-contain max-h-[250px] w-full p-4"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            disabled={disabled || isUploading}
                            title="Replace Image"
                        >
                            <FiUploadCloud size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 rounded-full transition-colors"
                            disabled={disabled || isUploading}
                            title="Remove Image"
                        >
                            <FiTrash2 size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="w-full flex justify-center items-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all outline-none"
                >
                    <div className="space-y-1 text-center flex flex-col items-center">
                        {isUploading ? (
                            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : (
                            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-400 mt-2">
                            <span className="relative cursor-pointer rounded-md font-medium text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                {isUploading ? "Uploading..." : "Click to select a file"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </button>
            )}
        </div>
    );
}
