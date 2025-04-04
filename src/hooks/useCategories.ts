// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { getCategories } from "@/services/category.service";
import { Category } from "@/types/category";

export function useCategories(page: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getCategories(page);
        setCategories(res.data);
        setTotalPages(res.pageCount); // <- อย่าลืมตั้งตรงนี้
      } catch (err) {
        console.error("Error fetching categories", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  return { categories, setCategories, totalPages, loading };
}
