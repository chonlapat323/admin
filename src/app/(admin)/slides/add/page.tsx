"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";
import SlideForm from "@/components/form/slide/SlideForm";
import { SlideFormFields } from "@/types/slide";
import { useCreateSlide } from "@/hooks/slides/useCreateSlide";

export default function AddSlidePage() {
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);
  const { handleCreateSlide } = useCreateSlide();
  const form = useForm<SlideFormFields>({
    defaultValues: { is_default: false, is_active: true },
  });
  const onSubmit = async (values: SlideFormFields) => {
    await handleCreateSlide(values);
  };
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">เพิ่มสไลด์ใหม่</h2>

      <SlideForm
        form={form}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        onSubmit={onSubmit}
        isSave={true}
      />
    </div>
  );
}
