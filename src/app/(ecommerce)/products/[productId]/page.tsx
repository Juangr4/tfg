import { serverClient } from "@/app/_trpc/serverClient";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dbClient } from "@/db";
import { products } from "@/db/schema";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { ActionsMenu } from "./actions-menu";
import ImageSlider from "./image-slider";
import { ProductReviews } from "./reviews";

interface ProductDetailsPageProps {
  params: { productId: string };
}

const ProductDetailsPage: FC<ProductDetailsPageProps> = async ({ params }) => {
  // const product = await serverClient.products.find(params.productId);
  const product = await dbClient.query.products.findFirst({
    where: eq(products.id, params.productId),
    with: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // const category = await serverClient.categories.find(product.categoryId);
  const stats = await serverClient.products.reviews.rating(product.id);
  const rating = Math.round(stats.sum / stats.count);

  return (
    <>
      <div className="grid xl:flex justify-center items-center h-full gap-4 w-4/5">
        <div className="xl:w-1/2 pt-8 xl:pt-0">
          <ImageSlider images={product.images} />
        </div>
        <div className="xl:w-1/2 h-full flex flex-col items-center p-4 gap-4">
          <div className="w-full flex flex-col gap-3">
            <h2 className="text-3xl font-bold text-left capitalize">
              {product.name}
            </h2>
            <h3 className="text-2xl font-medium">${product.price}</h3>
            <div className="flex flex-1 items-center gap-1">
              <div className="flex gap-1 items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        Number.isNaN(rating) || i >= rating ? "opacity-25" : ""
                      )}
                    />
                  ))}
                <span className="text-lg ml-4">
                  {Number.isNaN(rating) ? "0" : rating}
                </span>
              </div>
              <Button variant={"link"} className="text-blue-800" asChild>
                <Link href={"#reviews"}>See all {stats.count} reviews.</Link>
              </Button>
            </div>
            <p className="text-md font-medium">{product.description}</p>
            <span>Category: {product.category.name}</span>
          </div>
          <div className="w-full">
            <ActionsMenu product={product} image={product.images[0]} />
          </div>
        </div>
      </div>
      <div className="container my-16 space-y-8">
        <h4 className="text-lg font-semibold">Recent Reviews</h4>
        <Separator />
        <ProductReviews product={product} />
      </div>
    </>
  );
};

export default ProductDetailsPage;
