import { ImageData } from "@/components/ui/upload/MultiImageUpload";
export type ProductFormFields = {
  category_id: number;
  name: string;
  description: string;
  additional_information?: string;
  design?: string;
  price: number;
  discount_price?: number;
  stock: number;
  sku: string;
  brand: string;
  is_active: boolean;
  is_best_seller?: boolean;
  tags?: string;
  image_urls?: ImageData[];
};
