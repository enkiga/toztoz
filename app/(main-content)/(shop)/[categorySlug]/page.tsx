"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/app/_contentBlocks/ProductCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/app/_store/store";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface Products {
  id: string;
  productName: string;
  productPrice: number;
  productImage: [{ url: string }];
  category: [{ categorySlug: string }];
  productSlug: string;
}

interface Category {
  id: string;
  categoryName: string;
  categorySlug: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

interface ProductsConnection {
  edges: { node: Products }[];
  pageInfo: PageInfo;
  aggregate: { count: number };
}

interface ProductsQueryData {
  productsConnection: ProductsConnection;
}

const ShopListing = () => {
  const { fetchCategories, fetchProductByCategory, fetchListProducts } =
    useStore();

  const params = useParams<{ categorySlug: string }>();
  const categorySlug = params.categorySlug;

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  //   from params.categorySlug, get the category name
  const category = categories?.find(
    (category) => category.categorySlug === categorySlug
  );

  // assign filtered products to data based on filters selected

  // Get Price then convert to string while adding the comma separator
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  // Filtering and Sorting
  const priceFilter = [
    { value: "price1", label: "Kes 0 - Kes 1000", min: 0, max: 1000 },
    { value: "price2", label: "Kes 1001 - Kes 5000", min: 1001, max: 5000 },
    { value: "price3", label: "Kes 5001 - Kes 10000", min: 5001, max: 10000 },
    { value: "price4", label: "Kes 10001 - Kes 50000", min: 10001, max: 50000 },
    {
      value: "price5",
      label: "Kes 50001 - Kes 100000",
      min: 50001,
      max: 100000,
    },
    {
      value: "price6",
      label: "Kes 100001 - Kes 500000",
      min: 100001,
      max: 500000,
    },
  ];

  const sortFilter = [
    {
      value: "sort1",
      label: "Price: Low to High",
      sortFn: (a: Products, b: Products) => a.productPrice - b.productPrice,
    },
    {
      value: "sort2",
      label: "Price: High to Low",
      sortFn: (a: Products, b: Products) => b.productPrice - a.productPrice,
    },
    {
      value: "sort3",
      label: "Product: A to Z",
      sortFn: (a: Products, b: Products) =>
        a.productName.localeCompare(b.productName),
    },
    {
      value: "sort4",
      label: "Product: Z to A",
      sortFn: (a: Products, b: Products) =>
        b.productName.localeCompare(a.productName),
    },
  ];

  const [page, setPage] = useState(1);

  const pageSize = 8;

  const { isPending, data, isError, error, isFetching, isPlaceholderData } =
    useQuery<ProductsQueryData[]>({
      // check if categorySlug is all-products tehn fetch all products else not fetch product by category
      queryKey: ["products", categorySlug, page],
      queryFn: async (): Promise<ProductsQueryData[]> => {
        let products: Products[];
        if (categorySlug === "all-products") {
          products = await fetchListProducts(pageSize * page);
        } else {
          products = await fetchProductByCategory(categorySlug);
        }
        return [
          {
            productsConnection: {
              edges: products.map((product) => ({ node: product })),
              pageInfo: {
                hasNextPage: products.length === pageSize,
                endCursor:
                  products.length > 0 ? products[products.length - 1].id : null,
                hasPreviousPage: page > 1,
                // set startCursor to null if page is 1 else set to the first product id
                startCursor: page === 1 ? null : products[0].id,
              },
              aggregate: {
                count: data?.[0]?.productsConnection?.aggregate?.count || 0,
              },
            },
          },
        ];
      },
      placeholderData: keepPreviousData,
      staleTime: 5000,
    });

  // Calculate total number of pages based on aggregate count and page size
  const totalPages = Math.ceil(
    (data?.[0]?.productsConnection?.aggregate?.count || 0) / pageSize
  );

  return (
    <section className="w-full md:min-h-screen">
      {/* Title header */}
      <div className="relative bg-[url(https://images.unsplash.com/photo-1617784625140-515e220ba148?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center bg-no-repeat w-full h-40 md:h-56">
        <div className="absolute inset-0 bg-purple-800/65"></div>
        <h1 className="absolute bottom-3 left-6 md:left-16 text-4xl text-gray-50 font-bold">
          {category?.categoryName || "All Products"}
        </h1>
      </div>

      {/* Listing */}
      <div className="w-11/12 mx-auto">
        {/* Filtering */}
        <div className="w-full flex items-center justify-between my-4">
          {/* Product Filters */}
          <div className="flex space-x-4">
            {/* Price Filter */}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceFilter.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sorting Filter */}
          <div className="">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortFilter.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listing */}
        <div className="w-full flex flex-wrap">
          {isPending ? (
            <div className="">Loading ...</div>
          ) : isError ? (
            <p>Error {error.message}</p>
          ) : (
            data?.[0].productsConnection.edges.map(({ node: product }) => (
              <ProductCard
                key={product.id}
                slug={product.productSlug}
                category={product.category[0].categorySlug || "all-products"}
                Img={product.productImage[0].url}
                Name={product.productName}
                Price={formatPrice(product.productPrice)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        
      </div>
    </section>
  );
};

export default ShopListing;
