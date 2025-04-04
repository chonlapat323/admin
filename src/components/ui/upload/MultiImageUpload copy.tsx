"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useUploadImages } from "@/hooks/ui/useUploadImages";
import ConfirmModal from "../modal/ConfirmModal";
import { deleteProductImage } from "@/services/product.service";

export type ImageData = {
  id?: number;
  url: string;
};

interface MultiImageUploadProps {
  maxFiles?: number;
  onImagesChange: (urls: string[]) => void;
  initialUrls?: ImageData[]; // รองรับทั้งมี id หรือไม่มี id
}

export default function MultiImageUpload({
  maxFiles = 5,
  onImagesChange,
  initialUrls = [],
}: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<ImageData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { upload, uploading } = useUploadImages();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ preload รูปตอน edit
  useEffect(() => {
    if (initialUrls.length > 0) {
      setPreviews(initialUrls);
      setUploadedUrls(initialUrls);
    }
  }, [initialUrls]);

  const handleFiles = async (files: FileList) => {
    if (previews.length >= maxFiles) {
      toast.warning(`คุณสามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const selected = Array.from(files).slice(0, maxFiles - previews.length);
    const previewUrls: ImageData[] = selected.map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...previewUrls]);

    try {
      const urls = await upload(selected); // return string[]
      const uploadedData: ImageData[] = urls.map((url) => ({ url }));
      const newUploaded = [...uploadedUrls, ...uploadedData];
      setUploadedUrls(newUploaded);
      setPreviews([...previews, ...uploadedData]);
      onImagesChange(newUploaded.map((img) => img.url));
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

  const askToRemove = (index: number) => {
    setSelectedIndex(index);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (selectedIndex === null) return;

    const imageToDelete = uploadedUrls[selectedIndex];

    if (imageToDelete.url.startsWith("/uploads/products") && imageToDelete.id) {
      try {
        await deleteProductImage(imageToDelete.id);
      } catch (err) {
        toast.error("ลบรูปภาพในระบบไม่สำเร็จ");
      }
    }

    const newPreviews = [...previews];
    const newUrls = [...uploadedUrls];
    newPreviews.splice(selectedIndex, 1);
    newUrls.splice(selectedIndex, 1);

    setPreviews(newPreviews);
    setUploadedUrls(newUrls);
    onImagesChange(newUrls.map((img) => img.url)); // <- สำคัญมาก

    setSelectedIndex(null);
    setShowConfirm(false);
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
            {previews.map((img, idx) => {
              const fullUrl =
                typeof img.url === "string"
                  ? img.url.startsWith("http") || img.url.startsWith("blob:")
                    ? img.url
                    : `${process.env.NEXT_PUBLIC_API_URL}${img.url}`
                  : "";
              return (
                <div key={idx} className="relative group w-24 h-24 rounded overflow-hidden">
                  <Image
                    src={fullUrl}
                    alt={`preview-${idx}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      askToRemove(idx);
                    }}
                    className="absolute top-1 right-1 text-xs bg-black/70 text-white rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    ลบ
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {uploading && <p className="text-sm text-blue-500 mt-4">กำลังอัปโหลด...</p>}
      </div>

      <ConfirmModal
        open={showConfirm}
        title="ลบรูปภาพนี้หรือไม่?"
        description="รูปภาพนี้จะถูกลบออกจากรายการ. การกระทำนี้ไม่สามารถย้อนกลับได้"
        onConfirm={confirmRemove}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedIndex(null);
        }}
      />
    </div>
  );
}
