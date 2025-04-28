"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryForm from "@/components/form/category/CategoryForm";
import { CategoryFormFields } from "@/types/categories/CategoryForm";
import { useForm } from "react-hook-form";
import { useEditCategory } from "@/hooks/categories/useEditCategory";

export default function EditCategoryPage() {
  const form = useForm<CategoryFormFields>();
  const { loading, imagePreview, handleImageChange, handleFormDataSubmit } = useEditCategory(form);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Breadcrumb
        items={[{ label: "Category List", href: "/categories" }, { label: "Edit Category" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

      <CategoryForm
        form={form}
        onSubmit={handleFormDataSubmit}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        isSave={false}
      />
    </div>
  );
}
