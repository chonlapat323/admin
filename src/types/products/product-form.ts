import { ImageData } from "@/components/ui/upload/MultiImageUpload";
export type ProductFormFields = {
  category_id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand: string;
  is_active: boolean;
  tags?: string;
  imageUrls?: ImageData[];
};
