"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type insertCategorySchemaType } from "@/lib/types";

import { type FC } from "react";
import { type UseFormReturn } from "react-hook-form";

interface GeneralFormFieldProps {
  form: UseFormReturn<insertCategorySchemaType>;
}

export const NameFormField: FC<GeneralFormFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Category name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
