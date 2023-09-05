"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { type insertProductSchemaType } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import {
  ArchivedFormField,
  CategoryFormField,
  DescriptionFormField,
  NameFormField,
  PriceFormField,
} from "../fields";
import { ImageGrid } from "./image-grid";
import { ImageUpload } from "./image-upload";

interface ProductFormProps {
  product: insertProductSchemaType;
}

export const ProductDetails: FC<ProductFormProps> = ({
  product: initialProduct,
}) => {
  const [product, setProduct] = useState(initialProduct);
  const { data: categories } = trpc.categories.all.useQuery();
  const { data: category, refetch } = trpc.categories.find.useQuery(
    product.categoryId
  );
  const { mutate, isLoading } = trpc.products.update.useMutation();
  const [editing, setEditing] = useState(false);
  const form = useForm<insertProductSchemaType>({
    defaultValues: initialProduct,
  });

  const onSubmit = (data: insertProductSchemaType) => {
    mutate(data, {
      onSuccess(data, variables, context) {
        setProduct(data ?? variables);
        refetch();
        setEditing(false);
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex items-center gap-4 w-full mb-2">
            <Link href={"/dashboard/products"}>
              <ArrowLeft />
            </Link>
            <h1 className="text-5xl">Product View</h1>
            {!editing && (
              <Button
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit
              </Button>
            )}
            {editing && (
              <div className="flex gap-4 justify-center">
                <Button disabled={isLoading} type="submit">
                  Save
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <Separator />
          <div className="grid grid-cols-2 w-full">
            <div className="flex flex-col gap-4 text-lg p-2">
              {!editing && (
                <>
                  <h1>
                    Name : <span>{product.name}</span>
                  </h1>
                  <p>
                    Description: <span>{product.description}</span>
                  </p>
                  <p>
                    Price: <span>{product.price}$</span>
                  </p>
                  <p>
                    Category:{" "}
                    {!!category && (
                      <Button variant={"link"} className="text-lg" asChild>
                        <Link href={`/products/categories/${category.id}`}>
                          {category.name}
                        </Link>
                      </Button>
                    )}
                  </p>
                  <p>Archived: {String(product.archived)}</p>
                </>
              )}
              {editing && (
                <div className="space-y-8">
                  <NameFormField form={form} />
                  <DescriptionFormField form={form} />
                  <PriceFormField form={form} />
                  <ArchivedFormField form={form} />
                  <CategoryFormField
                    form={form}
                    categories={categories ?? []}
                  />
                </div>
              )}
            </div>
            <div className="h-full p-2">
              <ImageGrid
                productId={product.id ?? ""}
                className="h-[400px] mb-4"
              />
              {editing && product.id && <ImageUpload productId={product.id} />}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
