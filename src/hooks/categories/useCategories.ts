"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, deleteCategory } from "@/services/category.service";
import { Category } from "@/types/category";
import { toast } from "sonner";

export function useCategories(page: number = 1, limit: number, search: string) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCategories(page, limit, search);
        setCategories(res.data);
        setTotalPages(res.pageCount || 1);
      } catch (err) {
        console.error("❌ Failed to fetch categories", err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search]);

  const handleEditClick = (id: number) => {
    router.push(`/categories/${id}/edit`);
  };

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
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("❌ Failed to delete category", err);
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return {
    categories,
    loading,
    totalPages,
    deletingId,
    showModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    setShowModal,
  };
}
