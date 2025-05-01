import { useParams } from "next/navigation";
import { useGetOrder } from "@/hooks/api/order/useGetOrder";
import { useUpdateOrder } from "@/hooks/api/order/useUpdateOrder";
import { EditOrderFormFields } from "@/types/orders/order";
import { toast } from "sonner";
import { UseFormReset } from "react-hook-form";
import { useEffect } from "react";

export const useEditOrder = ({ reset }: { reset: UseFormReset<EditOrderFormFields> }) => {
  const params = useParams();
  const orderId = Number(params.id);

  const { order, isLoading, isError, refresh } = useGetOrder(orderId);
  const update = useUpdateOrder();

  useEffect(() => {
    if (order) {
      reset({
        order_status: order.order_status,
        tracking_number: order.tracking_number ?? null,
      });
    }
  }, [order, reset]);

  const handleSubmit = async (data: EditOrderFormFields) => {
    await update(orderId, data);
    toast.success("Order updated successfully.");
    await refresh();
  };

  return {
    order,
    isLoading,
    isError,
    handleSubmit,
  };
};
