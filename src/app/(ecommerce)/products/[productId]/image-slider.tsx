"use client";

import { trpc } from "@/app/_trpc/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { imageHref } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ImageSliderProps {
  productId: string;
}

const ImageSlider = ({ productId }: ImageSliderProps) => {
  const [images] = trpc.products.images.all.useSuspenseQuery(productId);

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
            src={selected === undefined ? "" : imageHref(selected)}
            alt={"image"}
            width={512}
            height={512}
            className="object-cover h-full w-auto"
          />
        </AspectRatio>
      </div>
      <div className="snap-x overflow-x-scroll h-[200px] grid grid-flow-col border">
        {images.map((image) => (
          <div
            key={image.id}
            className="w-[200px] h-full flex justify-center"
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
