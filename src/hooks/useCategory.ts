// hooks/useCategory.ts
import { useEffect, useState } from "react";
import { getCategoryById } from "@/services/category.service";
import { Category } from "@/types/category";
import { UseFormReset } from "react-hook-form";
import { CategoryFormFields } from "@/components/form/category/CategoryForm";

export function useCategory(id: string, reset: UseFormReset<CategoryFormFields>) {
  const [category, setCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCategoryById(id);
        setCategory(res);

        reset({
          name: res.name,
          description: res.description || "",
          is_active: res.is_active,
          link: res.link,
        });

        setImagePreview(res.image ? `${process.env.NEXT_PUBLIC_API_URL}${res.image}` : undefined);
      } catch (err) {
        console.error("Failed to fetch category", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, reset]);

  return {
    category,
    loading,
    imagePreview,
    setImagePreview,
  };
}
