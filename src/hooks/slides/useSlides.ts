"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSlides, deleteSlide } from "@/services/slide.service";
import { Slide } from "@/types/slide";
import { toast } from "sonner";

export function useSlides(page: number = 1, limit: number, search: string) {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSlides(page, limit, search)
      .then((res) => {
        setSlides(res.data);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleEditClick = (id: number) => {
    router.push(`/slides/${id}/edit`);
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
      await deleteSlide(selectedId);
      toast.success("ลบสไลด์สำเร็จแล้ว");
      setSlides((prev) => prev.filter((s) => s.id !== selectedId));
    } catch (err) {
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return {
    slides,
    loading,
    totalPages,
    setSlides,
    selectedId,
    deletingId,
    showModal,
    setShowModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
