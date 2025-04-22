import { updateOrder } from "@/services/order.service";
import { EditOrderFormFields } from "@/types/orders/order";

export function useUpdateOrder() {
  return async (orderId: number, data: EditOrderFormFields) => {
    return updateOrder(orderId, data);
  };
}
