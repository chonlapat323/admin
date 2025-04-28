"use client";

import { useForm } from "react-hook-form";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryForm from "@/components/form/category/CategoryForm";
import { CategoryFormFields } from "@/types/categories/CategoryForm";
import { useCreateCategory } from "@/hooks/categories/useCreateCategory";

export default function AddCategoryPage() {
  const form = useForm<CategoryFormFields>({
    defaultValues: {
      is_active: true,
    },
  });
  const { imagePreview, handleImageChange, handleFormDataSubmit } = useCreateCategory(form);

  return (
    <div className="max-w-2xl">
      <Breadcrumb
        items={[{ label: "Category List", href: "/categories" }, { label: "Add Category" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>

      <CategoryForm
        form={form}
        onSubmit={handleFormDataSubmit}
        onImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSave={true}
      />
    </div>
  );
}
