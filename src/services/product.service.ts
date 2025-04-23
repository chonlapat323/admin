// Update to: src/services/product.service.ts

import { ProductFormFields } from "@/types/products/product-form";
import { Product } from "@/hooks/useProducts";
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function getAllProducts(page: number = 1): Promise<{
  data: Product[];
  pageCount: number;
}> {
  const res = await fetchWithAuth(`${API_URL}/products?page=${page}`, {
    next: { tags: ["products"] },
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function createProduct(data: ProductFormFields) {
  const payload = {
    ...data,
    imageUrls: data.imageUrls?.map((img) => (typeof img === "string" ? { url: img } : img)),
  };

  const res = await fetchWithAuth(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Create product failed");

  return res.json();
}

export async function deleteProductImage(imageId: number) {
  const res = await fetchWithAuth(`${API_URL}/products/images/${imageId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("ลบรูปภาพไม่สำเร็จ");
  }

  return res.json();
}
