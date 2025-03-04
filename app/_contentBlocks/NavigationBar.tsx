"use client";

import React from "react";
import Link from "next/link";
import {
  AlignJustifyIcon,
  SearchIcon,
  ShoppingBasketIcon,
  Trash2Icon,
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
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { useStore } from "../_store/store";
import { useQuery } from "@tanstack/react-query";

import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import SearchBox from "./SearchBox";

interface Categories {
  id: string;
  categoryName: string;
  categorySlug: string;
}

const NavigationBar = () => {
  const { fetchCategories, cart } = useStore();

  // Fetch Categories
  const query = useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { user, isLoaded } = useUser();

  return (
    <section className="w-full bg-background py-3 md:py-1  border-b fixed top-0 z-50">
      {/* Top Section: Banner */}
      {/* Bottom Section: Logo, hyperlinks, Search, Cart & User Profile */}
      <div className="flex w-11/12 mx-auto py-1 flex-row items-center justify-between">
        {/* Logo */}
        <div className="">
          <Link href="/" className="font-semibold text-2xl">
            <Image src="/TozTozBanner.png" alt="logo" width={100} height={50} />
          </Link>
        </div>
        {/* Hyperlinks, Search, Cart & User Profile */}
        <div className="flex flex-row items-center gap-6 ">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[200px] flex flex-col bg-background">
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link href="/shp/all-products">All Products</Link>
                    </li>
                    {query.data?.map((category) => (
                      <li
                        key={category.id}
                        className="px-4 py-2 hover:bg-gray-200"
                      >
                        <Link href={`/shop/${category.categorySlug}`}>
                          {category.categoryName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/career" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Join Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* Search, Cart & User Profile */}
          <div className="hidden md:flex flex-row items-center gap-3">
            <SearchBox />
            <Cart />
            {isLoaded && user ? <UserProfile user={user} /> : <SignInButton />}
          </div>

          {/* Bar Icon for Mobile View */}
          <div className="flex flex-row gap-4 md:hidden">
            <SearchBox />
            <Cart />
            <MobileNav query={query} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavigationBar;

// User Profile View
interface UserProfileProps {
  user: any;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User2Icon size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        {/* Label */}
        <DropdownMenuLabel> {user?.fullName}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Group: Profile, Orders & WishList  */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/orders">Orders</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          <SignOutButton>Log out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Cart View
const Cart = () => {
  const { cartItem, removeFromCart, clearCart } = useStore((state) => state);
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  const total = cartItem.reduce((acc, item) => {
    return acc + item.product.productPrice * item.selectedQuantity;
  }, 0);

  const totalItemPrice = (price: number, quantity: number) => {
    return formatPrice(price * quantity);
  };

  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <p className="absolute -top-3 -right-2 text-xs bg-purple-700 text-white rounded-full px-1">
            {cartItem.length}
          </p>
          <ShoppingBasketIcon size={16} />
        </div>
      </SheetTrigger>

      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartItem.length} Item)</SheetTitle>
          <SheetDescription>These are the items in your cart</SheetDescription>
        </SheetHeader>
        {/* Items Selected */}
        {/* If cart is empty display cart is empty else show the scroll area */}
        {cartItem.length === 0 ? (
          <div className="h-80 w-full pr-4 my-4 flex flex-col items-center justify-center">
            <p className="text-center text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <ScrollArea className="h-3/6 md:h-80 w-full pr-4 my-4">
            {cartItem.map((item) => (
              <div
                className="flex flex-col gap-3 py-4"
                key={item.product.productSlug}
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-start gap-3">
                    <Image
                      src={item.product.productImage[0].url}
                      alt="product"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain object-center"
                    />
                    <div className="flex flex-col items-start pr-3">
                      <p className=" line-clamp-1 text-sm">
                        {item.product.productName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Kes{" "}
                        {totalItemPrice(
                          item.product.productPrice,
                          item.selectedQuantity
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.selectedQuantity}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeFromCart(item.product.productSlug)}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}

        <SheetFooter>
          {cartItem.length > 0 && (
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-row justify-between w-full">
                <p className="text-lg">Total</p>
                <p className="text-lg">Kes {formatPrice(total)}</p>
              </div>
              <div className="flex flex-col justify-between w-full gap-2">
                <Button variant="destructive" onClick={() => clearCart()}>
                  Clear Cart
                </Button>
                <SheetClose asChild>
                  <Button onClick={() => router.push("/checkout")}>
                    Proceed to checkout
                  </Button>
                </SheetClose>
              </div>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// Mobile Nav View
const MobileNav = ({
  query,
}: {
  query: ReturnType<typeof useQuery<Categories[]>>;
}) => {
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
            <Link href="/orders">Orders</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/about">About Us</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/contact">Contact</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/career">Join Us</Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Categories</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Link href="/shop/all-products">All Products</Link>
                </DropdownMenuItem>
                {query.data?.map((category: Categories) => (
                  <DropdownMenuItem key={category.id}>
                    <Link href={`/shop/${category.categorySlug}`}>
                      {category.categoryName}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          <SignOutButton>Log out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
