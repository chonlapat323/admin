// File: hooks/useSlides.ts
"use client";

import { useEffect, useState } from "react";
import { createSlide, getSlide, getSlides, updateSlide } from "@/services/slide.service";
import { Slide, SlideFormFields, SlideImage } from "@/types/slide";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_URL } from "@/lib/config";

export function useSlides(page: number = 1) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getSlides(page)
      .then((res) => {
        setSlides(res.data);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);
  return { slides, loading, totalPages, setSlides };
}

export function useCreateSlide() {
  return async (formData: SlideFormFields) => {
    await createSlide(formData);
  };
}

export function useGetSlide(id: string) {
  const [data, setData] = useState<Slide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSlide(id)
      .then(setData)
      .catch((err) => console.error("Failed to fetch slide", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data, isLoading };
}

export function useUpdateSlide() {
  return async (id: string, payload: SlideFormFields) => {
    const res = await fetchWithAuth(`${API_URL}/slides/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update slide");
    return res.json();
  };
}
