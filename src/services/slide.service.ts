import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { SlideListResponse } from "@/types/api/slide/SlideListResponse";
import { DeleteSlideResponse, Slide, SlideFormFields } from "@/types/slide";

export function getSlides(page: number = 1): Promise<SlideListResponse> {
  return fetchWithAuth<SlideListResponse>(`${API_URL}/slides?page=${page}`, {
    method: "GET",
  });
}

export function createSlide(data: SlideFormFields): Promise<Slide> {
  const payload = {
    ...data,
    imageUrls: data.imageUrls?.map((img) => (typeof img === "string" ? { url: img } : img)),
  };
  return fetchWithAuth<Slide>(`${API_URL}/slides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getSlide(id: number): Promise<Slide> {
  return fetchWithAuth<Slide>(`${API_URL}/slides/${id}`);
}

export function updateSlide(id: number, data: SlideFormFields): Promise<Slide> {
  return fetchWithAuth<Slide>(`${API_URL}/slides/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteSlide(id: number): Promise<DeleteSlideResponse> {
  return fetchWithAuth<DeleteSlideResponse>(`${API_URL}/slides/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function deleteSlidetImage(id: number): Promise<DeleteSlideResponse> {
  return fetchWithAuth<DeleteSlideResponse>(`${API_URL}/slides/remove-image/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}
