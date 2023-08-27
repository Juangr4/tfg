import { dbClient } from "@/db";
import { productImages, products } from "@/db/schema";
import { removeImageFolder } from "@/lib/file-manager";
import { insertProductSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { ImageRouter } from "./image";

export const ProductRouter = router({
  all: publicProcedure.query(async () => {
    return await dbClient.select().from(products);
  }),
  create: publicProcedure
    .input(insertProductSchema)
    .mutation(async ({ input }) => {
      return (await dbClient.insert(products).values(input).returning())[0];
    }),
  find: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await dbClient.query.products.findFirst({
      where: eq(products.id, input),
    });
  }),
  update: publicProcedure
    .input(insertProductSchema)
    .mutation(async ({ input }) => {
      if (!input.id) return;
      return (
        await dbClient
          .update(products)
          .set(input)
          .where(eq(products.id, input.id))
          .returning()
      )[0];
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await dbClient.transaction(async (tx) => {
      const removedProducts = await dbClient
        .delete(products)
        .where(eq(products.id, input))
        .returning();

      for (const product of removedProducts) {
        await removeImageFolder(product.id);
      }
    });
  }),
  paged: publicProcedure
    .input(
      z.object({
        page: z.number().positive(),
        productsPerPage: z.number().default(12),
      })
    )
    .query(async ({ input }) => {
      return await dbClient
        .select({
          product: products,
          image: productImages,
        })
        .from(products)
        .where(eq(products.archived, false))
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .limit(input.productsPerPage)
        .offset((input.page - 1) * input.productsPerPage);
    }),

  images: ImageRouter,
});
