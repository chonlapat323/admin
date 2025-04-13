"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import AvatarUpload from "@/components/ui/upload/AvatarUpload";

export type CategoryFormFields = {
  name: string;
  description?: string;
  link?: string;
  is_active: boolean;
};

type CategoryFormProps = {
  form: UseFormReturn<CategoryFormFields>;
  onSubmit: (form: FormData) => void;
  onImageChange?: (file: File | null) => void;
  imagePreview?: string;
  imageLoading?: boolean;
  isSave: boolean;
};

const CategoryForm = ({
  form,
  onSubmit,
  onImageChange,
  imagePreview,
  imageLoading,
  isSave,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form;

  const onFormSubmit = (data: CategoryFormFields) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-xl w-full space-y-5 text-left"
      autoComplete="off"
    >
      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <AvatarUpload value={imagePreview} onChange={onImageChange} loading={imageLoading} />
      </div>

      {/* Name */}
      <div>
        <label>Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.name && touchedFields.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="link" className="block font-medium text-sm text-gray-700">
          ลิงก์ (เช่น bedroom)
        </label>
        <input
          type="text"
          id="link"
          {...register("link")}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="living-room"
        />
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked className="w-4 h-4" />
        <label>Active</label>
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSave ? "Add Category" : "Update Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
