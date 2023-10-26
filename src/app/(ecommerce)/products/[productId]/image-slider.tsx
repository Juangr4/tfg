"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type selectImageSchemaType } from "@/lib/types";
import { cn, imageHref } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ImageSliderProps {
  // productId: string;
  images: selectImageSchemaType[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {
  const [selected, setSelected] = useState(
    images.length === 0 ? undefined : images[0]
  );

  return (
    <div className="flex flex-col justify-between min-w-[450px]">
      <div className="border min-h-[400px] grid align-middle">
        <AspectRatio
          ratio={16 / 9}
          className="flex justify-center items-center"
        >
          <Image
            src={imageHref(selected)}
            alt={"image"}
            width={512}
            height={512}
            className="object-cover h-full w-auto"
          />
        </AspectRatio>
      </div>
      <div className="snap-x overflow-x-scroll h-[200px] grid grid-flow-col border">
        {images.length === 0 && (
          <div
            className={"w-[200px] h-full flex justify-center border-4"}
            onClick={() => {
              setSelected(undefined);
            }}
          >
            <AspectRatio
              ratio={16 / 9}
              className="h-auto w-full flex justify-center items-center snap-start border"
            >
              <Image
                src={imageHref(undefined)}
                alt={"image"}
                width={128}
                height={128}
              />
            </AspectRatio>
          </div>
        )}
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "w-[200px] h-full flex justify-center",
              selected?.id === image.id ? "border-4" : ""
            )}
            onClick={() => {
              setSelected(image);
            }}
          >
            <AspectRatio
              ratio={16 / 9}
              className="h-auto w-full flex justify-center items-center snap-start border"
            >
              <Image
                src={imageHref(image)}
                alt={"image"}
                width={128}
                height={128}
              />
            </AspectRatio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
