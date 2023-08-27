import { trpc } from "@/app/_trpc/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn, imageHref } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { type ClassNameValue } from "tailwind-merge";

export const ImageGrid = ({
  productId,
  className,
}: {
  productId: string;
  className?: ClassNameValue;
}) => {
  const { data: images, refetch } =
    trpc.products.images.all.useQuery(productId);

  const { mutate } = trpc.products.images.delete.useMutation();

  const deleteImage = (imageId: string) => {
    mutate(imageId, {
      onSuccess: async () => await refetch(),
    });
  };

  return (
    <div
      className={cn(
        "rounded-md border p-4 grid grid-cols-2 h-full max-h-[600px] overflow-y-scroll",
        className
      )}
    >
      {images?.map((image) => (
        <div
          key={image.id}
          className="min-w-[200px] min-h-[300px] flex justify-center items-center border relative"
        >
          <AspectRatio
            ratio={16 / 9}
            className="h-full w-auto flex justify-center items-center"
          >
            <Image
              src={imageHref(image)}
              alt="Uploaded image"
              width={256}
              height={256}
            />
          </AspectRatio>
          <Button
            variant={"ghost"}
            className="absolute top-5 right-5"
            onClick={() => {
              deleteImage(image.id);
            }}
          >
            <TrashIcon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ))}
    </div>
  );
};
