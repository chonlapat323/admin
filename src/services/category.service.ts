// services/category.service.ts
import { API_URL } from "@/lib/config";

export async function getCategories(page: number = 1) {
  const res = await fetch(`${API_URL}/categories/paginated?page=${page}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json(); // <- ต้องแน่ใจว่า backend คืนค่า { data, pageCount } มา
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });

  return res;
}
