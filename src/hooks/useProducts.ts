// File: src/hooks/useProducts.ts

"use client";

import { useEffect, useState } from "react";
import { getAllProducts, createProduct as createProductService } from "@/services/product.service";
import { ProductFormFields } from "@/types/products/product-form";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_URL } from "@/lib/config";
import useSWR from "swr";
import { Product } from "@/types/products/product";

export function useProducts(page: number = 1) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts(page);
        setProducts(res.data);
        setTotalPages(res.pageCount || 1);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  return { products, loading, totalPages, setProducts };
}

export function useCreateProduct() {
  return async (formData: ProductFormFields) => {
    await createProductService(formData);
  };
}

const fetcher = async (url: string) => {
  const res = await fetchWithAuth(url);
  return res.json(); // ✅ SWR ต้องการข้อมูล ไม่ใช่ Response
};

export function useGetProduct(id: number) {
  return useSWR<Product>(`${API_URL}/products/${id}`, fetcher);
}

export function useUpdateProduct() {
  return async (id: number, payload: ProductFormFields) => {
    const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  };
}
