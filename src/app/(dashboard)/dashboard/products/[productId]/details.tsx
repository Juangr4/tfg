"use client";

import { trpc } from "@/app/_trpc/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type insertProductSchemaType } from "@/lib/types";
import Image from "next/image";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import {
  ArchivedFormField,
  CategoryFormField,
  DescriptionFormField,
  NameFormField,
  PriceFormField,
} from "../fields";
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
  const { data: imagesHref } = trpc.products.images.allHref.useQuery(
    product.id ?? ""
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

  if (editing)
    return (
      <>
        <div className="flex justify-center items-center gap-8 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <NameFormField form={form} />
              <DescriptionFormField form={form} />
              <PriceFormField form={form} />
              <ArchivedFormField form={form} />
              <CategoryFormField form={form} categories={categories ?? []} />
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
            </form>
          </Form>
          <div>{product.id && <ImageUpload productId={product.id} />}</div>
        </div>
      </>
    );

  return (
    <div className="grid grid-cols-2 w-full">
      <div className="p-4">
        <h1 className="text-4xl">{product.name}</h1>
        <p>{product.description}</p>
        <p>Precio: {product.price}</p>
        <p>Categoria: {!!category && category.name}</p>
        <p>
          {product.archived
            ? "El producto esta archivado"
            : "El producto es visible"}
        </p>
        <Button
          onClick={() => {
            setEditing(true);
          }}
        >
          Edit
        </Button>
      </div>
      <div className="w-full">
        <ScrollArea className="rounded-md border p-4 grid grid-cols-2">
          {imagesHref?.map((href) => (
            <div key={href} className="w-2/5">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={href}
                  alt="Uploaded image"
                  width={256}
                  height={256}
                />
              </AspectRatio>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};
