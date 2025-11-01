export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number | string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: {
    country: string;
    province: string;
    district: string;
    address: string;
  };
  paymentMethod: "cod" | "esewa";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
