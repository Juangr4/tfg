import { serverClient } from "@/app/_trpc/serverClient";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { orderColumnsDefinition } from "./columns";

const OrdersPage = async () => {
  const orders = await serverClient.orders.all();

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-4 p-12">
      <div className="flex justify-start items-center w-full gap-4">
        <h1 className="text-5xl">Orders</h1>
      </div>
      <Separator />
      <DataTable
        className="w-full"
        columns={orderColumnsDefinition}
        data={orders}
      />
    </div>
  );
};

export default OrdersPage;
