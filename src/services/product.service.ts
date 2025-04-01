// Update to: src/services/product.service.ts

import { Product } from "@/hooks/useProducts";
import { API_URL } from "@/lib/config";

export async function getAllProducts(page: number = 1): Promise<{
  data: Product[];
  pageCount: number;
}> {
  const res = await fetch(`${API_URL}/products?page=${page}`, {
    next: { tags: ["products"] },
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function createProduct(formData: FormData) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}
