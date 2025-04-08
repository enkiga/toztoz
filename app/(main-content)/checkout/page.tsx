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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useStore } from "@/app/_store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { counties } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Discount {
  id: string;
  name: string;
  code: string;
  offerPercentage: number;
  userEmail: string;
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
  county: z.string().refine((value) => counties.some((c) => c.name === value), {
    message: "Please select a valid county from the list",
  }),
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
  const queryClient = useQueryClient();
  // get cart items from store: if cart is empty, redirect to homepage with a message to add items to cart
  const { cartItem, createOrder, getDiscounts, updateDiscount } = useStore();

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

  const calculateShippingFee = (total: number, county: string) => {
    // Find the rating for the selected county, default to 1 (Nairobi) if not found
    const rating = counties.find((c) => c.name === county)?.rating ?? 1;

    // Calculate the increment rate based on the county's rating
    const baseRate = 2.5; // Base rate for Nairobi
    const rateIncrement = 0.1; // Additional rate per rating point
    const incrementRate = baseRate + rateIncrement * (rating - 1);

    // Calculate the number of thousands in the total amount
    const numberOfThousands = Math.floor(total / 1000);

    // Calculate the shipping fee
    let fee = 200; // Minimum shipping fee
    if (numberOfThousands > 0) {
      fee += (numberOfThousands * (incrementRate * 1000)) / 100;
    }

    // Round up the fee and cap it at the maximum allowed fee
    const maximumFee = 3000;
    return Math.min(Math.ceil(fee), maximumFee);
  };

  const orderTotal = (total: number, county: string) => {
    return formatPrice(total + calculateShippingFee(total, county));
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
      // Calculate discounted values first
      const discountedSubtotal = total - discountAmount;
      const calculatedShipping = calculateShippingFee(
        discountedSubtotal,
        formData.shipping.county
      );
      const orderPayload = {
        ...orderData,

        itemTotal: discountedSubtotal,
        shippingFee: calculatedShipping,
        orderTotal: discountedSubtotal + calculatedShipping,
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
    onSuccess: async (data) => {
      // Clear cart on success
      useStore.getState().clearCart();

      // update discount with user's email
      if (appliedDiscount && email) {
        try {
          await updateDiscount(email, appliedDiscount.code);
          // Invalidate discounts query to refresh data
          await queryClient.invalidateQueries({
            queryKey: ["discounts", email],
          });
        } catch (error) {
          console.error("Discount update failed:", error);
          toast.error("Discount usage tracking failed - contact support");
        }
      }
      // Show success message
      toast("Order submitted successfully", {
        description: "Your order has been placed successfully.",
      });

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
    const discountedSubtotal = total - discountAmount;
    const calculatedShipping = calculateShippingFee(
      discountedSubtotal,
      formData.shipping.county
    );

    const completeOrderData: Order = {
      customerName: formData.personal.name,
      customerEmail: formData.personal.email,
      customerMobile: formData.personal.mobileNo,
      county: formData.shipping.county,
      city: formData.shipping.city,
      district: formData.shipping.district,
      street: formData.shipping.street,
      itemTotal: discountedSubtotal,
      shippingFee: calculatedShipping,
      orderTotal: discountedSubtotal + calculatedShipping,
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

  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [showModal, setShowModal] = useState(false);

  const email = user?.primaryEmailAddress
    ? user.primaryEmailAddress.emailAddress
    : null;

  // Fetch discounts from the server
  const { data: discounts, isLoading: isDiscountsLoading } = useQuery<
    Discount[]
  >({
    queryKey: ["discounts", email],
    queryFn: () => getDiscounts(),
    enabled: !!email,
    initialData: [],
  });

  const handleApplyDiscount = () => {
    if (!email) {
      toast.error(
        "You must be logged in with a verified email to use discounts"
      );
      return;
    }

    if (!discountCodeInput) {
      toast.error("Please enter a discount code");
      return;
    }

    const discount = discounts?.find((d) => d.code === discountCodeInput);

    if (!discount) {
      toast.error("Invalid discount code");
      setDiscountCodeInput("");
      return;
    }

    // Check if the discount has already been used by the user
    if (discount.userEmail?.includes(email)) {
      // Use .includes() to check if the email exists in the array
      setShowModal(true);
      setDiscountCodeInput("");
      return;
    }

    // Update discount with user's email
    try {
      setAppliedDiscount(discount);
      toast.success(`Discount applied: ${discount.offerPercentage}% off`);
    } catch (error) {
      toast.error("Failed to apply discount");
      setDiscountCodeInput("");
    }
  };

  const discountAmount = appliedDiscount
    ? (total * appliedDiscount.offerPercentage) / 100
    : 0;

  const shippingFee = calculateShippingFee(
    total - discountAmount,
    formData.shipping.county
  );
  const orderTotalValue = total - discountAmount + shippingFee;

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
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select County" />
                                </SelectTrigger>
                                <SelectContent>
                                  {counties.map((county) => (
                                    <SelectItem
                                      key={county.name}
                                      value={county.name}
                                    >
                                      {county.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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

                    {appliedDiscount && (
                      <div className="flex items-center justify-between text-green-600">
                        <p>Discount ({appliedDiscount.offerPercentage}%)</p>
                        <p>- Kes {formatPrice(discountAmount)}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p>Shipping Fee</p>
                      <p>
                        Kes{" "}
                        {formatPrice(
                          calculateShippingFee(
                            total - discountAmount,
                            formData.shipping.county
                          )
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between font-bold">
                      <p>Total</p>
                      <p>Kes {formatPrice(orderTotalValue)}</p>
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="flex items-center justify-between border-b pb-5 gap-2">
                    <Input
                      placeholder="Enter Discount Code"
                      value={discountCodeInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value)}
                      disabled={!!appliedDiscount || isDiscountsLoading}
                    />
                    <Button
                      variant="outline"
                      className="w-fit"
                      onClick={handleApplyDiscount}
                      disabled={
                        isDiscountsLoading ||
                        !discountCodeInput ||
                        !!appliedDiscount ||
                        !email
                      }
                    >
                      {isDiscountsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>

                  <div className="">
                    {/* Provide mpessa paybill details and instructions */}
                    <p className="text-sm text-gray-600">
                      Pay Kes {formatPrice(orderTotalValue)} to Paybill 123456
                      Account 123456 then enter the Mpesa code below to complete
                      your order
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

          <Dialog
            open={showModal}
            onOpenChange={(open) => {
              if (!open) setDiscountCodeInput(""); // Clear input when modal closes
              setShowModal(open);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Discount Already Used</DialogTitle>
                <DialogDescription>
                  This discount code has already been used with your account.
                  Each discount code can only be used once per user.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      )}
    </>
  );
};

export default CheckoutPage;
