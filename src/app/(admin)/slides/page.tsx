"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { PencilIcon, TrashBinIcon, ImageIcon } from "@/icons";
import Link from "next/link";
import { useSlides } from "@/hooks/slides/useSlides";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterOption } from "@/types/components/tables/FilterBar";
import { useFilter } from "@/hooks/components/tables/useFilter";
import FilterBar from "@/components/tables/FilterBar";

export default function SlideListPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const filterOptions: FilterOption[] = [
    {
      key: "search",
      label: "Search Title or Description",
      type: "text",
    },
  ];

  const { values, onChange, onClear } = useFilter(["search"]);
  const {
    slides,
    loading,
    totalPages,
    deletingId,
    showModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    setShowModal,
  } = useSlides(page, limit, search);

  const onApply = () => {
    const params = new URLSearchParams();
    if (values.search) params.set("search", values.search);
    router.push(`?${params.toString()}`);
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
      <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Slide List</h2>
          <Link
            href="/slides/add"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
          >
            <ImageIcon />
            <span className="font-medium">Add Slide</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="px-4 py-3 font-medium text-left">Image</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Title</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Description</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Status</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell className="text-center py-6">Loading...</TableCell>
                  </TableRow>
                ) : slides.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-6">Slide Not Found</TableCell>
                  </TableRow>
                ) : (
                  slides.map((slide) => {
                    const mainImage = slide.slide_images?.find((img) => img.order_image === 0);
                    const fullImageUrl =
                      mainImage?.url && mainImage.url.startsWith("http")
                        ? mainImage.url
                        : mainImage?.url
                          ? `${process.env.NEXT_PUBLIC_API_URL}${mainImage.url}`
                          : null;
                    return (
                      <TableRow
                        key={slide.id}
                        className={`transition-opacity duration-300 ${
                          deletingId === slide.id ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <TableCell className="px-4 py-3 text-left">
                          <div className="w-32 h-20 overflow-hidden rounded border">
                            {fullImageUrl && (
                              <Image
                                width={128}
                                height={80}
                                src={`${process.env.NEXT_PUBLIC_API_URL}${mainImage?.url}`}
                                alt={slide.title || "Slide Image"}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-left">{slide.title}</TableCell>
                        <TableCell className="px-4 py-3 text-left">{slide.description}</TableCell>

                        {/* ✅ แสดง status */}
                        <TableCell className="px-4 py-3 text-left">
                          <div className="flex gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                slide.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {slide.is_active ? "Active" : "Inactive"}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                slide.is_default
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {slide.is_default ? "Default" : "Optional"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-left">
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() => handleEditClick(slide.id)}
                              size="sm"
                              variant="outline"
                              startIcon={<PencilIcon />}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(slide.id)}
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
                    );
                  })
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
          title="Delete Slide?"
          description="This action cannot be undone. Are you sure you want to delete this slide?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </>
  );
}
