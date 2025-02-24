"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "../_store/store";
import { useQuery } from "@tanstack/react-query";

interface Categories {
  id: string;
  categoryName: string;
  categorySlug: string;
}

interface Documents {
  title: string;
  docSlug: string;
}

const Footer = () => {
  const { fetchCategories, getDocuments } = useStore();

  // get current year
  const year = new Date().getFullYear();

  // Fetch Categories
  const query = useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch Documents
  const { data: docData } = useQuery<Documents[]>({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  return (
    <footer className="w-full bg-gray-800 py-5 text-gray-50">
      {/* Top Half */}
      <div className=" w-11/12 mx-auto flex flex-wrap justify-between py-2 border-b">
        {/* Links */}
        <div className="w-full md:w-2/3 flex flex-wrap justify-between">
          {/* Categories */}
          <div className="w-2/3 flex flex-col items-start px-1">
            <h1 className="text-xl font-semibold underline mb-1">Categories</h1>
            <ul className="text-sm flex flex-wrap">
              <li className="w-full md:w-1/2 px-1">
                <Link href="/all-products">All Products</Link>
              </li>
              {query.data?.map((category) => (
                <li key={category.id} className="w-full md:w-1/2 px-1">
                  <Link href={`/${category.categorySlug}`}>
                    {category.categoryName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div className="w-1/3 flex flex-col items-start px-1">
            <h1 className="text-xl font-semibold underline mb-1">
              Our Company
            </h1>
            <ul className="text-sm flex flex-col gap-2">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              {docData?.map((doc) => (
                <li key={doc.title}>
                  <Link href={`/docs/${doc.docSlug}`}>{doc.title}</Link>
                </li>
              ))}
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
          <p className="text-center md:text-start">
            © {year} Toztoz Households.
          </p>
        </div>
        {/* Socials */}
        <div className="hidden md:flex md:w-1/2 ">
          <ul className="w-full flex gap-4 justify-end">
            <li>
              <Link href="/facebook">
                <Image
                  src="/facebook.svg"
                  alt="logo"
                  width={25}
                  height={25}
                  className="w-6 h-6 object-contain object-center"
                />
              </Link>
            </li>
            <li>
              <Link href="/twitter">
                <Image
                  src="/twitter.svg"
                  alt="logo"
                  width={25}
                  height={25}
                  className="w-6 h-6 object-contain object-center"
                />
              </Link>
            </li>
            <li>
              <Link href="/instagram">
                <Image
                  src="/instagram.svg"
                  alt="logo"
                  width={25}
                  height={25}
                  className="w-6 h-6 object-contain object-center"
                />
              </Link>
            </li>
            <li>
              <Link href="/tiktok">
                <Image
                  src="/tiktok.svg"
                  alt="logo"
                  width={25}
                  height={25}
                  className="w-6 h-6 object-contain object-center"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
