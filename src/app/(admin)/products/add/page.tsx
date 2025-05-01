"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "@/hooks/products/useCreateProduct";
import { ProductFormFields } from "@/types/products/product-form";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";
import ProductForm from "@/components/form/product/ProductForm";
import { useAllCategories } from "@/hooks/categories/useAllCategories";

export default function AddProductPage() {
  const form = useForm<ProductFormFields>({ defaultValues: { is_active: true } });
  const { handleSubmit } = useCreateProduct(form);
  const { categories, loading } = useAllCategories();
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Product</h2>

      <ProductForm
        form={form}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        onSubmit={handleSubmit}
        isSave={true}
        categories={categories}
        deletedCategoryId={null}
      />
    </div>
  );
}
