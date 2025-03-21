"use client";

import React, { useState, useEffect } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import { useStore } from "@/app/_store/store";
import { useQuery } from "@tanstack/react-query";
import markdownit from "markdown-it";
import ProductListing from "@/app/_contentBlocks/ProductListing";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useImageResizer } from "@/app/_hooks/useImageResizer";
import { Skeleton } from "@/components/ui/skeleton";

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
    ? md.render(data.productDescription)
    : "No Description Provided";

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US");
  };

  const [cartQuantity, setCartQuantity] = useState(1);
  const [alert, setAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<Error[]>([]);

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";

  // Image resizing hook
  const { resizeImage } = useImageResizer();
  const [resizedImages, setResizedImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  // Resize images when data loads
  useEffect(() => {
    const convertUrlToFile = async (url: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], "product-image", { type: blob.type });
      } catch (err) {
        console.error("Error converting URL to File:", err);
        return null;
      }
    };

    const processImages = async (images: { url: string }[]) => {
      try {
        setImagesLoading(true);
        const processedImages = await Promise.all(
          images.map(async (image) => {
            const file = await convertUrlToFile(image.url);
            if (!file) return image.url;

            try {
              return await resizeImage(file, 1200, 1200, {
                format: "image/webp",
                quality: 0.95,
              });
            } catch (error) {
              console.error("Resizing error:", error);
              return image.url; // Fallback to original
            }
          })
        );
        setResizedImages(
          processedImages.filter(
            (image): image is string => typeof image === "string"
          )
        );
      } finally {
        setImagesLoading(false);
      }
    };

    if (data?.productImage) {
      processImages(data.productImage);
    }
  }, [data, resizeImage]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addQuantity = () => {
    if (data && cartQuantity < data.productQuantity) {
      setCartQuantity(cartQuantity + 1);
    } else if (!data) {
      setCartQuantity(cartQuantity + 1);
    } else {
      setErrorMessage(() => [
        {
          message: `Cannot add more than available quantity which is ${data.productQuantity}`,
        },
      ]);
      setAlert((alert) => !alert);
    }
  };

  const reduceQuantity = () => {
    if (cartQuantity > 1) {
      setCartQuantity(cartQuantity - 1);
    } else {
      setErrorMessage(() => [{ message: `Cannot reduce quantity below 1` }]);
      setAlert((alert) => !alert);
    }
  };

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
      });
    }
  };

  return (
    <section className="w-full min-h-screen pt-20">
      {isLoading ? (
        <div className="w-11/12 mx-auto flex gap-8">
          <Skeleton className="w-1/2 h-[500px]" />
          <Skeleton className="w-1/2 h-[500px]" />
        </div>
      ) : (
        data && (
          <div className="w-11/12 mx-auto flex flex-wrap justify-between py-2">
            {/* Product Image Section */}
            <div className="w-full md:w-1/2">
              {imagesLoading ? (
                <Skeleton className="w-full h-[500px]" />
              ) : (
                <Image
                  src={
                    resizedImages[currentImageIndex] ||
                    data.productImage[currentImageIndex].url
                  }
                  alt="Product Image"
                  width={1200}
                  height={1200}
                  className="object-cover object-center w-full h-[500px] rounded-md shadow-md"
                  priority
                />
              )}

              {data.productImage.length > 1 && (
                <div className="mt-4">
                  <div className="w-full text-right my-2 mr-2">
                    <p className="text-xs font-semibold text-gray-500">
                      {currentImageIndex + 1}/{data.productImage.length}
                    </p>
                  </div>

                  <Carousel opts={{ align: "center" }} className="w-full">
                    <CarouselContent className="flex gap-2 -ml-1">
                      {data.productImage.map((image, index) => (
                        <CarouselItem
                          key={index}
                          className={`basis-1/2 md:basis-1/4 w-[100px] h-[100px] border rounded-md pl-1 ${
                            index === currentImageIndex
                              ? "border-purple-400"
                              : "border-gray-200"
                          }`}
                        >
                          <div
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            {imagesLoading ? (
                              <Skeleton className="w-full h-full" />
                            ) : (
                              <Image
                                src={resizedImages[index] || image.url}
                                alt="Product Image"
                                width={400}
                                height={400}
                                className="object-cover object-center rounded-md w-full h-full"
                                priority
                              />
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}
            </div>

            {/* Details, Quantity & Buttons */}
            <div className="w-full md:w-1/2 flex flex-col items-start py-5 md:p-10">
              <div className="pb-4 border-b w-full">
                <h1 className="text-4xl font-semibold">{data.productName}</h1>
                <p className="text-start text-xl mt-1">
                  Kes {formatPrice(data.productPrice)}
                </p>
              </div>

              <div className="pt-4 w-full">
                <h1 className="text-lg">Product Description</h1>
                <div
                  className="mt-4"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>

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
              </div>
            </div>
          </div>
        )
      )}

      <ProductListing title="Similar Products" count={4} />
      <QualityAssuarance />
    </section>
  );
};

export default ProductPage;
