import { serverClient } from "@/app/_trpc/serverClient";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductDetails } from "./details";

interface ProductPageProps {
  params: { productId: string };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await serverClient.products.find(params.productId);

  if (!product) {
    return redirect("dashboard/items");
  }

  return (
    <div className="flex flex-col items-center justify-start gap-4 p-8 w-full h-full">
      <div className="flex items-center gap-4 w-full">
        <Link href={"/dashboard/products"}>
          <ArrowLeft />
        </Link>
        <h1 className="text-5xl">Product View</h1>
      </div>
      <Separator />
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
