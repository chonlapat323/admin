"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSlide } from "@/services/slide.service";
import { SlideFormFields } from "@/types/slide";

export function useCreateSlide() {
  const router = useRouter();

  const handleCreateSlide = async (formData: SlideFormFields) => {
    try {
      await createSlide(formData);
      toast.success("Slide created successfully!");
      router.push("/slides");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create slide");
    }
  };

  return { handleCreateSlide };
}
