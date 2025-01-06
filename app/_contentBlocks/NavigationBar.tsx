import React from "react";
import Link from "next/link";
import { SearchIcon, ShoppingBasketIcon, User2Icon } from "lucide-react";

type Props = {};

const NavigationBar = ({}: Props) => {
  return (
    <section className="w-full h-32 bg-gray-50">
      {/* Top Section: Logo, hyperlinks, Search, Cart & User Profile */}
      <div className="flex w-11/12 mx-auto h-full md:h-1/2 flex-row items-center justify-between">
        {/* Logo */}
        <div className="">
          <Link href="/" className="font-semibold text-2xl">
            Toztoz
          </Link>
        </div>
        {/* Hyperlinks, Search, Cart & User Profile */}
        <div className="flex flex-row items-center gap-6 ">
          {/* Hyperlinks */}
          <div>
            <ul className="flex flex-row items-center gap-3">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>
          {/* Search, Cart & User Profile */}
          <div className=" flex flex-row items-center gap-3">
            <SearchIcon size={16} />
            <ShoppingBasketIcon size={16} />
            <User2Icon size={16} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Categories Hyperlink */}
      <div className="w-full bg-background hidden md:flex h-1/2">
        <ul className="w-full flex flex-row items-center justify-center gap-6">
          <li>
            <Link href="/category">Shoes</Link>
          </li>
          <li>
            <Link href="/category">Shoes</Link>
          </li>
          <li>
            <Link href="/category">Shoes</Link>
          </li>
          <li>
            <Link href="/category">Shoes</Link>
          </li>
          <li>
            <Link href="/category">Shoes</Link>
          </li>
          <li>
            <Link href="/category">Shoes</Link>
          </li>
        </ul>
      </div>

      {/* Mobile View */}
    </section>
  );
};

export default NavigationBar;
