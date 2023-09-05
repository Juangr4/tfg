import { serverClient } from "@/app/_trpc/serverClient";
import { dbClient } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  const productsInside = await dbClient.query.products.findMany({
    where: eq(products.categoryId, category.id),
  });

  return (
    <div className="flex flex-col items-start h-full w-full gap-4 p-4">
      <CategoryDetails category={category} products={productsInside} />
    </div>
  );
};

export default CategoryPage;
