"use client";

import ProductForm from "@/components/form/product/ProductForm";
import { useEditProduct } from "@/hooks/products/useEditProduct";

export default function EditProductPage() {
  const { form, imageUrls, setImageUrls, handleSubmit, categories, deletedCategory, loading } =
    useEditProduct();

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">แก้ไขสินค้า</h2>
      <ProductForm
        form={form}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        onSubmit={handleSubmit}
        isSave={false}
        categories={categories}
        deletedCategoryId={deletedCategory}
        loading={loading}
      />
    </div>
  );
}
