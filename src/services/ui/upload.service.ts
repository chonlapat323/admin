// File: src/services/upload.service.ts

import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function uploadImages(
  files: File[],
  type: "product" | "slide" = "product"
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const endpoint =
    type === "slide" ? `${API_URL}/slides/upload-multiple` : `${API_URL}/products/upload-multiple`;

  const res = await fetchWithAuth(endpoint, {
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
