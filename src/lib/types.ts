import {
  categories,
  productImages,
  products,
  userRoles,
  users,
} from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUserSchema = createSelectSchema(users);
export type selectUserSchemaType = z.infer<typeof selectUserSchema>;

export const userRolesSchema = z.enum(userRoles.enumValues);
export type userRolesSchemaType = z.infer<typeof userRolesSchema>;

export const selectCategorySchema = createSelectSchema(categories);
export type selectCategorySchemaType = z.infer<typeof selectCategorySchema>;

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(1),
}).omit({
  createdAt: true,
  updatedAt: true,
});
export type insertCategorySchemaType = z.infer<typeof insertCategorySchema>;

export const selectProductSchema = createSelectSchema(products);
export type selectProductSchemaType = z.infer<typeof selectProductSchema>;

export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(1),
  description: (schema) => schema.description.min(1),
  price: (schema) => z.coerce.number().pipe(schema.price.multipleOf(0.01)),
  archived: (schema) => schema.archived.optional().default(false),
  categoryId: (schema) =>
    schema.categoryId.min(1, "Product must belong to a category"),
}).omit({ createdAt: true, updatedAt: true });
export type insertProductSchemaType = z.infer<typeof insertProductSchema>;

export const selectImageSchema = createSelectSchema(productImages, {});
export type selectImageSchemaType = z.infer<typeof selectImageSchema>;

export const insertImageSchema = createInsertSchema(productImages, {});
export type insertImageSchemaType = z.infer<typeof insertImageSchema>;
