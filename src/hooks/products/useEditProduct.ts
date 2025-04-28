"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { getProduct, updateProduct } from "@/services/product.service";
import { ProductFormFields } from "@/types/products/product-form";
import { toast } from "sonner";
import { useAllCategories } from "../categories/useAllCategories";

export function useEditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  const form = useForm<ProductFormFields>();
  const { reset, setError } = form;
  const { categories, loading: loadingCategories } = useAllCategories();
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{ id?: number; url: string }[]>([]);
  const [deletedCategory, setDeletedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProduct(productId);

        reset({
          category_id: data.category.id,
          name: data.name,
          description: data.description,
          additional_information: data.additional_information || "",
          design: data.design || "",
          price: data.price,
          discount_price: data.discount_price || undefined,
          stock: data.stock,
          sku: data.sku,
          brand: data.brand,
          is_active: data.is_active,
          is_best_seller: data.is_best_seller,
          tags: data.tags.map((tag) => tag.name).join(", "), // เชื่อมเป็น string
          image_urls: data.product_image.map((img) => ({
            id: img.id,
            url: img.url,
          })),
        });

        setImageUrls(
          data.product_image.map((img) => ({
            id: img.id,
            url: img.url,
          }))
        );

        const deletedCategory =
          data && data.category && !categories.find((cat) => cat.id === data.category.id)
            ? data.category.id
            : null;
        setDeletedCategory(deletedCategory);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, reset]);

  const handleSubmit = async (values: ProductFormFields) => {
    try {
      await updateProduct(productId, {
        ...values,
        image_urls: imageUrls,
      });

      toast.success("Product updated successfully");
      router.push("/products");
    } catch (error: any) {
      console.error(error);

      if (error?.status === 409) {
        setError("name", {
          type: "manual",
          message: "This product name is already in use.",
        });
      } else {
        toast.error(error?.message || "Failed to update product");
      }
    }
  };

  return {
    form,
    loading,
    imageUrls,
    deletedCategory,
    categories,
    setImageUrls,
    handleSubmit,
  };
}
