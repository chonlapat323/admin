import { Slide } from "@/types/slide";

export interface SlideListResponse {
  data: Slide[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
