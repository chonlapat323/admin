// File: src/app/(admin)/members/page.tsx
"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { PencilIcon, TrashBinIcon, UserIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserRoleMap } from "@/constants/roles";
import { useMembers } from "@/hooks/useMembers";
import { deleteMember } from "@/services/member.service";

export default function MemberListPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { members, loading, totalPages, setMembers } = useMembers(page);

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

  return (
    <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Member List</h2>
        <Link
          href="/members/add"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
        >
          <UserIcon />
          <span className="font-medium">Add Member</span>
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
                  <TableCell className="text-center py-6">Loading...</TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6">Member Not Found</TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow
                    key={member.id}
                    className={`transition-opacity duration-300 ${
                      deletingId === member.id ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full border">
                          <Image
                            width={40}
                            height={40}
                            src={
                              member.avatar_url
                                ? `${process.env.NEXT_PUBLIC_API_URL}${member.avatar_url}`
                                : `http://localhost:3000/images/user/owner.jpg`
                            }
                            alt={`${member.first_name || "User"}'s Avatar`}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <Badge size="sm">{UserRoleMap[member.role_id]}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      {new Date(member.created_at).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleEditClick(member.id)}
                          size="sm"
                          variant="outline"
                          startIcon={<PencilIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(member.id)}
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

      {/* Pagination */}
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
