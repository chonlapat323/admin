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
  images: SlideImage[];
}
