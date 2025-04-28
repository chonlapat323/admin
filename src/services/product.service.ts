import { ProductFormFields } from "@/types/products/product-form";
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { PaginatedResponse } from "@/types/PaginatedResonse";
import { Product } from "@/types/products/product";
import { DeleteResponse } from "@/types/DeleteResponse";

export function getProducts(page: number = 1): Promise<PaginatedResponse<Product>> {
  return fetchWithAuth<PaginatedResponse<Product>>(`${API_URL}/products/paginated?page=${page}`, {
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
    imageUrls: data.image_urls?.map((img) => ({ url: img.url })),
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
