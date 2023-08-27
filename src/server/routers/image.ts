import { dbClient } from "@/db";
import { productImages } from "@/db/schema";
import { removeImage } from "@/lib/file-manager";
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

    // Return new image if everyone has an image uploaded
    return (
      await dbClient
        .insert(productImages)
        .values({ productId: input })
        .returning()
    )[0].id;
  }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await dbClient.transaction(async (tx) => {
      const images = await tx
        .delete(productImages)
        .where(eq(productImages.id, input))
        .returning();

      for (const image of images) {
        await removeImage(image.productId, image.id);
      }
    });
  }),
  all: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await dbClient
      .select()
      .from(productImages)
      .where(
        and(
          eq(productImages.productId, input),
          eq(productImages.uploaded, true)
        )
      );
  }),
});
