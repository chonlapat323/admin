export interface SlideImage {
  id: number;
  url: string;
  order_image: number;
  slide_id: string;
}

export interface Slide {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  slide_images: SlideImage[];
}

export interface SlideImageInput {
  id?: number;
  url: string;
}

export type SlideFormFields = {
  title: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  imageUrls?: SlideImageInput[];
};

export interface DeleteSlideResponse {
  message: string;
}
