"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategory } from "@/services/category.service";
import { CategoryFormFields } from "@/types/categories/CategoryForm";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { handleHttpError } from "@/utils/error/errors";

export function useCreateCategory(form: UseFormReturn<CategoryFormFields>) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { setError } = form;

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(undefined);
    }
  };

  const handleSubmit = async (values: CategoryFormFields) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description ?? "");
      formData.append("is_active", values.is_active ? "true" : "false");
      if (values.link) {
        formData.append("link", values.link);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createCategory(formData);

      toast.success("Category created successfully");
      router.push("/categories");
    } catch (error) {
      handleHttpError<CategoryFormFields>(error, setError);
    }
  };

  const handleFormDataSubmit = async (formData: FormData) => {
    const values: CategoryFormFields = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      link: formData.get("link") as string,
      is_active: formData.get("is_active") === "true",
    };
    await handleSubmit(values);
  };

  return {
    imageFile,
    imagePreview,
    handleImageChange,
    handleFormDataSubmit,
  };
}
