export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageCount: number;
}
