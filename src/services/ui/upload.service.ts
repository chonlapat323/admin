import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

import { UploadImagesResponse } from "@/types/UploadImagesResponse";

export async function uploadImages(
  files: File[],
  type: "product" | "slide" = "product"
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const endpoint =
    type === "slide" ? `${API_URL}/slides/upload-multiple` : `${API_URL}/products/upload-multiple`;

  const data = await fetchWithAuth<UploadImagesResponse>(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!Array.isArray(data.urls)) {
    throw new Error("Invalid response format");
  }

  return data.urls;
}
