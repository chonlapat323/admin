"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import SlideForm from "@/components/form/slide/SlideForm";
import { useGetSlide, useUpdateSlide } from "@/hooks/useSlides";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";
import { SlideFormFields } from "@/types/slide";

export default function EditSlidePage() {
  const { id } = useParams();
  const router = useRouter();
  const form = useForm<SlideFormFields>();
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);

  const { data: slide, isLoading } = useGetSlide(String(id));
  const updateSlide = useUpdateSlide();

  useEffect(() => {
    if (slide) {
      form.reset({
        title: slide.title,
        description: slide.description,
        is_active: slide.is_active,
        is_default: slide.is_default,
      });

      const imageData: ImageData[] =
        slide.images?.map((img) => ({ id: img.id, url: img.url })) || [];

      setImageUrls(imageData);
    }
  }, [slide, form]);

  const handleUpdateSlide = async (data: SlideFormFields) => {
    try {
      await updateSlide(String(id), {
        ...data,
        imageUrls: imageUrls.map((img) => (typeof img === "string" ? { url: img } : img)),
      });
      toast.success("แก้ไขสไลด์สำเร็จแล้ว");
      router.push("/slides");
    } catch (err) {
      toast.error("ไม่สามารถแก้ไขสไลด์ได้");
      console.error("updateSlide error:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">แก้ไขสไลด์</h2>
      {!isLoading && slide && (
        <SlideForm
          form={form}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          onSubmit={handleUpdateSlide}
          isSave={false}
        />
      )}
    </div>
  );
}
