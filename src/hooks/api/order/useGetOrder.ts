import useSWR from "swr";
import { getAdminOrderById } from "@/services/order.service";
import { AdminOrder } from "@/types/orders/order";
import { API_URL } from "@/lib/config";

export function useGetOrder(orderId: number) {
  const { data, error, isLoading, mutate } = useSWR<AdminOrder>(
    orderId ? `${API_URL}/orders/admin/${orderId}` : null,
    () => getAdminOrderById(orderId)
  );

  return {
    order: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
