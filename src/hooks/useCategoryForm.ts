"use client";

import { useState } from "react";

export function useCategoryForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(undefined);
    }
  };

  return {
    imageFile,
    imagePreview,
    handleImageChange,
  };
}
