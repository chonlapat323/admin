import { Slide } from "@/types/slide";

export interface SlideListResponse {
  data: Slide[];
  current_page: number;
  pageCount: number;
  total_items: number;
}
