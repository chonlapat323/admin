"use client";

import AvatarUpload from "@/components/ui/upload/AvatarUpload";
import { CategoryFormFields, CategoryFormProps } from "@/types/categories/CategoryForm";

const CategoryForm = ({
  form,
  onSubmit,
  onImageChange,
  imagePreview,
  imageLoading,
  isSave,
  imageFile,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = form;

  const onFormSubmit = (values: CategoryFormFields) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description ?? "");
    formData.append("is_active", values.is_active ? "true" : "false");
    if (values.link) {
      formData.append("link", values.link);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-xl w-full space-y-5 text-left"
      autoComplete="off"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <AvatarUpload value={imagePreview} onChange={onImageChange} loading={imageLoading} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className={`w-full px-3 py-2 border rounded-md focus:ring focus:outline-none ${
            errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.name && touchedFields.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Link (e.g. living-room)</label>
        <input
          type="text"
          {...register("link")}
          className={`w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:outline-none ${
            errors.link ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          placeholder="living-room"
        />
        {errors.link && touchedFields.link && (
          <p className="text-red-600 text-sm">{errors.link.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("is_active")}
          checked={watch("is_active")}
          className="w-4 h-4"
        />
        <label className="text-sm">Active</label>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition w-full"
        >
          {isSave ? "Add Category" : "Update Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
