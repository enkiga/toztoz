import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {};

const HeroSection = ({}: Props) => {
  return (
    <section className="relative md:bg-[url(https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center bg-no-repeat w-full h-dvh">
      <div className="hidden md:block absolute inset-0 bg-purple-800/75"></div>
      <div className="md:absolute z-10 right-10 top-1/4 flex flex-col md:bg-white/95 rounded-sm md:w-[630px] md:p-10 px-4 ">
        <h1 className="text-4xl font-semibold text-gray-800">
          Luxury homeware for people who love timeless design quality{" "}
        </h1>
        <p className="text-sm font-light text-gray-500 mt-2">
          Shop the new collection of handcrafted items.{" "}
        </p>

        <Button className="mt-10 md:w-fit">View Collection</Button>
      </div>
      <Image
          src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Image"
          width={767}
          height={500}
          
          className="block md:hidden mt-6 object-cover object-center"
          priority
        />
    </section>
  );
};

export default HeroSection;
