"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryForm, { CategoryFormFields } from "@/components/form/category/CategoryForm";
import { useCategory } from "@/hooks/useCategory";
import { updateCategory } from "@/services/category.service";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const form = useForm<CategoryFormFields>();
  const { reset, setError } = form;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const { category, loading, imagePreview, setImagePreview } = useCategory(categoryId, reset);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : undefined);
  };

  const handleSubmit = async (formData: FormData) => {
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await updateCategory(categoryId, formData);

    if (!res.ok) {
      toast.error("ไม่สามารถแก้ไขหมวดหมู่ได้");
      if (res.status === 409) {
        setError("name", {
          type: "manual",
          message: "ชื่อหมวดหมู่มีอยู่แล้ว",
        });
      }
      return;
    }

    toast.success("แก้ไขหมวดหมู่สำเร็จ");
    router.push("/categories");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Breadcrumb
        items={[{ label: "Category List", href: "/categories" }, { label: "Edit Category" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

      <CategoryForm
        form={form}
        onSubmit={handleSubmit}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        isSave={false}
      />
    </div>
  );
}
