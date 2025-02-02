"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useStore } from "@/app/_store/store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

// Step 1: Split schema into individual step schemas
const PersonalSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name should be more than 2 characters" })
    .max(255),
  email: z.string().email({ message: "Invalid email address" }),
  mobileNo: z
    .string()
    .startsWith("+254", { message: "Phone number should start with +254" })
    .length(13, { message: "Phone number should be 13 characters long" }),
});

const ShippingSchema = z.object({
  county: z.string().nonempty({ message: "County is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  district: z.string().nonempty({ message: "District is required" }),
  street: z.string().nonempty({ message: "Street is required" }),
});

const PaymentSchema = z.object({
  mpesaCode: z.string().nonempty({ message: "Mpesa code is required" }),
});

type FormData = {
  personal: z.infer<typeof PersonalSchema>;
  shipping: z.infer<typeof ShippingSchema>;
  payment: z.infer<typeof PaymentSchema>;
};

const CheckoutPage = () => {
  const { user } = useUser();
  // get cart items from store: if cart is empty, redirect to homepage with a message to add items to cart
  const { cartItem, createOrder } = useStore();

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  const total = cartItem.reduce((acc, item) => {
    return acc + item.product.productPrice * item.selectedQuantity;
  }, 0);

  /* Lets create sheeping fee logic: 
  1. Minimum shipping fee is 200
  2. based on th the total price, we can calculate the shipping fee
  3. if total price is less than 1000, shipping fee is 200
  4. Increment shipping fee by the rate of 2.5% of the total price for every 1000
  5 If fee has a decimal, round it up to the nearest whole number
  */
  const shippingFee = (total: number) => {
    if (total < 1000) {
      return 200;
    } else {
      const fee = 200 + (total - 1000) * 0.105;
      return Math.ceil(fee);
    }
  };

  const orderTotal = (total: number) => {
    return formatPrice(total + shippingFee(total));
  };

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("personal-details");
  const [completedSteps, setCompletedSteps] = useState({
    personal: false,
    shipping: false,
  });

  // Step 3: Create aggregated form state
  const [formData, setFormData] = useState<FormData>({
    personal: {
      name: user?.fullName ?? "",
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      mobileNo: "",
    },
    shipping: { county: "", city: "", district: "", street: "" },
    payment: { mpesaCode: "" },
  });

  // Step 1: Create mutation with proper types
  const orderMutation = useMutation({
    mutationFn: async (orderData: Order) => {
      const orderPayload = {
        ...orderData,

        itemTotal: total,
        shippingFee: shippingFee(total), // Replace with actual shipping calculation
        orderTotal: 0, // Will be calculated below
        orderItem: cartItem.map((item) => ({
          quantity: item.selectedQuantity,
          product: {
            id: item.product.id,
            productName: item.product.productName,
            productPrice: item.product.productPrice,
            productImage: item.product.productImage,
            productDescription: item.product.productDescription,
            productQuantity: item.product.productQuantity,
            productSlug: item.product.productSlug,
            productStatus: item.product.productStatus,
            category: item.product.category,
          },
        })),
      };

      orderPayload.orderTotal =
        orderPayload.itemTotal + orderPayload.shippingFee;

      return createOrder(orderPayload);
    },
    onSuccess: (data) => {
      // Clear cart on success
      useStore.getState().clearCart();
      router.push("/orders");
    },
    onError: (error) => {
      console.error("Order submission failed:", error);
      // Add toast notification here
      toast("Order submission failed", {
        description: error.message,
      });
    },
  });

  // Step 2: Create separate forms with individual schemas
  const personalForm = useForm<z.infer<typeof PersonalSchema>>({
    resolver: zodResolver(PersonalSchema),
    defaultValues: formData.personal,
  });

  const shippingForm = useForm<z.infer<typeof ShippingSchema>>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: formData.shipping,
  });

  const paymentForm = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: formData.payment,
  });

  const handlePersonalSubmit = (data: z.infer<typeof PersonalSchema>) => {
    setFormData((prev) => ({ ...prev, personal: data }));
    setCompletedSteps((prev) => ({ ...prev, personal: true }));
    setActiveTab("shipping-details");
  };

  const handleShippingSubmit = (data: z.infer<typeof ShippingSchema>) => {
    setFormData((prev) => ({ ...prev, shipping: data }));
    setCompletedSteps((prev) => ({ ...prev, shipping: true }));
    setActiveTab("payment-details");
  };

  const handlePaymentSubmit = (data: z.infer<typeof PaymentSchema>) => {
    const completeOrderData: Order = {
      customerName: formData.personal.name,
      customerEmail: formData.personal.email,
      customerMobile: formData.personal.mobileNo,
      county: formData.shipping.county,
      city: formData.shipping.city,
      district: formData.shipping.district,
      street: formData.shipping.street,
      itemTotal: total,
      shippingFee: shippingFee(total),
      orderTotal: total + shippingFee(total),
      mpesaCode: data.mpesaCode,
      orderItem: cartItem.map((item) => ({
        quantity: item.selectedQuantity,
        product: {
          id: item.product.id,
          productName: item.product.productName,
          productPrice: item.product.productPrice,
          productImage: item.product.productImage,
          productDescription: item.product.productDescription,
          productQuantity: item.product.productQuantity,
          productSlug: item.product.productSlug,
          productStatus: item.product.productStatus,
          category: item.product.category,
        },
      })),
    };

    orderMutation.mutate(completeOrderData);
  };

  return (
    <>
      {cartItem.length === 0 ? (
        <>
          {/* redirect to homepage */}
          <section className="w-full min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold">Your cart is empty</p>
              <p className="text-gray-600">Add items to your cart to proceed</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/")}
                variant="default"
              >
                Go to homepage
              </Button>
            </div>
          </section>
        </>
      ) : (
        <section className="w-full min-h-screen pt-20">
          <Tabs
            className="w-11/12 mx-auto"
            value={activeTab}
            onValueChange={(value) => {
              // Prevent manual tab switching if previous steps aren't completed
              if (value === "shipping-details" && !completedSteps.personal)
                return;
              if (value === "payment-details" && !completedSteps.shipping)
                return;
              setActiveTab(value);
            }}
            orientation="horizontal"
          >
            <TabsList className="w-full bg-gray-50">
              <TabsTrigger className="w-full" value="personal-details">
                Personal
              </TabsTrigger>
              <TabsTrigger
                className="w-full"
                value="shipping-details"
                disabled={!completedSteps.personal}
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger
                className="w-full"
                value="payment-details"
                disabled={!completedSteps.shipping}
              >
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal-details">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>
                    Fill in your personal details to proceed with the checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Form {...personalForm}>
                    <form
                      className="space-y-3"
                      onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
                    >
                      {/* Get user name */}
                      <FormField
                        control={personalForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">Full Name</FormLabel>
                            <FormControl>
                              <Input id="name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Get user email */}
                      <FormField
                        control={personalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">Email Address</FormLabel>
                            <FormControl>
                              <Input id="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Get user phone number */}
                      <FormField
                        control={personalForm.control}
                        name="mobileNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="mobileNo">
                              Mobile Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="mobileNo"
                                {...field}
                                placeholder="+254"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="md:w-fit w-full " type="submit">
                        Proceed
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping-details">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                  <CardDescription>
                    Fill in your shipping details to proceed with the checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Form {...shippingForm}>
                    <form
                      className="space-y-3"
                      onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                    >
                      <FormField
                        control={shippingForm.control}
                        name="county"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="county">County</FormLabel>
                            <FormControl>
                              <Input id="county" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="city">City</FormLabel>
                            <FormControl>
                              <Input id="city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="district">District</FormLabel>
                            <FormControl>
                              <Input id="district" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="street">Street</FormLabel>
                            <FormControl>
                              <Input id="street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button className="md:w-fit w-full " type="submit">
                        Proceed
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment-details">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription className="border-b pb-3">
                    Fill in your payment details to proceed with the checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 border-b pb-5">
                    <div className="flex items-center justify-between">
                      <p>Cart Total</p>
                      <p>Kes {formatPrice(total)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Shipping Fee</p>
                      <p>Kes {shippingFee(total)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Total</p>
                      <p>Kes {orderTotal(total)}</p>
                    </div>
                  </div>

                  <div className="">
                    {/* Provide mpessa paybill details and instructions */}
                    <p className="text-sm text-gray-600">
                      Pay Kes {orderTotal(total)} to Paybill 123456 Account
                      123456 then enter the Mpesa code below to complete your
                      order
                    </p>
                  </div>
                  <Form {...paymentForm}>
                    <form
                      className="space-y-3"
                      onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
                    >
                      <FormField
                        control={paymentForm.control}
                        name="mpesaCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="mpesaCode">
                              Mpesa Code
                            </FormLabel>
                            <FormControl>
                              <Input id="mpesaCode" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={orderMutation.isPending}
                        className="md:w-fit w-full"
                      >
                        {orderMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          "Complete Order"
                        )}
                      </Button>
                      {orderMutation.isError && (
                        <p className="text-red-500 mt-2">
                          Error: {orderMutation.error.message}
                        </p>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  );
};

export default CheckoutPage;
