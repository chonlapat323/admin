export interface PaginatedAdminResponse<T> {
  items: T[];
  current_page: number;
  total_page: number;
  total_items: number;
}
