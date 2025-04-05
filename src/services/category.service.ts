// services/category.service.ts
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function getCategories(page: number = 1) {
  const res = await fetch(`${API_URL}/categories/paginated?page=${page}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json(); // ✅ คาดว่าได้ { data, total, page, pageCount }
}

export async function createCategory(data: FormData) {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
}

export async function deleteCategory(id: number) {
  const res = await fetchWithAuth(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });

  return res;
}
