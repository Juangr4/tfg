import { dbClient } from "@/db";
import { categories } from "@/db/schema";
import { insertCategorySchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const CategoryRouter = router({
  create: publicProcedure.input(insertCategorySchema).mutation(async (opts) => {
    const { input } = opts;

    const newCategories = await dbClient
      .insert(categories)
      .values(input)
      .returning();

    return newCategories[0];
  }),
  all: publicProcedure.query(async () => {
    return await dbClient.select().from(categories);
  }),
  find: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await dbClient.query.categories.findFirst({
      where: eq(categories.id, input),
    });
  }),
  update: publicProcedure
    .input(insertCategorySchema)
    .mutation(async ({ input }) => {
      if (!input.id) return;
      return (
        await dbClient
          .update(categories)
          .set(input)
          .where(eq(categories.id, input.id))
          .returning()
      )[0];
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return await dbClient
      .delete(categories)
      .where(eq(categories.id, input))
      .returning();
  }),
});
