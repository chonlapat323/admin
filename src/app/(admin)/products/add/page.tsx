"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ProductForm, { ProductFormFields } from "@/components/form/product/ProductForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProduct } from "@/hooks/useProducts";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";

export default function AddProductPage() {
  const form = useForm<ProductFormFields>({
    defaultValues: { is_active: true },
  });
  const router = useRouter();
  const createProduct = useCreateProduct();

  // ✅ ใช้ ImageData[] แทน string[]
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);

  const handleCreateProduct = async (formData: ProductFormFields) => {
    try {
      await createProduct(formData);
      toast.success("เพิ่มสินค้าสำเร็จแล้ว");
      router.push("/products");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการสร้างสินค้า");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">เพิ่มสินค้าใหม่</h2>

      <ProductForm
        form={form}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        onSubmit={handleCreateProduct}
        isSave={true}
      />
    </div>
  );
}
