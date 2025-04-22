export const getOrderStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "shipped":
      return "text-blue-600";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-500";
    default:
      return "text-gray-400";
  }
};
