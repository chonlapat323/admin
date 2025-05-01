import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAdmin } from "@/services/admin.service";
import { Member } from "@/types/member";

export function useAdminList(setAdmins: React.Dispatch<React.SetStateAction<Member[]>>) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleEditClick = (id: number) => {
    router.push(`/admins/${id}/edit`);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null) return;
    setDeletingId(selectedId);
    setShowModal(false);

    try {
      await deleteAdmin(selectedId);
      setAdmins((prev) => prev.filter((admin) => admin.id !== selectedId));
      toast.success("Admin deleted successfully!");
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
