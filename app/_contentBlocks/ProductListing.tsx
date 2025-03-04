"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "../_store/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Products {
  id: string;
  productName: string;
  productPrice: number;
  productImage: [{ url: string }];
  category: [{ categorySlug: string }];
  productSlug: string;
}

interface Props {
  title: string;
  count: number;
}

const ProductListing = ({ title, count }: Props) => {
  const { fetchProductPreview } = useStore();

  // Fetching first 8 products
  const { data, isLoading } = useQuery<Products[]>({
    queryKey: ["products"],
    queryFn: () => fetchProductPreview(count),
  });

  const router = useRouter();

  // Get Price then convert to string while adding the comma separator
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  return (
    <section className="w-11/12 mx-auto flex flex-col py-20">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {/* Listing top 8 products */}
      <div className="my-4 flex flex-wrap" data-testid="product-listing">
        {isLoading
          ? Array.from({ length: count }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="w-1/2 md:w-1/4 px-2 py-4 flex flex-col items-start"
              >
                <div className="flex flex-col space-y-3">
                  <Skeleton className=" bg-white w-full h-48 rounded-t-sm" />
                  <div className="space-y-2">
                    <Skeleton className=" bg-white h-4 w-2/3" />
                    <Skeleton className="bg-white h-4 w-1/3" />
                  </div>
                </div>
              </div>
            ))
          : data?.map((product) => (
              <ProductCard
                key={`product-${product.id}`}
                slug={product.productSlug}
                category={product.category[0].categorySlug}
                Img={product.productImage[0].url}
                Name={product.productName}
                Price={formatPrice(product.productPrice)}
              />
            )) ?? []}
      </div>
      <Button
        className="md:w-fit mx-auto"
        size="lg"
        onClick={() => router.push("/shop/all-products")}
      >
        Explore more products
      </Button>
    </section>
  );
};

export default ProductListing;
