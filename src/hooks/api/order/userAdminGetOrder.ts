import useSWR from "swr";
import { getAdminOrders } from "@/services/order.service";

export const useAdminGetOrders = () => {
  const { data, error, isLoading, mutate } = useSWR("/orders", getAdminOrders);

  return {
    orders: data ?? [],
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
};
