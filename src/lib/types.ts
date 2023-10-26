import {
  categories,
  orders,
  productImages,
  products,
  reviews,
  userRoles,
  users,
} from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUserSchema = createSelectSchema(users);
export type selectUserSchemaType = z.infer<typeof selectUserSchema>;

export const selectUserSchemaWithoutPassword = selectUserSchema.omit({
  password: true,
});
export type selectUserSchemaWithoutPasswordType = z.infer<
  typeof selectUserSchemaWithoutPassword
>;

export const insertUserSchema = createInsertSchema(users);
export type insertUserSchemaType = z.infer<typeof insertUserSchema>;

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
  price: (schema) =>
    z.coerce.number().pipe(schema.price.gt(0).multipleOf(0.01)),
  // price: (schema) => schema.price.pipe(z.number().multipleOf(0.01).gte(0)),
  archived: (schema) => schema.archived.optional().default(false),
  categoryId: (schema) =>
    schema.categoryId.min(1, "Product must belong to a category"),
});
export type insertProductSchemaType = z.infer<typeof insertProductSchema>;

export const selectReviewSchema = createSelectSchema(reviews, {
  rate: (schema) => schema.rate.gte(0).lte(5),
});
export type selectReviewSchemaType = z.infer<typeof selectReviewSchema>;

export const insertReviewSchema = createInsertSchema(reviews, {
  rate: (schema) => z.coerce.number().pipe(schema.rate.min(0).max(5)),
});
export type insertReviewSchemaType = z.infer<typeof insertReviewSchema>;

export const selectImageSchema = createSelectSchema(productImages, {});
export type selectImageSchemaType = z.infer<typeof selectImageSchema>;

export const insertImageSchema = createInsertSchema(productImages, {});
export type insertImageSchemaType = z.infer<typeof insertImageSchema>;

export const selectOrderSchema = createSelectSchema(orders, {
  items: (schema) => z.unknown(),
});
export type selectOrderSchemaType = z.infer<typeof selectOrderSchema>;

export const insertOrderSchema = createInsertSchema(orders, {
  items: (schema) => z.unknown(),
});
export type insertOrderSchemaType = z.infer<typeof insertOrderSchema>;

export const cartItem = z.object({
  product: selectProductSchema,
  amount: z.number(),
});
export type cartItemType = z.infer<typeof cartItem>;
