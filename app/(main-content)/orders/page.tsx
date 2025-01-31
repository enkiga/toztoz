"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/app/_store/store";
import { useUser } from "@clerk/nextjs";

interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  county: string;
  city: string;
  district: string;
  street: string;
  itemTotal: number;
  shippingFee: number;
  orderTotal: number;
  mpesaCode: string;
  orderItem: OrderItem[];
  createdAt?: string;
  orderStatus?: string;
}

interface OrderItem {
  quantity: number;
  product: { id: string };
}

const CartPage = () => {
  const { fetchUserOrders } = useStore();
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: () => fetchUserOrders(email),
  });

  // Function to convert 2025-01-30T22:36:00.592689+00:00 to yyyy-mm-dd hr:min format
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // function to read price and convert to string while adding the comma separator
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  const itemPrice = (price: number, quantity: number) => {
    return (price * quantity).toLocaleString("en-US");
  }

  return (
    <section className="w-full md:min-h-screen pt-20">
      <div className="w-11/12 mx-auto flex flex-col">
        <h1 className="font-semibold text-2xl border-b pb-3">
          Your Orders ({orders?.length})
        </h1>
        {isLoading ? (
          <div className="w-full h-96 flex justify-center items-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {orders?.map((order) => (
              <div key={order.id} className="flex flex-col">
                <div className="bg-gray-200 rounded-sm p-4 mt-3">
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p>
                    Order Date:{" "}
                    <strong>{formatDate(order?.createdAt ?? "")}</strong>
                  </p>
                  <p>Status : {order?.orderStatus ?? "Pending"}</p>
                </div>
                <div className="">
                  {order.orderItem.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-y-3 space-x-3">
                        <Image
                          src={item.product.productImage[0].url}
                          alt={item.product.productSlug}
                          width={100}
                          height={100}
                          className="rounded-sm object-contain object-center"
                        />
                        <p>{item.product.productName}</p>
                      </div>
                      <p>Qty: {item.quantity}</p>
                      <p>Ksh {itemPrice(item.quantity, item.product.productPrice)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
