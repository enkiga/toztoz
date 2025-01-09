import React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

type Props = {
  Img: string;
  Name: string;
  Price: string;
  slug: string;
  category: string;
};

const ProductCard = ({ Img, Name, Price, category, slug }: Props) => {
  const router = useRouter();

  const onClick = (categorySlug: string, productSlug: string) => {
    // Change the route to the product detail page
    console.log("Clicked");

    // Redirect to the product detail page
    router.push(`/${categorySlug}/${productSlug}`);
  };
  return (
    <div
      className="w-1/2 md:w-1/4 px-2 py-4 flex flex-col items-start hover:scale-105 transition-transform duration-300"
      onClick={() => onClick(category, slug)}
    >
      <Image
        src={Img}
        alt={Name}
        width={1000}
        height={1000}
        className="object-cover object-center h-48 rounded-sm"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <h3 className="mt-2 text-lg font-semibold line-clamp-1 text-left  ">
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
