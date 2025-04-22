"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useUploadImages } from "@/hooks/ui/useUploadImages";
import ConfirmModal from "../modal/ConfirmModal";
import { deleteProductImage } from "@/services/product.service";

import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type ImageData = {
  id?: number;
  url: string;
};

interface MultiImageUploadProps {
  type?: "product" | "slide";
  maxFiles?: number;
  onImagesChange: (images: ImageData[]) => void;
  initialUrls?: ImageData[];
}

export default function MultiImageUpload({
  type = "product",
  maxFiles = 5,
  onImagesChange,
  initialUrls = [],
}: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { upload, uploading } = useUploadImages();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (initialUrls.length > 0) {
      setImages(initialUrls);
    }
  }, [initialUrls]);

  const handleFiles = async (files: FileList) => {
    if (images.length >= maxFiles) {
      toast.warning(`คุณสามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const selected = Array.from(files).slice(0, maxFiles - images.length);
    const previewUrls = selected.map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previewUrls]);

    try {
      const urls = await upload(selected, type);
      const newImages: ImageData[] = urls.map((url) => ({ url }));
      const updated = [...images, ...newImages];
      setImages(updated);
      onImagesChange(updated);
    } catch (err) {
      toast.error("อัปโหลดรูปไม่สำเร็จ");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const askToRemove = (index: number) => {
    setSelectedIndex(index);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (selectedIndex === null) return;

    const image = images[selectedIndex];

    if (image.url.startsWith("/uploads/products") && image.id) {
      try {
        await deleteProductImage(image.id);
      } catch {
        toast.error("ลบรูปภาพไม่สำเร็จ");
      }
    }

    const newImages = [...images];
    newImages.splice(selectedIndex, 1);
    setImages(newImages);
    onImagesChange(newImages);

    setSelectedIndex(null);
    setShowConfirm(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.url === active.id);
    const newIndex = images.findIndex((img) => img.url === over.id);

    const reordered = arrayMove(images, oldIndex, newIndex);
    setImages(reordered);
    onImagesChange(reordered);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        อัปโหลดรูปภาพ
      </label>
      {images.length >= maxFiles && (
        <p className="text-sm text-yellow-600 mt-2">คุณได้อัปโหลดครบ {maxFiles} รูปแล้ว</p>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
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
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ลากรูปเข้ามาหรือคลิกเพื่อเลือกไฟล์ (สูงสุด {maxFiles} รูป)
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={images.map((img, idx) =>
              typeof img.url === "string" ? img.url : `image-${idx}`
            )}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {images.map((img, idx) => {
                const key = typeof img.url === "string" ? img.url : `image-${idx}`;
                return (
                  <SortableImage key={key} image={img} index={idx} askToRemove={askToRemove} />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

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

function SortableImage({
  image,
  index,
  askToRemove,
}: {
  image: ImageData;
  index: number;
  askToRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fullUrl =
    typeof image.url === "string" && (image.url.startsWith("http") || image.url.startsWith("blob:"))
      ? image.url
      : `${process.env.NEXT_PUBLIC_API_URL}${image.url}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-24 h-24 rounded overflow-hidden"
    >
      <div {...attributes} {...listeners} className="w-full h-full">
        <Image
          src={fullUrl}
          alt="preview"
          width={96}
          height={96}
          className="object-cover w-full h-full rounded"
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          console.log("🧨 ลบ index", index); // ทดสอบตรงนี้
          askToRemove(index);
        }}
        className="absolute top-1 right-1 z-10 text-xs bg-black/70 text-white rounded-full px-2 py-0.5 opacity-100 transition"
      >
        ลบ
      </button>
    </div>
  );
}
