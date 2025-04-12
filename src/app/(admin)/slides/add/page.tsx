"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";
import SlideForm, { SlideFormFields } from "@/components/form/slide/SlideForm";
import { useCreateSlide } from "@/hooks/useSlides";

export default function AddSlidePage() {
  const form = useForm<SlideFormFields>({
    defaultValues: { is_default: false, is_active: true },
  });
  const router = useRouter();
  const createSlide = useCreateSlide();

  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);

  const handleCreateSlide = async (formData: SlideFormFields) => {
    try {
      await createSlide(formData);
      toast.success("เพิ่มสไลด์สำเร็จแล้ว");
      router.push("/slides");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการสร้างสไลด์");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">เพิ่มสไลด์ใหม่</h2>

      <SlideForm
        form={form}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        onSubmit={handleCreateSlide}
        isSave={true}
      />
    </div>
  );
}
