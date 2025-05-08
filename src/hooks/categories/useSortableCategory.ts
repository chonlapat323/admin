import { arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Category } from "@/types/category";
import { DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { updateCategoryOrder } from "@/services/category.service";
import { toast } from "sonner";
import { HttpError } from "@/lib/HttpError";

type UseSortableCategoryOptions = {
  categories: Category[];
  isDisabled?: boolean;
};

export function useSortableCategory({
  categories,
  isDisabled = false,
}: UseSortableCategoryOptions) {
  useEffect(() => {
    setCategoriesList(categories);
  }, [categories]);
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const handleDragEnd = async (event: DragEndEvent) => {
    if (isDisabled) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categoriesList.findIndex((c) => c.id === active.id);
    const newIndex = categoriesList.findIndex((c) => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newList = arrayMove(categoriesList, oldIndex, newIndex);
    setCategoriesList(newList);

    const orderedPayload = newList.map((category, index) => ({
      id: category.id,
      order: index,
    }));

    try {
      debugger;
      await updateCategoryOrder(orderedPayload);
      toast.success("Category order updated");
    } catch (err) {
      if (err instanceof HttpError) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  return {
    categoriesList,
    handleDragEnd,
    strategy: verticalListSortingStrategy,
  };
}
