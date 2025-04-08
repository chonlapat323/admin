// File: hooks/useSlides.ts
"use client";

import { useEffect, useState } from "react";
import { getSlides } from "@/services/slide.service";

export function useSlides(page: number = 1) {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getSlides(page)
      .then((res) => {
        setSlides(res.data);
        setTotalPages(res.meta.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return { slides, loading, totalPages, setSlides };
}
