import { useCancelOrder } from "../api/order/useCancelOrder";
import { useAdminGetOrders } from "../api/order/userAdminGetOrder";
import { useUpdateOrderStatus } from "../api/order/useUpdateOrderStatus";
import { useUpdateTracking } from "../api/order/useUpdateTracking";

export const useOrderActions = () => {
  const { orders, isLoading, isError, refresh } = useAdminGetOrders();
  const updateStatus = useUpdateOrderStatus();
  const updateTracking = useUpdateTracking();
  const cancel = useCancelOrder();

  const handleUpdateStatus = async (orderId: number, status: string) => {
    await updateStatus(orderId, status);
    await refresh();
  };

  const handleUpdateTracking = async (orderId: number, trackingNumber: string) => {
    await updateTracking(orderId, trackingNumber);
    await refresh();
  };

  const handleCancelOrder = async (orderId: number) => {
    await cancel(orderId);
    await refresh();
  };

  return {
    orders,
    isLoading,
    isError,
    refreshOrders: refresh,
    handleUpdateStatus,
    handleUpdateTracking,
    handleCancelOrder,
  };
};
