"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import ProductForm, { ProductFormFields } from "@/components/form/product/ProductForm";
import { useGetProduct, useUpdateProduct } from "@/hooks/useProducts";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const form = useForm<ProductFormFields>();
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);
  const { data: product, isLoading } = useGetProduct(Number(id));
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        is_active: product.is_active,
        tags: product.tags?.map((tag) => tag.name).join(",") || "",
      });

      // ✅ map รูปเป็น ImageData
      const imageData: ImageData[] =
        product.images?.map((img) => ({
          id: img.id,
          url: img.url,
        })) || [];

      setImageUrls(imageData);
    }
  }, [product, form]);

  const handleUpdateProduct = async (data: ProductFormFields) => {
    try {
      await updateProduct(Number(id), {
        ...data,
        imageUrls: imageUrls.map((img) => img.url), // ✅ ส่งเฉพาะ url string[]
      });
      toast.success("แก้ไขสินค้าสำเร็จแล้ว");
      router.push("/products");
    } catch (err) {
      toast.error("ไม่สามารถแก้ไขสินค้าได้");
      console.error("updateProduct error:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">แก้ไขสินค้า</h2>

      {!isLoading && product && (
        <ProductForm
          form={form}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          onSubmit={handleUpdateProduct}
          isSave={false}
        />
      )}
    </div>
  );
}
