import { dbClient } from "@/db";
import { productImages, products } from "@/db/schema";
import { removeImageFolder } from "@/lib/file-manager";
import { insertProductSchema } from "@/lib/types";
import { and, eq, gte, ilike, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../trpc";
import { ImageRouter } from "./image";

export const ProductRouter = router({
  all: publicProcedure.query(async () => {
    return await dbClient.select().from(products);
  }),
  create: adminProcedure
    .input(insertProductSchema)
    .mutation(async ({ input }) => {
      return (await dbClient.insert(products).values(input).returning())[0];
    }),
  find: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await dbClient.query.products.findFirst({
      where: eq(products.id, input),
    });
  }),
  update: adminProcedure
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
  delete: adminProcedure.input(z.string()).mutation(async ({ input }) => {
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
        filters: z
          .object({
            searchQuery: z.string().optional(),
            categories: z.array(z.string()).optional(),
            minPrice: z.number().multipleOf(0.01).gte(0).optional(),
            maxPrice: z.number().multipleOf(0.01).positive().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      let query;
      if (input.filters) {
        query = and(
          eq(products.archived, false),
          input.filters.categories
            ? inArray(products.categoryId, input.filters.categories)
            : undefined,
          input.filters.searchQuery
            ? ilike(products.name, `%${input.filters.searchQuery}%`)
            : undefined,
          input.filters.minPrice
            ? gte(products.price, input.filters.minPrice)
            : undefined,
          input.filters.maxPrice
            ? lte(products.price, input.filters.maxPrice)
            : undefined
        );
      } else {
        query = eq(products.archived, false);
      }

      return await dbClient
        .selectDistinctOn([products.id], {
          product: products,
          image: productImages,
        })
        .from(products)
        .where(query)
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .limit(input.productsPerPage)
        .offset((input.page - 1) * input.productsPerPage);
    }),

  images: ImageRouter,
});
