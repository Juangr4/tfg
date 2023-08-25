import { categories, productImages, products, users } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUserSchema = createSelectSchema(users);
export type selectUserSchemaType = z.infer<typeof selectUserSchema>;

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
  price: (schema) => z.coerce.number().pipe(schema.price.positive()),
  archived: (schema) => schema.archived.optional().default(false),
  categoryId: (schema) =>
    schema.categoryId.min(1, "Product must belong to a category"),
}).omit({ createdAt: true, updatedAt: true });
export type insertProductSchemaType = z.infer<typeof insertProductSchema>;

export const insertImageSchema = createInsertSchema(productImages, {});
export type insertImageSchemaType = z.infer<typeof insertImageSchema>;
