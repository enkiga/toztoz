import React from "react";
import Image from "next/image";

type Props = {
  resizedImage: string;
  dimensions: { width: number; height: number };
};

const ResizedImage = ({ resizedImage, dimensions }: Props) => {
  return (
    <div className="image-preview">
      <Image
        src={resizedImage}
        alt="Resized preview"
        width={dimensions.width}
        height={dimensions.height}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <p className="resolution">
        {dimensions.width}x{dimensions.height}
      </p>
    </div>
  );
};

export default ResizedImage;
