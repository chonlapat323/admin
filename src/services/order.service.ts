import { EditOrderFormFields } from "@/types/orders/order";
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AdminOrder } from "@/types/orders/order";
import { PaginatedResponse } from "@/types/PaginatedResonse";

export function getAdminOrders(url: string): Promise<PaginatedResponse<AdminOrder>> {
  return fetchWithAuth<PaginatedResponse<AdminOrder>>(`${API_URL}${url}`);
}

export function getAdminOrderById(orderId: number): Promise<AdminOrder> {
  return fetchWithAuth<AdminOrder>(`${API_URL}/orders/${orderId}`);
}

export function updateOrder(orderId: number, data: EditOrderFormFields): Promise<AdminOrder> {
  return fetchWithAuth<AdminOrder>(`${API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(orderId: number, status: string): Promise<AdminOrder> {
  return fetchWithAuth<AdminOrder>(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function cancelOrder(orderId: number): Promise<AdminOrder> {
  return fetchWithAuth<AdminOrder>(`${API_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
  });
}
