// File: src/services/upload.service.ts

import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetchWithAuth(`${API_URL}/products/upload-multiple`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const data = await res.json();
  if (!Array.isArray(data.urls)) {
    throw new Error("Invalid response format");
  }

  return data.urls;
}
