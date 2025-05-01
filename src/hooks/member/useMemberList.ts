"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteMember } from "@/services/member.service";
import { Member } from "@/types/member";

export function useMemberList(setMembers: React.Dispatch<React.SetStateAction<Member[]>>) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleEditClick = (id: number) => {
    router.push(`/members/${id}/edit`);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null) return;
    setDeletingId(selectedId);
    setShowModal(false);

    try {
      await deleteMember(selectedId);
      setMembers((prev) => prev.filter((member) => member.id !== selectedId));
      toast.success("Member deleted successfully!");
    } catch (error) {
      toast.error("❌ Delete error: " + error);
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return {
    selectedId,
    deletingId,
    showModal,
    handleDeleteClick,
    handleEditClick,
    handleConfirmDelete,
    setShowModal,
  };
}
