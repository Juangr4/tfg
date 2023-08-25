import { dbClient } from "@/db";
import { productImages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const ImageRouter = router({
  uploadUrl: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const image = await dbClient.query.productImages.findFirst({
      where: and(
        eq(productImages.productId, input),
        eq(productImages.uploaded, false)
      ),
    });

    if (image) return image.id;

    // Return new image if everyone has been uploaded
    return (
      await dbClient
        .insert(productImages)
        .values({ productId: input })
        .returning()
    )[0].id;
  }),
  allHref: publicProcedure.input(z.string()).query(async ({ input }) => {
    const images = await dbClient
      .select()
      .from(productImages)
      .where(eq(productImages.productId, input));
    return images.map((image) => `/images/${image.productId}/${image.id}.webp`);
  }),
});
