"use client";

import { UseFormReturn } from "react-hook-form";
import MultiImageUpload, { ImageData } from "@/components/ui/upload/MultiImageUpload";
import { useAllCategories } from "@/hooks/useAllCategories";
import Select from "../Select";

export type ProductFormFields = {
  category_id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand: string;
  is_active: boolean;
  tags?: string;
  imageUrls?: string[];
};

type ProductFormProps = {
  form: UseFormReturn<ProductFormFields>;
  imageUrls: ImageData[];
  setImageUrls: (urls: ImageData[]) => void;
  onSubmit: (form: ProductFormFields) => void;
  isSave: boolean;
};

const ProductForm = ({ form, imageUrls, setImageUrls, onSubmit, isSave }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = form;
  const { categories, loading } = useAllCategories();
  const onFormSubmit = (data: ProductFormFields) => {
    const payload: ProductFormFields = {
      ...data,
      tags: data.tags,
      imageUrls: imageUrls.map((img) => img.url),
    };
    onSubmit(payload);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-xl w-full space-y-5 text-left"
      autoComplete="off"
    >
      <div>
        <label>Category</label>
        <Select
          options={categoryOptions}
          placeholder="Select a category"
          value={watch("category_id")?.toString() ?? ""}
          onChange={(val) => setValue("category_id", parseInt(val))}
          className="dark:bg-dark-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Product Images</label>
        <MultiImageUpload
          maxFiles={4}
          onImagesChange={(images) => {
            const newData = images.map((img) => ({ url: typeof img === "string" ? img : img.url }));
            setImageUrls(newData);
          }}
          initialUrls={!isSave ? imageUrls : undefined}
        />
      </div>

      {/* ส่วนฟอร์มอื่น ๆ คงเดิม */}
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
