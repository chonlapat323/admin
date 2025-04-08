// File: src/hooks/useUploadImages.ts
"use client";

import { uploadImages } from "@/services/ui/upload.service";
import { useState } from "react";

export function useUploadImages() {
  const [uploading, setUploading] = useState(false);

  const upload = async (
    files: File[],
    type: "product" | "slide" = "product" // ใส่ default ไว้เผื่อคนลืมส่ง
  ): Promise<string[]> => {
    setUploading(true);
    try {
      const urls = await uploadImages(files, type);
      return urls;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
