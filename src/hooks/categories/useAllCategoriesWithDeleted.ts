// hooks/useAllCategoriesWithDeleted.ts
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { API_URL } from "@/lib/config";

export function useAllCategoriesWithDeleted() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/categories/with-deleted`, {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
