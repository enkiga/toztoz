"use client";

import React from "react";
import Link from "next/link";
import {
  AlignJustifyIcon,
  SearchIcon,
  ShoppingBasketIcon,
  User2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {};

const NavigationBar = ({}: Props) => {
  return (
    <section className="w-full h-fit py-3 md:py-0 md:h-20 bg-gray-50 border-b">
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
          <div className="hidden md:flex">
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
          <div className="hidden md:flex flex-row items-center gap-3">
            <Search />
            <Cart />
            <UserProfile />
          </div>

          {/* Bar Icon for Mobile View */}
          <div className="flex flex-row gap-4 md:hidden">
            <Search />
            <MobileNav />
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
    </section>
  );
};

export default NavigationBar;

// User Profile View
const UserProfile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User2Icon size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        {/* Label */}
        <DropdownMenuLabel> My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Group: Profile, Orders & WishList  */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/orders">Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/wishlist">Wishlist</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Cart View
const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <p className="absolute -top-3 -right-2 text-xs bg-purple-700 text-white rounded-full px-1">
            1
          </p>
          <ShoppingBasketIcon size={16} />
        </div>
      </SheetTrigger>

      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Your Cart (1 Item)</SheetTitle>
          <SheetDescription>These are the items in your cart</SheetDescription>
        </SheetHeader>
        {/* Items Selected */}
        <div className="flex flex-col gap-3 py-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
              <img
                src="https://via.placeholder.com/150"
                alt="product"
                className="w-16 h-16"
              />
              <div>
                <p>Product Name</p>
                <p>Price</p>
              </div>
            </div>
            <div>
              <p>Qty</p>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>View Cart</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// Search View
const Search = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  //   Set isOpen to true when the SearchIcon is clicked

  return (
    <>
      <SearchIcon size={16} onClick={() => setIsOpen(true)} />

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No Result Found</CommandEmpty>

          <CommandSeparator />

          <CommandGroup heading="Categories">
            <CommandItem>Shoes</CommandItem>
            <CommandItem>Shirts</CommandItem>
            <CommandItem>Pants</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Products">
            <CommandItem>Product 1</CommandItem>
            <CommandItem>Product 2</CommandItem>
            <CommandItem>Product 3</CommandItem>
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};

// Mobile Nav View
const MobileNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AlignJustifyIcon size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        {/* Grouping */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/cart">Cart (1)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/orders">Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/wishlist">Wishlist</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/about">About Us</Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Categories</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Link href="/category">Shoes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category">Shirts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category">More ...</Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Link href="/contact">Contact</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/blog">Blog</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
