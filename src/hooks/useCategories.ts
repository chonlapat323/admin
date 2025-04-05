// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { getCategories } from "@/services/category.service";
import { Category } from "@/types/category";

export function useCategories(page: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getCategories(page);
        setCategories(res.data);
        setTotalPages(res.pageCount || 1);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  return { categories, setCategories, loading, totalPages };
}
