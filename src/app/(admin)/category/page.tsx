"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { deleteCategory } from "@/services/category.service";

export default function CategoryListPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { categories, loading, totalPages, setCategories } = useCategories(page);

  const handleEditClick = (id: number) => {
    router.push(`/category/${id}/edit`);
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
      toast.success("ลบหมวดหมู่สำเร็จแล้ว");
      setCategories((prev) => prev.filter((c) => c.id !== selectedId));
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
        <h2 className="text-2xl font-semibold text-gray-800">Category List</h2>
        <Link
          href="/category/add"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
            />
          </svg>

          <span className="font-medium">Add Category</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="px-4 py-3 font-medium text-left">Name</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Status</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-6">Loading...</TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6">No categories found</TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow
                    key={cat.id}
                    className={`transition-opacity duration-300 ${
                      deletingId === cat.id ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <TableCell className="px-4 py-3 text-left">{cat.name}</TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleEditClick(cat.id)}
                          size="sm"
                          variant="outline"
                          startIcon={<PencilIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(cat.id)}
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
        title="Delete Category?"
        description="This action cannot be undone. Are you sure you want to delete this category?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
