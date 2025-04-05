"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryForm, { CategoryFormFields } from "@/components/form/category/CategoryForm";
import { useCategoryForm } from "@/hooks/useCategoryForm";
import { createCategory } from "@/services/category.service";

export default function AddCategoryPage() {
  const router = useRouter();
  const form = useForm<CategoryFormFields>();
  const { setError } = form;

  const { imageFile, imagePreview, handleImageChange } = useCategoryForm();

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
    router.push("/category");
  };

  return (
    <div className="max-w-2xl">
      <Breadcrumb
        items={[{ label: "Category List", href: "/category" }, { label: "Add Category" }]}
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
