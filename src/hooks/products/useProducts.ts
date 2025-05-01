"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/products/product";
import { getProducts, deleteProduct } from "@/services/product.service";
import { toast } from "sonner";
type UseProductsParams = {
  page: number;
  limit: number;
  search: string;
  categoryId: string;
  isActive: string;
};
export function useProducts({ page, limit, search, categoryId, isActive }: UseProductsParams) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryId, isActive]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        page,
        limit,
        search,
        category_id: categoryId,
        is_active: isActive,
      });
      setProducts(res.data);
      setTotalPages(res.pageCount || 1);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

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
      setProducts((prev) => prev.filter((p) => p.id !== selectedId));
      toast.success("Product deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete product.");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  };

  return {
    products,
    loading,
    totalPages,
    deletingId,
    showModal,
    setShowModal,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
