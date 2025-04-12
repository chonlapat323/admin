// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCategories, deleteCategory } from "@/services/category.service";
import { Category } from "@/types/category";

export function useCategories(page: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getCategories(page);
        setCategories(res.data);
        setTotalPages(res.pageCount || 1);
      } catch (err) {
        console.error("❌ Failed to fetch categories", err);
        toast.error("โหลดหมวดหมู่ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  // ✅ Edit
  const handleEditClick = (id: number) => {
    router.push(`/categories/${id}/edit`);
  };

  // ✅ Delete (confirm)
  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setDeletingId(selectedId);
    setShowModal(false);
    try {
      await deleteCategory(selectedId);
      setCategories((prev) => prev.filter((c) => c.id !== selectedId));
      toast.success("ลบหมวดหมู่สำเร็จแล้ว");
    } catch (err) {
      console.error(err);
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return {
    categories,
    setCategories,
    loading,
    totalPages,
    deletingId,
    showModal,
    setShowModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
