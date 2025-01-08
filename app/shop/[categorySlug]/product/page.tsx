import React from "react";
import Image from "next/image";
import ProductCard from "../../_contentBlocks/ProductCard";
import { Button } from "@/components/ui/button";
import QualityAssuarance from "../../_contentBlocks/QualityAssuarance";

type Props = {};

const ProductPage = (props: Props) => {
  return (
    <section className="w-full min-h-screen pt-20">
      {/* Product View */}
      <div className="w-11/12 mx-auto flex flex-wrap justify-between py-2 ">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/CoffeeTable.png"
            alt="Product Image"
            width={1000}
            height={1000}
            className="object-cover object-center w-full"
            priority
          />
        </div>

        {/* Details, Quantity  & Buttons */}
        <div className="w-full md:w-1/2 flex flex-col items-start py-5 md:p-10">
          {/* Product Name & Price */}
          <div className="pb-4 border-b w-full">
            <h1 className="text-4xl font-semibold">Coffee Table</h1>
            <p className="text-start text-xl mt-1">Kes 15,000</p>
          </div>
          {/* Product Description */}
          <div className="pt-4 w-full">
            <h1 className="text-lg">Product Description</h1>
            <p className="mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
              nam labore reprehenderit totam odio quos repellendus temporibus.
              Eveniet fugiat, et maxime illum quasi provident nemo quo eligendi,
              voluptas iusto voluptatibus.
            </p>
          </div>

          {/* Quantity */}
          <div className="pt-4">
            <h1>Quantity</h1>
            <div className="flex items-center space-x-2 mt-4">
              <Button>-</Button>
              <p className="w-10 p-2 rounded-lg text-center bg-white">1</p>
              <Button>+</Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col md:flex-row md:space-x-2 mt-5">
            <Button className="w-full mt-4" size="lg">Add to Cart</Button>
            <Button
              className="w-full mt-4"
              variant="outline"
              size="lg"
            >
              Save to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="w-11/12 mx-auto flex flex-col py-20">
        <h1 className="text-2xl font-semibold">You might also love these</h1>
        {/* Listing top 4 products */}
        <div className="my-4 flex flex-wrap">
          <ProductCard
            Img="/CoffeeTable.png"
            Name="Cracken Coffee Table"
            Price="15,000"
          />
          <ProductCard
            Img="/GlassVase.png"
            Name="Marble Glass Vase"
            Price="5,000"
          />
          <ProductCard
            Img="/CoffeeTable.png"
            Name="Cracken Coffee Table"
            Price="15,000"
          />
          <ProductCard
            Img="/GlassVase.png"
            Name="Marble Glass Vase"
            Price="5,000"
          />
        </div>
        {/* CTA button */}
        <Button className="md:w-fit mx-auto">View More</Button>
      </div>

      {/* Quality Assurance */}
      <QualityAssuarance />
    </section>
  );
};

export default ProductPage;
