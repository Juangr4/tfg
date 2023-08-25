import { serverClient } from "@/app/_trpc/serverClient";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CategoryDetails } from "./details";

interface CategoryPageProps {
  params: { categoryId: string };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const category = await serverClient.categories.find(params.categoryId);

  if (!category) {
    return redirect("dashboard/categories");
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/categories"}>
          <ArrowLeft />
        </Link>
        <h1 className="text-5xl">Category View</h1>
      </div>
      <Separator />
      <CategoryDetails category={category} products={[]} />
    </div>
  );
};

export default CategoryPage;
