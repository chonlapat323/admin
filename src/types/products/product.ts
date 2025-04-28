import { Category } from "../category";

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
  category: Category;
  name: string;
  description: string;
  additional_information: string;
  design: string;
  price: number;
  discount_price?: number;
  stock: number;
  sku: string;
  brand: string;
  is_active: boolean;
  is_best_seller: boolean;
  product_image: ProductImage[];
  tags: Tag[];
  variants: Variant[];
}
