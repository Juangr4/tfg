import { serverClient } from "@/app/_trpc/serverClient";
import { StarIcon } from "lucide-react";
import { type FC } from "react";
import ImageSlider from "./image-slider";

interface ProductDetailsPageProps {
  params: { productId: string };
}

const ProductDetailsPage: FC<ProductDetailsPageProps> = async ({ params }) => {
  const product = await serverClient.products.find(params.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const category = await serverClient.categories.find(product.categoryId);

  return (
    <div className="flex justify-center items-center h-full gap-4 w-4/5">
      <div className="w-1/2">
        <ImageSlider productId={product.id} />
      </div>
      <div className="w-1/2 h-full flex flex-col items-center p-4">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-left capitalize">
            {product.name}
          </h2>
          <h3 className="text-2xl font-medium">${product.price}</h3>
          <div className="flex gap-1">
            {Array(5)
              .fill(0)
              .map((v, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
          </div>
          <p>{product.description}</p>
          <span>Category: {category?.name}</span>
          {/* <AddToCartButton product={product} /> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
