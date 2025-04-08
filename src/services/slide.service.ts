// File: services/slide.service.ts
import { API_URL } from "@/lib/config";

export async function getSlides(page: number = 1) {
  const res = await fetch(`${API_URL}/slides?page=${page}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch slides");
  return res.json();
}

export async function deleteSlide(id: number) {
  const res = await fetch(`${API_URL}/slides/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete slide");
  return res.json();
}
