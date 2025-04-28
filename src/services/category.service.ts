import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Category } from "@/types/category";
import { DeleteResponse } from "@/types/DeleteResponse";
import { PaginatedResponse } from "@/types/PaginatedResonse";

export function getCategories(page: number = 1): Promise<PaginatedResponse<Category>> {
  return fetchWithAuth<PaginatedResponse<Category>>(
    `${API_URL}/categories/paginated?page=${page}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
}

export function getCategoryById(id: string): Promise<Category> {
  return fetchWithAuth<Category>(`${API_URL}/categories/${id}`);
}

export function createCategory(data: FormData): Promise<Category> {
  return fetchWithAuth<Category>(`${API_URL}/categories`, {
    method: "POST",
    body: data,
  });
}

export function updateCategory(id: number, formData: FormData): Promise<Category> {
  return fetchWithAuth<Category>(`${API_URL}/categories/${id}/update`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteCategory(id: number): Promise<DeleteResponse> {
  return fetchWithAuth<DeleteResponse>(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
}
