import { dbClient } from "@/db";
import { reviews, users } from "@/db/schema";
import { insertReviewSchema } from "@/lib/types";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { loggedProcedure, publicProcedure, router } from "../trpc";

export const ReviewRouter = router({
  all: publicProcedure.input(z.string()).query(async ({ input: productId }) => {
    return await dbClient
      .select({
        id: reviews.id,
        rate: reviews.rate,
        message: reviews.message,
        title: reviews.title,
        createAt: reviews.createdAt,
        name: users.name,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .leftJoin(users, eq(users.id, reviews.userId));
  }),
  rating: publicProcedure
    .input(z.string())
    .query(async ({ input: productId }) => {
      const stats = await dbClient
        .select({
          sum: sql<number>`sum(${reviews.rate})`,
          count: sql<number>`count(${reviews.id})`,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));
      return stats[0];
    }),
  create: loggedProcedure
    .input(insertReviewSchema.omit({ userId: true }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.email) return;
      const user = await dbClient.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      });
      if (!user) return;
      const newReviews = await dbClient
        .insert(reviews)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
      return newReviews[0];
    }),
});
