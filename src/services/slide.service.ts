// File: services/slide.service.ts
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { SlideFormFields } from "@/types/slide";

export async function getSlides(page: number = 1) {
  const res = await fetchWithAuth(`${API_URL}/slides?page=${page}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch slides");
  return res.json();
}

export async function createSlide(data: SlideFormFields) {
  const payload = {
    ...data,
    imageUrls: data.imageUrls?.map((img) => (typeof img === "string" ? { url: img } : img)),
  };
  const res = await fetchWithAuth(`${API_URL}/slides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create slide failed: ${text}`);
  }

  return res.json();
}

export async function getSlide(id: string): Promise<any> {
  const res = await fetchWithAuth(`${API_URL}/slides/${id}`);
  if (!res.ok) throw new Error("Failed to fetch slide");

  return res.json();
}

export async function updateSlide(id: number, data: any): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/slides/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
}

export async function deleteSlide(id: number) {
  const res = await fetchWithAuth(`${API_URL}/slides/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete slide");
  return res.json();
}

export async function deleteSlidetImage(imageId: number) {
  const res = await fetchWithAuth(`${API_URL}/slides/images/${imageId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("ลบรูปภาพไม่สำเร็จ");
  }

  return res.json();
}
