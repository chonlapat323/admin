"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "@/services/product.service";
import { UseFormReturn } from "react-hook-form";
import { ProductFormFields } from "@/types/products/product-form";

export function useCreateProduct(form: UseFormReturn<ProductFormFields>) {
  const router = useRouter();
  const { setError } = form;

  const handleSubmit = async (values: ProductFormFields) => {
    try {
      await createProduct(values);

      toast.success("Product created successfully");
      router.push("/products");
    } catch (error: any) {
      console.error(error);

      if (error?.status === 409) {
        setError("name", {
          type: "manual",
          message: "This product name is already in use.",
        });
      } else {
        toast.error(error?.message || "Failed to create product");
      }
    }
  };

  return { handleSubmit };
}
