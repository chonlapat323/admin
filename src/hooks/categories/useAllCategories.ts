"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { getAllCategories } from "@/services/category.service";

export function useAllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (error) {
        console.error("Failed to fetch all categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
  };
}
