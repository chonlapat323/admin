// File: src/hooks/useUploadImages.ts
"use client";

import { uploadImages } from "@/services/ui/upload.service";
import { useState } from "react";

export function useUploadImages() {
  const [uploading, setUploading] = useState(false);

  const upload = async (files: File[]): Promise<string[]> => {
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      return urls;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
