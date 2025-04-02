// File: src/hooks/useProducts.ts

"use client";

import { useEffect, useState } from "react";
import { getAllProducts, createProduct as createProductService } from "@/services/product.service";
import { ProductFormFields } from "@/components/form/product/ProductForm";

export interface Tag {
  id: number;
  name: string;
}

export interface Variant {
  id: number;
  name: string;
  stock: number;
}

export interface ProductImage {
  id: number;
  url: string;
  is_main: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  images: ProductImage[];
  tags: Tag[];
  variants: Variant[];
}

export function useProducts(page: number = 1) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts(page);
        console.log(res.data);
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
