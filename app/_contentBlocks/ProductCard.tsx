import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useImageResizer } from "@/app/_hooks/useImageResizer";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  Img: string;
  Name: string;
  Price: string;
  slug: string;
  category: string;
};

const ProductCard = ({ Img, Name, Price, category, slug }: Props) => {
  const router = useRouter();
  const { resizeImage, resizedImage, isLoading, error } = useImageResizer();
  const [targetDimensions] = useState({ width: 400, height: 400 });

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

    const handleResize = async () => {
      const file = await convertUrlToFile(Img);
      if (file) {
        await resizeImage(
          file,
          targetDimensions.width,
          targetDimensions.height,
          {
            format: "image/webp",
            quality: 0.9,
            smoothing: true,
          }
        );
      }
    };

    handleResize();
  }, [Img, resizeImage, targetDimensions]);

  const onClick = (categorySlug: string, productSlug: string) => {
    router.push(`/shop/${categorySlug}/product/${productSlug}`);
  };

  return (
    <div
      className="w-1/2 md:w-1/4 px-2 py-4 flex flex-col items-start hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => onClick(category, slug)}
    >
      {isLoading ? (
        <Skeleton className="w-full h-[250px] rounded-sm" />
      ) : error ? (
        <div className="w-full h-48 rounded-sm bg-gray-100 flex items-center justify-center">
          <span className="text-red-500 text-sm">Image load error</span>
        </div>
      ) : (
        <Image
          src={resizedImage || Img}
          alt={Name}
          width={targetDimensions.width}
          height={targetDimensions.height}
          className="object-contain w-[400px] h-[250px] rounded-sm"
          loading="lazy"
        />
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <h3 className="mt-2 text-lg font-semibold line-clamp-1 text-left">
              {Name}
            </h3>
          </TooltipTrigger>
          <TooltipContent>
            <p>{Name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="mt-1">Kes {Price}</p>
    </div>
  );
};

export default ProductCard;
