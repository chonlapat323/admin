import { ImageData } from "@/components/ui/upload/MultiImageUpload";
export type ProductFormFields = {
  category_id: number;
  name: string;
  description: string;
  additionalInformation?: string;
  design?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand: string;
  is_active: boolean;
  is_best_seller?: boolean;
  tags?: string;
  imageUrls?: ImageData[];
};
