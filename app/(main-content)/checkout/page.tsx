"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const CheckoutPage = () => {
  const { user } = useUser();
  return (
    <section className="w-full min-h-screen pt-20">
      <Tabs
        className="w-11/12 mx-auto"
        defaultValue="personal-details"
        orientation="horizontal"
      >
        <TabsList className="w-full bg-gray-50">
          <TabsTrigger className="w-full" value="personal-details">
            Personal details
          </TabsTrigger>
          <TabsTrigger className="w-full" value="shipping-details">
            Shipping details
          </TabsTrigger>
          <TabsTrigger className="w-full" value="payment-details">
            Payment details
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
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.fullName ?? ""} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mobileNo">Phone Number</Label>
                <Input id="emobileNo" placeholder="+254" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
              <div className="space-y-1">
                <Label htmlFor="county">County</Label>
                <Input id="county" />
              </div>
              <div className="space-y-1">
                {/* Add 2 fields on one line city & district */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input id="district" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="payment-details">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Fill in your payment details to proceed with the checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between md:mx-3">
                  <p>Cart Total</p>
                  <p>Kes 20,000</p>
                </div>
                <div className="flex items-center justify-between md:mx-3">
                  <p>Shipping Fee</p>
                  <p>Kes 1,000</p>
                </div>
                <div className="flex items-center justify-between md:mx-3">
                  <p>Total</p>
                  <p>Kes 21,000</p>
                </div>
              </div>

              <div className="">
                {/* Provide mpessa paybill details and instructions */}
                <p className="text-sm text-gray-600">
                  Pay Kes 21,000 to Paybill 123456 Account 123456 then enter the Mpesa code below to complete your order
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="mpesaCode">Mpesa Code</Label>
                <Input id="mpesaCode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Complete Order</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default CheckoutPage;
