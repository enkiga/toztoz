import React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  key: string;
  Img: string;
  Name: string;
  Price: string;
};

const ProductCard = ({ key, Img, Name, Price }: Props) => {
  return (
    <div
      key={key}
      className="w-1/2 md:w-1/4 px-2 py-4 flex flex-col items-start hover:scale-105 transition-transform duration-300"
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
