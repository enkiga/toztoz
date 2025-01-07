import React from "react";
import ProductCard from "../_contentBlocks/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type Props = {};

const ShopListing = ({}: Props) => {
  return (
    <section className="w-full md:min-h-screen">
      {/* Title header */}
      <div className="relative bg-[url(https://images.unsplash.com/photo-1617784625140-515e220ba148?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center bg-no-repeat w-full h-40 md:h-56">
        <div className="absolute inset-0 bg-purple-800/65"></div>
        <h1 className="absolute bottom-3 left-6 md:left-16 text-4xl text-gray-50 font-bold">
          All Products
        </h1>
      </div>

      {/* Listing */}
      <div className="w-11/12 mx-auto">
        {/* Filtering */}
        <div className="w-full flex items-center justify-between my-4">
          {/* Product Filters */}
          <div className="flex space-x-4">
            {/* Category Filter */}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
                <SelectItem value="category3">Category 3</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price1">Kes 0 - Kes 1000</SelectItem>
                <SelectItem value="price2">Kes 1001 - Kes 5000</SelectItem>
                <SelectItem value="price3">Kes 5001 - 10000</SelectItem>
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
                <SelectItem value="sort1">Price: Low to High</SelectItem>
                <SelectItem value="sort2">Price: High to Low</SelectItem>
                <SelectItem value="sort3">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listing */}
        <div className="w-full flex flex-wrap">
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

        {/* Pagination */}
        <Pagination className="my-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive >1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis/>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

export default ShopListing;
