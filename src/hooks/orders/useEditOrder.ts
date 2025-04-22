import { useParams, useRouter } from "next/navigation";
import { useGetOrder } from "@/hooks/api/order/useGetOrder";
import { useUpdateOrder } from "@/hooks/api/order/useUpdateOrder";
import { EditOrderFormFields } from "@/types/orders/order";
import { toast } from "sonner";
import { UseFormReset } from "react-hook-form";
import { useEffect } from "react";

export const useEditOrder = ({ reset }: { reset: UseFormReset<EditOrderFormFields> }) => {
  const params = useParams();
  const router = useRouter();
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
    const res = await update(orderId, data);

    if (!res.ok) {
      toast.error("ไม่สามารถอัปเดตคำสั่งซื้อได้");
      return;
    }

    toast.success("อัปเดตคำสั่งซื้อสำเร็จ");
    await refresh();
  };

  return {
    order,
    isLoading,
    isError,
    handleSubmit,
  };
};
