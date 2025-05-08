"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/categories/useCategories";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { BoxIconLine, PencilIcon, TrashBinIcon } from "@/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterOption } from "@/types/components/tables/FilterBar";
import { useFilter } from "@/hooks/components/tables/useFilter";
import FilterBar from "@/components/tables/FilterBar";
import SortableCategoryRow from "@/components/category/SortableCategoryRow";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortableCategory } from "@/hooks/categories/useSortableCategory";

export default function CategoryListPage() {
  const [page, setPage] = useState(1);

  const limit = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const filterOptions: FilterOption[] = [
    {
      key: "search",
      label: "Search name",
      type: "text",
    },
  ];

  const { values, onChange, onClear } = useFilter(["search"]);
  const {
    categories,
    loading,
    totalPages,
    deletingId,
    showModal,
    setShowModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
  } = useCategories(page, limit, search);

  const onApply = () => {
    const params = new URLSearchParams();
    if (values.search) params.set("search", values.search);
    router.push(`?${params.toString()}`);
  };

  const { handleDragEnd, strategy, categoriesList } = useSortableCategory({
    categories,
    isDisabled: !!values.search,
  });

  const renderTable = () => {
    if (loading || categoriesList.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell className="text-center py-6">
              {loading ? "Loading..." : "No categories found"}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {categoriesList.map((category) => (
          <SortableCategoryRow
            key={category.id}
            category={category}
            isDeleting={deletingId === category.id}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </TableBody>
    );
  };

  return (
    <>
      <FilterBar
        filters={filterOptions}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />

      <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Category List</h2>
          <Link
            href="/categories/add"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
          >
            <BoxIconLine />
            <span className="font-medium">Add Category</span>
          </Link>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="w-full overflow-x-auto">
            {values.search ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="w-1/4 py-3 font-medium text-left">Image</TableCell>
                    <TableCell className="w-1/4 py-3 font-medium text-left">Name</TableCell>
                    <TableCell className="w-1/4 py-3 font-medium text-left">Status</TableCell>
                    <TableCell className="w-1/4 py-3 font-medium text-left">Action</TableCell>
                  </TableRow>
                </TableHeader>
                {renderTable()}
              </Table>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={categoriesList.map((c) => c.id)} strategy={strategy}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="w-1/4 py-3 font-medium text-left">Image</TableCell>
                        <TableCell className="w-1/4 py-3 font-medium text-left">Name</TableCell>
                        <TableCell className="w-1/4 py-3 font-medium text-left">Status</TableCell>
                        <TableCell className="w-1/4 py-3 font-medium text-left">Action</TableCell>
                      </TableRow>
                    </TableHeader>
                    {renderTable()}
                  </Table>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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
    </>
  );
}
