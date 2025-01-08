"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import { useStore } from "../_store/store";
import { useQuery } from "@tanstack/react-query";

interface Categories {
  id: string;
  categoryName: string;
  categorySlug: string;
}

const Footer = () => {
  const { fetchCategories } = useStore();

  // Fetch Categories
  const query = useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <footer className="w-full bg-purple-800 py-5 text-gray-50">
      {/* Top Half */}
      <div className=" w-11/12 mx-auto flex flex-wrap justify-between py-2 border-b">
        {/* Links */}
        <div className="w-full md:w-2/3 flex flex-wrap justify-between">
          {/* Menu */}
          <div className="w-1/2 md:w-1/3 flex flex-col items-start">
            <h1 className="text-xl font-semibold underline mb-1">Shop</h1>
            <ul className="text-sm flex flex-col gap-2">
              <li>
                <Link href="/new-arrivals">New Arrivals</Link>
              </li>
              <li>
                <Link href="/best-seller">Best Seller</Link>
              </li>
              <li>
                <Link href="/products">All Products</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="w-1/2 md:w-1/3 flex flex-col items-start">
            <h1 className="text-xl font-semibold underline mb-1">Categories</h1>
            <ul className="text-sm flex flex-col gap-2">
              <li>
                <Link href="/shop">All Products</Link>
              </li>
              {query.data?.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.categorySlug}`}>
                    {category.categoryName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div className="w-1/2 md:w-1/3 flex flex-col items-start">
            <h1 className="text-xl font-semibold underline mb-1">
              Our Company
            </h1>
            <ul className="text-sm flex flex-col gap-2">
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">Terms and Conditions</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/shipping-and-returns">Shipping and Returns</Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Newsletter */}
        <div className="w-full md:w-1/3 flex flex-col justify-start my-4 md:my-0 md:px-6">
          <h1 className="text-base w-full">
            Join the club and get the benefits
          </h1>
          <div className=" mt-2 flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Email" />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="w-11/12 mx-auto flex justify-between py-2">
        {/* Copyrights */}
        <div className="w-full md:w-1/2">
          <p className="text-center md:text-start">© 2025 Toztoz Households.</p>
        </div>
        {/* Socials */}
        <div className="hidden md:flex md:w-1/2 ">
          <ul className="w-full flex gap-4 justify-end">
            <li>
              <Link href="/facebook">
                <FacebookIcon size={20} />
              </Link>
            </li>
            <li>
              <Link href="/twitter">
                <TwitterIcon size={20} />
              </Link>
            </li>
            <li>
              <Link href="/instagram">
                <InstagramIcon size={20} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
