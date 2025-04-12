import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useAllCategories } from "@/hooks/useAllCategories";
import { ImageData } from "@/components/ui/upload/MultiImageUpload";
import { ProductFormFields } from "@/types/products/product-form";

export function useEditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const form = useForm<ProductFormFields>();
  const { setValue } = form;
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);

  const { data: product, isLoading } = useGetProduct(Number(id));
  const updateProduct = useUpdateProduct();
  const { categories, loading } = useAllCategories();

  const deletedCategory =
    product && product.category && !categories.find((cat) => cat.id === product.category.id)
      ? product.category.id
      : null;

  useEffect(() => {
    if (product && categories.length > 0) {
      const category = categories.find((c) => c.id === product.category?.id);
      if (category) {
        setValue("category_id", category.id, { shouldValidate: true });
      }
    }
  }, [product, categories, setValue]);

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
        category_id: categories.find((c) => c.id === product.category?.id)
          ? product.category.id
          : undefined,
      });

      const imageData: ImageData[] =
        product.images?.map((img) => ({ id: img.id, url: img.url })) || [];

      setImageUrls(imageData);
    }
  }, [product, form]);

  const handleUpdateProduct = async (data: ProductFormFields) => {
    try {
      await updateProduct(Number(id), {
        ...data,
        imageUrls: imageUrls.map((img) => (typeof img === "string" ? { url: img } : img)),
      });
      toast.success("แก้ไขสินค้าสำเร็จแล้ว");
      router.push("/products");
    } catch (err) {
      toast.error("ไม่สามารถแก้ไขสินค้าได้");
      console.error("updateProduct error:", err);
    }
  };

  return {
    form,
    imageUrls,
    setImageUrls,
    handleUpdateProduct,
    isLoading,
    categories,
    deletedCategory,
    loading,
  };
}
