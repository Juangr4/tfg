"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  insertCategorySchema,
  type insertCategorySchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { NameFormField } from "../fields";

interface CategoryFormProps {
  category: insertCategorySchemaType;
  products: selectProductSchemaType[];
}

export const CategoryDetails: FC<CategoryFormProps> = ({
  category: initialCategory,
  products,
}) => {
  const [category, setCategory] = useState(initialCategory);
  const { mutate, isLoading } = trpc.categories.update.useMutation();
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const form = useForm<insertCategorySchemaType>({
    defaultValues: initialCategory,
    resolver: zodResolver(insertCategorySchema),
  });

  const onSubmit = (data: insertCategorySchemaType) => {
    console.log("Edited");
    mutate(data, {
      onError(error, variables, context) {
        if (!error.data?.zodError) return;
        const errors = error.data.zodError.fieldErrors;
        for (const key in errors) {
          const issues = errors[key];
          issues?.forEach((issue) => {
            form.setError(key as keyof insertCategorySchemaType, {
              type: "custom",
              message: issue,
            });
          });
        }
        setCategory(variables);
      },
      onSuccess(data, variables, context) {
        setCategory(data ?? variables);
        setEditing(false);
      },
    });
  };

  useEffect(() => {
    const handlerUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "Carajio";
    };

    if (editing) {
      window.addEventListener("beforeunload", handlerUnload);

      return () => {
        window.removeEventListener("beforeunload", handlerUnload);
      };
    }
    return () => {};
  }, [editing]);

  if (editing)
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <NameFormField form={form} />
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
    );

  return (
    <>
      <h1 className="text-4xl">{category.name}</h1>
      <Button
        onClick={() => {
          setEditing(true);
        }}
      >
        Edit
      </Button>
      <p className="text-2xl">Products inside category</p>
      {products.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Archived</TableHead>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                onClick={() => {
                  router.push(`/dashboard/products/${product.id}`);
                }}
              >
                <TableCell className="text-center">{product.name}</TableCell>
                <TableCell className="text-center">{product.price}</TableCell>
                <TableCell className="flex justify-center">
                  {product.archived ? <Check /> : <X />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h2 className="text-xl">No products where found</h2>
      )}
    </>
  );
};