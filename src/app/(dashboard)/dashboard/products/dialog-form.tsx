"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { type insertProductSchemaType } from "@/lib/types";
import { handleFormErrors } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  ArchivedFormField,
  CategoryFormField,
  DescriptionFormField,
  NameFormField,
  PriceFormField,
} from "./fields";

export const DialogProductForm = () => {
  const { data: categories } = trpc.categories.all.useQuery();
  const { mutate, isLoading } = trpc.products.create.useMutation();
  const form = useForm<insertProductSchemaType>();

  const onSubmit = (data: insertProductSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        location.reload();
      },
      onError(error, variables, context) {
        if (!error.data?.zodError) return;
        handleFormErrors(error.data.zodError, form);
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Product</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Create a new product</DialogTitle>
              <DialogDescription>
                This will create a new product.
              </DialogDescription>
            </DialogHeader>
            <NameFormField form={form} />
            <DescriptionFormField form={form} />
            <PriceFormField form={form} />
            <ArchivedFormField form={form} />
            <CategoryFormField form={form} categories={categories ?? []} />
            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
