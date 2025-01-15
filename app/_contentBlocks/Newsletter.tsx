import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {};

const Newsletter = ({}: Props) => {
  return (
    <section className="bg-gray-50 w-full flex flex-wrap">
      <div className="w-full md:w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Newsletter"
          width={1000}
          height={1000}
          className="object-cover object-center w-full"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-start justify-between p-10">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold">
            Join the club and get the benefits
          </h1>
          <p className="text-start mt-5 text-sm">
            Sign up for our newsletter and receive exclusive offers on new
            ranges, sales, products and more
          </p>
        </div>
        <div className="flex w-full max-w-sm my-4 md:my-0 items-center space-x-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit">Subscribe</Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
