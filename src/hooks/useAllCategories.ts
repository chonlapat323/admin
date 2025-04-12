// hooks/useAllCategories.ts
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { getAllCategories } from "@/services/category.service";

export function useAllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
