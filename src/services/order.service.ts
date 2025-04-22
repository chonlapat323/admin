import { EditOrderFormFields } from "@/types/orders/order";
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AdminOrder } from "@/types/orders/order";

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetchWithAuth(`${API_URL}/orders`);

  if (!res.ok) {
    throw new Error("ไม่สามารถโหลดคำสั่งซื้อได้");
  }

  return res.json();
}

export async function getAdminOrderById(orderId: number) {
  const res = await fetchWithAuth(`${API_URL}/orders/${orderId}`);
  if (!res.ok) {
    throw new Error("ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
  }

  return res.json();
}

export async function updateOrder(orderId: number, data: EditOrderFormFields) {
  const res = await fetchWithAuth(`${API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}

export async function updateOrderStatus(orderId: number, status: string) {
  const res = await fetchWithAuth(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("ไม่สามารถอัปเดตสถานะคำสั่งซื้อได้");
}

export async function updateTrackingNumber(orderId: number, trackingNumber: string) {
  const res = await fetchWithAuth(`${API_URL}/orders/${orderId}/tracking`, {
    method: "PATCH",
    body: JSON.stringify({ trackingNumber }),
  });

  if (!res.ok) throw new Error("ไม่สามารถอัปเดตเลขพัสดุได้");
}

export async function cancelOrder(orderId: number) {
  const res = await fetchWithAuth(`${API_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("ไม่สามารถยกเลิกคำสั่งซื้อได้");
}
