import { serverClient } from "@/app/_trpc/serverClient";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { productColumnsDefinition } from "./columns";
import { DialogProductForm } from "./dialog-form";

export const dynamic = "force-dynamic";

const ProductsPage = async () => {
  const products = await serverClient.products.all();

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-4 p-12">
      <div className="flex justify-start items-center w-full gap-4">
        <h1 className="text-5xl">Products</h1>
        <DialogProductForm />
      </div>
      <Separator />
      <DataTable
        className="w-full"
        columns={productColumnsDefinition}
        data={products}
      />
    </div>
  );
};

export default ProductsPage;
