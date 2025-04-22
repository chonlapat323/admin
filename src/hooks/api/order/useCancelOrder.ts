import { cancelOrder } from "@/services/order.service";
import { mutate } from "swr";

export function useCancelOrder() {
  return async (orderId: number) => {
    await cancelOrder(orderId);
    await mutate("/admin/orders");
  };
}
