import { serverClient } from "@/app/_trpc/serverClient";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface UserPageProps {
  params: { userId: string };
}

const UserPage: React.FC<UserPageProps> = async ({ params }) => {
  const user = await serverClient.users.find(params.userId);

  if (!user) {
    return redirect("dashboard/users");
  }

  const orders = await serverClient.orders.findByUser(params.userId);

  return (
    <div className="flex flex-col items-start h-full w-full gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/users"}>
          <ArrowLeft />
        </Link>
        <h1 className="text-5xl">User View</h1>
      </div>
      <Separator />
      <div className="w-full grid grid-cols-2">
        <div className="grid text-lg gap-2 p-2">
          <p>User id: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {String(user.role)}</p>
          {/* <p>Create At: {user.createdAt}</p> */}
        </div>
        <div className="w-full p-4 pr-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Purchased At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Button variant={"link"} asChild>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        {order.id}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>{order.total}$</TableCell>
                  <TableCell>{String(order.isPaid)}</TableCell>
                  <TableCell>{String(order.createdAt)}$</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!orders && (
            <p className="mt-4 text-md font-semibold text-center">
              No orders found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
