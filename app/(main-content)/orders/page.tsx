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
  product: Product;
}

interface Product {
  id: string;
  productName: string;
  productPrice: number;
  productImage: [{ url: string }];
  productDescription: string;
  productQuantity: number;
  productSlug: string;
  productStatus: string;
  category: [{ categoryName: string; categorySlug: string }];
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
  };

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
                      className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b md:border-0"
                    >
                      <div className="flex md:flex-1 items-center space-y-3 space-x-3">
                        <Image
                          src={item.product.productImage[0].url}
                          alt={item.product.productSlug}
                          width={100}
                          height={100}
                          className="rounded-sm object-contain object-center"
                        />
                        <p>{item.product.productName}</p>
                      </div>
                      <p className="md:flex md:flex-1 hidden">
                        Qty: {item.quantity}
                      </p>
                      <p className="w-full md:w-fit text-right">
                        Ksh{" "}
                        {itemPrice(item.quantity, item.product.productPrice)}
                      </p>
                    </div>
                  ))}
                  <div className="flex flex-col my-5 md:border-t pt-3 space-y-2">
                    <div className="flex flex-1 justify-between">
                      <p>Item Total</p>
                      <p>Ksh {formatPrice(order.itemTotal)}</p>
                    </div>
                    <div className="flex flex-1 justify-between">
                      <p>Shipping Fee</p>
                      <p>Ksh {formatPrice(order.shippingFee)}</p>
                    </div>
                    <div className="flex flex-1 justify-between border-t pt-3">
                      <p>Subtotal</p>
                      <p>Ksh {formatPrice(order.orderTotal)}</p>
                    </div>
                  </div>
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
