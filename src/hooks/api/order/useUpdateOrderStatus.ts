import { updateOrderStatus } from "@/services/order.service";
import { mutate } from "swr";

export function useUpdateOrderStatus() {
  return async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
    await mutate("/admin/orders");
  };
}
