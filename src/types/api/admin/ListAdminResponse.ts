export interface PaginatedAdminResponse<T> {
  data: T[];
  current_page: number;
  pageCount: number;
  total_items: number;
}
