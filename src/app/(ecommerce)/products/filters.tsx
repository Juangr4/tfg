"use client";

import { trpc } from "@/app/_trpc/client";
import { DoubleSlider } from "@/components/double-slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories } = trpc.categories.all.useQuery();
  const [price, setPrice] = useState([
    searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : 0,
    searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : 100,
  ]);
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.has("categories")
      ? (searchParams.get("categories") as string).split(",")
      : []
  );

  const createQueryString = useCallback(
    (newValues: Array<{ name: string; value: any }>) => {
      const params = new URLSearchParams(searchParams);
      newValues.forEach((newValue) => {
        params.set(newValue.name, newValue.value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const debouncedMinPrice = useDebounce(price[0]);
  const debouncedMaxPrice = useDebounce(price[1]);
  const debouncedCategories = useDebounce(selectedCategories);

  useEffect(() => {
    const params = [];
    params.push({ name: "minPrice", value: String(debouncedMinPrice) });
    params.push({ name: "maxPrice", value: String(debouncedMaxPrice) });
    params.push({ name: "categories", value: selectedCategories });
    const newParams = createQueryString(params);
    if (newParams === searchParams.toString()) return;
    router.push(`/products?${newParams}`);
  }, [debouncedMinPrice, debouncedMaxPrice, debouncedCategories]);

  return (
    <div className="grid gap-4 p-2">
      <h3 className="text-xl font-bold">Filters</h3>
      <Separator />
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="price" className="text-lg font-semibold">
            Price
          </Label>
          <span className="rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {price[0]}$ - {price[1]}$
          </span>
        </div>
        <DoubleSlider
          max={100}
          min={0}
          defaultValue={price}
          step={0.5}
          onValueChange={setPrice}
          id="price"
        />
      </div>
      <Separator />
      <div className="grid">
        <h4 className="text-lg font-semibold">Categories</h4>
        {categories?.map((category) => (
          <div key={category.id} className="flex gap-2 items-center py-2 px-1">
            <Checkbox
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={(checked) => {
                checked
                  ? setSelectedCategories([...selectedCategories, category.id])
                  : setSelectedCategories(
                      selectedCategories.filter((v) => v !== category.id)
                    );
              }}
              id={category.id}
            />
            <Label htmlFor={category.id} className="capitalize">
              {category.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
