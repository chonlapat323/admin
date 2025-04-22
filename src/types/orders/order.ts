export enum OrderStatus {
  pending = "pending",
  shipped = "shipped",
  delivered = "delivered",
  cancelled = "cancelled",
}

export type EditOrderFormFields = {
  order_status: OrderStatus;
  tracking_number: string | null;
};
export type OrderItemImage = {
  id: number;
  url: string;
  is_main: boolean;
  productId: number;
  order_image: number;
};

export type OrderItemProduct = {
  product_image: OrderItemImage[];
};

export type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  product: OrderItemProduct;
};

export type AdminOrder = {
  id: number;
  order_number: string;
  total_price: number;
  order_status: OrderStatus;
  created_at: string;
  tracking_number?: string | null;
  user_name: string | null;
  items: OrderItem[]; // ✅ เพิ่มตรงนี้
};
