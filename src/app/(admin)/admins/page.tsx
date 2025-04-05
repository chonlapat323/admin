"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon, UserIcon } from "@/icons";
import { API_URL } from "@/lib/config";
import Link from "next/link";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAdmins } from "@/hooks/userAdmins";
import { deleteAdmin } from "@/services/admin.service"; // ✅ Service
import { UserRoleMap } from "@/constants/roles";

export default function AdminUserPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // ✅ ดึงข้อมูลจาก hook
  const { admins, loading, totalPages, setAdmins } = useAdmins(page);

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

  if (!Array.isArray(admins)) {
    return <div className="p-6 text-red-500">เกิดข้อผิดพลาด: ไม่สามารถโหลดข้อมูลได้</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Admin List</h2>
        <Link
          href="/admins/add"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
        >
          <UserIcon />
          <span className="font-medium">Add Admin</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="px-4 py-3 font-medium text-left">Name</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Role</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Create Date</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-6">กำลังโหลด...</TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6">ไม่พบผู้ดูแลระบบ</TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className={`transition-opacity duration-300 ${
                      deletingId === admin.id ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full border">
                          <Image
                            width={40}
                            height={40}
                            src={
                              admin.avatar_url
                                ? `${API_URL}${admin.avatar_url}`
                                : "/images/user/default-avatar.png"
                            }
                            alt={admin.first_name || "user"}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {admin.first_name} {admin.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <Badge size="sm">{UserRoleMap[admin.role_id]}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      {new Date(admin.created_at).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleEditClick(admin.id)}
                          size="sm"
                          variant="outline"
                          startIcon={<PencilIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(admin.id)}
                          size="sm"
                          variant="outline"
                          startIcon={<TrashBinIcon />}
                          className="!text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      <ConfirmModal
        open={showModal}
        title="Delete Admin?"
        description="This action cannot be undone. Are you sure you want to delete this admin?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
