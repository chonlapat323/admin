"use client";

import { useForm } from "react-hook-form";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryForm, { CategoryFormFields } from "@/components/form/category/CategoryForm";
import { useCategoryForm } from "@/hooks/useCategoryForm";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const router = useRouter();
  const form = useForm<CategoryFormFields>();
  const { setError } = form;
  const { imagePreview, handleImageChange, handleSubmit } = useCategoryForm(setError, router);

  return (
    <div className="max-w-2xl">
      <Breadcrumb
        items={[{ label: "Category List", href: "/categories" }, { label: "Add Category" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>

      <CategoryForm
        form={form}
        onSubmit={handleSubmit}
        onImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSave={true}
      />
    </div>
  );
}
