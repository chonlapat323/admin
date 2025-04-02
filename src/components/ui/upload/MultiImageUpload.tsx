// File: src/components/ui/upload/MultiImageUpload.tsx
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useUploadImages } from "@/hooks/ui/useUploadImages";

interface MultiImageUploadProps {
  maxFiles?: number;
  onUploadSuccess: (urls: string[]) => void;
}

export default function MultiImageUpload({ maxFiles = 5, onUploadSuccess }: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { upload, uploading } = useUploadImages();

  const handleFiles = async (files: FileList) => {
    if (previews.length >= maxFiles) {
      toast.warning(`คุณสามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const selected = Array.from(files).slice(0, maxFiles - previews.length);
    const previewUrls = selected.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewUrls]);

    try {
      const urls = await upload(selected);
      const newUrls = [...uploadedUrls, ...urls];
      setUploadedUrls(newUrls);
      onUploadSuccess(newUrls);
    } catch (err) {
      toast.error("อัปโหลดรูปไม่สำเร็จ");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setUploadedUrls(newUrls);
    onUploadSuccess(newUrls);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        อัปโหลดรูปภาพ
      </label>
      {uploadedUrls.length >= maxFiles && (
        <p className="text-sm text-yellow-600 mt-2">คุณได้อัปโหลดครบ {maxFiles} รูปแล้ว</p>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`border-2 border-dashed rounded-lg text-center p-6 transition-all cursor-pointer ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 dark:border-white/20"
        }`}
      >
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          multiple
          hidden
          onChange={handleInputChange}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ลากรูปเข้ามาหรือคลิกเพื่อเลือกไฟล์ (สูงสุด {maxFiles} รูป)
        </p>

        {previews.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {previews.map((url, idx) => (
              <div key={idx} className="relative group w-24 h-24 rounded overflow-hidden">
                <Image
                  src={url}
                  alt={`preview-${idx}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 text-xs bg-black/70 text-white rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadedUrls.length >= maxFiles && (
          <p className="text-sm text-yellow-600 mt-2">คุณได้อัปโหลดครบ {maxFiles} รูปแล้ว</p>
        )}

        {uploading && <p className="text-sm text-blue-500 mt-4">กำลังอัปโหลด...</p>}
      </div>
    </div>
  );
}
