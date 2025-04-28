import useSWR from "swr";
import { getAdminOrders } from "@/services/order.service";
import { AdminOrder } from "@/types/orders/order";
import { PaginatedResponse } from "@/types/PaginatedResonse";

export const useAdminGetOrders = (page: number, limit: number) => {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<AdminOrder>>(
    `/orders/admin?page=${page}&limit=${limit}`,
    getAdminOrders
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
};
