import { dbClient } from "@/db";
import { products } from "@/db/schema";
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
    return await dbClient
      .delete(products)
      .where(eq(products.id, input))
      .returning();
  }),

  images: ImageRouter,
});
