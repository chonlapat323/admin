// File: src/components/products/ProductForm.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import MultiImageUpload from "@/components/ui/upload/MultiImageUpload";

export type ProductFormFields = {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand: string;
  is_active: boolean;
  tags?: string;
};

type ProductFormProps = {
  form: UseFormReturn<ProductFormFields>;
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  onSubmit: (form: FormData) => void;
  isSave: boolean;
};

const ProductForm = ({ form, imageUrls, setImageUrls, onSubmit, isSave }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form;

  const onFormSubmit = (data: ProductFormFields) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "discountPrice" && value === undefined) return;
      formData.append(key, value?.toString() ?? "");
    });

    imageUrls.forEach((url) => formData.append("imageUrls", url));

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-xl w-full space-y-5 text-left"
      autoComplete="off"
    >
      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Images</label>
        <MultiImageUpload
          maxFiles={4}
          onUploadSuccess={(urls) => setImageUrls([...imageUrls, ...urls])}
        />
      </div>

      <div>
        <label>Name</label>
        <input
          {...register("name", { required: "Product name is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.name && touchedFields.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label>Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={3}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.description && touchedFields.description && (
          <p className="text-red-600 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label>Price</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: "Price is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.price && touchedFields.price && (
          <p className="text-red-600 text-sm">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label>Discount Price</label>
        <input
          type="number"
          step="0.01"
          {...register("discountPrice")}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label>Stock</label>
        <input
          type="number"
          {...register("stock", { required: "Stock is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.stock && touchedFields.stock && (
          <p className="text-red-600 text-sm">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label>SKU</label>
        <input
          {...register("sku", { required: "SKU is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.sku && touchedFields.sku && (
          <p className="text-red-600 text-sm">{errors.sku.message}</p>
        )}
      </div>

      <div>
        <label>Brand</label>
        <input
          {...register("brand", { required: "Brand is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.brand && touchedFields.brand && (
          <p className="text-red-600 text-sm">{errors.brand.message}</p>
        )}
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input
          {...register("tags")}
          placeholder="เช่น summer,เสื้อผ้า,ใหม่"
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked className="w-4 h-4" />
        <label>Active</label>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSave ? "Add Product" : "Update Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
