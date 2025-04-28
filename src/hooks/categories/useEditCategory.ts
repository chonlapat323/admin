"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_URL } from "@/lib/config";
import { Category } from "@/types/category";
import { CategoryFormFields } from "@/types/categories/CategoryForm";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { updateCategory } from "@/services/category.service"; // เราจะสร้างอันนี้ด้วย

export function useEditCategory(form: UseFormReturn<CategoryFormFields>) {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);
  const { reset, setError } = form;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    fetchWithAuth<Category>(`${API_URL}/categories/${categoryId}`)
      .then((data) => {
        reset({
          name: data.name,
          description: data.description ?? "",
          link: data.link ?? "",
          is_active: data.is_active,
        });
        setImagePreview(data.image ? `${API_URL}${data.image}` : undefined);
      })
      .catch((error) => {
        console.error("Failed to load category", error);
        toast.error("Failed to load category");
        router.push("/categories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId, reset, router]);

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

      await updateCategory(categoryId, formData);

      toast.success("Category updated successfully");
      router.push("/categories");
    } catch (error: any) {
      console.error(error);
      if (error?.statusCode === 409) {
        setError("name", {
          type: "manual",
          message: "This category name is already in use.",
        });
      } else {
        toast.error(error?.message || "Failed to update category");
      }
    }
  };

  const handleFormDataSubmit = async (formData: FormData) => {
    const values: CategoryFormFields = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      link: (formData.get("link") as string) || "",
      is_active: formData.get("is_active") === "true",
    };
    await handleSubmit(values);
  };

  return {
    loading,
    imagePreview,
    handleImageChange,
    handleFormDataSubmit,
  };
}
