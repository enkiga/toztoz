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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  edges: {
    cursor: string;
    node: Products;
  }[];
  pageInfo: PageInfo;
  aggregate: { count: number };
}

const ShopListing = () => {
  const {
    fetchCategories,
    fetchProductsConnection,
    fetchProductByCategoryConnection,
  } = useStore();

  const params = useParams<{ categorySlug: string }>();
  const categorySlug = params.categorySlug;

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const category = categories?.find(
    (category) => category.categorySlug === categorySlug
  );

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

  const [variables, setVariables] = useState<{
    first?: number;
    after?: string | null;
    last?: number;
    before?: string | null;
  }>({ first: 8 });

  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, data, isError, error } = useQuery<ProductsConnection>({
    // check if categorySlug is all-products tehn fetch all products else not fetch product by category
    queryKey: [categorySlug, variables],
    queryFn: async (): Promise<ProductsConnection> => {
      let productsConnection: ProductsConnection;
      if (categorySlug === "all-products") {
        productsConnection = await fetchProductsConnection(variables);
      } else {
        productsConnection = await fetchProductByCategoryConnection(
          categorySlug,
          {...variables}
        );
      }
      return productsConnection;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const handleNext = () => {
    if (!data?.pageInfo?.endCursor) return;
    setVariables({
      first: 8,
      after: data.pageInfo.endCursor ?? null,
    });
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!data?.pageInfo?.startCursor) return;
    setVariables({
      last: 8,
      before: data.pageInfo.startCursor ?? null,
    });
    setCurrentPage((prev) => prev - 1);
  };

  console.log(categories);

  return (
    <section className="w-full md:min-h-screen">
      {/* Title header */}
      <div className="relative bg-[url(https://images.unsplash.com/photo-1617784625140-515e220ba148?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center bg-no-repeat w-full h-40 md:h-56">
        <div className="absolute inset-0 bg-gray-800/75"></div>
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
            data?.edges.map(({ node }) => (
              <ProductCard
                key={node.id}
                slug={node.productSlug}
                category={node.category[0].categorySlug}
                Img={node.productImage[0].url}
                Name={node.productName}
                Price={formatPrice(node.productPrice)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  aria-disabled={
                    !data?.pageInfo?.hasPreviousPage || currentPage === 1
                  }
                />
              </PaginationItem>

              {/* Display page numbers */}
              {Array.from(
                { length: Math.ceil((data?.aggregate.count || 0) / 8) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => {
                      if (page === currentPage) return;
                      if (page > currentPage) {
                        // Handle forward navigation
                        setVariables({
                          first: 8 * (page - currentPage),
                          after: data?.pageInfo.endCursor || null,
                        });
                      } else {
                        // Handle backward navigation
                        setVariables({
                          last: 8 * (currentPage - page),
                          before: data?.pageInfo.startCursor || null,
                        });
                      }
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  aria-disabled={
                    !data?.pageInfo?.hasNextPage
                  }
                  className="disabled:opacity-50"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
};

export default ShopListing;
