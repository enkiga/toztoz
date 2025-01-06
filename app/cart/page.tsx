import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {};

const CartPage = ({}: Props) => {
  return (
    <section className="w-full min-h-screen pt-20">
      <div className="w-11/12 mx-auto flex flex-col">
        <h1 className="font-semibold text-2xl mt-10">Your shopping cart (2)</h1>
        {/* Table for Cart Products */}
        <Table className="w-full mt-10">
          <TableCaption className="text-right my-10">
            <div className="">
                <p>Taxes and shipping are calculated at checkout</p>
                <Button size="lg" className="mt-2">Go to checkout</Button>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow className="flex gap-10">
              <TableHead className="flex flex-1 font-semibold">
                Product
              </TableHead>
              <TableHead className="text-center font-semibold hidden md:block">
                Quantity
              </TableHead>
              <TableHead className="text-right font-semibold  hidden md:block">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="flex gap-10 items-center">
              <TableCell className="flex flex-1">
                <div className="flex flex-1 gap-4">
                  <Image
                    src="/CoffeeTable.png"
                    alt="Product Image"
                    width={1000}
                    height={1000}
                    className="object-cover object-center w-20 h-20"
                  />
                  <div className="flex flex-col justify-between md:justify-start">
                    <h1 className="font-semibold">Coffee Table</h1>

                    <p className="md:hidden">Quantity: 1</p>
                    <p className="text-gray-500 mt-2">Kes 15,000</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center  hidden md:block">
                <div className="">
                  <p className="">1</p>
                </div>
              </TableCell>
              <TableCell className="text-right  hidden md:block">
                Kes 15,000
              </TableCell>
            </TableRow>
            <TableRow className="flex gap-10 items-center">
              <TableCell className="flex flex-1">
                <div className="flex flex-1 gap-4">
                  <Image
                    src="/GlassVase.png"
                    alt="Product Image"
                    width={1000}
                    height={1000}
                    className="object-cover object-center w-20 h-20"
                  />
                  <div className="flex flex-col justify-between md:justify-start">
                    <h1 className="font-semibold">Glass vase</h1>

                    <p className="md:hidden">Quantity: 1</p>
                    <p className="text-gray-500 mt-2">Kes 5,000</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center  hidden md:block">
                <div className="">
                  <p className="">1</p>
                </div>
              </TableCell>
              <TableCell className="text-right  hidden md:block">
                Kes 5,000
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right">Subtotal: <span className="font-semibold text-base">Kes 20,000</span></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
};

export default CartPage;
