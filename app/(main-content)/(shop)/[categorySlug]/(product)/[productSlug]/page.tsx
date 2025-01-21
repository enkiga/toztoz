"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import QualityAssuarance from "@/app/_contentBlocks/QualityAssuarance";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useStore } from "@/app/_store/store";
import { useQuery } from "@tanstack/react-query";
import markdownit from "markdown-it";
import ProductListing from "@/app/_contentBlocks/ProductListing";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  productName: string;
  productPrice: number;
  productImage: [{ url: string }];
  productDescription: string;
  productQuantity: number;
  productSlug: string;
  productStatus: string;
  category: [{ categoryName: string; categorySlug: string }];
}

interface Cart {
  userEmail: string;
  item: CartItem[];
}

interface CartItem extends Product {
  product: Product;
  selectedQuantity: number;
}

interface Error {
  message: string;
}

const ProductPage = () => {
  const { fetchProductBySlug, addToCart } = useStore();

  const params = useParams<{ categorySlug: string; productSlug: string }>();

  const productSlug = params.productSlug;

  const { data, isLoading } = useQuery<Product>({
    queryKey: ["product", productSlug],
    queryFn: () => fetchProductBySlug(productSlug),
  });

  const md = new markdownit();
  const description = data
    ? md.renderInline(data.productDescription)
    : "No Description Provided";

  // Get Price then convert to string while adding the comma separator
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  const [cartQuantity, setCartQuantity] = useState(1);

  const [alert, setAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<Error[]>([]);

  const addQuantity = () => {
    // reference Product quantity if available ensure you cannot add more than the available quantity
    console.log("Add Quantity");

    if (data && cartQuantity < data.productQuantity) {
      setCartQuantity(cartQuantity + 1);
    }
    // else if product quantity is not available, add to cart without quantity limit
    else if (!data) {
      setCartQuantity(cartQuantity + 1);
    } else {
      console.log("Cannot add more than available quantity");

      // add the alert to the alerts array then make alert true
      setErrorMessage(() => [
        {
          message: `Cannot add more than available quantity which is ${data.productQuantity}`,
        },
      ]);
      setAlert((alert) => !alert);
    }
  };

  const reduceQuantity = () => {
    console.log("Reduce Quantity");

    if (cartQuantity > 1) {
      setCartQuantity(cartQuantity - 1);
    } else {
      console.log("Cannot reduce quantity below 1");
      setErrorMessage(() => [{ message: `Cannot reduce quantity below 1` }]);
      setAlert((alert) => !alert);
    }
  };

  // Cart grapql operations

  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || "";

  // Add to Cart button functionality
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  const handleCart = () => {
    setAddingToCart(true);
    const cartItem: CartItem = {
      ...data!,
      product: data!,
      selectedQuantity: cartQuantity,
    };

    if (data) {
      addToCart(data, cartQuantity);
      setAddingToCart(false);
      setCartQuantity(1);
      toast("Added to cart", {
        description: `${data.productName} has been added to cart`,
      })
    }
  };

  // create a boolean to check if the product is in the cart

  return (
    <section className="w-full min-h-screen pt-20">
      {/* Product View */}
      {isLoading ? (
        <div className="">Loading ..</div>
      ) : (
        data && (
          <div className="w-11/12 mx-auto flex flex-wrap justify-between py-2 ">
            {/* Product Image */}
            <div className="w-full md:w-1/2">
              <Image
                src={data.productImage[0].url}
                alt="Product Image"
                width={1000}
                height={1000}
                className="object-cover object-center w-full"
                priority
              />
            </div>

            {/* Details, Quantity  & Buttons */}
            <div className="w-full md:w-1/2 flex flex-col items-start py-5 md:p-10">
              {/* Product Name & Price */}
              <div className="pb-4 border-b w-full">
                <h1 className="text-4xl font-semibold">{data.productName}</h1>
                <p className="text-start text-xl mt-1">
                  Kes {formatPrice(data.productPrice)}
                </p>
              </div>
              {/* Product Description */}
              <div className="pt-4 w-full">
                <h1 className="text-lg">Product Description</h1>
                <p className="mt-2">{description}</p>
              </div>

              {/* Quantity */}
              <div className="pt-4">
                <h1>Quantity</h1>
                <div className="flex items-center space-x-2 mt-4">
                  <Button onClick={() => reduceQuantity()}>-</Button>
                  <p className="w-10 p-2 rounded-lg text-center bg-white">
                    {cartQuantity}
                  </p>
                  <Button onClick={() => addQuantity()}>+</Button>
                </div>
                <AlertDialog open={alert} onOpenChange={setAlert}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-semibold text-red-500">
                        Alert!
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      {errorMessage.map((e, index) => (
                        <p key={index}>{e.message}</p>
                      ))}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* CTA Buttons */}
              <div className="w-full flex flex-col md:flex-row md:space-x-2 mt-5">
                {addingToCart ? (
                  <Button className="w-full md:w-1/2 mt-4" size="lg" disabled>
                    <Loader2 className="animate-spin" />
                    Adding to Cart
                  </Button>
                ) : (
                  <Button
                    className="w-full md:w-1/2 mt-4"
                    size="lg"
                    onClick={() => handleCart()}
                  >
                    Add to Cart
                  </Button>
                )}

                {/* <Button className="w-full mt-4" variant="outline" size="lg">
                  Save to Wishlist
                </Button> */}
              </div>
            </div>
          </div>
        )
      )}
      {/* Similar Products */}
      <ProductListing title="Similar Products" count={4} />

      {/* Quality Assurance */}
      <QualityAssuarance />
    </section>
  );
};

export default ProductPage;
