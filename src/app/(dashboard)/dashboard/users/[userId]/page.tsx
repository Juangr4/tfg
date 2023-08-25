import { serverClient } from "@/app/_trpc/serverClient";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface UserPageProps {
  params: { userId: string };
}

const ProductPage: React.FC<UserPageProps> = async ({ params }) => {
  const user = await serverClient.users.find(params.userId);

  if (!user) {
    return redirect("dashboard/items");
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/users"}>
          <ArrowLeft />
        </Link>
        <h1 className="text-5xl">User View</h1>
      </div>
      <Separator />
      <p>{JSON.stringify(user)}</p>
    </div>
  );
};

export default ProductPage;
