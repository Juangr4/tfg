import { serverClient } from "@/app/_trpc/serverClient";
import EcommerceCard from "./card";
import { Filters } from "./filters";
import PaginationControls from "./pagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    search?: string;
    categories?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  let page = Number(searchParams.page ?? 1);
  if (page < 1) page = 1;

  const items = await serverClient.products.paged({
    page,
    filters: {
      searchQuery: searchParams.search,
      categories: searchParams.categories
        ? searchParams.categories.split(",")
        : undefined,
      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,
    },
  });

  return (
    <div className="flex flex-col items-center justify-between p-24 gap-4 w-full">
      <h1 className="text-5xl pb-4">This is the Products Page</h1>
      <div className="flex flex-col lg:flex-row justify-between w-full gap-8">
        <div className="lg:w-1/5">
          <Filters />
        </div>
        <div className="flex-1">
          {items.length === 0 && (
            <p className="text-3xl text-center w-full">No products found.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 xl:grid-cols-3  xl:gap-8">
            {items.map((item) => (
              <EcommerceCard
                key={item.product.id}
                product={item.product}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
      <PaginationControls page={page} hasNextPage={true} />
    </div>
  );
}
