"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "@/services/product.service";
import { UseFormReturn } from "react-hook-form";
import { ProductFormFields } from "@/types/products/product-form";
import { handleHttpError } from "@/utils/error/errors";

export function useCreateProduct(form: UseFormReturn<ProductFormFields>) {
  const router = useRouter();
  const { setError } = form;

  const handleSubmit = async (values: ProductFormFields) => {
    try {
      await createProduct(values);

      toast.success("Product created successfully");
      router.push("/products");
    } catch (error: unknown) {
      console.error(error);
      handleHttpError<ProductFormFields>(error, setError);
    }
  };

  return { handleSubmit };
}
