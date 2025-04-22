"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { EditOrderFormFields } from "@/types/orders/order";
import { OrderStatus } from "@/types/orders/order";
import Button from "@/components/ui/button/Button";

type Props = {
  form: UseFormReturn<EditOrderFormFields>;
  onSubmit: (data: EditOrderFormFields) => void;
  isSubmitting?: boolean;
};

export default function EditOrderForm({ form, onSubmit, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    control,
  } = form;

  // ✅ ตรวจสถานะ order_status
  const currentStatus = useWatch({
    control,
    name: "order_status",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl w-full space-y-5 text-left">
      {/* สถานะคำสั่งซื้อ */}
      <div>
        <label className="block text-sm font-medium mb-1">สถานะคำสั่งซื้อ</label>
        <select
          {...register("order_status", { required: true })}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.order_status ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        >
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.order_status && touchedFields.order_status && (
          <p className="text-red-600 text-sm">กรุณาเลือกสถานะ</p>
        )}
      </div>

      {/* หมายเลขพัสดุ */}
      <div>
        <label className="block text-sm font-medium mb-1">หมายเลขพัสดุ (Tracking)</label>
        {currentStatus}
        <input
          type="text"
          {...register("tracking_number", {
            validate: (value) => {
              if (currentStatus === "shipped" || currentStatus === "delivered") {
                if (!value || value.trim() === "") {
                  return "กรุณาระบุหมายเลขพัสดุ";
                }
              }
              return true;
            },
          })}
          placeholder="ระบุหมายเลขพัสดุ"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.tracking_number ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.tracking_number && (
          <p className="text-sm text-red-600">{errors.tracking_number.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </form>
  );
}
