import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type selectImageSchemaType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const imageHref = (image?: selectImageSchemaType | null) => {
  if (!image) return "/no-image.svg";
  return `/images/${image.productId}/${image.id}.webp`;
};
