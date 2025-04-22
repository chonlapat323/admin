"use client";

import { useForm } from "react-hook-form";
import { EditOrderFormFields } from "@/types/orders/order";
import EditOrderForm from "@/components/form/orders/EditOrderForm";
import { useEditOrder } from "@/hooks/orders/useEditOrder";
import { formatDate } from "@/utils/format-date";
import { getOrderStatusColor, getOrderStatusLabel } from "@/utils/orders/order-status";

export default function AdminOrderEditPage() {
  const form = useForm<EditOrderFormFields>();
  const { reset } = form;

  const { order, isLoading, handleSubmit } = useEditOrder({ reset });
  if (isLoading || !order) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
      {/* ✅ Left: Order Info */}
      <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลคำสั่งซื้อ</h2>
        <p>
          <span className="font-medium">Order Number:</span> {order.order_number}
        </p>
        <p>
          <span className="font-medium">สถานะ:</span>{" "}
          <span className={`font-medium ${getOrderStatusColor(order.order_status)}`}>
            {getOrderStatusLabel(order.order_status)}
          </span>
        </p>
        <p>
          <span className="font-medium">วันที่:</span> {formatDate(order.created_at)}
        </p>
        <p>
          <span className="font-medium">Total:</span> ฿ {order.total_price.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">User:</span> {order.user_name}
        </p>
        <p>
          <span className="font-medium">Tracking:</span> {order.tracking_number || "-"}
        </p>

        {/* ✅ Items */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">รายการสินค้า</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 border-b pb-3">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.product.product_image[0]?.url}`}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-600">
                    จำนวน: {item.quantity} × ฿{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Right: Edit Form */}
      <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold mb-4">แก้ไขคำสั่งซื้อ</h2>
        <EditOrderForm form={form} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
