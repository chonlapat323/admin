// File: hooks/useSlides.ts
"use client";

import { useEffect, useState } from "react";
import { createSlide, getSlides } from "@/services/slide.service";
import { SlideFormFields } from "@/components/form/slide/SlideForm";
import { Slide } from "@/types/slide";

export function useSlides(page: number = 1) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
