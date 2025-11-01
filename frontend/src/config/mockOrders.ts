import type { Order } from "@/types/Order";

export const mockOrders: Order[] = [
  {
    orderId: "ORD123456789",
    items: [
      {
        productId: "1",
        productName: "Fresh Organic Tomatoes",
        productImage:
          "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400",
        quantity: 5,
        price: "150",
      },
      {
        productId: "2",
        productName: "Premium Quality Rice - 5kg",
        productImage:
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        quantity: 2,
        price: "800",
      },
    ],
    totalAmount: 1750,
    deliveryAddress: {
      country: "Nepal",
      province: "Bagmati",
      district: "Kathmandu",
      address: "Thamel, Kathmandu",
    },
    paymentMethod: "cod",
    status: "delivered",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    orderId: "ORD987654321",
    items: [
      {
        productId: "3",
        productName: "Fresh Potato - 10kg",
        productImage:
          "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
        quantity: 1,
        price: "500",
      },
    ],
    totalAmount: 500,
    deliveryAddress: {
      country: "Nepal",
      province: "Bagmati",
      district: "Lalitpur",
      address: "Patan Dhoka, Lalitpur",
    },
    paymentMethod: "esewa",
    status: "shipped",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
