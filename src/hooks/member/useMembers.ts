"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMembers, deleteMember } from "@/services/member.service";
import { Member } from "@/types/member";

export function useMembers(page: number, limit: number, search: string) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const result = await getMembers(page, limit, search);
        setMembers(result.data || []);
        setTotalPages(result.pageCount || 1);
      } catch (err) {
        console.error(err);
        toast.error("โหลดข้อมูลเมมเบอร์ล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search]);

  const handleEditClick = (id: number) => {
    router.push(`/members/${id}/edit`);
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
      await deleteMember(selectedId);
      toast.success("ลบสมาชิกสำเร็จแล้ว");
      setMembers((prev) => prev.filter((m) => m.id !== selectedId));
    } catch (err) {
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return {
    members,
    loading,
    totalPages,
    setMembers,
    selectedId,
    deletingId,
    showModal,
    setShowModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
