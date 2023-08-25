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
import { type insertCategorySchemaType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { NameFormField } from "./fields";

export const DialogCategoryForm = () => {
  const {
    data: category,
    mutate,
    isLoading,
  } = trpc.categories.create.useMutation();
  const form = useForm<insertCategorySchemaType>({
    defaultValues: category ?? {
      name: "",
    },
  });

  const onSubmit = (data: insertCategorySchemaType) => {
    mutate(data, {
      onSuccess: () => {
        location.reload();
      },
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
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Category</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Create a new category</DialogTitle>
              <DialogDescription>
                This will create a new category.
              </DialogDescription>
            </DialogHeader>
            <NameFormField form={form} />
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
