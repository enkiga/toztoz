import React from "react";
import Image from "next/image";

type Props = {
  Img: string;
  Name: string;
  Price: string;
};

const ProductCard = ({ Img, Name, Price }: Props) => {
  return (
    <div className="w-1/2 md:w-1/4 px-2 py-4 flex flex-col items-start">
      <Image
        src={Img}
        alt={Name}
        width={1000}
        height={1000}
        className="object-cover object-center h-48 rounded-t-sm"
      />
      <h3 className="mt-2 text-lg font-semibold line-clamp-2">{Name}</h3>
      <p className="mt-1">Kes {Price}</p>
    </div>
  );
};

export default ProductCard;
