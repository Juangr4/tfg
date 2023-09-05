import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dbClient } from "@/db";
import { orders } from "@/db/schema";
import { cartItem } from "@/lib/types";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

interface OrderPageProps {
  params: { orderId: string };
}

const OrderPage: React.FC<OrderPageProps> = async ({ params }) => {
  const order = await dbClient.query.orders.findFirst({
    where: eq(orders.id, params.orderId),
  });

  if (!order) {
    return redirect("dashboard/orders");
  }

  const items = z.array(cartItem).parse(order.items);

  return (
    <div className="flex flex-col items-start h-full w-full gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/orders"}>
          <ArrowLeft />
        </Link>
        <h1 className="text-5xl">Order View</h1>
      </div>
      <Separator />
      <div className="w-full grid grid-cols-2">
        <div className="grid text-lg gap-2 p-2">
          <p>Order id: {order.id}</p>
          <p>
            User id:{" "}
            <Button variant={"link"} className="text-lg" asChild>
              <Link href={`/dashboard/users/${order.userId}`}>
                {order.userId}
              </Link>
            </Button>
          </p>
          <p>Name: {order.name}</p>
          <p>Email: {order.email}</p>
          <p>Phone: {order.phone}</p>
          <p>
            Address:{" "}
            <Button variant={"link"} className="text-lg" asChild>
              <Link href={`https://www.google.com/maps/place/${order.address}`}>
                {order.address}
              </Link>
            </Button>
          </p>
          <p>Paid: {String(order.isPaid)}</p>
          {/* <p>Create At: {order.createdAt}</p> */}
        </div>
        <div className="w-full p-4 pr-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell>
                    <Button variant={"link"} asChild>
                      <Link href={`/dashboard/products/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>{item.product.price}$</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="text-right">Total:</TableCell>
                <TableCell>{order.total}$</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
