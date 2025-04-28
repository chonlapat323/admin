"use client";

import { useEffect, useState } from "react";
import { getSlide } from "@/services/slide.service";
import { Slide } from "@/types/slide";

export function useGetSlide(id: number) {
  const [data, setData] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSlide = async () => {
      setLoading(true);
      try {
        const slide = await getSlide(id);
        setData(slide);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch slide");
      } finally {
        setLoading(false);
      }
    };

    fetchSlide();
  }, [id]);

  return { data, loading, error };
}
