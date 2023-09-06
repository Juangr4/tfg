import { authOptions } from "@/app/_nextauth/options";
import { serverClient } from "@/app/_trpc/serverClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const OrdersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  const orders = await serverClient.orders.allByUser(session.user.id);
  return (
    <div className="py-16 h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Create At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell className="text-center">{order.total}</TableCell>
              <TableCell>{order.createdAt?.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersPage;
