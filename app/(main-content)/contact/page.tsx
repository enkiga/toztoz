import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {};

const Contact = ({}: Props) => {
  return (
    <section className="w-full md:min-h-screen pt-20">
      <h1 className="text-center text-2xl font-semibold my-4">Get in Touch</h1>
      <div className="w-full flex flex-wrap bg-gray-50">
        <div className="md:w-1/2 w-full relative">
          <Image
            src="https://images.unsplash.com/uploads/1413222992504f1b734a6/1928e537?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="contact us image"
            width={1000}
            height={1000}
            priority
            className=" object-contain object-center"
          />
          <div className="absolute inset-0 bg-black/70 text-white flex flex-col items-start justify-end p-10">
            <p className="font-semibold">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis
              iusto, distinctio odio nam minima nostrum ut ipsa cum assumenda
              aliquid neque, fuga nemo eum doloribus consectetur recusandae
              eaque accusantium. Dolores.
            </p>
            <p className="mt-2 font-semibold">
              Email Address: toztoz@gmail.com
            </p>
            <p className="mt-2 font-semibold">Phone Number: 1234567890</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-10">
          <form action="#" className="w-full flex flex-col my-5">
            {/* Full Name */}
            <div className="w-full flex flex-col my-4">
              <Label htmlFor="fname" className="mb-1 pl-1">
                Full Name
              </Label>
              <Input type="fname" id="fname" placeholder="Full Name" />
            </div>
            {/* Email Address and Phone Number */}
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 flex flex-col my-4 md:pr-2">
                <Label htmlFor="email" className="mb-1 pl-1">
                  Email Address
                </Label>
                <Input type="email" id="email" placeholder="Email Address" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col my-4">
                <Label htmlFor="phone" className="mb-1 pl-1">
                  Phone Number
                </Label>
                <Input type="phone" id="phone" placeholder="Phone Number" />
              </div>
            </div>
            {/* Message */}
            <div className="w-full flex flex-col my-4">
              <Label htmlFor="message" className="mb-1 pl-1">
                Message
              </Label>
              <Textarea id="message" placeholder="Message" />
            </div>
            {/* Submit Button */}
            <Button type="submit" className="md:w-fit" size="lg">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
