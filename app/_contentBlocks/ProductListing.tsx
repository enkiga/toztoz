import { Button } from "@/components/ui/button";
import React from "react";
import ProductCard from "./ProductCard";

type Props = {};

const ProductListing = (props: Props) => {
  return (
    <section className="w-11/12 mx-auto flex flex-col py-20">
      <h1 className="text-2xl font-semibold">Top Products</h1>
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
      <Button className="md:w-fit mx-auto">View Products</Button>
    </section>
  );
};

export default ProductListing;
