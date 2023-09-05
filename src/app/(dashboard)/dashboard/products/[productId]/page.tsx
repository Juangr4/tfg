import { serverClient } from "@/app/_trpc/serverClient";
import { redirect } from "next/navigation";
import { ProductDetails } from "./details";

interface ProductPageProps {
  params: { productId: string };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await serverClient.products.find(params.productId);

  if (!product) {
    return redirect("dashboard/products");
  }

  return (
    <div className="flex flex-col items-start gap-4 p-8 w-full h-full">
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
