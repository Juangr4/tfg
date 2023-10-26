import { clsx, type ClassValue } from "clsx";
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { type z } from "zod";
import { type selectImageSchemaType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const imageHref = (image?: selectImageSchemaType | null) => {
  if (!image) return "/no-image.svg";
  return `/images/${image.productId}/${image.id}.webp`;
};

export const handleFormErrors = <T extends FieldValues>(
  error: z.inferFlattenedErrors<any>,
  form: UseFormReturn<T>
) => {
  const errors = error.fieldErrors;
  for (const key in errors) {
    const issues = errors[key];
    issues?.forEach((issue: string) => {
      form.setError(key as Path<T>, {
        type: "custom",
        message: issue,
      });
    });
  }
};
