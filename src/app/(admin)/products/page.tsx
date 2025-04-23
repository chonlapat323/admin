// File: src/app/(admin)/products/page.tsx
"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { BoxIconLine, PencilIcon, TrashBinIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts"; // <- คุณต้องสร้าง hook นี้เอง
import { deleteProduct } from "@/services/product.service"; // <- และ service นี้ด้วย

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { products, loading, totalPages, setProducts } = useProducts(page);

  const handleEditClick = (id: number) => {
    router.push(`/products/${id}/edit`);
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
      await deleteProduct(selectedId);
      toast.success("ลบสินค้าเรียบร้อยแล้ว");
      setProducts((prev) => prev.filter((p) => p.id !== selectedId));
    } catch (err) {
      toast.error("ลบสินค้าไม่สำเร็จ");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Product List</h2>
        <Link
          href="/products/add"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
        >
          <BoxIconLine />

          <span className="font-medium">Add Product</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="px-4 py-3 font-medium text-left">Name</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Price</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Stock</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Tags</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-6">กำลังโหลด...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6">ไม่พบสินค้า</TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const mainImage = product.product_image.find((img) => img.is_main);
                  return (
                    <TableRow
                      key={product.id}
                      className={`transition-opacity duration-300 ${
                        deletingId === product.id ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <TableCell className="px-4 py-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded border">
                            <Image
                              width={48}
                              height={48}
                              src={
                                mainImage
                                  ? `${process.env.NEXT_PUBLIC_API_URL}${mainImage.url}`
                                  : "/uploads/no-image.jpg"
                              }
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {product.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">{product.price} ฿</TableCell>
                      <TableCell className="px-4 py-3 text-left">{product.stock}</TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag) => (
                            <Badge key={tag.id} size="sm">
                              #{tag.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => handleEditClick(product.id)}
                            size="sm"
                            variant="outline"
                            startIcon={<PencilIcon />}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(product.id)}
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
        title="Delete Product?"
        description="This action cannot be undone. Are you sure you want to delete this product?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
