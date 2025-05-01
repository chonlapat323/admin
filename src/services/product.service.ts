import { ProductFormFields } from "@/types/products/product-form";
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { PaginatedResponse } from "@/types/PaginatedResonse";
import { Product } from "@/types/products/product";
import { DeleteResponse } from "@/types/DeleteResponse";

export function getProducts({
  page,
  limit,
  search,
  category_id,
  is_active,
}: {
  page: number;
  limit: number;
  search?: string;
  category_id?: string;
  is_active?: string;
}): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.set("search", search);
  if (category_id) params.set("category_id", category_id);
  if (is_active) params.set("is_active", is_active);

  return fetchWithAuth<PaginatedResponse<Product>>(`${API_URL}/products/paginated?${params}`, {
    method: "GET",
    cache: "no-store",
  });
}

export function getProduct(id: number): Promise<Product> {
  return fetchWithAuth<Product>(`${API_URL}/products/${id}`);
}

export function createProduct(data: ProductFormFields): Promise<Product> {
  const payload = {
    ...data,
    image_urls: data.image_urls?.map((img) => ({ url: img.url })),
  };

  return fetchWithAuth<Product>(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: number, payload: ProductFormFields): Promise<Product> {
  return fetchWithAuth<Product>(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number): Promise<DeleteResponse> {
  return fetchWithAuth<DeleteResponse>(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
}

export function deleteProductImage(imageId: number): Promise<DeleteResponse> {
  return fetchWithAuth<DeleteResponse>(`${API_URL}/products/images/${imageId}`, {
    method: "DELETE",
  });
}
