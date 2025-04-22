import { updateTrackingNumber } from "@/services/order.service";
import { mutate } from "swr";

export function useUpdateTracking() {
  return async (orderId: number, trackingNumber: string) => {
    await updateTrackingNumber(orderId, trackingNumber);
    await mutate("/admin/orders");
  };
}
