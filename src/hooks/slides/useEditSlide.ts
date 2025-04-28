"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SlideFormFields } from "@/types/slide";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";
import { toast } from "sonner";
import { updateSlide } from "@/services/slide.service";
import { useGetSlide } from "./useGetSlide";

export function useEditSlide() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: slide, loading } = useGetSlide(id);
  const form = useForm<SlideFormFields>({
    defaultValues: { is_active: true, is_default: false },
  });
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);

  useEffect(() => {
    if (slide) {
      form.reset({
        title: slide.title,
        description: slide.description,
        is_active: slide.is_active,
        is_default: slide.is_default,
      });

      if (slide.slide_images) {
        const imageData: ImageData[] =
          slide.slide_images?.map((img) => ({ id: img.id, url: img.url })) || [];
        setImageUrls(imageData);
      }
    }
  }, [slide, form]);

  const handleSubmit = async (values: SlideFormFields) => {
    try {
      const updatedSlide = await updateSlide(id, values);
      toast.success(`Updated slide: ${updatedSlide.title}`);
      router.push("/slides");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update slide");
    }
  };

  return {
    form,
    imageUrls,
    setImageUrls,
    handleSubmit,
    loading: loading,
  };
}
