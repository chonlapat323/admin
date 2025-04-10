"use client";

import { UseFormReturn } from "react-hook-form";
import MultiImageUpload, { ImageData } from "@/components/ui/upload/MultiImageUpload";

export type SlideFormFields = {
  title: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  imageUrls?: string[];
};

type SlideFormProps = {
  form: UseFormReturn<SlideFormFields>;
  imageUrls: ImageData[];
  setImageUrls: (urls: ImageData[]) => void;
  onSubmit: (form: SlideFormFields) => void;
  isSave: boolean;
};

export default function SlideForm({
  form,
  imageUrls,
  setImageUrls,
  onSubmit,
  isSave,
}: SlideFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form;

  const onFormSubmit = (data: SlideFormFields) => {
    const payload: SlideFormFields = {
      ...data,
      imageUrls: imageUrls.map((img) => img.url),
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-xl w-full space-y-5 text-left"
      autoComplete="off"
    >
      <div>
        <label>Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.title && touchedFields.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slide Images</label>
        <MultiImageUpload
          maxFiles={4}
          type="slide"
          onImagesChange={(images) => {
            const newData = images.map((img) => ({ url: typeof img === "string" ? img : img.url }));
            setImageUrls(newData);
          }}
          initialUrls={!isSave ? imageUrls : undefined}
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_default")} defaultChecked className="w-4 h-4" />
        <label>Default</label>
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
          {isSave ? "Add Slide" : "Update Slide"}
        </button>
      </div>
    </form>
  );
}
