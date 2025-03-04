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
} from "@/components/ui/pagination";
import { useStore } from "@/app/_store/store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    { value: "price0", label: "All Prices", min: 0, max: 1000000 },
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
      value: "PriceAsc",
      label: "Price: Low to High",
      sortFn: "productPrice_ASC",
    },
    {
      value: "PriceDesc",
      label: "Price: High to Low",
      sortFn: "productPrice_DESC",
    },
    { value: "ProdAsc", label: "Name: A to Z", sortFn: "productName_ASC" },
    { value: "ProdDesc", label: "Name: Z to A", sortFn: "productName_DESC" },
  ];

  const [variables, setVariables] = useState<{
    first?: number;
    after?: string | null;
    last?: number;
    before?: string | null;
    productPrice_gte?: number;
    productPrice_lte?: number;
    orderBy?: string | null;
  }>({
    first: 8,
    productPrice_lte: 1000000,
    productPrice_gte: 0,
    orderBy: "productName_ASC",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // usequery to fetch products
  const { data, isPending, isError, error } = useQuery<ProductsConnection>({
    queryKey: [categorySlug, variables],
    queryFn: () => {
      if (categorySlug === "all-products") {
        return fetchProductsConnection(variables);
      } else {
        return fetchProductByCategoryConnection(categorySlug, variables);
      }
    },
  });

  const handleNext = () => {
    if (!data?.pageInfo?.endCursor) return;
    setVariables((prev) => ({
      ...prev, // Preserve existing filters
      first: 8,
      after: data.pageInfo.endCursor ?? null,
      last: undefined, // Clear "last" when moving forward
      before: undefined, // Clear "before" when moving forward
    }));
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!data?.pageInfo?.startCursor) return;
    setVariables((prev) => ({
      ...prev, // Preserve existing filters
      last: 8,
      before: data.pageInfo.startCursor ?? null,
      first: undefined, // Clear "first" when moving backward
      after: undefined, // Clear "after" when moving backward
    }));
    setCurrentPage((prev) => prev - 1);
  };

  // Create filter handlers
  const handlePriceFilter = (value: string) => {
    const filter = priceFilter.find((f) => f.value === value);
    setVariables((prev) => ({
      ...prev,
      productPrice_gte: filter?.min,
      productPrice_lte: filter?.max,
      first: 8,
      // Reset pagination when filter changes
      after: null,
      before: null,
    }));
    setCurrentPage(1);
  };

  const handleSortFilter = (value: string) => {
    const sortMap = sortFilter.find((f) => f.value === value);
    setVariables((prev) => ({
      ...prev,
      orderBy: sortMap?.sortFn,
      // Reset pagination when sort changes
      first: 8,
      after: null,
      before: null,
    }));
    setCurrentPage(1);
  };

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
            <Select onValueChange={handlePriceFilter} defaultValue="price0">
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
            <Select onValueChange={handleSortFilter} defaultValue="ProdAsc">
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
          ) : data?.edges.length === 0 ? (
            <p>
              No products found. Please try a different filter or check back
              later.
            </p>
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

        {/* Pagination - Only show if more than one page exists */}
        {data?.aggregate?.count && Math.ceil(data.aggregate.count / 8) > 1 && (
          <Pagination className="my-4">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={!data?.pageInfo?.hasPreviousPage}
                >
                  <ChevronLeft />
                  Previous
                </Button>
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

                      setVariables((prev) => ({
                        ...prev, // Preserve existing filters
                        first:
                          page > currentPage
                            ? 8 * (page - currentPage)
                            : undefined,
                        after:
                          page > currentPage
                            ? data?.pageInfo.endCursor || null
                            : undefined,
                        last:
                          page < currentPage
                            ? 8 * (currentPage - page)
                            : undefined,
                        before:
                          page < currentPage
                            ? data?.pageInfo.startCursor || null
                            : undefined,
                      }));

                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {/* Next button */}

              <PaginationItem>
                <Button
                  variant="secondary"
                  onClick={handleNext}
                  disabled={!data?.pageInfo?.hasNextPage}
                >
                  Next
                  <ChevronRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default ShopListing;
