import useSWR from "swr";
import { getAdminOrders } from "@/services/order.service";
import { AdminOrder } from "@/types/orders/order";
import { PaginatedResponse } from "@/types/PaginatedResonse";

export const useAdminGetOrders = (page: number, limit: number, search: string) => {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<AdminOrder>>(
    `/orders/admin?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    getAdminOrders
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
};
