"use client";

import { createCategory } from "@/services/category.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useCategoryForm(setError: any, router: ReturnType<typeof useRouter>) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(undefined);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await createCategory(formData);

    if (!res.ok) {
      toast.error("Failed to create category.");
      if (res.status === 409) {
        setError("name", {
          type: "manual",
          message: "ชื่อนี้ถูกใช้งานแล้ว",
        });
      }
      return;
    }

    toast.success("Category added successfully!");
    router.push("/categories");
  };

  return {
    imageFile,
    imagePreview,
    handleImageChange,
    handleSubmit,
  };
}
function setError(arg0: string, arg1: { type: string; message: string }) {
  throw new Error("Function not implemented.");
}
