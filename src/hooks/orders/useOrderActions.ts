import { useCancelOrder } from "../api/order/useCancelOrder";
import { useAdminGetOrders } from "../api/order/userAdminGetOrder";
import { useUpdateOrderStatus } from "../api/order/useUpdateOrderStatus";

export const useOrderActions = (page: number, limit: number) => {
  const { data, isLoading, isError, refresh } = useAdminGetOrders(page, limit);
  const updateStatus = useUpdateOrderStatus();
  const cancel = useCancelOrder();

  const handleUpdateStatus = async (orderId: number, status: string) => {
    await updateStatus(orderId, status);
    await refresh();
  };

  const handleCancelOrder = async (orderId: number) => {
    await cancel(orderId);
    await refresh();
  };

  return {
    orders: data?.data || [],
    total: data?.total || 0,
    page,
    limit,
    isLoading,
    isError,
    totalPages: data?.pageCount ?? 0,
    refreshOrders: refresh,
    handleUpdateStatus,
    handleCancelOrder,
  };
};
